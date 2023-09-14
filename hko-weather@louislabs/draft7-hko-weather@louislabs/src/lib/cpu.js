'use strict';

const { Gio, GLib, Clutter, GObject, St, GTop } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Config = Me.imports.lib.config;
const Shared = Me.imports.lib.shared;
const Monitor = Me.imports.lib.monitor;
const FileModule = Me.imports.lib.file;
const _ = Config.Domain.gettext;
const ngettext = Config.Domain.ngettext;

class CPUUse {
  constructor(user = 0, sys = 0) {
    this.user = user;
    this.sys = sys;
  }

  computeFromIdle(userUsage, idleUsage) {
    this.user = userUsage;
    this.sys = 100 - userUsage - idleUsage;
  }

  total() {
    return this.user + this.sys;
  }

  copy() {
    return new CPUUse(this.user, this.sys);
  }
}

class ProcessCPUUse {
  constructor(pid = 0) {
    this.pid = pid;
    this.cmd = '';
    this.cpuTimeNow = 0;
    this.cpuTimePrev = 0;
  }

  updateTime(time) {
    this.cpuTimePrev = this.cpuTimeNow;
    this.cpuTimeNow = time.rtime;
    this.freq = time.frequency;
  }

  cpuTime() {
    return this.cpuTimeNow - this.cpuTimePrev;
  }

  cpuUsage() {
    if (this.freq === 0) {
      return 0;
    }
    return (
      ((this.cpuTime() / this.freq) * Shared.SECOND_AS_MILLISECONDS) /
      Config.UPDATE_INTERVAL_PROCLIST
    );
  }

  toString() {
    return `use: ${this.cpuUsage()} cmd: ${this.cmd} pid: ${this.pid}`;
  }
}

var CpuMonitor = GObject.registerClass(
  {
    Properties: {
      'show-cores': GObject.ParamSpec.boolean(
        'show-cores',
        'Show cores',
        'True if each CPU core should have its own bar',
        GObject.ParamFlags.READWRITE,
        true,
      ),
    },
  },
  class TopHatCpuMonitor extends Monitor.TopHatMonitor {
    _init(configHandler) {
      super._init(`${Me.metadata.name} CPU Monitor`);

      // Initialize libgtop values
      this.cpuCores = GTop.glibtop_get_sysinfo().ncpu;
      this.cpu = new GTop.glibtop_cpu();
      GTop.glibtop_get_cpu(this.cpu);
      this.cpuUsage = new CPUUse();
      this.cpuCoreUsage = new Array(this.cpuCores);
      this.cpuPrev = {
        user: this.cpu.user,
        idle: this.cpu.idle,
        total: this.cpu.total,
        xcpu_user: new Array(this.cpuCores),
        xcpu_idle: new Array(this.cpuCores),
        xcpu_total: new Array(this.cpuCores),
      };
      for (let i = 0; i < this.cpuCores; i++) {
        this.cpuPrev.xcpu_user[i] = this.cpu.xcpu_user[i];
        this.cpuPrev.xcpu_idle[i] = this.cpu.xcpu_idle[i];
        this.cpuPrev.xcpu_total[i] = this.cpu.xcpu_total[i];
        this.cpuCoreUsage[i] = new CPUUse();
      }
      this.history = new Array(0);
      this.processes = new Map();
      let f = new FileModule.File('/proc/cpuinfo');
      this.hasProc = f.exists();
      this.hasTemp = true; // will change to false if we can't read hwmon temperatures
      this.refreshChartsTimer = 0;
      this.refreshProcessesTimer = 0;

      let gicon = Gio.icon_new_for_string(
        `${Me.path}/icons/cpu-icon-symbolic.svg`,
      );
      this.icon = new St.Icon({
        gicon,
        style_class: 'system-status-icon tophat-panel-icon',
      });
      this.add_child(this.icon);

      configHandler.settings.bind(
        'show-cpu',
        this,
        'visible',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'refresh-rate',
        this,
        'refresh-rate',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'show-icons',
        this.icon,
        'visible',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'meter-bar-width',
        this,
        'meter-bar-width',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'meter-fg-color',
        this,
        'meter-fg-color',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'cpu-show-cores',
        this,
        'show-cores',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'show-animations',
        this,
        'show-animation',
        Gio.SettingsBindFlags.GET,
      );
      configHandler.settings.bind(
        'cpu-display',
        this,
        'visualization',
        Gio.SettingsBindFlags.GET,
      );

      let id = this.connect('notify::visible', () => {
        if (this.visible) {
          this._startTimers();
        } else {
          this._stopTimers();
        }
      });
      this._signals.push(id);
      id = this.connect('notify::refresh-rate', () => {
        this._stopTimers();
        this._startTimers();
      });
      this._signals.push(id);

      this._buildMeter();
      this._buildMenu();
      this._startTimers();
    }

    get show_cores() {
      if (this._show_cores === undefined) {
        this._show_cores = true;
      }
      return this._show_cores;
    }

    set show_cores(value) {
      if (this._show_cores === value) {
        return;
      }
      this._show_cores = value;
      this._buildMeter();
      this.notify('show-cores');
    }

    _startTimers() {
      // Clear the history chart and configure it for the current refresh rate
      this.history = [];
      let updateInterval = this.computeSummaryUpdateInterval(
        Config.UPDATE_INTERVAL_CPU,
      );
      this.historyLimit = (Config.HISTORY_MAX_SIZE * 1000) / updateInterval;

      if (this.refreshChartsTimer === 0) {
        this.refreshChartsTimer = GLib.timeout_add(
          GLib.PRIORITY_DEFAULT,
          updateInterval,
          () => this._refreshCharts(),
        );
      }
      if (this.refreshProcessesTimer === 0) {
        this.refreshProcessesTimer = GLib.timeout_add(
          GLib.PRIORITY_DEFAULT,
          this.computeDetailsUpdateInterval(Config.UPDATE_INTERVAL_PROCLIST),
          () => this._refreshProcesses(),
        );
      }
    }

    _stopTimers() {
      if (this.refreshChartsTimer !== 0) {
        GLib.source_remove(this.refreshChartsTimer);
        this.refreshChartsTimer = 0;
      }
      if (this.refreshProcessesTimer !== 0) {
        GLib.source_remove(this.refreshProcessesTimer);
        this.refreshProcessesTimer = 0;
      }
    }

    _buildMeter() {
      let numBars = 1;
      if (this.show_cores) {
        numBars = this.cpuCores;
      }
      this.setMeter(new Monitor.Meter(numBars, this.meter_bar_width));
    }

    _buildMenu() {
      // Create a grid layout for the history chart
      // let grid = new St.Widget({
      //   layout_manager: new Clutter.GridLayout({
      //     orientation: Clutter.Orientation.VERTICAL,
      //   }),
      // });

      this.historyChart = new St.DrawingArea();

      let label = new St.Label({
        text: _('香港天氣'),
        style_class: 'menu-header',
        style: 'font-weight: bold;',
      });
      this.addMenuRow(label, 0, 12, 1);

      let weather_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style: 'width: 60px; height: 60px;',
      });
      this.addMenuRow(weather_svg, 0, 12, 1);

      let temperature_box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let temperature_title = new St.Label({
        text: _('温度'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      temperature_box.add(temperature_title);

      let temperature_value = new St.Label({
        text: _('29°'),
        style_class: 'menu-label menu-section-end',
        style: 'font-size: 50px;',
      });
      temperature_box.add(temperature_value);

      this.addMenuRow(temperature_box, 0, 6, 1);

      let humidity_box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let humidity_title = new St.Label({
        text: _('濕度'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      humidity_box.add(humidity_title);

      let humidity_value = new St.Label({
        text: _('98'),
        style_class: 'menu-label menu-section-end',
        style: 'font-size: 50px;',
      });
      humidity_box.add(humidity_value);

      this.addMenuRow(humidity_box, 6, 6, 1);

      let forecast_box1 = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let forecast_day_1_title = new St.Label({
        text: _('29/Sep'),
        style_class: 'menu-label menu-section-end forecast-row',
        style: 'font-weight: bold; text-align: center;',
      });
      forecast_box1.add(forecast_day_1_title);

      let sample_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style: 'width: 60px; height: 60px;',
      });
      forecast_box1.add(sample_svg);

      let forecast_day_1_value = new St.Label({
        text: _('26'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      forecast_box1.add(forecast_day_1_value);

      this.addMenuRow(forecast_box1, 0, 4, 1);

      let forecast_box2 = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let forecast_day_2_title = new St.Label({
        text: _('30/Sep'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      forecast_box2.add(forecast_day_2_title);

      let forecast_day_2_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style: 'width: 60px; height: 60px;',
      });
      forecast_box2.add(forecast_day_2_svg);

      let forecast_day_2_value = new St.Label({
        text: _('26'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      forecast_box2.add(forecast_day_2_value);

      this.addMenuRow(forecast_box2, 4, 4, 1);

      let forecast_box3 = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let forecast_day_3_title = new St.Label({
        text: _('31/Sep'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      forecast_box3.add(forecast_day_3_title);

      let forecast_day_3_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style: 'width: 60px; height: 60px;',
      });
      forecast_box3.add(forecast_day_3_svg);

      let forecast_day_3_value = new St.Label({
        text: _('26'),
        style_class: 'menu-label menu-section-end',
        style: 'font-weight: bold; text-align: center;',
      });
      forecast_box3.add(forecast_day_3_value);

      this.addMenuRow(forecast_box3, 8, 4, 1);

      label = new St.Label({
        text: _('特別天氣提示'),
        style_class: 'menu-header',
        style: 'text-align: center; font-weight: bold;',
      });
      this.addMenuRow(label, 0, 12, 1);

      label = new St.Label({
        text: _(
          '雷雨區正影響香港東部地區，\n預料西貢及大埔區雨勢較大。\n市民應提高警惕。\n(12-09-2023 14:10) ',
        ),
        style_class: 'menu-header',
        style: 'max-width: 260px; line-break: anywhere; height: 100px',
      });
      this.addMenuRow(label, 0, 12, 1);

      label = new St.Label({
        text: _('內容由香港天文台提供'),
        style_class: 'menu-header',
        style: 'text-align: center',
      });
      this.addMenuRow(label, 0, 12, 1);
      this.menuUptime = new St.Label({
        text: '',
        style_class: 'menu-uptime menu-section-end',
      });
      this.addMenuRow(this.menuUptime, 0, 12, 1);

      label = new St.Label({
        text: _('source'),
        style_class: 'menu-header',
        style: 'text-align: center',
      });
      this.addMenuRow(label, 0, 12, 1);

      // this.buildMenuButtons();
    }


    refresh() {
      this._refreshCharts();
      this._refreshProcesses();
    }

    _refreshCharts() {
      GTop.glibtop_get_cpu(this.cpu);

      // Total CPU usage
      let userDelta = this.cpu.user - this.cpuPrev.user;
      let idleDelta = this.cpu.idle - this.cpuPrev.idle;
      let totalDelta = this.cpu.total - this.cpuPrev.total;
      let idleUsage = Math.round((100 * idleDelta) / totalDelta);
      let userUsage = Math.round((100 * userDelta) / totalDelta);
      this.cpuUsage.computeFromIdle(userUsage, idleUsage);

      // Per-core CPU usage
      for (let i = 0; i < this.cpuCores; i++) {
        userDelta = this.cpu.xcpu_user[i] - this.cpuPrev.xcpu_user[i];
        idleDelta = this.cpu.xcpu_idle[i] - this.cpuPrev.xcpu_idle[i];
        totalDelta = this.cpu.xcpu_total[i] - this.cpuPrev.xcpu_total[i];
        let coreIdleUsage = Math.round((100 * idleDelta) / totalDelta);
        let coreUserUsage = Math.round((100 * userDelta) / totalDelta);
        this.cpuCoreUsage[i].computeFromIdle(coreUserUsage, coreIdleUsage);
      }

      // Save values
      this.cpuPrev.user = this.cpu.user;
      this.cpuPrev.idle = this.cpu.idle;
      this.cpuPrev.total = this.cpu.total;
      for (let i = 0; i < this.cpuCores; i++) {
        this.cpuPrev.xcpu_user[i] = this.cpu.xcpu_user[i];
        this.cpuPrev.xcpu_idle[i] = this.cpu.xcpu_idle[i];
        this.cpuPrev.xcpu_total[i] = this.cpu.xcpu_total[i];
      }
      while (this.history.length >= this.historyLimit) {
        this.history.shift();
      }
      this.history.push(this.cpuUsage.copy());

      // Update UI
      // log(`[TopHat] CPU: ${this.cpuUsage}% on ${this.cpuCores} cores (${this.cpuCoreUsage.join()})`);
      let cpuTotal = this.cpuUsage.total();
      this.usage.text = `${cpuTotal}%`;

      if (cpuTotal < 1) {
        cpuTotal = '< 1';
      }
      this.menuCpuUsage.text = `${cpuTotal}%`;
      this.historyChart.queue_repaint();

      // Update panel meter
      let usage = [];
      if (this.show_cores) {
        usage = new Array(this.cpuCores);
        for (let i = 0; i < this.cpuCores; i++) {
          usage[i] = this.cpuCoreUsage[i].total();
        }
      } else {
        usage = [this.cpuUsage.total()];
      }
      this.meter.setUsage(usage);

      if (this.hasProc) {
        this._readCPUInfo();
      }

      return true;
    }

    _readCPUInfo() {
      new FileModule.File('/proc/cpuinfo')
        .read()
        .then(lines => {
          let values = '';
          let cpuInfo = new Map();
          let blocks = lines.split('\n\n');
          for (const block of blocks) {
            let id,
              freq = 0,
              model = '';
            if ((values = block.match(/physical id\s*:\s*(\d+)/))) {
              id = parseInt(values[1]);
            }
            let info = cpuInfo.get(id);
            if (info === undefined) {
              info = { id, freq: 0, cores: 0, model: '' };
            }
            info.cores += 1;

            if ((values = block.match(/cpu MHz\s*:\s*(\d+)/))) {
              freq = parseInt(values[1]);
              info.freq += freq;
            }
            if ((values = block.match(/model name\s*:\s*(.+)\n/))) {
              model = values[1];
              info.model = model;
            }

            cpuInfo.set(id, info);
          }
          if (this.menuCpuFreqs && this.menuCpuModels) {
            cpuInfo.forEach(info => {
              if (this.menuCpuModels[info.id] !== undefined) {
                this.menuCpuModels[info.id].text = info.model;
              }
              if (this.menuCpuFreqs[info.id] !== undefined) {
                this.menuCpuFreqs[info.id].text = `${(
                  info.freq /
                  info.cores /
                  1000
                ).toFixed(1)} GHz`;
              }
            });
          }
        })
        .catch(err => {
          log(`[${Me.metadata.name}] Error reading /proc/cpuinfo: ${err}`);
          this.hasProc = false;
        });
    }

    _readCPUTemps() {
      this.cpuTempMonitors.forEach((path, id) => {
        new FileModule.File(path)
          .read()
          .then(temp => {
            temp = parseInt(temp);
            this.menuCpuTemps[id].text = `${(temp / 1000).toFixed(0)} °C`;
          })
          .catch(err => {
            log(`[${Me.metadata.name}] Error reading ${path}: ${err}`);
            this.hasTemp = false;
          });
      });
    }

    _refreshProcesses() {
      // Build list of N most CPU-intensive processes
      let processes = Shared.getProcessList();

      let updatedProcesses = new Map();
      processes.forEach(pid => {
        let procInfo = this.processes.get(pid);
        if (procInfo === undefined) {
          procInfo = new ProcessCPUUse(pid);
          procInfo.cmd = Shared.getProcessName(pid);
        }

        if (procInfo.cmd) {
          let time = new GTop.glibtop_proc_time();
          GTop.glibtop_get_proc_time(time, pid);
          procInfo.updateTime(time);
          updatedProcesses.set(pid, procInfo);
        }
      });
      this.processes = updatedProcesses;

      // Get the top processes by CPU usage
      let procList = new Array(0);
      this.processes.forEach(e => {
        if (e.cpuTime() > 0) {
          procList.push(e);
        }
      });
      procList.sort((a, b) => {
        return b.cpuTime() - a.cpuTime();
      });
      procList = procList.slice(0, Config.N_TOP_PROCESSES);
      while (procList.length < Config.N_TOP_PROCESSES) {
        // If we don't have at least N_TOP_PROCESSES active, fill out
        // the array with empty ones
        procList.push(new ProcessCPUUse());
      }
      for (let i = 0; i < Config.N_TOP_PROCESSES; i++) {
        this.topProcesses[i].cmd.text = procList[i].cmd;
        let cpuUse = '';
        if (procList[i].cmd) {
          cpuUse = (procList[i].cpuUsage() * 100) / this.cpuCores;
          if (cpuUse < 1) {
            cpuUse = '< 1';
            // cpuUse = cpuUse.toFixed(2);
          } else {
            cpuUse = Math.round(cpuUse);
          }
          cpuUse += '%';
        }
        this.topProcesses[i].usage.text = cpuUse;
      }

      // Also fetch latest CPU temperature
      if (this.hasTemp && this.cpuTempMonitors.size > 0) {
        this._readCPUTemps();
      }

      // Also get the system's uptime
      this._readSystemUptime();

      return true;
    }

    _readSystemUptime() {
      let uptime = new GTop.glibtop_uptime();
      GTop.glibtop_get_uptime(uptime);
      let days = 0,
        hours = 0,
        mins = 0;
      mins = Math.floor((uptime.uptime % 3600) / 60);
      hours = Math.floor((uptime.uptime % 86400) / 3600);
      days = Math.floor(uptime.uptime / 86400);
      let parts = [];
      if (days > 0) {
        parts.push(ngettext('%d day', '%d days', days).format(days));
      }
      if (days > 0 || hours > 0) {
        parts.push(ngettext('%d hour', '%d hours', hours).format(hours));
      }
      parts.push(ngettext('%d minute', '%d minutes', mins).format(mins));
      this.menuUptime.text = parts.join(' ');
    }

    destroy() {
      this._stopTimers();
      Gio.Settings.unbind(this, 'visible');
      Gio.Settings.unbind(this, 'refresh-rate');
      Gio.Settings.unbind(this.icon, 'visible');
      Gio.Settings.unbind(this, 'meter-fg-color');
      Gio.Settings.unbind(this, 'meter-bar-width');
      Gio.Settings.unbind(this, 'show-cores');
      Gio.Settings.unbind(this, 'show-animation');
      Gio.Settings.unbind(this, 'visualization');
      super.destroy();
    }
  },
);

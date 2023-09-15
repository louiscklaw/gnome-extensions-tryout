'use strict';

const { Atk, Gio, GLib, Clutter, GObject, St, GTop, Shell } = imports.gi;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

const Util = imports.misc.util;

let Cpu = null;
let Container = null;

const MENU_COLUMNS = 12;

var TopHatMonitor = GObject.registerClass(
  {
    Signals: { 'menu-set': {} },
  },
  class TopHatMonitorBase extends St.Widget {
    _init(name) {
      super._init({
        reactive: true,
        can_focus: true,
        track_hover: true,
        style_class: 'tophat-monitor panel-button',
        accessible_name: name,
        accessible_role: Atk.Role.MENU,
        x_expand: true,
        y_expand: true,
      });
      this.name = name;
      this._delegate = this;
      this._signals = [];

      let hbox = new St.BoxLayout();
      this.add_child(hbox);
      this.box = hbox;
      this.meter = null;
      this.usage = null;
      this.activityBox = null;

      this.connect('style-changed', this._onStyleChanged.bind(this));
      this.connect('destroy', this._onDestroy.bind(this));

      this._minHPadding = this._natHPadding = 0.0;

      this.setMenu(new PopupMenu.PopupMenu(this, 0.5, St.Side.TOP, 0));
      this.buildMenuBase();
    }

    refresh() {
      // Override this in child classes to refresh resource consumption/activity
    }

    setMenu(menu) {
      if (this.menu) {
        this.menu.destroy();
      }

      this.menu = menu;
      if (this.menu) {
        this.menu.actor.add_style_class_name('panel-menu');
        this.menu.connect(
          'open-state-changed',
          this._onOpenStateChanged.bind(this),
        );
        this.menu.actor.connect(
          'key-press-event',
          this._onMenuKeyPress.bind(this),
        );

        Main.uiGroup.add_actor(this.menu.actor);
        this.menu.actor.hide();
      }
      this.emit('menu-set');
    }

    buildMenuBase() {
      if (!this.menu) {
        return;
      }

      let statusMenu = new PopupMenu.PopupMenuSection();
      let grid = new St.Widget({
        style_class: 'menu-grid',
        layout_manager: new Clutter.GridLayout({
          orientation: Clutter.Orientation.VERTICAL,
        }),
      });
      this.lm = grid.layout_manager;
      this.menuRow = 0;
      this.menuCol = 0;
      this.numMenuCols = MENU_COLUMNS;
      statusMenu.box.add_child(grid);
      this.menu.addMenuItem(statusMenu);
    }

    buildMenuButtons() {
      if (!this.menu) {
        return;
      }

      let box = new St.BoxLayout({
        style_class: 'tophat-menu-button-box',
        x_align: Clutter.ActorAlign.CENTER,
        reactive: true,
        x_expand: true,
      });

      // System Monitor
      let appSys = Shell.AppSystem.get_default();
      let app = appSys.lookup_app('gnome-system-monitor.desktop');
      if (app) {
        let button = new St.Button({ style_class: 'button' });
        button.child = new St.Icon({
          icon_name: 'utilities-system-monitor-symbolic',
          fallback_icon_name: 'org.gnome.SystemMonitor-symbolic',
        });

        button.connect('clicked', () => {
          this.menu.close(true);
          app.activate();
        });
        box.add_child(button);
      }

      // TopHat preferences
      let button = new St.Button({ style_class: 'button' });
      button.child = new St.Icon({
        icon_name: 'preferences-system-symbolic',
      });
      button.connect('clicked', () => {
        this.menu.close(true);
        try {
          if (ExtensionUtils && ExtensionUtils.openPrefs) {
            ExtensionUtils.openPrefs();
          } else {
            Util.spawn(['gnome-shell-extension-prefs', Me.metadata.uuid]);
          }
        } catch (err) {
          log(`[${Me.metadata.name}] Error opening settings: ${err}`);
        }
      });
      box.add_child(button);

      this.addMenuRow(box, 0, this.numMenuCols, 1);
    }

    addMenuRow(widget, col, colSpan, rowSpan) {
      this.lm.attach(widget, col, this.menuRow, colSpan, rowSpan);
      this.menuCol += colSpan;
      if (this.menuCol >= this.numMenuCols) {
        this.menuRow++;
        this.menuCol = 0;
      }
    }

    add_child(child) {
      if (this.box) {
        this.box.add_child(child);
      } else {
        super.add_child(child);
      }
    }

    vfunc_event(event) {
      if (
        this.menu &&
        (event.type() === Clutter.EventType.TOUCH_BEGIN ||
          event.type() === Clutter.EventType.BUTTON_PRESS)
      ) {
        this.menu.toggle();
      }

      return Clutter.EVENT_PROPAGATE;
    }

    vfunc_hide() {
      super.vfunc_hide();

      if (this.menu) {
        this.menu.close();
      }
    }

    _onMenuKeyPress(actor, event) {
      if (global.focus_manager.navigate_from_event(event)) {
        return Clutter.EVENT_STOP;
      }

      let symbol = event.get_key_symbol();
      if (symbol === Clutter.KEY_Left || symbol === Clutter.KEY_Right) {
        let group = global.focus_manager.get_group(this);
        if (group) {
          let direction =
            symbol === Clutter.KEY_Left
              ? St.DirectionType.LEFT
              : St.DirectionType.RIGHT;
          group.navigate_focus(this, direction, false);
          return Clutter.EVENT_STOP;
        }
      }
      return Clutter.EVENT_PROPAGATE;
    }

    _onOpenStateChanged(menu, open) {
      if (open) {
        this.add_style_pseudo_class('active');
      } else {
        this.remove_style_pseudo_class('active');
      }

      // Setting the max-height won't do any good if the minimum height of the
      // menu is higher then the screen; it's useful if part of the menu is
      // scrollable so the minimum height is smaller than the natural height
      let workArea = Main.layoutManager.getWorkAreaForMonitor(
        Main.layoutManager.primaryIndex,
      );
      let scaleFactor = St.ThemeContext.get_for_stage(
        global.stage,
      ).scale_factor;
      let verticalMargins =
        this.menu.actor.margin_top + this.menu.actor.margin_bottom;

      // The workarea and margin dimensions are in physical pixels, but CSS
      // measures are in logical pixels, so make sure to consider the scale
      // factor when computing max-height
      let maxHeight = Math.round(
        (workArea.height - verticalMargins) / scaleFactor,
      );
      this.menu.actor.style = `max-height: ${maxHeight}px;`;
    }

    _onStyleChanged(actor) {
      let themeNode = actor.get_theme_node();

      this._minHPadding = themeNode.get_length('-minimum-hpadding');
      this._natHPadding = themeNode.get_length('-natural-hpadding');
    }

    vfunc_get_preferred_width(_forHeight) {
      let child = this.get_first_child();
      let minimumSize, naturalSize;

      if (child) {
        [minimumSize, naturalSize] = child.get_preferred_width(-1);
      } else {
        minimumSize = naturalSize = 0;
      }

      minimumSize += 2 * this._minHPadding;
      naturalSize += 2 * this._natHPadding;

      return [minimumSize, naturalSize];
    }

    vfunc_get_preferred_height(_forWidth) {
      let child = this.get_first_child();

      if (child) {
        return child.get_preferred_height(-1);
      }

      return [0, 0];
    }

    vfunc_allocate(box) {
      this.set_allocation(box);

      let child = this.get_first_child();
      if (!child) {
        return;
      }

      let [, natWidth] = child.get_preferred_width(-1);

      let availWidth = box.x2 - box.x1;
      let availHeight = box.y2 - box.y1;

      let childBox = new Clutter.ActorBox();
      if (natWidth + 2 * this._natHPadding <= availWidth) {
        childBox.x1 = this._natHPadding;
        childBox.x2 = availWidth - this._natHPadding;
      } else {
        childBox.x1 = this._minHPadding;
        childBox.x2 = availWidth - this._minHPadding;
      }

      childBox.y1 = 0;
      childBox.y2 = availHeight;

      child.allocate(childBox);
    }

    _onDestroy() {
      if (this.menu) {
        this.menu.destroy();
      }
      if (this.meter) {
        this.meter.destroy();
      }
      this._signals.forEach(id => this.disconnect(id));
      this._signals = [];
    }
  },
);

var CpuMonitor = GObject.registerClass(
  {},
  class TopHatCpuMonitor extends TopHatMonitor {
    _init() {
      super._init(`${Me.metadata.name} CPU Monitor`);

      let gicon = Gio.icon_new_for_string(
        `${Me.path}/icons/cpu-icon-symbolic.svg`,
      );
      this.icon = new St.Icon({
        gicon,
        style_class: 'system-status-icon tophat-panel-icon',
      });
      this.add_child(this.icon);

      this._buildMenu();
    }

    _buildMenu() {
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

    destroy() {
      super.destroy();
    }
  },
);

var TopHatContainer = GObject.registerClass(
  class TopHatContainer extends PanelMenu.Button {
    _init() {
      super._init();
      this.box = new St.BoxLayout();
      this.add_child(this.box);
    }

    addMonitor(monitor) {
      this.box.add_child(monitor);
    }

    _onDestroy() {
      this.monitors.forEach(monitor => {
        monitor.destroy();
      });
      super._onDestroy();
    }
  },
);

// Declare `tophat` in the scope of the whole script so it can
// be accessed in both `enable()` and `disable()`
let tophat = null;

class TopHat {
  constructor() {
    this.container = new TopHatContainer();

    this.cpu = new CpuMonitor();
    this.container.addMonitor(this.cpu);
  }

  addToPanel() {
    Main.panel.addToStatusArea('HkoWeatherPanel', this.container);
  }

  destroy() {
    this.container.destroy();
    this.configHandler.destroy();
  }
}

function init() {
  ExtensionUtils.initTranslations();
}

function enable() {
  tophat = new TopHat();
  tophat.addToPanel();
}

function disable() {
  if (tophat !== null) {
    tophat.destroy();
    tophat = null;
  }
}

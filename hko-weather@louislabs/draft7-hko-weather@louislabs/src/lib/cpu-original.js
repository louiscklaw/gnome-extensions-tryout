
label = new St.Label({
  text: '100%',
  y_align: Clutter.ActorAlign.START,
  style_class: 'chart-label',
});
this.historyGrid.attach(label, 2, 0, 1, 1);
label = new St.Label({
  text: '50%',
  y_align: Clutter.ActorAlign.CENTER,
  style_class: 'chart-label',
});
this.historyGrid.attach(label, 2, 1, 1, 1);
label = new St.Label({
  text: '0',
  y_align: Clutter.ActorAlign.END,
  style_class: 'chart-label',
});
this.historyGrid.attach(label, 2, 2, 1, 1);

// let limitInMins = Config.HISTORY_MAX_SIZE / 60;
// let startLabel = ngettext(
//   '%d min ago',
//   '%d mins ago',
//   limitInMins,
// ).format(limitInMins);
// label = new St.Label({
//   text: startLabel,
//   style_class: 'chart-label-then',
// });
// this.historyGrid.attach(label, 0, 3, 1, 1);
// label = new St.Label({ text: _('now'), style_class: 'chart-label-now' });
// this.historyGrid.attach(label, 1, 3, 1, 1);

// label = new St.Label({
//   text: _('Top processes'),
//   style_class: 'menu-header',
// });
// this.addMenuRow(label, 0, 2, 1);

this.topProcesses = [];
for (let i = 0; i < Config.N_TOP_PROCESSES; i++) {
  let cmd = new St.Label({ text: '', style_class: 'menu-cmd-name' });
  this.addMenuRow(cmd, 0, 1, 1);
  let style = 'menu-cmd-usage';
  if (i === Config.N_TOP_PROCESSES - 1) {
    style = 'menu-cmd-usage menu-section-end';
  }
  let usage = new St.Label({ text: '', style_class: style });
  this.addMenuRow(usage, 1, 1, 1);
  let p = new Shared.TopProcess(cmd, usage);
  this.topProcesses.push(p);
}

label = new St.Label({
  text: _('System uptime'),
  style_class: 'menu-header',
});
this.addMenuRow(label, 0, 2, 1);
this.menuUptime = new St.Label({
  text: '',
  style_class: 'menu-uptime menu-section-end',
});
this.addMenuRow(this.menuUptime, 0, 2, 1);

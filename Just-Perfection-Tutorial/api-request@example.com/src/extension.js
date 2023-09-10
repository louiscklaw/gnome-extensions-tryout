const { St, GLib, Clutter } = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

let panelButton, panelButtonText, timeout;

function setButtonText() {
  var arr = [];

  arr.push('api-request@example.com');
  panelButtonText.set_text(arr.join(' '));

  return true;
}

function init() {
  panelButton = new St.Bin({
    style_class: 'panel-button',
  });
  panelButtonText = new St.Label({
    style_class: 'examplePanelTextBlaBlaBla',
    text: 'Starting ...',
    y_align: Clutter.ActorAlign.CENTER,
  });
  panelButton.set_child(panelButtonText);
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(panelButton, 1);
  timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
}

function disable() {
  Mainloop.source_remove(timeout);
  Main.panel._rightBox.remove_child(panelButton);
}

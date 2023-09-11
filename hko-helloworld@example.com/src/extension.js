const { St, GLib, Clutter } = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
// const helloworld = Extension.imports.helloworld;

let panelButton, panelButtonText, timeout;

function setButtonText() {
  var arr = [];
  try {
    arr.push('hko-weather@louislabs.com');
    panelButtonText.set_text(arr.join(' '));
  } catch (error) {
    console.log(error.message);
  }
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

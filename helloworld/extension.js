const St = imports.gi.St;

const Main = imports.ui.main;
let panelButton, panelButtonText;

function init() {
  panelButton = new St.Bin({
    style_class: "panel-button",
  });

  panelButtonText = new St.Label({
    style_class: "examplePanelText",

    text: "Starting 開始中...",
  });

  panelButton.set_child(panelButtonText);
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(panelButton, 1);
}

function disable() {
  Main.panel._rightBox.remove_child(panelButton);
}

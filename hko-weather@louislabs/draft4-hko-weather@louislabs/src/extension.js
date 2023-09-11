const { Clutter, Gio, Gtk, GLib, GObject, St } = imports.gi;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

let myPopup;
let size = 100;
let topBox, panelButtonText;

const MyPopup = GObject.registerClass(
  class MyPopup extends PanelMenu.Button {
    _init() {
      super._init(0);

      this._hkoLogo = new St.Icon({
        //icon_name : 'security-low-symbolic',
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/media' + '/icon.svg',
        ),
        style_class: 'system-status-icon',
      });
      this._weatherIcon = new St.Icon({
        icon_name: 'view-refresh-symbolic',
        style_class: 'system-status-icon openweather-icon',
      });
      this._weatherInfo = new St.Label({
        style_class: 'openweather-label',
        text: _('Loading'),
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });
      let topBox = new St.BoxLayout({
        style_class: 'panel-status-menu-box',
      });

      topBox.add_child(this._hkoLogo);
      topBox.add_child(this._weatherIcon);
      topBox.add_child(this._weatherInfo);
      this.add_child(topBox);
      
    }
  },
);


function init() {}

function enable() {
  myPopup = new MyPopup();
  Main.panel.addToStatusArea('myPopup', myPopup);
}

function disable() {
  myPopup.destroy();
}

const { Atk, Clutter, GLib, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;

const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const MENU_COLUMNS = 2;
const ANIMATION_DURATION = 500;

let myPopup;

const MyPopup = GObject.registerClass(
  class MyPopup extends PanelMenu.Button {
    _init() {
      super._init(0.5);

      // control status bar icon
      this._hkoLogo = new St.Icon({
        //icon_name : 'security-low-symbolic',
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style_class: 'system-status-icon',
      });
      this._weatherIcon = new St.Icon({
        icon_name: 'view-refresh-symbolic',
        style_class: 'system-status-icon openweather-icon',
      });
      this._weatherInfo = new St.Label({
        style_class: 'openweather-label',
        text: 'Loading',
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });

      let topBox = new St.BoxLayout({
        // style_class: 'panel-status-menu-box',
      });

      topBox.add_child(this._hkoLogo);
      topBox.add_child(this._weatherIcon);
      topBox.add_child(this._weatherInfo);
      this.add_child(topBox);
      // control status bar icon

      // version
      // this._versionRow = new PopupMenu.PopupBaseMenuItem({
      //   reactive: false,
      // });
      // let version_box = new St.BoxLayout({
      //   x_expand: true,
      //   style_class: 'version-box',
      // });
      // version_box.add_actor(
      //   new St.Label({
      //     text: ' 資料內容由香港天文台提供 ',
      //     style_class: 'version-box-title',
      //     x_expand: true,
      //     x_align: Clutter.ActorAlign.CENTER,
      //   }),
      // );

      // this._versionRow.actor.add_child(version_box);
      // this.menu.addMenuItem(this._versionRow);
      // version

      let layout = new Clutter.BinLayout();
      let bin = new St.Widget({ 
        style:"background-color: red;" ,
        x_align: Clutter.ActorAlign.CENTER,
      });
      bin.add_actor(
        new St.Label({
          text: ' 資料內容由香港天文台提供 ',
          x_expand: true,
          
        }),
      );
      this.menu.box.add_child(bin);

      this.menu.connect('open-state-changed', (menu, open) => {
        if (open) {
          log('opened');
        } else {
          log('closed');
        }
      });

    }
  },
);

function init() {}

function enable() {
  tophat_monitor_test = new MyPopup();
  Main.panel.addToStatusArea('myPopup', tophat_monitor_test);
}

function disable() {
  myPopup.destroy();
}

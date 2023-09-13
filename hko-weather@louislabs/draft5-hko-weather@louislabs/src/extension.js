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
      this._weather_icon_svg = new St.Icon({
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

      topBox.add_child(this._weather_icon_svg);
      topBox.add_child(this._weatherIcon);
      topBox.add_child(this._weatherInfo);
      this.add_child(topBox);
      // control status bar icon

      // weather_svg_widget
      this._weather_icon_svg = new St.Icon({
        //icon_name : 'security-low-symbolic',
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style_class: 'system-status-icon',
      });
      let weather_svg_widget = new St.Widget({
        style: '',
        x_align: Clutter.ActorAlign.CENTER,
      });
      weather_svg_widget.add_actor(this._weather_icon_svg);
      this.menu.box.add_child(weather_svg_widget);
      // weather_svg_widget

      // weather_report_label_widget
      let weather_report_label_box = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
      });
      weather_report_label_box.add_actor(
        new St.Label({
          text: '天氣報告',
        }),
      );
      this.menu.box.add_child(weather_report_label_box);
      // weather_report_label_widget

      // last_update_label_widget
      let last_update_label_box = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        // style_class: 'openweather-current-iconbox',
      });
      last_update_label_box.add_actor(
        new St.Label({
          text: '03:00 更新',
          // style_class: 'openweather-current-summary',
        }),
      );
      this.menu.box.add_child(last_update_label_box);
      // last_update_label_widget

      



      // widget-footer
      let bin = new St.Widget({
        style: '',
        x_align: Clutter.ActorAlign.CENTER,
      });
      bin.add_actor(
        new St.Label({
          text: ' 資料內容由香港天文台提供 ',
          x_expand: true,
        }),
      );
      this.menu.box.add_child(bin);
      // widget-footer

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

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

      // current_weather_widget
      let current_weather_widget = new St.Widget({
        style: '',
        x_align: Clutter.ActorAlign.CENTER,
      });

      // current_weather -> temperature
      let current_weather_box = new St.BoxLayout({
        x_expand: true,
      });

      let current_weather_temperature = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.START,
      });

      current_weather_temperature.add_actor(
        new St.Label({
          text: 'Temperature',
          style: 'font-weight: bold; padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      current_weather_temperature.add_actor(
        new St.Label({
          text: '26°C',
          style:
            'font-size: 40px; padding-top: 10px; padding-bottom: 10px; color: #ecf0f1',
        }),
      );

      current_weather_box.add_actor(current_weather_temperature);
      // current_weather -> temperature

      // current_weather -> humidity
      let current_weather_humidity = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.END,
      });

      current_weather_humidity.add_actor(
        new St.Label({
          text: 'Humidity:',
          style: 'font-weight: bold; padding-top: 10px; padding-bottom: 10px;',
        }),
      );

      current_weather_humidity.add_actor(
        new St.Label({
          text: '98%',
          style:
            'font-size: 40px; padding-top: 10px; padding-bottom: 10px; color: #ecf0f1',
        }),
      );
      // current_weather -> humidity

      current_weather_widget.add_actor(current_weather_box);

      current_weather_box.add_actor(current_weather_humidity);

      this.menu.box.add_child(current_weather_widget);
      // current_weather_widget

      // forecast_widget
      let forecast_widget = new St.Widget({
        // style: 'background-color: gold;',
        x_expand: true,
      });

      // weather_forecast -> day 1
      let forecast_boxes = new St.BoxLayout({
        // style: 'background-color: gold;',
        x_expand: true,
      });
      let weather_forecast_day1 = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.START,
      });

      weather_forecast_day1.add_actor(
        new St.Label({
          text: '1/Sep',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      weather_forecast_day1.add_actor(
        new St.Icon({
          icon_size: 32,
          gicon: Gio.icon_new_for_string(
            Me.dir.get_path() + '/svgs/weather/clear-day.svg',
          ),
          y_expand: true,
          y_align: Clutter.ActorAlign.CENTER,
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      weather_forecast_day1.add_actor(
        new St.Label({
          text: '26°C',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      forecast_boxes.add_actor(weather_forecast_day1);
      // weather_forecast -> day 1

      // weather_forecast -> day 2
      let weather_forecast_day2 = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
      });

      weather_forecast_day2.add_actor(
        new St.Label({
          text: '1/Sep',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      weather_forecast_day2.add_actor(
        new St.Icon({
          icon_size: 32,
          gicon: Gio.icon_new_for_string(
            Me.dir.get_path() + '/svgs/weather/clear-day.svg',
          ),
          y_expand: true,
          y_align: Clutter.ActorAlign.CENTER,
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      weather_forecast_day2.add_actor(
        new St.Label({
          text: '26°C',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      forecast_boxes.add_actor(weather_forecast_day2);
      // weather_forecast -> day 2

      // weather_forecast -> day 3
      let weather_forecast_day3 = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.END,
      });

      weather_forecast_day3.add_actor(
        new St.Label({
          text: '1/Sep',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      weather_forecast_day3.add_actor(
        new St.Icon({
          icon_size: 32,
          gicon: Gio.icon_new_for_string(
            Me.dir.get_path() + '/svgs/weather/clear-day.svg',
          ),
          y_expand: true,
          y_align: Clutter.ActorAlign.CENTER,
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      weather_forecast_day3.add_actor(
        new St.Label({
          text: '26°C',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      forecast_boxes.add_actor(weather_forecast_day3);
      // weather_forecast -> day 3

      forecast_widget.actor.add_child(forecast_boxes);
      this.menu.box.add_child(forecast_widget);
      // forecast_widget

      // footer_widget
      let bin = new St.Widget({
        style: '',
        x_align: Clutter.ActorAlign.CENTER,
      });
      bin.add_actor(
        new St.Label({
          style: 'font-size: 10px; ',
          text: ' 資料內容由香港天文台提供 ',
          x_expand: true,
        }),
      );
      this.menu.box.add_child(bin);
      // footer_widget

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

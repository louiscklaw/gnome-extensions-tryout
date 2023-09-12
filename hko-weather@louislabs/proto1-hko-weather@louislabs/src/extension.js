const Main = imports.ui.main;
const St = imports.gi.St;
const GObject = imports.gi.GObject;
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let myPopup;

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
        text: 'Loading',
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

      this._currentWeatherIcon = new St.Icon({
        icon_size: 128,
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/media' + '/icon.svg',
        ),
        style_class: 'test-center',
        y_expand: true,
        y_align: Clutter.ActorAlign.CENTER,
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
      });
      this._currentWeather = new PopupMenu.PopupBaseMenuItem({
        style_class: 'popup-base-menu-item',
        reactive: false,
      });
      let box = new St.BoxLayout({
        x_expand: true,
        // style_class: 'openweather-current-iconbox',
      });
      box.add_actor(this._currentWeatherIcon);
      this._currentWeather.actor.add_child(box);
      this.menu.addMenuItem(this._currentWeather);



      // current_weather
      this._temperature_forecast_list = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
        style_class: 'temperature-list',
      });

      // current_weather -> temperature
      let tomorrow_box = new St.BoxLayout({
        x_expand: true,
      });
      let current_weather_temperature = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.START,
      });

      current_weather_temperature.add_actor(
        new St.Label({
          text: '1/Sep',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      current_weather_temperature.add_actor(
        new St.Icon({
          icon_size: 32,
          gicon: Gio.icon_new_for_string(
            Me.dir.get_path() + '/media' + '/icon.svg',
          ),
          y_expand: true,
          y_align: Clutter.ActorAlign.CENTER,
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      current_weather_temperature.add_actor(
        new St.Label({
          text: '26°C',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      // current_weather -> temperature

      // current_weather -> humidity
      let current_weather_humidity = new St.BoxLayout({
        vertical: true,
        x_expand: true,
        x_align: Clutter.ActorAlign.END,
      });

      current_weather_humidity.add_actor(
        new St.Label({
          text: '1/Sep',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      current_weather_humidity.add_actor(
        new St.Icon({
          icon_size: 32,
          gicon: Gio.icon_new_for_string(
            Me.dir.get_path() + '/media' + '/icon.svg',
          ),
          y_expand: true,
          y_align: Clutter.ActorAlign.CENTER,
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      current_weather_humidity.add_actor(
        new St.Label({
          text: '26°C',
          style: 'padding-top: 10px; padding-bottom: 10px;',
        }),
      );
      // current_weather -> humidity

      tomorrow_box.add_actor(current_weather_temperature);
      tomorrow_box.add_actor(current_weather_humidity);

      this._temperature_forecast_list.actor.add_child(tomorrow_box);

      this.menu.addMenuItem(this._temperature_forecast_list);
      // current_weather






      // weather_forecast
      this._temperature_forecast_list = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
        style_class: 'temperature-list',
      });

      // weather_forecast -> day 1
      let tomorrow_box = new St.BoxLayout({
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
            Me.dir.get_path() + '/media' + '/icon.svg',
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
            Me.dir.get_path() + '/media' + '/icon.svg',
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
            Me.dir.get_path() + '/media' + '/icon.svg',
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
      // weather_forecast -> day 3

      tomorrow_box.add_actor(weather_forecast_day1);
      tomorrow_box.add_actor(weather_forecast_day2);
      tomorrow_box.add_actor(weather_forecast_day3);

      this._temperature_forecast_list.actor.add_child(tomorrow_box);

      this.menu.addMenuItem(this._temperature_forecast_list);
      // weather_forecast

      // 最低温度
      this._temperature_list = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
        style_class: 'temperature-list',
      });
      let pred_temp_low_box = new St.BoxLayout({
        x_expand: true,
        // style_class: 'openweather-current-iconbox',
      });

      let temp_start = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.START,
      });
      temp_start.add_actor(
        new St.Label({
          text: '最低 26°C',
        }),
      );

      let temp_center = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
      });
      temp_center.add_actor(
        new St.Label({
          text: '最低 27°C',
        }),
      );

      let temp_right = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.END,
      });
      temp_right.add_actor(
        new St.Label({
          text: '最低 28°C',
        }),
      );

      pred_temp_low_box.add_actor(temp_start);
      pred_temp_low_box.add_actor(temp_center);
      pred_temp_low_box.add_actor(temp_right);

      this._temperature_list.actor.add_child(pred_temp_low_box);
      this.menu.addMenuItem(this._temperature_list);

      // 特別天氣提示
      // placeholder
      // 特別天氣提示

      // version
      this._versionRow = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
      });
      let version_box = new St.BoxLayout({
        x_expand: true,
        style_class: 'version-box',
      });
      version_box.add_actor(
        new St.Label({
          text: ' 資料內容由香港天文台提供 ',
          style_class: 'version-box-title',
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
        }),
      );

      this._versionRow.actor.add_child(version_box);
      this.menu.addMenuItem(this._versionRow);

      // let pmItem = new PopupMenu.PopupMenuItem('Normal Menu Item');
      // pmItem.add_child(new St.Label({ text: 'Label added to the end' }));
      // this.menu.addMenuItem(pmItem);

      // pmItem.connect('activate', () => {
      //   log('clicked');
      // });
      // this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      // let pmItem = new PopupMenu.PopupMenuItem('Normal Menu Item');
      // pmItem.add_child(new St.Label({ text: 'Label added to the end' }));
      // this.menu.addMenuItem(pmItem);

      // pmItem.connect('activate', () => {
      //   log('clicked');
      // });
      // this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

      // this.menu.addMenuItem(
      //   new PopupMenu.PopupMenuItem('User cannot click on this item', {
      //     reactive: false,
      //   }),
      // );

      // // sub menu
      // let subItem = new PopupMenu.PopupSubMenuMenuItem('sub menu item');
      // this.menu.addMenuItem(subItem);
      // subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem('item 1'));
      // subItem.menu.addMenuItem(new PopupMenu.PopupMenuItem('item 2'), 0);

      // // section
      // let popupMenuSection = new PopupMenu.PopupMenuSection();
      // popupMenuSection.actor.add_child(new PopupMenu.PopupMenuItem('section'));
      // this.menu.addMenuItem(popupMenuSection);

      // // image item
      // let popupImageMenuItem = new PopupMenu.PopupImageMenuItem(
      //   'Menu Item with Icon',
      //   'security-high-symbolic',
      // );
      // this.menu.addMenuItem(popupImageMenuItem);

      // you can close, open and toggle the menu with
      // this.menu.close();
      // this.menu.open();
      // this.menu.toggle();

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
  myPopup = new MyPopup();
  Main.panel.addToStatusArea('myPopup', myPopup, 1);
}

function disable() {
  myPopup.destroy();
}

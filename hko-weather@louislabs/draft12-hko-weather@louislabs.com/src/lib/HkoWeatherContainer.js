'use strict';

const { Soup, Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

const ByteArray = imports.byteArray;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const { helloworld } = Me.imports.lib.Helloworld;
const fetchFromHkoRhrread = Me.imports.lib.fetchFromHkoRhrread;
const weatherIconMapping = Me.imports.lib.weatherIconMapping;
const { getRandomInt } = Me.imports.lib.getRandomInt;
const { bloatForStatusPanel } = Me.imports.lib.bloatForStatusPanel;
const { bloatForMainPanel } = Me.imports.lib.bloatForMainPanel;

const { HkoWeatherWidget } = Me.imports.lib.HkoWeatherWidget;

const MENU_COLUMNS = 12;
const UPDATE_INTERVAL = 1.0;

let hko_weather_panel;

var HkoWeatherContainer = GObject.registerClass(
  class HkoWeatherContainer extends PanelMenu.Button {
    _init() {
      super._init(0.5);
      this._current_temperature = 'Loading';

      // control status bar icon

      this._loading_icon = new St.Icon({
        icon_name: 'view-refresh-symbolic',
        style_class: 'system-status-icon',
      });
      this._status_weather_icon = this._loading_icon;

      this._weatherInfo = new St.Label({
        style_class: 'openweather-label',
        text: ' fetching ',
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
        style_class: 'hko-weather-system-status-text',
      });

      let topBox = new St.BoxLayout({});

      topBox.add_child(this._status_weather_icon);
      topBox.add_child(this._weatherInfo);
      this.add_child(topBox);
      // control status bar icon

      this._main_panel = new HkoWeatherWidget({
        menu: this.menu,
      });

      this._main_widget = this._main_panel;
      this.menu.box.add_child(this._main_widget);

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

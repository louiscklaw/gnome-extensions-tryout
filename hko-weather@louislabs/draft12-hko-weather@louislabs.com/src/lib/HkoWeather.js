'use strict';

const { Soup, Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

const ByteArray = imports.byteArray;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const { helloworld, helloworld_var, helloworld_const, helloworld_constructor } =
  Me.imports.lib.Helloworld;

const fetchFromHkoRhrread = Me.imports.lib.fetchFromHkoRhrread;
const weatherIconMapping = Me.imports.lib.weatherIconMapping;

const { getRandomInt } = Me.imports.lib.getRandomInt;
const { bloatForStatusPanel } = Me.imports.lib.bloatForStatusPanel;
const { bloatForMainPanel } = Me.imports.lib.bloatForMainPanel;

const { HkoWeatherContainer } = Me.imports.lib.HkoWeatherContainer;

const MENU_COLUMNS = 12;
const UPDATE_INTERVAL = 1.0;

let hko_weather_panel;

var HkoWeather = class HkoWeather {
  constructor() {
    this.container = new HkoWeatherContainer({
      current_temperature: this._current_temperature,
    });
  }

  _init() {
    log('init called');
    this._timeout = null;
  }

  addToPanel() {
    Main.panel.addToStatusArea('HkoWeatherPanel', this.container);
    this.container._weatherInfo.set_text('3');
    this.container._main_panel.temperature_value.set_text('33');

    this._refresh();
  }

  _updateStatusText(status_text) {
    this.container._weatherInfo.set_text(status_text);
  }

  _updateStatusIcon(weather_icon) {
    log('calling _updateStatusIcon');
    try {
      // let weather_icon_path = weatherIconMapping.map(weather_icon);
      let icon_path = weatherIconMapping.mapLocalIcon(weather_icon);

      this.container._status_weather_icon.set_gicon(
        Gio.icon_new_for_string(icon_path),
      );
    } catch (error) {
      log(error);
    }
  }

  _formatTemperature(temperature) {
    return temperature;
  }

  _formatHumidity(humidity) {
    return humidity;
  }

  _updateMainPanelWeatherSvg(weather_icon) {
    try {
      log(weather_icon);
      let icon_path = weatherIconMapping.mapLocalIcon(weather_icon);
      this.container._main_widget.updateWeatherSvg(icon_path);

      log(icon_path);
    } catch (error) {
      log(error);
    }
  }

  _updateMainPanelHumidity(humidity) {
    let temp = this._formatHumidity(humidity);
    this.container._main_widget.updateHumidity(temp);
  }

  _updateMainPanelTemperature(temperature) {
    let temp = this._formatTemperature(temperature);
    this.container._main_widget.updateTemperature(temp);
  }

  _updateStatus(data_json) {
    log('calling _updateStatus');
    try {
      let { temperature, humidity, weather_icon } =
        bloatForStatusPanel(data_json);
      let status_text = ['晴天', temperature + '°', humidity + '%'].join(' ');

      this._updateStatusText(status_text);
      this._updateStatusIcon(weather_icon);
    } catch (error) {
      log(error);
    }
  }

  _updatePanel(data_json) {
    log('calling _updatePanel');
    try {
      let { temperature, humidity, weather_icon } =
        bloatForMainPanel(data_json);

      // this.container._main_panel.temperature_value.set_text(temperature);
      this._updateMainPanelTemperature(temperature);
      this._updateMainPanelHumidity(humidity);
      this._updateMainPanelWeatherSvg(weather_icon);
    } catch (error) {
      log(error);
    }
  }

  _updateWeatherInfo(cb) {
    try {
      fetchFromHkoRhrread.get(cb);
    } catch (error) {
      log(error);
    }
  }

  _refresh() {
    log('refresh called');

    try {
      this.container._weatherInfo.set_text('4');
      this.container._main_panel.temperature_value.set_text('44');

      // kick off status update
      this._updateWeatherInfo(data_json => {
        this._updateStatus(data_json);
        this._updatePanel(data_json);
      });

      this._timeout = Mainloop.timeout_add_seconds(UPDATE_INTERVAL, () => {
        log('_refresh called:' + getRandomInt(1, 999999).toString());
        helloworld();
        log(helloworld_var);
        log(helloworld_const);
        this._updateWeatherInfo(data_json => {
          this._updateStatus(data_json);
          this._updatePanel(data_json);
        });
        return true;
      });
    } catch (error) {
      log(error);
    }
  }

  destroy() {
    this.container.destroy();
    // this.configHandler.destroy();
    Mainloop.source_remove(this._timeout);
  }
};

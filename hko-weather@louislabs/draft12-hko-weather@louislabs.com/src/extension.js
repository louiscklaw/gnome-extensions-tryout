const { Soup, Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

const ByteArray = imports.byteArray;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Helloworld = Me.imports.lib.Helloworld;
const fetchFromHkoRhrread = Me.imports.lib.fetchFromHkoRhrread;
const weatherIconMapping = Me.imports.lib.weatherIconMapping;

const MENU_COLUMNS = 12;
const UPDATE_INTERVAL = 1.0;

let hko_weather_panel;

function getRandomInt(min, max) {
  return Math.round((max - min) * Math.random());
}

function bloatForStatusPanel(rhrread_data_json) {
  log('calling bloatForStatusPanel');

  try {
    return {
      temperature: rhrread_data_json.temperature.data[1].value.toString(),
      humidity: rhrread_data_json.humidity.data[0].value.toString(),
      weather_icon: 63,
    };
  } catch (error) {
    log(error);
    return {
      temperature: 'error',
      humidity: 'error',
    };
  }
}

function bloatForMainPanel(rhrread_data_json, flw_data_json) {
  log('calling bloatForMainPanel');

  try {
    return {
      temperature: rhrread_data_json.temperature.data[1].value.toString(),
      humidity: rhrread_data_json.humidity.data[0].value.toString(),
      weather_note: 'hello weather note',
    };
  } catch (error) {
    log(error);
    return {
      temperature: 'error',
      humidity: 'error',
    };
  }
}

const HkoWeatherWidget = GObject.registerClass(
  class HkoWeatherWidget extends St.Widget {
    _buildMenu() {
      this.historyChart = new St.DrawingArea();

      let label;
      label = new St.Label({
        text: _('香港天氣'),
        style_class: 'panel-title',
      });
      this.addMenuRow(label, 0, 12, 1);

      let svg_box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
        style_class: 'weather-svg',
      });

      let weather_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        x_expand: true,
        y_expand: true,
        icon_size: 120,
      });
      svg_box.add(weather_svg);
      this.addMenuRow(svg_box, 0, 12, 1);

      // let weather_svg = new St.Icon({
      //   gicon: Gio.icon_new_for_string(
      //     Me.dir.get_path() + '/svgs/weather/clear-day.svg',
      //   )
      // });
      // this.addMenuRow(weather_svg, 0, 12, 1);

      // temperature_box

      let temperature_box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let temperature_title = new St.Label({
        text: _('温度'),
        style_class: 'current-weather-title',
      });
      temperature_box.add(temperature_title);

      this.temperature_value = new St.Label({
        text: _('--°'),
        style_class: 'current-weather-value',
      });
      temperature_box.add(this.temperature_value);

      this.addMenuRow(temperature_box, 0, 6, 1);

      // temperature_box

      // humidity_box

      let humidity_box = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let humidity_title = new St.Label({
        text: _('濕度'),
        style_class: 'current-weather-title',
      });
      humidity_box.add(humidity_title);

      this.humidity_value = new St.Label({
        text: _('--%'),
        style_class: 'current-weather-value',
      });
      humidity_box.add(this.humidity_value);

      this.addMenuRow(humidity_box, 6, 6, 1);

      // humidity_box

      // forecast_row

      let forecast_box1 = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let forecast_day_1_title = new St.Label({
        text: _('29/Sep'),
        style_class: 'menu-label menu-section-end forecast-row forecast-title',
      });
      forecast_box1.add(forecast_day_1_title);

      let sample_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style_class: 'forecast-svg',
      });
      forecast_box1.add(sample_svg);

      let forecast_day_1_value = new St.Label({
        text: _('26'),
        style_class: 'forecast-value',
      });
      forecast_box1.add(forecast_day_1_value);

      this.addMenuRow(forecast_box1, 0, 4, 1);

      let forecast_box2 = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let forecast_day_2_title = new St.Label({
        text: _('30/Sep'),
        style_class: 'menu-label menu-section-end forecast-row forecast-title',
      });
      forecast_box2.add(forecast_day_2_title);

      let forecast_day_2_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style_class: 'forecast-svg',
      });
      forecast_box2.add(forecast_day_2_svg);

      let forecast_day_2_value = new St.Label({
        text: _('26'),
        style_class: 'forecast-value',
      });
      forecast_box2.add(forecast_day_2_value);

      this.addMenuRow(forecast_box2, 4, 4, 1);

      let forecast_box3 = new St.BoxLayout({
        x_expand: true,
        y_expand: true,
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
        vertical: true,
      });

      let forecast_day_3_title = new St.Label({
        text: _('31/Sep'),
        style_class: 'menu-label menu-section-end forecast-row forecast-title',
      });
      forecast_box3.add(forecast_day_3_title);

      let forecast_day_3_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
        style_class: 'forecast-svg',
      });
      forecast_box3.add(forecast_day_3_svg);

      let forecast_day_3_value = new St.Label({
        text: _('26'),
        style_class: 'forecast-value',
      });
      forecast_box3.add(forecast_day_3_value);

      this.addMenuRow(forecast_box3, 8, 4, 1);

      // forecast_row

      // special_weather_notice_row

      label = new St.Label({
        text: _('特別天氣提示'),
        style_class: 'menu-header row-padding',
        style: '',
      });
      this.addMenuRow(label, 0, 12, 1);

      label = new St.Label({
        text: _(
          '雷雨區正影響香港東部地區，\n預料西貢及大埔區雨勢較大。\n市民應提高警惕。\n(12-09-2023 14:10) ',
        ),
        style_class: 'content-padding special-weather-note',
      });
      this.addMenuRow(label, 0, 12, 1);

      // special_weather_notice_row

      label = new St.Label({
        text: _('內容由香港天文台提供'),
        style_class: 'row-padding hko-text',
        style: '',
      });
      this.addMenuRow(label, 0, 12, 1);

      label = new St.Label({
        text: _('louislabs.com'),
        style_class: 'source-text',
        style: '',
      });
      this.addMenuRow(label, 0, 12, 1);
    }

    _init({ menu }) {
      this._menu = menu;

      let grid = new St.Widget({
        style_class: 'menu-grid',
        layout_manager: new Clutter.GridLayout({
          orientation: Clutter.Orientation.VERTICAL,
        }),
      });

      this.lm = grid.layout_manager;
      this.menuRow = 0;
      this.menuCol = 0;
      this.numMenuCols = MENU_COLUMNS;

      this._buildMenu();

      this._menu.box.add_child(grid);
    }

    addMenuRow(widget, col, colSpan, rowSpan) {
      this.lm.attach(widget, col, this.menuRow, colSpan, rowSpan);
      this.menuCol += colSpan;
      if (this.menuCol >= this.numMenuCols) {
        this.menuRow++;
        this.menuCol = 0;
      }
    }
  },
);

const HkoWeatherContainer = GObject.registerClass(
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
        text: '-',
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });

      let topBox = new St.BoxLayout({
        // style_class: 'panel-status-menu-box',
      });

      topBox.add_child(this._status_weather_icon);
      topBox.add_child(this._weatherInfo);
      this.add_child(topBox);
      // control status bar icon

      this._main_panel = new HkoWeatherWidget({
        menu: this.menu,
      });
      this.menu.box.add_child(this._main_panel);

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

class HkoWeather {
  constructor() {
    this.container = new HkoWeatherContainer({
      current_temperature: this._current_temperature,
    });
  }

  _init() {
    log('init called');

    this._timeout = null;

    // try {
    //   this._refresh();
    // } catch (error) {
    //   log(error);
    // }
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
      this.container._status_weather_icon.set_gicon(
        Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
      );
    } catch (error) {
      log(error);
    }
  }

  _updateMainPanelTemperature(temperature) {
    let temp = this._formatTemperature(temperature);
    this.container._main_panel.temperature_value.set_text(temp);
  }

  _formatTemperature(temperature) {
    return temperature + '°';
  }

  _formatHumidity(humidity) {
    return humidity + '%';
  }

  _updateMainPanelHumidity(humidity) {
    let temp = this._formatHumidity(humidity);
    this.container._main_panel.humidity_value.set_text(temp);
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
      let { temperature, humidity } = bloatForMainPanel(data_json);

      // this.container._main_panel.temperature_value.set_text(temperature);
      this._updateMainPanelTemperature(temperature);
      this._updateMainPanelHumidity(humidity);
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
}

function init() {}

function enable() {
  // let httpSession = new Soup.Session();
  // httpSession.user_agent =
  //   'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';

  // log(JSON.stringify({ MAJOR_VERSION: Soup.MAJOR_VERSION }));

  // let request = Soup.Message.new(
  //   'GET',
  //   // 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw',
  //   'http://localhost:8080/helloworld_rhrread',
  // );
  // request.request_headers.append('Accept', 'application/json');

  // try {
  //   httpSession.send_and_read_async(
  //     request,
  //     GLib.PRIORITY_DEFAULT,
  //     null,
  //     (httpSession, message) => {
  //       let data = ByteArray.toString(
  //         httpSession.send_and_read_finish(message).get_data(),
  //       );
  //       log('Recieved ' + data.length + ' bytes');
  //       let data_json = JSON.parse(data);
  //       log(JSON.stringify(data_json, null, 2));
  //     },
  //   );
  // } catch (error) {
  //   log('unable to send libsoup json message ' + error);
  // }

  hko_weather_panel = new HkoWeather();
  hko_weather_panel.addToPanel();
}

function disable() {
  hko_weather_panel.destroy();
}

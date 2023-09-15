const { Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const MENU_COLUMNS = 12;
const ANIMATION_DURATION = 500;

let hko_weather_panel;

const HkoWeatherWidget = GObject.registerClass(
  class HkoWeatherWidget extends St.Widget {
    _buildMenu() {
      this.historyChart = new St.DrawingArea();

      let label;
      label = new St.Label({
        text: _('香港天氣'),
        style_class: 'menu-header',
        style: 'font-weight: bold;',
      });
      this.addMenuRow(label, 0, 12, 1);

      let weather_svg = new St.Icon({
        gicon: Gio.icon_new_for_string(
          Me.dir.get_path() + '/svgs/weather/clear-day.svg',
        ),
      });
      this.addMenuRow(weather_svg, 0, 12, 1);

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

      let temperature_value = new St.Label({
        text: _('29°'),
        style_class: 'current-weather-value',
      });
      temperature_box.add(temperature_value);

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

      let humidity_value = new St.Label({
        text: _('98'),
        style_class: 'current-weather-value',
      });
      humidity_box.add(humidity_value);

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
        text: '晴天' + Math.round(Math.random() * 99999),
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

      let bin = new HkoWeatherWidget({
        menu: this.menu,
      });
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

class HkoWeather {
  constructor() {
    this.container = new HkoWeatherContainer();
  }

  addToPanel() {
    Main.panel.addToStatusArea('HkoWeatherPanel', this.container);
  }

  destroy() {
    this.container.destroy();
    this.configHandler.destroy();
  }
}

function init() {}

function enable() {
  hko_weather_panel = new HkoWeather();
  hko_weather_panel.addToPanel();
}

function disable() {
  hko_weather_panel.destroy();
}

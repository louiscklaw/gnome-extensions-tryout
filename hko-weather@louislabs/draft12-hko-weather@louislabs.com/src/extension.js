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

const { fetchHkoRhrread } = Me.imports.lib.api.fetchHkoRhrread;
const { HkoWeather } = Me.imports.lib.HkoWeather;

const MENU_COLUMNS = 12;
const UPDATE_INTERVAL = 1.0;

let hko_weather_panel;

function init() {}

function enable() {
  try {
    log('enable called');

    hko_weather_panel = new HkoWeather();
    hko_weather_panel.addToPanel();
  } catch (error) {
    log(error);
  }
}

function disable() {
  log('disable called');
  try {
    hko_weather_panel.destroy();
  } catch (error) {
    log(error);
  }
}

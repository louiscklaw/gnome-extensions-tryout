'use strict';

const { Soup, Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

const ByteArray = imports.byteArray;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var map = icon_num => {
  try {
    let map_table = {
      50: 'clear-day.svg',
      51: 'partly-cloudy.svg',
      52: 'overcast-day.svg',
      53: 'partly-cloudy-day-drizzle.svg',
      54: 'partly-cloudy-day-rain.svg',
    };

    return map_table[icon_num];
  } catch (error) {
    log(error);
  }
};

var findPath = weather_icon_path => {
  try {
    return Me.dir.get_path() + `/svgs/weather/${weather_icon_path}`;
  } catch (error) {
    log(error);
  }
};

var mapLocalIcon = icon_num => {
  try {
    let icon = map(icon_num);
    return findPath(icon);
  } catch (error) {
    log(error);
  }
};

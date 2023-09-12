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

      // 天氣報告
      this._currentWeatherLabel = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
      });
      let weather_label_box = new St.BoxLayout({
        x_expand: true,
        // style_class: 'openweather-current-iconbox',
      });
      weather_label_box.add_actor(
        new St.Label({
          text: '天氣報告',
          // style_class: 'openweather-current-summary',
        }),
      );
      this._currentWeatherLabel.actor.add_child(weather_label_box);
      this.menu.addMenuItem(this._currentWeatherLabel);

      // 更新時間
      this._lastUpdateTime = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
      });
      let last_update_time_box = new St.BoxLayout({
        x_expand: true,
        // style_class: 'openweather-current-iconbox',
      });
      last_update_time_box.add_actor(
        new St.Label({
          text: '03:00 更新',
          // style_class: 'openweather-current-summary',
        }),
      );
      this._lastUpdateTime.actor.add_child(last_update_time_box);
      this.menu.addMenuItem(this._lastUpdateTime);



      // 最低温度
      this._temperature_list = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
        style_class: 'temperature-list',
      });
      let pred_temp_low_box = new St.BoxLayout({
        x_expand: true
        // style_class: 'openweather-current-iconbox',
      });

 
      let temp_start = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.START
      });
      temp_start.add_actor(
        new St.Label({
          text: '最低 26°C',
        }),
      );

      let temp_center = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.CENTER
      });
      temp_center.add_actor(
        new St.Label({
          text: '最低 27°C',
        }),
      );

      let temp_right = new St.BoxLayout({
        x_expand: true,
        x_align: Clutter.ActorAlign.END
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

      // 濕度
      this._humidity = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
      });
      let humidity_box = new St.BoxLayout({
        x_expand: true,
        style_class: 'humidity-box',
      });
      humidity_box.add_actor(
        new St.Label({
          text: '濕度 92%',
          style_class: 'humidity-body',
        }),
      );
      this._humidity.actor.add_child(humidity_box);
      this.menu.addMenuItem(this._humidity);

      // 特別天氣提示
      this._weatherNotice = new PopupMenu.PopupBaseMenuItem({
        reactive: false,
      });
      let weather_notice_box = new St.BoxLayout({
        // x_expand: true,
        style_class: 'weather-notice-box',
      });
      weather_notice_box.add_actor(
        new St.Label({
          text: '特別天氣提示',
          style_class: 'weather-notice-box-title',
        }),
      );
      weather_notice_box.add_actor(
        new St.Label({
          text: '受低壓槽',
          // text: '受低壓槽影響，廣東沿岸海域及南海北部持續有雷雨發展，預料本港今日（9月12日）局部地區雨勢有時較大及有雷暴。 (12-09-2023 00:00)',
          style_class: 'weather-notice-box-body',
        }),
      );
      this._weatherNotice.actor.add_child(weather_notice_box);
      this.menu.addMenuItem(this._weatherNotice);





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

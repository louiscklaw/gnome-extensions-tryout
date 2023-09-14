'use strict';

const { GObject, St } = imports.gi;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Config = Me.imports.lib.config;
const _ = Config.Domain.gettext;

var TopHatContainer = GObject.registerClass(
  class TopHatContainer extends PanelMenu.Button {
    _init() {
      super._init();
      this.box = new St.BoxLayout();
      this.add_child(this.box);
    }

    addMonitor(monitor) {
      this.box.add_child(monitor);
    }

    _onDestroy() {
      this.monitors.forEach(monitor => {
        monitor.destroy();
      });
      super._onDestroy();
    }
  },
);

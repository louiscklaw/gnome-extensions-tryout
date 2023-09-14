'use strict';

const { GObject, St } = imports.gi;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var TopHatContainer = GObject.registerClass(
    class TopHatContainer extends PanelMenu.Button {
      _init() {
        super._init();
        this.box = new St.BoxLayout();
        this.add_child(this.box);
      }



    _onDestroy() {
        this.monitors.forEach(monitor => {
          monitor.destroy();
        });
        super._onDestroy();
      }
    },
  );
  
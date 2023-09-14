'use strict';

let depFailures = [];
let missingLibs = [];

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
let GTop = null;
let Cpu = null;
let Mem = null;
let Net = null;
let FS = null;
try {
  // eslint-disable-next-line no-unused-vars
  GTop = imports.gi.GTop;
  Cpu = Me.imports.lib.cpu;
  Mem = Me.imports.lib.mem;
  Net = Me.imports.lib.net;
  FS = Me.imports.lib.fs;
} catch (err) {
  log(`[${Me.metadata.name}] Error loading dependencies: ${err}`);
  depFailures.push(err);
  missingLibs.push('GTop');
}
const Config = Me.imports.lib.config;
const Container = Me.imports.lib.container;
const _ = Config.Domain.gettext;

const MenuPosition = {
  LEFT_EDGE: 0,
  LEFT: 1,
  CENTER: 2,
  RIGHT: 3,
  RIGHT_EDGE: 4,
};

// Declare `tophat` in the scope of the whole script so it can
// be accessed in both `enable()` and `disable()`
let tophat = null;

class TopHat {
  constructor() {
    this.configHandler = new Config.ConfigHandler();
    this.container = new Container.TopHatContainer();

    this.cpu = new Cpu.CpuMonitor(this.configHandler);
    this.container.addMonitor(this.cpu);

  }

  addToPanel() {
    Main.panel.addToStatusArea('TopHat', this.container);
   
  }

  _getPreferredPanelBoxAndPosition() {
    let box = 'right';
    let position = 0;
    switch (this.configHandler.positionInPanel) {
      case MenuPosition.LEFT_EDGE:
        box = 'left';
        position = 0;
        break;
      case MenuPosition.LEFT:
        box = 'left';
        position = -1;
        break;
      case MenuPosition.CENTER:
        box = 'center';
        position = 1;
        break;
      case MenuPosition.RIGHT:
        box = 'right';
        position = 0;
        break;
      case MenuPosition.RIGHT_EDGE:
        box = 'right';
        position = -1;
        break;
    }
    return { box, position };
  }

  destroy() {
    this.container.destroy();
    this.configHandler.destroy();
  }
}

function init() {
  ExtensionUtils.initTranslations();
}

function enable() {
  tophat = new TopHat();
  tophat.addToPanel();

}

function disable() {
  if (tophat !== null) {
    tophat.destroy();
    tophat = null;
  }
}

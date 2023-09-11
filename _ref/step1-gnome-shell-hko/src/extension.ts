// @ts-ignore
const Me = imports.misc.extensionUtils.getCurrentExtension();

import * as log from 'log';
import * as HTTP from 'HTTP';
// import * as helloworld from 'helloworld';

export class GnomeExtension {
  constructor() {}

  enable() {
    log.info(`enabling...`);
    HTTP.helloworld();
    // helloworld.say();
  }

  disable() {
    log.info(`disabling...`);
  }
}

// @ts-ignore
function init(meta) {
  log.info(`initializing Gnome Clipboard version ...`);

  return new GnomeExtension();
}

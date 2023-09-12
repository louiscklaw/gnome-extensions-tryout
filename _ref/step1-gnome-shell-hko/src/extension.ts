// @ts-ignore
const Me = imports.misc.extensionUtils.getCurrentExtension();
// const ExtensionUtils = imports.misc.extensionUtils;

const log = Me.imports.log;
const HTTP = Me.imports.HTTP;

export class GnomeExtension {
  constructor() {}

  enable() {
    log.info(`enabling...`);
    HTTP.helloworld();
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

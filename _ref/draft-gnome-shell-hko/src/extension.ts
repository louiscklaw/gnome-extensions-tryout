// @ts-ignore
const Me = imports.misc.extensionUtils.getCurrentExtension();

import * as log from 'log';


export class GnomeExtension {
    constructor() {

    }

    enable() { 
        log.info(`enabling...`);
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
  
  
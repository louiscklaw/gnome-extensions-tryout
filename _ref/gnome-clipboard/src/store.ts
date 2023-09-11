// @ts-ignore
const Me = imports.misc.extensionUtils.getCurrentExtension();

import * as log from 'log';

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;


export class Store {
  private _path: string = "";

  constructor(dir: string) {
    // Make sure path exists
    let ret = GLib.mkdir_with_parents(dir, parseInt('0700', 8))
    if (ret == 0) {
      this._path = GLib.build_filenamev([dir, "history.json"]);
      log.info(`store location set to ${this._path}`);
    } else {
      log.error(`unable to create store directory: ${dir}`);
    }
  }

  load(): any {
    log.info(`try to load history.`);

    let history: any = [];
    try {
      let file = Gio.file_new_for_path(this._path);
      let [success, contents] = file.load_contents(null);
      if (success && contents) {
        history = JSON.parse(imports.byteArray.toString(contents));
      }
    } catch (err) {
      log.error(`an exception occurred: ${err}`);
    }

    return history;
  }

  save(history: any) {
    log.info(`try to save history.`);

    try {
      let json = JSON.stringify(history);
      GLib.file_set_contents(this._path, json);
    } catch (err) {
      log.error(`an exception occurred: ${err}`);
    }
  }
}

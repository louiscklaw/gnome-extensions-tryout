// const GLib = imports.gi.GLib;
import Soup from 'gi://Soup';

export async function helloAsync() {
  return new Promise((res, rej) => {
    try {
      res('hello done');
    } catch (error) {
      rej('hello fail');
    }
  });
}

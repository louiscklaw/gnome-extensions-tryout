#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
const Gtk = imports.gi.Gtk;

imports.searchPath.push('.');

const sampleFunc = imports.sampleFunc;
const util1 = imports.utils.util1;

// let win = new Gtk.Window();
// win.connect("delete-event", Gtk.main_quit);
// win.show_all();
// Gtk.main();

function main() {
  log('main start');
  // sampleFunc.helloworld();
  // util1.helloworld();
  
}

main();

#!/usr/bin/gjs
imports.gi.versions.Gtk = '4.0';
const Gtk = imports.gi.Gtk;

const Adw = imports.gi.Adw;
// const { St } = imports.gi;

Gtk.init();

log('helloworld');

let win = new Gtk.Window();
// win.connect('delete-event', Gtk.main_quit);
// win.show_all();
Gtk.main();

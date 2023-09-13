#!/usr/bin/gjs

imports.gi.versions.Gtk = '3.0';
imports.gi.versions.St = '1.0';
const Gtk = imports.gi.Gtk;
const St = imports.gi.St;

Gtk.init(null);

log('helloworld');

let win = new Gtk.Window();
win.connect('delete-event', Gtk.main_quit);
win.show_all();
Gtk.main();

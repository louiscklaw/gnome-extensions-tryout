'use strict';

const { Clutter, Gio, Gtk, GLib, GObject, St } = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

let panelButton, panelButtonText, timeout;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const helloworld = Me.imports.helloworld;

// const { sayHelloworld } = Extension.imports.helloworld;
// const {sayHelloworld} = imports.sayHelloworld;
// const Device = Extension.imports.shell.device;
// const Utils = Extension.imports.shell.utils;

function setButtonText() {
  var arr = [];

  // date
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('date');
  arr.push(out.toString().replace('\n', ''));

  // GEDIT
  var [ok, out, err, exit] = GLib.spawn_command_line_sync('pgrep gedit');
  if (out.length > 0) {
    arr.push('GEDIT');
  }

  // Private
  var [ok, out, err, exit] = GLib.spawn_command_line_sync(
    '/bin/bash -c "ifconfig -a | grep wlp2s0"',
  );
  if (out.length > 0) {
    arr.push('Really ?');
  }

  // // date by JavaScript
  // var date = new Date();
  // arr.push(date);

  // // date by GLib
  // var now = GLib.DateTime.new_now_local();
  // var str = now.format("%Y-%m-%d %H-%M-%S");
  // arr.push(str);

  panelButtonText.set_text(arr.join(' '));

  return true;
}

function init() {
  log('init');
  

  // panelButton = new St.Bin({
  //   style_class: 'panel-button',
  // });
  // panelButtonText = new St.Label({
  //   style_class: 'examplePanelText',
  //   text: 'Starting ...',
  //   y_align: Clutter.ActorAlign.CENTER,
  // });
  // panelButton.set_child(panelButtonText);
}

function enable() {
  log('enable');
  helloworld.say();

  // Main.panel._rightBox.insert_child_at_index(panelButton, 1);
  // timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
}

function disable() {
  log('disable');
  

  // Mainloop.source_remove(timeout);
  // Main.panel._rightBox.remove_child(panelButton);
}

// function sayHelloworld(){
//   log('sayHelloworld');
// }

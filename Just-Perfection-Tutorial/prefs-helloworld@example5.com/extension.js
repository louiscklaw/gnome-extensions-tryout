const { Adw, Gtk, Gdk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {
  log('prefs-helloworld@example5.com extensions init');

}

function enable() {
  log('prefs-helloworld@example5.com extensions enable');

  log(JSON.stringify(Me.metadata['gettext-domain']));
  log(JSON.stringify(Me.metadata['settings-schema']));
}

function disable() {
  log('prefs-helloworld@example5.com extensions disable');
}

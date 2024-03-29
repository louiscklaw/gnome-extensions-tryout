const { Adw, Gtk, Gdk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const GeneralPrefs = Me.imports.preferences.generalPage;
const AboutPrefs = Me.imports.preferences.aboutPage;

function init() {
  log('prefs init');
}

function fillPreferencesWindow(window) {
  log('fillPreferencesWindow init');
  let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
  if (!iconTheme.get_search_path().includes(Me.path + '/media')) {
    iconTheme.add_search_path(Me.path + '/media');
  }

  // const settings = ExtensionUtils.getSettings(
  //   'org.gnome.shell.extensions.perfs-helloworld',
  // );

  // const settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);
  const settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);
  log(settings.get_int('intHelloworld'));


  const generalPage = new GeneralPrefs.GeneralPage(settings);
  const aboutPage = new AboutPrefs.AboutPage();

  let prefsWidth = 800;
  let prefsHeight = 800;

  window.set_default_size(prefsWidth, prefsHeight);
  window.set_search_enabled(true);

  window.add(generalPage);
  window.add(aboutPage);
}

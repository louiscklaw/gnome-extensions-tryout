const { Adw, GLib, Gtk, GdkPixbuf, GObject } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);

const _ = Gettext.gettext;

var AboutPage = GObject.registerClass(
  class OpenWeather_AboutPage extends Adw.PreferencesPage {
    _init() {
      super._init({
        title: 'About',
        icon_name: 'help-about-symbolic',
        name: 'AboutPage',
        margin_start: 10,
        margin_end: 10,
      });

      // Extension logo and description
      let aboutGroup = new Adw.PreferencesGroup();
      let aboutBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        hexpand: false,
        vexpand: false,
      });

      let openWeatherImage = new Gtk.Image({
        icon_name: 'openweather-icon',
        margin_bottom: 5,
        pixel_size: 100,
      });

      let openWeatherLabel = new Gtk.Label({
        label: '<span size="larger"><b>OpenWeather</b></span>',
        use_markup: true,
        margin_bottom: 15,
        vexpand: true,
        valign: Gtk.Align.FILL,
      });

      let aboutDescription = new Gtk.Label({
        label:
          'Display weather information for any location on Earth in the GNOME Shell',
        margin_bottom: 3,
        hexpand: false,
        vexpand: false,
      });

      aboutBox.append(openWeatherImage);
      aboutBox.append(openWeatherLabel);
      aboutBox.append(aboutDescription);
      aboutGroup.add(aboutBox);
      this.add(aboutGroup);

      // Info group
      let infoGroup = new Adw.PreferencesGroup();
      let releaseVersion = Me.metadata.version
        ? Me.metadata.version
        : 'unknown';
      let gitVersion = Me.metadata['git-version']
        ? Me.metadata['git-version']
        : null;
      let windowingLabel =
        GLib.getenv('XDG_SESSION_TYPE') === 'wayland' ? 'Wayland' : 'X11';

      // Extension version
      let openWeatherVersionRow = new Adw.ActionRow({
        title: 'OpenWeather Version',
      });
      openWeatherVersionRow.add_suffix(
        new Gtk.Label({
          label: releaseVersion + '',
        }),
      );
      // Git version for self builds
      let gitVersionRow = null;
      if (gitVersion) {
        gitVersionRow = new Adw.ActionRow({
          title: 'Git Version',
        });
        gitVersionRow.add_suffix(
          new Gtk.Label({
            label: gitVersion + '',
          }),
        );
      }
      // shell version
      let gnomeVersionRow = new Adw.ActionRow({
        title: 'GNOME Version',
      });
      gnomeVersionRow.add_suffix(
        new Gtk.Label({
          label: imports.misc.config.PACKAGE_VERSION + '',
        }),
      );
      // session type
      let sessionTypeRow = new Adw.ActionRow({
        title: 'Session Type',
      });
      sessionTypeRow.add_suffix(
        new Gtk.Label({
          label: windowingLabel,
        }),
      );

      infoGroup.add(openWeatherVersionRow);
      gitVersion && infoGroup.add(gitVersionRow);
      infoGroup.add(gnomeVersionRow);
      infoGroup.add(sessionTypeRow);
      this.add(infoGroup);

      // Maintainer
      let maintainerGroup = new Adw.PreferencesGroup();
      let imageLinksGroup = new Adw.PreferencesGroup();

      let maintainerBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        hexpand: false,
        vexpand: false,
      });
      let maintainerAbout = new Gtk.Label({
        label: ('Maintained by: %s').format('Jason Oickle'),
        hexpand: false,
        vexpand: false,
      });

      let pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
        Me.path + '/media/donate-icon.png',
        -1,
        50,
        true,
      );
      let donateImage = Gtk.Picture.new_for_pixbuf(pixbuf);
      let donateButton = new Gtk.LinkButton({
        child: donateImage,
        uri: 'https://www.paypal.com/donate/?hosted_button_id=VZ7VLXPU2M9RQ',
      });

      pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
        Me.path + '/media/gitlab-icon.png',
        -1,
        50,
        true,
      );
      let gitlabImage = Gtk.Picture.new_for_pixbuf(pixbuf);
      let gitlabButton = new Gtk.LinkButton({
        child: gitlabImage,
        uri: 'http://louislabs.github.io',
      });
      let imageLinksBox = new Adw.ActionRow();

      maintainerBox.append(maintainerAbout);
      imageLinksBox.add_prefix(donateButton);
      imageLinksBox.add_suffix(gitlabButton);
      maintainerGroup.add(maintainerBox);
      imageLinksGroup.add(imageLinksBox);
      this.add(maintainerGroup);
      this.add(imageLinksGroup);

      // Provider
      let providerGroup = new Adw.PreferencesGroup();
      let providerBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 15,
        hexpand: false,
        vexpand: false,
      });

      let providerAbout = new Gtk.Label({
        label: ('Weather data provided by: %s').format(
          '<a href="https://openweathermap.org">OpenWeatherMap</a>',
        ),
        use_markup: true,
        hexpand: false,
        vexpand: false,
      });

      providerBox.append(providerAbout);
      providerGroup.add(providerBox);
      this.add(providerGroup);

      // License
      let gnuLicense =
        '<span size="small">' +
        'This program comes with ABSOLUTELY NO WARRANTY.' +
        '\n' +
        'See the' +
        ' <a href="https://gnu.org/licenses/old-licenses/gpl-2.0.html">' +
        'GNU General Public License, version 2 or later' +
        '</a> ' +
        'for details.' +
        '</span>';

      let gplGroup = new Adw.PreferencesGroup();
      let gplLabel = new Gtk.Label({
        label: gnuLicense,
        use_markup: true,
        justify: Gtk.Justification.CENTER,
      });

      let gplLabelBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        valign: Gtk.Align.END,
        vexpand: true,
      });

      gplLabelBox.append(gplLabel);
      gplGroup.add(gplLabelBox);
      this.add(gplGroup);
    }
  },
);

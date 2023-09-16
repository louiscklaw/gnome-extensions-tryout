const { Soup, Atk, Clutter, GLib, GObject, Shell, St, Gio } = imports.gi;

const ByteArray = imports.byteArray;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var fetchHkoSwt = cb_to_update_main_data => {
  log('calling fetchHkoSwt');

  try {
    let cb = cb_to_update_main_data;
    let httpSession = new Soup.Session();

    httpSession.user_agent =
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';

    let request = Soup.Message.new(
      'GET',
      // 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt',
      'http://localhost:8080/helloworld_swt',
    );

    request.request_headers.append('Accept', 'application/json');
    httpSession.send_and_read_async(
      request,
      GLib.PRIORITY_DEFAULT,
      null,
      (httpSession, message) => {
        try {
          let rhrread_data = ByteArray.toString(
            httpSession.send_and_read_finish(message).get_data(),
          );
          log('Recieved ' + rhrread_data.length + ' bytes');
          let rhrread_data_json = JSON.parse(rhrread_data);

          cb(rhrread_data_json);
        } catch (error) {
          log(error);
        }
      },
    );

    httpSession = null;
  } catch (error) {
    log(error);
  }
};

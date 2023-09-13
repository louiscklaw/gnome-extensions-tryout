// imports.gi.versions.Soup = '3.4.2';

const Soup = imports.gi.Soup;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

// https://www.hko.gov.hk/en/weatherAPI/doc/files/HKO_Open_Data_API_Documentation.pdf
// https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en

// Gio._promisify(Soup.Session.prototype, 'send_and_read_async');

// function get1(url) {
//   var output = { state: 'start', debug: {}, error: '' };
//   try {
//     let sessionSync = new Soup.SessionSync();

//     // https://www.hko.gov.hk/en/abouthko/opendata_intro.htm
//     let msg = Soup.Message.new('GET', url);
//     sessionSync.send_message(msg);
//     res_json = JSON.parse(msg.response_body.data);

//     output = { ...output, state: 'done', result: res_json };
//   } catch (error) {
//     output = { ...output, state: 'error', error: error.message };
//     console.error(error.message);
//   }

//   return output;
// }

async function get(url) {
  log(Soup.MAJOR_VERSION + '.' + Soup.MINOR_VERSION + '.' + Soup.MICRO_VERSION);

  let _httpSession = new Soup.Session();

  let message = Soup.Message.new('GET', url);
  _httpSession.send_and_read_async(
    message,
    GLib.PRIORITY_DEFAULT,
    null,
    (_httpSession, _message) => {
      log(_message);
    },
  );

  return 'helloworld';
}

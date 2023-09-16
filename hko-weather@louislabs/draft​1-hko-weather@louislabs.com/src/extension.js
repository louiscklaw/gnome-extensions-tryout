const { St, GLib, Clutter } = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const ByteArray = imports.byteArray;

const Soup = imports.gi.Soup;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
// const helloworld = Extension.imports.helloworld;

let panelButton, panelButtonText, timeout;

let params = {
  amount: '1000',
  sourceCurrency: 'CHF',
  targetCurrency: 'EUR',
};

let _httpSession;

let url =
  'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en';
let msg = Soup.Message.new('GET', url);

// let message = Soup.form_request_new_from_hash('GET', "http://www.example.com", params);

function setButtonText() {
  var arr = [];
  try {
    log('running ');

    // console.log(Soup);
    // console.log(localWeatherForecastGet());
    // _httpSession.queue_message(request, function(httpSession, message) {
    // })

    arr.push('hko-weather@louislabs.com');
    panelButtonText.set_text(arr.join(' '));
  } catch (error) {
    console.log(error.message);
  }
  return true;
}

function init() {
  panelButton = new St.Bin({
    style_class: 'panel-button',
  });

  panelButtonText = new St.Label({
    style_class: 'examplePanelTextBlaBlaBla',
    text: 'Starting ...',
    y_align: Clutter.ActorAlign.CENTER,
  });

  panelButton.set_child(panelButtonText);
}

function enable() {
  Main.panel._rightBox.insert_child_at_index(panelButton, 1);
  timeout = Mainloop.timeout_add_seconds(10.0, setButtonText);
}

function disable() {
  Mainloop.source_remove(timeout);
  Main.panel._rightBox.remove_child(panelButton);
}

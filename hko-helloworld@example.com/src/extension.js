const { St, GLib, Clutter } = imports.gi;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
// const helloworld = Extension.imports.helloworld;

let panelButton, panelButtonText, timeout;

function setButtonText() {
  var arr = [];
  try {
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
  timeout = Mainloop.timeout_add_seconds(1.0, setButtonText);
}

function disable() {
  Mainloop.source_remove(timeout);
  Main.panel._rightBox.remove_child(panelButton);
}


function getHkoJsonGet(url) {
  var output = { state: 'start', debug: {}, error: '' };
  try {
    let sessionSync = new Soup.SessionSync();

    // https://www.hko.gov.hk/en/abouthko/opendata_intro.htm
    let msg = Soup.Message.new('GET', url);
    sessionSync.send_message(msg);
    res_json = JSON.parse(msg.response_body.data);

    output = { ...output, state: 'done', result: res_json };
  } catch (error) {
    output = { ...output, state: 'error', error: error.message };
    console.error(error.message);
  }

  return output;
}

function localWeatherForecastGet() {
  var test_url_en =
    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en';
  var test_url_tc =
    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc';

  var output = { state: 'start', debug: {}, error: '' };
  output = getHkoJsonGet(test_url_en);
  output = {...output, debug:{
    test_url_en, test_url_tc,
  }}

  return output;
}

imports.gi.versions.Soup = '2.4';

const Soup = imports.gi.Soup;
const Lang = imports.lang;

// https://www.hko.gov.hk/en/weatherAPI/doc/files/HKO_Open_Data_API_Documentation.pdf
// https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en


function get(url) {
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

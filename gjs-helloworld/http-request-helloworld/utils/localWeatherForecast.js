imports.gi.versions.Soup = '2.4';

const Soup = imports.gi.Soup;
const Lang = imports.lang;
const getHkoJson = imports.utils.getHkoJson;

// https://www.hko.gov.hk/en/weatherAPI/doc/files/HKO_Open_Data_API_Documentation.pdf
// https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en

function get() {
  var test_url_en =
    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en';
  var test_url_tc =
    'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=tc';

  var output = { state: 'start', debug: {}, error: '' };
  output = getHkoJson.get(test_url_en);

  return output;
}

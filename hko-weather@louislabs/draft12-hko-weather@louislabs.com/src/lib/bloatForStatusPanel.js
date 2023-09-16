'use strict';

var bloatForStatusPanel = rhrread_data_json => {
  log('calling bloatForStatusPanel');
  log(rhrread_data_json.icon);

  try {
    return {
      temperature: rhrread_data_json.temperature.data[1].value.toString(),
      humidity: rhrread_data_json.humidity.data[0].value.toString(),
      weather_icon: rhrread_data_json.icon[0],
    };
  } catch (error) {
    log(error);
    return {
      temperature: 'error',
      humidity: 'error',
    };
  }
};

'use strict';

var bloatForMainPanel = rhrread_data_json => {
  log('calling bloatForMainPanel');

  try {
    return {
      temperature: rhrread_data_json.temperature.data[1].value.toString(),
      humidity: rhrread_data_json.humidity.data[0].value.toString(),
      weather_icon: rhrread_data_json.icon[0],
      weather_note: 'hello weather note',
    };
  } catch (error) {
    log(error);
    return {
      temperature: 'error',
      humidity: 'error',
    };
  }
};

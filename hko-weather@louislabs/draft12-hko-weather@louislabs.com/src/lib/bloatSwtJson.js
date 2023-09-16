'use strict';

var bloatSwtJson = swt_data_json => {
  log('calling bloatSwtJson');

  try {
    return {
      special_weather_tips: swt_data_json.swt[0].desc,
    };
  } catch (error) {
    log(error);
    return {
      temperature: 'error',
      humidity: 'error',
    };
  }
};

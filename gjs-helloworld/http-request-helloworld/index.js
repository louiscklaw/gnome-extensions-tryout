#!/usr/bin/gjs
imports.gi.versions.Soup = '3.4.2';
imports.gi.versions.Gtk = '3.0';

imports.searchPath.push('.');

const sampleFunc = imports.sampleFunc;
const util1 = imports.utils.util1;

const localWeatherForecast = imports.utils.localWeatherForecast;

function main() {
  log('main start is that me ?');
  // sampleFunc.helloworld();
  // util1.testRequest1();
  // util1.helloworld();

  // console.log(localWeatherForecast.get());
  // console.log(nineDayWeatherForecast.get());
  // console.log(currentWeatherReport.get());
  // console.log(weatherWarningSummary.get());
  // console.log(weatherWarningInformation.get());
  // console.log(specialWeatherTips.get());

}

main();

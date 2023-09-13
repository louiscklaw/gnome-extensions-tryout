#!/usr/bin/gjs
imports.gi.versions.Soup = '3.4.2';
imports.gi.versions.Gtk = '3.0';

imports.searchPath.push('.');
imports.searchPath.push('./tests');
imports.searchPath.push('./utils');
// imports.searchPath.push('..');

const sampleFunc = imports.sampleFunc;
const util1 = imports.utils.util1;

const localWeatherForecast = imports.utils.localWeatherForecast;
const nineDayWeatherForecast = imports.utils.nineDayWeatherForecast;
const currentWeatherReport = imports.utils.currentWeatherReport;
const weatherWarningSummary = imports.utils.weatherWarningSummary;
const weatherWarningInformation = imports.utils.weatherWarningInformation;
const specialWeatherTips = imports.utils.specialWeatherTips;

async function main() {
  try {
    log('main start is that me ?');
    // sampleFunc.helloworld();
    // util1.testRequest1();
    // util1.helloworld();

    console.log(await currentWeatherReport.get());
    // console.log(localWeatherForecast.get());
    // console.log(nineDayWeatherForecast.get());
    // console.log(weatherWarningSummary.get());
    // console.log(weatherWarningInformation.get());
    // console.log(specialWeatherTips.get());
  } catch (error) {
    console.log(error.message);
  }
}

(async () => {
  await main();
})();

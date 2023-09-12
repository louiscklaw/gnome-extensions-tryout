// @ts-ignore
const Me = imports.misc.extensionUtils.getCurrentExtension();

const log = Me.imports.log;

// import * as Soup from '@gi-types/soup3';
// const Soup = Me.imports['@gi-types/soup3'];
const Soup = imports.gi.Soup;

let params = {
  amount: '1000',
  sourceCurrency: 'CHF',
  targetCurrency: 'EUR'
 };

export function helloworld() {
  let _httpSession = new Soup.Session();

  let message = Soup.form_request_new_from_hash('GET', URL, params);


  log('say HTTP.ts');
}

require('secret');
const data = require('./lib/currency_names.js');
const CURRENCIES = data.CURRENCIES;

module.exports.function = function findCryptoPrice(currencyname) {

  //CryptoCompare is an open-source API used here to fetch the desired data (price,today high and low) of specified cryptocurrency.
  var url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/"
  var http = require('http');
  var key = secret.get('cmckey');
  var res = http.getUrl(url + "info?symbol=" + currencyname + "&CMC_PRO_API_KEY="+key,{
    format: "json"
  });

  var res2 = http.getUrl("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + currencyname + "&tsyms=USD", {
    format: "json"
  });

  return {
    logo: currencyAbbrTologo(currencyname),
    website: res['data'][currencyname]['urls']['website'],
    description: res['data'][currencyname].description,
    name: res['data'][currencyname].name,
    price: res2['DISPLAY'][currencyname]['USD'].PRICE,
    selected_crypto_sign: res['data'][currencyname].symbol,
    dayhigh: res2['DISPLAY'][currencyname]['USD'].HIGHDAY,
    daylow: res2['DISPLAY'][currencyname]['USD'].LOWDAY,
    supply: res2['DISPLAY'][currencyname]['USD'].SUPPLY,
    mktcap: res2['DISPLAY'][currencyname]['USD'].MKTCAP
  }
}

function currencyAbbrTologo(abbr) {
  let index = CURRENCIES.findIndex(p => p.abbr == abbr);
  return CURRENCIES[index].logo;
}

const data = require('./lib/currency_names.js');
const CURRENCIES = data.CURRENCIES;
require('secret');

module.exports = {
  function: findCryptoPrice
}

function findCryptoPrice(fromcurrency, tocurrency, amount, exchange_id) {
  //setting fiat currency code to USD if not specified by user

  if (tocurrency == null) {
    tocurrency = "USD";
  }
  if (amount == null) {
    amount = "1";
  }

  //CryptoCompare is an open-source API used here to fetch the desired data (price,today high and low) of specified cryptocurrency.
  var url = "https://pro-api.coinmarketcap.com/v1/"
  var http = require('http');
   var key = secret.get('cmckey');
  var res = "";
  var exchange_name = "";
  if (exchange_id == null) {
    exchange_name = "CoinMarketCap";
    res = http.getUrl(url + "tools/price-conversion?symbol=" + fromcurrency + "&convert=" + tocurrency + "&amount=" + amount + "&CMC_PRO_API_KEY="+key, {
      format: "json"
    });
  } else {
    var resi = http.getUrl("https://api.coingecko.com/api/v3/exchanges/" + exchange_id + "/tickers?coin_ids=" + currencyAbbrToName(fromcurrency).toLowerCase().replace(" ", "-"), {
      format: "json"
    });
    exchange_name = resi.name;
    res = http.getUrl(url + "tools/price-conversion?symbol=" + resi['tickers']['1'].target + "&convert=" + tocurrency + "&amount=" + resi['tickers']['1'].last + "&CMC_PRO_API_KEY="+key, {
      format: "json"
    });
  }

  var price = res['data']['quote'][tocurrency].price;
  var priceper = price/amount;
  return {
    logo: currencyAbbrTologo(fromcurrency),
    price: price.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,').toString(),
    selected_crypto_sign: currencyAbbrToName(fromcurrency),
    selected_fiat_sign: currencyAbbrToName(tocurrency),
    amount: amount.toString(),
    exchange_name: exchange_name,
    priceper : priceper.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,').toString()
    
  }
}

function currencyAbbrToName(abbr) {
  let index = CURRENCIES.findIndex(p => p.abbr == abbr);
  return CURRENCIES[index].name;
}

function currencyAbbrTologo(abbr) {
  let index = CURRENCIES.findIndex(p => p.abbr == abbr);
  return CURRENCIES[index].logo;
}

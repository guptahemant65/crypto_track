require('secret');
module.exports.function = function newsapi() {
  var console = require('console');
  var url = "https://cryptocontrol.io/api/v1/public/"
  var http = require('http');
  var cckey = secret.get('cckey');

  res = http.getUrl(url + "news" + "?key=ac3af40a6eab6df7c3b4c117f9998751", {
    format: "json" });

  return res;

}

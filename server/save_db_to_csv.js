var City = require('./databaseinitialization');
var fs = require('fs');

var wstream = fs.createWriteStream('saved_db_copy.csv');
wstream.write('id, city_name, lat, lng, poi \r\n');

City.find().then(function(results) {
  for (var i = 0; i < results.length; i++) {
    wstream.write(`${results[i].id}, ${results[i].city_name}, ${results[i].lat}, ${results[i].lng}, ${results[i].poi} \r\n`);
  };
  wstream.end();
});
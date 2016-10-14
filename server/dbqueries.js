var mongoose = require('mongoose');
var random = require('mongoose-query-random');
var City = require('./databaseinitialization.js');


module.exports = {

  //randomly select a city from a list of names in DB
  randomQuery: function(req, res){
    var names = ['Chicago', 'San Francisco', 'London', 'Istanbul', 'New York'];
      var randomIndex = Math.floor(Math.random() * names.length);
      //use that city name to query database and return tuple of lat/long coords.
      City.find().where('city_name').equals(names[randomIndex]).random(1, true, function (err, cities) {
        //send coordinates back to client via server
        res.send([cities[0].lat, cities[0].lng]);
      });
  }
};

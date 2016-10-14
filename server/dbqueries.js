var mongoose = require('mongoose');
var random = require('mongoose-query-random');
var City = require('./databaseinitialization.js');


module.exports = {

  randomQuery: function(req, res){
    var names = ['Chicago', 'San Francisco', 'London', 'Istanbul', 'New York'];
      var randomIndex = Math.floor(Math.random() * names.length);
      City.find().where('city_name').equals(names[randomIndex]).random(1, true, function (err, cities) {
        res.send([cities[0].lat, cities[0].lng]);
      });
  }
};

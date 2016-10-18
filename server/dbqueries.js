var mongoose = require('mongoose');
var random = require('mongoose-query-random');
var db = require('./databaseinitialization.js');


module.exports = {
  //client expects response object in follwing form
  //  {
  //    position:     {lat: 40,
  //                  lng: 40},
  //    answer:       'Chicago',
  //    poi:          'Navy Pier',
  //    otherAnswers: ['London', 'Istanbul', 'San Francisco', 'New York City']
  //  }

  //randomly select a city and poi from db
  randomQuery: function(callback){
    //call distinct query to get a list of unique cities from database
    module.exports.distinctQuery(function(results) {
      //shuffle the list of cities, returning only 5 in random order
      //random order ensures answer list on client is random order
      var cities = module.exports.shuffleArray(results, 5);
      //select one city from the list to grab a point of database from database
      var randomIndex = Math.floor(Math.random() * cities.length);
      findRandomPOI(cities, cities[randomIndex]);
    });

    //use selected city name to query database and return tuple of lat/long 
    //coords.
    var findRandomPOI = function(cities, city) {
      db.data.find().where('city_name').equals(city).then(function(results) {
      //randomly select a point of interest from results
      var randomIndex2 = Math.floor(Math.random() * results.length);
      //assign lat and lng values
      var lat = results[randomIndex2].lat;
      var lng = results[randomIndex2].lng;
      //create object to send back to client
      var responseObject = 
      {
        position: {lat: lat, lng: lng},
        answer: city,
        poi: results[randomIndex2].poi,
        answerChoices: cities
      };
      //send results back to client
      callback(responseObject);
    })
      .catch(function(err) {
        if(err) {
          //send error back to client
          callback(err)
        }
      })
    }
  },


    //getAllQuery is mainly used for debugging purposes via postman
    //it is a more convenient alternative to logging on to droplet and querying
    //mongodB from there
    getAllQuery: function(city, callback) {
      //if a city was given as a query parameter, return only that cities' results
      if(city) {
        City.find().where('city_name').equals(city).then(function(results) {
          callback(results);
        })
        .catch(function(err) {
          callback(err);
        }); 
      } else {//if no city was given as a query parameter, return all results
        City.find().then(function(results) {
          callback(results);
        })
        .catch(function(err) {
          callback(err);
        })
      }
    },

    //the following function is used for database maintenence.  If a value is 
    //noticed to be incorrect, the databse can be updated by a simple post 
    //request from postman.
    updateEntry: function(lookup, update, callback) {
      db.data.findOneAndUpdate(lookup, update, {new: true}, function(err, result) {
        if(err) {
          callback(err);
        } else {
          callback(result);
        }
      })

    },

    //this function was used for testing purposes but can be used to retrieve a list of all available cities.
    distinctQuery: function(callback) {
      db.data.distinct('city_name').then(function(result) {
        console.log(result, 'result');
        callback(result);
      })
      .catch(function(err) {
        if(err) {
          console.log(err, 'err')
          callback(err);
        }
      })
    },
    //this uses a modified form of the fisher-yates shuffle to shuffle an array
    shuffleArray: function(array, numOfItems) {
        var originalLength = array.length;
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m > originalLength - numOfItems) {

          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);

          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
        //return a array with a length of numOfItems
        var results = array.slice(originalLength - numOfItems);
        console.log('shuffleresults', results);
        return results;
    }
};

// module.exports = {

//   //randomly select a city from a list of names in DB
//   randomQuery: function(callback){
//     var names = ['Chicago', 'San Francisco', 'London', 'Istanbul', 'New York'];
//       var randomIndex = Math.floor(Math.random() * names.length);
//       //use that city name to query database and return tuple of lat/long coords.
//       City.find().where('city_name').equals(names[randomIndex]).random(1, true, function (err, cities) {
//         if (err) {
//           callback(err)
//         } else {
//         //send coordinates back to client via server
//           callback([cities[0].lat, cities[0].lng]);  
//         }
//       });
//   }
// };
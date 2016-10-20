var mongoose = require('mongoose');
var db = require('./databaseinitialization.js');


module.exports = {


  //-------USED WHEN NEW GAME IS STARTED VIA HOMEPAGE------//
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

    //use selected city name to query database and return lat/long tuple
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
        streetViewParams: {heading: results[randomIndex2].heading, pitch: results[randomIndex2].pitch},
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


  //-------USED WHEN NEW GAME IS STARTED VIA SHARED LINK-------//
  challengeQuery: function(link, callback){
    console.log(link);
    //return 5 random cities from DB
    module.exports.distinctQuery(function(results) {
      //shuffle the list of cities, returning only 5 in random order
      //random order ensures answer list on client is random order
      var cities = module.exports.shuffleArray(results, 5);


      //query DB based on querystring attached to end of shared link,
      //matching query with unique id for the POI in DB
      lookupPOI(cities, link);
    });

    var lookupPOI = function(cities, id){
      db.data.findById(id, function(err, result){
        if(err){
          callback(err);
        }
        var challengePoint = result;

        //check to see if correct answer is in random shuffled answer array
        if (cities.indexOf(challengePoint.city_name) === -1) {
          //If it is not, we must replace one city 
          //with the correct answer
          cities[Math.floor(Math.random()*5)] = challengePoint.city_name;
        } 


        //use result to build expected response object for client
        var responseObject =
        {
          position: {lat: challengePoint.lat, lng: challengePoint.lng},
          streetViewParams: {heading: challengePoint.heading, pitch: challengePoint.pitch},
          answer: challengePoint.city_name,
          poi: challengePoint.poi,
          answerChoices: cities
        };
        callback(responseObject);
      });
    };
  },


  //------------USED TO ADD A NEW POI TO THE DB------------//
  addToDatabase: function(point, callback) {
    //check to see if poi already exists
     db.data.findOne({poi: point.poi}).exec(function(err, found){
       if(err){
         callback(err, null);
       }
       //if it does, return it to the server
       else if(found){
         callback(null, found);
       } else {
         //if not, create it
        var newPoint = new db.data({
           city_name: point.city,
           lat: point.lat,
           lng: point.lng,
           poi: point.poi,
           heading: point.heading,
           pitch: point.pitch,
           state: point.state || 'not in US',
           country: point.country
         });
         newPoint.save(function(err){
           if(err){
             console.error(err);
           }
           console.log(newPoint._id);
           callback(null, newPoint);
         });
       };
     });
  },


  //--------SHUFFLE CITY ARRAY VIA MODIFIED FISHER-YATES-------//
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
    return results;
  },




    //-------------------MAINTANANCE FUNCTIONS------------------------//

    //this is mainly used for debugging purposes via postman
    //it is a more convenient alternative to logging on to droplet and querying
    //mongodB from there
    getAllQuery: function(city, callback) {
      //if a city was given as a query parameter, return only that cities' results
      if(city) {
        db.data.find().where('city_name').equals(city).then(function(results) {
          callback(results);
        })
        .catch(function(err) {
          callback(err);
        });
      } else {//if no city was given as a query parameter, return all results
        db.data.find().then(function(results) {
          callback(results);
        })
        .catch(function(err) {
          callback(err);
        })
      }
    },


    //the following function is used for database maintenence.  If a value is
    //noticed to be incorrect, the database can be updated by a simple post
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

    //this function was used for testing purposes but can also be used to retrieve a
    //list of all available cities.
    distinctQuery: function(callback) {
      db.data.distinct('city_name').then(function(result) {
        callback(result);
      })
      .catch(function(err) {
        if(err) {
          console.log(err, 'err')
          callback(err);
        }
      })
    }
};

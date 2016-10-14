var mongoose = require('mongoose');
var fs = require('fs');

//in order for the following connection to work, I had to set the bind_ip variable inside the etc/mongo.config file (on the remote server) to 0.0.0.0.  This allows the database to accept connections from networks outside of the local machine.
mongoose.connect('mongodb://104.236.129.131/mapper', function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log('successfully connected to database');
  }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/*
THIS FILE POPULATES/INITIALIZES THE MONGODB DATABASE FROM A CSV FILE THAT LISTS THE ID, CITY NAME, LATITUDE, LONGITUDE AND POINT OF INTEREST NAME FOR EACH POINT OF INTEREST.  ONCE THE DATABASE IS DEPLOYED, THIS WILL NOT NEED TO BE RUN ANYMORE.  ALL SUBSEQUENT ADDITIONS TO THE DATABASE WILL OCCUR VIA A SERVER REQEUST
*/



//CREATE A MONGOOSE SCHEMA FOR THE ENTRYSCHEMA DOCUMENT
var entrySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },

  city_name: {
    type: String,
    required: true,
    unique: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  poi: {
    type: String,
    required: true
  }
});

//ASSIGN THE MODEL CONSTRUCTOR TO A VARIABLE
var entry = mongoose.model('entrySchema', entrySchema);
module.exports = entry;


//USE FS READFILE TO READ THE CSV FILE INTO MEMORY
// //NOTE ***IF CSV FILE IS LARGE, THE FOLLOWING MAY NEED TO BE REFACTORED
// //TO INCLUDE STREAMING/PIPING SO AS TO NOT TAKE UP SO MUCH VOLITILE MEMORY
fs.readFile('./locationPoints.csv', 'utf-8', (err, data) => {
  if (err) throw err;
  //SPLIT EACH ENTRY INTO A SEPARATE STRING
  var array = data.split('\r\n');
  //REMOVE THE TITLE ROW
  array.shift();
  //INITIALIZE THE FINAL ARRAY
  var finalArray = [];

  //TRANFORM EACH ENTRY INTO AN OBJECT THAT CAN BE ADDED TO MONGODB
  array.forEach(function(entry) {
    //SPLIT EACH ENTRY INTO INDIVIDUAL ENTRY PROPERTIES
    var entryArray = entry.split(',');
    //CREATE AN OBJECT FOR EACH ENTRY - CHANGING STRINGS TO NUMBER FOR NUMBER
    //PROPERTIES
    var entryObject = {
      id: Number(entryArray[0]),
      city_name: entryArray[1],
      lat: Number(entryArray[2]),
      lng: Number(entryArray[3]),
      poi: entryArray[4]
    }
    //PUSH THE MODIFIED OBJECT TO THE ARRAY
    finalArray.push(entryObject);
  });
  //USE ENTRY.CREATE TO CREATE NEW INSTANCES OF AN ENTRY AND TO SAVE THEM TO THE DATABASE
  entry.create(finalArray, function(err, results) {
    if(err) throw err;
    console.log('success');
  })
});

var mongoose = require('mongoose');
var fs = require('fs');

//In order for the following connection to work, I had to set the bind_ip variable
//inside the etc/mongo.config file (on the remote server) to 0.0.0.0.
//This allows the database to accept connections from networks outside of the local machine.
mongoose.connect('mongodb://104.236.129.131/mapper', function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log('successfully connected to database');
  }
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



//CREATE A MONGOOSE SCHEMA FOR THE ENTRYSCHEMA DOCUMENT
var entrySchema = new mongoose.Schema({

  city_name: {
    type: String,
    required: true
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
  },
  heading: {
    type: Number,
    required: true
  },
  pitch: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: true
  }
});

//CREATE A MONGOOSE SCHEMA FOR THE CITY DOCUMENTS - THIS TABLE WILL JUST
//STORE THE CITY NAMES WITH A UNIQUE ID
var citylistSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  city_name: {
    type: String,
    required: true,
    unique: true
  }
});

//ASSIGN THE MODEL CONSTRUCTOR TO A VARIABLE
var entry = mongoose.model('entrySchema', entrySchema);
var city = mongoose.model('citylistSchema', citylistSchema);
module.exports.data = entry;
module.exports.cityList = city;
module.exports.db = db;

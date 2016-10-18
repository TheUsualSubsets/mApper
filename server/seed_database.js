
/*
THIS FILE POPULATES/INITIALIZES THE MONGODB DATABASE FROM A CSV FILE THAT LISTS THE ID, CITY NAME, LATITUDE, LONGITUDE AND POINT OF INTEREST NAME FOR EACH POINT OF INTEREST.  ONCE THE DATABASE IS DEPLOYED, THIS WILL NOT NEED TO BE RUN ANYMORE.  ALL SUBSEQUENT ADDITIONS TO THE DATABASE WILL OCCUR VIA A SERVER REQEUST
Change the variable fileToRead to reflect the path of the .csv file that you would like to use to seed the databse with.
*/

var db = require('./databaseinitialization.js');
var fileToRead = null; //CHANGE THIS TO REFLECT FILE YOU WANT TO ADD TO DATABASE

//POPLUATE DATABASE IF FILE PATH IS NOT NULL
if(fileToRead) {
  populateDatabase(fileToRead);
}






//USE FS READFILE TO READ THE CSV FILE INTO MEMORY
//NOTE ***IF CSV FILE IS LARGE, THE FOLLOWING MAY NEED TO BE REFACTORED
//TO INCLUDE STREAMING/PIPING SO AS TO NOT TAKE UP SO MUCH VOLITILE MEMORY
var populateDatabase = function(file) {
  fs.readFile(file, 'utf-8', (err, data) => {
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
    //USE DB.DATA.CREATE TO CREATE NEW INSTANCES OF AN ENTRY AND TO SAVE THEM TO THE DATABASE
    db.data.create(finalArray, function(err, results) {
      if(err) throw err;
      console.log('success');
    })
  });
};
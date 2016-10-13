var express = require('express');
var request = require('request');
var mongo = require('mongodb');
var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', function(error){
  console.error.bind(console, 'connection error: ')
});
db.once('open', function(){
  console.log('connected to MONGODB');
})

var app = express();
var PORT = process.env.PORT || 9001;

app.use(express.static(__dirname + '/client'));

var Map;
request('https://maps.googleapis.com/maps/api/js?key=AIzaSyB0HuOvHVC8Rs8ZLtFoYfkoG2OJpxaZR70', function(err, res, body){
  if(err){
    console.error('Oops: ', error);
  }
   Map = body;
   res.send(200);
});


app.get('/', function(req, res){
  res.send(200, Map);
})

//on load - send API request
  //res.send(map obect) to client
//app.get('/newGame') --> we make a request to DB
  //get an array of 5 cities from DB
    //itarate over array and set one random index key to 'true' (dafault is false)
    //send it to client


app.listen(PORT, function(){
  console.log('listening on PORT ' + PORT);
})

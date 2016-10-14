var express = require('express');
var request = require('request');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var query = require('./server/dbqueries.js');


var app = express();
app.use(bodyParser.json());
var PORT = process.env.PORT || 9001;

app.use(express.static(__dirname + '/client'));

var Map;
request('https://maps.googleapis.com/maps/api/js?key=AIzaSyB0HuOvHVC8Rs8ZLtFoYfkoG2OJpxaZR70', function(err, res, body){
  if(err){
    console.error('Oops: ', err);
  }
   Map = body;
});


app.get('/newGame', function(req, res){
  query.randomQuery(req, res);
});



app.listen(PORT, function(){
  console.log('listening on PORT ' + PORT);
})

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


//------------------------------MAIN ROUTES--------------------------//

app.get('/newGame', function(req, res){
  //check if there was a querystring (from a shared link) attached to the req
  if(req.query.q){
    console.log(req.query.q);
    //if there was, query DB based on that querystring
    query.challengeQuery(req.query.q, function(result){
      res.send(result);
      console.log(result);
    })
    //if not, return a random location
  } else {
      query.randomQuery(function(result) {
        res.send(result);
      });
  }
});


app.post('/api/addPoint', function(req, res) {
  //add the new point to the database
  query.addToDatabase(req.body, function(err, newEntry){
    if(err){
      console.error(err);
    }
    //the above query returns the newly-added point
    //extract the unique ID and create a url using the ID as a querystring
    var ID = newEntry._id;
    var testIP = 'http://localhost:9001/';
    // var IP = 'http://104.236.129.131:9001/'

    //send the url back to the client
    console.log(testIP + 'newGame?q=' + ID);
    // console.log(IP + 'newGame?q=' + ID)
    res.send(testIP + 'newGame?q=' + ID);
    // res.send(IP + 'newGame?q=' + ID);
  });
})




//---------------------------DB MAINTANANCE--------------------------//
//the following functions are used for maintaining/monitoring the database only
//they are not used in rendering the site or for gameplay


//for easily obtaining all entries in the DB via Postman
app.get('/api/getAll', function(req, res) {
  query.getAllQuery(req.query.city, function(results) {
    res.send(results);
  })
})

//for updating incorrect DB entries
app.post('/api/update', function(req, res) {
  query.updateEntry(req.body.lookup, req.body.update, function(results) {
    res.send(results);
  })
})

//a Jeff thing that I'm not sure what it does...
app.get('/api/distinct', function(req, res) {
  query.distinctQuery(function(results) {
    res.send(results);
  })
})


app.get('/scores', function(req, res) {
    query.getScores(function(results) {
      res.send(200, results);
  })

})

app.post('/scores', function(req, res) {
  query.addScores(req.body, function(results) {
    res.send(200);
  });

})
app.listen(PORT, function(){
  console.log('listening on PORT ' + PORT);
})

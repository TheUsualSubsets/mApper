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


app.get('/newGame', function(req, res){
  //if req.query - use that query to lookup
    //res.send that result
  query.randomQuery(function(results) {
    console.log(results);
    res.send(results);
  });
});

app.get('/api/getAll', function(req, res) {
  query.getAllQuery(req.query.city, function(results) {
    res.send(results);
  })
})

app.post('/api/update', function(req, res) {
  query.updateEntry(req.body.lookup, req.body.update, function(results) {
    res.send(results);
  })
})

app.post('/api/addPoint', function(req, res) {
  query.addToDatabase(req.body, function(newEntry){
    console.log('ID: ', newEntry._id);
    var id = newEntry._id;
    var link = 'http://104.236.129.131/'
    res.send(link + id);
  });
})

app.get('/api/distinct', function(req, res) {
  query.distinctQuery(function(results) {
    res.send(results);
  })
})


app.get('/scores', function(req, res) {
    query.getScores(function(results) {
      console.log(results);
      res.send(200, results);
  })

})

app.post('/scores', function(req, res) {
  console.log(req)

  query.addScores(req.body, function(results) {
    res.send(200);
  });

})

app.listen(PORT, function(){
  console.log('listening on PORT ' + PORT);
})

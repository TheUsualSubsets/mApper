var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loco');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });

var PointOfInterestSchema = new mongoose.Schema({
  name: {
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
  }   
});

var CitySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true,
    unique: true
  },
  points: [PointOfInterestSchema]
});



var city = mongoose.model('CitySchema', CitySchema);
var chicago = {id: 3, name: 'San Francisco'};
var poi = mongoose.model('poi', PointOfInterestSchema);
var bean = {name: 'lalala', lat: 1, lng: 2};

// city.create(chicago, function (err, chicago) {
//   if (err) return handleError(err);
//   console.log(chicago);
// });
city.findOne({name: 'San Francisco'}).then(function(document) {
  console.log('document', document);
  document.points.push(bean);
  document.save();
})
// console.log(city.find);

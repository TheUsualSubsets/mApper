angular.module('challenge', [])

.controller('challengeController', ['$scope', 'GeoCoder', 'AddNewPoint', function($scope, GeoCoder, AddNewPoint){
  //initialize variables
  //$scope.appear is used for animations when generating links
  $scope.appear = false;
  //$scope.place is the value in the map search box
  $scope.place;

  //this function serves to update all the $scope variables to contain the 
  //current information from the map and streetview obects, so that when the 
  //user decides to generate a link, the information that is sent to the 
  //database will be correct.

  $scope.updateInfo = function() {
    //create an object that we will send to server to input into the database
    $scope.locationObj =
    {
      lat: $scope.map.streetView.getPosition().lat(),
      lng: $scope.map.streetView.getPosition().lng(),
      heading: $scope.map.streetView.getPov().heading,
      pitch: $scope.map.streetView.getPov().pitch
    }
    //attempt to pull the current city, state, and country data from the 
    //current lattitude and longitude values of the map.
    //This will help mitigate mispellings of cities in the database
    //This is not a perfect science due to nature of geocoding with google:/
    //maybe option in the future would be to have a database of city names
    //that the user must select the city from in order to validate the data?
    GeoCoder.geocode({location: {lat: $scope.locationObj.lat, lng: $scope.locationObj.lng}}).then(function(result) {
      var addressComponents = result[result.length - 3].formatted_address.split(',');
      if (addressComponents.length === 2) {
        $scope.locationObj.country = addressComponents[1];
      } else {
        $scope.locationObj.country = addressComponents[2];
        $scope.locationObj.state = addressComponents[1];
      }

      $scope.locationObj.city = addressComponents[0];
      console.log($scope.locationObj, 'geocode - location obj')
    })
  };

  //mapInitialized is an event emitted from the ngmap directive upon map load
  $scope.$on('mapInitialized', function(event, map) {
    //set the google map equal to a $scope variable so that we can access it's properties
    $scope.map = map;
    //apply our cool themes
    $scope.map.set('styles', $scope.silver);
  });

  //user has selected a location they'd like to turn into a link
  $scope.addToDatabase = function() {
    console.log('adding in client', $scope.locationObj);
    // AddNewPoint.addPoint($scope.locationObj);
    AddNewPoint.addPoint($scope.locationObj, function(link){
      console.log('returned from DB: ', link)
    });
  };

  //use map search box value to update current location of the map
  $scope.updateToPlace = function(place) {
    GeoCoder.geocode({address: $scope.place}).then(function(result){
      $scope.map.setCenter(result[0].geometry.location);
      $scope.map.streetView.setPosition(result[0].geometry.location);
      $scope.map.setZoom(15);
    })
  };

  //map styles!
  $scope.retro = [{"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#c9b2a6"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"color":"#dcd2be"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},{"featureType":"administrative.neighborhood","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#93817c"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a5b076"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#447530"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fdfcf8"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f8c967"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#e9bc62"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#e98d58"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#db8555"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#806b63"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"color":"#8f7d77"}]},{"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"color":"#ebe3cd"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#b9d3c2"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#92998d"}]}];

  $scope.silver = [{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]}];

    $scope.custom = [{"elementType":" geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];


}])

//use addnewpoint factory for communication with server
.factory('AddNewPoint', ['$http', function($http){
  var addPoint = function(point, callback){
    $http({
      method: 'POST',
      url: '/api/addPoint',
      data: JSON.stringify(point)
    }).success(function(returned){
      callback(returned);
    })
  };
    return {addPoint: addPoint};
}]);

angular.module('addToDatabase', [])

.controller('addToDatabaseController', ['$scope', 'GeoCoder', function($scope, GeoCoder){
  $scope.place;
  $scope.updateInfo = function() {
    $scope.locationObj = 
    {
      lat: $scope.svp.getPosition().lat(),
      lng: $scope.svp.getPosition().lng(),
      heading: $scope.svp.getPov().heading,
      pitch: $scope.svp.getPov().pitch
    }
    GeoCoder.geocode({location: {lat: $scope.locationObj.lat, lng: $scope.locationObj.lng}}).then(function(result) {
      console.log('dang geocoding result', result);
      var addressComponents = result[result.length - 3].formatted_address.split(',');
      if (addressComponents.length === 2) {
        $scope.locationObj.country = addressComponents[1];
      } else {
        $scope.locationObj.country = addressComponents[2];
        $scope.locationObj.state = addressComponents[1]; 
      }

      $scope.locationObj.city = addressComponents[0];
      console.log($scope.locationObj);
    })
  };
  $scope.$on('mapInitialized', function(event, map) {
    $scope.svp = map.streetView;
    $scope.map = map;
  });
  $scope.addToDatabase = function() {

  };
  $scope.updateToPlace = function(place) {
    console.log($scope.map)
    console.log(place);
    GeoCoder.geocode({address: $scope.place}).then(function(result){
      console.log(result[0].geometry.location);
      $scope.map.setCenter(result[0].geometry.location)
    })
  }





}])
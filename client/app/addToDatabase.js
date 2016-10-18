angular.module('addToDatabase', [])

.controller('addToDatabaseController', ['$scope', 'GeoCoder', function($scope, GeoCoder){
  $scope.place;
  $scope.updateInfo = function() {
    $scope.locationObj = 
    {
      lat: $scope.map.streetView.getPosition().lat(),
      lng: $scope.map.streetView.getPosition().lng(),
      heading: $scope.map.streetView.getPov().heading,
      pitch: $scope.map.streetView.getPov().pitch
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
    $scope.map = map;
  });
  $scope.addToDatabase = function() {

  };
  $scope.updateToPlace = function(place) {
    console.log($scope.map)
    console.log(place);
    GeoCoder.geocode({address: $scope.place}).then(function(result){
      console.log(result[0].geometry.location);
      console.log($scope.svp)
      $scope.map.setCenter(result[0].geometry.location);
      $scope.map.streetView.setPosition(result[0].geometry.location);
    })
  }

}])
angular.module('addToDatabase', [])

.controller('addToDatabaseController', ['$scope', 'GeoCoder', 'AddNewPoint', function($scope, GeoCoder, AddNewPoint){
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
      var addressComponents = result[result.length - 3].formatted_address.split(',');
      if (addressComponents.length === 2) {
        $scope.locationObj.country = addressComponents[1];
      } else {
        $scope.locationObj.country = addressComponents[2];
        $scope.locationObj.state = addressComponents[1];
      }

      $scope.locationObj.city = addressComponents[0];
    })
  };
  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });


  $scope.addToDatabase = function() {
    console.log('adding in client', $scope.locationObj);
    AddNewPoint.addPoint($scope.locationObj);
  };


  $scope.updateToPlace = function(place) {
    GeoCoder.geocode({address: $scope.place}).then(function(result){
      $scope.map.setCenter(result[0].geometry.location);
      $scope.map.streetView.setPosition(result[0].geometry.location);
    })
  }

}])

.factory('AddNewPoint', ['$http', function($http){
  var addPoint = function(point){
    console.log('adding in factory', point);
    $http.post('/api/addPoint', point)
      .success(console.log('success!', point));
    };
    return {addPoint: addPoint};
}]);

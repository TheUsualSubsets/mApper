angular.module('App', 'Game', [])
.controller('mapController', ['$scope', 'Map', function ($scope, Map){
$scope.testLat = 37.773972;
$scope.testLng = -122.431297;
}])
.config(function ($routeProvider){
	$routeProvider
		.when('/game', {
			templateUrl:'app/game.html',
			controller: 'gameController'
		})
})
.factory('Map', function ($http){
	return {
		getMaps: function (){
			var testUrl = //express
			$http.get('/').success(function(result){ //enter express URL
				console.log(result)
				return result; 
			})
		}
	}
})
angular.module('App', ['ngRoute'])
.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: '/app/info.html'
	})
})
.controller('mapController', ['$scope', 'Map', '$http', function ($scope, Map){
$scope.testLat = 37.773972;
$scope.testLng = -122.431297;
$scope.StartGame = function(){
	Map.getMaps();
}
}])
.factory('Map', function ($http){
	return {
		getMaps: function (){
			var testUrl;
			$http.get('/newGame').success(function(result){ //enter express URL
				console.log(result)
				return result; 
			})
		}
	}
});
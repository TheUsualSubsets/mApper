angular.module('App', ['ngRoute', 'ngMap', 'Game', 'homePage', 'addToDatabase'])
.config(function($routeProvider){
	$routeProvider


	////david - start - also added homePage depend line 1///
	.when('/', {
		templateUrl: '/app/info.html',
		controller: 'homePageCtrl'
	///david - end///
	})
	.when('/game', {
		templateUrl: '/app/game.html',
		controller: 'gameController'
	})
	.when('/addToDatabase', {
		templateUrl: 'app/addToDatabase.html',
		controller: 'addToDatabaseController'
	})
	.otherwise({
		redirectTo: '/game'
	})
})
.controller('mapController', ['$scope', 'Map', function ($scope, Map){
	$scope.count = 0; 
	$scope.compareAnswer = function (answer){
		console.log(answer.answer)
		if ($scope.answer === answer.answer){
			$scope.count++;
			console.log($scope.count);
			console.log($scope.show);
		} else {
			$scope.count = 0;
		}
		$scope.StartGame();
	}
	$scope.StartGame = function(){
		console.log($scope.show, 'before getMpas function')
		Map.getMaps(function(result){
			console.log('start game function', result);
			$scope.lat = result.position.lat;
			$scope.lng = result.position.lng; 
			$scope.answer = result.answer; 
			$scope.poi = result.poi;
			$scope.answerChoices = result.answerChoices;
			
	})
}
}])

//{
  // position: {lat: 36.2048, lng: 138.2529},
  // answer:'Chicago',
  // poi:'Navy Pier',
  // otherAnswers: ['London', 'Istanbul', 'San Francisco', 'New York City']
  // }



.factory('Map', function ($http){
		var getMaps = function (callback){
			$http.get('/newGame').success(function(result){ //enter express URL
				console.log('map factory', result)
				callback(result);
			})
		};
		return {getMaps: getMaps};
});

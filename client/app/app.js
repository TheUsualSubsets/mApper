angular.module('App', ['ngRoute', 'ngMap', 'homePage', 'challenge', 'ui.bootstrap', 'ngclipboard'])

.config(function($routeProvider){
	$routeProvider


	.when('/', {
		templateUrl: '/app/info.html',
		controller: 'homePageCtrl'
	})
	.when('/game', {
		templateUrl: '/app/game.html',
		controller: 'mapController'
	})
	.when('/challenge', {
		templateUrl: 'app/challenge.html',
		controller: 'challengeController'
	})
	.otherwise({
		redirectTo: '/game'
		//any link with querystring will be redirected to this view
	})
})
.controller('mapController', ['$scope', 'Map', function ($scope, Map){
	$scope.count = 0;
	$scope.toggle = true;
	$scope.buttonToggle = true;
	$scope.incorrect = true;
	$scope.compareAnswer = function (answer){
		if ($scope.answer === answer.answer){
			$scope.count++;
			$scope.toggle = !$scope.toggle;
			$scope.buttonToggle = !$scope.toggle;
		} else {
			$scope.count = 0;
			$scope.incorrect = !$scope.incorrect;
			$scope.buttonToggle = !$scope.buttonToggle;
		}
		setTimeout(function(){
			
		$scope.StartGame();
		}, 2500)

	}
	$scope.StartGame = function(){
		var querystring = window.location.hash.slice(6);
		Map.getMaps(function(result){
			console.log(result, 'getmap result')
			$scope.toggle = true;
			$scope.buttonToggle = true;
			$scope.incorrect = true;
			$scope.lat = result.position.lat;
			$scope.lng = result.position.lng;
			$scope.answer = result.answer;
			$scope.poi = result.poi;
			$scope.answerChoices = result.answerChoices;
			$scope.heading = result.streetViewParams.heading;
			$scope.pitch = result.streetViewParams.pitch;

		})
	}
	$scope.StartGame();

}])



.factory('Map', ['$http', '$location', function ($http, $location){
		var getMaps = function (callback){
			//set base url - will be called for standard gameplay started from homepage
			var url = '/newGame';
			//get querystring from window url
			var path = $location.url().slice(5);
			if(path){
				//if there is a querystring, add it to the base url
				url = url + path;
				
			}
			//send GET request to server for location for new game
			$http.get(url).success(function(result){
				callback(result);
			})
		};
		return {getMaps: getMaps};
}]);

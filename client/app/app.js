<<<<<<< HEAD

angular.module('App', ['ngRoute', 'ngMap', 'homePage', 'addToDatabase', 'Highscores', 'ui.bootstrap'])
.config(function($routeProvider){
	$routeProvider

=======
angular.module('App', ['ngRoute', 'ngMap', 'Game', 'homePage', 'addToDatabase', 'Highscores', 'ui.bootstrap'])
.config(function($routeProvider){
	$routeProvider

	////david - start - also added homePage depend line 1///
>>>>>>> 5595a5909459717a0b312f64e3dfe84ceb86fa68
	.when('/', {
		templateUrl: '/app/info.html',
		controller: 'homePageCtrl'
	})
	.when('/game', {
		templateUrl: '/app/game.html',
		controller: 'mapController'
	})
	.when('/addToDatabase', {
		templateUrl: 'app/addToDatabase.html',
		controller: 'addToDatabaseController'
	})
	.when('/scores', {
		templateUrl: 'app/highScores/highscores.html',
		controller: 'scoreController'
	})
	.otherwise({
		redirectTo: '/game'
		//any link with querystring will be redirected to this view
	})
})
<<<<<<< HEAD

=======
>>>>>>> 5595a5909459717a0b312f64e3dfe84ceb86fa68
.controller('mapController', ['$scope', 'Map','scoreFactory', function ($scope, Map, scoreFactory){
	$scope.count = 0; 
	$scope.toggle = true;
	$scope.buttonToggle = true;
	$scope.incorrect = true;
	$scope.user;
	$scope.topScores = [];



	$scope.compareAnswer = function (answer){
		if ($scope.answer === answer.answer){
			$scope.count++;
			$scope.toggle = !$scope.toggle;
			$scope.buttonToggle = !$scope.toggle;
		} else {
			if ($scope.user) {
			  scoreFactory.addScore($scope.user, $scope.count);
			}
			$scope.count = 0;
			$scope.incorrect = !$scope.incorrect;
			$scope.buttonToggle = !$scope.buttonToggle;
		}
		setTimeout(function(){
			$scope.StartGame();
		}, 2500)

	}
	$scope.StartGame = function(){
		console.log($scope.show, 'before getMpas function')
		Map.getMaps(function(result){
			$scope.toggle = true;
			$scope.buttonToggle = true;
			$scope.incorrect = true;
			$scope.lat = result.position.lat;
			$scope.lng = result.position.lng;
			$scope.answer = result.answer;
			$scope.poi = result.poi;
			$scope.answerChoices = result.answerChoices;

		})
	}
	$scope.getUserInfo = function(value) {
		$scope.user = value;
		$scope.userName = "";

	};

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

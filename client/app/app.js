angular.module('App', ['ngRoute', 'ngMap', 'Game', 'homePage', 'addToDatabase', 'Highscores', 'ui.bootstrap'])
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
	.when('/scores', {
		templateUrl: 'app/highScores/highscores.html',
		controller: 'scoreController'
	})
	.otherwise({
		redirectTo: '/game'
	})
})
.controller('mapController', ['$scope', 'Map','scoreFactory', function ($scope, Map, scoreFactory){
	$scope.count = 0; 
	$scope.toggle = true;
	$scope.buttonToggle = true;
	$scope.incorrect = true;
	$scope.user;
	$scope.topScores = [];



	$scope.compareAnswer = function (answer){
		console.log(answer.answer)
		if ($scope.answer === answer.answer){
			$scope.count++;
			$scope.toggle = !$scope.toggle;
			$scope.buttonToggle = !$scope.toggle;
			console.log($scope.count);
			console.log($scope.show);
		} else {
			scoreFactory.addScore($scope.user, $scope.count)
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
		scoreFactory.getScores(function(result){
			result.data.forEach(function(score){
				$scope.topScores.push(score)
			})
			
			console.log('scores', $scope.topScores);
		})
		Map.getMaps(function(result){
			console.log('start game function', result);
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
	var getUserInfo = function() {
		$scope.user = prompt('Enter your initials (3 letters or digits)');
		if ($scope.user.length > 3) {
			alert('Length exceeded, please enter three initials');
			getUserInfo();
		} 

	};

	getUserInfo()

	$scope.StartGame();
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

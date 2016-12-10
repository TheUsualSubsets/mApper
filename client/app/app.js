
angular.module('App', ['ngRoute', 'ngMap', 'challenge', 'Highscores', 'ngclipboard', 'ngCookies'])

.config(function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: '/app/info.html',
	})
	.when('/game', {
		templateUrl: '/app/game.html',
		controller: 'mapController'
	})
	.when('/challenge', {
		templateUrl: 'app/challenge.html',
		controller: 'challengeController'
	})
	.when('/scores', {
		templateUrl: 'app/highScores/highscores.html',
		controller: 'scoreController'
	})
  .when('/about', {
    templateUrl: 'app/about.html'
  })
	.otherwise({
		redirectTo: '/game'
		//any link with querystring will be redirected to this view
	})
})

.controller('mapController', ['$scope', 'Map', '$location', 'scoreFactory', '$cookies', '$route', '$timeout', function ($scope, Map, $location, scoreFactory, $cookies, $route, $timeout){
	$scope.count = 0;
	$scope.toggle = true;
	$scope.buttonToggle = false;
	$scope.incorrect = true;
	$scope.user;
	$scope.isUser = true;
	$scope.displayOptions = false;
	$scope.topScore;

	$scope.compareAnswer = function (answer){
    //answer is correct - increase score and display 'correct' div
		if ($scope.answer === answer.answer){
			$scope.count++;
			$cookies.count = $scope.count;
			$scope.toggle = !$scope.toggle;
			$scope.buttonToggle = !$scope.buttonToggle;

		} else {
			//answer is incorrect - if user is logged-in, save score and reset to zero
			//then display 'incorrect' div
			if ($scope.user) {
			  scoreFactory.addScore($scope.user, $scope.count);
			}
			$scope.count = 0;
			$cookies.count = $scope.count;
			$scope.incorrect = !$scope.incorrect;
			$scope.buttonToggle = !$scope.buttonToggle;
		}
		//toggles display options inside 'correct' and 'incorrect' divs
		//(we do not automatically regenerate a new location
		//if the game was started from a shared link, so we do not need to display the
		//'hang tight' message)
		if($location.url() !== '/game'){
			$scope.link = true;
		}

		//after answer has been given, either generate a new location, or display
		//options for continuing
		$timeout(function(){
			//if game was started via shared link, show options
			if($location.url() !== '/game'){
				$scope.toggleOptionsDisplay();
			} else {
				window.location.href = '#/game';
				window.location.reload();	
			}
		}, 2000)

	}

	$scope.StartGame = function(){
		//call to DB to get a new data point
		Map.getMaps(function(result){
			//toggle on answer buttons, toggle off any displayed instructions
			$scope.toggle = true;
			$scope.infoToggle = false;
			$scope.linkToggle = false;
			$scope.buttonToggle = true;
			$scope.incorrect = true;
			//insert results from DB into html via scope
			$scope.lat = result.position.lat;
			$scope.lng = result.position.lng;
			$scope.answer = result.answer;
			$scope.poi = result.poi;
			$scope.answerChoices = result.answerChoices;
			$scope.heading = result.streetViewParams.heading;
			$scope.pitch = result.streetViewParams.pitch;
		})

	}

  //toggle instructions (displayed before game starts)
	$scope.toggleOptionsDisplay = function(){
		$scope.displayOptions = !$scope.displayOptions;
		return $scope.displayOptions;
	}

	//save user info
	$scope.getUserInfo = function(value) {
	    if (!$cookies.user) {
	    	console.log('getUserInfo no cookies.user', $cookies.user)
		  $scope.user = value;
		  $cookies.user = value;
	    } else {
	    	$scope.user = $cookies.user;
	    }
		$scope.isUser = false;

	};

	$scope.showAnswers = function() {
		document.getElementsByClassName('answers')[0].style.visibility = 'visible';
		document.getElementById('showanswer').style.visibility = 'hidden';
		document.getElementById('hideanswers').style.visibility = 'visible'
		console.log('yeppp')
	}

	$scope.hideAnswers = function() {
		document.getElementsByClassName('answers')[0].style.visibility = 'hidden';
		document.getElementById('showanswer').style.visibility = 'visible';
		document.getElementById('hideanswers').style.visibility = 'hidden';
		console.log('yeppp')
	}

	$scope.updateUserInfo = function(value) {
	  $cookies.user = value;
	  $scope.user = value;
		$scope.isUser = false;
		$cookies.count = 0;
		$scope.count = 0;

	};
  //remove current user cookie
	$scope.clearUser = function() {
		$scope.buttonToggle = !$scope.buttonToggle;
		$cookies.user = null;
		$scope.infoToggle = true;
		$scope.isUser = true;
	}

	//if a user is logged in, do not display instructions every time they return to
	//the game page, just start game
	if ($cookies.user) {
		$scope.user = $cookies.user;
		$scope.isUser = false;
		$scope.count = $cookies.count;
		console.log('there is a cookies.user', $cookies.user);
		$scope.StartGame();
		// $scope.getUserInfo();
	} else if ($location.url() !== '/game') {
		console.log('started via shared link');
		//if game was started via shared link AND user is not
		//logged in, show 'challenged by a friend' instructions
		$scope.linkToggle = true;
	} else {
		console.log('there is not a cookies.user', $cookies.user);
		$scope.infoToggle = true;
	}

	scoreFactory.getScores(function(result){
		$scope.topScore = result.data[0];
	})
}])

.factory('Map', ['$http', '$location',  function ($http, $location){
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

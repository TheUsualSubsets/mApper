angular.module('Highscores', [])
	.controller('scoreController', ['$scope', 'scoreFactory', function($scope, scoreFactory) {
		//high scores page will display high scores in order
		$scope.scores = 'Scores go here';

		var postScores = function() {
			scoreFactory.getScores(function(result){
				console.log(result.data)
				$scope.scores = result.data
			});

		}
 
		$scope.addScore = function() {
			scoreFactory.addScore();
		}

		postScores();
	

	}])
	.factory('scoreFactory', function($http) {
		
		var getScores = function(cb) {
			$http.get('/scores').then(function(result) {

				cb(result);
			})

		};

		var addScore = function(user, score) {
			$http({
				url: '/scores',
				method: 'POST',
				data: {user: user, score: score}

			}).then(function(result) {
				console.log(result);

			})
		}
		return {getScores: getScores, addScore: addScore};

	})

  
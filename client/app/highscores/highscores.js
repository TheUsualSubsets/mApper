angular.module('Highscores', [])
	.controller('scoreController', ['$scope', 'scoreFactory', function($scope, scoreFactory) {
		//high scores page will display high scores in order
		$scope.scores = 'Scores go here';
		var postScores = function() {
			scoreFactory.getScores(function(){

			});

		}

		postScores();
	

	}])
	.factory('scoreFactory', function($http) {
		
		var getScores = function(cb) {
			$http.get('/scores').then(function(result) {
				console.log('high scores', result);
				cb(result);
			})

		};
		return {getScores: getScores};

	})


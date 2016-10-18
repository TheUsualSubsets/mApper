angular.module('Game', [])
	.controller('gameController', ['$scope', 'Map', function ($scope, Map){
    console.log('controller works');
    console.log(Map.coordinates);
		
	}])
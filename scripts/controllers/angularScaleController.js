'use strict';

/* Controllers */

var chordsApp = angular.module('chordsApp', []);

chordsApp.controller('ScaleDisplayCtrl', function($scope, $http) {

	$http({method: 'GET', url: './major_scale.json'}).
		success(
			function(data, status, headers, config) {
				$scope.scale = data['natural']['b'];
			}).
		error(
			function(data, status, headers, config) {

			});
});

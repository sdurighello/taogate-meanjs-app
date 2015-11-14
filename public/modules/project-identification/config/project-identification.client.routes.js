'use strict';

//Setting up route
angular.module('project-identification').config(['$stateProvider',
	function($stateProvider) {
		// Project identification state routing
		$stateProvider.
		state('project-identification', {
			url: '/project-identification',
			templateUrl: 'modules/project-identification/views/project-identification.client.view.html'
		});
	}
]);
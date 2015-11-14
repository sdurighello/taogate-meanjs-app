'use strict';

//Setting up route
angular.module('project-selection').config(['$stateProvider',
	function($stateProvider) {
		// Project selection state routing
		$stateProvider.
		state('project-selection', {
			url: '/project-selection',
			templateUrl: 'modules/project-selection/views/project-selection.client.view.html'
		});
	}
]);
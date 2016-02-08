'use strict';

//Setting up route
angular.module('project-review-setup').config(['$stateProvider',
	function($stateProvider) {
		// Project review setup state routing
		$stateProvider.
		state('project-review-setup', {
			url: '/project-review-setup',
			templateUrl: 'modules/project-review-setup/views/project-review-setup.client.view.html'
		});
	}
]);
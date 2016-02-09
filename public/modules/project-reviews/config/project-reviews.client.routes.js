'use strict';

//Setting up route
angular.module('project-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Project reviews state routing
		$stateProvider.
		state('project-reviews', {
			url: '/project-reviews',
			templateUrl: 'modules/project-reviews/views/project-reviews.client.view.html'
		});
	}
]);

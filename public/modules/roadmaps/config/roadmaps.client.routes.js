'use strict';

//Setting up route
angular.module('roadmaps').config(['$stateProvider',
	function($stateProvider) {
		// Roadmaps state routing
		$stateProvider.
		state('definition-roadmap', {
			url: '/roadmaps',
			templateUrl: 'modules/roadmaps/views/roadmaps.client.view.html'
		});
	}
]);

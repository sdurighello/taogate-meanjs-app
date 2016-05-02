'use strict';

//Setting up route
angular.module('roadmaps').config(['$stateProvider',
	function($stateProvider) {
		// Roadmaps state routing
		$stateProvider.
		state('roadmaps', {
			url: '/roadmaps',
			templateUrl: 'modules/roadmaps/views/roadmaps.client.view.html'
		});
	}
]);

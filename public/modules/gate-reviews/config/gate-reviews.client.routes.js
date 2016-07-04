'use strict';

//Setting up route
angular.module('gate-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Gate management review state routing
		$stateProvider.
		state('gate-reviews', {
			url: '/gate-reviews',
			templateUrl: 'modules/gate-reviews/views/gate-reviews.client.view.html'
		});
	}
]);

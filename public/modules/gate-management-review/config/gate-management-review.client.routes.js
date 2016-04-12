'use strict';

//Setting up route
angular.module('gate-management-review').config(['$stateProvider',
	function($stateProvider) {
		// Gate management review state routing
		$stateProvider.
		state('gate-management-review', {
			url: '/gate-management-review',
			templateUrl: 'modules/gate-management-review/views/gate-management-review.client.view.html'
		})
        .state('gate-management-review-id', {
            url: '/gate-management-review/:gateReviewId/projects/:projectId/gates/:gateId',
            templateUrl: 'modules/gate-management-review/views/gate-management-review.client.view.html'
        });
	}
]);

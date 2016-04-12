'use strict';

//Setting up route
angular.module('improvement-activities').config(['$stateProvider',
	function($stateProvider) {
		// Improvement activities state routing
		$stateProvider.
		state('improvement-activities', {
			url: '/improvement-activities',
			templateUrl: 'modules/improvement-activities/views/improvement-activities.client.view.html'
		})
        .state('improvement-activities-id', {
            url: '/improvement-activities/:activityId',
            templateUrl: 'modules/improvement-activities/views/improvement-activities.client.view.html'
        });
	}
]);

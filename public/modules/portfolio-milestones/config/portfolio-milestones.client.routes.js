'use strict';

//Setting up route
angular.module('portfolio-milestones').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio milestones state routing
		$stateProvider.
		state('portfolio-milestones', {
			url: '/portfolio-milestones',
			templateUrl: 'modules/portfolio-milestones/views/portfolio-milestones.client.view.html'
		});
	}
]);

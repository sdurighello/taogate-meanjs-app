'use strict';

//Setting up route
angular.module('project-milestones').config(['$stateProvider',
	function($stateProvider) {
		// Project milestones state routing
		$stateProvider.
		state('project-milestones', {
			url: '/project-milestones',
			templateUrl: 'modules/project-milestones/views/project-milestones.client.view.html'
		});
	}
]);

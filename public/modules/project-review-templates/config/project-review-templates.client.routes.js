'use strict';

//Setting up route
angular.module('project-review-templates').config(['$stateProvider',
	function($stateProvider) {
		// Project review templates state routing
		$stateProvider.
		state('project-review-templates', {
			url: '/project-review-templates',
			templateUrl: 'modules/project-review-templates/views/project-review-templates.client.view.html'
		});
	}
]);

'use strict';

//Setting up route
angular.module('dependency-impacts').config(['$stateProvider',
	function($stateProvider) {
		// Dependency impacts state routing
		$stateProvider.
		state('listDependencyImpacts', {
			url: '/dependency-impacts',
			templateUrl: 'modules/dependency-impacts/views/list-dependency-impacts.client.view.html'
		}).
		state('createDependencyImpact', {
			url: '/dependency-impacts/create',
			templateUrl: 'modules/dependency-impacts/views/create-dependency-impact.client.view.html'
		}).
		state('viewDependencyImpact', {
			url: '/dependency-impacts/:dependencyImpactId',
			templateUrl: 'modules/dependency-impacts/views/view-dependency-impact.client.view.html'
		}).
		state('editDependencyImpact', {
			url: '/dependency-impacts/:dependencyImpactId/edit',
			templateUrl: 'modules/dependency-impacts/views/edit-dependency-impact.client.view.html'
		});
	}
]);
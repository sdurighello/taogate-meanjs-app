'use strict';

//Setting up route
angular.module('people-portfolio-roles').config(['$stateProvider',
	function($stateProvider) {
		// People portfolio roles state routing
		$stateProvider.
		state('listPeoplePortfolioRoles', {
			url: '/people-portfolio-roles',
			templateUrl: 'modules/people-portfolio-roles/views/list-people-portfolio-roles.client.view.html'
		}).
		state('createPeoplePortfolioRole', {
			url: '/people-portfolio-roles/create',
			templateUrl: 'modules/people-portfolio-roles/views/create-people-portfolio-role.client.view.html'
		}).
		state('viewPeoplePortfolioRole', {
			url: '/people-portfolio-roles/:peoplePortfolioRoleId',
			templateUrl: 'modules/people-portfolio-roles/views/view-people-portfolio-role.client.view.html'
		}).
		state('editPeoplePortfolioRole', {
			url: '/people-portfolio-roles/:peoplePortfolioRoleId/edit',
			templateUrl: 'modules/people-portfolio-roles/views/edit-people-portfolio-role.client.view.html'
		});
	}
]);
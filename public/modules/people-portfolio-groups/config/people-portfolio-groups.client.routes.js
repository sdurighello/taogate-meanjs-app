'use strict';

//Setting up route
angular.module('people-portfolio-groups').config(['$stateProvider',
	function($stateProvider) {
		// People portfolio groups state routing
		$stateProvider.
		state('listPeoplePortfolioGroups', {
			url: '/people-portfolio-groups',
			templateUrl: 'modules/people-portfolio-groups/views/list-people-portfolio-groups.client.view.html'
		}).
		state('createPeoplePortfolioGroup', {
			url: '/people-portfolio-groups/create',
			templateUrl: 'modules/people-portfolio-groups/views/create-people-portfolio-group.client.view.html'
		}).
		state('viewPeoplePortfolioGroup', {
			url: '/people-portfolio-groups/:peoplePortfolioGroupId',
			templateUrl: 'modules/people-portfolio-groups/views/view-people-portfolio-group.client.view.html'
		}).
		state('editPeoplePortfolioGroup', {
			url: '/people-portfolio-groups/:peoplePortfolioGroupId/edit',
			templateUrl: 'modules/people-portfolio-groups/views/edit-people-portfolio-group.client.view.html'
		});
	}
]);
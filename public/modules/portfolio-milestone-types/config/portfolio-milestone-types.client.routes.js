'use strict';

//Setting up route
angular.module('portfolio-milestone-types').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio milestone types state routing
		$stateProvider.
		state('listPortfolioMilestoneTypes', {
			url: '/portfolio-milestone-types',
			templateUrl: 'modules/portfolio-milestone-types/views/list-portfolio-milestone-types.client.view.html'
		}).
		state('createPortfolioMilestoneType', {
			url: '/portfolio-milestone-types/create',
			templateUrl: 'modules/portfolio-milestone-types/views/create-portfolio-milestone-type.client.view.html'
		}).
		state('viewPortfolioMilestoneType', {
			url: '/portfolio-milestone-types/:portfolioMilestoneTypeId',
			templateUrl: 'modules/portfolio-milestone-types/views/view-portfolio-milestone-type.client.view.html'
		}).
		state('editPortfolioMilestoneType', {
			url: '/portfolio-milestone-types/:portfolioMilestoneTypeId/edit',
			templateUrl: 'modules/portfolio-milestone-types/views/edit-portfolio-milestone-type.client.view.html'
		});
	}
]);
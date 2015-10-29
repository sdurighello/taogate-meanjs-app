'use strict';

//Setting up route
angular.module('portfoliotypes').config(['$stateProvider',
	function($stateProvider) {
		// Portfoliotypes state routing
		$stateProvider.
		state('listPortfoliotypes', {
			url: '/portfoliotypes',
			templateUrl: 'modules/portfoliotypes/views/list-portfoliotypes.client.view.html'
		}).
		state('createPortfoliotype', {
			url: '/portfoliotypes/create',
			templateUrl: 'modules/portfoliotypes/views/create-portfoliotype.client.view.html'
		}).
		state('viewPortfoliotype', {
			url: '/portfoliotypes/:portfoliotypeId',
			templateUrl: 'modules/portfoliotypes/views/view-portfoliotype.client.view.html'
		}).
		state('editPortfoliotype', {
			url: '/portfoliotypes/:portfoliotypeId/edit',
			templateUrl: 'modules/portfoliotypes/views/edit-portfoliotype.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('change-requests').config(['$stateProvider',
	function($stateProvider) {
		// Change requests state routing
		$stateProvider.
		state('listChangeRequests', {
			url: '/change-requests',
			templateUrl: 'modules/change-requests/views/list-change-requests.client.view.html'
		}).
		state('createChangeRequest', {
			url: '/change-requests/create',
			templateUrl: 'modules/change-requests/views/create-change-request.client.view.html'
		}).
		state('viewChangeRequest', {
			url: '/change-requests/:changeRequestId',
			templateUrl: 'modules/change-requests/views/view-change-request.client.view.html'
		}).
		state('editChangeRequest', {
			url: '/change-requests/:changeRequestId/edit',
			templateUrl: 'modules/change-requests/views/edit-change-request.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('change-request-states').config(['$stateProvider',
	function($stateProvider) {
		// Change request states state routing
		$stateProvider.
		state('listChangeRequestStates', {
			url: '/change-request-states',
			templateUrl: 'modules/change-request-states/views/list-change-request-states.client.view.html'
		}).
		state('createChangeRequestState', {
			url: '/change-request-states/create',
			templateUrl: 'modules/change-request-states/views/create-change-request-state.client.view.html'
		}).
		state('viewChangeRequestState', {
			url: '/change-request-states/:changeRequestStateId',
			templateUrl: 'modules/change-request-states/views/view-change-request-state.client.view.html'
		}).
		state('editChangeRequestState', {
			url: '/change-request-states/:changeRequestStateId/edit',
			templateUrl: 'modules/change-request-states/views/edit-change-request-state.client.view.html'
		});
	}
]);
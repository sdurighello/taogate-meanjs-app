'use strict';

//Setting up route
angular.module('change-request-reasons').config(['$stateProvider',
	function($stateProvider) {
		// Change request reasons state routing
		$stateProvider.
		state('listChangeRequestReasons', {
			url: '/change-request-reasons',
			templateUrl: 'modules/change-request-reasons/views/list-change-request-reasons.client.view.html'
		}).
		state('createChangeRequestReason', {
			url: '/change-request-reasons/create',
			templateUrl: 'modules/change-request-reasons/views/create-change-request-reason.client.view.html'
		}).
		state('viewChangeRequestReason', {
			url: '/change-request-reasons/:changeRequestReasonId',
			templateUrl: 'modules/change-request-reasons/views/view-change-request-reason.client.view.html'
		}).
		state('editChangeRequestReason', {
			url: '/change-request-reasons/:changeRequestReasonId/edit',
			templateUrl: 'modules/change-request-reasons/views/edit-change-request-reason.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('log-reasons').config(['$stateProvider',
	function($stateProvider) {
		// Log reasons state routing
		$stateProvider.
		state('listLogReasons', {
			url: '/log-reasons',
			templateUrl: 'modules/log-reasons/views/list-log-reasons.client.view.html'
		}).
		state('createLogReason', {
			url: '/log-reasons/create',
			templateUrl: 'modules/log-reasons/views/create-log-reason.client.view.html'
		}).
		state('viewLogReason', {
			url: '/log-reasons/:logReasonId',
			templateUrl: 'modules/log-reasons/views/view-log-reason.client.view.html'
		}).
		state('editLogReason', {
			url: '/log-reasons/:logReasonId/edit',
			templateUrl: 'modules/log-reasons/views/edit-log-reason.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('issue-log-setup').config(['$stateProvider',
	function($stateProvider) {
		// Issue log setup state routing
		$stateProvider.
		state('issue-log-setup', {
			url: '/issue-log-setup',
			templateUrl: 'modules/issue-log-setup/views/issue-log-setup.client.view.html'
		});
	}
]);
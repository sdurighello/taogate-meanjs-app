'use strict';

//Setting up route
angular.module('gate-process-templates').config(['$stateProvider',
	function($stateProvider) {
		// Gate process templates state routing
		$stateProvider.
		state('gate-process-templates', {
			url: '/gate-process-templates',
			templateUrl: 'modules/gate-process-templates/views/gate-process-templates.client.view.html'
		});
	}
]);

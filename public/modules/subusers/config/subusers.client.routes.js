'use strict';

//Setting up route
angular.module('subusers').config(['$stateProvider',
	function($stateProvider) {
		// Subusers state routing
		$stateProvider.
		state('listSubusers', {
			url: '/subusers',
			templateUrl: 'modules/subusers/views/list-subusers.client.view.html'
		}).
		state('createSubuser', {
			url: '/subusers/create',
			templateUrl: 'modules/subusers/views/create-subuser.client.view.html'
		}).
		state('viewSubuser', {
			url: '/subusers/:subuserId',
			templateUrl: 'modules/subusers/views/view-subuser.client.view.html'
		}).
		state('editSubuser', {
			url: '/subusers/:subuserId/edit',
			templateUrl: 'modules/subusers/views/edit-subuser.client.view.html'
		});
	}
]);
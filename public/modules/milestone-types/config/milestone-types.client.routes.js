'use strict';

//Setting up route
angular.module('milestone-types').config(['$stateProvider',
	function($stateProvider) {
		// Milestone types state routing
		$stateProvider.
		state('listMilestoneTypes', {
			url: '/milestone-types',
			templateUrl: 'modules/milestone-types/views/list-milestone-types.client.view.html'
		}).
		state('createMilestoneType', {
			url: '/milestone-types/create',
			templateUrl: 'modules/milestone-types/views/create-milestone-type.client.view.html'
		}).
		state('viewMilestoneType', {
			url: '/milestone-types/:milestoneTypeId',
			templateUrl: 'modules/milestone-types/views/view-milestone-type.client.view.html'
		}).
		state('editMilestoneType', {
			url: '/milestone-types/:milestoneTypeId/edit',
			templateUrl: 'modules/milestone-types/views/edit-milestone-type.client.view.html'
		});
	}
]);
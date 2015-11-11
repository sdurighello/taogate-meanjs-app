'use strict';

//Setting up route
angular.module('milestone-states').config(['$stateProvider',
	function($stateProvider) {
		// Milestone states state routing
		$stateProvider.
		state('listMilestoneStates', {
			url: '/milestone-states',
			templateUrl: 'modules/milestone-states/views/list-milestone-states.client.view.html'
		}).
		state('createMilestoneState', {
			url: '/milestone-states/create',
			templateUrl: 'modules/milestone-states/views/create-milestone-state.client.view.html'
		}).
		state('viewMilestoneState', {
			url: '/milestone-states/:milestoneStateId',
			templateUrl: 'modules/milestone-states/views/view-milestone-state.client.view.html'
		}).
		state('editMilestoneState', {
			url: '/milestone-states/:milestoneStateId/edit',
			templateUrl: 'modules/milestone-states/views/edit-milestone-state.client.view.html'
		});
	}
]);
'use strict';

//Setting up route
angular.module('qualitative-impact-groups').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative impact groups state routing
		$stateProvider.
		state('listQualitativeImpactGroups', {
			url: '/qualitative-impact-groups',
			templateUrl: 'modules/qualitative-impact-groups/views/list-qualitative-impact-groups.client.view.html'
		}).
		state('createQualitativeImpactGroup', {
			url: '/qualitative-impact-groups/create',
			templateUrl: 'modules/qualitative-impact-groups/views/create-qualitative-impact-group.client.view.html'
		}).
		state('viewQualitativeImpactGroup', {
			url: '/qualitative-impact-groups/:qualitativeImpactGroupId',
			templateUrl: 'modules/qualitative-impact-groups/views/view-qualitative-impact-group.client.view.html'
		}).
		state('editQualitativeImpactGroup', {
			url: '/qualitative-impact-groups/:qualitativeImpactGroupId/edit',
			templateUrl: 'modules/qualitative-impact-groups/views/edit-qualitative-impact-group.client.view.html'
		});
	}
]);
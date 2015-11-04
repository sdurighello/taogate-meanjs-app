'use strict';

//Setting up route
angular.module('qualitative-impacts').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative impacts state routing
		$stateProvider.
		state('listQualitativeImpacts', {
			url: '/qualitative-impacts',
			templateUrl: 'modules/qualitative-impacts/views/list-qualitative-impacts.client.view.html'
		}).
		state('createQualitativeImpact', {
			url: '/qualitative-impacts/create',
			templateUrl: 'modules/qualitative-impacts/views/create-qualitative-impact.client.view.html'
		}).
		state('viewQualitativeImpact', {
			url: '/qualitative-impacts/:qualitativeImpactId',
			templateUrl: 'modules/qualitative-impacts/views/view-qualitative-impact.client.view.html'
		}).
		state('editQualitativeImpact', {
			url: '/qualitative-impacts/:qualitativeImpactId/edit',
			templateUrl: 'modules/qualitative-impacts/views/edit-qualitative-impact.client.view.html'
		});
	}
]);
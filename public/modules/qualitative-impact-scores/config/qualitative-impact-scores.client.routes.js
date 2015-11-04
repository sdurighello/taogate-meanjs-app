'use strict';

//Setting up route
angular.module('qualitative-impact-scores').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative impact scores state routing
		$stateProvider.
		state('listQualitativeImpactScores', {
			url: '/qualitative-impact-scores',
			templateUrl: 'modules/qualitative-impact-scores/views/list-qualitative-impact-scores.client.view.html'
		}).
		state('createQualitativeImpactScore', {
			url: '/qualitative-impact-scores/create',
			templateUrl: 'modules/qualitative-impact-scores/views/create-qualitative-impact-score.client.view.html'
		}).
		state('viewQualitativeImpactScore', {
			url: '/qualitative-impact-scores/:qualitativeImpactScoreId',
			templateUrl: 'modules/qualitative-impact-scores/views/view-qualitative-impact-score.client.view.html'
		}).
		state('editQualitativeImpactScore', {
			url: '/qualitative-impact-scores/:qualitativeImpactScoreId/edit',
			templateUrl: 'modules/qualitative-impact-scores/views/edit-qualitative-impact-score.client.view.html'
		});
	}
]);
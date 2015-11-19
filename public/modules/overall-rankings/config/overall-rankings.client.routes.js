'use strict';

//Setting up route
angular.module('overall-rankings').config(['$stateProvider',
	function($stateProvider) {
		// Overall rankings state routing
		$stateProvider.
		state('listOverallRankings', {
			url: '/overall-rankings',
			templateUrl: 'modules/overall-rankings/views/list-overall-rankings.client.view.html'
		}).
		state('createOverallRanking', {
			url: '/overall-rankings/create',
			templateUrl: 'modules/overall-rankings/views/create-overall-ranking.client.view.html'
		}).
		state('viewOverallRanking', {
			url: '/overall-rankings/:overallRankingId',
			templateUrl: 'modules/overall-rankings/views/view-overall-ranking.client.view.html'
		}).
		state('editOverallRanking', {
			url: '/overall-rankings/:overallRankingId/edit',
			templateUrl: 'modules/overall-rankings/views/edit-overall-ranking.client.view.html'
		});
	}
]);
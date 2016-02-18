'use strict';

//Evaluation summaries service used to communicate Evaluation summaries REST endpoints
angular.module('evaluation-summaries').factory('EvaluationSummaries', ['$resource',
	function($resource) {
		return $resource('evaluation-summaries', {
		}, {
			portfolioSummary: {
				method: 'GET',
				isArray: true,
				url: 'evaluation-summaries/portfolioSummary'
			}
		});
	}
]);

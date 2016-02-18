'use strict';

//Evaluation dashboards service used to communicate Evaluation dashboards REST endpoints
angular.module('financial-analysis').factory('FinancialAnalysis', ['$resource',
	function($resource) {
		return $resource('financial-analysis', {
		}, {
			financialProfile: {
				method: 'GET',
				isArray: false,
				url: 'financial-analysis/financialProfile/:projectId'
			}
		});
	}
]);

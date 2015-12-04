'use strict';

//Risk categories service used to communicate Risk categories REST endpoints
angular.module('risk-analysis-setup').factory('RiskCategories', ['$resource',
	function($resource) {
		return $resource('risk-categories/:riskCategoryId', { riskCategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

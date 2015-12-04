'use strict';

//Financial costs service used to communicate Financial costs REST endpoints
angular.module('financial-analysis').factory('FinancialCosts', ['$resource',
	function($resource) {
		return $resource('financial-costs/:financialCostId', { financialCostId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

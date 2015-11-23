'use strict';

//Financial cost types service used to communicate Financial cost types REST endpoints
angular.module('financial-cost-types').factory('FinancialCostTypes', ['$resource',
	function($resource) {
		return $resource('financial-cost-types/:financialCostTypeId', { financialCostTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
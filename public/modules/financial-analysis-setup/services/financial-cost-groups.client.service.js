'use strict';

//Financial cost groups service used to communicate Financial cost groups REST endpoints
angular.module('financial-analysis-setup').factory('FinancialCostGroups', ['$resource',
	function($resource) {
		return $resource('financial-cost-groups/:financialCostGroupId', { financialCostGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

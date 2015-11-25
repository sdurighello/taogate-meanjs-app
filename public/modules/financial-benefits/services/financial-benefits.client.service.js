'use strict';

//Financial benefits service used to communicate Financial benefits REST endpoints
angular.module('financial-benefits').factory('FinancialBenefits', ['$resource',
	function($resource) {
		return $resource('financial-benefits/:financialBenefitId', { financialBenefitId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
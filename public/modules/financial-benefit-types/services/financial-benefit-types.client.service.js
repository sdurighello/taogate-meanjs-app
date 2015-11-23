'use strict';

//Financial benefit types service used to communicate Financial benefit types REST endpoints
angular.module('financial-benefit-types').factory('FinancialBenefitTypes', ['$resource',
	function($resource) {
		return $resource('financial-benefit-types/:financialBenefitTypeId', { financialBenefitTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
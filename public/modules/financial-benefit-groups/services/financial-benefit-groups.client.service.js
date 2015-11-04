'use strict';

//Financial benefit groups service used to communicate Financial benefit groups REST endpoints
angular.module('financial-benefit-groups').factory('FinancialBenefitGroups', ['$resource',
	function($resource) {
		return $resource('financial-benefit-groups/:financialBenefitGroupId', { financialBenefitGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
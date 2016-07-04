'use strict';

//Delivery dashboards service used to communicate Delivery dashboards REST endpoints
angular.module('gate-performances').factory('GatePerformances', ['$resource',
	function($resource) {
		return $resource('gate-performances', {
		}, {
			portfolioPerformances: {
				method: 'GET',
				isArray: false,
				url: 'gate-performances/portfolioPerformances'
			}
		});
	}
]);

'use strict';

//Delivery dashboards service used to communicate Delivery dashboards REST endpoints
angular.module('gate-performances').factory('GatePerformances', ['$resource',
	function($resource) {
		return $resource('gate-performances', {
		}, {
			projectPerformances: {
				method: 'GET',
				isArray: true,
				url: 'gate-performances/projectPerformances/:projectId'
			},
			portfolioPerformances: {
				method: 'GET',
				isArray: true,
				url: 'gate-performances/portfolioPerformances'
			}
		});
	}
]);

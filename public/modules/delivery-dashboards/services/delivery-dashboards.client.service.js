'use strict';

//Delivery dashboards service used to communicate Delivery dashboards REST endpoints
angular.module('delivery-dashboards').factory('DeliveryDashboards', ['$resource',
	function($resource) {
		return $resource('delivery-dashboards/:deliveryDashboardId', { deliveryDashboardId: '@_id'
		}, {
			gatePerformances: {
				method: 'GET',
				isArray: true,
				url: 'delivery-dashboards/gatePerformances/:projectId'
			}
		});
	}
]);

'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('definition-dashboards').factory('DefinitionDashboards', ['$resource',
	function($resource) {
		return $resource('definition-dashboards/:definitionDashboardId', { definitionDashboardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
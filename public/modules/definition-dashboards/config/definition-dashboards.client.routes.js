'use strict';

//Setting up route
angular.module('definition-dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Definition dashboards state routing
		$stateProvider.
		state('definition-dashboards', {
			url: '/definition-dashboards',
			templateUrl: 'modules/definition-dashboards/views/definition-dashboards.client.view.html'
		});
		//state('listDefinitionDashboards', {
		//	url: '/definition-dashboards',
		//	templateUrl: 'modules/definition-dashboards/views/list-definition-dashboards.client.view.html'
		//}).
		//state('createDefinitionDashboard', {
		//	url: '/definition-dashboards/create',
		//	templateUrl: 'modules/definition-dashboards/views/create-definition-dashboard.client.view.html'
		//}).
		//state('viewDefinitionDashboard', {
		//	url: '/definition-dashboards/:definitionDashboardId',
		//	templateUrl: 'modules/definition-dashboards/views/view-definition-dashboard.client.view.html'
		//}).
		//state('editDefinitionDashboard', {
		//	url: '/definition-dashboards/:definitionDashboardId/edit',
		//	templateUrl: 'modules/definition-dashboards/views/edit-definition-dashboard.client.view.html'
		//});
	}
]);

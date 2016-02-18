'use strict';

// Configuring the Articles module
angular.module('gate-performances').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Delivery dashboards', 'delivery-dashboards', 'dropdown', '/delivery-dashboards(/create)?');
		//Menus.addSubMenuItem('topbar', 'delivery-dashboards', 'List Delivery dashboards', 'delivery-dashboards');
		//Menus.addSubMenuItem('topbar', 'delivery-dashboards', 'New Delivery dashboard', 'delivery-dashboards/create');
	}
]);

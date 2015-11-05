'use strict';

// Configuring the Articles module
angular.module('risk-categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Risk categories', 'risk-categories', 'dropdown', '/risk-categories(/create)?');
		//Menus.addSubMenuItem('topbar', 'risk-categories', 'List Risk categories', 'risk-categories');
		//Menus.addSubMenuItem('topbar', 'risk-categories', 'New Risk category', 'risk-categories/create');
	}
]);

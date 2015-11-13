'use strict';

// Configuring the Articles module
angular.module('people-categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'People categories', 'people-categories', 'dropdown', '/people-categories(/create)?');
		//Menus.addSubMenuItem('topbar', 'people-categories', 'List People categories', 'people-categories');
		//Menus.addSubMenuItem('topbar', 'people-categories', 'New People category', 'people-categories/create');
	}
]);

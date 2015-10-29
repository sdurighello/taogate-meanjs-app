'use strict';

// Configuring the Articles module
angular.module('priority-values').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Priority values', 'priority-values', 'dropdown', '/priority-values(/create)?');
		//Menus.addSubMenuItem('topbar', 'priority-values', 'List Priority values', 'priority-values');
		//Menus.addSubMenuItem('topbar', 'priority-values', 'New Priority value', 'priority-values/create');
	}
]);

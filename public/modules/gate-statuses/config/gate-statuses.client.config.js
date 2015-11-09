'use strict';

// Configuring the Articles module
angular.module('gate-statuses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Gate statuses', 'gate-statuses', 'dropdown', '/gate-statuses(/create)?');
		//Menus.addSubMenuItem('topbar', 'gate-statuses', 'List Gate statuses', 'gate-statuses');
		//Menus.addSubMenuItem('topbar', 'gate-statuses', 'New Gate status', 'gate-statuses/create');
	}
]);

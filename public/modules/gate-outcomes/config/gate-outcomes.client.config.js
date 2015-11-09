'use strict';

// Configuring the Articles module
angular.module('gate-outcomes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Gate outcomes', 'gate-outcomes', 'dropdown', '/gate-outcomes(/create)?');
		//Menus.addSubMenuItem('topbar', 'gate-outcomes', 'List Gate outcomes', 'gate-outcomes');
		//Menus.addSubMenuItem('topbar', 'gate-outcomes', 'New Gate outcome', 'gate-outcomes/create');
	}
]);

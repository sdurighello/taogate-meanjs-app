'use strict';

// Configuring the Articles module
angular.module('gate-processes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Gate processes', 'gate-processes', 'dropdown', '/gate-processes(/create)?');
		//Menus.addSubMenuItem('topbar', 'gate-processes', 'List Gate processes', 'gate-processes');
		//Menus.addSubMenuItem('topbar', 'gate-processes', 'New Gate process', 'gate-processes/create');
	}
]);

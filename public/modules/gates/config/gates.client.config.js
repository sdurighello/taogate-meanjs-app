'use strict';

// Configuring the Articles module
angular.module('gates').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Gates', 'gates', 'dropdown', '/gates(/create)?');
		//Menus.addSubMenuItem('topbar', 'gates', 'List Gates', 'gates');
		//Menus.addSubMenuItem('topbar', 'gates', 'New Gate', 'gates/create');
	}
]);

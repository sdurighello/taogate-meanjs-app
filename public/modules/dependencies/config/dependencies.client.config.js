'use strict';

// Configuring the Articles module
angular.module('dependencies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Dependencies', 'dependencies', 'dropdown', '/dependencies(/create)?');
		//Menus.addSubMenuItem('topbar', 'dependencies', 'List Dependencies', 'dependencies');
		//Menus.addSubMenuItem('topbar', 'dependencies', 'New Dependency', 'dependencies/create');
	}
]);

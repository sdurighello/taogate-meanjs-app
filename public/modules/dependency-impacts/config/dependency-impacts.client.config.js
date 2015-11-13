'use strict';

// Configuring the Articles module
angular.module('dependency-impacts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Dependency impacts', 'dependency-impacts', 'dropdown', '/dependency-impacts(/create)?');
		//Menus.addSubMenuItem('topbar', 'dependency-impacts', 'List Dependency impacts', 'dependency-impacts');
		//Menus.addSubMenuItem('topbar', 'dependency-impacts', 'New Dependency impact', 'dependency-impacts/create');
	}
]);

'use strict';

// Configuring the Articles module
angular.module('dependency-types').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Dependency types', 'dependency-types', 'dropdown', '/dependency-types(/create)?');
		//Menus.addSubMenuItem('topbar', 'dependency-types', 'List Dependency types', 'dependency-types');
		//Menus.addSubMenuItem('topbar', 'dependency-types', 'New Dependency type', 'dependency-types/create');
	}
]);

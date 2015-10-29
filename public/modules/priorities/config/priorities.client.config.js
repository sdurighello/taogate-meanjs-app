'use strict';

// Configuring the Articles module
angular.module('priorities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Priorities', 'priorities', 'dropdown', '/priorities(/create)?');
		//Menus.addSubMenuItem('topbar', 'priorities', 'List Priorities', 'priorities');
		//Menus.addSubMenuItem('topbar', 'priorities', 'New Priority', 'priorities/create');
	}
]);

'use strict';

// Configuring the Articles module
angular.module('log-priorities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Log priorities', 'log-priorities', 'dropdown', '/log-priorities(/create)?');
		//Menus.addSubMenuItem('topbar', 'log-priorities', 'List Log priorities', 'log-priorities');
		//Menus.addSubMenuItem('topbar', 'log-priorities', 'New Log priority', 'log-priorities/create');
	}
]);

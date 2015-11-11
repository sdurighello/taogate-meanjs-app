'use strict';

// Configuring the Articles module
angular.module('change-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Change requests', 'change-requests', 'dropdown', '/change-requests(/create)?');
		//Menus.addSubMenuItem('topbar', 'change-requests', 'List Change requests', 'change-requests');
		//Menus.addSubMenuItem('topbar', 'change-requests', 'New Change request', 'change-requests/create');
	}
]);

'use strict';

// Configuring the Articles module
angular.module('status-summaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Status summaries', 'status-summaries', 'dropdown', '/status-summaries(/create)?');
		// Menus.addSubMenuItem('topbar', 'status-summaries', 'List Status summaries', 'status-summaries');
		// Menus.addSubMenuItem('topbar', 'status-summaries', 'New Status summary', 'status-summaries/create');
	}
]);

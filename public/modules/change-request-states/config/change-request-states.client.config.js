'use strict';

// Configuring the Articles module
angular.module('change-request-states').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Change request states', 'change-request-states', 'dropdown', '/change-request-states(/create)?');
		//Menus.addSubMenuItem('topbar', 'change-request-states', 'List Change request states', 'change-request-states');
		//Menus.addSubMenuItem('topbar', 'change-request-states', 'New Change request state', 'change-request-states/create');
	}
]);

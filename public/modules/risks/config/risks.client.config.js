'use strict';

// Configuring the Articles module
angular.module('risks').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Risks', 'risks', 'dropdown', '/risks(/create)?');
		//Menus.addSubMenuItem('topbar', 'risks', 'List Risks', 'risks');
		//Menus.addSubMenuItem('topbar', 'risks', 'New Risk', 'risks/create');
	}
]);

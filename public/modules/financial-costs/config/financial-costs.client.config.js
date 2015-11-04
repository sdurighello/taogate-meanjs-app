'use strict';

// Configuring the Articles module
angular.module('financial-costs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Financial costs', 'financial-costs', 'dropdown', '/financial-costs(/create)?');
		//Menus.addSubMenuItem('topbar', 'financial-costs', 'List Financial costs', 'financial-costs');
		//Menus.addSubMenuItem('topbar', 'financial-costs', 'New Financial cost', 'financial-costs/create');
	}
]);

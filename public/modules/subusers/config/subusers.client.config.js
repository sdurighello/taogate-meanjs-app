'use strict';

// Configuring the Articles module
angular.module('subusers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Subusers', 'subusers', 'dropdown', '/subusers(/create)?', false, ['superAdmin']);
		Menus.addSubMenuItem('topbar', 'admin', 'Subusers', 'menuTitle');
		Menus.addSubMenuItem('topbar', 'admin', 'List Subusers', 'subusers');
		Menus.addSubMenuItem('topbar', 'admin', 'New Subuser', 'subusers/create');
	}
]);

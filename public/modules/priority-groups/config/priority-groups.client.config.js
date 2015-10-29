'use strict';

// Configuring the Articles module
angular.module('priority-groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Priority groups', 'priority-groups', 'dropdown', '/priority-groups(/create)?');
		//Menus.addSubMenuItem('topbar', 'priority-groups', 'List Priority groups', 'priority-groups');
		//Menus.addSubMenuItem('topbar', 'priority-groups', 'New Priority group', 'priority-groups/create');
	}
]);

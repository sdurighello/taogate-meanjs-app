'use strict';

// Configuring the Articles module
angular.module('milestone-states').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Milestone states', 'milestone-states', 'dropdown', '/milestone-states(/create)?');
		//Menus.addSubMenuItem('topbar', 'milestone-states', 'List Milestone states', 'milestone-states');
		//Menus.addSubMenuItem('topbar', 'milestone-states', 'New Milestone state', 'milestone-states/create');
	}
]);

'use strict';

// Configuring the Articles module
angular.module('project-statuses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project statuses', 'project-statuses', 'dropdown', '/project-statuses(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-statuses', 'List Project statuses', 'project-statuses');
		//Menus.addSubMenuItem('topbar', 'project-statuses', 'New Project status', 'project-statuses/create');
	}
]);

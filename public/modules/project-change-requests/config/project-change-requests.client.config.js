'use strict';

// Configuring the Articles module
angular.module('project-change-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project change requests', 'project-change-requests', 'dropdown', '/project-change-requests(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-change-requests', 'List Project change requests', 'project-change-requests');
		//Menus.addSubMenuItem('topbar', 'project-change-requests', 'New Project change request', 'project-change-requests/create');
	}
]);

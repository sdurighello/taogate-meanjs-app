'use strict';

// Configuring the Articles module
angular.module('project-issues').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project issues', 'project-issues', 'dropdown', '/project-issues(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-issues', 'List Project issues', 'project-issues/list');
		//Menus.addSubMenuItem('topbar', 'project-issues', 'New Project issue', 'project-issues/create');
	}
]);

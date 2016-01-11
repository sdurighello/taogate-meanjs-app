'use strict';

// Configuring the Articles module
angular.module('project-milestones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project milestones', 'project-milestones', 'dropdown', '/project-milestones(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-milestones', 'List Project milestones', 'project-milestones');
		//Menus.addSubMenuItem('topbar', 'project-milestones', 'New Project milestone', 'project-milestones/create');
	}
]);

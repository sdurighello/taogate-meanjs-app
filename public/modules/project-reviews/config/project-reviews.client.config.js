'use strict';

// Configuring the Articles module
angular.module('project-reviews').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project reviews', 'project-reviews', 'dropdown', '/project-reviews(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-reviews', 'List Project reviews', 'project-reviews');
		//Menus.addSubMenuItem('topbar', 'project-reviews', 'New Project review', 'project-reviews/create');
	}
]);

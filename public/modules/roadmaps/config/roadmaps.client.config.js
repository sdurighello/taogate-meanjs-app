'use strict';

// Configuring the Articles module
angular.module('roadmaps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Roadmaps', 'roadmaps', 'dropdown', '/roadmaps(/create)?');
		// Menus.addSubMenuItem('topbar', 'roadmaps', 'List Roadmaps', 'roadmaps');
		// Menus.addSubMenuItem('topbar', 'roadmaps', 'New Roadmap', 'roadmaps/create');
	}
]);

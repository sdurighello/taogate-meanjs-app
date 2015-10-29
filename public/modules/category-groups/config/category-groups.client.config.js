'use strict';

// Configuring the Articles module
angular.module('category-groups').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Category groups', 'category-groups', 'dropdown', '/category-groups(/create)?');
		//Menus.addSubMenuItem('topbar', 'category-groups', 'List Category groups', 'category-groups');
		//Menus.addSubMenuItem('topbar', 'category-groups', 'New Category group', 'category-groups/create');
	}
]);

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown');
		// Menus.addSubMenuItem('topbar', 'definition', 'Articles', 'menuTitle');
		// Menus.addSubMenuItem('topbar', 'definition', 'List articles', 'articles');
		// Menus.addSubMenuItem('topbar', 'definition', 'New Article', 'articles/create');
	}
]);

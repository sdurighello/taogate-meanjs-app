'use strict';

// Configuring the Articles module
angular.module('overall-rankings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Overall rankings', 'overall-rankings', 'dropdown', '/overall-rankings(/create)?');
		//Menus.addSubMenuItem('topbar', 'overall-rankings', 'List Overall rankings', 'overall-rankings');
		//Menus.addSubMenuItem('topbar', 'overall-rankings', 'New Overall ranking', 'overall-rankings/create');
	}
]);

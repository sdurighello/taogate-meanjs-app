'use strict';

// Configuring the Articles module
angular.module('improvement-activities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Improvement activities', 'improvement-activities', 'dropdown', '/improvement-activities(/create)?');
		//Menus.addSubMenuItem('topbar', 'improvement-activities', 'List Improvement activities', 'improvement-activities');
		//Menus.addSubMenuItem('topbar', 'improvement-activities', 'New Improvement activity', 'improvement-activities/create');
	}
]);

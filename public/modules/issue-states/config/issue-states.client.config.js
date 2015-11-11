'use strict';

// Configuring the Articles module
angular.module('issue-states').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Issue states', 'issue-states', 'dropdown', '/issue-states(/create)?');
		//Menus.addSubMenuItem('topbar', 'issue-states', 'List Issue states', 'issue-states');
		//Menus.addSubMenuItem('topbar', 'issue-states', 'New Issue state', 'issue-states/create');
	}
]);

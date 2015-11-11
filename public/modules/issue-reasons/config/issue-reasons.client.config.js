'use strict';

// Configuring the Articles module
angular.module('issue-reasons').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Issue reasons', 'issue-reasons', 'dropdown', '/issue-reasons(/create)?');
		//Menus.addSubMenuItem('topbar', 'issue-reasons', 'List Issue reasons', 'issue-reasons');
		//Menus.addSubMenuItem('topbar', 'issue-reasons', 'New Issue reason', 'issue-reasons/create');
	}
]);

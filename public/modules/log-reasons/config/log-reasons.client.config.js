'use strict';

// Configuring the Articles module
angular.module('log-reasons').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Log reasons', 'log-reasons', 'dropdown', '/log-reasons(/create)?');
		//Menus.addSubMenuItem('topbar', 'log-reasons', 'List Log reasons', 'log-reasons');
		//Menus.addSubMenuItem('topbar', 'log-reasons', 'New Log reason', 'log-reasons/create');
	}
]);

'use strict';

// Configuring the Articles module
angular.module('risk-severities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Risk severities', 'risk-severities', 'dropdown', '/risk-severities(/create)?');
		//Menus.addSubMenuItem('topbar', 'risk-severities', 'List Risk severities', 'risk-severities');
		//Menus.addSubMenuItem('topbar', 'risk-severities', 'New Risk severity', 'risk-severities/create');
	}
]);

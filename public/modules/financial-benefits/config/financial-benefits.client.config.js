'use strict';

// Configuring the Articles module
angular.module('financial-benefits').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Financial benefits', 'financial-benefits', 'dropdown', '/financial-benefits(/create)?');
		//Menus.addSubMenuItem('topbar', 'financial-benefits', 'List Financial benefits', 'financial-benefits');
		//Menus.addSubMenuItem('topbar', 'financial-benefits', 'New Financial benefit', 'financial-benefits/create');
	}
]);

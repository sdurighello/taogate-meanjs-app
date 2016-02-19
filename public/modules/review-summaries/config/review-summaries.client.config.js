'use strict';

// Configuring the Articles module
angular.module('review-summaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Review summaries', 'review-summaries', 'dropdown', '/review-summaries(/create)?');
		//Menus.addSubMenuItem('topbar', 'review-summaries', 'List Review summaries', 'review-summaries');
		//Menus.addSubMenuItem('topbar', 'review-summaries', 'New Review summary', 'review-summaries/create');
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('register', {
			url: '/register',
			templateUrl: 'modules/core/views/register.client.view.html'
		}).
		state('contact', {
			url: '/contact',
			templateUrl: 'modules/core/views/contact.client.view.html'
		}).
		state('software', {
			url: '/software',
			templateUrl: 'modules/core/views/software.client.view.html'
		}).
		state('methodology', {
			url: '/methodology/{sectionName}',
			templateUrl: 'modules/core/views/methodology.client.view.html'
		}).

		//	---------------- Definition -----------------

			// Portfolio structure / How-to
			state('how-to-structure-portfolio', {
				url: '/articles/definition/how-to-structure-portfolio',
				templateUrl: 'modules/core/views/methodology-articles/definition/how-to-structure-portfolio.client.view.html'
			}).
			// Portfolio structure / Accountability
			state('portfolio-accountability', {
				url: '/articles/definition/portfolio-accountability',
				templateUrl: 'modules/core/views/methodology-articles/definition/portfolio-accountability.client.view.html'
			}).




		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);

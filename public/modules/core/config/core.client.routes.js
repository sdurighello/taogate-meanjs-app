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
			url: '/methodology',
			templateUrl: 'modules/core/views/methodology.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);

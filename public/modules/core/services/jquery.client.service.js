'use strict';

angular.module('core').factory('jQuery', ['$window',
	function($window) {
		// Jquery service logic
		// ...

		// Public API
		return $window.jQuery;
	}
]);

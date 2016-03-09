'use strict';

angular.module('core').filter('projectsPrioritization', [
	function() {
		return function(input) {
			// Projects prioritization directive logic
			// ...

			return 'projectsPrioritization filter: ' + input;
		};
	}
]);
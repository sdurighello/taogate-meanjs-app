'use strict';

angular.module('subusers').filter('filterSubuser', [
	function() {
		return function(input) {
			// Filter subuser directive logic
			// ...

			return 'filterSubuser filter: ' + input;
		};
	}
]);
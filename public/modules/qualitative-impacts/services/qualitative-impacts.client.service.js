'use strict';

//Qualitative impacts service used to communicate Qualitative impacts REST endpoints
angular.module('qualitative-impacts').factory('QualitativeImpacts', ['$resource',
	function($resource) {
		return $resource('qualitative-impacts/:qualitativeImpactId', { qualitativeImpactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Qualitative impact scores service used to communicate Qualitative impact scores REST endpoints
angular.module('qualitative-analysis-setup').factory('QualitativeImpactScores', ['$resource',
	function($resource) {
		return $resource('qualitative-impact-scores/:qualitativeImpactScoreId', { qualitativeImpactScoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

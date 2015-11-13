'use strict';

//People portfolio groups service used to communicate People portfolio groups REST endpoints
angular.module('people-portfolio-groups').factory('PeoplePortfolioGroups', ['$resource',
	function($resource) {
		return $resource('people-portfolio-groups/:peoplePortfolioGroupId', { peoplePortfolioGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
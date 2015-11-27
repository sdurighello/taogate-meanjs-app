'use strict';

//People portfolio roles service used to communicate People portfolio roles REST endpoints
angular.module('people-portfolio-roles').factory('PeoplePortfolioRoles', ['$resource',
	function($resource) {
		return $resource('people-portfolio-roles/:peoplePortfolioRoleId', { peoplePortfolioRoleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
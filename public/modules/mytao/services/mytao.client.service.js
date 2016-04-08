'use strict';

angular.module('mytao').factory('Mytao', ['$resource',
	function($resource) {
        return $resource('mytao', {
        }, {
            userProjects: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-projects'
            },
            userPortfolios: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-portfolios'
            }
        });
	}
]);

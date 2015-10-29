'use strict';

//Portfolios service used to communicate Portfolios REST endpoints
angular.module('portfolios').factory('Portfolios', ['$resource',
	function($resource) {
		return $resource('portfolios/:portfolioId', { portfolioId: '@_id'
		},
            {
                update: {
                    method: 'PUT'
                }
		    }
        );
	}
]);

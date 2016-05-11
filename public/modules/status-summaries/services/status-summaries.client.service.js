'use strict';

//Status summaries service used to communicate Status summaries REST endpoints
angular.module('status-summaries').factory('StatusSummaries', ['$resource',
    function($resource) {
        return $resource('status-summaries', {
        }, {
            portfolioSummary: {
                method: 'GET',
                isArray: true,
                url: 'status-summaries/portfolioSummary'
            }
        });
    }
]);

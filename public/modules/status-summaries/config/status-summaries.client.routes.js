'use strict';

//Setting up route
angular.module('status-summaries').config(['$stateProvider',
    function($stateProvider) {
        // Status summaries state routing
        $stateProvider.
        state('portfolio-status-summary', {
            url: '/portfolio-status-summary',
            templateUrl: 'modules/status-summaries/views/portfolio-summary.client.view.html'
        });
    }
]);

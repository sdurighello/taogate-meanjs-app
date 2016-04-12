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
            },
            userProjectReviews: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-project-reviews'
            },
            userPortfolioReviews: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-portfolio-reviews'
            },
            userImprovementActivities: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-improvement-activities'
            },
            userProjectChangeRequests: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-project-change-requests'
            },
            userProjectStatusUpdates: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-project-status-updates'
            },
            userPortfolioChangeRequests: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-portfolio-change-requests'
            },
            userGateReviews: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-gate-reviews'
            }
        });
	}
]);

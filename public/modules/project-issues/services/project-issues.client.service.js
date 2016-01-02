'use strict';

//Project issues service used to communicate Project issues REST endpoints
angular.module('project-issues').factory('ProjectIssues', ['$resource',
	function($resource) {
		return $resource('project-issues/:projectIssueId', { projectIssueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
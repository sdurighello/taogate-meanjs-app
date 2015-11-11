'use strict';

//Issue states service used to communicate Issue states REST endpoints
angular.module('issue-states').factory('IssueStates', ['$resource',
	function($resource) {
		return $resource('issue-states/:issueStateId', { issueStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
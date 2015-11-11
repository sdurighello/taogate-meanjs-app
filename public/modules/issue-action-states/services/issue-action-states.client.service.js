'use strict';

//Issue action states service used to communicate Issue action states REST endpoints
angular.module('issue-action-states').factory('IssueActionStates', ['$resource',
	function($resource) {
		return $resource('issue-action-states/:issueActionStateId', { issueActionStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
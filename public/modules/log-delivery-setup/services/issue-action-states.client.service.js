'use strict';

//Issue action states service used to communicate Issue action states REST endpoints
angular.module('log-delivery-setup').factory('IssueActionStates', ['$resource',
	function($resource) {
		return $resource('issue-action-states/:issueActionStateId', { issueActionStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

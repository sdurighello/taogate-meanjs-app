'use strict';

//Issue states service used to communicate Issue states REST endpoints
angular.module('log-delivery-setup').factory('IssueStates', ['$resource',
	function($resource) {
		return $resource('issue-states/:issueStateId', { issueStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Issue reasons service used to communicate Issue reasons REST endpoints
angular.module('issue-reasons').factory('IssueReasons', ['$resource',
	function($resource) {
		return $resource('issue-reasons/:issueReasonId', { issueReasonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

angular.module('core').directive('projectList', [
	function() {
		return {
            restrict: 'EA',
            scope: { projects:'=projects', selectProject:'=selectProject', portfolios:'=portfolios', gateProcesses:'=gateProcesses', isResolving:'=isResolving' },
            templateUrl:'modules/core/directives/project-list.client.directive.html'
		};
	}
]);

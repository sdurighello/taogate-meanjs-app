'use strict';

angular.module('core').directive('projectList', [
	function() {
		return {
            restrict: 'EA',
            scope: { projects:'=projects', selectProject:'=selectProject', portfolios:'=portfolios', gateProcesses:'=gateProcesses' },
            templateUrl:'modules/core/directives/project-list.client.directive.html'
		};
	}
]);

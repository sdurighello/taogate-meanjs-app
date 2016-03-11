'use strict';

angular.module('core').filter('projectsProcess', ['_',
	function(_) {
		return function(projects, filterProcess) {
			if(filterProcess.unassigned){
				return _.filter(projects, function(project){
					return _.isNull(project.process)
				});
			} else if(filterProcess.process){
				return _.filter(projects, function(project){
                    if(project.process){
                        return project.process._id === filterProcess.process._id;
                    }
				});
			} else {
				return projects;
			}
		};
	}
]);

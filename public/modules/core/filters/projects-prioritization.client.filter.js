'use strict';

angular.module('core').filter('projectsPrioritization', ['_',
	function(_) {
		return function(projects, filterPrioritization) {
			console.log('projectsPrioritization', arguments);
			if(filterPrioritization.group && filterPrioritization.priority && filterPrioritization.priorityValue){
				return _.filter(projects, function(project){
					return _.find(project.prioritization, function (assignedGroup) {
						// Filter group
						if(assignedGroup.group === filterPrioritization.group._id){
							return _.find(assignedGroup.priorities, function(assignedPriority){
								// Filter priority & value
								return (assignedPriority.priority === filterPrioritization.priority._id &&
								assignedPriority.priorityValue === filterPrioritization.priorityValue._id);
							});
						}
					});
				});
			} else {
				return projects;
			}
		};
	}
]);

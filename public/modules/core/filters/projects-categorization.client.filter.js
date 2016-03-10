'use strict';

angular.module('core').filter('projectsCategorization', ['_',
	function(_) {
		return function(projects, filterCategorization) {
			console.log('projectsCategorization', arguments);
            if(filterCategorization.group && filterCategorization.category && filterCategorization.categoryValue){
                return _.filter(projects, function(project){
                    return _.find(project.categorization, function (assignedGroup) {
                        // Filter group
                        if(assignedGroup.group === filterCategorization.group._id){
                            return _.find(assignedGroup.categories, function(assignedCategory){
                                // Filter category & value
                                return (assignedCategory.category === filterCategorization.category._id &&
                                assignedCategory.categoryValue === filterCategorization.categoryValue._id);
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

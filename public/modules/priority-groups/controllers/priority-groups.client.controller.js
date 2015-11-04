'use strict';

// Priority groups controller
angular.module('priority-groups').controller('PriorityGroupsController', ['$scope', '$stateParams', '$location', 'Authentication',
	'PriorityValues', 'PriorityGroups', 'Priorities', '$q', '_',
	function($scope, $stateParams, $location, Authentication, PriorityValues, PriorityGroups, Priorities, $q, _) {

		// ------------- INIT -------------

		$scope.init = function(){
			Priorities.query(function(priorities){
				PriorityGroups.query(function(groups){
                    PriorityValues.query(function(values){
                        $scope.priorityValues = values;
                        $scope.priorities = priorities;
                        $scope.priorityGroups = groups;
                    });
				});
			});
		};

        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            $scope.userHasAuthorization = _.some(obj.user.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });
        });


// ---------------------------------------------------- PRIORITY VALUES --------------------------------------

        // ------------------- DRAG AND DROP LISTENERS -------

        $scope.dragControlListeners = {
            //accept: function (sourceItemHandleScope, destSortableScope) {
            //    //override to determine drag is allowed or not. default is true.
            //    return true;
            //},
            //itemMoved: function (event) {
            //
            //},
            orderChanged: function(event) {
                if(event.source.index < event.dest.index){
                    for(var i=event.source.index; i<=event.dest.index; i++){
                        $scope.updateValue($scope.priorityValues[i]);
                    }
                }
                if(event.source.index > event.dest.index){
                    for(var j=event.dest.index; j<=event.source.index; j++){
                        $scope.updateValue($scope.priorityValues[j]);
                    }
                }
            }
            //containment: '#board',//optional param.
            //clone: true //optional param for clone feature.
        };

        /*
         event object - structure
            source:
                index: original index before move.
                itemScope: original item scope before move.
                sortableScope: original sortable list scope.
            dest:
                index: index after move.
                sortableScope: destination sortable scope.
            -------------
         sourceItemScope - the scope of the item being dragged.
         destScope - the sortable destination scope, the list.
         destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
         */


        // ------------------- NG-SWITCH ---------------------

        $scope.selectValueForm = function(string){
            if(string === 'view'){ $scope.switchValueForm = 'view';}
            if(string === 'edit'){$scope.switchValueForm = 'edit';}
        };

        // ------------------- LIST OF VALUES -----------------

        $scope.findValues = function() {
            PriorityValues.query(function(values){
                $scope.priorityValues = _.clone(values);
            });
        };

        // ------------------- EDIT -----------------

        var originalValue;
        $scope.selectValue = function(value){
            $scope.error = null;
            $scope.selectValueForm('view');
            $scope.priorityValue = value;
            originalValue = _.clone(value);
        };

        $scope.updateValue = function(value) {
            $scope.error = null;
            value.position = _.indexOf($scope.priorityValues, value) + 1;
            value.$update(function(response) {
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditValue = function(value){
            value.name = originalValue.name;
            value.description = originalValue.description;
            $scope.selectValueForm('view');
        };

        // ------------------- DELETE -----------------

        $scope.removeValue = function(value) {
            $scope.error = null;
            value.$remove(function(response) {
                $scope.priorityValue = null;
                $scope.findValues();
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createValue = function() {
            $scope.error = null;
            var priorityValue = new PriorityValues ({
                name: 'New priority value',
                numericalValue: 0,
                position: $scope.priorityValues.length + 1
            });
            priorityValue.$save(function(response) {
                $scope.findValues();
                $scope.selectValueForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


// ---------------------------------------------------- GROUPS & PRIORITIES --------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchPriorityForm = {};

		$scope.selectPriorityForm = function(priority, string){
			if(string === 'view'){ $scope.switchPriorityForm[priority._id] = 'view';}
			if(string === 'edit'){$scope.switchPriorityForm[priority._id] = 'edit';}
		};

		// ----------------- REFRESH GROUP LIST ------------

		$scope.groupList = function(){
			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			});
		};

		// ------------------ CREATE GROUP ----------------

		$scope.createGroup = function() {
			$scope.error = null;

			var priorityGroup = new PriorityGroups ({
				name: 'New priority group',
				description: 'new group description',
				priorities: []
			});

            priorityGroup.$save(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditGroup = {};

		$scope.selectGroup = function(group){
			originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(group) {
			group.$update(function(response) {
				$scope.selectGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
			group.description = originalEditGroup[group._id].description;
			$scope.selectGroupForm(group, 'view');
		};

		// ------------------- REMOVE GROUP -----------------

		$scope.removeGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------ CREATE PRIORITY ----------------

		$scope.createPriority = function(group) {
			$scope.error = null;

			var priority = new Priorities ({
				name: 'New priority',
				description: 'New priority description'
			});

            priority.$save(function(priorityRes) {
				group.priorities.push(priorityRes);
				group.$update(function(groupRes) {

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT PRIORITY -----------------

		var originalEditPriority = {};

		$scope.selectEditPriority = function(group, priority){
			originalEditPriority[priority._id] = _.clone(priority);
			$scope.selectPriorityForm(priority, 'edit');
		};

		$scope.updatePriority = function(group, priority) {
			Priorities.update(priority, function(response) {
				$scope.selectPriorityForm(priority, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPriority = function(priority){
			$scope.error = null;
			priority.name = originalEditPriority[priority._id].name;
			priority.description = originalEditPriority[priority._id].description;
			$scope.selectPriorityForm(priority, 'view');
		};

		// ------------------- REMOVE PRIORITY -----------------

		$scope.removePriority = function(group, priority) {
			$scope.error = null;

            Priorities.remove({},priority, function(res){
                group.priorities = _.without(group.priorities, priority);
            }, function(err){
                $scope.error = err.data.message;
            });

		};
	}
]);

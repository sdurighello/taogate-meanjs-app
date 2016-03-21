'use strict';

angular.module('priority-setup').controller('PrioritySetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'PriorityValues', 'PriorityGroups', 'Priorities', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, PriorityValues, PriorityGroups, Priorities, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

			Priorities.query(function(priorities){
				$scope.priorities = priorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityValues.query(function(values){
				$scope.priorityValues = values;
			}, function(err){
				$scope.initError.push(err.data.message);
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
                for(var i = 0; i < $scope.priorityValues.length; i++){
                    $scope.updateValue($scope.priorityValues[i]);
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
            $scope.initError = [];
			PriorityValues.query(function(values){
				$scope.priorityValues = values;
			}, function(err){
                $scope.initError.push(err.data.message);
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
			value.numericalValue = originalValue.numericalValue;
			value.description = originalValue.description;
			$scope.selectValueForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeValue = function(value) {
			$scope.error = null;
            value.$remove(function(response) {
                $scope.priorityValues = _.without($scope.priorityValues, value);
                for(var i = 0; i < $scope.priorityValues.length; i++){
                    if($scope.priorityValues[i].position > value.position){
                        $scope.updateValue($scope.priorityValues[i]);
                    }
                }
                $scope.priorityValue = null;
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
				$scope.selectValueForm('view');

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
            $scope.initError = [];
			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			}, function(err){
                $scope.initError.push(err.data.message);
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

			priority.$save({groupId: group._id}, function(res) {
				// Add new priority to the view group
				group.priorities.push(res);

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

            Priorities.remove({groupId: group._id}, priority, function(res){
                group.priorities = _.without(group.priorities, priority);
            }, function(err){
                $scope.error = err.data.message;
            });

		};
	}
]);

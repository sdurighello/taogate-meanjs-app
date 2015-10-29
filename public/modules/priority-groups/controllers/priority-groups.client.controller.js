'use strict';

// Priority groups controller
angular.module('priority-groups').controller('PriorityGroupsController', ['$scope', '$stateParams', '$location', 'Authentication',
	'PriorityGroups', 'Priorities', '$q', '_',
	function($scope, $stateParams, $location, Authentication, PriorityGroups, Priorities, $q, _) {

		// ------------- INIT -------------

		$scope.init = function(){
			Priorities.query(function(priorities){
				PriorityGroups.query(function(groups){
					$scope.priorities = priorities;
					$scope.priorityGroups = groups;
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
			Priorities.query({_id:priority._id}, function(res){
				var resPriority = res[0];
				resPriority.$remove(function(prioritiesResp) {
					$scope.groupList();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			});
		};
	}
]);

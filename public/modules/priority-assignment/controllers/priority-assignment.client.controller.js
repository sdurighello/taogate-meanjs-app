'use strict';

angular.module('priority-assignment').controller('PriorityAssignmentController', ['$scope', '$stateParams', '$location', 'Authentication',
	'Projects','PriorityGroups', 'Priorities', 'PriorityValues', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, PriorityGroups, Priorities, PriorityValues, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query({'selection.active': true, 'selection.selectedForPrioritization': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Priorities.query(function(priorities){
				$scope.priorities = priorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityValues.query(function(values){
				$scope.priorityValues = values;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			$scope.showPriorityValue = {};

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



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchPriorityForm = {};

		$scope.selectPriorityForm = function(assignedPriority, string){
			if(string === 'view'){$scope.switchPriorityForm[assignedPriority._id] = 'view';}
			if(string === 'edit'){$scope.switchPriorityForm[assignedPriority._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

		var originalPriorityAssignment;
		$scope.selectProject = function(project){
			originalPriorityAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification prioritization portfolio',
				deepPopulateArray : [
                    'portfolio',
                    'identification.projectManager','identification.backupProjectManager',
                    'prioritization.group','prioritization.priorities.priority'
                ]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalPriorityAssignment = null;
		};


		// ------------- SELECT PRIORITY ASSIGNMENT ---------

		$scope.selectPriorityAssignment = function(assignedPriority){
			originalPriorityAssignment[assignedPriority._id] = _.clone(assignedPriority);
			$scope.selectPriorityForm(assignedPriority, 'edit');
		};



		// ------------- EDIT PRIORITY ASSIGNMENT ---------

		$scope.saveAssignedPriority = function(project, assignedGroup, assignedPriority){
			Projects.updatePriorityAssignment(
				{
					projectId: project._id,
					assignedGroupId: assignedGroup._id,
					assignedPriorityId: assignedPriority._id
				},{valueId: assignedPriority.priorityValue}, function(res){
					$scope.selectPriorityForm(assignedPriority, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedPriority = function(assignedPriority){
			assignedPriority.priorityValue = originalPriorityAssignment[assignedPriority._id].priorityValue;
			$scope.selectPriorityForm(assignedPriority, 'view');
		};


	}
]);

'use strict';

angular.module('gate-management-assignment').controller('GateManagementAssignmentController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects','Portfolios', 'GateProcesses', 'ProcessAssignments', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcesses, ProcessAssignments, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query({'selection.selectedForDelivery': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			GateProcesses.query(function(gateProcesses){
				$scope.gateProcesses = gateProcesses;
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


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};


		// ------------- SELECT VIEW PROCESS ASSIGNMENT ------------

		var originalProcessAssignment;
		$scope.selectProject = function(project){
            $scope.error = null;
            $scope.selectedProject = project;
            ProcessAssignments.findOneByProjectId(
                { projectId: project._id },
                function(res){
				$scope.selectedProcessAssignment = res;
                originalProcessAssignment = _.cloneDeep(res);
				$scope.selectProjectForm('view');
			},function(err){
                $scope.selectProjectForm('default');
				$scope.error = err.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProcessAssignment = null;
            $scope.selectedProject = null;
			$scope.selectProjectForm('default');
		};


		// ------------- EDIT PROCESS ASSIGNMENT ------------

		$scope.editProject = function(){
			// Save the project to the server
            ProcessAssignments.updateProcess(
                { processAssignmentId: $scope.selectedProcessAssignment._id },
                { processId: $scope.selectedProcessAssignment.process },
                function(res) {
				$scope.selectProject($scope.selectedProject);
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditProject = function(){
			$scope.selectedProcessAssignment = _.cloneDeep(originalProcessAssignment);
			$scope.selectProject($scope.selectedProject);
		};


	}
]);

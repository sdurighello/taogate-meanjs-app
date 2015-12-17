'use strict';

angular.module('gate-management-assignment').controller('GateManagementAssignmentController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects','Portfolios', 'GateProcesses', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcesses, _ , $q) {

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


		// ------------- SELECT VIEW PROJECT ------------

		var originalProject;
		$scope.selectProject = function(project){
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio process',
				deepPopulateArray : []
			}, function(res){
				$scope.selectedProject = res;
				originalProject = _.cloneDeep(res);
				$scope.selectProjectForm('view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			$scope.selectProjectForm('default');
		};


		// ------------- EDIT PROJECT ------------

		$scope.editProject = function(){
			// Save the project to the server
			Projects.updateProcessAssignment(
				{projectId: $scope.selectedProject._id},
				{processId: $scope.selectedProject.process},
				function(res) {
					$scope.selectProject($scope.selectedProject);
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		};

		$scope.cancelEditProject = function(){
			$scope.selectedProject = _.cloneDeep(originalProject);
			$scope.selectProject($scope.selectedProject);
		};


	}
]);

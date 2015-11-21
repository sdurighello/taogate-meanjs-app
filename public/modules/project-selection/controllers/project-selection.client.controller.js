'use strict';

angular.module('project-selection').controller('ProjectSelectionController', ['$scope','$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
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

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};


		// ------------- SELECT VIEW PROJECT ------------

		var originalProject;
		var clickedProject;
		$scope.selectProject = function(project){
			// Save the clicked project to update its text if changes to name happen
			clickedProject = project;
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
                retPropertiesString : 'user created selection identification portfolio',
                deepPopulateArray : [
                    'portfolio',
                    'identification.projectManager','identification.backupProjectManager'
                ]
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
			clickedProject = null;
			$scope.selectProjectForm('default');
		};


		// ------------- EDIT PROJECT ------------

		$scope.editProject = function(){
			// Clean up the deep populate
			var projectCopy = _.cloneDeep($scope.selectedProject);
            projectCopy.portfolio = allowNull(projectCopy.portfolio);
			projectCopy.identification.projectManager = allowNull($scope.selectedProject.identification.projectManager);
			projectCopy.identification.backupProjectManager = allowNull($scope.selectedProject.identification.backupProjectManager);

			// Save the project to the server
			Projects.update(projectCopy, function(res) {
				// Update the text on the project list (project from $scope.projects)
				clickedProject.identification.idNumber = res.identification.idNumber;
				clickedProject.identification.name = res.identification.name;
				$scope.selectProject($scope.selectedProject);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditProject = function(){
			$scope.selectedProject = _.cloneDeep(originalProject);
			$scope.selectProject($scope.selectedProject);
		};



		// ------------- DELETE PROJECT ------------

		$scope.deleteProject = function(){
			Projects.remove({},{_id: $scope.selectedProject._id}, function(projectRes){
				// Remove project from the "projects" collection
				$scope.projects = _.without($scope.projects, clickedProject);
				$scope.selectedProject = null;
				clickedProject = null;
				$scope.selectProjectForm('default');
			}, function(err){
				$scope.error = err.data.message;
			});
		};


	}
]);

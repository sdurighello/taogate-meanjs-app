'use strict';

angular.module('project-identification').controller('ProjectIdentificationController', ['$scope','$stateParams', '$location', 'Authentication',
	'Projects','Subusers', 'GateProcesses', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Subusers, GateProcesses, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Subusers.query(function(users){
				$scope.users = users;
				$scope.projectManagers = _.filter(users, function(user){
					return _.find(_.get(user,'roles'), function(role){
						return role === 'projectManager';
					});
				});
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            GateProcesses.query(function(processes){
                $scope.gateProcesses = processes;
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


        // ------------- CREATE NEW PROJECT -----------

        $scope.newProject = {};

        $scope.createProject = function(){
            var newProject = new Projects({
                identification: {
                    idNumber : $scope.newProject.idNumber,
                    name : $scope.newProject.name,
                    description : $scope.newProject.description,
                    reqStartDate: $scope.newProject.reqStartDate,
                    reqEndDate : $scope.newProject.reqEndDate,
                    earmarkedFunds : $scope.newProject.earmarkedFunds,
                    projectManager: allowNull($scope.newProject.projectManager),
                    backupProjectManager: allowNull($scope.newProject.backupProjectManager)
                },
                selection: {
                    current: {
                        active : true
                    },
                    history:[]
                }
            });
            newProject.$save(function(response) {
                // Add new project to view after saving to server
                $scope.projects.push(newProject);
                // Clear form fields
                $scope.newProject = {};
                // Show new project in view
                $scope.selectProjectForm('default');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelNewProject = function(){
            $scope.newProject = {};
            $scope.selectProjectForm('default');
        };


        // ------------- SELECT VIEW PROJECT ------------

        var setProject = function(project){
            $scope.selectedProject = project;
        };

        $scope.selectProject = function(project){
            Projects.query({_id: project._id}, function(projectRes){
                setProject(projectRes);
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelViewProject = function(){
            $scope.selectProjectForm('default');
        };


        // ------------- EDIT PROJECT ------------

        //$scope.editProject = function(){
        //    // Clean up the deep populate
        //    var projectCopy = _.clone($scope.selectedProject);
        //    projectCopy.process = allowNull($scope.selectedProject.process);
        //    projectCopy.identification.projectManager = allowNull($scope.selectedProject.identification.projectManager);
        //    projectCopy.identification.backupProjectManager = allowNull($scope.selectedProject.identification.backupProjectManager);
        //
        //    // Save the project to the server
        //    Projects.update(projectCopy, function(response) {
        //
        //    }, function(errorResponse) {
        //        $scope.error = errorResponse.data.message;
        //    });
        //};
        //
        //$scope.cancelEditProject = function(){
        //    $scope.selectedProject = _.cloneDeep(originalProject);
        //    $scope.selectProjectForm('view');
        //};



        // ------------- DELETE PROJECT ------------

        $scope.deleteProject = function(){
            Projects.remove({},{_id: $scope.selectedProject._id}, function(projectRes){
                // Remove project from the "projects" collection
                $scope.projects = _.without($scope.projects, projectRes);
                $scope.selectedProject = null;
                $scope.selectProjectForm('default');
            }, function(err){
                $scope.error = err.data.message;
            });
        };








	}
]);
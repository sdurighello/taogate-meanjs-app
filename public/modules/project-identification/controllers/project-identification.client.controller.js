'use strict';

angular.module('project-identification').controller('ProjectIdentificationController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Projects', 'Portfolios', 'GateProcesses', 'Subusers', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcesses, Subusers, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initErrors = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

			Subusers.query(function(users){
				$scope.users = users;
				$scope.projectManagers = _.filter(users, function(user){
					return _.find(user.roles, function(role){
                        return role === 'projectManager';
                    });
				});
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			Projects.query({'selection.active': true}, function(projects){
				$scope.projects = projects;
                // If there is a stateParam _id , then select a project
                if($stateParams.projectId){
                    var requestedProject = _.find($scope.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(requestedProject){
                        $scope.selectProject(requestedProject);
                    } else {
                        $scope.error = 'Project not found';
                    }
                }
            }, function(err){
				$scope.initErrors.push(err.data.message);
			});

            Portfolios.query(function(res){
                $scope.portfolios = res;
            }, function(err){
                $scope.initErrors.push(err.data.message);
            });

            GateProcesses.query(function(res){
                $scope.gateProcesses = res;
            }, function(err){
                $scope.initErrors.push(err.data.message);
            });

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
            if(action === 'new'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = !!_.some(userData.roles, function(role){
                    return role === 'portfolioManager';
                });
                return userIsSuperhero || userIsPortfolioManager;
            }
        };


        // ------- DATE PICKER ------

        $scope.openStartDatePickerNew = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startDatePickerOpenedNew = true;
        };

        $scope.openEndDatePickerNew = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endDatePickerOpenedNew = true;
        };

        $scope.openStartDatePickerEdit = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startDatePickerOpenedEdit = true;
        };

        $scope.openEndDatePickerEdit = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endDatePickerOpenedEdit = true;
        };


		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initErrors = [];
			Projects.query({'selection.active': true}, function(projects){
                $scope.projects = projects;
			}, function(err){
				$scope.initErrors.push(err.data.message);
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
                // Definition
                parent: null,
                portfolio: null,
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
                categorization: [],
                prioritization: [],
                selection: {active : true},
                // Evaluation
                costs: [],
                benefits: [],
                qualitativeAnalysis: [],
                riskAnalysis: [],
                stakeholders: [],
                // Delivery
                process: null
            });
            newProject.$save(function(res) {
                // Add new project to view after saving to server
                $scope.projects.unshift(newProject);
                // Clear form fields
                $scope.newProject = {};
                $scope.selectProjectForm('default');
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewProject = function(){
            $scope.newProject = {};
            $scope.selectProjectForm('default');
        };


        // ------------- SELECT VIEW PROJECT ------------


        var originalProject = {};
        $scope.selectProject = function(project){
            $scope.error = null;
            originalProject[project._id] = _.cloneDeep(project);
            $scope.selectedProject = project;
            $scope.selectProjectForm('view');
        };

        $scope.cancelViewProject = function(){
            originalProject = {};
            $scope.selectedProject = null;
            $scope.selectProjectForm('default');
        };

        // ------------- EDIT PROJECT ------------

        $scope.saveEditProject = function(project){
            // Clean up the deep populate
            var projectCopy = _.cloneDeep(project);
            projectCopy.process = allowNull(project.process);
            projectCopy.portfolio = allowNull(project.portfolio);
            // Save the project to the server
            Projects.update(projectCopy, function(res) {
                $scope.selectProject(project);
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditProject = function(project){
            project.identification = originalProject[project._id].identification;
            $scope.selectProject(project);
        };



        // ------------- DELETE PROJECT ------------

        $scope.deleteProject = function(project){
            Projects.remove({},{_id: project._id}, function(res){
                $scope.projects = _.without($scope.projects, project);
                $scope.selectedProject = null;
                $scope.selectProjectForm('default');
            }, function(err){
                $scope.error = err.data.message;
            });
        };




	}
]);

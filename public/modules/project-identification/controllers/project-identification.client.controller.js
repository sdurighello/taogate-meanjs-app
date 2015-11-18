'use strict';

angular.module('project-identification').controller('ProjectIdentificationController', ['$scope','$stateParams', '$location', 'Authentication',
	'Projects','Subusers', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Subusers, _ , $q) {

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
                ranking: [],
                selection: {
                    current: {
                        active : true
                    },
                    history:[]
                },
                // Evaluation
                stakeholders: [],
                financialAnalysis: {
                    costs: [],
                    benefits: [],
                    ratios: {
                        NPV: null,
                        BCR: null,
                        payback: null
                    }
                },
                qualitativeAnalysis: [],
                riskAnalysis: [],
                // Delivery
                process: null

            });
            newProject.$save(function(response) {
                // Add new project to view after saving to server
                $scope.projects.unshift(newProject);
                // Clear form fields
                $scope.newProject = {};
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

        var originalProject;
        var clickedProject;
        $scope.selectProject = function(project){
            // Save the clicked project to update its text if changes to name happen
            clickedProject = project;
            // Get the full project fat object from the "projectById" server function that populates everything
            Projects.get({projectId:project._id}, function(res){
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

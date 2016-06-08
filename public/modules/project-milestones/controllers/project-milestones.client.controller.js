'use strict';

angular.module('project-milestones').controller('ProjectMilestoneController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcessTemplates', 'ProjectMilestones', 'ProjectMilestoneTypes', 'MilestoneStates', 'LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcessTemplates, ProjectMilestones, ProjectMilestoneTypes, MilestoneStates, LogStatusIndicators) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.isResolving = false;

		$scope.initErrors = [];

		$scope.init = function(){

			$scope.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function(res){
				$scope.projects = res;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				$scope.gateProcesses = gateProcesses;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			ProjectMilestoneTypes.query(function(projectMilestoneTypes){
				$scope.projectMilestoneTypes = projectMilestoneTypes;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			MilestoneStates.query(function(milestoneStates){
				$scope.milestoneStates = milestoneStates;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatuses = logStatusIndicators;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){

            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

            if(action === 'edit' && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }

        };

		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = '';
		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchHeaderForm = {};
		$scope.selectHeaderForm = function(string, projectMilestone){
			if(string === 'view'){ $scope.switchHeaderForm[projectMilestone._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectMilestone._id] = 'edit';}
		};

		$scope.switchStatusForm = {};
		$scope.selectStatusForm = function(string, projectMilestone){
			if(string === 'view'){ $scope.switchStatusForm[projectMilestone._id] = 'view';}
			if(string === 'edit'){$scope.switchStatusForm[projectMilestone._id] = 'edit';}
		};


		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortProjectMilestones = function(projectMilestone) {
			return new Date(projectMilestone.statusReview.currentRecord.estimateDeliveryDate);
		};

		$scope.sortAppliedChanges = function(appliedChange) {
			return new Date(appliedChange.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectMilestoneDetails = 'header';

		$scope.activeTab = {};



		// ------------- SELECT PROJECT ------------


		$scope.selectProject = function(project) {

			$scope.projectMilestones = null;
            $scope.selectedGate = null;
            $scope.selectedProjectMilestone = null;

            $scope.cancelNewProjectMilestone();
            
			$scope.selectedProject = project;

            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.query({
				project: project._id
			}, function (res) {
                $scope.isResolving = false;
                $scope.projectMilestones = res;
			}, function (err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});

		};

        // -------------- SELECT GATE ---------------------

        $scope.selectGate = function(gate){
            $scope.error = null;
            $scope.selectedProjectMilestone = null;
            $scope.cancelNewProjectMilestone();
            $scope.selectedGate = gate;
        };


		// ------------- NEW MILESTONE ------------

		$scope.newProjectMilestone = {};

		$scope.createNewProjectMilestone = function(project, gate){
			var newProjectMilestone = new ProjectMilestones({
				project: project._id,
				gate : {_id: gate._id, name: gate.name, standardGate: gate.standardGate},
				type : $scope.newProjectMilestone.type,
				name : $scope.newProjectMilestone.name
			});
            $scope.error = null;
            $scope.isResolving = true;
			newProjectMilestone.$save(function(res) {
                $scope.isResolving = false;
				// Clear new form
				$scope.newProjectMilestone = {};
				// Refresh the list of gate reviews
				$scope.projectMilestones.push(res);
				// Select in view mode the new review
				$scope.selectProjectMilestone(res);
				// Close new review form
                $scope.showNewProjectMilestoneForm = false;
			}, function(err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectMilestone = function(){
            $scope.error = null;
			$scope.newProjectMilestone = {};
            $scope.showNewProjectMilestoneForm = false;
		};


		// ------------- SELECT MILESTONE ------------


		$scope.selectProjectMilestone = function(projectMilestone){
            $scope.selectedProjectMilestone = projectMilestone;
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

        var originalProjectMilestoneHeader = {};

		$scope.editHeader = function(projectMilestone){
            originalProjectMilestoneHeader[projectMilestone._id] = {
                name : projectMilestone.name,
                description : projectMilestone.description,
                state : projectMilestone.state,
                type : projectMilestone.type
            };
			$scope.selectHeaderForm('edit', projectMilestone);
		};

		$scope.saveEditHeader = function(projectMilestone){

            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.updateHeader(
				{
					projectMilestoneId : projectMilestone._id
				}, projectMilestone,
				function(res){
                    $scope.isResolving = false;
					$scope.selectHeaderForm('view', projectMilestone);
				},
				function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
			);
		};

		$scope.cancelEditHeader = function(projectMilestone){
            $scope.error = null;
			projectMilestone.name = originalProjectMilestoneHeader[projectMilestone._id].name;
			projectMilestone.description = originalProjectMilestoneHeader[projectMilestone._id].description;
			projectMilestone.state = originalProjectMilestoneHeader[projectMilestone._id].state;
			projectMilestone.type = originalProjectMilestoneHeader[projectMilestone._id].type;
			$scope.selectHeaderForm('view', projectMilestone);
		};


		$scope.deleteProjectMilestone = function(projectMilestone){
            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.remove({projectMilestoneId: projectMilestone._id}, projectMilestone,
                function(res){
                $scope.isResolving = false;
				$scope.projectMilestones = _.without($scope.projectMilestones, projectMilestone);
				$scope.cancelNewProjectMilestone();
				$scope.selectedProjectMilestone = null;
			}, function(err){
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};


		// -------------------------------------------------------- STATUS -------------------------------------------------

		$scope.baselineDeliveryDateOpened = {};
		$scope.openBaselineDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.baselineDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.estimateDeliveryDateOpened = {};
		$scope.openEstimateDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.estimateDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.actualDeliveryDateOpened = {};
		$scope.openActualDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.actualDeliveryDateOpened[projectMilestone._id] = true;
		};

        var originalProjectMilestoneStatus = {};

		$scope.editStatus = function(projectMilestone){
            originalProjectMilestoneStatus = {
                baselineDeliveryDate : projectMilestone.statusReview.currentRecord.baselineDeliveryDate,
                estimateDeliveryDate : projectMilestone.statusReview.currentRecord.estimateDeliveryDate,
                actualDeliveryDate : projectMilestone.statusReview.currentRecord.actualDeliveryDate,
                status : projectMilestone.statusReview.currentRecord.status,
                completed : projectMilestone.statusReview.currentRecord.completed,
                statusComment : projectMilestone.statusReview.currentRecord.statusComment
            };
			$scope.selectStatusForm('edit', projectMilestone);
		};

		$scope.saveEditStatus = function(projectMilestone){
            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.updateStatus( { projectMilestoneId : projectMilestone._id }, projectMilestone,
				function(res){
                    $scope.isResolving = false;
                    projectMilestone.statusReview = res.statusReview;
					$scope.selectStatusForm('view', projectMilestone);
				},
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditStatus = function(projectMilestone){
            $scope.error = null;
			projectMilestone.statusReview.currentRecord.baselineDeliveryDate = originalProjectMilestoneStatus[projectMilestone._id].baselineDeliveryDate;
			projectMilestone.statusReview.currentRecord.estimateDeliveryDate = originalProjectMilestoneStatus[projectMilestone._id].estimateDeliveryDate;
			projectMilestone.statusReview.currentRecord.actualDeliveryDate = originalProjectMilestoneStatus[projectMilestone._id].actualDeliveryDate;
			projectMilestone.statusReview.currentRecord.status = originalProjectMilestoneStatus[projectMilestone._id].status;
			projectMilestone.statusReview.currentRecord.completed = originalProjectMilestoneStatus[projectMilestone._id].completed;
			projectMilestone.statusReview.currentRecord.statusComment = originalProjectMilestoneStatus[projectMilestone._id].statusComment;
			$scope.selectStatusForm('view', projectMilestone);
		};




	}
]);

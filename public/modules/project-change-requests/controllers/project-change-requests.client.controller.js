'use strict';

angular.module('project-change-requests').controller('ProjectChangeRequestController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcesses', 'ProjectChangeRequests', 'LogReasons', 'ChangeRequestStates', 'LogPriorities','LogStatusIndicators',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcesses, ProjectChangeRequests, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators) {

		// ------------- INIT -------------

		$scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

			$scope.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function(projects){
				$scope.projects = _.filter(projects, function(project){return project.process !== null;});
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

			LogReasons.query(function(logReasons){
				$scope.logReasons = logReasons;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ChangeRequestStates.query(function(changeRequestStates){
				$scope.changeRequestStates = changeRequestStates;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            LogPriorities.query(function(logPriorities){
				$scope.logPriorities = logPriorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            LogStatusIndicators.query(function(logStatusIndicators){
                $scope.logStatuses = logStatusIndicators;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit' && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
            if(action === 'approve' && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsPortfolioManager;
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
		$scope.selectHeaderForm = function(string, projectChangeRequest){
			if(string === 'view'){ $scope.switchHeaderForm[projectChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectChangeRequest._id] = 'edit';}
		};

		$scope.switchBudgetForm = {};
		$scope.selectBudgetForm = function(string, projectChangeRequest){
			if(string === 'view'){ $scope.switchBudgetForm[projectChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchBudgetForm[projectChangeRequest._id] = 'edit';}
		};

		$scope.switchStatusForm = {};
		$scope.selectStatusForm = function(string, projectChangeRequest){
			if(string === 'view'){ $scope.switchStatusForm[projectChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchStatusForm[projectChangeRequest._id] = 'edit';}
		};

		// Baseline

		$scope.switchBaselineDurationForm = {};
		$scope.selectBaselineDurationForm = function(string, baselineDuration){
			if(string === 'view'){ $scope.switchBaselineDurationForm[baselineDuration._id] = 'view';}
			if(string === 'edit'){$scope.switchBaselineDurationForm[baselineDuration._id] = 'edit';}
		};

		$scope.switchBaselineCostForm = {};
		$scope.selectBaselineCostForm = function(string, baselineCost){
			if(string === 'view'){ $scope.switchBaselineCostForm[baselineCost._id] = 'view';}
			if(string === 'edit'){$scope.switchBaselineCostForm[baselineCost._id] = 'edit';}
		};

		$scope.switchBaselineCompletionForm = {};
		$scope.selectBaselineCompletionForm = function(string, baselineCompletion){
			if(string === 'view'){ $scope.switchBaselineCompletionForm[baselineCompletion._id] = 'view';}
			if(string === 'edit'){$scope.switchBaselineCompletionForm[baselineCompletion._id] = 'edit';}
		};

		// Actual

		$scope.switchActualDurationForm = {};
		$scope.selectActualDurationForm = function(string, actualDuration){
			if(string === 'view'){ $scope.switchActualDurationForm[actualDuration._id] = 'view';}
			if(string === 'edit'){$scope.switchActualDurationForm[actualDuration._id] = 'edit';}
		};

		$scope.switchActualCostForm = {};
		$scope.selectActualCostForm = function(string, actualCost){
			if(string === 'view'){ $scope.switchActualCostForm[actualCost._id] = 'view';}
			if(string === 'edit'){$scope.switchActualCostForm[actualCost._id] = 'edit';}
		};

		$scope.switchActualCompletionForm = {};
		$scope.selectActualCompletionForm = function(string, actualCompletion){
			if(string === 'view'){ $scope.switchActualCompletionForm[actualCompletion._id] = 'view';}
			if(string === 'edit'){$scope.switchActualCompletionForm[actualCompletion._id] = 'edit';}
		};



		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortProjectChangeRequests = function(projectChangeRequest) {
			return new Date(projectChangeRequest.raisedOnDate);
		};

        $scope.sortAppliedChanges = function(appliedChange) {
            return new Date(appliedChange.created);
        };

        $scope.calculateDate = function(date, change){
            if(date){
                date = new Date(date);
                return date.setDate(date.getDate() + change);
            }
            return null;
        };

		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectChangeRequestDetails = 'header';

        $scope.activeTab = {};

        // -------------- SELECT GATE ---------------------

        $scope.setReviewObject = function(reviewObj){
            $scope.error = null;
            $scope.selectedProjectChangeRequest = null;
            $scope.reviewObject = reviewObj;
        };


        // ------------- SELECT VIEW PROJECT ------------

		var originalProjectChangeRequest = {};

		$scope.selectProject = function(project) {
			$scope.error = null;
			$scope.selectedProject = null;
			$scope.projectChangeRequestList = null;
            $scope.reviewObject = null;

			$scope.selectedProjectChangeRequest = null;
			originalProjectChangeRequest = {};

			$scope.selectedProject = project;

            $scope.isResolving = true;
			ProjectChangeRequests.getChangeRequestsForProject({
				project: project._id
			}, function (res) {
                $scope.isResolving = false;
				$scope.projectChangeRequestList = res;
			}, function (err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------

		$scope.newProjectCRRaisedOnDateOpened = {};

		$scope.openNewProjectCRRaisedOnDate = function(gate, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.newProjectCRRaisedOnDateOpened[gate._id] = true;
		};

		$scope.newProjectChangeRequest = {};

		$scope.createNewProjectChangeRequest = function(project, gate){
			var newProjectChangeRequest = new ProjectChangeRequests({
				project: project._id,
				gate : gate._id,
				raisedOnDate : $scope.newProjectChangeRequest.raisedOnDate,
				title : $scope.newProjectChangeRequest.title
			});
            $scope.error = null;
            $scope.isResolving = true;
			newProjectChangeRequest.$save(function(res) {
                $scope.isResolving = false;
				// Clear new form
				$scope.newProjectChangeRequest = {};
				// Refresh the list of gate reviews
				_.find($scope.projectChangeRequestList, _.matchesProperty('gate._id', gate._id)).projectChangeRequests.push(res);
				// Select in view mode the new review
				$scope.selectProjectChangeRequest(res);
				// Close new review form done directly in the view's html
			}, function(err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectChangeRequest = function(){
            $scope.error = null;
			$scope.newProjectChangeRequest = {};
		};


		// ------------- SELECT CHANGE REQUEST ------------

		var projectChangeRequestFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of gate reviews

		$scope.selectProjectChangeRequest = function(projectChangeRequest){
            projectChangeRequestFromList[projectChangeRequest._id] = projectChangeRequest;
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.get({
                projectChangeRequestId:projectChangeRequest._id
			}, function(res){
                $scope.isResolving = false;
				$scope.selectedProjectChangeRequest = res;
				originalProjectChangeRequest[projectChangeRequest._id] = _.cloneDeep(res);
				//$scope.selectProjectChangeRequestForm('view');
			},function(errorResponse){
                $scope.isResolving = false;
				$scope.error = errorResponse.data.message;
				$scope.selectedProjectChangeRequest = null;
				originalProjectChangeRequest = {};
			});
		};

		// ------------- CHANGE GATE ------------

		$scope.changeGate = function(){
            $scope.error = null;
			$scope.cancelNewProjectChangeRequest();
			$scope.selectedProjectChangeRequest = null;
			originalProjectChangeRequest = {};
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

		$scope.headerDateOpened = {};
		$scope.openHeaderDate = function(projectChangeRequest, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.headerDateOpened[projectChangeRequest._id] = true;
		};

		$scope.editHeader = function(projectChangeRequest){
			$scope.selectHeaderForm('edit', projectChangeRequest);
		};

		$scope.saveEditHeader = function(projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
			copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
            copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment = allowNull(copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment);
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateHeader(
				{
                    projectChangeRequestId : copyProjectChangeRequest._id
				}, copyProjectChangeRequest,
				function(res){
                    $scope.isResolving = false;
					// Update details pane view with new saved details
					originalProjectChangeRequest[projectChangeRequest._id].raisedOnDate = projectChangeRequest.raisedOnDate;
                    originalProjectChangeRequest[projectChangeRequest._id].title = projectChangeRequest.title;
                    originalProjectChangeRequest[projectChangeRequest._id].description = projectChangeRequest.description;
                    originalProjectChangeRequest[projectChangeRequest._id].state = projectChangeRequest.state;
                    originalProjectChangeRequest[projectChangeRequest._id].reason = projectChangeRequest.reason;
                    originalProjectChangeRequest[projectChangeRequest._id].priority = projectChangeRequest.priority;
					// Update list of reviews with new date / title
                    projectChangeRequestFromList[projectChangeRequest._id].raisedOnDate = projectChangeRequest.raisedOnDate;
                    projectChangeRequestFromList[projectChangeRequest._id].title = projectChangeRequest.title;
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', projectChangeRequest);
				},
				function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
			);
		};

		$scope.cancelEditHeader = function(projectChangeRequest){
            $scope.error = null;
            projectChangeRequest.raisedOnDate = originalProjectChangeRequest[projectChangeRequest._id].raisedOnDate;
            projectChangeRequest.title = originalProjectChangeRequest[projectChangeRequest._id].title;
            projectChangeRequest.description = originalProjectChangeRequest[projectChangeRequest._id].description;
            projectChangeRequest.state = originalProjectChangeRequest[projectChangeRequest._id].state;
            projectChangeRequest.reason = originalProjectChangeRequest[projectChangeRequest._id].reason;
            projectChangeRequest.priority = originalProjectChangeRequest[projectChangeRequest._id].priority;
			$scope.selectHeaderForm('view', projectChangeRequest);
		};


		$scope.deleteProjectChangeRequest = function(reviewObject, projectChangeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.remove({projectChangeRequestId: projectChangeRequest._id}, projectChangeRequest, function(res){
                $scope.isResolving = false;
				reviewObject.projectChangeRequests = _.without(reviewObject.projectChangeRequests, _.find(reviewObject.projectChangeRequests, _.matchesProperty('_id',projectChangeRequest._id)));
				$scope.cancelNewProjectChangeRequest();
				$scope.selectedProjectChangeRequest = null;
				originalProjectChangeRequest = {};
			}, function(err){
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};


		// ----------------------------------------------- SUBMIT - APPROVE - REJECT -----------------------------------------

		$scope.submit = function(project, projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
			copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
			copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
            copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment = allowNull(copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment);
            // Run server side approve
            $scope.error = null;
            $scope.isResolving = true;
			ProjectChangeRequests.submit(
				{
					projectChangeRequestId : copyProjectChangeRequest._id
				}, copyProjectChangeRequest,
				function(res){
                    $scope.isResolving = false;
					// Refresh the approval history
                    projectChangeRequestFromList[projectChangeRequest._id].approval = res.approval;
                    projectChangeRequest.approval = res.approval;
				},
				function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
			);
		};

		$scope.approve = function(project, projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
            copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment = allowNull(copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment);
            // Run server side approve
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.approve(
				{
                    projectChangeRequestId : copyProjectChangeRequest._id
				}, copyProjectChangeRequest,
				function(res){
                    $scope.isResolving = false;
					// Refresh the object with the current performances values since you approved
                    $scope.selectProjectChangeRequest(projectChangeRequest);
				},
				function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
			);
		};

        $scope.reject = function(project, projectChangeRequest){
            // Clean-up deepPopulate
            var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
            copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment = allowNull(copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment);
            // Run server side approve
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.reject(
                {
                    projectChangeRequestId : copyProjectChangeRequest._id
                }, copyProjectChangeRequest,
                function(res){
                    $scope.isResolving = false;
                    // Refresh the approval history
                    projectChangeRequestFromList[projectChangeRequest._id].approval = res.approval;
                    projectChangeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, projectChangeRequest){
            // Clean-up deepPopulate
            var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
            copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment = _.get(copyProjectChangeRequest.gateAssignmentReview.gateStatusAssignment, '_id');
            // Run server side approve
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.draft(
                {
                    projectChangeRequestId : copyProjectChangeRequest._id
                }, copyProjectChangeRequest,
                function(res){
                    $scope.isResolving = false;
                    // Refresh the approval history
                    projectChangeRequestFromList[projectChangeRequest._id].approval = res.approval;
                    projectChangeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


        // -------------------------------------------------------- BUDGET -------------------------------------------------


        $scope.editBudget = function(projectChangeRequest){
            $scope.selectBudgetForm('edit', projectChangeRequest);
        };

        $scope.saveEditBudget = function(projectChangeRequest){
            // Clean-up deepPopulate
            var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateBudget(
                {
                    projectChangeRequestId : copyProjectChangeRequest._id
                }, copyProjectChangeRequest,
                function(res){
                    $scope.isResolving = false;
                    // Update details pane view with new saved details
                    originalProjectChangeRequest[projectChangeRequest._id].gateAssignmentReview.budgetChange = projectChangeRequest.gateAssignmentReview.budgetChange;
                    // Update list of reviews with new date / title
                    projectChangeRequestFromList[projectChangeRequest._id].gateAssignmentReview.budgetChange = projectChangeRequest.gateAssignmentReview.budgetChange;
                    // Close edit header form and back to view
                    $scope.selectBudgetForm('view', projectChangeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBudget = function(projectChangeRequest){
            $scope.error = null;
            projectChangeRequest.gateAssignmentReview.budgetChange = originalProjectChangeRequest[projectChangeRequest._id].gateAssignmentReview.budgetChange;
            $scope.selectBudgetForm('view', projectChangeRequest);
        };




        // -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.baselineDeliveryDateOpened = {};
        $scope.openBaselineDeliveryDate = function(projectChangeRequest, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDeliveryDateOpened[projectChangeRequest._id] = true;
        };

        $scope.estimateDeliveryDateOpened = {};
        $scope.openEstimateDeliveryDate = function(projectChangeRequest, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDeliveryDateOpened[projectChangeRequest._id] = true;
        };

        $scope.actualDeliveryDateOpened = {};
        $scope.openActualDeliveryDate = function(projectChangeRequest, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDeliveryDateOpened[projectChangeRequest._id] = true;
        };

		$scope.editStatus = function(projectChangeRequest){
			$scope.selectStatusForm('edit', projectChangeRequest);
		};

		$scope.saveEditStatus = function(projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
			// Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateStatus( { projectChangeRequestId : copyProjectChangeRequest._id }, copyProjectChangeRequest,
				function(res){
                    $scope.isResolving = false;
                    // Set the "final" in the gate from the list
                    projectChangeRequestFromList[projectChangeRequest._id].statusReview.currentRecord.completed = projectChangeRequest.statusReview.currentRecord.completed;
                    // Change the selected CR
					originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.baselineDeliveryDate = projectChangeRequest.statusReview.currentRecord.baselineDeliveryDate;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.estimateDeliveryDate = projectChangeRequest.statusReview.currentRecord.estimateDeliveryDate;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.actualDeliveryDate = projectChangeRequest.statusReview.currentRecord.actualDeliveryDate;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.status = projectChangeRequest.statusReview.currentRecord.status;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.completed = projectChangeRequest.statusReview.currentRecord.completed;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.statusComment = projectChangeRequest.statusReview.currentRecord.statusComment;
                    $scope.selectStatusForm('view', projectChangeRequest);
				},
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditStatus = function(projectChangeRequest){
            $scope.error = null;
            projectChangeRequest.statusReview.currentRecord.baselineDeliveryDate = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.baselineDeliveryDate;
            projectChangeRequest.statusReview.currentRecord.estimateDeliveryDate = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.estimateDeliveryDate;
            projectChangeRequest.statusReview.currentRecord.actualDeliveryDate = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.actualDeliveryDate;
            projectChangeRequest.statusReview.currentRecord.status = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.status;
            projectChangeRequest.statusReview.currentRecord.completed = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.completed;
            projectChangeRequest.statusReview.currentRecord.statusComment = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.statusComment;
            $scope.selectStatusForm('view', projectChangeRequest);
		};


		// -------------------------------------------------------- BASELINE DURATION -------------------------------------------------

		var originalBaselineDurationReview = {};

		$scope.editBaselineDuration = function(baselineDurationReview){
			originalBaselineDurationReview[baselineDurationReview._id] = _.cloneDeep(baselineDurationReview);
			$scope.selectBaselineDurationForm('edit', baselineDurationReview);
		};

		$scope.saveEditBaselineDuration = function(projectChangeRequest, baselineDurationReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateBaselineDuration(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					baselineDurationReviewId : baselineDurationReview._id
				}, baselineDurationReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectBaselineDurationForm('view', baselineDurationReview);
		};

		$scope.cancelEditBaselineDuration = function(baselineDurationReview){
            $scope.error = null;
			baselineDurationReview.dateChange = originalBaselineDurationReview[baselineDurationReview._id].dateChange;
			$scope.selectBaselineDurationForm('view', baselineDurationReview);
		};


		// -------------------------------------------------------- ACTUAL DURATION -------------------------------------------------


		var originalActualDurationReview = {};

		$scope.editActualDuration = function(actualDurationReview){
			originalActualDurationReview[actualDurationReview._id] = _.cloneDeep(actualDurationReview);
			$scope.selectActualDurationForm('edit', actualDurationReview);
		};

		$scope.saveEditActualDuration = function(projectChangeRequest, actualDurationReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateActualDuration(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					actualDurationReviewId : actualDurationReview._id
				}, actualDurationReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectActualDurationForm('view', actualDurationReview);
		};

		$scope.cancelEditActualDuration = function(actualDurationReview){
            $scope.error = null;
			actualDurationReview.dateChange = originalActualDurationReview[actualDurationReview._id].dateChange;
			$scope.selectActualDurationForm('view', actualDurationReview);
		};


		// -------------------------------------------------------- BASELINE COST -------------------------------------------------

		var originalBaselineCostReview = {};

		$scope.editBaselineCost = function(baselineCostReview){
			originalBaselineCostReview[baselineCostReview._id] = _.cloneDeep(baselineCostReview);
			$scope.selectBaselineCostForm('edit', baselineCostReview);
		};

		$scope.saveEditBaselineCost = function(projectChangeRequest, baselineCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateBaselineCost(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					baselineCostReviewId : baselineCostReview._id
				}, baselineCostReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectBaselineCostForm('view', baselineCostReview);
		};

		$scope.cancelEditBaselineCost = function(baselineCostReview){
            $scope.error = null;
			baselineCostReview.costChange = originalBaselineCostReview[baselineCostReview._id].costChange;
			$scope.selectBaselineCostForm('view', baselineCostReview);
		};


		// -------------------------------------------------------- ACTUAL COST -------------------------------------------------

		var originalActualCostReview = {};

		$scope.editActualCost = function(actualCostReview){
			originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
			$scope.selectActualCostForm('edit', actualCostReview);
		};

		$scope.saveEditActualCost = function(projectChangeRequest, actualCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateActualCost(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					actualCostReviewId : actualCostReview._id
				}, actualCostReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectActualCostForm('view', actualCostReview);
		};

		$scope.cancelEditActualCost = function(actualCostReview){
            $scope.error = null;
			actualCostReview.costChange = originalActualCostReview[actualCostReview._id].costChange;
			$scope.selectActualCostForm('view', actualCostReview);
		};



		// -------------------------------------------------------- BASELINE COMPLETION -------------------------------------------------

		var originalBaselineCompletionReview = {};

		$scope.editBaselineCompletion = function(baselineCompletionReview){
			originalBaselineCompletionReview[baselineCompletionReview._id] = _.cloneDeep(baselineCompletionReview);
			$scope.selectBaselineCompletionForm('edit', baselineCompletionReview);
		};

		$scope.saveEditBaselineCompletion = function(projectChangeRequest, baselineCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateBaselineCompletion(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					baselineCompletionReviewId : baselineCompletionReview._id
				}, baselineCompletionReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectBaselineCompletionForm('view', baselineCompletionReview);
		};

		$scope.cancelEditBaselineCompletion = function(baselineCompletionReview){
            $scope.error = null;
			baselineCompletionReview.completionChange = originalBaselineCompletionReview[baselineCompletionReview._id].completionChange;
			$scope.selectBaselineCompletionForm('view', baselineCompletionReview);
		};


		// -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

		var originalActualCompletionReview = {};

		$scope.editActualCompletion = function(actualCompletionReview){
			originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
			$scope.selectActualCompletionForm('edit', actualCompletionReview);
		};

		$scope.saveEditActualCompletion = function(projectChangeRequest, actualCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectChangeRequests.updateActualCompletion(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					actualCompletionReviewId : actualCompletionReview._id
				}, actualCompletionReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectActualCompletionForm('view', actualCompletionReview);
		};

		$scope.cancelEditActualCompletion = function(actualCompletionReview){
            $scope.error = null;
			actualCompletionReview.completionChange = originalActualCompletionReview[actualCompletionReview._id].completionChange;
			$scope.selectActualCompletionForm('view', actualCompletionReview);
		};





	}
]);

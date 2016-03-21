'use strict';

angular.module('project-status-management').controller('ProjectStatusManagementController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcesses', 'ProjectStatusUpdates','LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcesses, ProjectStatusUpdates, LogStatusIndicators) {

		$rootScope.staticMenu = false;

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

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatusIndicators = logStatusIndicators;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if((action === 'edit') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
            if((action === 'approve') && user && project){
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
		$scope.selectHeaderForm = function(string, projectUpdateStatus){
			if(string === 'view'){ $scope.switchHeaderForm[projectUpdateStatus._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectUpdateStatus._id] = 'edit';}
		};

		$scope.switchApplyUpdateForm = {};
		$scope.selectApplyUpdateForm = function(string, projectUpdateStatus){
			if(string === 'view'){ $scope.switchApplyUpdateForm[projectUpdateStatus._id] = 'view';}
			if(string === 'edit'){$scope.switchApplyUpdateForm[projectUpdateStatus._id] = 'edit';}
		};

		$scope.switchOverallStatusForm = {};
		$scope.selectOverallStatusForm = function(string, projectUpdateStatus){
			if(string === 'view'){ $scope.switchOverallStatusForm[projectUpdateStatus._id] = 'view';}
			if(string === 'edit'){$scope.switchOverallStatusForm[projectUpdateStatus._id] = 'edit';}
		};

        $scope.switchDurationStatusForm = {};
        $scope.selectDurationStatusForm = function(string, projectUpdateStatus){
            if(string === 'view'){ $scope.switchDurationStatusForm[projectUpdateStatus._id] = 'view';}
            if(string === 'edit'){$scope.switchDurationStatusForm[projectUpdateStatus._id] = 'edit';}
        };

        $scope.switchCostStatusForm = {};
        $scope.selectCostStatusForm = function(string, projectUpdateStatus){
            if(string === 'view'){ $scope.switchCostStatusForm[projectUpdateStatus._id] = 'view';}
            if(string === 'edit'){$scope.switchCostStatusForm[projectUpdateStatus._id] = 'edit';}
        };

        $scope.switchCompletionStatusForm = {};
        $scope.selectCompletionStatusForm = function(string, projectUpdateStatus){
            if(string === 'view'){ $scope.switchCompletionStatusForm[projectUpdateStatus._id] = 'view';}
            if(string === 'edit'){$scope.switchCompletionStatusForm[projectUpdateStatus._id] = 'edit';}
        };

		$scope.switchOutcomeUpdateForm = {};
		$scope.selectOutcomeUpdateForm = function(string, outcomeStatusUpdate){
			if(string === 'view'){ $scope.switchOutcomeUpdateForm[outcomeStatusUpdate._id] = 'view';}
			if(string === 'edit'){$scope.switchOutcomeUpdateForm[outcomeStatusUpdate._id] = 'edit';}
		};

		$scope.switchStatusAreaForm = {};
		$scope.selectStatusAreaForm = function(string, statusAreaUpdate){
			if(string === 'view'){ $scope.switchStatusAreaForm[statusAreaUpdate._id] = 'view';}
			if(string === 'edit'){$scope.switchStatusAreaForm[statusAreaUpdate._id] = 'edit';}
		};

		// Estimate

		$scope.switchEstimateDurationForm = {};
		$scope.selectEstimateDurationForm = function(string, estimateDuration){
			if(string === 'view'){ $scope.switchEstimateDurationForm[estimateDuration._id] = 'view';}
			if(string === 'edit'){$scope.switchEstimateDurationForm[estimateDuration._id] = 'edit';}
		};

		$scope.switchEstimateCostForm = {};
		$scope.selectEstimateCostForm = function(string, estimateCost){
			if(string === 'view'){ $scope.switchEstimateCostForm[estimateCost._id] = 'view';}
			if(string === 'edit'){$scope.switchEstimateCostForm[estimateCost._id] = 'edit';}
		};

		$scope.switchEstimateCompletionForm = {};
		$scope.selectEstimateCompletionForm = function(string, estimateCompletion){
			if(string === 'view'){ $scope.switchEstimateCompletionForm[estimateCompletion._id] = 'view';}
			if(string === 'edit'){$scope.switchEstimateCompletionForm[estimateCompletion._id] = 'edit';}
		};



		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortProjectStatusUpdates = function(projectStatusUpdate) {
			return new Date(projectStatusUpdate.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectStatusUpdateDetails = 'header';

		$scope.activeTab = {};

		// -------------- SELECT GATE ---------------------

		$scope.setReviewObject = function(reviewObj){
			$scope.selectedProjectStatusUpdate = null;
			$scope.reviewObject = reviewObj;
            $scope.cancelNewProjectStatusUpdate();
		};

		// ------------- SELECT VIEW PROJECT ------------

		var originalProjectStatusUpdate = {};

		$scope.selectProject = function(project) {

            $scope.cancelNewProjectStatusUpdate();

			$scope.selectedProject = null;
			$scope.projectStatusUpdateList = null;
            $scope.reviewObject = null;

			$scope.selectedProjectStatusUpdate = null;
			originalProjectStatusUpdate = {};

			$scope.selectedProject = project;

            $scope.error = null;
            $scope.isResolving = true;

            ProjectStatusUpdates.query({
				project: project._id
			}, function (reviews) {
                $scope.isResolving = false;
				$scope.projectStatusUpdateList = _.chain(_.get(project, 'process.gates'))
					.map(function (gate) {
						return {
							gate: gate,
                            projectStatusUpdates: _.filter(reviews, _.matchesProperty('gate', gate._id))};
					})
					.sortBy('gate.position')
					.value();
			}, function (err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};



		// ------------- NEW STATUS UPDATE ------------

		$scope.newProjectStatusUpdateDateOpened = {};

		$scope.openNewProjectStatusUpdateDate = function(gate, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.newProjectStatusUpdateDateOpened[gate._id] = true;
		};

        $scope.showNewProjectStatusUpdateForm = false;

		$scope.newProjectStatusUpdate = {};

		$scope.createNewProjectStatusUpdate = function(project, gate){
			var newProjectStatusUpdate = new ProjectStatusUpdates({
				project: project._id,
				gate : gate._id,
				title : $scope.newProjectStatusUpdate.title
			});

            $scope.error = null;
            $scope.isResolving = true;

			newProjectStatusUpdate.$save(function(res) {
                $scope.isResolving = false;
				// Clear new form
				$scope.newProjectStatusUpdate = {};
				// Refresh the list of gate reviews
				_.find($scope.projectStatusUpdateList, _.matchesProperty('gate._id', gate._id)).projectStatusUpdates.push(res);
				// Select in view mode the new review
				$scope.selectProjectStatusUpdate(res);
				// Close new review form in the view's html
                $scope.showNewProjectStatusUpdateForm = false;
			}, function(err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectStatusUpdate = function(){
            $scope.error = null;
			$scope.newProjectStatusUpdate = {};
            $scope.showNewProjectStatusUpdateForm = false;
		};


		// ------------- SELECT STATUS UPDATE ------------

		var projectStatusUpdateFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of gate reviews

		$scope.selectProjectStatusUpdate = function(projectStatusUpdate){
            projectStatusUpdateFromList[projectStatusUpdate._id] = projectStatusUpdate;

            $scope.error = null;
            $scope.isResolving = true;

            ProjectStatusUpdates.get({
                projectStatusUpdateId:projectStatusUpdate._id
			}, function(res){
                $scope.isResolving = false;
				$scope.selectedProjectStatusUpdate = res;
				originalProjectStatusUpdate[projectStatusUpdate._id] = _.cloneDeep(res);
				//$scope.selectProjectStatusUpdateForm('view');
			},function(errorResponse){
                $scope.isResolving = false;
				$scope.error = errorResponse.data.message;
				$scope.selectedProjectStatusUpdate = null;
				originalProjectStatusUpdate = {};
			});
		};

		// ------------- CHANGE STATUS UPDATE ------------

		$scope.changeGate = function(){
            $scope.error = null;
			$scope.cancelNewProjectStatusUpdate();
			$scope.selectedProjectStatusUpdate = null;
			originalProjectStatusUpdate = {};
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------


		$scope.editHeader = function(projectStatusUpdate){
			$scope.selectHeaderForm('edit', projectStatusUpdate);
		};

		$scope.saveEditHeader = function(projectStatusUpdate){
			// Clean-up deepPopulate
			var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
			copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
			// Update server header
            $scope.error = null;
            $scope.isResolving = true;
			ProjectStatusUpdates.updateHeader(
				{
                    projectStatusUpdateId : copyProjectStatusUpdate._id
				}, copyProjectStatusUpdate,
				function(res){
                    $scope.isResolving = false;
					// Update details pane view with new saved details
                    originalProjectStatusUpdate[projectStatusUpdate._id].title = projectStatusUpdate.title;
                    originalProjectStatusUpdate[projectStatusUpdate._id].description = projectStatusUpdate.description;
					// Update list of reviews with new date / title
                    projectStatusUpdateFromList[projectStatusUpdate._id].title = projectStatusUpdate.title;
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', projectStatusUpdate);
				},
				function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
			);
		};

		$scope.cancelEditHeader = function(projectStatusUpdate){
            $scope.error = null;
            projectStatusUpdate.title = originalProjectStatusUpdate[projectStatusUpdate._id].title;
            projectStatusUpdate.description = originalProjectStatusUpdate[projectStatusUpdate._id].description;
			$scope.selectHeaderForm('view', projectStatusUpdate);
		};


		$scope.deleteProjectStatusUpdate = function(reviewObject, projectStatusUpdate){
            $scope.error = null;
            $scope.isResolving = true;
			ProjectStatusUpdates.remove({projectStatusUpdateId: projectStatusUpdate._id}, projectStatusUpdate, function(res){
                $scope.isResolving = false;
				reviewObject.projectStatusUpdates = _.without(reviewObject.projectStatusUpdates, _.find(reviewObject.projectStatusUpdates, _.matchesProperty('_id', projectStatusUpdate._id)));
				$scope.cancelNewProjectStatusUpdate();
				$scope.selectedProjectStatusUpdate = null;
				originalProjectStatusUpdate = {};
			}, function(err){
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};



		// -------------------------------------------------------- OVERALL STATUS -------------------------------------------------

		$scope.editOverallStatus = function(projectStatusUpdate){
			$scope.selectOverallStatusForm('edit', projectStatusUpdate);
		};

		$scope.saveEditOverallStatus = function(projectStatusUpdate){
			// Clean-up deepPopulate
			var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
			copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
			copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
			copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');
			// Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateOverallStatus( { projectStatusUpdateId : projectStatusUpdate._id }, copyProjectStatusUpdate,
				function(res){
                    $scope.isResolving = false;
					originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.overallUpdate.status = projectStatusUpdate.gateStatusUpdate.overallUpdate.status;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.overallUpdate.comment = projectStatusUpdate.gateStatusUpdate.overallUpdate.comment;
					$scope.selectOverallStatusForm('view', projectStatusUpdate);
				},
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditOverallStatus = function(projectStatusUpdate){
            $scope.error = null;
            projectStatusUpdate.gateStatusUpdate.overallUpdate.status = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.overallUpdate.status;
            projectStatusUpdate.gateStatusUpdate.overallUpdate.comment = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.overallUpdate.comment;
			$scope.selectOverallStatusForm('view', projectStatusUpdate);
		};

        // -------------------------------------------------------- DURATION STATUS -------------------------------------------------

        $scope.editDurationStatus = function(projectStatusUpdate){
            $scope.selectDurationStatusForm('edit', projectStatusUpdate);
        };

        $scope.saveEditDurationStatus = function(projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateDurationStatus( { projectStatusUpdateId : projectStatusUpdate._id }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.durationUpdate.status = projectStatusUpdate.gateStatusUpdate.durationUpdate.status;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.durationUpdate.comment = projectStatusUpdate.gateStatusUpdate.durationUpdate.comment;
                    $scope.selectDurationStatusForm('view', projectStatusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditDurationStatus = function(projectStatusUpdate){
            $scope.error = null;
            projectStatusUpdate.gateStatusUpdate.durationUpdate.status = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.durationUpdate.status;
            projectStatusUpdate.gateStatusUpdate.durationUpdate.comment = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.durationUpdate.comment;
            $scope.selectDurationStatusForm('view', projectStatusUpdate);
        };

        // -------------------------------------------------------- COST STATUS -------------------------------------------------

        $scope.editCostStatus = function(projectStatusUpdate){
            $scope.selectCostStatusForm('edit', projectStatusUpdate);
        };

        $scope.saveEditCostStatus = function(projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateCostStatus( { projectStatusUpdateId : projectStatusUpdate._id }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.costUpdate.status = projectStatusUpdate.gateStatusUpdate.costUpdate.status;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.costUpdate.comment = projectStatusUpdate.gateStatusUpdate.costUpdate.comment;
                    $scope.selectCostStatusForm('view', projectStatusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditCostStatus = function(projectStatusUpdate){
            $scope.error = null;
            projectStatusUpdate.gateStatusUpdate.costUpdate.status = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.costUpdate.status;
            projectStatusUpdate.gateStatusUpdate.costUpdate.comment = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.costUpdate.comment;
            $scope.selectCostStatusForm('view', projectStatusUpdate);
        };

        // -------------------------------------------------------- COMPLETION STATUS -------------------------------------------------

        $scope.editCompletionStatus = function(projectStatusUpdate){
            $scope.selectCompletionStatusForm('edit', projectStatusUpdate);
        };

        $scope.saveEditCompletionStatus = function(projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateCompletionStatus( { projectStatusUpdateId : projectStatusUpdate._id }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.completionUpdate.status = projectStatusUpdate.gateStatusUpdate.completionUpdate.status;
                    originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.completionUpdate.comment = projectStatusUpdate.gateStatusUpdate.completionUpdate.comment;
                    $scope.selectCompletionStatusForm('view', projectStatusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditCompletionStatus = function(projectStatusUpdate){
            $scope.error = null;
            projectStatusUpdate.gateStatusUpdate.completionUpdate.status = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.completionUpdate.status;
            projectStatusUpdate.gateStatusUpdate.completionUpdate.comment = originalProjectStatusUpdate[projectStatusUpdate._id].gateStatusUpdate.completionUpdate.comment;
            $scope.selectCompletionStatusForm('view', projectStatusUpdate);
        };



        // -------------------------------------------------------- STATUS AREAS -------------------------------------------------

        var originalStatusAreaUpdate = {};

        $scope.editStatusArea = function(statusAreaUpdate){
            originalStatusAreaUpdate[statusAreaUpdate._id] = _.cloneDeep(statusAreaUpdate);
            $scope.selectStatusAreaForm('edit', statusAreaUpdate);
        };

        $scope.saveEditStatusArea = function(projectStatusUpdate, statusAreaUpdate){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateStatusArea(
                {
                    projectStatusUpdateId: projectStatusUpdate._id,
                    statusAreaUpdateId : statusAreaUpdate._id
                }, statusAreaUpdate,
                function(res){
                    $scope.isResolving = false;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
            $scope.selectStatusAreaForm('view', statusAreaUpdate);
        };

        $scope.cancelEditStatusArea = function(statusAreaUpdate){
            $scope.error = null;
            statusAreaUpdate.newStatus = originalStatusAreaUpdate[statusAreaUpdate._id].newStatus;
            statusAreaUpdate.comment = originalStatusAreaUpdate[statusAreaUpdate._id].comment;
            $scope.selectStatusAreaForm('view', statusAreaUpdate);
        };





		// -------------------------------------------------------- OUTCOMES -------------------------------------------------

		var originalOutcomeUpdate = {};

		$scope.editOutcomeUpdate = function(outcomeUpdate){
			originalOutcomeUpdate[outcomeUpdate._id] = _.cloneDeep(outcomeUpdate);
			$scope.selectOutcomeUpdateForm('edit', outcomeUpdate);
		};

		$scope.saveEditOutcomeUpdate = function(projectStatusUpdate, outcomeUpdate){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateOutcomeStatus(
				{
                    projectStatusUpdateId: projectStatusUpdate._id,
                    outcomeStatusUpdateId : outcomeUpdate._id
				}, outcomeUpdate,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectOutcomeUpdateForm('view', outcomeUpdate);
		};

		$scope.cancelEditOutcomeUpdate = function(outcomeUpdate){
            $scope.error = null;
            outcomeUpdate.newStatus = originalOutcomeUpdate[outcomeUpdate._id].newStatus;
            outcomeUpdate.comment = originalOutcomeUpdate[outcomeUpdate._id].comment;
			$scope.selectOutcomeUpdateForm('view', outcomeUpdate);
		};


		// -------------------------------------------------------- ESTIMATE DURATION -------------------------------------------------

		$scope.estimateDurationDateOpened = {};
		$scope.openEstimateDurationDate = function(estimateDurationReview, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.estimateDurationDateOpened[estimateDurationReview._id] = true;
		};

		var originalEstimateDurationReview = {};

		$scope.editEstimateDuration = function(estimateDurationReview){
			originalEstimateDurationReview[estimateDurationReview._id] = _.cloneDeep(estimateDurationReview);
			$scope.selectEstimateDurationForm('edit', estimateDurationReview);
		};

		$scope.saveEditEstimateDuration = function(projectStatusUpdate, estimateDurationReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateEstimateDuration(
				{
                    projectStatusUpdateId: projectStatusUpdate._id,
					estimateDurationReviewId : estimateDurationReview._id
				}, estimateDurationReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectEstimateDurationForm('view', estimateDurationReview);
		};

		$scope.cancelEditEstimateDuration = function(estimateDurationReview){
            $scope.error = null;
			estimateDurationReview.newDate = originalEstimateDurationReview[estimateDurationReview._id].newDate;
			$scope.selectEstimateDurationForm('view', estimateDurationReview);
		};


		// -------------------------------------------------------- ESTIMATE COST -------------------------------------------------

		var originalEstimateCostReview = {};

		$scope.editEstimateCost = function(estimateCostReview){
			originalEstimateCostReview[estimateCostReview._id] = _.cloneDeep(estimateCostReview);
			$scope.selectEstimateCostForm('edit', estimateCostReview);
		};

		$scope.saveEditEstimateCost = function(projectStatusUpdate, estimateCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateEstimateCost(
				{
                    projectStatusUpdateId: projectStatusUpdate._id,
					estimateCostReviewId : estimateCostReview._id
				}, estimateCostReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectEstimateCostForm('view', estimateCostReview);
		};

		$scope.cancelEditEstimateCost = function(estimateCostReview){
            $scope.error = null;
			estimateCostReview.newCost = originalEstimateCostReview[estimateCostReview._id].newCost;
			$scope.selectEstimateCostForm('view', estimateCostReview);
		};



		// -------------------------------------------------------- ESTIMATE COMPLETION -------------------------------------------------

		var originalEstimateCompletionReview = {};

		$scope.editEstimateCompletion = function(estimateCompletionReview){
			originalEstimateCompletionReview[estimateCompletionReview._id] = _.cloneDeep(estimateCompletionReview);
			$scope.selectEstimateCompletionForm('edit', estimateCompletionReview);
		};

		$scope.saveEditEstimateCompletion = function(projectStatusUpdate, estimateCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.updateEstimateCompletion(
				{
                    projectStatusUpdateId: projectStatusUpdate._id,
					estimateCompletionReviewId : estimateCompletionReview._id
				}, estimateCompletionReview,
				function(res){
                    $scope.isResolving = false;
                },
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
			$scope.selectEstimateCompletionForm('view', estimateCompletionReview);
		};

		$scope.cancelEditEstimateCompletion = function(estimateCompletionReview){
            $scope.error = null;
			estimateCompletionReview.newCompletion = originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion;
			$scope.selectEstimateCompletionForm('view', estimateCompletionReview);
		};


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        $scope.submit = function(project, projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');

            // Run server side applyChange
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.submit(
                {
                    projectStatusUpdateId : projectStatusUpdate._id
                }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    // Refresh the object with the current performances values
                    projectStatusUpdate.approval = res.approval;
                    // Update list of reviews with current value
                    projectStatusUpdateFromList[projectStatusUpdate._id].approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(project, projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');

            // Run server side applyChange
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.approve(
                {
                    projectStatusUpdateId : projectStatusUpdate._id
                }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    // Refresh the object with the current performances values
                    projectStatusUpdate.approval = res.approval;
                    // Update list of reviews with current value
                    projectStatusUpdateFromList[projectStatusUpdate._id].approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(project, projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');

            // Run server side applyChange
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.reject(
                {
                    projectStatusUpdateId : projectStatusUpdate._id
                }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    // Refresh the object with the current performances values
                    projectStatusUpdate.approval = res.approval;
                    // Update list of reviews with current value
                    projectStatusUpdateFromList[projectStatusUpdate._id].approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, projectStatusUpdate){
            // Clean-up deepPopulate
            var copyProjectStatusUpdate = _.cloneDeep(projectStatusUpdate);
            copyProjectStatusUpdate.project = _.get(copyProjectStatusUpdate.project, '_id');
            copyProjectStatusUpdate.gate = _.get(copyProjectStatusUpdate.gate, '_id');
            copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment = _.get(copyProjectStatusUpdate.gateStatusUpdate.gateStatusAssignment, '_id');

            // Run server side applyChange
            $scope.error = null;
            $scope.isResolving = true;
            ProjectStatusUpdates.draft(
                {
                    projectStatusUpdateId : projectStatusUpdate._id
                }, copyProjectStatusUpdate,
                function(res){
                    $scope.isResolving = false;
                    // Refresh the object with the current performances values
                    projectStatusUpdate.approval = res.approval;
                    // Update list of reviews with current value
                    projectStatusUpdateFromList[projectStatusUpdate._id].approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };



    }
]);

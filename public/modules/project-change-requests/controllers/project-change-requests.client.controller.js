'use strict';

angular.module('project-change-requests').controller('ProjectChangeRequestsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcessTemplates', 'LogReasons', 'ChangeRequestStates', 'LogPriorities','LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcessTemplates, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

			$scope.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                $scope.projects = _.filter(projects, function(project){return project.process.assignmentType !== 'unassigned';});
                // Form myTao
                if($stateParams.projectId){
                    var foundProject = _.find($scope.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(foundProject){
                        $scope.selectProject(foundProject);
                    } else {
                        $scope.error = 'Cannot find project ' + $stateParams.projectId;
                    }
                }
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
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

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, document){
            if(string === 'view'){ $scope.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[document._id] = 'edit';}
        };

        $scope.switchBudgetForm = {};
        $scope.selectBudgetForm = function(string, document){
            if(string === 'view'){ $scope.switchBudgetForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchBudgetForm[document._id] = 'edit';}
        };

        $scope.switchStatusForm = {};
        $scope.selectStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchStatusForm[document._id] = 'edit';}
        };

        $scope.switchOutcomeReviewForm = {};
        $scope.selectOutcomeReviewForm = function(string, outcomeReview){
            if(string === 'view'){ $scope.switchOutcomeReviewForm[outcomeReview._id] = 'view';}
            if(string === 'edit'){$scope.switchOutcomeReviewForm[outcomeReview._id] = 'edit';}
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

        $scope.sortChangeRequests = function(doc) {
            return new Date(doc.raisedOnDate);
        };

        $scope.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        $scope.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        $scope.showNewDocumentForm = false;

        $scope.documentDetails = 'header';

        $scope.activeTab = {};
        

        // ------------- SELECT PROJECT ------------


        $scope.selectProject = function(project) {
            $scope.error = null;
            $scope.cancelNewDocument();
            $scope.selectedGate = null;
            $scope.selectedDocument = null;
            $scope.selectedProject = project;
        };


        // ------------ SELECT GATE ----------------


        $scope.selectGate = function(gate){
            // Delete previous selections
            $scope.error = null;
            $scope.cancelNewDocument();
            $scope.selectedDocument = null;
            // Set new selected gate
            $scope.selectedGate = gate;
        };

        // ----------- NEW CHANGE REQUEST ------------


        $scope.newHeaderDateOpened = {};

        $scope.openNewHeaderDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newHeaderDateOpened[gate._id] = true;
        };

        $scope.newDocument = {};

        $scope.createNewDocument = function(project, gate){
            $scope.error = null;

            var newDocument = {
                raisedOnDate : $scope.newDocument.raisedOnDate,
                title : $scope.newDocument.title
            };

            Projects.createChangeRequest(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    $scope.isResolving = false;
                    gate.projectChangeRequests.push(res);
                    $scope.newDocument = {};
                    $scope.showNewDocumentForm = false;
                    $scope.selectDocument(res);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewDocument = function(){
            $scope.error = null;
            $scope.showNewDocumentForm = false;
            $scope.newDocument = {};
        };


        // ------------- SELECT CHANGE REQUEST ------------


        $scope.selectDocument = function(doc){
            $scope.selectedDocument = doc;
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.headerDateOpened = {};
        $scope.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        $scope.editHeader = function(changeRequest){
            originalHeader[changeRequest._id] = {
                raisedOnDate: changeRequest.raisedOnDate,
                title : changeRequest.title,
                description : changeRequest.description,
                reason : changeRequest.reason,
                state : changeRequest.state,
                priority : changeRequest.priority
            };
            $scope.selectHeaderForm('edit', changeRequest);
        };

        $scope.saveEditHeader = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateChangeRequestHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', changeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function(changeRequest){
            $scope.error = null;
            changeRequest.raisedOnDate = originalHeader[changeRequest._id].raisedOnDate;
            changeRequest.title = originalHeader[changeRequest._id].title;
            changeRequest.description = originalHeader[changeRequest._id].description;
            changeRequest.reason = originalHeader[changeRequest._id].reason;
            changeRequest.state = originalHeader[changeRequest._id].state;
            changeRequest.priority = originalHeader[changeRequest._id].priority;
            $scope.selectHeaderForm('view', changeRequest);
        };


        $scope.deleteDocument = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.deleteChangeRequest(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id
                }, changeRequest, function(res){
                    $scope.isResolving = false;
                    gate.projectChangeRequests = _.without(gate.projectChangeRequests, changeRequest);
                    $scope.cancelNewDocument();
                    $scope.selectedDocument = null;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                });
        };

        // -------------------------------------------------------- CHANGE STATUS -------------------------------------------------

        $scope.baselineDateOpened = {};
        $scope.openBaselineDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDateOpened[document._id] = true;
        };

        $scope.estimateDateOpened = {};
        $scope.openEstimateDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDateOpened[document._id] = true;
        };

        $scope.actualDateOpened = {};
        $scope.openActualDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDateOpened[document._id] = true;
        };
        
        var originalStatus = {};

        $scope.editStatus = function(changeRequest){
            originalStatus[changeRequest._id] = {
                baselineDeliveryDate : changeRequest.changeStatus.currentRecord.baselineDeliveryDate,
                estimateDeliveryDate : changeRequest.changeStatus.currentRecord.estimateDeliveryDate,
                actualDeliveryDate : changeRequest.changeStatus.currentRecord.actualDeliveryDate,
                completed : changeRequest.changeStatus.currentRecord.completed,
                status : changeRequest.changeStatus.currentRecord.status,
                comment : changeRequest.changeStatus.currentRecord.comment
            };
            $scope.selectStatusForm('edit', changeRequest);
        };

        $scope.saveEditStatus = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateChangeRequestStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.changeStatus = res.changeStatus;
                    $scope.selectStatusForm('view', changeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function(changeRequest){
            $scope.error = null;
            changeRequest.changeStatus.currentRecord.baselineDeliveryDate = originalStatus[changeRequest._id].baselineDeliveryDate;
            changeRequest.changeStatus.currentRecord.estimateDeliveryDate = originalStatus[changeRequest._id].estimateDeliveryDate;
            changeRequest.changeStatus.currentRecord.actualDeliveryDate = originalStatus[changeRequest._id].actualDeliveryDate;
            changeRequest.changeStatus.currentRecord.completed = originalStatus[changeRequest._id].completed;
            changeRequest.changeStatus.currentRecord.status = originalStatus[changeRequest._id].status;
            changeRequest.changeStatus.currentRecord.comment = originalStatus[changeRequest._id].comment;
            
            $scope.selectStatusForm('view', changeRequest);
        };



        // -------------------------------------------------------- BUDGET -------------------------------------------------

        var originalGateBudget = {};

        $scope.editBudget = function(changeRequest){
            originalGateBudget[changeRequest._id] = {
                newAmount : changeRequest.budgetReview.newAmount
            };
            $scope.selectBudgetForm('edit', changeRequest);
        };

        $scope.saveEditBudget = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateBudgetReviewForCR(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    originalGateBudget[changeRequest._id].newAmount = changeRequest.budgetReview.newAmount;
                    $scope.selectBudgetForm('view', changeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBudget = function(changeRequest){
            $scope.error = null;
            changeRequest.budgetReview.newAmount = originalGateBudget[changeRequest._id].newAmount;
            $scope.selectBudgetForm('view', changeRequest);
        };


        // -------------------------------------------------------- BASELINE DURATION -------------------------------------------------

        $scope.baselineDurationDateOpened = {};
        $scope.openBaselineDurationDate = function(baselineDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDurationDateOpened[baselineDurationReview._id] = true;
        };

        var originalBaselineDurationReview = {};

        $scope.editBaselineDuration = function(baselineDurationReview){
            originalBaselineDurationReview[baselineDurationReview._id] = _.cloneDeep(baselineDurationReview);
            $scope.selectBaselineDurationForm('edit', baselineDurationReview);
        };

        $scope.saveEditBaselineDuration = function(project, gate, changeRequest, baselineDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateBaselineDurationReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    baselineDurationReviewId : baselineDurationReview._id
                }, baselineDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineDurationReview[baselineDurationReview._id].newDate = baselineDurationReview.newDate;
                    $scope.selectBaselineDurationForm('view', baselineDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBaselineDuration = function(baselineDurationReview){
            $scope.error = null;
            baselineDurationReview.newDate = originalBaselineDurationReview[baselineDurationReview._id].newDate;
            $scope.selectBaselineDurationForm('view', baselineDurationReview);
        };


        // -------------------------------------------------------- ACTUAL DURATION -------------------------------------------------

        $scope.actualDurationDateOpened = {};
        $scope.openActualDurationDate = function(actualDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDurationDateOpened[actualDurationReview._id] = true;
        };

        var originalActualDurationReview = {};

        $scope.editActualDuration = function(actualDurationReview){
            $scope.error = null;
            originalActualDurationReview[actualDurationReview._id] = _.cloneDeep(actualDurationReview);
            $scope.selectActualDurationForm('edit', actualDurationReview);
        };

        $scope.saveEditActualDuration = function(project, gate, changeRequest, actualDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateActualDurationReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    actualDurationReviewId : actualDurationReview._id
                }, actualDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualDurationReview[actualDurationReview._id].newDate = actualDurationReview.newDate;
                    $scope.selectActualDurationForm('view', actualDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditActualDuration = function(actualDurationReview){
            $scope.error = null;
            actualDurationReview.newDate = originalActualDurationReview[actualDurationReview._id].newDate;
            $scope.selectActualDurationForm('view', actualDurationReview);
        };

        // -------------------------------------------------------- BASELINE COST -------------------------------------------------

        var originalBaselineCostReview = {};

        $scope.editBaselineCost = function(baselineCostReview){
            originalBaselineCostReview[baselineCostReview._id] = _.cloneDeep(baselineCostReview);
            $scope.selectBaselineCostForm('edit', baselineCostReview);
        };

        $scope.saveEditBaselineCost = function(project, gate, changeRequest, baselineCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCostReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    baselineCostReviewId : baselineCostReview._id
                }, baselineCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineCostReview[baselineCostReview._id].newCost = baselineCostReview.newCost;
                    $scope.selectBaselineCostForm('view', baselineCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBaselineCost = function(baselineCostReview){
            $scope.error = null;
            baselineCostReview.newCost = originalBaselineCostReview[baselineCostReview._id].newCost;
            $scope.selectBaselineCostForm('view', baselineCostReview);
        };

        // -------------------------------------------------------- ACTUAL COST -------------------------------------------------

        var originalActualCostReview = {};

        $scope.editActualCost = function(actualCostReview){
            originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
            $scope.selectActualCostForm('edit', actualCostReview);
        };

        $scope.saveEditActualCost = function(project, gate, changeRequest, actualCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCostReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    actualCostReviewId : actualCostReview._id
                }, actualCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualCostReview[actualCostReview._id].newCost = actualCostReview.newCost;
                    $scope.selectActualCostForm('view', actualCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditActualCost = function(actualCostReview){
            $scope.error = true;
            actualCostReview.newCost = originalActualCostReview[actualCostReview._id].newCost;
            $scope.selectActualCostForm('view', actualCostReview);
        };



        // -------------------------------------------------------- BASELINE COMPLETION -------------------------------------------------

        var originalBaselineCompletionReview = {};

        $scope.editBaselineCompletion = function(baselineCompletionReview){
            originalBaselineCompletionReview[baselineCompletionReview._id] = _.cloneDeep(baselineCompletionReview);
            $scope.selectBaselineCompletionForm('edit', baselineCompletionReview);
        };

        $scope.saveEditBaselineCompletion = function(project, gate, changeRequest, baselineCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCompletionReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    baselineCompletionReviewId : baselineCompletionReview._id
                }, baselineCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion = baselineCompletionReview.newCompletion;
                    $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditBaselineCompletion = function(baselineCompletionReview){
            $scope.error = null;
            baselineCompletionReview.newCompletion = originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion;
            $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
        };

        // -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

        var originalActualCompletionReview = {};

        $scope.editActualCompletion = function(actualCompletionReview){
            originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
            $scope.selectActualCompletionForm('edit', actualCompletionReview);
        };

        $scope.saveEditActualCompletion = function(project, gate, changeRequest, actualCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCompletionReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    actualCompletionReviewId : actualCompletionReview._id
                }, actualCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualCompletionReview[actualCompletionReview._id].newCompletion = actualCompletionReview.newCompletion;
                    $scope.selectActualCompletionForm('view', actualCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditActualCompletion = function(actualCompletionReview){
            $scope.error = null;
            actualCompletionReview.newCompletion = originalActualCompletionReview[actualCompletionReview._id].newCompletion;
            $scope.selectActualCompletionForm('view', actualCompletionReview);
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        // Check that all fields are filled in before proceeding, if not, return (except for Reject and Draft)
        $scope.submitMissingFields = {};
        var setSubmitMissingFields = function(changeRequest, gate){

            var missingFields = [];

            if(!changeRequest.budgetReview.newAmount){
                missingFields.push('Budget amount');
            }

            _.each(changeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Baseline date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });
            _.each(changeRequest.performances.duration.actualDurationReviews, function(performanceReview){
                if(!performanceReview.newDate && gate.gateState.currentRecord.completed){
                    missingFields.push('Actual date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });

            _.each(changeRequest.performances.cost.baselineCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Baseline cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });
            _.each(changeRequest.performances.cost.actualCostReviews, function(performanceReview){
                if(!performanceReview.newCost && gate.gateState.currentRecord.completed){
                    missingFields.push('Actual cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });

            _.each(changeRequest.performances.completion.baselineCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Baseline completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });
            _.each(changeRequest.performances.completion.actualCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion && gate.gateState.currentRecord.completed){
                    missingFields.push('Actual completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });

            return missingFields;
        };

        // Check that date are consistent with current dates of previous and next gates
        $scope.dateConsistencyErrors = {};
        var checkDateConsistency = function(editedChangeRequest, editedGate, project){
            // Check that this gate baseline/actual are not earlier than previous gate or later than next gate

            var gates = project.process.gates;

            var dateConsistencyErrors = [];

            // Gate Review new dates

            var thisGate_BaselineDurationReview_NewDate = _.find(editedChangeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
                return performanceReview.baselineDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_BaselineDurationReview_NewDate = thisGate_BaselineDurationReview_NewDate && new Date(thisGate_BaselineDurationReview_NewDate);

            var thisGate_ActualDurationReview_NewDate = _.find(editedChangeRequest.performances.duration.actualDurationReviews, function(performanceReview){
                return performanceReview.actualDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_ActualDurationReview_NewDate = thisGate_ActualDurationReview_NewDate && new Date(thisGate_ActualDurationReview_NewDate);

            _.each(gates, function(gate){

                // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
                if((gate.position < editedGate.position) && (editedGate._id !== project.process.startGate)){

                    var previousGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_BaselineDuration_CurrentDate = previousGate_BaselineDuration_CurrentDate && new Date(previousGate_BaselineDuration_CurrentDate);

                    var previousGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_ActualDuration_CurrentDate = previousGate_ActualDuration_CurrentDate && new Date(previousGate_ActualDuration_CurrentDate);

                    if(previousGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (previousGate_BaselineDuration_CurrentDate > thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(previousGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (previousGate_ActualDuration_CurrentDate > thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

                // NEXT gates dates (for next gate as a target). Skip is editedGate is END
                if((gate.position > editedGate.position) && (editedGate._id !== project.process.endGate)){

                    var nextGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_BaselineDuration_CurrentDate = nextGate_BaselineDuration_CurrentDate && new Date(nextGate_BaselineDuration_CurrentDate);
                    
                    var nextGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_ActualDuration_CurrentDate = nextGate_ActualDuration_CurrentDate && new Date(nextGate_ActualDuration_CurrentDate);

                    if(nextGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (nextGate_BaselineDuration_CurrentDate < thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(nextGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (nextGate_ActualDuration_CurrentDate < thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

            });

            return dateConsistencyErrors;
        };

        $scope.submit = function(project, gate, changeRequest){

            $scope.submitMissingFields[changeRequest._id] = setSubmitMissingFields(changeRequest, gate);
            $scope.dateConsistencyErrors[changeRequest._id] = checkDateConsistency(changeRequest, gate, project);

            if(($scope.submitMissingFields[changeRequest._id].length > 0) || ($scope.dateConsistencyErrors[changeRequest._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.submitChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(project, gate, changeRequest){

            $scope.submitMissingFields[changeRequest._id] = setSubmitMissingFields(changeRequest, gate);
            $scope.dateConsistencyErrors[changeRequest._id] = checkDateConsistency(changeRequest, gate, project);

            if(($scope.submitMissingFields[changeRequest._id].length > 0) || ($scope.dateConsistencyErrors[changeRequest._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.approveChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(project, gate, changeRequest){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.rejectChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, gate, changeRequest){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.draftChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


    }
]);

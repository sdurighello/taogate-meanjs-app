'use strict';

angular.module('project-status-updates').controller('ProjectStatusUpdatesController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcessTemplates', 'LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcessTemplates, LogStatusIndicators) {

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

        // Header
        
        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, document){
            if(string === 'view'){ $scope.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[document._id] = 'edit';}
        };
        
        // Delivery Status

        $scope.switchOverallStatusForm = {};
        $scope.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchOverallStatusForm[document._id] = 'edit';}
        };

        $scope.switchDurationStatusForm = {};
        $scope.selectDurationStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchDurationStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchDurationStatusForm[document._id] = 'edit';}
        };

        $scope.switchCostStatusForm = {};
        $scope.selectCostStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchCostStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchCostStatusForm[document._id] = 'edit';}
        };

        $scope.switchCompletionStatusForm = {};
        $scope.selectCompletionStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchCompletionStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchCompletionStatusForm[document._id] = 'edit';}
        };
        
        // Status Areas

        $scope.switchAreaStatusForm = {};
        $scope.selectAreaStatusForm = function(string, statusAreaReview){
            if(string === 'view'){ $scope.switchAreaStatusForm[statusAreaReview._id] = 'view';}
            if(string === 'edit'){$scope.switchAreaStatusForm[statusAreaReview._id] = 'edit';}
        };
        
        // Outcome

        $scope.switchOutcomeReviewForm = {};
        $scope.selectOutcomeReviewForm = function(string, outcomeReview){
            if(string === 'view'){ $scope.switchOutcomeReviewForm[outcomeReview._id] = 'view';}
            if(string === 'edit'){$scope.switchOutcomeReviewForm[outcomeReview._id] = 'edit';}
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

        $scope.sortChangeRequests = function(doc) {
            return new Date(doc.updateDate);
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

        // ----------- NEW STATUS UPDATE ------------


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
                updateDate : $scope.newDocument.updateDate,
                title : $scope.newDocument.title
            };

            Projects.createStatusUpdate(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    $scope.isResolving = false;
                    gate.projectStatusUpdates.push(res);
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


        // ------------- SELECT STATUS UPDATE ------------


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

        $scope.editHeader = function(statusUpdate){
            originalHeader[statusUpdate._id] = {
                updateDate: statusUpdate.updateDate,
                title : statusUpdate.title,
                description : statusUpdate.description
            };
            $scope.selectHeaderForm('edit', statusUpdate);
        };

        $scope.saveEditHeader = function(project, gate, statusUpdate){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateStatusUpdateHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function(statusUpdate){
            $scope.error = null;
            statusUpdate.updateDate = originalHeader[statusUpdate._id].updateDate;
            statusUpdate.title = originalHeader[statusUpdate._id].title;
            statusUpdate.description = originalHeader[statusUpdate._id].description;
            $scope.selectHeaderForm('view', statusUpdate);
        };


        $scope.deleteDocument = function(project, gate, statusUpdate){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.deleteStatusUpdate(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id
                }, statusUpdate, function(res){
                    $scope.isResolving = false;
                    gate.projectStatusUpdates = _.without(gate.projectStatusUpdates, statusUpdate);
                    $scope.cancelNewDocument();
                    $scope.selectedDocument = null;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                });
        };

        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status
        
        var originalOverallStatus = {};

        $scope.editOverallStatus = function(statusUpdate){
            originalOverallStatus = {
                newStatus: statusUpdate.deliveryStatus.overallStatusReview.newStatus,
                newComment : statusUpdate.deliveryStatus.overallStatusReview.newComment
            };
            $scope.selectOverallStatusForm('edit', statusUpdate);
        };

        $scope.saveEditOverallStatus = function(project, gate, statusUpdate){
            
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateOverallDeliveryStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectOverallStatusForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditOverallStatus = function(statusUpdate){
            $scope.error = null;
            statusUpdate.deliveryStatus.overallStatusReview.newStatus = originalOverallStatus[statusUpdate._id].newStatus;
            statusUpdate.deliveryStatus.overallStatusReview.newComment = originalOverallStatus[statusUpdate._id].newComment;
            $scope.selectOverallStatusForm('view', statusUpdate);
        };

        // Duration Status

        var originalDurationStatus = {};

        $scope.editDurationStatus = function(statusUpdate){
            originalDurationStatus = {
                newStatus: statusUpdate.deliveryStatus.durationStatusReview.newStatus,
                newComment : statusUpdate.deliveryStatus.durationStatusReview.newComment
            };
            $scope.selectDurationStatusForm('edit', statusUpdate);
        };

        $scope.saveEditDurationStatus = function(project, gate, statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateDurationDeliveryStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectDurationStatusForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditDurationStatus = function(statusUpdate){
            $scope.error = null;
            statusUpdate.deliveryStatus.durationStatusReview.newStatus = originalDurationStatus[statusUpdate._id].newStatus;
            statusUpdate.deliveryStatus.durationStatusReview.newComment = originalDurationStatus[statusUpdate._id].newComment;
            $scope.selectDurationStatusForm('view', statusUpdate);
        };

        // Cost Status

        var originalCostStatus = {};

        $scope.editCostStatus = function(statusUpdate){
            originalCostStatus = {
                newStatus: statusUpdate.deliveryStatus.costStatusReview.newStatus,
                newComment : statusUpdate.deliveryStatus.costStatusReview.newComment
            };
            $scope.selectCostStatusForm('edit', statusUpdate);
        };

        $scope.saveEditCostStatus = function(project, gate, statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateCostDeliveryStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectCostStatusForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditCostStatus = function(statusUpdate){
            $scope.error = null;
            statusUpdate.deliveryStatus.costStatusReview.newStatus = originalCostStatus[statusUpdate._id].newStatus;
            statusUpdate.deliveryStatus.costStatusReview.newComment = originalCostStatus[statusUpdate._id].newComment;
            $scope.selectCostStatusForm('view', statusUpdate);
        };

        // Completion Status

        var originalCompletionStatus = {};

        $scope.editCompletionStatus = function(statusUpdate){
            originalCompletionStatus = {
                newStatus: statusUpdate.deliveryStatus.completionStatusReview.newStatus,
                newComment : statusUpdate.deliveryStatus.completionStatusReview.newComment
            };
            $scope.selectCompletionStatusForm('edit', statusUpdate);
        };

        $scope.saveEditCompletionStatus = function(project, gate, statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateCompletionDeliveryStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectCompletionStatusForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditCompletionStatus = function(statusUpdate){
            $scope.error = null;
            statusUpdate.deliveryStatus.completionStatusReview.newStatus = originalCompletionStatus[statusUpdate._id].newStatus;
            statusUpdate.deliveryStatus.completionStatusReview.newComment = originalCompletionStatus[statusUpdate._id].newComment;
            $scope.selectCompletionStatusForm('view', statusUpdate);
        };



        // -------------------------------------------------------- STATUS AREAS -------------------------------------------------

        var originalStatusAreaReview = {};

        $scope.editStatusArea = function(statusAreaReview){
            originalStatusAreaReview[statusAreaReview._id] = _.cloneDeep(statusAreaReview);
            $scope.selectStatusAreaForm('edit', statusAreaReview);
        };

        $scope.saveEditStatusArea = function(project, gate, statusUpdate, statusAreaReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateStatusAreaReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id,
                    statusAreaReviewId : statusAreaReview._id
                }, statusAreaReview,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectStatusAreaForm('view', statusAreaReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatusArea = function(statusAreaReview){
            $scope.error = null;
            statusAreaReview.newStatus = originalStatusAreaReview[statusAreaReview._id].newStatus;
            statusAreaReview.newComment = originalStatusAreaReview[statusAreaReview._id].newComment;
            $scope.selectStatusAreaForm('view', statusAreaReview);
        };
        

        // -------------------------------------------------------- OUTCOMES -------------------------------------------------

        var originalOutcomeReview = {};

        $scope.editOutcomeReview = function(outcomeReview){
            originalOutcomeReview[outcomeReview._id] = _.cloneDeep(outcomeReview);
            $scope.selectOutcomeReviewForm('edit', outcomeReview);
        };

        $scope.saveEditOutcomeReview = function(project, gate, statusUpdate, outcomeReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateOutcomeReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    outcomeReviewId : outcomeReview._id
                }, outcomeReview,
                function(res){
                    $scope.isResolving = false;
                    $scope.error = null;
                    originalOutcomeReview[outcomeReview._id].newStatus = outcomeReview.newStatus;
                    originalOutcomeReview[outcomeReview._id].newComment = outcomeReview.newComment;
                    $scope.selectOutcomeReviewForm('view', outcomeReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditOutcomeReview = function(outcomeReview){
            $scope.error = null;
            outcomeReview.newStatus = originalOutcomeReview[outcomeReview._id].newStatus;
            outcomeReview.newComment = originalOutcomeReview[outcomeReview._id].newComment;
            $scope.selectOutcomeReviewForm('view', outcomeReview);
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
            $scope.error = null;
            originalEstimateDurationReview[estimateDurationReview._id] = _.cloneDeep(estimateDurationReview);
            $scope.selectEstimateDurationForm('edit', estimateDurationReview);
        };

        $scope.saveEditEstimateDuration = function(project, gate, statusUpdate, estimateDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateEstimateDurationReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    statusUpdateId: statusUpdate._id,
                    estimateDurationReviewId : estimateDurationReview._id
                }, estimateDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalEstimateDurationReview[estimateDurationReview._id].newDate = estimateDurationReview.newDate;
                    $scope.selectEstimateDurationForm('view', estimateDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
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

        $scope.saveEditEstimateCost = function(project, gate, statusUpdate, estimateCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateEstimateCostReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    statusUpdateId: statusUpdate._id,
                    estimateCostReviewId : estimateCostReview._id
                }, estimateCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalEstimateCostReview[estimateCostReview._id].newCost = estimateCostReview.newCost;
                    $scope.selectEstimateCostForm('view', estimateCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

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

        $scope.saveEditEstimateCompletion = function(project, gate, statusUpdate, estimateCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateEstimateCompletionReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    statusUpdateId: statusUpdate._id,
                    estimateCompletionReviewId : estimateCompletionReview._id
                }, estimateCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion = estimateCompletionReview.newCompletion;
                    $scope.selectEstimateCompletionForm('view', estimateCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditEstimateCompletion = function(estimateCompletionReview){
            $scope.error = null;
            estimateCompletionReview.newCompletion = originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion;
            $scope.selectEstimateCompletionForm('view', estimateCompletionReview);
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        // Check that all fields are filled in before proceeding, if not, return (except for Reject and Draft)
        $scope.submitMissingFields = {};
        var setSubmitMissingFields = function(statusUpdate){

            var missingFields = [];

            _.each(statusUpdate.performances.duration.estimateDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Estimate date for ' + performanceReview.estimateDuration.targetGate.name);
                }
            });

            _.each(statusUpdate.performances.cost.estimateCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Estimate cost for ' + performanceReview.estimateCost.targetGate.name);
                }
            });

            _.each(statusUpdate.performances.completion.estimateCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Estimate completion for ' + performanceReview.estimateCompletion.targetGate.name);
                }
            });

            return missingFields;
        };

        // Check that date are consistent with current dates of previous and next gates
        $scope.dateConsistencyErrors = {};
        var checkDateConsistency = function(editedStatusUpdate, editedGate, project){
            // Check that this gate baseline/actual are not earlier than previous gate or later than next gate

            var gates = project.process.gates;

            var dateConsistencyErrors = [];

            // New dates
            
            var thisGate_EstimateDurationReview_NewDate = _.find(editedStatusUpdate.performances.duration.estimateDurationReviews, function(performanceReview){
                return performanceReview.estimateDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_EstimateDurationReview_NewDate = thisGate_EstimateDurationReview_NewDate && new Date(thisGate_EstimateDurationReview_NewDate);
            
            _.each(gates, function(gate){

                // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
                if((gate.position < editedGate.position) && (editedGate._id !== project.process.startGate)){
                    
                    var previousGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_EstimateDuration_CurrentDate = previousGate_EstimateDuration_CurrentDate && new Date(previousGate_EstimateDuration_CurrentDate);
                    
                    if(previousGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (previousGate_EstimateDuration_CurrentDate > thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_EstimateDuration_CurrentDate.toDateString());
                    }
                }

                // NEXT gates dates (for next gate as a target). Skip is editedGate is END
                if((gate.position > editedGate.position) && (editedGate._id !== project.process.endGate)){
                    
                    var nextGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_EstimateDuration_CurrentDate = nextGate_EstimateDuration_CurrentDate && new Date(nextGate_EstimateDuration_CurrentDate);

                    if(nextGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (nextGate_EstimateDuration_CurrentDate < thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_EstimateDuration_CurrentDate.toDateString());
                    }
                }

            });

            return dateConsistencyErrors;
        };

        $scope.submit = function(project, gate, statusUpdate){

            $scope.submitMissingFields[statusUpdate._id] = setSubmitMissingFields(statusUpdate);
            $scope.dateConsistencyErrors[statusUpdate._id] = checkDateConsistency(statusUpdate, gate, project);

            if(($scope.submitMissingFields[statusUpdate._id].length > 0) || ($scope.dateConsistencyErrors[statusUpdate._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.submitStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(project, gate, statusUpdate){

            $scope.submitMissingFields[statusUpdate._id] = setSubmitMissingFields(statusUpdate);
            $scope.dateConsistencyErrors[statusUpdate._id] = checkDateConsistency(statusUpdate, gate, project);

            if(($scope.submitMissingFields[statusUpdate._id].length > 0) || ($scope.dateConsistencyErrors[statusUpdate._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.approveStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(project, gate, statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.rejectStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, gate, statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.draftStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


    }
]);

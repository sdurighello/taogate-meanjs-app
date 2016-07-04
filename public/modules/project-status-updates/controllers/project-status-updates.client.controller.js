'use strict';

angular.module('project-status-updates').controller('ProjectStatusUpdatesController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_', '$modal',
	'GateProcessTemplates', 'LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _, $modal,
			 GateProcessTemplates, LogStatusIndicators) {

		$rootScope.staticMenu = false;
        
        var vm = this;

		// ------------- INIT -------------

		vm.isResolving = false;

		vm.initError = [];

		vm.init = function(){

            vm.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                vm.projects = _.filter(projects, function(project){return project.process.assignmentType !== 'unassigned';});
                // Form myTao
                if($stateParams.projectId){
                    var foundProject = _.find(vm.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(foundProject){
                        vm.selectProject(foundProject);
                    } else {
                        vm.error = 'Cannot find project ' + $stateParams.projectId;
                    }
                }
			}, function(err){
				vm.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				vm.logStatusIndicators = logStatusIndicators;
			}, function(err){
				vm.initError.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, project){
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
        
        vm.switchHeaderForm = {};
        vm.selectHeaderForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderForm[document._id] = 'edit';}
        };
        
        // Delivery Status

        vm.switchOverallStatusForm = {};
        vm.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ vm.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchOverallStatusForm[document._id] = 'edit';}
        };
        
        // Status Areas

        vm.switchStatusAreaForm = {};
        vm.selectStatusAreaForm = function(string, statusAreaReview){
            if(string === 'view'){ vm.switchStatusAreaForm[statusAreaReview._id] = 'view';}
            if(string === 'edit'){vm.switchStatusAreaForm[statusAreaReview._id] = 'edit';}
        };
        
        // Outcome

        vm.switchOutcomeReviewForm = {};
        vm.selectOutcomeReviewForm = function(string, outcomeReview){
            if(string === 'view'){ vm.switchOutcomeReviewForm[outcomeReview._id] = 'view';}
            if(string === 'edit'){vm.switchOutcomeReviewForm[outcomeReview._id] = 'edit';}
        };
        
        
        // Estimate

        vm.switchEstimateDurationForm = {};
        vm.selectEstimateDurationForm = function(string, estimateDuration){
            if(string === 'view'){ vm.switchEstimateDurationForm[estimateDuration._id] = 'view';}
            if(string === 'edit'){vm.switchEstimateDurationForm[estimateDuration._id] = 'edit';}
        };

        vm.switchEstimateCostForm = {};
        vm.selectEstimateCostForm = function(string, estimateCost){
            if(string === 'view'){ vm.switchEstimateCostForm[estimateCost._id] = 'view';}
            if(string === 'edit'){vm.switchEstimateCostForm[estimateCost._id] = 'edit';}
        };

        vm.switchEstimateCompletionForm = {};
        vm.selectEstimateCompletionForm = function(string, estimateCompletion){
            if(string === 'view'){ vm.switchEstimateCompletionForm[estimateCompletion._id] = 'view';}
            if(string === 'edit'){vm.switchEstimateCompletionForm[estimateCompletion._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        vm.sortChangeRequests = function(doc) {
            return new Date(doc.updateDate);
        };

        vm.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        vm.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        vm.showNewDocumentForm = false;

        vm.documentDetails = 'header';

        vm.activeTab = {};


        // ------------- SELECT PROJECT ------------


        vm.selectProject = function(project) {
            vm.error = null;
            vm.cancelNewDocument();
            vm.selectedGate = null;
            vm.selectedDocument = null;
            vm.selectedProject = project;
        };


        // ------------ SELECT GATE ----------------


        vm.selectGate = function(gate){
            // Delete previous selections
            vm.error = null;
            vm.cancelNewDocument();
            vm.selectedDocument = null;
            // Set new selected gate
            vm.selectedGate = gate;
        };

        // ----------- NEW STATUS UPDATE ------------


        vm.newHeaderDateOpened = {};

        vm.openNewHeaderDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.newHeaderDateOpened[gate._id] = true;
        };

        vm.newDocument = {};

        vm.createNewDocument = function(project, gate){
            vm.error = null;

            var newDocument = {
                updateDate : vm.newDocument.updateDate,
                title : vm.newDocument.title
            };

            Projects.createStatusUpdate(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    vm.isResolving = false;
                    gate.projectStatusUpdates.push(res);
                    vm.newDocument = {};
                    vm.showNewDocumentForm = false;
                    vm.selectDocument(res);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelNewDocument = function(){
            vm.error = null;
            vm.showNewDocumentForm = false;
            vm.newDocument = {};
        };


        // ------------- SELECT STATUS UPDATE ------------


        vm.selectDocument = function(doc){
            vm.selectedDocument = doc;
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        vm.headerDateOpened = {};
        vm.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        vm.editHeader = function(statusUpdate){
            originalHeader[statusUpdate._id] = {
                updateDate: statusUpdate.updateDate,
                title : statusUpdate.title,
                description : statusUpdate.description
            };
            vm.selectHeaderForm('edit', statusUpdate);
        };

        vm.saveEditHeader = function(project, gate, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateStatusUpdateHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditHeader = function(statusUpdate){
            vm.error = null;
            statusUpdate.updateDate = originalHeader[statusUpdate._id].updateDate;
            statusUpdate.title = originalHeader[statusUpdate._id].title;
            statusUpdate.description = originalHeader[statusUpdate._id].description;
            vm.selectHeaderForm('view', statusUpdate);
        };


        vm.deleteDocument = function(project, gate, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Projects.deleteStatusUpdate(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id
                }, statusUpdate, function(res){
                    vm.isResolving = false;
                    gate.projectStatusUpdates = _.without(gate.projectStatusUpdates, statusUpdate);
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                });
        };

        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status
        
        var originalOverallStatus = {};

        vm.editOverallStatus = function(statusUpdate){
            originalOverallStatus[statusUpdate._id] = {
                newStatus: statusUpdate.deliveryStatus.overallStatusReview.newStatus,
                newComment : statusUpdate.deliveryStatus.overallStatusReview.newComment
            };
            vm.selectOverallStatusForm('edit', statusUpdate);
        };

        vm.saveEditOverallStatus = function(project, gate, statusUpdate){
            
            vm.error = null;
            vm.isResolving = true;
            Projects.updateOverallDeliveryStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    vm.selectOverallStatusForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOverallStatus = function(statusUpdate){
            vm.error = null;
            statusUpdate.deliveryStatus.overallStatusReview.newStatus = originalOverallStatus[statusUpdate._id].newStatus;
            statusUpdate.deliveryStatus.overallStatusReview.newComment = originalOverallStatus[statusUpdate._id].newComment;
            vm.selectOverallStatusForm('view', statusUpdate);
        };
        
        // Project status area reviews

        var originalStatusAreaReview = {};

        vm.editStatusArea = function(statusAreaReview){
            originalStatusAreaReview[statusAreaReview._id] = _.cloneDeep(statusAreaReview);
            vm.selectStatusAreaForm('edit', statusAreaReview);
        };

        vm.saveEditStatusArea = function(project, gate, statusUpdate, statusAreaReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateStatusAreaReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id,
                    statusAreaReviewId : statusAreaReview._id
                }, statusAreaReview,
                function(res){
                    vm.isResolving = false;
                    vm.selectStatusAreaForm('view', statusAreaReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditStatusArea = function(statusAreaReview){
            vm.error = null;
            statusAreaReview.newStatus = originalStatusAreaReview[statusAreaReview._id].newStatus;
            statusAreaReview.newComment = originalStatusAreaReview[statusAreaReview._id].newComment;
            vm.selectStatusAreaForm('view', statusAreaReview);
        };
        

        // -------------------------------------------------------- OUTCOMES -------------------------------------------------

        var originalOutcomeReview = {};

        vm.editOutcomeReview = function(outcomeReview){
            originalOutcomeReview[outcomeReview._id] = _.cloneDeep(outcomeReview);
            vm.selectOutcomeReviewForm('edit', outcomeReview);
        };

        vm.saveEditOutcomeReview = function(project, gate, statusUpdate, outcomeReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateOutcomeStatusReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    outcomeStatusReviewId : outcomeReview._id
                }, outcomeReview,
                function(res){
                    vm.isResolving = false;
                    vm.error = null;
                    originalOutcomeReview[outcomeReview._id].newStatus = outcomeReview.newStatus;
                    originalOutcomeReview[outcomeReview._id].newComment = outcomeReview.newComment;
                    vm.selectOutcomeReviewForm('view', outcomeReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOutcomeReview = function(outcomeReview){
            vm.error = null;
            outcomeReview.newStatus = originalOutcomeReview[outcomeReview._id].newStatus;
            outcomeReview.newComment = originalOutcomeReview[outcomeReview._id].newComment;
            vm.selectOutcomeReviewForm('view', outcomeReview);
        };

        // -------------------------------------------------------- ESTIMATE DURATION -------------------------------------------------

        vm.estimateDurationDateOpened = {};
        vm.openEstimateDurationDate = function(estimateDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.estimateDurationDateOpened[estimateDurationReview._id] = true;
        };

        var originalEstimateDurationReview = {};

        vm.editEstimateDuration = function(estimateDurationReview){
            vm.error = null;
            originalEstimateDurationReview[estimateDurationReview._id] = _.cloneDeep(estimateDurationReview);
            vm.selectEstimateDurationForm('edit', estimateDurationReview);
        };

        vm.saveEditEstimateDuration = function(project, gate, statusUpdate, estimateDurationReview){
            vm.isResolving = true;
            vm.error = null;
            Projects.updateEstimateDurationReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    estimateDurationReviewId : estimateDurationReview._id
                }, estimateDurationReview,
                function(res){
                    vm.isResolving = false;
                    originalEstimateDurationReview[estimateDurationReview._id].newDate = estimateDurationReview.newDate;
                    vm.selectEstimateDurationForm('view', estimateDurationReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditEstimateDuration = function(estimateDurationReview){
            vm.error = null;
            estimateDurationReview.newDate = originalEstimateDurationReview[estimateDurationReview._id].newDate;
            vm.selectEstimateDurationForm('view', estimateDurationReview);
        };

        // -------------------------------------------------------- ESTIMATE COST -------------------------------------------------

        var originalEstimateCostReview = {};

        vm.editEstimateCost = function(estimateCostReview){
            originalEstimateCostReview[estimateCostReview._id] = _.cloneDeep(estimateCostReview);
            vm.selectEstimateCostForm('edit', estimateCostReview);
        };

        vm.saveEditEstimateCost = function(project, gate, statusUpdate, estimateCostReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateEstimateCostReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    estimateCostReviewId : estimateCostReview._id
                }, estimateCostReview,
                function(res){
                    vm.isResolving = false;
                    originalEstimateCostReview[estimateCostReview._id].newCost = estimateCostReview.newCost;
                    vm.selectEstimateCostForm('view', estimateCostReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );

        };

        vm.cancelEditEstimateCost = function(estimateCostReview){
            vm.error = null;
            estimateCostReview.newCost = originalEstimateCostReview[estimateCostReview._id].newCost;
            vm.selectEstimateCostForm('view', estimateCostReview);
        };

        // -------------------------------------------------------- ESTIMATE COMPLETION -------------------------------------------------

        var originalEstimateCompletionReview = {};

        vm.editEstimateCompletion = function(estimateCompletionReview){
            originalEstimateCompletionReview[estimateCompletionReview._id] = _.cloneDeep(estimateCompletionReview);
            vm.selectEstimateCompletionForm('edit', estimateCompletionReview);
        };

        vm.saveEditEstimateCompletion = function(project, gate, statusUpdate, estimateCompletionReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateEstimateCompletionReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    estimateCompletionReviewId : estimateCompletionReview._id
                }, estimateCompletionReview,
                function(res){
                    vm.isResolving = false;
                    originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion = estimateCompletionReview.newCompletion;
                    vm.selectEstimateCompletionForm('view', estimateCompletionReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );

        };

        vm.cancelEditEstimateCompletion = function(estimateCompletionReview){
            vm.error = null;
            estimateCompletionReview.newCompletion = originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion;
            vm.selectEstimateCompletionForm('view', estimateCompletionReview);
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        // Check that all fields are filled in before proceeding, if not, return (except for Reject and Draft)
        vm.submitMissingFields = {};
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
        vm.dateConsistencyErrors = {};
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

        vm.submit = function(project, gate, statusUpdate){

            vm.submitMissingFields[statusUpdate._id] = setSubmitMissingFields(statusUpdate);
            vm.dateConsistencyErrors[statusUpdate._id] = checkDateConsistency(statusUpdate, gate, project);

            if((vm.submitMissingFields[statusUpdate._id].length > 0) || (vm.dateConsistencyErrors[statusUpdate._id].length > 0)){
                return; // Must exit
            }

            vm.error = null;
            vm.isResolving = true;
            Projects.submitStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.approve = function(project, gate, statusUpdate){

            vm.submitMissingFields[statusUpdate._id] = setSubmitMissingFields(statusUpdate);
            vm.dateConsistencyErrors[statusUpdate._id] = checkDateConsistency(statusUpdate, gate, project);

            if((vm.submitMissingFields[statusUpdate._id].length > 0) || (vm.dateConsistencyErrors[statusUpdate._id].length > 0)){
                return; // Must exit
            }

            vm.error = null;
            vm.isResolving = true;
            Projects.approveStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.reject = function(project, gate, statusUpdate){

            vm.error = null;
            vm.isResolving = true;
            Projects.rejectStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.draft = function(project, gate, statusUpdate){

            vm.error = null;
            vm.isResolving = true;
            Projects.draftStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };


        // ------ PROJECT SELECTION -----------

        vm.projectReportDetails = 'financial';

        var modalProjectReport = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/project-status-updates/views/project-status-report.client.view.html',
                controller: function ($scope, $modalInstance, project) {

                    $scope.project = project;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectReport = function(project){
            modalProjectReport('lg', project);
        };


    }
]);

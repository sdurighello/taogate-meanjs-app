'use strict';

angular.module('gate-reviews').controller('GateReviewsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
    'GateProcessTemplates', 'GateOutcomeScores', 'GateStates',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, GateOutcomeScores, GateStates) {

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

            GateOutcomeScores.query(function(outcomeScores){
                $scope.outcomeScores = outcomeScores;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            GateStates.query(function(res){
                $scope.gateStates = res;
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

                return userIsSuperhero;
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

        $scope.switchStateForm = {};
        $scope.selectStateForm = function(string, document){
            if(string === 'view'){ $scope.switchStateForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchStateForm[document._id] = 'edit';}
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

        $scope.sortGateReviews = function(gateReview) {
            return new Date(gateReview.reviewDate);
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

        // ----------- NEW GATE REVIEW ------------


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
                reviewDate : $scope.newDocument.reviewDate,
                title : $scope.newDocument.title
            };

            Projects.createGateReview(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    $scope.isResolving = false;
                    gate.gateReviews.push(res);
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


        // ------------- SELECT GATE REVIEW ------------


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

        $scope.editHeader = function(gateReview){
            originalHeader[gateReview._id] = {
                reviewDate: gateReview.reviewDate,
                title : gateReview.title,
                overallComment : gateReview.overallComment
            };
            $scope.selectHeaderForm('edit', gateReview);
        };

        $scope.saveEditHeader = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateReviewHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    // Update details pane view with new saved details
                    originalHeader[gateReview._id].reviewDate = gateReview.reviewDate;
                    originalHeader[gateReview._id].title = gateReview.title;
                    originalHeader[gateReview._id].overallComment = gateReview.overallComment;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function(gateReview){
            $scope.error = null;
            gateReview.reviewDate = originalHeader[gateReview._id].reviewDate;
            gateReview.title = originalHeader[gateReview._id].title;
            gateReview.overallComment = originalHeader[gateReview._id].overallComment;
            $scope.selectHeaderForm('view', gateReview);
        };


        $scope.deleteDocument = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.deleteGateReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview, function(res){
                    $scope.isResolving = false;
                    gate.gateReviews = _.without(gate.gateReviews, gateReview);
                    $scope.cancelNewDocument();
                    $scope.selectedDocument = null;
            }, function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };
        
        // -------------------------------------------------------- STATE -------------------------------------------------

        var originalState = {};

        $scope.editState = function(gateReview){
            originalState[gateReview._id] = {
                newOverallScore : gateReview.gateStateReview.newOverallScore,
                newState : gateReview.gateStateReview.newState,
                newCompleted : gateReview.gateStateReview.newCompleted
            };
            $scope.selectStateForm('edit', gateReview);
        };

        $scope.saveEditState = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateStateReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    originalState[gateReview._id].newOverallScore = gateReview.gateStateReview.newOverallScore;
                    originalState[gateReview._id].newState = gateReview.gateStateReview.newState;
                    originalState[gateReview._id].newCompleted = gateReview.gateStateReview.newCompleted;
                    $scope.selectStateForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditState = function(gateReview){
            $scope.error = null;
            gateReview.gateStateReview.newOverallScore = originalState[gateReview._id].newOverallScore;
            gateReview.gateStateReview.newState = originalState[gateReview._id].newState;
            gateReview.gateStateReview.newCompleted = originalState[gateReview._id].newCompleted;
            $scope.selectStateForm('view', gateReview);
        };



        // -------------------------------------------------------- BUDGET -------------------------------------------------

        var originalGateBudget = {};

        $scope.editBudget = function(gateReview){
            originalGateBudget[gateReview._id] = {
                newAmount : gateReview.budgetReview.newAmount
            };
            $scope.selectBudgetForm('edit', gateReview);
        };

        $scope.saveEditBudget = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateBudgetReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    originalGateBudget[gateReview._id].newAmount = gateReview.budgetReview.newAmount;
                    $scope.selectBudgetForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBudget = function(gateReview){
            $scope.error = null;
            gateReview.budgetReview.newAmount = originalGateBudget[gateReview._id].newAmount;
            $scope.selectBudgetForm('view', gateReview);
        };




        // -------------------------------------------------------- OUTCOMES -------------------------------------------------

        var originalOutcomeReview = {};

        $scope.editOutcomeReview = function(outcomeReview){
            originalOutcomeReview[outcomeReview._id] = _.cloneDeep(outcomeReview);
            $scope.selectOutcomeReviewForm('edit', outcomeReview);
        };

        $scope.saveEditOutcomeReview = function(project, gate, gateReview, outcomeReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateOutcomeScoreReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    outcomeScoreReviewId : outcomeReview._id
                }, outcomeReview,
                function(res){
                    $scope.isResolving = false;
                    $scope.error = null;
                    originalOutcomeReview[outcomeReview._id].newScore = outcomeReview.newScore;
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
            outcomeReview.newScore = originalOutcomeReview[outcomeReview._id].newScore;
            outcomeReview.newComment = originalOutcomeReview[outcomeReview._id].newComment;
            $scope.selectOutcomeReviewForm('view', outcomeReview);
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

        $scope.saveEditBaselineDuration = function(project, gate, gateReview, baselineDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateBaselineDurationReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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

        $scope.saveEditEstimateDuration = function(project, gate, gateReview, estimateDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateEstimateDurationReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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

        $scope.saveEditActualDuration = function(project, gate, gateReview, actualDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateActualDurationReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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

        $scope.saveEditBaselineCost = function(project, gate, gateReview, baselineCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCostReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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


        // -------------------------------------------------------- ESTIMATE COST -------------------------------------------------

        var originalEstimateCostReview = {};

        $scope.editEstimateCost = function(estimateCostReview){
            originalEstimateCostReview[estimateCostReview._id] = _.cloneDeep(estimateCostReview);
            $scope.selectEstimateCostForm('edit', estimateCostReview);
        };

        $scope.saveEditEstimateCost = function(project, gate, gateReview, estimateCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateEstimateCostReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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


        // -------------------------------------------------------- ACTUAL COST -------------------------------------------------

        var originalActualCostReview = {};

        $scope.editActualCost = function(actualCostReview){
            originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
            $scope.selectActualCostForm('edit', actualCostReview);
        };

        $scope.saveEditActualCost = function(project, gate, gateReview, actualCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCostReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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

        $scope.saveEditBaselineCompletion = function(project, gate, gateReview, baselineCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCompletionReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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


        // -------------------------------------------------------- ESTIMATE COMPLETION -------------------------------------------------

        var originalEstimateCompletionReview = {};

        $scope.editEstimateCompletion = function(estimateCompletionReview){
            originalEstimateCompletionReview[estimateCompletionReview._id] = _.cloneDeep(estimateCompletionReview);
            $scope.selectEstimateCompletionForm('edit', estimateCompletionReview);
        };

        $scope.saveEditEstimateCompletion = function(project, gate, gateReview, estimateCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateEstimateCompletionReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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


        // -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

        var originalActualCompletionReview = {};

        $scope.editActualCompletion = function(actualCompletionReview){
            originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
            $scope.selectActualCompletionForm('edit', actualCompletionReview);
        };

        $scope.saveEditActualCompletion = function(project, gate, gateReview, actualCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCompletionReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
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
        var setSubmitMissingFields = function(gateReview){
            
            var missingFields = [];

            if(!gateReview.budgetReview.newAmount){
                missingFields.push('Budget amount');
            }

            _.each(gateReview.performances.duration.baselineDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Baseline date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });
            _.each(gateReview.performances.duration.estimateDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Estimate date for ' + performanceReview.estimateDuration.targetGate.name);
                }
            });
            _.each(gateReview.performances.duration.actualDurationReviews, function(performanceReview){
                if(!performanceReview.newDate && gateReview.gateStateReview.newCompleted){
                    missingFields.push('Actual date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });

            _.each(gateReview.performances.cost.baselineCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Baseline cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });
            _.each(gateReview.performances.cost.estimateCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Estimate cost for ' + performanceReview.estimateCost.targetGate.name);
                }
            });
            _.each(gateReview.performances.cost.actualCostReviews, function(performanceReview){
                if(!performanceReview.newCost && gateReview.gateStateReview.newCompleted){
                    missingFields.push('Actual cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });

            _.each(gateReview.performances.completion.baselineCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Baseline completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });
            _.each(gateReview.performances.completion.estimateCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Estimate completion for ' + performanceReview.estimateCompletion.targetGate.name);
                }
            });
            _.each(gateReview.performances.completion.actualCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion && gateReview.gateStateReview.newCompleted){
                    missingFields.push('Actual completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });
            
            return missingFields;
        };

        // Check that date are consistent with current dates of previous and next gates
        $scope.dateConsistencyErrors = {};
        var checkDateConsistency = function(editedGateReview, editedGate, project){
            // Check that this gate baseline/estimate/actual are not earlier than previous gate or later than next gate

            var gates = project.process.gates;

            var dateConsistencyErrors = [];

            // Gate Review new dates

            var thisGate_BaselineDurationReview_NewDate = _.find(editedGateReview.performances.duration.baselineDurationReviews, function(performanceReview){
                return performanceReview.baselineDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_BaselineDurationReview_NewDate = thisGate_BaselineDurationReview_NewDate && new Date(thisGate_BaselineDurationReview_NewDate);

            var thisGate_EstimateDurationReview_NewDate = _.find(editedGateReview.performances.duration.estimateDurationReviews, function(performanceReview){
                return performanceReview.estimateDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_EstimateDurationReview_NewDate = thisGate_EstimateDurationReview_NewDate && new Date(thisGate_EstimateDurationReview_NewDate);

            var thisGate_ActualDurationReview_NewDate = _.find(editedGateReview.performances.duration.actualDurationReviews, function(performanceReview){
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

                    var previousGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_EstimateDuration_CurrentDate = previousGate_EstimateDuration_CurrentDate && new Date(previousGate_EstimateDuration_CurrentDate);

                    var previousGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_ActualDuration_CurrentDate = previousGate_ActualDuration_CurrentDate && new Date(previousGate_ActualDuration_CurrentDate);

                    if(previousGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (previousGate_BaselineDuration_CurrentDate > thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(previousGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (previousGate_EstimateDuration_CurrentDate > thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_EstimateDuration_CurrentDate.toDateString());
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

                    var nextGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_EstimateDuration_CurrentDate = nextGate_EstimateDuration_CurrentDate && new Date(nextGate_EstimateDuration_CurrentDate);

                    var nextGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_ActualDuration_CurrentDate = nextGate_ActualDuration_CurrentDate && new Date(nextGate_ActualDuration_CurrentDate);

                    if(nextGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (nextGate_BaselineDuration_CurrentDate < thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(nextGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (nextGate_EstimateDuration_CurrentDate < thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_EstimateDuration_CurrentDate.toDateString());
                    }

                    if(nextGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (nextGate_ActualDuration_CurrentDate < thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

            });

            return dateConsistencyErrors;
        };

        $scope.submit = function(project, gate, gateReview){

            $scope.submitMissingFields[gateReview._id] = setSubmitMissingFields(gateReview);
            $scope.dateConsistencyErrors[gateReview._id] = checkDateConsistency(gateReview, gate, project);

            if(($scope.submitMissingFields[gateReview._id].length > 0) || ($scope.dateConsistencyErrors[gateReview._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.submitGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(project, gate, gateReview){

            $scope.submitMissingFields[gateReview._id] = setSubmitMissingFields(gateReview);
            $scope.dateConsistencyErrors[gateReview._id] = checkDateConsistency(gateReview, gate, project);

            if(($scope.submitMissingFields[gateReview._id].length > 0) || ($scope.dateConsistencyErrors[gateReview._id].length > 0)){
                return; // Must exit
            }
            
            $scope.error = null;
            $scope.isResolving = true;
            Projects.approveGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(project, gate, gateReview){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.rejectGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, gate, gateReview){
            
            $scope.error = null;
            $scope.isResolving = true;
            Projects.draftGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };
        

    }
]);

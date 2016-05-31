'use strict';

angular.module('gate-reviews').controller('GateReviewsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
    'GateProcessTemplates', 'GateOutcomeScores', 'GateStatuses',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, GateOutcomeScores, GateStatuses) {

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

            GateStatuses.query(function(gateStatuses){
                $scope.gateStatuses = gateStatuses;
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

        $scope.switchProjectForm = '';
        $scope.selectProjectForm = function(string){
            if(string === 'default'){ $scope.switchProjectForm = 'default';}
            if(string === 'new'){$scope.switchProjectForm = 'new';}
            if(string === 'view'){ $scope.switchProjectForm = 'view';}
            if(string === 'edit'){$scope.switchProjectForm = 'edit';}
        };

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, gateReview){
            if(string === 'view'){ $scope.switchHeaderForm[gateReview._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[gateReview._id] = 'edit';}
        };

        $scope.switchBudgetForm = {};
        $scope.selectBudgetForm = function(string, gateReview){
            if(string === 'view'){ $scope.switchBudgetForm[gateReview._id] = 'view';}
            if(string === 'edit'){$scope.switchBudgetForm[gateReview._id] = 'edit';}
        };

        $scope.switchSetFinalForm = {};
        $scope.selectSetFinalForm = function(string, gateReview){
            if(string === 'view'){ $scope.switchSetFinalForm[gateReview._id] = 'view';}
            if(string === 'edit'){$scope.switchSetFinalForm[gateReview._id] = 'edit';}
        };

        $scope.switchStatusForm = {};
        $scope.selectStatusForm = function(string, gateReview){
            if(string === 'view'){ $scope.switchStatusForm[gateReview._id] = 'view';}
            if(string === 'edit'){$scope.switchStatusForm[gateReview._id] = 'edit';}
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

        var allowNull = function(obj){
            if(obj){return obj._id;} else {return null;}
        };

        $scope.sortGateReviews = function(gateReview) {
            return new Date(gateReview.reviewDate);
        };

        $scope.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };


        // -------------- OTHER VARIABLES -----------------

        $scope.showNewGateReviewForm = false;

        $scope.gateReviewDetails = 'header';

        $scope.activeTab = {};

        var originalGate = {}, originalGateReview = {};



        // ------------- SELECT PROJECT ------------


        $scope.selectProject = function(project) {
            $scope.error = null;
            $scope.selectedProject = project;
        };


        // ------------ SELECT GATE ----------------


        $scope.selectGate = function(gate){
            $scope.selectedGate = gate;
            originalGate[gate._id] = _.cloneDeep(gate);
        };

        $scope.changeGate = function(){
            $scope.error = null;
            $scope.cancelNewGateReview();
            $scope.selectedGateReview = null;
        };


        // ----------- NEW GATE REVIEW ------------


        $scope.newGateReviewDateOpened = {};

        $scope.openNewGateReviewDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newGateReviewDateOpened[gate._id] = true;
        };

        $scope.newGateReview = {};

        $scope.createNewGateReview = function(project, gate){
            $scope.error = null;

            var newGateReview = {
                reviewDate : $scope.newGateReview.reviewDate,
                title : $scope.newGateReview.title
            };

            Projects.createGateReview(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newGateReview,
                function(res){
                    $scope.isResolving = false;
                    gate.gateReviews.push(res);
                    $scope.newGateReview = {};
                    $scope.showNewGateReviewForm = false;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewGateReview = function(){
            $scope.error = null;
            $scope.newGateReview = {};
        };


        // ------------- SELECT GATE REVIEW ------------


        $scope.selectGateReview = function(gateReview){
            $scope.selectedGateReview = gateReview;
            originalGateReview[gateReview._id] = _.cloneDeep(gateReview);
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.headerDateOpened = {};
        $scope.openHeaderDate = function(gateReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened[gateReview._id] = true;
        };

        $scope.editHeader = function(gateReview){
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
                    originalGateReview[gateReview._id].reviewDate = gateReview.reviewDate;
                    originalGateReview[gateReview._id].title = gateReview.title;
                    originalGateReview[gateReview._id].overallComment = gateReview.overallComment;
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
            gateReview.reviewDate = originalGateReview[gateReview._id].reviewDate;
            gateReview.title = originalGateReview[gateReview._id].title;
            gateReview.overallComment = originalGateReview[gateReview._id].overallComment;
            $scope.selectHeaderForm('view', gateReview);
        };


        $scope.deleteGateReview = function(project, gate, gateReview){
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
                $scope.cancelNewGateReview();
                $scope.selectedGateReview = null;
                originalGateReview = {};
            }, function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };
        
        // -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.editStatus = function(gateReview){
            $scope.selectStatusForm('edit', gateReview);
        };

        $scope.saveEditStatus = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateStatusReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    originalGateReview[gateReview._id].gateStatusReview.newOverallScore = gateReview.gateStatusReview.newOverallScore;
                    originalGateReview[gateReview._id].gateStatusReview.newStatus = gateReview.gateStatusReview.newStatus;
                    originalGateReview[gateReview._id].gateStatusReview.newCompleted = gateReview.gateStatusReview.newCompleted;
                    $scope.selectStatusForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function(gateReview){
            $scope.error = null;
            gateReview.gateStatusReview.newOverallScore = originalGateReview[gateReview._id].gateStatusReview.newOverallScore;
            gateReview.gateStatusReview.newStatus = originalGateReview[gateReview._id].gateStatusReview.newStatus;
            gateReview.gateStatusReview.newCompleted = originalGateReview[gateReview._id].gateStatusReview.newCompleted;
            $scope.selectStatusForm('view', gateReview);
        };



        // -------------------------------------------------------- BUDGET -------------------------------------------------

        $scope.editBudget = function(gateReview){
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
                    originalGateReview[gateReview._id].budgetReview.newAmount = gateReview.budgetReview.newAmount;
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
            gateReview.budgetReview.newAmount = originalGateReview[gateReview._id].budgetReview.newAmount;
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
            Projects.updateOutcomeReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    outcomeReviewId : outcomeReview._id
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


        $scope.submit = function(project, gate, gateReview){
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

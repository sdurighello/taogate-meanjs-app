'use strict';

angular.module('gate-management-review').controller('GateManagementReviewController', ['$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
    'GateProcesses', 'GateReviews', 'GateOutcomeScores', 'GateStatuses',
    function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcesses, GateReviews, GateOutcomeScores, GateStatuses) {

        // ------------- INIT -------------

        $scope.initError = [];

        $scope.init = function(){

            Projects.query({'selection.selectedForDelivery': true}, function(projects){
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


        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            $scope.userHasAuthorization = _.some(obj.user.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });
        });

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

        $scope.gateReviewDetails = 'header';

        $scope.activeTab = {};


        // -------------- SELECT GATE ---------------------

        $scope.setReviewObject = function(reviewObj){
            $scope.selectedGateReview = null;
            $scope.reviewObject = reviewObj;
        };


        // ------------- SELECT VIEW PROJECT ------------

        var originalGateReview = {};

        $scope.selectProject = function(project) {
            $scope.error = {};
            $scope.selectedProject = null;
            $scope.gateReviewList = null;
            $scope.reviewObject = null;

            $scope.selectedGateReview = null;
            originalGateReview = {};

            $scope.selectedProject = project;

            GateReviews.getReviewsForProject({
                project: project._id
            }, function (res) {
                $scope.gateReviewList = res;
            }, function (err) {
                $scope.error.gateReviews = err.data.message;
            });
        };

        $scope.cancelViewProject = function(){
            $scope.error = null;
            $scope.selectedProject = null;
            $scope.gateReviewList = null;

        };



        // ------------- NEW GATE REVIEW ------------

        $scope.newGateReviewDateOpened = {};

        $scope.openNewGateReviewDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newGateReviewDateOpened[gate._id] = true;
        };

        $scope.newGateReview = {};

        $scope.createNewGateReview = function(project, gate){
            var newGateReview = new GateReviews({
                project: project._id,
                gate : gate._id,
                reviewDate : $scope.newGateReview.reviewDate,
                title : $scope.newGateReview.title
            });
            newGateReview.$save(function(res) {
                // Clear new form
                $scope.newGateReview = {};
                // Refresh the list of gate reviews
                _.find($scope.gateReviewList, _.matchesProperty('gate._id', gate._id)).gateReviews.push(res);
                // Select in view mode the new review
                $scope.selectGateReview(res);
                // Close new review form done directly in the view's html
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewGateReview = function(){
            $scope.newGateReview = {};
        };


        // ------------- SELECT GATE REVIEW ------------

        var gateReviewFromList = {};
        // Required to update the list when changes details
        // in the details pane that are also reported in the list of gate reviews

        $scope.selectGateReview = function(gateReview){
            gateReviewFromList[gateReview._id] = gateReview;
            GateReviews.get({
                gateReviewId:gateReview._id
            }, function(res){
                $scope.selectedGateReview = res;
                originalGateReview[gateReview._id] = _.cloneDeep(res);
                //$scope.selectGateReviewForm('view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
                $scope.selectedGateReview = null;
                originalGateReview = {};
            });
        };

        // ------------- CHANGE GATE ------------

        $scope.changeGate = function(){
            $scope.cancelNewGateReview();
            $scope.selectedGateReview = null;
            originalGateReview = {};
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

        $scope.saveEditHeader = function(gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.updateHeader(
                {
                    gateReviewId : copyGateReview._id
                }, copyGateReview,
                function(res){
                    // Update details pane view with new saved details
                    originalGateReview[gateReview._id].reviewDate = gateReview.reviewDate;
                    originalGateReview[gateReview._id].title = gateReview.title;
                    originalGateReview[gateReview._id].overallComment = gateReview.overallComment;
                    // Update list of reviews with new date / title
                    gateReviewFromList[gateReview._id].reviewDate = gateReview.reviewDate;
                    gateReviewFromList[gateReview._id].title = gateReview.title;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', gateReview);
                },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditHeader = function(gateReview){
            gateReview.reviewDate = originalGateReview[gateReview._id].reviewDate;
            gateReview.title = originalGateReview[gateReview._id].title;
            gateReview.overallComment = originalGateReview[gateReview._id].overallComment;
            $scope.selectHeaderForm('view', gateReview);
        };


        $scope.deleteGateReview = function(reviewObject, gateReview){
            GateReviews.remove({gateReviewId: gateReview._id}, gateReview, function(res){
                reviewObject.gateReviews = _.without(reviewObject.gateReviews, _.find(reviewObject.gateReviews, _.matchesProperty('_id',gateReview._id)));
                $scope.cancelNewGateReview();
                $scope.selectedGateReview = null;
                originalGateReview = {};
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------


        $scope.submit = function(project, gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.submit(
                {
                    gateReviewId : copyGateReview._id
                }, copyGateReview,
                function(res){
                    // Set the "approval" in the gate from the list
                    gateReviewFromList[gateReview._id].approval = res.approval;
                    // Refresh the object with the current performances values
                    $scope.selectGateReview(gateReview);
                },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.approve = function(project, gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.approve(
                {
                    gateReviewId : copyGateReview._id
                }, copyGateReview,
                function(res){
                    // Set the "approval" in the gate from the list
                    gateReviewFromList[gateReview._id].approval = res.approval;
                    // Refresh the object with the current performances values
                    $scope.selectGateReview(gateReview);
                },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.reject = function(project, gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.reject(
                {
                    gateReviewId : copyGateReview._id
                }, copyGateReview,
                function(res){
                    // Set the "approval" in the gate from the list
                    gateReviewFromList[gateReview._id].approval = res.approval;
                    // Refresh the object with the current performances values
                    $scope.selectGateReview(gateReview);
                },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.draft = function(project, gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.draft(
                {
                    gateReviewId : copyGateReview._id
                }, copyGateReview,
                function(res){
                    // Set the "approval" in the gate from the list
                    gateReviewFromList[gateReview._id].approval = res.approval;
                    // Refresh the object with the current performances values
                    $scope.selectGateReview(gateReview);
                },
                function(err){$scope.error = err.data.message;}
            );
        };


        // -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.editStatus = function(gateReview){
            $scope.selectStatusForm('edit', gateReview);
        };

        $scope.saveEditStatus = function(gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.updateStatus( { gateReviewId : copyGateReview._id }, copyGateReview,
                function(res){
                    originalGateReview[gateReview._id].overallScore = gateReview.overallScore;
                    originalGateReview[gateReview._id].status = gateReview.status;
                    originalGateReview[gateReview._id].completed = gateReview.completed;
                    $scope.selectStatusForm('view', gateReview);
                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function(gateReview){
            gateReview.overallScore = originalGateReview[gateReview._id].overallScore;
            gateReview.status = originalGateReview[gateReview._id].status;
            gateReview.completed = originalGateReview[gateReview._id].completed;
            $scope.selectStatusForm('view', gateReview);
        };



        // -------------------------------------------------------- BUDGET -------------------------------------------------

        $scope.editBudget = function(gateReview){
            $scope.selectBudgetForm('edit', gateReview);
        };

        $scope.saveEditBudget = function(gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.updateBudget( { gateReviewId : copyGateReview._id }, copyGateReview,
                function(res){
                    originalGateReview[gateReview._id].budget = gateReview.budget;
                    $scope.selectBudgetForm('view', gateReview);
                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBudget = function(gateReview){
            gateReview.budget = originalGateReview[gateReview._id].budget;
            $scope.selectBudgetForm('view', gateReview);
        };




        // -------------------------------------------------------- OUTCOMES -------------------------------------------------

        var originalOutcomeReview = {};

        $scope.editOutcomeReview = function(outcomeReview){
            originalOutcomeReview[outcomeReview._id] = _.cloneDeep(outcomeReview);
            $scope.selectOutcomeReviewForm('edit', outcomeReview);
        };

        $scope.saveEditOutcomeReview = function(gateReview, outcomeReview){
            GateReviews.updateOutcomeReview(
                {
                    gateReviewId: gateReview._id,
                    outcomeReviewId : outcomeReview._id
                }, outcomeReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectOutcomeReviewForm('view', outcomeReview);
        };

        $scope.cancelEditOutcomeReview = function(outcomeReview){
            outcomeReview.newScore = originalOutcomeReview[outcomeReview._id].newScore;
            outcomeReview.reviewComment = originalOutcomeReview[outcomeReview._id].reviewComment;
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

        $scope.saveEditBaselineDuration = function(gateReview, baselineDurationReview){
            GateReviews.updateBaselineDuration(
                {
                    gateReviewId: gateReview._id,
                    baselineDurationReviewId : baselineDurationReview._id
                }, baselineDurationReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectBaselineDurationForm('view', baselineDurationReview);
        };

        $scope.cancelEditBaselineDuration = function(baselineDurationReview){
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
            originalEstimateDurationReview[estimateDurationReview._id] = _.cloneDeep(estimateDurationReview);
            $scope.selectEstimateDurationForm('edit', estimateDurationReview);
        };

        $scope.saveEditEstimateDuration = function(gateReview, estimateDurationReview){
            GateReviews.updateEstimateDuration(
                {
                    gateReviewId: gateReview._id,
                    estimateDurationReviewId : estimateDurationReview._id
                }, estimateDurationReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectEstimateDurationForm('view', estimateDurationReview);
        };

        $scope.cancelEditEstimateDuration = function(estimateDurationReview){
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
            originalActualDurationReview[actualDurationReview._id] = _.cloneDeep(actualDurationReview);
            $scope.selectActualDurationForm('edit', actualDurationReview);
        };

        $scope.saveEditActualDuration = function(gateReview, actualDurationReview){
            GateReviews.updateActualDuration(
                {
                    gateReviewId: gateReview._id,
                    actualDurationReviewId : actualDurationReview._id
                }, actualDurationReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectActualDurationForm('view', actualDurationReview);
        };

        $scope.cancelEditActualDuration = function(actualDurationReview){
            actualDurationReview.newDate = originalActualDurationReview[actualDurationReview._id].newDate;
            $scope.selectActualDurationForm('view', actualDurationReview);
        };


        // -------------------------------------------------------- BASELINE COST -------------------------------------------------

        var originalBaselineCostReview = {};

        $scope.editBaselineCost = function(baselineCostReview){
            originalBaselineCostReview[baselineCostReview._id] = _.cloneDeep(baselineCostReview);
            $scope.selectBaselineCostForm('edit', baselineCostReview);
        };

        $scope.saveEditBaselineCost = function(gateReview, baselineCostReview){
            GateReviews.updateBaselineCost(
                {
                    gateReviewId: gateReview._id,
                    baselineCostReviewId : baselineCostReview._id
                }, baselineCostReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectBaselineCostForm('view', baselineCostReview);
        };

        $scope.cancelEditBaselineCost = function(baselineCostReview){
            baselineCostReview.newCost = originalBaselineCostReview[baselineCostReview._id].newCost;
            $scope.selectBaselineCostForm('view', baselineCostReview);
        };


        // -------------------------------------------------------- ESTIMATE COST -------------------------------------------------

        var originalEstimateCostReview = {};

        $scope.editEstimateCost = function(estimateCostReview){
            originalEstimateCostReview[estimateCostReview._id] = _.cloneDeep(estimateCostReview);
            $scope.selectEstimateCostForm('edit', estimateCostReview);
        };

        $scope.saveEditEstimateCost = function(gateReview, estimateCostReview){
            GateReviews.updateEstimateCost(
                {
                    gateReviewId: gateReview._id,
                    estimateCostReviewId : estimateCostReview._id
                }, estimateCostReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectEstimateCostForm('view', estimateCostReview);
        };

        $scope.cancelEditEstimateCost = function(estimateCostReview){
            estimateCostReview.newCost = originalEstimateCostReview[estimateCostReview._id].newCost;
            $scope.selectEstimateCostForm('view', estimateCostReview);
        };


        // -------------------------------------------------------- ACTUAL COST -------------------------------------------------

        var originalActualCostReview = {};

        $scope.editActualCost = function(actualCostReview){
            originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
            $scope.selectActualCostForm('edit', actualCostReview);
        };

        $scope.saveEditActualCost = function(gateReview, actualCostReview){
            GateReviews.updateActualCost(
                {
                    gateReviewId: gateReview._id,
                    actualCostReviewId : actualCostReview._id
                }, actualCostReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectActualCostForm('view', actualCostReview);
        };

        $scope.cancelEditActualCost = function(actualCostReview){
            actualCostReview.newCost = originalActualCostReview[actualCostReview._id].newCost;
            $scope.selectActualCostForm('view', actualCostReview);
        };



        // -------------------------------------------------------- BASELINE COMPLETION -------------------------------------------------

        var originalBaselineCompletionReview = {};

        $scope.editBaselineCompletion = function(baselineCompletionReview){
            originalBaselineCompletionReview[baselineCompletionReview._id] = _.cloneDeep(baselineCompletionReview);
            $scope.selectBaselineCompletionForm('edit', baselineCompletionReview);
        };

        $scope.saveEditBaselineCompletion = function(gateReview, baselineCompletionReview){
            GateReviews.updateBaselineCompletion(
                {
                    gateReviewId: gateReview._id,
                    baselineCompletionReviewId : baselineCompletionReview._id
                }, baselineCompletionReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
        };

        $scope.cancelEditBaselineCompletion = function(baselineCompletionReview){
            baselineCompletionReview.newCompletion = originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion;
            $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
        };


        // -------------------------------------------------------- ESTIMATE COMPLETION -------------------------------------------------

        var originalEstimateCompletionReview = {};

        $scope.editEstimateCompletion = function(estimateCompletionReview){
            originalEstimateCompletionReview[estimateCompletionReview._id] = _.cloneDeep(estimateCompletionReview);
            $scope.selectEstimateCompletionForm('edit', estimateCompletionReview);
        };

        $scope.saveEditEstimateCompletion = function(gateReview, estimateCompletionReview){
            GateReviews.updateEstimateCompletion(
                {
                    gateReviewId: gateReview._id,
                    estimateCompletionReviewId : estimateCompletionReview._id
                }, estimateCompletionReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectEstimateCompletionForm('view', estimateCompletionReview);
        };

        $scope.cancelEditEstimateCompletion = function(estimateCompletionReview){
            estimateCompletionReview.newCompletion = originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion;
            $scope.selectEstimateCompletionForm('view', estimateCompletionReview);
        };


        // -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

        var originalActualCompletionReview = {};

        $scope.editActualCompletion = function(actualCompletionReview){
            originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
            $scope.selectActualCompletionForm('edit', actualCompletionReview);
        };

        $scope.saveEditActualCompletion = function(gateReview, actualCompletionReview){
            GateReviews.updateActualCompletion(
                {
                    gateReviewId: gateReview._id,
                    actualCompletionReviewId : actualCompletionReview._id
                }, actualCompletionReview,
                function(res){ },
                function(err){
                    $scope.error = err.data.message;
                }
            );
            $scope.selectActualCompletionForm('view', actualCompletionReview);
        };

        $scope.cancelEditActualCompletion = function(actualCompletionReview){
            actualCompletionReview.newCompletion = originalActualCompletionReview[actualCompletionReview._id].newCompletion;
            $scope.selectActualCompletionForm('view', actualCompletionReview);
        };














    }
]);

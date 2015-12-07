'use strict';

angular.module('gate-management-review').controller('GateManagementReviewController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
    'GateProcesses', 'GateReviews', 'GateOutcomeScores', 'GateStatuses',
    'ActualCompletions', 'ActualCosts', 'ActualDurations',
    'BaselineCompletions', 'BaselineCosts', 'BaselineDurations',
    'EstimateCompletions', 'EstimateCosts', 'EstimateDurations',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcesses, GateReviews, GateOutcomeScores, GateStatuses,
             ActualCompletions, ActualCosts, ActualDurations, BaselineCompletions, BaselineCosts, BaselineDurations,
             EstimateCompletions, EstimateCosts, EstimateDurations) {

		// ------------- INIT -------------

		$scope.initError = [];

        $scope.ciao = 10;

        var actualCompletions = [], actualCosts = [], actualDurations = [],
            baselineCompletions = [], baselineCosts = [], baselineDurations = [],
            estimateCompletions = [], estimateCosts = [], estimateDurations = [];


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

        $scope.gateReviewDetails = 'header';


        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            $scope.userHasAuthorization = _.some(obj.user.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });
        });


        var originalGateReview;

        // ------------- SELECT VIEW PROJECT ------------


        $scope.selectProject = function(project) {
            $scope.error = {};
            $scope.selectedProject = null;
            $scope.gateReviewList = null;

            $scope.selectedGateReview = null;
            originalGateReview = null;

            var copyProject = _.cloneDeep(project);
            copyProject.process = _.find($scope.gateProcesses, _.matchesProperty('_id', copyProject.process));
            copyProject.process.gates = _.sortBy(copyProject.process.gates, 'position');
            $scope.selectedProject = copyProject;

            GateReviews.query({
                queryObject:{
                    project: copyProject._id
                },
                deepPopulateArray: ['overallScore', 'status']
            }, function (gReviews) {
                var gateReviews = gReviews;
                $scope.gateReviewList = _.map(copyProject.process.gates, function (gate) {
                    return {
                        gate: gate,
                        gateReviews: _.filter(gateReviews, _.matchesProperty('gate', gate._id))
                    };
                });
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

        $scope.newGateReview = {};

        $scope.createNewGateReview = function(project, gate){
            var newGateReview = new GateReviews({
                project: project._id,
                gate : gate._id,
                status : $scope.newGateReview.status,
                reviewDate : $scope.newGateReview.reviewDate,
                title : $scope.newGateReview.title,
                overallScore : $scope.newGateReview.overallScore,
                overallComment : $scope.newGateReview.overallComment
            });
            newGateReview.$save(function(res) {

                // Clear new form
                $scope.newGateReview = {};

                // Close new cost form done directly in the view's html
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewGateReview = function(){
            $scope.newGateReview = {};
        };


        // ------------- SELECT GATE REVIEW ------------


        $scope.selectGateReview = function(gateReview){
            GateReviews.get({
                gateReviewId:gateReview._id,
                retPropertiesString : 'user created project gate status reviewDate title overallScore overallComment completed outcomeReviews ' +
                'baselineDurationReviews estimateDurationReviews actualDurationReviews' +
                'baselineCostReviews estimateCostReviews actualCostReviews' +
                'baselineCompletionReviews estimateCompletionReviews actualCompletionReviews',
                deepPopulateArray : [
                    'outcomeReviews.outcome',
                    'baselineDurationReviews.baselineDuration', 'estimateDurationReviews.estimateDuration', 'actualDurationReviews.actualDuration',
                    'baselineCostReviews.baselineCost', 'estimateCostReviews.estimateCost', 'actualCostReviews.actualCost',
                    'baselineCompletionReviews.baselineCompletion', 'estimateCompletionReviews.baselineCompletion', 'actualCompletionReviews.actualCompletion'
                ]
            }, function(res){
                $scope.selectedGateReview = res;
                originalGateReview = _.cloneDeep(res);
                //$scope.selectGateReviewForm('view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };















        //
        //
        //// -------------------------------------------------------- COSTS -------------------------------------------------
        //
        //
        //// ------------- NEW COST ASSIGNMENT ---------
        //
        //$scope.newCostAssignment = {};
        //$scope.newCostAssignment.group = {};
        //$scope.newCostAssignment.type = {};
        //$scope.newCostAssignment.name = '';
        //$scope.newCostAssignment.year = null;
        //$scope.newCostAssignment.amount = null;
        //
        //$scope.createNewCostAssignment = function(project){
        //    var newCostAssignment = new FinancialCosts({
        //        group : $scope.newCostAssignment.group._id,
        //        type : $scope.newCostAssignment.type._id,
        //        name : $scope.newCostAssignment.name,
        //        year : $scope.newCostAssignment.year,
        //        amount : $scope.newCostAssignment.amount
        //    });
        //
        //    newCostAssignment.$save({projectId: project._id}, function(res) {
        //        // Populate group and type since res doesn't
        //        res.group = $scope.newCostAssignment.group;
        //        res.type = $scope.newCostAssignment.type;
        //        // Add new category to the view group
        //        project.costs.unshift(res);
        //        // Clear new cost form
        //        $scope.newCostAssignment = {};
        //        $scope.newCostAssignment.group = {};
        //        $scope.newCostAssignment.type = {};
        //        $scope.newCostAssignment.name = '';
        //        $scope.newCostAssignment.year = null;
        //        $scope.newCostAssignment.amount = null;
        //        // Close new cost form done directly in the view's html
        //    }, function(errorResponse) {
        //        $scope.error = errorResponse.data.message;
        //    });
        //};
        //
        //
        //// ------------- SELECT COST ASSIGNMENT ---------
        //
        //$scope.selectCostAssignment = function(assignedCost){
        //    originalCostAssignment[assignedCost._id] = _.clone(assignedCost);
        //};
        //
        //
        //
        //// ------------- EDIT COST ASSIGNMENT ---------
        //
        //$scope.editAssignedCost = function(project, assignedCost){
        //    // Check cost type since ngOptions doesn't update it if group changed but user didn't specifically selected a new type
        //    if(!_.find(assignedCost.group.costTypes, assignedCost.type)){
        //        assignedCost.type = null;
        //    }
        //    var copyAssignedCost = _.clone(assignedCost);
        //    copyAssignedCost.group = allowNull(copyAssignedCost.group);
        //    copyAssignedCost.type = allowNull(copyAssignedCost.type);
        //    FinancialCosts.update(copyAssignedCost,
        //        function(res){ },
        //        function(err){$scope.error = err.data.message;}
        //    );
        //};
        //
        //$scope.cancelEditAssignedCost = function(assignedCost){
        //    assignedCost.group = originalCostAssignment[assignedCost._id].group;
        //    assignedCost.type = originalCostAssignment[assignedCost._id].type;
        //    assignedCost.name = originalCostAssignment[assignedCost._id].name;
        //    assignedCost.year = originalCostAssignment[assignedCost._id].year;
        //    assignedCost.amount = originalCostAssignment[assignedCost._id].amount;
        //};
        //
        //
        //// ------------- DELETE COST ASSIGNMENT ---------
        //
        //$scope.deleteAssignedCost = function(project, assignedCost){
        //
        //    FinancialCosts.remove({projectId: project._id}, assignedCost, function(res){
        //        project.costs = _.without(project.costs, assignedCost);
        //    }, function(err){
        //        $scope.error = err.data.message;
        //    });
        //
        //};


    }
]);

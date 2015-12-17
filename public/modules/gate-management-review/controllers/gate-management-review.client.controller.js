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
                project: copyProject._id
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
                reviewDate : $scope.newGateReview.reviewDate,
                title : $scope.newGateReview.title
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
                gateReviewId:gateReview._id
            }, function(res){
                $scope.selectedGateReview = res;
                originalGateReview = _.cloneDeep(res);
                console.log(res);
                //$scope.selectGateReviewForm('view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.updateHeader = function(gateReview){
            // Clean-up deepPopulate
            var copyGateReview = _.cloneDeep(gateReview);
            copyGateReview.project = _.get(copyGateReview.project, '_id');
            copyGateReview.gate = _.get(copyGateReview.gate, '_id');
            copyGateReview.gateStatusAssignment = _.get(copyGateReview.gateStatusAssignment, '_id');
            // Update server header
            GateReviews.updateHeader(
                {
                    gateReviewId : copyGateReview._id,
                    headerId: copyGateReview.gateStatusAssignment
                }, copyGateReview,
                function(res){ },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelUpdateHeader = function(gateReview){
            gateReview.reviewDate = originalGateReview.reviewDate;
            gateReview.title = originalGateReview.title;
            gateReview.overallScore = originalGateReview.overallScore;
            gateReview.status = originalGateReview.status;
            gateReview.overallComment = originalGateReview.overallComment;
            gateReview.completed = originalGateReview.completed;
        };


        $scope.deleteGateReview = function(gateReview){

            GateReviews.remove({gateReviewId: gateReview._id}, gateReview, function(res){
                //project.costs = _.without(project.costs, assignedCost);
            }, function(err){
                $scope.error = err.data.message;
            });

        };


    }
]);

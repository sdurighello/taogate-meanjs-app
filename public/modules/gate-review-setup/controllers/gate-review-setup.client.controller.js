'use strict';

angular.module('gate-review-setup').controller('GateReviewSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'GateOutcomeScores','GateStatuses','_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, GateOutcomeScores, GateStatuses, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

        $scope.initError = [];

		$scope.init = function(){
            GateOutcomeScores.query(function(scores){
                $scope.outcomeScores = scores;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            GateStatuses.query(function(statuses){
                $scope.gateStatuses = statuses;
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


// ----------------------------------------------- OUTCOME SCORES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchScoreForm = {};

		$scope.selectScoreForm = function(score, string){
			if(string === 'view'){ $scope.switchScoreForm[score._id] = 'view';}
			if(string === 'new'){$scope.switchScoreForm[score._id] = 'new';}
			if(string === 'edit'){$scope.switchScoreForm[score._id] = 'edit';}
		};

		// ------------------- LIST OF SCORES -----------------

		$scope.findScores = function() {
            $scope.initError = [];
			GateOutcomeScores.query(function(scores){
				$scope.outcomeScores = _.clone(scores);
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		$scope.selectScore = function(score){
			$scope.selectScoreForm(score, 'edit');
		};

		$scope.updateScore = function(score) {
			score.$update(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(score, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditScore = function(score){
			$scope.findScores();
			$scope.selectScoreForm(score, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeScore = function(score) {
			score.$remove(function(response) {
				$scope.findScores();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createScore = function() {
			var outcomeScore = new GateOutcomeScores ({
				name: 'New outcome score'
			});
			outcomeScore.$save(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



// ----------------------------------------------- GATE STATUSES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchStatusForm = {};

        $scope.selectStatusForm = function(status, string){
            if(string === 'view'){ $scope.switchStatusForm[status._id] = 'view';}
            if(string === 'new'){$scope.switchStatusForm[status._id] = 'new';}
            if(string === 'edit'){$scope.switchStatusForm[status._id] = 'edit';}
        };

        // ------------------- LIST OF STATUSES -----------------

        $scope.findStatuses = function() {
            $scope.initError = [];
            GateStatuses.query(function(statuses){
                $scope.gateStatuses = _.clone(statuses);
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        $scope.selectStatus = function(status){
            $scope.selectStatusForm(status, 'edit');
        };

        $scope.updateStatus = function(status) {
            status.$update(function(response) {
                $scope.findStatuses();
                $scope.selectStatusForm(status, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditStatus = function(status){
            $scope.findStatuses();
            $scope.selectStatusForm(status, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeStatus = function(status) {
            status.$remove(function(response) {
                $scope.findStatuses();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createStatus = function() {
            var gateStatus = new GateStatuses ({
                name: 'New gate status'
            });
            gateStatus.$save(function(response) {
                $scope.findStatuses();
                $scope.selectStatusForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

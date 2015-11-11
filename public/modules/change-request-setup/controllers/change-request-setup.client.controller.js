'use strict';

angular.module('change-request-setup').controller('ChangeRequestSetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'ChangeRequestStates','ChangeRequestReasons', '_','$q',
	function($scope, $stateParams, $location, Authentication, ChangeRequestStates, ChangeRequestReasons, _ , $q) {

		// ----------- INIT ---------------

		$scope.init = function(){
			ChangeRequestStates.query(function(states){
                ChangeRequestReasons.query(function(reasons){
                    $scope.changeRequestReasons = reasons;
                    $scope.changeRequestStates = states;
                });
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


// ----------------------------------------------- CHANGE REQUEST REASONS ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchReasonForm = {};

		$scope.selectReasonForm = function(reason, string){
			if(string === 'view'){ $scope.switchReasonForm[reason._id] = 'view';}
			if(string === 'new'){$scope.switchReasonForm[reason._id] = 'new';}
			if(string === 'edit'){$scope.switchReasonForm[reason._id] = 'edit';}
		};

		// ------------------- LIST OF REASONS -----------------

		$scope.findReasons = function() {
			ChangeRequestReasons.query(function(reasons){
				$scope.changeRequestReasons = reasons;
			});
		};

		// ------------------- EDIT -----------------

        var originalReason = {};
		$scope.selectReason = function(reason){
			$scope.error = null;
            originalReason[reason._id] = _.clone(reason);
			$scope.selectReasonForm(reason, 'edit');
		};

		$scope.updateReason = function(reason) {
			$scope.error = null;
			reason.$update(function(response) {
				$scope.findReasons();
				$scope.selectReasonForm(reason, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditReason = function(reason){
			reason.name = originalReason[reason._id].name;
            reason.description = originalReason[reason._id].description;
			$scope.selectReasonForm(reason, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeReason = function(reason) {
			$scope.error = null;
			reason.$remove(function(response) {
				$scope.findReasons();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createReason = function() {
			$scope.error = null;
			var reason = new ChangeRequestReasons ({
				name: 'New reason for change'
			});
			reason.$save(function(response) {
				$scope.findReasons();
				$scope.selectReasonForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ----------------------------------------------- CHANGE REQUEST STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchStateForm = {};

        $scope.selectStateForm = function(state, string){
            if(string === 'view'){ $scope.switchStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST OF STATES -----------------

        $scope.findStates = function() {
            ChangeRequestStates.query(function(states){
                $scope.changeRequestStates = states;
            });
        };

        // ------------------- EDIT -----------------

        var originalState = {};
        $scope.selectState = function(state){
            $scope.error = null;
            originalState[state._id] = _.clone(state);
            $scope.selectStateForm(state, 'edit');
        };

        $scope.updateState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findStates();
                $scope.selectStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditState = function(state){
            state.name = originalState[state._id].name;
            state.description = originalState[state._id].description;
            $scope.selectStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createState = function() {
            $scope.error = null;
            var state = new ChangeRequestStates ({
                name: 'New state'
            });
            state.$save(function(response) {
                $scope.findStates();
                $scope.selectStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

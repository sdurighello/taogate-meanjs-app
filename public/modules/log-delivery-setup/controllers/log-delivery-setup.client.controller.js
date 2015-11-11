'use strict';

angular.module('log-delivery-setup').controller('LogDeliverySetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'IssueStates', 'IssueActionStates', 'ChangeRequestStates', '_','$q',
	function($scope, $stateParams, $location, Authentication, IssueStates, IssueActionStates, ChangeRequestStates, _ , $q) {

		// ----------- INIT ---------------

		$scope.init = function(){
			IssueStates.query(function(issueStates){
				IssueActionStates.query(function(actionStates){
					ChangeRequestStates.query(function(changeRequestStates){
						$scope.issueStates = issueStates;
						$scope.actionStates = actionStates;
						$scope.changeRequestStates = changeRequestStates;
					});
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



// ----------------------------------------------- ISSUE STATES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchIssueStateForm = {};

		$scope.selectIssueStateForm = function(state, string){
			if(string === 'view'){ $scope.switchIssueStateForm[state._id] = 'view';}
			if(string === 'new'){$scope.switchIssueStateForm[state._id] = 'new';}
			if(string === 'edit'){$scope.switchIssueStateForm[state._id] = 'edit';}
		};

		// ------------------- LIST STATES -----------------

		$scope.findIssueStates = function() {
			IssueStates.query(function(states){
				$scope.issueStates = states;
			});
		};

		// ------------------- EDIT -----------------

		var originalIssueState = {};
		$scope.selectIssueState = function(state){
			$scope.error = null;
			originalIssueState[state._id] = _.clone(state);
			$scope.selectIssueStateForm(state, 'edit');
		};

		$scope.updateIssueState = function(state) {
			$scope.error = null;
			state.$update(function(response) {
				$scope.findIssueStates();
				$scope.selectIssueStateForm(state, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditIssueState = function(state){
			state.name = originalIssueState[state._id].name;
			state.description = originalIssueState[state._id].description;
			$scope.selectIssueStateForm(state, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeIssueState = function(state) {
			$scope.error = null;
			state.$remove(function(response) {
				$scope.findIssueStates();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createIssueState = function() {
			$scope.error = null;
			var state = new IssueStates ({
				name: 'New issue state'
			});
			state.$save(function(response) {
				$scope.findIssueStates();
				$scope.selectIssueStateForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};




// ----------------------------------------------- ACTION STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchActionStateForm = {};

        $scope.selectActionStateForm = function(state, string){
            if(string === 'view'){ $scope.switchActionStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchActionStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchActionStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST STATES -----------------

        $scope.findActionStates = function() {
            IssueActionStates.query(function(states){
                $scope.actionStates = states;
            });
        };

        // ------------------- EDIT -----------------

        var originalActionState = {};
        $scope.selectActionState = function(state){
            $scope.error = null;
            originalActionState[state._id] = _.clone(state);
            $scope.selectActionStateForm(state, 'edit');
        };

        $scope.updateActionState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findActionStates();
                $scope.selectActionStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditActionState = function(state){
            state.name = originalActionState[state._id].name;
            state.description = originalActionState[state._id].description;
            $scope.selectActionStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeActionState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findActionStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createActionState = function() {
            $scope.error = null;
            var state = new IssueActionStates ({
                name: 'New action state'
            });
            state.$save(function(response) {
                $scope.findActionStates();
                $scope.selectActionStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


// ----------------------------------------------- CHANGE REQUEST STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchChangeRequestStateForm = {};

        $scope.selectChangeRequestStateForm = function(state, string){
            if(string === 'view'){ $scope.switchChangeRequestStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchChangeRequestStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchChangeRequestStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST STATES -----------------

        $scope.findChangeRequestStates = function() {
            ChangeRequestStates.query(function(states){
                $scope.changeRequestStates = states;
            });
        };

        // ------------------- EDIT -----------------

        var originalChangeRequestState = {};
        $scope.selectChangeRequestState = function(state){
            $scope.error = null;
            originalChangeRequestState[state._id] = _.clone(state);
            $scope.selectChangeRequestStateForm(state, 'edit');
        };

        $scope.updateChangeRequestState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findChangeRequestStates();
                $scope.selectChangeRequestStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditChangeRequestState = function(state){
            state.name = originalChangeRequestState[state._id].name;
            state.description = originalChangeRequestState[state._id].description;
            $scope.selectChangeRequestStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeChangeRequestState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findChangeRequestStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createChangeRequestState = function() {
            $scope.error = null;
            var state = new ChangeRequestStates ({
                name: 'New change request state'
            });
            state.$save(function(response) {
                $scope.findChangeRequestStates();
                $scope.selectChangeRequestStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };





    }
]);

'use strict';

angular.module('log-delivery-setup').controller('LogDeliverySetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'IssueStates', 'IssueActionStates', 'ChangeRequestStates', 'LogPriorities', 'LogReasons', '_','$q',
	function($scope, $stateParams, $location, Authentication, IssueStates, IssueActionStates, ChangeRequestStates, LogPriorities, LogReasons, _ , $q) {

		// ----------- INIT ---------------

        $scope.initError = [];

		$scope.init = function(){
            IssueStates.query(function(issueStates){
                $scope.issueStates = issueStates;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            IssueActionStates.query(function(actionStates){
                $scope.actionStates = actionStates;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            ChangeRequestStates.query(function(changeRequestStates){
                $scope.changeRequestStates = changeRequestStates;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogPriorities.query(function(priorities){
                $scope.logPriorities = priorities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogReasons.query(function(reasons){
                $scope.logReasons = reasons;
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
            $scope.initError = [];
			IssueStates.query(function(states){
				$scope.issueStates = states;
			}, function(err){
                $scope.initError.push(err.data.message);
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
            $scope.initError = [];
            IssueActionStates.query(function(states){
                $scope.actionStates = states;
            }, function(err){
                $scope.initError.push(err.data.message);
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
            $scope.initError = [];
            ChangeRequestStates.query(function(states){
                $scope.changeRequestStates = states;
            }, function(err){
                $scope.initError.push(err.data.message);
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


        // ---------------------------------------------------- LOG PRIORITIES --------------------------------------

        // ------------------- DRAG AND DROP LISTENERS -------

        $scope.dragControlListeners = {
            //accept: function (sourceItemHandleScope, destSortableScope) {
            //    //override to determine drag is allowed or not. default is true.
            //    return true;
            //},
            //itemMoved: function (event) {
            //
            //},
            orderChanged: function(event) {
                for(var i = 0; i < $scope.logPriorities.length; i++){
                    $scope.updateValue($scope.logPriorities[i]);
                }
            }
            //containment: '#board',//optional param.
            //clone: true //optional param for clone feature.
        };

        /*
         event object - structure
         source:
         index: original index before move.
         itemScope: original item scope before move.
         sortableScope: original sortable list scope.
         dest:
         index: index after move.
         sortableScope: destination sortable scope.
         -------------
         sourceItemScope - the scope of the item being dragged.
         destScope - the sortable destination scope, the list.
         destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
         */


        // ------------------- NG-SWITCH ---------------------

        $scope.selectValueForm = function(string){
            if(string === 'view'){ $scope.switchValueForm = 'view';}
            if(string === 'edit'){$scope.switchValueForm = 'edit';}
        };

        // ------------------- LIST OF VALUES -----------------

        $scope.findValues = function() {
            $scope.initError = [];
            LogPriorities.query(function(values){
                $scope.logPriorities = values;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalValue;
        $scope.selectValue = function(value){
            $scope.error = null;
            $scope.selectValueForm('view');
            $scope.priorityValue = value;
            originalValue = _.clone(value);
        };

        $scope.updateValue = function(value) {
            $scope.error = null;
            value.position = _.indexOf($scope.logPriorities, value) + 1;
            value.$update(function(response) {
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditValue = function(value){
            value.name = originalValue.name;
            value.numericalValue = originalValue.numericalValue;
            value.description = originalValue.description;
            $scope.selectValueForm('view');
        };

        // ------------------- DELETE -----------------

        $scope.removeValue = function(value) {
            $scope.error = null;
            value.$remove(function(response) {
                $scope.logPriorities = _.without($scope.logPriorities, value);
                for(var i = 0; i < $scope.logPriorities.length; i++){
                    if($scope.logPriorities[i].position > value.position){
                        $scope.updateValue($scope.logPriorities[i]);
                    }
                }
                $scope.priorityValue = null;
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createValue = function() {
            $scope.error = null;
            var priorityValue = new LogPriorities ({
                name: 'New log priority',
                numericalValue: 0,
                position: $scope.logPriorities.length + 1
            });
            priorityValue.$save(function(response) {
                $scope.findValues();
                $scope.selectValueForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

// ----------------------------------------------- REASONS ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchReasonForm = {};

        $scope.selectReasonForm = function(reason, string){
            if(string === 'view'){ $scope.switchReasonForm[reason._id] = 'view';}
            if(string === 'new'){$scope.switchReasonForm[reason._id] = 'new';}
            if(string === 'edit'){$scope.switchReasonForm[reason._id] = 'edit';}
        };

        // ------------------- LIST OF REASONS -----------------

        $scope.findReasons = function() {
            $scope.initError = [];
            LogReasons.query(function(reasons){
                $scope.logReasons = reasons;
            }, function(err){
                $scope.initError.push(err.data.message);
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
            var reason = new LogReasons ({
                name: 'New reason for change'
            });
            reason.$save(function(response) {
                $scope.findReasons();
                $scope.selectReasonForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

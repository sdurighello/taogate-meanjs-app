'use strict';

angular.module('improvement-setup').controller('ImprovementSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'ImprovementStates', 'ImprovementTypes', 'ImprovementReasons', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, ImprovementStates, ImprovementTypes, ImprovementReasons, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			ImprovementStates.query(function(res){
				$scope.improvementStates = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ImprovementTypes.query(function(res){
				$scope.improvementTypes = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ImprovementReasons.query(function(res){
				$scope.improvementReasons = res;
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



// ----------------------------------------------- IMPROVEMENT STATES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchImprovementStateForm = {};

		$scope.selectImprovementStateForm = function(state, string){
			if(string === 'view'){ $scope.switchImprovementStateForm[state._id] = 'view';}
			if(string === 'new'){$scope.switchImprovementStateForm[state._id] = 'new';}
			if(string === 'edit'){$scope.switchImprovementStateForm[state._id] = 'edit';}
		};

		// ------------------- LIST STATES -----------------

		$scope.findImprovementStates = function() {
			$scope.initError = [];
			ImprovementStates.query(function(states){
				$scope.improvementStates = states;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalImprovementState = {};
		$scope.selectImprovementState = function(state){
			$scope.error = null;
			originalImprovementState[state._id] = _.clone(state);
			$scope.selectImprovementStateForm(state, 'edit');
		};

		$scope.updateImprovementState = function(state) {
			$scope.error = null;
			state.$update(function(response) {
				$scope.findImprovementStates();
				$scope.selectImprovementStateForm(state, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditImprovementState = function(state){
			state.name = originalImprovementState[state._id].name;
			state.description = originalImprovementState[state._id].description;
			$scope.selectImprovementStateForm(state, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeImprovementState = function(state) {
			$scope.error = null;
			state.$remove(function(response) {
				$scope.findImprovementStates();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createImprovementState = function() {
			$scope.error = null;
			var state = new ImprovementStates ({
				name: 'New improvement activity state'
			});
			state.$save(function(response) {
				$scope.findImprovementStates();
				$scope.selectImprovementStateForm(response._id, 'view');

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
			ImprovementReasons.query(function(reasons){
				$scope.improvementReasons = reasons;
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
			var reason = new ImprovementReasons ({
				name: 'New reason for improvement'
			});
			reason.$save(function(response) {
				$scope.findReasons();
				$scope.selectReasonForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



        // ----------------------------------------------- TYPES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchTypeForm = {};

        $scope.selectTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
        };

        // ------------------- LIST OF REASONS -----------------

        $scope.findTypes = function() {
            $scope.initError = [];
            ImprovementTypes.query(function(types){
                $scope.improvementTypes = types;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalType = {};
        $scope.selectType = function(type){
            $scope.error = null;
            originalType[type._id] = _.clone(type);
            $scope.selectTypeForm(type, 'edit');
        };

        $scope.updateType = function(type) {
            $scope.error = null;
            type.$update(function(response) {
                $scope.findTypes();
                $scope.selectTypeForm(type, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditType = function(type){
            type.name = originalType[type._id].name;
            type.description = originalType[type._id].description;
            $scope.selectTypeForm(type, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeType = function(type) {
            $scope.error = null;
            type.$remove(function(response) {
                $scope.findTypes();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createType = function() {
            $scope.error = null;
            var type = new ImprovementTypes ({
                name: 'New improvement activity type'
            });
            type.$save(function(response) {
                $scope.findTypes();
                $scope.selectTypeForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

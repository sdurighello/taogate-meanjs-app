'use strict';

angular.module('status-report-setup').controller('StatusReportSetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'LogStatusIndicators', 'LogStatusAreas', '_','$q',
	function($scope, $stateParams, $location, Authentication, LogStatusIndicators, LogStatusAreas, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatusIndicators = logStatusIndicators;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogStatusAreas.query(function(logStatusAreas){
				$scope.logStatusAreas = logStatusAreas;
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



		// ----------------------------------------------- STATUSES ---------------------------------------



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
			LogStatuses.query(function(statuses){
				$scope.logStatuses = statuses;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalStatus = {};
		$scope.selectStatus = function(status){
			$scope.error = null;
			originalStatus[status._id] = _.clone(status);
			$scope.selectStatusForm(status, 'edit');
		};

		$scope.updateStatus = function(status) {
			$scope.error = null;
			status.$update(function(response) {
				$scope.findStatuses();
				$scope.selectStatusForm(status, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditStatus = function(status){
			status.name = originalStatus[status._id].name;
			status.description = originalStatus[status._id].description;
			$scope.selectStatusForm(status, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeStatus = function(status) {
			$scope.error = null;
			status.$remove(function(response) {
				$scope.findStatuses();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createStatus = function() {
			$scope.error = null;
			var status = new LogStatuses ({
				name: 'New status indicator'
			});
			status.$save(function(response) {
				$scope.findStatuses();
				$scope.selectStatusForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

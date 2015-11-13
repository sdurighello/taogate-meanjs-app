'use strict';

angular.module('log-general-setup').controller('LogGeneralSetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'LogPriorities', 'LogReasons', '_','$q',
	function($scope, $stateParams, $location, Authentication, LogPriorities, LogReasons, _ , $q) {

		// ----------- INIT ---------------

		$scope.init = function(){
			LogPriorities.query(function(priorities){
				LogReasons.query(function(reasons){
					$scope.logPriorities = priorities;
					$scope.logReasons = reasons;
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
			LogPriorities.query(function(values){
				$scope.logPriorities = values;
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
			LogReasons.query(function(reasons){
				$scope.logReasons = reasons;
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

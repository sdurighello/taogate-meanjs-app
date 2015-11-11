'use strict';

// Log priorities controller
angular.module('log-priorities').controller('LogPrioritiesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'LogPriorities', '_','$q',
	function($scope, $stateParams, $location, Authentication, LogPriorities, _ , $q) {

		// ----------- INIT ---------------

		$scope.init = function(){
			LogPriorities.query(function(priorities){
				$scope.logPriorities = priorities;
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


		// ---------------------------------------------------- PRIORITY VALUES --------------------------------------

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




	}
]);

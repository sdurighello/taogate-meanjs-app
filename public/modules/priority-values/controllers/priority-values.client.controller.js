'use strict';

// Priority values controller
angular.module('priority-values').controller('PriorityValuesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'PriorityValues','$q','_',
	function($scope, $stateParams, $location, Authentication, PriorityValues, $q, _) {

		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			$scope.userHasAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo';
			});
		});


		// ------------------- NG-SWITCH ---------------------

		$scope.selectValueForm = function(string){
			if(string === 'view'){ $scope.switchValueForm = 'view';}
			if(string === 'edit'){$scope.switchValueForm = 'edit';}
		};

		// ------------------- LIST OF VALUES -----------------

		$scope.find = function() {
			PriorityValues.query(function(values){
				$scope.priorityValues = _.clone(values);
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

		$scope.update = function(value) {
            $scope.error = null;
			value.$update(function(response) {
				$scope.selectValueForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEdit = function(value){
			value.name = originalValue.name;
            value.description = originalValue.description;
			$scope.selectValueForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.remove = function(value) {
            $scope.error = null;
			value.$remove(function(response) {
                $scope.priorityValue = null;
                $scope.find();
                $scope.selectValueForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.create = function() {
            $scope.error = null;
			var priorityValue = new PriorityValues ({
				name: 'New priority value',
                numericalValue: 0
			});
            priorityValue.$save(function(response) {
				$scope.find();
				$scope.selectValueForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

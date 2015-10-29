'use strict';

// Strategy node types controller
angular.module('strategy-node-types').controller('StrategyNodeTypesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'StrategyNodeTypes','$q','_',
	function($scope, $stateParams, $location, Authentication, StrategyNodeTypes, $q, _) {


		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			_.map(_.get(obj,'user.roles'), function(role){
				obj[role] = true;
			});
			$scope.authentication = obj;

		});


		// ------------------- NG-SWITCH ---------------------

		$scope.switchTypeForm = {};

		$scope.selectTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.find = function() {
			StrategyNodeTypes.query(function(types){
				$scope.strategyNodeTypes = _.clone(types);
			});
		};

		// ------------------- EDIT -----------------

		$scope.selectType = function(type){
			$scope.selectTypeForm(type, 'edit');
		};

		$scope.update = function(type) {
			type.$update(function(response) {
				$scope.find();
				$scope.selectTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEdit = function(type){
			$scope.find();
			$scope.selectTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.remove = function(type) {
			type.$remove(function(response) {
				$scope.find();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.create = function() {
			var strategyNodeType = new StrategyNodeTypes ({
				name: 'New strategy node type'
			});
			strategyNodeType.$save(function(response) {
				$scope.name = '';
				$scope.find();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

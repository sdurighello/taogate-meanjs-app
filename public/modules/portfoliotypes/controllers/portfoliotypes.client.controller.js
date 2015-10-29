'use strict';

// Portfoliotypes controller
angular.module('portfoliotypes').controller('PortfoliotypesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'Portfoliotypes','$q','_',
	function($scope, $stateParams, $location, Authentication, Portfoliotypes, $q, _) {


		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);

			// One variable for each CRUD, Booleans (true = user is authorized)
			$scope.userHasCreateAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo';
			});
			$scope.userHasUpdateAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo';
			});
			$scope.userHasDeleteAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo';
			});
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
			Portfoliotypes.query(function(types){
				$scope.portfoliotypes = _.clone(types);
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
			var portfoliotype = new Portfoliotypes ({
				name: 'New portfolio type'
			});
			portfoliotype.$save(function(response) {
				$scope.name = '';
				$scope.find();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

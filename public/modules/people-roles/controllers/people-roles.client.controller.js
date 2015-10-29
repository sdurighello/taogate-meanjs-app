'use strict';

// People roles controller
angular.module('people-roles').controller('PeopleRolesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'PeopleRoles','$q','_',
	function($scope, $stateParams, $location, Authentication, PeopleRoles, $q, _) {

		// ------------- INIT -------------

		$scope.init = function(){
			PeopleRoles.query(function(roles){
					$scope.peopleRoles = roles;
			});
		};

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

		$scope.switchRoleForm = {};

		$scope.selectRoleForm = function(role, string){
			if(string === 'view'){ $scope.switchRoleForm[role._id] = 'view';}
			if(string === 'new'){$scope.switchRoleForm[role._id] = 'new';}
			if(string === 'edit'){$scope.switchRoleForm[role._id] = 'edit';}
		};

		// ----------------- REFRESH ROLE LIST ------------

		$scope.roleList = function(){
            PeopleRoles.query(function(roles){
				$scope.peopleRoles = roles;
			});
		};

		// ------------------ CREATE ROLE ----------------

		$scope.createRole = function() {
			$scope.error = null;

			var peopleRole = new PeopleRoles ({
				name: 'New role',
                description: 'New role description'
			});

            peopleRole.$save(function(response) {
				$scope.roleList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT ROLE -----------------


		$scope.selectRole = function(role){
			$scope.error = null;
			$scope.selectRoleForm(role, 'edit');
		};

		$scope.updateRole = function(role) {
			role.$update(function(response) {
				$scope.roleList();
				$scope.selectRoleForm(role, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditRole = function(role){
			$scope.error = null;
			$scope.roleList();
			$scope.selectRoleForm(role, 'view');
		};

		// ------------------- REMOVE ROLE -----------------

		$scope.removeRole = function(role) {
			$scope.error = null;
            role.$remove(function(response) {
				$scope.roleList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//// Create new People role
		//$scope.create = function() {
		//	// Create new People role object
		//	var peopleRole = new PeopleRoles ({
		//		name: this.name,
		//		description: this.description
		//	});
        //
		//	// Redirect after save
		//	peopleRole.$save(function(response) {
		//		$location.path('people-roles/' + response._id);
        //
		//		// Clear form fields
		//		$scope.name = '';
		//		$scope.description = '';
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};
        //
		//// Remove existing People role
		//$scope.remove = function(peopleRole) {
		//	if ( peopleRole ) {
		//		peopleRole.$remove();
        //
		//		for (var i in $scope.peopleRoles) {
		//			if ($scope.peopleRoles [i] === peopleRole) {
		//				$scope.peopleRoles.splice(i, 1);
		//			}
		//		}
		//	} else {
		//		$scope.peopleRole.$remove(function() {
		//			$location.path('people-roles');
		//		});
		//	}
		//};
        //
		//// Update existing People role
		//$scope.update = function() {
		//	var peopleRole = $scope.peopleRole;
        //
		//	peopleRole.$update(function() {
		//		$location.path('people-roles/' + peopleRole._id);
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};
        //
		//// Find a list of People roles
		//$scope.find = function() {
		//	$scope.peopleRoles = PeopleRoles.query();
		//};
        //
		//// Find existing People role
		//$scope.findOne = function() {
		//	$scope.peopleRole = PeopleRoles.get({
		//		peopleRoleId: $stateParams.peopleRoleId
		//	});
		//};
	}
]);

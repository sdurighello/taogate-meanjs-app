'use strict';

// Subusers controller
angular.module('subusers').controller('SubusersController', ['$rootScope', '$http','$scope', '$stateParams', '$location', 'Authentication', 'Subusers','$q','_',
	function($rootScope, $http, $scope, $stateParams, $location, Authentication, Subusers, $q, _) {


		$rootScope.staticMenu = false;

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

		// ------



		$scope.roles = [
			{roleString:'admin', roleTitle: 'Administrator', selected:false},
			{roleString:'pmo', roleTitle: 'PMO', selected:false},
			{roleString: 'projectManager', roleTitle: 'Project Manager', selected:false},
			{roleString: 'portfolioManager', roleTitle: 'Portfolio Manager', selected:false},
			{roleString: 'executive', roleTitle: 'Executive', selected:false}
		];

		$scope.credentials = {
			roles:['portfolioManager']
		};

		$scope.subuserFilter = {
			firstName: '',
			lastName: '',
			company : '',
			email : '',
			username : '',
			roles : []
		};

        // Roles filter
		$scope.hasRole = function(subuser){
            if($scope.subuserFilter.roles.length){
                var foundRole = false;
                _.forEach(subuser.roles, function(role){
                    _.forEach($scope.subuserFilter.roles, function(fRole){
                       if(role === fRole){
                           foundRole = true;
                       }
                    });
                });
                return foundRole;
            } else {
                return true;
            }
        };

        $scope.getDisplayRoleName = function (role) {
            if(role){
                return _.find($scope.roles, 'roleString', role).roleTitle;
            }
        };

		// Create new Subuser
        
        $scope.hasNoRolesCheck = function(roles){
            return _.isEmpty(roles);
        };
        
		$scope.create = function() {
			$http.post('/subusers', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				//$scope.authentication.user = response;

				// And redirect to the list of subuser

				$location.path('subusers');
			}).error(function(response) {
				$scope.error = response.message;
			});
			// Create new Subuser object
			//var subuser = new Subusers ({
			//	name: this.name
			//});
            //
			//// Redirect after save
			//subuser.$save(function(response) {
			//	$location.path('subusers/' + response._id);
            //
			//	// Clear form fields
			//	$scope.name = '';
			//}, function(errorResponse) {
			//	$scope.error = errorResponse.data.message;
			//});
		};

		// Remove existing Subuser
		$scope.remove = function(subuser) {
			if ( subuser ) { 
				subuser.$remove();

				for (var i in $scope.subusers) {
					if ($scope.subusers [i] === subuser) {
						$scope.subusers.splice(i, 1);
					}
				}
			} else {
				$scope.subuser.$remove(function() {
					$location.path('subusers');
				});
			}
		};

		// Update existing Subuser
        
        $scope.switchUserForm = {};
        
        var originalSubuser = {};
        
        $scope.editSubuser = function (subuser) {
            originalSubuser[subuser._id] = _.cloneDeep(subuser);
            $scope.switchUserForm[subuser._id] = 'edit';
        };

        $scope.cancelEditSubuser = function (subuser) {
            subuser.firstName = originalSubuser[subuser._id].firstName;
            subuser.lastName = originalSubuser[subuser._id].lastName;
            subuser.email = originalSubuser[subuser._id].email;
            subuser.title = originalSubuser[subuser._id].title;
            subuser.organization = originalSubuser[subuser._id].organization;
            subuser.roles = originalSubuser[subuser._id].roles;
            subuser.username = originalSubuser[subuser._id].username;
            subuser.password = originalSubuser[subuser._id].password;
            
            $scope.switchUserForm[subuser._id] = 'view';
        };
        
		$scope.update = function() {
			var subuser = $scope.subuser;

			subuser.$update(function(res) {
                $scope.switchUserForm[subuser._id] = 'view';
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		// Find a list of Subusers
		$scope.find = function() {
			$scope.subusers = Subusers.query();
		};

		// Find existing Subuser
		$scope.findOne = function() {
			$scope.subuser = Subusers.get({ 
				subuserId: $stateParams.subuserId
			});
		};
	}
]);

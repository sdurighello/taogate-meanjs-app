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

		// Create new Subuser
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
		$scope.update = function() {
			var subuser = $scope.subuser;

			subuser.$update(function() {
				$location.path('subusers/' + subuser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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

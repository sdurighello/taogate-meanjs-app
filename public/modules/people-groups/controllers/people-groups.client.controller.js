'use strict';

// People groups controller
angular.module('people-groups').controller('PeopleGroupsController', ['$scope', '$stateParams', '$location',
    'Authentication', 'PeopleGroups','PeopleRoles','$q','_',
	function($scope, $stateParams, $location, Authentication, PeopleGroups, PeopleRoles, $q, _) {

        // ------------- INIT -------------

        $scope.init = function(){
            PeopleRoles.query(function(roles){
                PeopleGroups.query(function(groups){
					$scope.peopleRoles = roles;
					$scope.peopleGroups = groups;
				});
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

        $scope.switchGroupForm = {};

        $scope.selectGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
            if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
            if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
        };

        $scope.switchRoleForm = {};

        $scope.selectRoleForm = function(role, string){
            if(string === 'view'){ $scope.switchRoleForm[role._id] = 'view';}
            if(string === 'edit'){$scope.switchRoleForm[role._id] = 'edit';}
        };

        // ----------------- REFRESH GROUP LIST ------------

        $scope.groupList = function(){
            PeopleGroups.query(function(groups){
                $scope.peopleGroups = groups;
            });
        };

        // ------------------ CREATE GROUP ----------------

        $scope.createGroup = function() {
			$scope.error = null;

        	var peopleGroup = new PeopleGroups ({
        		name: 'New group',
                description: 'new group description',
                type: 'project',
                roles: []
        	});

        	peopleGroup.$save(function(response) {
                $scope.groupList();
        	}, function(errorResponse) {
        		$scope.error = errorResponse.data.message;
        	});
        };

        // ------------------- EDIT GROUP -----------------

        $scope.groupTypes = ['project','portfolio','organization'];

        var originalEditGroup = {};

        $scope.selectGroup = function(group){
            originalEditGroup[group._id] = _.clone(group);
            $scope.error = null;
            $scope.selectGroupForm(group, 'edit');
        };

        $scope.updateGroup = function(group) {
            group.$update(function(response) {
                $scope.selectGroupForm(group, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditGroup = function(group){
            $scope.error = null;
            group.name = originalEditGroup[group._id].name;
            group.description = originalEditGroup[group._id].description;
            group.type = originalEditGroup[group._id].type;
            $scope.selectGroupForm(group, 'view');
        };

        // ------------------- REMOVE GROUP -----------------

        $scope.removeGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.groupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------ CREATE ROLE ----------------

        $scope.createRole = function(group) {
            $scope.error = null;

            var peopleRole = new PeopleRoles ({
                name: 'New role',
                description: 'New role description'
            });

            peopleRole.$save(function(roleRes) {
                group.roles.push(roleRes);
                group.$update(function(groupRes) {

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT ROLE -----------------

        var originalEditRole = {};

        $scope.selectEditRole = function(group, role){
            originalEditRole[role._id] = _.clone(role);
            $scope.selectRoleForm(role, 'edit');
        };

        $scope.updateRole = function(group, role) {
            PeopleRoles.update(role, function(response) {
                $scope.selectRoleForm(role, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditRole = function(role){
            $scope.error = null;
            role.name = originalEditRole[role._id].name;
            role.description = originalEditRole[role._id].description;
            $scope.selectRoleForm(role, 'view');
        };

        // ------------------- REMOVE ROLE -----------------

        $scope.removeRole = function(group, role) {
            $scope.error = null;
            PeopleRoles.query({_id:role._id}, function(res){
                var resRole = res[0];
                resRole.$remove(function(roleResp) {
                    $scope.groupList();
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });
        };

	}
]);

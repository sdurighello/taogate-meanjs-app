'use strict';

angular.module('people-project-analysis').controller('PeopleProjectAnalysisController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'Projects','PeopleProjectGroups', 'PeopleProjectRoles', 'PeopleCategories','PeopleCategoryValues', 'People', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects,
			 PeopleProjectGroups, PeopleProjectRoles, PeopleCategories, PeopleCategoryValues, People, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleProjectGroups.query(function(groups){
				$scope.groups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleProjectRoles.query(function(roles){
				$scope.roles = roles;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleCategories.query(function(categories){
				$scope.categories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleCategoryValues.query(function(categoryValues){
				$scope.categoryValues = categoryValues;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            People.query(function(people){
                $scope.people = people;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			$scope.showRoleAssignment = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchRoleForm = {};

		$scope.selectRoleForm = function(assignedRole, string){
			if(string === 'view'){$scope.switchRoleForm[assignedRole._id] = 'view';}
			if(string === 'edit'){$scope.switchRoleForm[assignedRole._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

		var originalRoleAssignment;
		$scope.selectProject = function(project){
			originalRoleAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio stakeholders',
				deepPopulateArray : [
					'portfolio',
					'stakeholders.group','stakeholders.roles.role','stakeholders.roles.categorization.category.categoryValues'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalRoleAssignment = null;
		};


		// ------------- SELECT ROLE ASSIGNMENT ---------

		$scope.selectRoleAssignment = function(assignedRole){
			originalRoleAssignment[assignedRole._id] = _.cloneDeep(assignedRole);
			$scope.selectRoleForm(assignedRole, 'edit');
		};


		// ------------- EDIT ROLE ASSIGNMENT ---------

		$scope.saveAssignedRole = function(project, assignedGroup, assignedRole){
            // Clean deepPopulate
            var copyAssignedRole = _.cloneDeep(assignedRole);
            copyAssignedRole.role = copyAssignedRole.role._id;
            copyAssignedRole.categorization = _.map(copyAssignedRole.categorization, function(assignedCategory){
                assignedCategory.category = allowNull(assignedCategory.category);
                return assignedCategory;
            });
			// url: 'projects/:projectId/stakeholders/:assignedGroupId/:assignedRoleId'
			Projects.updatePeopleAssignment(
				{
					projectId: project._id,
					assignedGroupId: assignedGroup._id,
					assignedRoleId: assignedRole._id
				},copyAssignedRole, function(res){
					$scope.selectRoleForm(assignedRole, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedRole = function(assignedRole){
			assignedRole.person = originalRoleAssignment[assignedRole._id].person;
            assignedRole.categorization = originalRoleAssignment[assignedRole._id].categorization;
			$scope.selectRoleForm(assignedRole, 'view');
		};


	}
]);

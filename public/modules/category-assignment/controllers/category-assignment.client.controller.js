'use strict';

angular.module('category-assignment').controller('CategoryAssignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'GateProcesses', 'CategoryGroups', 'Categories', 'CategoryValues', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcesses, CategoryGroups, Categories, CategoryValues, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

			Projects.query({'selection.active': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(res){
				$scope.portfolios = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            GateProcesses.query(function(res){
                $scope.gateProcesses = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			CategoryGroups.query(function(groups){
				$scope.categoryGroups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Categories.query(function(categories){
				$scope.categories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            CategoryValues.query(function(values){
                $scope.categoryValues = values;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            $scope.showCategoryValue = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){
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
        };



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

        $scope.switchCategoryForm = {};

        $scope.selectCategoryForm = function(assignedCategory, string){
            if(string === 'view'){$scope.switchCategoryForm[assignedCategory._id] = 'view';}
            if(string === 'edit'){$scope.switchCategoryForm[assignedCategory._id] = 'edit';}
        };

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

        var originalCategoryAssignment;
		$scope.selectProject = function(project){
            originalCategoryAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification categorization portfolio',
				deepPopulateArray : [
					'portfolio',
					'categorization.group','categorization.categories.category.categoryValues'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
            originalCategoryAssignment = null;
		};


        // ------------- SELECT CATEGORY ASSIGNMENT ---------

        $scope.selectCategoryAssignment = function(assignedCategory){
            originalCategoryAssignment[assignedCategory._id] = _.clone(assignedCategory);
            $scope.selectCategoryForm(assignedCategory, 'edit');
        };



        // ------------- EDIT CATEGORY ASSIGNMENT ---------

        $scope.saveAssignedCategory = function(project, assignedGroup, assignedCategory){
            Projects.updateCategoryAssignment(
                {
                    projectId: project._id,
                    assignedGroupId: assignedGroup._id,
                    assignedCategoryId: assignedCategory._id
                },{valueId: assignedCategory.categoryValue}, function(res){
                    $scope.error = null;
                    $scope.selectCategoryForm(assignedCategory, 'view');
                }, function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditAssignedCategory = function(assignedCategory){
            $scope.error = null;
            assignedCategory.categoryValue = originalCategoryAssignment[assignedCategory._id].categoryValue;
            $scope.selectCategoryForm(assignedCategory, 'view');
        };


	}
]);

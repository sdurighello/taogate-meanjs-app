'use strict';

angular.module('category-assignment').controller('CategoryAssignmentController', ['$scope','$stateParams', '$location', 'Authentication',
	'Projects','CategoryGroups', 'Categories', 'CategoryValues', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, CategoryGroups, Categories, CategoryValues, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query(function(projects){
				$scope.projects = projects;
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


		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			$scope.userHasAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo';
			});
		});



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
			Projects.get({projectId:project._id}, function(res){
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
                    assignedCategoryId: assignedCategory._id,
                    valueId: assignedCategory.categoryValue
                },{}, function(res){
                    $scope.selectCategoryForm(assignedCategory, 'view');
                }, function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditAssignedCategory = function(assignedCategory){
            assignedCategory.categoryValue = originalCategoryAssignment[assignedCategory._id].categoryValue;
            $scope.selectCategoryForm(assignedCategory, 'view');
        };


	}
]);

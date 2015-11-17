'use strict';

angular.module('category-setup').controller('CategorySetupController', ['$scope', '$stateParams', '$location', 'Authentication',
	'CategoryGroups','Categories','CategoryValues','$q','_',
	function($scope, $stateParams, $location, Authentication, CategoryGroups, Categories, CategoryValues, $q, _) {

		// ------------- INIT -------------

		$scope.init = function(){
			CategoryGroups.query(function(groups){
				$scope.categoryGroups = groups;
			});
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

		// ------------------- NG-SWITCH ---------------------

		$scope.switchCategoryGroupForm = {};

		$scope.selectCategoryGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchCategoryGroupForm[group._id] = 'view';}
			if(string === 'edit'){$scope.switchCategoryGroupForm[group._id] = 'edit';}
		};

		$scope.switchCategoryForm = {};

		$scope.selectCategoryForm = function(category, string){
			if(string === 'view'){ $scope.switchCategoryForm[category._id] = 'view';}
			if(string === 'new'){$scope.switchCategoryForm[category._id] = 'new';}
			if(string === 'edit'){$scope.switchCategoryForm[category._id] = 'edit';}
		};

		$scope.switchCategoryValueForm = {};

		$scope.selectCategoryValueForm = function(categoryValue, string){
			if(string === 'view'){ $scope.switchCategoryValueForm[categoryValue._id] = 'view';}
			if(string === 'edit'){$scope.switchCategoryValueForm[categoryValue._id] = 'edit';}
		};

		// ----------------- REFRESH CATEGORY GROUPS LIST ------------

		$scope.categoryGroupList = function(){
			CategoryGroups.query(function(categoryGroups){
				$scope.categoryGroups = categoryGroups;
			});
		};


		// ------------------ CREATE CATEGORY GROUP ----------------

		$scope.createCategoryGroup = function() {
			$scope.error = null;

			var categoryGroup = new CategoryGroups ({
				name: 'New category group',
				categories: []
			});

			categoryGroup.$save(function(response) {
				$scope.categoryGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------ CREATE CATEGORY ----------------

		$scope.createCategory = function(group) {
            var category = new Categories ({
                name: 'New category',
                categoryValues: []
            });
            category.$save({groupId: group._id}, function(res) {
                // Add new category to the view group
                group.categories.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};

		// ------------------- EDIT CATEGORY GROUP (HEADER ONLY) -----------------

		var originalEditCategoryGroup = {};

		$scope.selectCategoryGroup = function(categoryGroup){
			originalEditCategoryGroup = _.clone(categoryGroup);
			$scope.selectedCategoryGroup = categoryGroup;
		};

		$scope.updateCategoryGroup = function(group) {
			CategoryGroups.update({
				_id: group._id,
				name: group.name,
				description: group.description
			}, function(group){
				$scope.selectCategoryGroupForm(group, 'view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditCategoryGroup = function(group){
			$scope.error = null;
			$scope.selectedCategoryGroup.name = originalEditCategoryGroup.name;
			$scope.selectedCategoryGroup.description = originalEditCategoryGroup.description;
			$scope.selectCategoryGroupForm(group, 'view');
		};

		// ------------------- EDIT CATEGORY (HEADER ONLY) -----------------

		var originalEditCategory = {};

		$scope.selectCategory = function(category){
			originalEditCategory[category._id] = _.clone(category);
			$scope.error = null;
			$scope.selectCategoryForm(category, 'edit');
		};

		$scope.updateCategory = function(category) {
			Categories.update({
				_id: category._id,
				name: category.name,
				description: category.description
			}, function(category){
				$scope.selectCategoryForm(category, 'view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditCategory = function(category){
			$scope.error = null;
			category.name = originalEditCategory[category._id].name;
			category.description = originalEditCategory[category._id].description;
			$scope.selectCategoryForm(category, 'view');
		};


		// ------------------- REMOVE CATEGORY GROUP -----------------

		$scope.removeCategoryGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.selectedCategoryGroup = null;
				$scope.categoryGroupList();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------- REMOVE CATEGORY -----------------

        $scope.removeCategory = function(group, category) {
            $scope.error = null;

            Categories.remove({groupId: group._id},category, function(res){
                group.categories = _.without(group.categories, category);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


		// ------------------ CREATE CATEGORY VALUE ----------------

		$scope.createCategoryValue = function(category) {
			$scope.error = null;

			var categoryValue = new CategoryValues ({
				name: 'New category value',
				description: 'New category value description'
			});

			categoryValue.$save({categoryId: category._id}, function(categoryValueRes) {
				// Add values to the view category
				category.categoryValues.push(categoryValueRes);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT CATEGORY VALUE -----------------

		var originalEditCategoryValue = {};

		$scope.selectEditCategoryValue = function(category, categoryValue){
			originalEditCategoryValue[categoryValue._id] = _.clone(categoryValue);
			$scope.selectCategoryValueForm(categoryValue, 'edit');
		};

		$scope.updateCategoryValue = function(category, categoryValue) {
			CategoryValues.update(categoryValue, function(response) {
				$scope.selectCategoryValueForm(categoryValue, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditCategoryValue = function(categoryValue){
			$scope.error = null;
			categoryValue.name = originalEditCategoryValue[categoryValue._id].name;
			categoryValue.description = originalEditCategoryValue[categoryValue._id].description;
			$scope.selectCategoryValueForm(categoryValue, 'view');
		};

		// ------------------- REMOVE CATEGORY VALUE -----------------

		$scope.removeCategoryValue = function(category, categoryValue) {
			$scope.error = null;
			CategoryValues.remove({categoryId: category._id},categoryValue, function(value){
				category.categoryValues = _.without(category.categoryValues, categoryValue);
			}, function(err){
				$scope.error = err.data.message;
			});
		};
	}
]);

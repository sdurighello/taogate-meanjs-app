'use strict';

angular.module('people-setup').controller('PeopleSetupController', ['$rootScope', '$scope', '$stateParams', '$location',
	'Authentication','People', 'PeoplePortfolioGroups', 'PeopleProjectGroups',
    'PeopleCategories', 'PeopleCategoryValues', '$q','_',
	function($rootScope, $scope, $stateParams, $location, Authentication, People, PeoplePortfolioGroups, PeopleProjectGroups,
             PeopleCategories, PeopleCategoryValues, $q, _) {


        $rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

            PeoplePortfolioGroups.query(function(portfolioGroups){
                $scope.peoplePortfolioGroups = portfolioGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            PeopleProjectGroups.query(function(projectGroups){
                $scope.peopleProjectGroups = projectGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            People.query(function(people){
                $scope.people = people;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            PeopleCategories.query(function(peopleCategories){
                $scope.peopleCategories = peopleCategories;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            PeopleCategoryValues.query(function(peopleCategoryValues){
                $scope.peopleCategoryValues = peopleCategoryValues;
            }, function(err){
                $scope.initError.push(err.data.message);
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


// ------------------------------------------------------  PEOPLE ---------------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.selectPersonForm = function(string){
			if(string === 'view'){$scope.switchPersonForm = 'view';}
			if(string === 'edit'){$scope.switchPersonForm = 'edit';}
		};

		// ------------------- LIST OF PEOPLE -----------------

		$scope.findPeople = function() {
            $scope.initError = [];
            People.query(function(people){
				$scope.people = people;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

        var originalPerson = {};
		$scope.selectPerson = function(person){
            $scope.error = null;
            $scope.selectPersonForm('view');
            $scope.person = person;
            originalPerson = _.clone(person);
		};

		$scope.updatePerson = function(person) {
            $scope.error = null;
			person.$update(function(response) {
				$scope.findPeople();
				$scope.selectPersonForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPerson = function(person){
			person.name = originalPerson.name;
            person.organization = originalPerson.organization;
            person.title = originalPerson.title;
            person.email = originalPerson.email;
            person.phone = originalPerson.phone;
			$scope.selectPersonForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removePerson = function(person) {
			person.$remove(function(response) {
                $scope.people = _.without($scope.people, person);
                $scope.person = null;
                $scope.selectPersonForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createPerson = function() {
			var person = new People ({
				name: 'New person',
                organization: '',
				title: '',
				email: '',
				phone: ''
			});
			person.$save(function(response) {
				$scope.people.push(response);
                $scope.selectPerson(response);
                $scope.selectPersonForm('edit');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};






// ------------------------------------------------------ PROJECT GROUPS --------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectGroupForm = {};

		$scope.selectProjectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchProjectGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchProjectGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchProjectGroupForm[group._id] = 'edit';}
		};

		// ----------------- REFRESH GROUP LIST ------------

		$scope.projectGroupList = function(){
            $scope.initError = [];
            PeopleProjectGroups.query(function(groups){
				$scope.peopleProjectGroups = groups;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE GROUP ----------------

		$scope.createProjectGroup = function() {
			$scope.error = null;

			var peopleProjectGroup = new PeopleProjectGroups ({
				name: 'New project stakeholder group',
				description: ''
			});

			peopleProjectGroup.$save(function(response) {
				$scope.projectGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditProjectGroup = {};

		$scope.selectProjectGroup = function(group){
			originalEditProjectGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectProjectGroupForm(group, 'edit');
		};

		$scope.updateProjectGroup = function(group) {
			group.$update(function(response) {
				$scope.selectProjectGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditProjectGroup = function(group){
			$scope.error = null;
			group.name = originalEditProjectGroup[group._id].name;
			group.description = originalEditProjectGroup[group._id].description;
			$scope.selectProjectGroupForm(group, 'view');
		};

		// ------------------- REMOVE GROUP -----------------

		$scope.removeProjectGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.projectGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};






// ------------------------------------------------------ PORTFOLIO GROUPS --------------------------------------






        // ------------------- NG-SWITCH ---------------------

        $scope.switchPortfolioGroupForm = {};

        $scope.selectPortfolioGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchPortfolioGroupForm[group._id] = 'view';}
            if(string === 'new'){$scope.switchPortfolioGroupForm[group._id] = 'new';}
            if(string === 'edit'){$scope.switchPortfolioGroupForm[group._id] = 'edit';}
        };

        // ----------------- REFRESH GROUP LIST ------------

        $scope.portfolioGroupList = function(){
            $scope.initError = [];
            PeoplePortfolioGroups.query(function(groups){
                $scope.peoplePortfolioGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------ CREATE GROUP ----------------

        $scope.createPortfolioGroup = function() {
            $scope.error = null;

            var peoplePortfolioGroup = new PeoplePortfolioGroups ({
                name: 'New portfolio stakeholder group',
                description: ''
            });

            peoplePortfolioGroup.$save(function(response) {
                $scope.portfolioGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT GROUP -----------------

        var originalEditPortfolioGroup = {};

        $scope.selectPortfolioGroup = function(group){
            originalEditPortfolioGroup[group._id] = _.clone(group);
            $scope.error = null;
            $scope.selectPortfolioGroupForm(group, 'edit');
        };

        $scope.updatePortfolioGroup = function(group) {
            group.$update(function(response) {
                $scope.selectPortfolioGroupForm(group, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditPortfolioGroup = function(group){
            $scope.error = null;
            group.name = originalEditPortfolioGroup[group._id].name;
            group.description = originalEditPortfolioGroup[group._id].description;
            $scope.selectPortfolioGroupForm(group, 'view');
        };

        // ------------------- REMOVE GROUP -----------------

        $scope.removePortfolioGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.portfolioGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



// ------------------------------------------------------ STAKEHOLDER CATEGORIES --------------------------------------




        // ------------------- NG-SWITCH ---------------------

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


        // ------------------ CREATE CATEGORY ----------------

        $scope.createCategory = function() {
            $scope.error = null;

            var category = new PeopleCategories ({
                name: 'New stakeholder category',
                categoryValues: []
            });

            category.$save(function(res) {
                $scope.peopleCategories.push(res);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT CATEGORY (HEADER ONLY) -----------------

        var originalEditCategory = {};

        $scope.selectCategory = function(category){
            originalEditCategory[category._id] = _.clone(category);
            $scope.error = null;
            $scope.selectCategoryForm(category, 'edit');
        };

        $scope.updateCategory = function(category) {
            PeopleCategories.update({
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


        // ------------------- REMOVE CATEGORY -----------------

        $scope.removeCategory = function(category) {
            $scope.error = null;

            PeopleCategories.remove({},category, function(res){
                $scope.peopleCategories = _.without($scope.peopleCategories, category);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // ------------------ CREATE CATEGORY VALUE ----------------

        $scope.createCategoryValue = function(category) {
            $scope.error = null;

            var categoryValue = new PeopleCategoryValues ({
                name: 'New stakeholder category value'
            });

            categoryValue.$save({categoryId: category._id}, function(res) {
                // Add new cat value to the view category
                category.categoryValues.push(res);
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
            PeopleCategoryValues.update(categoryValue, function(response) {
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
            PeopleCategoryValues.remove({categoryId: category._id}, categoryValue, function(res){
                category.categoryValues = _.without(category.categoryValues, categoryValue);
            }, function(err){
                $scope.error = err.data.message;
            });
        };



	}
]);

'use strict';

angular.module('people-portfolio-analysis').controller('PeoplePortfolioAnalysisController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','PeoplePortfolioGroups', 'PeopleCategories','PeopleCategoryValues', 'People', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios,
			 PeoplePortfolioGroups, PeopleCategories, PeopleCategoryValues, People, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeoplePortfolioGroups.query(function(groups){
				$scope.groups = groups;
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

        $scope.userHasAuthorization = function(action, userData, portfolio){

            // Guard against undefined at view startup
            if(action && userData && portfolio){

                var userIsSuperhero, userIsPortfolioManager, userIsBackupPortfolioManager;

                if(action === 'edit'){

                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });

                    if(portfolio.portfolioManager){
                        userIsPortfolioManager = userData._id === portfolio.portfolioManager._id;
                    }

                    if(portfolio.backupPortfolioManager){
                        userIsBackupPortfolioManager = userData._id === portfolio.backupPortfolioManager._id;
                    }

                    return userIsSuperhero || userIsPortfolioManager || userIsBackupPortfolioManager;
                }
            }
        };


        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };



        // ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioForm = {};

		$scope.selectPortfolioForm = function(string){
			if(string === 'default'){ $scope.switchPortfolioForm = 'default';}
			if(string === 'new'){$scope.switchPortfolioForm = 'new';}
			if(string === 'view'){ $scope.switchPortfolioForm = 'view';}
			if(string === 'edit'){$scope.switchPortfolioForm = 'edit';}
		};

		$scope.switchRoleForm = {};

		$scope.selectRoleForm = function(assignedRole, string){
			if(string === 'view'){$scope.switchRoleForm[assignedRole._id] = 'view';}
			if(string === 'edit'){$scope.switchRoleForm[assignedRole._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalRoleAssignment;
		$scope.selectPortfolio = function(portfolio){
			originalRoleAssignment = {};
			// Get the full portfolio fat object from the "portfolioById" server function that populates everything
			Portfolios.get({
				portfolioId:portfolio._id,
				retPropertiesString : 'user created name parent ancestors type portfolioManager backupPortfolioManager stakeholders',
				deepPopulateArray : [
					'parent','type','portfolioManager','backupPortfolioManager',
                    'stakeholders.group','stakeholders.roles.categorization.category.categoryValues'
				]
			}, function(res){
				$scope.selectedPortfolio = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewPortfolio = function(){
			$scope.selectedPortfolio = null;
			originalRoleAssignment = null;
		};


        // ------------- CREATE ROLE ASSIGNMENT ---------

        $scope.createAssignedRole = function(portfolio, assignedGroup){

            Portfolios.createAssignedRole({
                portfolioId: portfolio._id,
                assignedGroupId: assignedGroup._id
            },{}, function(res){
                assignedGroup.roles.push(res);
            }, function(err){
                $scope.error = err.data.message;
            });
        };
        

		// ------------- SELECT ROLE ASSIGNMENT ---------

		$scope.selectRoleAssignment = function(assignedRole){
			originalRoleAssignment[assignedRole._id] = _.cloneDeep(assignedRole);
			$scope.selectRoleForm(assignedRole, 'edit');
		};


		// ------------- EDIT ROLE ASSIGNMENT ---------

		$scope.saveEditAssignedRole = function(portfolio, assignedGroup, assignedRole){
			// Clean deepPopulate
			var copyAssignedRole = _.cloneDeep(assignedRole);
			copyAssignedRole.role = copyAssignedRole.role._id;
			copyAssignedRole.categorization = _.map(copyAssignedRole.categorization, function(assignedCategory){
				assignedCategory.category = allowNull(assignedCategory.category);
				return assignedCategory;
			});
			// url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/:assignedRoleId'
			Portfolios.updateAssignedRole(
				{
					portfolioId: portfolio._id,
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
            assignedRole.role = originalRoleAssignment[assignedRole._id].role;
			assignedRole.person = originalRoleAssignment[assignedRole._id].person;
			assignedRole.categorization = originalRoleAssignment[assignedRole._id].categorization;
			$scope.selectRoleForm(assignedRole, 'view');
		};


        // ------------- DELETE ROLE ASSIGNMENT ---------

        $scope.deleteAssignedRole = function(portfolio, assignedGroup, assignedRole){

            Portfolios.deleteAssignedRole({
                portfolioId: portfolio._id,
                assignedGroupId: assignedGroup._id,
                assignedRoleId: assignedRole._id
            }, assignedRole, function(res){
                assignedGroup.roles = _.without(assignedGroup.roles, assignedRole);
            }, function(err){
                $scope.error = err.data.message;
            });
        };

	}
]);

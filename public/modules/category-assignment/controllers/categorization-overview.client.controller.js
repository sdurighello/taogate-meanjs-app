'use strict';

// Definition dashboards controller
angular.module('category-assignment').controller('CategorizationOverviewController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'CategoryAssignment','CategoryGroups', 'Categories', 'Portfolios', '_','$q', '$sce',
	function($rootScope, $scope, $stateParams, $location, Authentication, CategoryAssignment, CategoryGroups, Categories, Portfolios, _, $q, $sce) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		$scope.typeOfChart = 'number';

		var projectCategorization = [];

		$scope.init = function(){

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			CategoryGroups.query(function(categoryGroups){
				$scope.categoryGroups = categoryGroups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Categories.query(function(res){
				$scope.categories = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			CategoryAssignment.categorizationOverview(function(res){
				projectCategorization = res;
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



		// ------- CATEGORIZATION DASHBOARD ------

        $scope.tooltipView = 'error';
		$scope.createTooltipView = function(projects){
            var stringArray = _.map(projects, function(project){
                return $sce.trustAsHtml('<a>'+project.identification.name+'</a><hr style="margin: 0.1%">');
            });
            $scope.tooltipView = stringArray.join('');// join as an empty string for between strings, override default ','
		};

		$scope.orderTable = 'countCategoryValue';

		$scope.selectPortfolio = function(portfolio){
			if(portfolio === 'all'){
				$scope.selectedPortfolio = {name : 'All'};
				$scope.projectCategorizationView = _.filter(projectCategorization, function(item){
					return item.all === true;
				});
				return;
			}
			if(portfolio === 'unassigned'){
				$scope.selectedPortfolio = {name : 'Unassigned'};
				$scope.projectCategorizationView = _.filter(projectCategorization, function(item){
					return (item.all === false) && (!item.portfolio);
				});
				return;
			}
			$scope.selectedPortfolio = portfolio;
			$scope.projectCategorizationView = _.filter(projectCategorization, function(item){
				return (item.portfolio) && (item.portfolio === portfolio._id);
			});
		};



	}
]);

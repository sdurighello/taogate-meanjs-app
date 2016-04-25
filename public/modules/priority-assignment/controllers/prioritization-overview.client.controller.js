'use strict';

// Definition dashboards controller
angular.module('priority-assignment').controller('PrioritizationOverviewController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'PriorityAssignment','PriorityGroups', 'Priorities', 'PriorityValues', 'Portfolios', 'StrategyNodes', '_','$q', '$sce',
	function($rootScope, $scope, $stateParams, $location, Authentication, PriorityAssignment, PriorityGroups, Priorities, PriorityValues, Portfolios, StrategyNodes, _, $q, $sce) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		$scope.typeOfChart = 'number';

		var projectPrioritizationPortfolio = [];
        var projectPrioritizationStrategy = [];

		$scope.init = function(){

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

            StrategyNodes.query(function(res){
                $scope.strategyNodes = res;
                $scope.strategyTrees = createNodeTrees(res);
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

			PriorityGroups.query(function(res){
				$scope.priorityGroups = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Priorities.query(function(res){
				$scope.priorities = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityValues.query(function(res){
				$scope.priorityValues = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityAssignment.prioritizationOverviewPortfolio(function(res){
				projectPrioritizationPortfolio = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            PriorityAssignment.prioritizationOverviewStrategy(function(res){
                projectPrioritizationStrategy = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });


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



            // ------- PRIORITIZATION DASHBOARD ------

		$scope.tooltipView = 'error';
		$scope.createTooltipView = function(projects){
			var stringArray = _.map(projects, function(project){
				return $sce.trustAsHtml('<div>'+project.identification.name+'</div><hr style="margin: 0.2%">');
			});
			$scope.tooltipView = stringArray.join('');// join as an empty string for between strings, override default ','
		};

		$scope.orderTable = 'countPriorityValue';

		$scope.selectPortfolio = function(portfolio){
			if(portfolio === 'all'){
				$scope.selectedPortfolio = {name : 'All'};
				$scope.projectPrioritizationPortfolioView = _.filter(projectPrioritizationPortfolio, function(item){
					return item.all === true;
				});
				return;
			}
			if(portfolio === 'unassigned'){
				$scope.selectedPortfolio = {name : 'Unassigned'};
				$scope.projectPrioritizationPortfolioView = _.filter(projectPrioritizationPortfolio, function(item){
					return (item.all === false) && (!item.portfolio);
				});
				return;
			}
			$scope.selectedPortfolio = portfolio;
			$scope.projectPrioritizationPortfolioView = _.filter(projectPrioritizationPortfolio, function(item){
				return (item.portfolio) && (item.portfolio === portfolio._id);
			});
		};

        $scope.selectStrategyNode = function(strategyNode){
            if(strategyNode === 'all'){
                $scope.selectedStrategyNode = {name : 'All'};
                $scope.projectPrioritizationStrategyView = _.filter(projectPrioritizationStrategy, function(item){
                    return item.all === true;
                });
                return;
            }
            if(strategyNode === 'unassigned'){
                $scope.selectedStrategyNode = {name : 'Unassigned'};
                $scope.projectPrioritizationStrategyView = _.filter(projectPrioritizationStrategy, function(item){
                    return (item.all === false) && (!item.parent);
                });
                return;
            }
            $scope.selectedStrategyNode = strategyNode;
            $scope.projectPrioritizationStrategyView = _.filter(projectPrioritizationStrategy, function(item){
                return (item.parent) && (item.parent === strategyNode._id);
            });
        };



	}
]);

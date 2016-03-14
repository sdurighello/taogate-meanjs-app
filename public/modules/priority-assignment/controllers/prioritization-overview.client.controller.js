'use strict';

// Definition dashboards controller
angular.module('priority-assignment').controller('PrioritizationOverviewController', ['$scope', '$stateParams', '$location', 'Authentication',
	'PriorityAssignment','PriorityGroups', 'Priorities', 'PriorityValues', 'Portfolios', '_','$q', '$sce',
	function($scope, $stateParams, $location, Authentication, PriorityAssignment, PriorityGroups, Priorities, PriorityValues, Portfolios, _, $q, $sce) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		$scope.typeOfChart = 'number';

		var projectPrioritization = [];

		$scope.init = function(){

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
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

			PriorityAssignment.prioritizationOverview(function(res){
				projectPrioritization = res;
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
				$scope.projectPrioritizationView = _.filter(projectPrioritization, function(item){
					return item.all === true;
				});
				return;
			}
			if(portfolio === 'unassigned'){
				$scope.selectedPortfolio = {name : 'Unassigned'};
				$scope.projectPrioritizationView = _.filter(projectPrioritization, function(item){
					return (item.all === false) && (!item.portfolio);
				});
				return;
			}
			$scope.selectedPortfolio = portfolio;
			$scope.projectPrioritizationView = _.filter(projectPrioritization, function(item){
				return (item.portfolio) && (item.portfolio === portfolio._id);
			});
		};



	}
]);

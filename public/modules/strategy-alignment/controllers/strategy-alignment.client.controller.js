'use strict';

angular.module('strategy-alignment').controller('StrategyAlignmentController', ['$scope','$stateParams', '$location', 'Authentication',
	'StrategyNodes','Projects', '_','$q',
	function($scope, $stateParams, $location, Authentication, StrategyNodes, Projects, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $q.all([
                StrategyNodes.query().$promise,
                Projects.query().$promise
            ]).then(function(data) {
                var strategyNodes = data[0];
                var projects = data[1];

                $scope.strategyNodes = strategyNodes;
                $scope.strategyTrees = createNodeTrees(strategyNodes);
                $scope.projects = projects;

                $scope.selectedAssignments = {};
                $scope.selectedAssignments.assignedProjects = {};
                $scope.selectedAssignments.unassignedProjects = [];
                createProjectAssignments(projects, strategyNodes, $scope.selectedAssignments);
            });

		};

		var createProjectAssignments = function(projects, strategyNodes, selectedAssignments){
			_.map(projects, function(project){
				if(_.isNull(project.parent) || _.isUndefined(project.parent)){
                    selectedAssignments.unassignedProjects.push(project);
				} else {
					_.forEach(strategyNodes, function(node){
                        selectedAssignments.assignedProjects[node._id].push(project);
					});
				}
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



		// ------------- PROJECTS FOR NODE ------------

		$scope.selectNode = function(node){
			$scope.selectedNode = node;
		};







	}
]);

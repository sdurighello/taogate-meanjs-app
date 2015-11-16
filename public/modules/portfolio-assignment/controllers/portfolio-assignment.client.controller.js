'use strict';

angular.module('portfolio-assignment').controller('PortfolioAssignmentController', ['$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', '_','$q',
	function($scope, $stateParams, $location, Authentication, Portfolios, Projects, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$q.all([
				Portfolios.query().$promise,
				Projects.query().$promise
			]).then(function(data) {
				var portfolios = data[0];
				var projects = data[1];

				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
				$scope.projects = projects;

				$scope.selectedAssignments = {};
				$scope.selectedAssignments.assignedProjects = {};
				$scope.selectedAssignments.unassignedProjects = [];
				createProjectAssignments(projects, portfolios, $scope.selectedAssignments);
			});

		};

		var createProjectAssignments = function(projects, portfolios, selectedAssignments){
			_.forEach(portfolios, function(node){
				selectedAssignments.assignedProjects[node._id] = [];
			});
			_.map(projects, function(project){
				if(_.isNull(project.portfolio) || _.isUndefined(project.portfolio)){
					selectedAssignments.unassignedProjects.push(project);
				} else {
					_.forEach(portfolios, function(node){
						if(project.portfolio === node._id){selectedAssignments.assignedProjects[node._id].push(project);}
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



		// ------------------- PROJECTS FOR NODE ------------

		$scope.selectNode = function(node){
			$scope.selectedNode = node;
		};


		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
			itemMoved: function (eventObj) {
				var node = $scope.selectedNode;
				var assignedProjects = $scope.selectedAssignments.assignedProjects[$scope.selectedNode._id];
				var unassignedProjects = $scope.selectedAssignments.unassignedProjects;
				// Ensure all "portfolio" properties of projects assigned to node are set to node._id
				for (var i=0; i<assignedProjects.length; i++){
					var aProject = assignedProjects[i];
					if (aProject.portfolio !== node._id){
						aProject.portfolio = node._id;
						Projects.update(aProject);
					}

				}
				// Ensure all unassigned projects have portfolio set to null
				for (var j=0; j<unassignedProjects.length; j++){
					var uProject = unassignedProjects[j];
					if (uProject.portfolio !== null){
						uProject.portfolio = null;
						Projects.update(uProject);
					}

				}
			}
		};


	}
]);

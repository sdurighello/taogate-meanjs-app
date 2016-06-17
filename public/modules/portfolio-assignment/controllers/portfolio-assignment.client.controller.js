'use strict';

angular.module('portfolio-assignment').controller('PortfolioAssignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios, Projects, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

			$q.all([
				Portfolios.query().$promise,
				Projects.query({'selection.active': true}).$promise
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
						if(project.portfolio._id === node._id){selectedAssignments.assignedProjects[node._id].push(project);}
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
				return role === 'superAdmin' || role === 'admin' || role === 'pmo' || role === 'portfolioManager';
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
            $scope.error = null;
			$scope.selectedNode = node;
		};

        $scope.getTotalEarmarkedFunds = function(projects){
            return _.reduce(projects, function(sum, project){
                return sum + project.identification.earmarkedFunds;
            },0);
        };

		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListenersAssigned = {
			itemMoved: function (eventObj) {
                var movedProjectFromAssigned = eventObj.source.itemScope.project;
                var originalPortfolio = movedProjectFromAssigned.portfolio;
                movedProjectFromAssigned.portfolio = null;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updatePortfolioAssignment(movedProjectFromAssigned,
                    function(res){
                        $scope.isResolving = false;
                    },
                    function(err){
                        $scope.isResolving = false;
                        $scope.error = err.data.message;
                        // put back project in case of failure
                         movedProjectFromAssigned.portfolio = originalPortfolio;
                        eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                        eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromAssigned);
                    }
                );
			}
		};

        $scope.dragControlListenersUnassigned = {
            itemMoved: function (eventObj) {
                var movedProjectFromUnassigned = eventObj.source.itemScope.project;
                movedProjectFromUnassigned.portfolio = $scope.selectedNode;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updatePortfolioAssignment(movedProjectFromUnassigned,
                    function(res){
                        $scope.isResolving = false;
                    },
                    function(err){
                        $scope.isResolving = false;
                        $scope.error = err.data.message;
                        // put back project in case of failure
                        movedProjectFromUnassigned.portfolio = null;
                        eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                        eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromUnassigned);
                    }
                );
            }
        };


	}
]);

'use strict';

angular.module('portfolio-ranking-assignment').controller('PortfolioRankingAssignmentController', ['$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', 'PortfolioRankings', '_','$q',
	function($scope, $stateParams, $location, Authentication, Portfolios, Projects, PortfolioRankings, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
                $scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            PortfolioRankings.query(function(portfolioRankings){
                $scope.portfolioRankings = portfolioRankings;
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



		// ------------------- PROJECTS FOR NODE ------------

		$scope.selectNode = function(node){
			$scope.selectedNode = node;
            PortfolioRankings.get({portfolioId: node._id}, function(res){
                $scope.assignedProjects = res.projects;
                $scope.unassignedProjects = [];
                _.forEach($scope.projects, function(project){
                    //Check if project belongs to ranking portfolio
                    if(project.portfolio === node._id){
                        // Check if the project has been already added to the ranking, if not then push it in the unassigned
                        if(!_.find(res.projects,'_id', project._id)){
                            $scope.unassignedProjects.push({
                                _id: project._id,
                                idNumber : project.identification.idNumber,
                                name: project.identification.name
                            });
                        }
                    }

                });
            });
		};


		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
			itemMoved: function (eventObj) {
				//var node = $scope.selectedNode;
				//var assignedProjects = $scope.selectedAssignments.assignedProjects[$scope.selectedNode._id];
				//var unassignedProjects = $scope.selectedAssignments.unassignedProjects;
				//// Ensure all "portfolio" properties of projects assigned to node are set to node._id
				//for (var i=0; i<assignedProjects.length; i++){
				//	var aProject = assignedProjects[i];
				//	if (aProject.portfolio !== node._id){
				//		aProject.portfolio = node._id;
				//		Projects.update(aProject);
				//	}
                //
				//}
				//// Ensure all unassigned projects have portfolio set to null
				//for (var j=0; j<unassignedProjects.length; j++){
				//	var uProject = unassignedProjects[j];
				//	if (uProject.portfolio !== null){
				//		uProject.portfolio = null;
				//		Projects.update(uProject);
				//	}
                //
				//}
			}
		};


	}
]);

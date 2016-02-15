'use strict';

angular.module('portfolio-ranking-assignment').controller('PortfolioRankingAssignmentController', ['$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', 'PortfolioRankings', 'OverallRankings', '_','$q',
	function($scope, $stateParams, $location, Authentication, Portfolios, Projects, PortfolioRankings, OverallRankings, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query({'selection.selectedForPrioritization': true}, function(projects){
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

            OverallRankings.query(function(res){
                $scope.overallRankings = res;
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

        var selectedPortfolioRanking = {};
        $scope.selectedAssignment = {};
        var overallSelected = false; // Required for the drag and drop listeners
		$scope.selectNode = function(node){
            if(node === 'overall'){
                $scope.error = null;
                $scope.selectedNode = {name : 'Overall'};
                overallSelected = true;
                OverallRankings.query(function(res){
                    selectedPortfolioRanking = res[0]; // Returns an array with one object
                    $scope.selectedAssignment.assignedProjects = _.map(res[0].projects, function(project){
                        return {
                            _id: project._id,
                            idNumber: project.identification.idNumber,
                            name: project.identification.name
                        };
                    });
                    $scope.selectedAssignment.unassignedProjects = [];
                    _.forEach($scope.projects, function(project){
                        // Check if the project has been already added to the ranking, if not then push it in the unassigned
                        if(!_.find(res[0].projects,'_id', project._id)){
                            $scope.selectedAssignment.unassignedProjects.push({
                                _id: project._id,
                                idNumber : project.identification.idNumber,
                                name: project.identification.name
                            });
                        }
                    });
                });
            } else {
                $scope.error = null;
                $scope.selectedNode = node;
                overallSelected = false;
                PortfolioRankings.get({
                    portfolioId: node._id,
                    retPropertiesString : 'user created selection identification portfolio',
                    deepPopulateArray : [
                        'portfolio',
                        'identification.projectManager','identification.backupProjectManager'
                    ]
                }, function(res){
                    selectedPortfolioRanking = res;
                    $scope.selectedAssignment.assignedProjects = _.map(res.projects, function(project){
                        return {
                            _id: project._id,
                            idNumber: project.identification.idNumber,
                            name: project.identification.name
                        };
                    });
                    $scope.selectedAssignment.unassignedProjects = [];
                    _.forEach($scope.projects, function(project){
                        //Check if project belongs to ranking portfolio
                        if(project.portfolio === node._id){
                            // Check if the project has been already added to the ranking, if not then push it in the unassigned
                            if(!_.find(res.projects,'_id', project._id)){
                                $scope.selectedAssignment.unassignedProjects.push({
                                    _id: project._id,
                                    idNumber : project.identification.idNumber,
                                    name: project.identification.name
                                });
                            }
                        }

                    });
                });
            }
		};


		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
            // Check for user authorization or if project selected for prioritization/active
            accept: function (sourceItemHandleScope, destSortableScope) {
                if($scope.userHasAuthorization){ return true; }
            },
            // Just save the all "projects" array property to the object on the server every time there is a change
			itemMoved: function (eventObj) {
                if(eventObj){
                    // Clean up the "assignedProjects" array from the deep populate and get only IDs
                    var cleanProjectsArray = _.map($scope.selectedAssignment.assignedProjects, function(project){
                        return project._id;
                    });
                    // Save the new "projects" array to the server
                    if(overallSelected){
                        OverallRankings.update({overallRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){

                        }, function(err){
                            $scope.error = err.data.message;
                        });
                    } else {
                        PortfolioRankings.update({portfolioRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){

                        }, function(err){
                            $scope.error = err.data.message;
                        });
                    }
                }
			},
            orderChanged: function(eventObj) {
                if(eventObj){
                    // Clean up the "assignedProjects" array from the deep populate and get only IDs
                    var cleanProjectsArray = _.map($scope.selectedAssignment.assignedProjects, function(project){
                        return project._id;
                    });
                    // Save the new "projects" array to the server
                    if(overallSelected){
                        OverallRankings.update({overallRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){

                        }, function(err){
                            $scope.error = err.data.message;
                        });
                    } else {
                        PortfolioRankings.update({portfolioRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){

                        }, function(err){
                            $scope.error = err.data.message;
                        });
                    }
                }
            }
		};


	}
]);

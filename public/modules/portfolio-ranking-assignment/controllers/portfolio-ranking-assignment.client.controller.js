'use strict';

angular.module('portfolio-ranking-assignment').controller('PortfolioRankingAssignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', 'PortfolioRankings', 'OverallRankings', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios, Projects, PortfolioRankings, OverallRankings, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForPrioritization': true}, function(projects){
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

        // ------------------- AUTHORIZATION FUNCTION -------

        var userHasAuthorization = false;

        var getAuthorization = function(portfolio, userData){
            var isPortfolioManager, isBackupPortfolioManager, isSuperhero;
            if(portfolio.portfolioManager){
                isPortfolioManager = portfolio.portfolioManager === userData._id;
            }
            if(portfolio.backupPortfolioManager){
                isBackupPortfolioManager = portfolio.backupPortfolioManager === userData._id;
            }
            isSuperhero = !!_.find(userData.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            return isPortfolioManager || isBackupPortfolioManager || isSuperhero;
        };


		// ------------------- PROJECTS FOR NODE ------------

        var selectedPortfolioRanking = {};
        $scope.selectedAssignment = {};
        var overallSelected = false; // Required for the drag and drop listeners
		$scope.selectNode = function(node, userData){
            userHasAuthorization = getAuthorization(node, userData);
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
                        if(project.portfolio && (project.portfolio._id === node._id)){
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
            // Check for user authorization
            accept: function (sourceItemHandleScope, destSortableScope) {
                return userHasAuthorization;
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
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    } else {
                        PortfolioRankings.update({portfolioRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
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
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    } else {
                        PortfolioRankings.update({portfolioRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    }
                }
            }
		};


	}
]);

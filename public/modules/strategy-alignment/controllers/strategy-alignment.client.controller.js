'use strict';

angular.module('strategy-alignment').controller('StrategyAlignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'StrategyNodes','Projects', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, StrategyNodes, Projects, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

        $scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

            $q.all([
                StrategyNodes.query().$promise,
                Projects.query({'selection.active': true}).$promise
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
            _.forEach(strategyNodes, function(node){
                selectedAssignments.assignedProjects[node._id] = [];
            });
            _.map(projects, function(project){
				if(_.isNull(project.parent) || _.isUndefined(project.parent)){
                    selectedAssignments.unassignedProjects.push(project);
				} else {
                    _.forEach(strategyNodes, function(node){
                        if(project.parent === node._id){selectedAssignments.assignedProjects[node._id].push(project);}
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


        // ------------------- DRAG AND DROP LISTENERS -------

        $scope.dragControlListenersAssigned = {
            itemMoved: function (eventObj) {
                var movedProjectFromAssigned = eventObj.source.itemScope.project;
                var originalParent = movedProjectFromAssigned.parent;
                movedProjectFromAssigned.parent = null;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updateStrategyAssignment(movedProjectFromAssigned, function(res){
                    $scope.isResolving = false;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                    // put back project in case of failure
                    movedProjectFromAssigned.parent = originalParent;
                    eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                    eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromAssigned);
                });
            }
        };

        $scope.dragControlListenersUnassigned = {
            itemMoved: function (eventObj) {
                var movedProjectFromUnassigned = eventObj.source.itemScope.project;
                movedProjectFromUnassigned.parent = $scope.selectedNode._id;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updateStrategyAssignment(movedProjectFromUnassigned, function(res){
                    $scope.isResolving = false;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                    // put back project in case of failure
                    movedProjectFromUnassigned.parent = null;
                    eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                    eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromUnassigned);
                });
            }
        };


	}
]);

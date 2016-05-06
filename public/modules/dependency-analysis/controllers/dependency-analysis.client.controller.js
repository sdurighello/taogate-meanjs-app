'use strict';

angular.module('dependency-analysis').controller('DependencyAnalysisController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'Projects','Portfolios','Dependencies', 'DependencyTypes', 'DependencyImpacts', 'DependencyStates', 'LogStatusIndicators', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, Dependencies, DependencyTypes, DependencyImpacts, DependencyStates, LogStatusIndicators, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var portfolioDependenciesObject = {
            nodes : [],
            links : []
        };

        vm.portfoliosSelectedForView = {
            //    portfolioID : true/false
        };

        var dependencyTypes = [], dependencyImpacts = [], dependencyStates = [], logStatuses = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
                // Create the properties for the portfolio selection
                _.each(portfolios, function(portfolio){
                    vm.portfoliosSelectedForView[portfolio._id] = false;
                });
                vm.portfoliosSelectedForView.all = false;
                vm.portfoliosSelectedForView.unassigned = false;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Dependencies.getDependenciesAnalysis(function(res){
                portfolioDependenciesObject = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            DependencyTypes.query(function(res){
                dependencyTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            DependencyImpacts.query(function(res){
                dependencyImpacts = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            DependencyStates.query(function(res){
                dependencyStates = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(res){
                logStatuses = res;
            }, function(err){
                vm.initError.push(err.data.message);
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


        // ------ PORTFOLIO SELECTION -----------


        vm.dependenciesForGraphObject = {
            nodes : [],
            links : []
        };

        vm.isPortfolioSelectionEmpty = function () {
            // If no portfolios are selected, then all values should be false and this should return true
            var flag = true;
            _.each(vm.portfoliosSelectedForView, function(v, k){
                if(v){
                    flag = false;
                }
            });
            return flag;
        };


        vm.selectPortfolio = function(portfolio){

            if(portfolio === 'unassigned'){
                if(vm.portfoliosSelectedForView.unassigned){
                    vm.portfoliosSelectedForView.unassigned = false;
                } else {
                    vm.portfoliosSelectedForView.unassigned = true;
                }

            } else if(portfolio === 'all'){
                if(vm.portfoliosSelectedForView.all){
                    vm.portfoliosSelectedForView.all = false;
                    _.forEach(vm.portfoliosSelectedForView, function(v, k){
                        vm.portfoliosSelectedForView[k] = false;
                    });
                } else {
                    vm.portfoliosSelectedForView.all = true;
                    _.each(vm.portfoliosSelectedForView, function(v, k){
                        vm.portfoliosSelectedForView[k] = true;
                    });
                }

            } else {

                if(vm.portfoliosSelectedForView[portfolio._id]){
                    vm.portfoliosSelectedForView[portfolio._id] = false;
                } else {
                    vm.portfoliosSelectedForView[portfolio._id] = true;
                }
            }

        };

        var createDependenciesForGraph = function(){

            var arrayOfPortfolioIds = _.keys(_.pick(vm.portfoliosSelectedForView, function(v, k){ return v; }));
            var newLinks = [];
            var newNodes = [];

            // LINKS: Pick all the dependencies where the sourcePortfolio or the targetPortfolio equals to the selected portfolio
            newLinks = _.filter(portfolioDependenciesObject.links, function(link){
                return _.some(arrayOfPortfolioIds, function(portfolioId){
                    if(portfolioId === 'unassigned' && ((link.sourcePortfolioId === null) || (link.targetPortfolioId === null))){
                        return true;
                    } else {
                        return (link.sourcePortfolioId === portfolioId) || (link.targetPortfolioId === portfolioId);
                    }
                });
            });

            // NODES: Remove from nodes the nodes that are not in any of the new dependencies
            newNodes = _.filter(portfolioDependenciesObject.nodes, function(node){
                return _.some(newLinks, function(link){
                    return (link.dependency.source._id === node._id) || (link.dependency.target._id === node._id);
                });
            });

            // Remap the indexOf the source/target in the links array based on the newNodes
            newLinks = _.map(newLinks, function(link){
                link.source = _.findIndex(newNodes, function(node){
                    return node._id === link.dependency.source._id;
                });
                link.target = _.findIndex(newNodes, function(node){
                    return node._id === link.dependency.target._id;
                });
                return link;
            });

            // Attach the new values to the view
            vm.dependenciesForGraphObject.links = newLinks;
            vm.dependenciesForGraphObject.nodes = newNodes;
        };

        $scope.$watch(
            function($scope){ return vm.portfoliosSelectedForView; },
            function ( newValue, oldValue ) {
                if(newValue !== oldValue){
                    createDependenciesForGraph();
                }
            }, true
        );

        vm.getPortfolioSelectionStatus = function(portfolio){
            if(portfolio === 'all'){
                return vm.portfoliosSelectedForView.all;
            }
            if(portfolio === 'unassigned'){
                return vm.portfoliosSelectedForView.unassigned;
            }
            return vm.portfoliosSelectedForView[portfolio._id];
        };

        // ------ PROJECT SELECTION -----------

        var getOneProjectDependencies = function(project){
            var retArray = [];
            if(project){
                retArray = _.chain(vm.dependenciesForGraphObject.links)
                    .filter(function(link){
                        return (link.dependency.source._id === project._id) || (link.dependency.target._id === project._id);
                    })
                    .map(function(link){
                        return link.dependency;
                    })
                    .value();

                return retArray;
            }
        };

        var getSourceTargetDependencies = function(source, target){
            var retArray = [];
            if(source && target){
                retArray = _.chain(vm.dependenciesForGraphObject.links)
                    .filter(function(link){
                        return ((link.dependency.source._id === source._id) && (link.dependency.target._id === target._id)) || ((link.dependency.source._id === target._id) && (link.dependency.target._id === source._id));
                    })
                    .map(function(link){
                        return link.dependency;
                    })
                    .value();

                return retArray;
            }
        };

        var modalDependencyProfile = function (size, dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, dependencies, source, target) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/dependency-analysis/views/dependency-details.client.view.html',
                controller: function ($scope, $modalInstance, dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, dependencies, source, target) {

                    $scope.dependencyTypes = dependencyTypes;
                    $scope.dependencyImpacts = dependencyImpacts;
                    $scope.dependencyStates = dependencyStates;
                    $scope.logStatuses = logStatuses;

                    $scope.dependencies = dependencies;
                    $scope.source = source;
                    $scope.target = target;

                    $scope.projectDependencyDetails = 'header';

                    $scope.selectDependency = function(dependency){
                        $scope.selectedDependency = dependency;
                    };

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    dependencyTypes: function () {
                        return dependencyTypes;
                    },
                    dependencyImpacts: function () {
                        return dependencyImpacts;
                    },
                    dependencyStates: function () {
                        return dependencyStates;
                    },
                    logStatuses: function () {
                        return logStatuses;
                    },
                    dependencies: function () {
                        return dependencies;
                    },
                    source: function () {
                        return source;
                    },
                    target: function () {
                        return target;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectNode = function(node){
            modalDependencyProfile('lg', dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, getOneProjectDependencies(node), node, null);
        };

        vm.selectLink = function(link){
            modalDependencyProfile('lg', dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, getSourceTargetDependencies(link.dependency.source, link.dependency.target), link.dependency.source, link.dependency.target);
        };

    }
]);

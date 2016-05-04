'use strict';

angular.module('dependency-analysis').controller('PortfolioDependencyController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'Projects','Portfolios', 'GateProcesses','Dependencies', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcesses, Dependencies, _, $q, $modal) {

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
                console.log(res);
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };

        // ------- D3 --------

        vm.dependencyData = {
            'nodes':[
                {_id:0, 'name':'project0','group':0},
                {_id:1, 'name':'project1','group':1},
                {_id:2, 'name':'project2','group':2}
            ],
            'links':[
                {_id:0, 'source':1,'target':0,'value':1},
                {_id:1, 'source':1,'target':2,'value':2},
                {_id:2, 'source':2,'target':0,'value':3}
            ]
        };

        vm.change = function(){
            vm.dependencyData = {
                'nodes':[
                    {_id:0, 'name':'project0','group':0},
                    {_id:1, 'name':'project1 xxx','group':1},
                    {_id:2, 'name':'project2','group':2},
                    {_id:3, 'name':'project3','group':3}
                ],
                'links':[
                    {_id:0, 'source':1,'target':0,'value':1},
                    {_id:1, 'source':1,'target':2,'value':2},
                    {_id:2, 'source':2,'target':0,'value':6},
                    {_id:3, 'source':1,'target':3,'value':4}
                ]
            };
        };

        vm.selectNode = function(project){
            console.log(project);
        };

        vm.selectLink = function(dependency){
            console.log(dependency);
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


        var modalProjectProfile = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/dependency-analysis/views/project-details.client.view.html',
                controller: function ($scope, $modalInstance, project) {

                    $scope.selectedProject = project;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(project){
            modalProjectProfile('lg', project);
        };






    }
]);

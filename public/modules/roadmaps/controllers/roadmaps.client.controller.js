'use strict';

angular.module('roadmaps').controller('RoadmapsController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'Projects','Portfolios', 'GateProcesses','Roadmaps', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcesses, Roadmaps, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var roadmaps = [];

        vm.portfoliosSelectedForRoadmap = {
            //    portfolioID : true/false
        };

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
                // Create the properties for the portfolio selection
                _.each(portfolios, function(portfolio){
                    vm.portfoliosSelectedForRoadmap[portfolio._id] = false;
                });
                vm.portfoliosSelectedForRoadmap.all = false;
                vm.portfoliosSelectedForRoadmap.unassigned = false;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcesses.query(function(gateProcesses){
                vm.gateProcesses = gateProcesses;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Roadmaps.getDefinitionRoadmap(function(res){
                roadmaps = res;
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


        vm.definitionRoadmaps = [];

        vm.isPortfolioSelectionEmpty = function () {
            // If no portfolios are selected, then all values should be false and this should return true
            var flag = true;
            _.each(vm.portfoliosSelectedForRoadmap, function(v, k){
                if(v){
                    flag = false;
                }
            });
            return flag;
        };


        vm.selectPortfolio = function(portfolio){

            if(portfolio === 'unassigned'){
                if(vm.portfoliosSelectedForRoadmap.unassigned){
                    vm.portfoliosSelectedForRoadmap.unassigned = false;
                } else {
                    vm.portfoliosSelectedForRoadmap.unassigned = true;
                }

            } else if(portfolio === 'all'){
                if(vm.portfoliosSelectedForRoadmap.all){
                    vm.portfoliosSelectedForRoadmap.all = false;
                    _.forEach(vm.portfoliosSelectedForRoadmap, function(v, k){
                        vm.portfoliosSelectedForRoadmap[k] = false;
                    });
                } else {
                    vm.portfoliosSelectedForRoadmap.all = true;
                    _.each(vm.portfoliosSelectedForRoadmap, function(v, k){
                        vm.portfoliosSelectedForRoadmap[k] = true;
                    });
                }

            } else {

                if(vm.portfoliosSelectedForRoadmap[portfolio._id]){
                    vm.portfoliosSelectedForRoadmap[portfolio._id] = false;
                } else {
                    vm.portfoliosSelectedForRoadmap[portfolio._id] = true;
                }
            }

        };

        var createDefinitionRoadmap = function(){
            var arrayOfPortfolioIds = _.keys(_.pick(vm.portfoliosSelectedForRoadmap, function(v, k){ return v; }));
            vm.definitionRoadmaps = _.filter(roadmaps, function(project){
                return _.some(arrayOfPortfolioIds, function(portfolioId){
                    if(portfolioId === 'unassigned' && project.portfolio === null){
                        return true;
                    } else {
                        return project.portfolio === portfolioId;
                    }
                });
            });
        };

        $scope.$watch(
            function($scope){ return vm.portfoliosSelectedForRoadmap; },
            function ( newValue, oldValue ) {
                if(newValue !== oldValue){
                    createDefinitionRoadmap();
                }
            }, true
        );

        vm.getPortfolioSelectionStatus = function(portfolio){
            if(portfolio === 'all'){
                return vm.portfoliosSelectedForRoadmap.all;
            }
            if(portfolio === 'unassigned'){
                return vm.portfoliosSelectedForRoadmap.unassigned;
            }
          return vm.portfoliosSelectedForRoadmap[portfolio._id]; 
        };

        // ------ PROJECT SELECTION -----------
        

        var modalProjectProfile = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/roadmaps/views/project-details.client.view.html',
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

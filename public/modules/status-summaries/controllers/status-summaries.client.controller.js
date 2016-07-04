'use strict';

angular.module('status-summaries').controller('StatusSummaryController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'StatusSummaries','LogStatusAreas','Projects','Portfolios', 'GateProcessTemplates', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, StatusSummaries, LogStatusAreas, Projects, Portfolios, GateProcessTemplates, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var projects = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Projects.query({'selection.active':true, 'selection.selectedForDelivery':true, 'process.assignmentConfirmed':true}, function(res){
                projects = res;
                console.log(res);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusAreas.query(function(res){
                vm.logStatusAreas = res;
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

        vm.selectPortfolio = function(portfolio){
            if(portfolio === 'all'){
                vm.treeSelectionFlag = 'all';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'All'};
                vm.projects = projects;
                return;
            }
            if(portfolio === 'unassigned'){
                vm.treeSelectionFlag = 'unassigned';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'Unassigned'};
                vm.projects = _.filter(projects, function(project){
                    return _.isNull(project.portfolio);
                });
                return;
            }
            vm.selectedProjectProfile = null;
            vm.treeSelectionFlag = 'portfolio';
            vm.selectedPortfolio = portfolio;
            vm.projects = _.filter(projects, function(project){
                return (project.portfolio && (project.portfolio._id === portfolio._id));
            });

        };

        // ------ FILTER RANKING -----------

        vm.orderByProperty = 'qualitativeScore';
        vm.orderByDirection = true; // From highest to lowest
        vm.orderByRanking = function(property, direction){
            vm.orderByProperty = property;
            vm.orderByDirection = direction;
        };

        // ------ PROJECT SELECTION -----------

        vm.projectProfileDetails = 'financial';

        var modalProjectProfile = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/status-summaries/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, project) {

                    $scope.project = project;

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

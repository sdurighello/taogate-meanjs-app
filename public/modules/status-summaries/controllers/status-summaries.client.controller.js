'use strict';

angular.module('status-summaries').controller('StatusSummaryController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'StatusSummaries','LogStatusAreas','Projects','Portfolios', 'GateProcesses', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, StatusSummaries, LogStatusAreas, Projects, Portfolios, GateProcesses, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var projectProfiles = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            StatusSummaries.portfolioSummary(function(res){
                projectProfiles = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusAreas.query(function(res){
                vm.logStatusAreas = _.sortBy(res, '_id');
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
                vm.qualitativeSummaryView = projectProfiles;
                return;
            }
            if(portfolio === 'unassigned'){
                vm.treeSelectionFlag = 'unassigned';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'Unassigned'};
                vm.qualitativeSummaryView = _.filter(projectProfiles, function(profile){
                    return _.isNull(profile.portfolio);
                });
                return;
            }
            vm.selectedProjectProfile = null;
            vm.treeSelectionFlag = 'portfolio';
            vm.selectedPortfolio = portfolio;
            vm.qualitativeSummaryView = _.filter(projectProfiles, function(profile){
                return (profile.portfolio) && (profile.portfolio._id === portfolio._id);
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

        var modalProjectProfile = function (size, profile) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/status-summaries/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, profile) {

                    $scope.profile = profile;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    profile: function () {
                        return profile;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(profile){
            modalProjectProfile('lg', profile);
        };






    }
]);

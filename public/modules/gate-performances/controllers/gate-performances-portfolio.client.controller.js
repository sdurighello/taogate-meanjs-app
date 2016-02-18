'use strict';

angular.module('gate-performances').controller('GatePerformancesPortfolioController', ['$scope', '$stateParams', '$location', 'Authentication',
    'GatePerformances','Projects','Portfolios', 'GateProcesses', '_','$q','$modal',
    function($scope, $stateParams, $location, Authentication, GatePerformances, Projects, Portfolios, GateProcesses, _, $q, $modal) {

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var projectProfiles = [];

        vm.init = function(){

            Projects.query({'selection.selectedForEvaluation': true}, function(projects){
                vm.projects = projects;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcesses.query(function(gateProcesses){
                vm.gateProcesses = gateProcesses;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GatePerformances.portfolioPerformances(function(res){
                projectProfiles = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });


        };


        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            vm.userHasAuthorization = _.some(obj.user.roles, function(role){
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


        // ------ PORTFOLIO SELECTION -----------

        vm.selectPortfolio = function(portfolio){
            if(portfolio === 'all'){
                vm.treeSelectionFlag = 'all';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'All'};
                vm.projectProfilesView = projectProfiles;
                createPortfolioSummary(vm.projectProfilesView);
                return;
            }
            if(portfolio === 'unassigned'){
                vm.treeSelectionFlag = 'unassigned';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'Unassigned'};
                vm.projectProfilesView = _.filter(projectProfiles, function(profile){
                    return _.isNull(profile.project.portfolio);
                });
                createPortfolioSummary(vm.projectProfilesView);
                return;
            }
            vm.selectedProjectProfile = null;
            vm.treeSelectionFlag = 'portfolio';
            vm.selectedPortfolio = portfolio;
            vm.projectProfilesView = _.filter(projectProfiles, function(profile){
                return (profile.project.portfolio) && (profile.project.portfolio._id === portfolio._id);
            });
            createPortfolioSummary(vm.projectProfilesView);

        };

        var createPortfolioSummary = function(profiles){
            vm.numberOfProjects = profiles.length;
            vm.totalBudget = _.reduce(profiles, function(sum, profile){
                return sum + profile.cumulativeData.budget.amount;
            }, 0);
            vm.totalEarmarkedFunds = _.reduce(profiles, function(sum, profile){
                return sum + profile.project.identification.earmarkedFunds;
            }, 0);
        };

        // ------ FILTER RANKING -----------


        vm.orderByRanking = function(property, direction, displayName){
            vm.orderByProperty = property;
            vm.orderByDirection = direction;
            vm.orderByDisplayName = displayName;
        };

        vm.orderByRanking('cumulativeData.budget.amount', true, 'Budget');


        // ------ PROJECT SELECTION -----------

        vm.projectProfileDetails = 'financial';

        var modalProjectProfile = function (size, profile) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/gate-performances/views/project-profile.client.view.html',
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

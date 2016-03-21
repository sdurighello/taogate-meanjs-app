'use strict';

angular.module('review-summaries').controller('ReviewSummariesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'ReviewSummaries','Projects','Portfolios', 'GateProcesses', '_','$q','$modal',
	function($rootScope, $scope, $stateParams, $location, Authentication, ReviewSummaries, Projects, Portfolios, GateProcesses, _, $q, $modal) {

		$rootScope.staticMenu = false;

		var vm = this;

		// ----------- INIT ---------------

		vm.initError = [];

		var portfolioProfiles = [];
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

			ReviewSummaries.portfolioReviews(function(res){
				portfolioProfiles = res;
			}, function(err){
				vm.initError.push(err.data.message);
			});

            ReviewSummaries.projectReviews(function(res){
                projectProfiles = res;
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
			vm.selectedPortfolioReviews = false;
			if(portfolio === 'unassigned'){
				vm.treeSelectionFlag = 'unassigned';
				vm.selectedReviewProfile = null;
				vm.selectedPortfolio = {name : 'Unassigned'};
				vm.projectProfilesView = _.find(projectProfiles, function(profile){
					return _.isNull(profile.portfolioId);
				});
                vm.portfolioProfilesView = null;
                vm.selectedProjectProfile = null;
				return;
			}
			vm.selectedReviewProfile = null;
			vm.treeSelectionFlag = 'portfolio';
			vm.selectedPortfolio = portfolio;
            vm.selectedProjectProfile = null;
			vm.projectProfilesView = _.find(projectProfiles, function(profile){
				return (profile.portfolioId) && (profile.portfolioId === portfolio._id);
			});
            vm.portfolioProfilesView = _.find(portfolioProfiles, function(profile){
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

        vm.filterProjectName = '';

        vm.selectProjectProfile = function(profile){
            vm.selectedProjectProfile = profile;
            vm.selectedPortfolioReviews = false;
        };

        vm.viewPortfolioReviews = function(portfolio){
            vm.selectedPortfolioReviews = true;
            vm.selectedProjectProfile = null;
        };


		// ------ REVIEW SELECTION -----------

		vm.reviewProfileDetails = 'financial';

		var modalReviewProfile = function (size, profile) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/review-summaries/views/project-profile.client.view.html',
				controller: function ($scope, $modalInstance, profile) {

					$scope.profile = profile;
                    $scope.oneAtATime = true;

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

		vm.selectReviewProfile = function(profile){
			modalReviewProfile('lg', profile);
		};






	}
]);

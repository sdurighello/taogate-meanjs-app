'use strict';

angular.module('review-summaries').controller('ReviewSummariesController', ['$scope', '$stateParams', '$location', 'Authentication',
	'ReviewSummaries','Projects','Portfolios', 'GateProcesses', '_','$q','$modal',
	function($scope, $stateParams, $location, Authentication, ReviewSummaries, Projects, Portfolios, GateProcesses, _, $q, $modal) {

		var vm = this;

		// ----------- INIT ---------------

		vm.initError = [];

		var reviewProfiles = [];

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

			ReviewSummaries.portfolioSummary(function(res){
				console.log(res);
				reviewProfiles = res;
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
			if(portfolio === 'unassigned'){
				vm.treeSelectionFlag = 'unassigned';
				vm.selectedReviewProfile = null;
				vm.selectedPortfolio = {name : 'Unassigned'};
				vm.portfolioSummaryView = _.find(reviewProfiles, function(profile){
					return _.isNull(profile.portfolioId);
				});
				return;
			}
			vm.selectedReviewProfile = null;
			vm.treeSelectionFlag = 'portfolio';
			vm.selectedPortfolio = portfolio;
			vm.portfolioSummaryView = _.find(reviewProfiles, function(profile){
				return (profile.portfolioId) && (profile.portfolioId === portfolio._id);
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

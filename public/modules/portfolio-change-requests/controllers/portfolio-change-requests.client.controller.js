'use strict';

angular.module('portfolio-change-requests').controller('PortfolioChangeRequestsController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'PortfolioTypes', 'Projects', 'ProjectChangeRequests', 'PortfolioChangeRequests', 'GateProcesses', 'LogReasons', 'ChangeRequestStates', 'LogPriorities', 'LogStatusIndicators',
	'People', '$modal', '$log',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, PortfolioTypes, Projects, ProjectChangeRequests, PortfolioChangeRequests, GateProcesses, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators, People, $modal, $log) {

        $rootScope.staticMenu = false;

		var vm = this;

		vm.isResolving = false;

		// ------------- INIT -------------

		vm.initError = [];

		vm.init = function(){

            vm.user = Authentication.user;

			Projects.query({'selection.selectedForDelivery': true}, function(projects){
				vm.projects = _.filter(projects, function(project){return project.process !== null;});
			}, function(err){
				vm.initError.push(err.data.message);
			});

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            PortfolioTypes.query(function(res){
                vm.portfolioTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

			GateProcesses.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogReasons.query(function(logReasons){
				vm.logReasons = logReasons;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			ChangeRequestStates.query(function(changeRequestStates){
				vm.changeRequestStates = changeRequestStates;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogPriorities.query(function(logPriorities){
				vm.logPriorities = logPriorities;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				vm.logStatuses = logStatusIndicators;
			}, function(err){
				vm.initError.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, portfolio){

            var userIsSuperhero, userIsPortfolioManager;

            if((action === 'edit') && user && portfolio){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = (user._id === portfolio.portfolioManager) || (user._id === portfolio.backupPortfolioManager);


                return userIsSuperhero || userIsPortfolioManager;
            }

            if((action === 'approve') && user && portfolio){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                return userIsSuperhero;
            }
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


		// ------------------- NG-SWITCH ---------------------


		vm.switchHeaderForm = {};
		vm.selectHeaderForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ vm.switchHeaderForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){vm.switchHeaderForm[portfolioChangeRequest._id] = 'edit';}
		};

		vm.switchAssociatedProjectChangeRequestForm = {};
		vm.selectAssociatedProjectChangeRequestForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ vm.switchAssociatedProjectChangeRequestForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){vm.switchAssociatedProjectChangeRequestForm[portfolioChangeRequest._id] = 'edit';}
		};

		vm.switchRequestedFundsForm = {};
		vm.selectRequestedFundsForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ vm.switchRequestedFundsForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){vm.switchRequestedFundsForm[portfolioChangeRequest._id] = 'edit';}
		};



		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		vm.sortPortfolioChangeRequests = function(portfolioChangeRequest) {
			return new Date(portfolioChangeRequest.raisedOnDate);
		};

		vm.sortByCreated = function(object){
			return new Date(object.created);
		};

        vm.calculateTotalCRBudget = function(){
            if(vm.selectedPortfolioChangeRequest){
                return _.reduce(vm.selectedPortfolioChangeRequest.associatedProjectChangeRequests, function(sum, request){
                    return sum + request.gateAssignmentReview.budgetChange;
                }, 0);
            } else {
                return 0;
            }
        };

        vm.calculateTotalRequests = function(){
            if(vm.selectedPortfolioChangeRequest){
                return _.reduce(vm.selectedPortfolioChangeRequest.fundingRequests, function(sum, request){
                    return sum + request.funds;
                }, 0);
            } else {
                return 0;
            }
        };


		// ------------------- OTHER VARIABLES ---------------------

		vm.portfolioChangeRequestDetails = 'header';

		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalPortfolioChangeRequest = {};

		vm.selectPortfolio = function(portfolio) {

            vm.cancelNewPortfolioChangeRequest();

			vm.selectedPortfolio = null;
			vm.portfolioChangeRequests = null;

			vm.selectedPortfolioChangeRequest = null;
			originalPortfolioChangeRequest = {};

			vm.selectedPortfolio = portfolio;

            vm.error = null;
            vm.isResolving = true;
			PortfolioChangeRequests.query({
				portfolio: portfolio._id
			}, function (res) {
                vm.isResolving = false;
				vm.portfolioChangeRequests = res;
			}, function (err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelViewPortfolio = function(){
			vm.error = null;
			vm.selectedPortfolio = null;
			vm.portfolioChangeRequests = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------

        vm.showNewPortfolioChangeRequestForm = false;

		vm.openNewPortfolioCRRaisedOnDate = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			vm.newPortfolioCRRaisedOnDateOpened = true;
		};

		vm.newPortfolioChangeRequest = {};

		vm.createNewPortfolioChangeRequest = function(portfolio){
			var newPortfolioChangeRequest = new PortfolioChangeRequests({
				portfolio: portfolio._id,
				raisedOnDate : vm.newPortfolioChangeRequest.raisedOnDate,
				title : vm.newPortfolioChangeRequest.title
			});
            vm.error = null;
            vm.isResolving = true;
			newPortfolioChangeRequest.$save(function(res) {
                vm.isResolving = false;
                vm.showNewPortfolioChangeRequestForm = false;
				// Clear new form
				vm.newPortfolioChangeRequest = {};
				// Refresh the list of change requests
                vm.portfolioChangeRequests.push(res);
				// Select in view mode the new review
				vm.selectPortfolioChangeRequest(portfolio, res);
				// Close new review form done directly in the view's html
			}, function(err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelNewPortfolioChangeRequest = function(){
            vm.error = null;
			vm.newPortfolioChangeRequest = {};
		};


		// ------------- SELECT CHANGE REQUEST ------------

		var portfolioChangeRequestFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of change requests

		vm.selectPortfolioChangeRequest = function(portfolio, portfolioChangeRequest){
            vm.error = null;
            vm.isResolving = true;
			$q.all([
                PortfolioChangeRequests.get({
                        portfolioChangeRequestId:portfolioChangeRequest._id }).$promise,
                PortfolioChangeRequests.getAvailableProjectChangeRequests(
                    { portfolioId : portfolio._id, portfolioChangeRequestId: portfolioChangeRequest._id }).$promise,
                Projects.query(
                    { portfolio : portfolio._id }).$promise
            ]).then(function(data) {
                vm.isResolving = false;
                portfolioChangeRequestFromList[portfolioChangeRequest._id] = portfolioChangeRequest;
                originalPortfolioChangeRequest[portfolioChangeRequest._id] = _.cloneDeep(data[0]);
                vm.selectedPortfolioChangeRequest = data[0];
                vm.availableProjectChangeRequests = data[1];
                vm.availableProjects = data[2];
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });

		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

		vm.headerDateOpened = {};
		vm.openHeaderDate = function(portfolioChangeRequest, $event){
			$event.preventDefault();
			$event.stopPropagation();
			vm.headerDateOpened[portfolioChangeRequest._id] = true;
		};

		vm.editHeader = function(portfolioChangeRequest){
			vm.selectHeaderForm('edit', portfolioChangeRequest);
		};

		vm.saveEditHeader = function(portfolioChangeRequest){
			// Clean-up deepPopulate
			var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
			copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
			// Update server header
            vm.error = null;
            vm.isResolving = true;
			PortfolioChangeRequests.updateHeader(
				{
					portfolioChangeRequestId : copyPortfolioChangeRequest._id
				}, copyPortfolioChangeRequest,
				function(res){
                    vm.isResolving = false;
					// Update details pane view with new saved details
					originalPortfolioChangeRequest[portfolioChangeRequest._id].raisedOnDate = portfolioChangeRequest.raisedOnDate;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].title = portfolioChangeRequest.title;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].description = portfolioChangeRequest.description;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].state = portfolioChangeRequest.state;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].priority = portfolioChangeRequest.priority;
					// Update list of reviews with new date / title
					portfolioChangeRequestFromList[portfolioChangeRequest._id].raisedOnDate = portfolioChangeRequest.raisedOnDate;
					portfolioChangeRequestFromList[portfolioChangeRequest._id].title = portfolioChangeRequest.title;
					// Close edit header form and back to view
					vm.selectHeaderForm('view', portfolioChangeRequest);
				},
				function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
			);
		};

		vm.cancelEditHeader = function(portfolioChangeRequest){
            vm.error = null;
			portfolioChangeRequest.raisedOnDate = originalPortfolioChangeRequest[portfolioChangeRequest._id].raisedOnDate;
			portfolioChangeRequest.title = originalPortfolioChangeRequest[portfolioChangeRequest._id].title;
			portfolioChangeRequest.description = originalPortfolioChangeRequest[portfolioChangeRequest._id].description;
			portfolioChangeRequest.state = originalPortfolioChangeRequest[portfolioChangeRequest._id].state;
			portfolioChangeRequest.priority = originalPortfolioChangeRequest[portfolioChangeRequest._id].priority;
			vm.selectHeaderForm('view', portfolioChangeRequest);
		};


		vm.deletePortfolioChangeRequest = function(portfolioChangeRequest){
            vm.error = null;
            vm.isResolving = true;
			PortfolioChangeRequests.remove(
                {portfolioChangeRequestId: portfolioChangeRequest._id},
                portfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    vm.portfolioChangeRequests = _.without(vm.portfolioChangeRequests, _.find(vm.portfolioChangeRequests, _.matchesProperty('_id',portfolioChangeRequest._id)));
                    vm.cancelNewPortfolioChangeRequest();
                    vm.selectedPortfolioChangeRequest = null;
                    originalPortfolioChangeRequest = {};
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
		};


		// ---------------------------------------------------------- APPROVAL -----------------------------------------------------------

        vm.submit = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.submit(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        vm.approve = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.approve(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    portfolioChangeRequestFromList[portfolioChangeRequest._id].approval = res.approval;
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        vm.reject = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.reject(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    portfolioChangeRequestFromList[portfolioChangeRequest._id].approval = res.approval;
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        vm.draft = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.draft(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };



        // ----------------------------------------------- ASSOCIATED PROJECT CHANGE REQUESTS -------------------------------------------------


        // Used only to show the details of the change (adding/removing all done on main ctrl/view)
        var modalProjectChangeRequest = function (size, change, logReasons, changeRequestStates, logPriorities, logStatuses) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/portfolio-change-requests/views/associated-project-change.client.view.html',
                controller: function ($scope, $modalInstance, change, logReasons, changeRequestStates, logPriorities, logStatuses) {
                    $scope.selectedProjectChangeRequest = change;

                    $scope.logReasons = logReasons;
                    $scope.changeRequestStates = changeRequestStates;
                    $scope.logPriorities = logPriorities;
                    $scope.logStatuses = logStatuses;

                    $scope.projectChangeRequestDetails = 'header';

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    change: function (ProjectChangeRequests) {
                        return ProjectChangeRequests.get(
                            { projectChangeRequestId:change._id },
                            function(res){ return res; },
                            function(err){ return err; }
                        );
                    },
                    logReasons: function () {
                        return logReasons;
                    },
                    changeRequestStates: function () {
                        return changeRequestStates;
                    },
                    logPriorities: function () {
                        return logPriorities;
                    },
                    logStatuses: function () {
                        return logStatuses;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });
        };

        vm.viewProjectChangeRequest = function(change){
            modalProjectChangeRequest('lg', change, vm.logReasons, vm.changeRequestStates, vm.logPriorities, vm.logStatuses);
        };

        vm.addProjectChangeRequest = function(portfolioChange, projectChange){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.addProjectChangeRequest({
                portfolioChangeRequestId : portfolioChange._id,
                projectChangeRequestId : projectChange._id
            }, portfolioChange, function(res){
                vm.isResolving = false;
                portfolioChange.associatedProjectChangeRequests.push(projectChange);
                vm.availableProjectChangeRequests = _.without(vm.availableProjectChangeRequests, projectChange);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };

        vm.removeProjectChangeRequest = function(portfolioChange, projectChange){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.removeProjectChangeRequest({
                portfolioChangeRequestId : portfolioChange._id,
                projectChangeRequestId : projectChange._id
            }, portfolioChange, function(res){
                vm.isResolving = false;
                portfolioChange.associatedProjectChangeRequests = _.without(portfolioChange.associatedProjectChangeRequests, projectChange);
                vm.availableProjectChangeRequests.push(projectChange);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };



        // ----------------------------------------------- FUNDING REQUESTS -------------------------------------------------

        vm.switchFundingRequestForm = {};
        vm.selectFundingRequestForm = function(string, fundingRequest){
            if(string === 'view'){ vm.switchFundingRequestForm[fundingRequest._id] = 'view';}
            if(string === 'edit'){vm.switchFundingRequestForm[fundingRequest._id] = 'edit';}
        };

        vm.createFundingRequest = function(portfolioChange){
            var newFundingRequest = {
                title : 'New funding request item',
                description : '',
                funds : 0
            };
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.createFundingRequest({
                portfolioChangeRequestId : portfolioChange._id
            }, newFundingRequest, function(res){
                vm.isResolving = false;
                portfolioChange.fundingRequests.push(res);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };

        var originalFundingRequest = {};
        vm.editFundingRequest = function(fundingRequest){
            originalFundingRequest[fundingRequest._id] = _.cloneDeep(fundingRequest);
            vm.selectedFundingRequest = fundingRequest;
            vm.selectFundingRequestForm('edit', fundingRequest);
        };


        vm.saveEditFundingRequest = function(portfolioChange, fundingRequest){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.updateFundingRequest({
                portfolioChangeRequestId : portfolioChange._id,
                fundingRequestId : fundingRequest._id
            }, fundingRequest, function(res){
                vm.isResolving = false;
                vm.selectFundingRequestForm('view', fundingRequest);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
                vm.selectFundingRequestForm('view', fundingRequest);
            });
        };

        vm.cancelEditFundingRequest = function(portfolioChange, fundingRequest){
            vm.error = null;
            fundingRequest.title = originalFundingRequest[fundingRequest._id].title;
            fundingRequest.description = originalFundingRequest[fundingRequest._id].description;
            fundingRequest.funds = originalFundingRequest[fundingRequest._id].funds;
            vm.selectFundingRequestForm('view', fundingRequest);
        };

        vm.deleteFundingRequest = function(portfolioChange, fundingRequest){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.deleteFundingRequest({
                portfolioChangeRequestId : portfolioChange._id,
                fundingRequestId : fundingRequest._id
            }, fundingRequest, function(res){
                vm.isResolving = false;
                portfolioChange.fundingRequests = _.without(portfolioChange.fundingRequests, fundingRequest);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };





	}
]);

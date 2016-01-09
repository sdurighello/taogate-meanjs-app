'use strict';

angular.module('portfolio-change-requests').controller('PortfolioChangeRequestsController', ['$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'Projects', 'ProjectChangeRequests', 'PortfolioChangeRequests', 'GateProcesses', 'LogReasons', 'ChangeRequestStates', 'LogPriorities', 'LogStatusIndicators',
	'People', '$modal', '$log',
	function($scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, Projects, ProjectChangeRequests, PortfolioChangeRequests, GateProcesses, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators, People, $modal, $log) {

		var vm = this;

		// ------------- INIT -------------

		vm.initError = [];

		vm.init = function(){

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


		// ------------------- OTHER VARIABLES ---------------------

		vm.portfolioChangeRequestDetails = 'header';

		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalPortfolioChangeRequest = {};

		vm.selectPortfolio = function(portfolio) {
			vm.error = {};
			vm.selectedPortfolio = null;
			vm.portfolioChangeRequests = null;

			vm.selectedPortfolioChangeRequest = null;
			originalPortfolioChangeRequest = {};

			vm.selectedPortfolio = portfolio;

			PortfolioChangeRequests.query({
				portfolio: portfolio._id
			}, function (res) {
				vm.portfolioChangeRequests = res;
			}, function (err) {
				vm.error = err.data.message;
			});
		};

		vm.cancelViewPortfolio = function(){
			vm.error = null;
			vm.selectedPortfolio = null;
			vm.portfolioChangeRequests = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------


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
			newPortfolioChangeRequest.$save(function(res) {
				// Clear new form
				vm.newPortfolioChangeRequest = {};
				// Refresh the list of change requests
                vm.portfolioChangeRequests.push(res);
				// Select in view mode the new review
				vm.selectPortfolioChangeRequest(res);
				// Close new review form done directly in the view's html
			}, function(err) {
				vm.error = err.data.message;
			});
		};

		vm.cancelNewPortfolioChangeRequest = function(){
			vm.newPortfolioChangeRequest = {};
		};


		// ------------- SELECT CHANGE REQUEST ------------

		var portfolioChangeRequestFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of change requests

		vm.selectPortfolioChangeRequest = function(portfolioChangeRequest){
			portfolioChangeRequestFromList[portfolioChangeRequest._id] = portfolioChangeRequest;
			PortfolioChangeRequests.get({
				portfolioChangeRequestId:portfolioChangeRequest._id
			}, function(res){
				vm.selectedPortfolioChangeRequest = res;
				originalPortfolioChangeRequest[portfolioChangeRequest._id] = _.cloneDeep(res);
				//vm.selectPortfolioChangeRequestForm('view');
			},function(errorResponse){
				vm.error = errorResponse.data.message;
				vm.selectedPortfolioChangeRequest = null;
				originalPortfolioChangeRequest = {};
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
			PortfolioChangeRequests.updateHeader(
				{
					portfolioChangeRequestId : copyPortfolioChangeRequest._id
				}, copyPortfolioChangeRequest,
				function(res){
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
				function(err){vm.error = err.data.message;}
			);
		};

		vm.cancelEditHeader = function(portfolioChangeRequest){
			portfolioChangeRequest.raisedOnDate = originalPortfolioChangeRequest[portfolioChangeRequest._id].raisedOnDate;
			portfolioChangeRequest.title = originalPortfolioChangeRequest[portfolioChangeRequest._id].title;
			portfolioChangeRequest.description = originalPortfolioChangeRequest[portfolioChangeRequest._id].description;
			portfolioChangeRequest.state = originalPortfolioChangeRequest[portfolioChangeRequest._id].state;
			portfolioChangeRequest.priority = originalPortfolioChangeRequest[portfolioChangeRequest._id].priority;
			vm.selectHeaderForm('view', portfolioChangeRequest);
		};


		vm.deletePortfolioChangeRequest = function(portfolioChangeRequest){
			PortfolioChangeRequests.remove(
                {portfolioChangeRequestId: portfolioChangeRequest._id},
                portfolioChangeRequest, function(res){
				vm.portfolioChangeRequests = _.without(vm.portfolioChangeRequests, _.find(vm.portfolioChangeRequests, _.matchesProperty('_id',portfolioChangeRequest._id)));
				vm.cancelNewPortfolioChangeRequest();
				vm.selectedPortfolioChangeRequest = null;
				originalPortfolioChangeRequest = {};
			}, function(err){
				vm.error = err.data.message;
			});
		};


        // ----------------------------------------------- ASSOCIATED PROJECT CHANGE REQUESTS -------------------------------------------------


        var modalAssociatedProjectChanges = function (size, portfolio, change) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/portfolio-change-requests/views/associated-project-change.client.view.html',
                controller: function ($scope, $modalInstance, portfolio, change) {

                    $scope.originalPortfolioChangeRequest = _.cloneDeep(change);
                    $scope.selectedPortfolioChangeRequest = change;
                    $scope.selectedPortfolio = portfolio;


                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    portfolio : function(){
                        return portfolio;
                    },
                    change: function () {
                        return change;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };


        vm.addProjectChangeRequest = function(portfolio, change){
            modalAssociatedProjectChanges('lg', portfolio, change);
        };




	}
]);

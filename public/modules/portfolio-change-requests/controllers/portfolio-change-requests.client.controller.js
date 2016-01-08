'use strict';

angular.module('portfolio-change-requests').controller('PortfolioChangeRequestController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcesses', 'ProjectChangeRequests', 'PortfolioChangeRequests', 'LogReasons', 'ChangeRequestStates', 'LogPriorities','LogStatusIndicators',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcesses, ProjectChangeRequests, PortfolioChangeRequests, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators) {

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query({'selection.selectedForDelivery': true}, function(projects){
				$scope.projects = _.filter(projects, function(project){return project.process !== null;});
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
                $scope.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			GateProcesses.query(function(gateProcesses){
				$scope.gateProcesses = gateProcesses;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogReasons.query(function(logReasons){
				$scope.logReasons = logReasons;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ChangeRequestStates.query(function(changeRequestStates){
				$scope.changeRequestStates = changeRequestStates;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogPriorities.query(function(logPriorities){
				$scope.logPriorities = logPriorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatuses = logStatusIndicators;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

		};

		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			$scope.userHasAuthorization = _.some(obj.user.roles, function(role){
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


		$scope.switchHeaderForm = {};
		$scope.selectHeaderForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ $scope.switchHeaderForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[portfolioChangeRequest._id] = 'edit';}
		};

		$scope.switchAssociatedProjectChangeRequestForm = {};
		$scope.selectAssociatedProjectChangeRequestForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ $scope.switchAssociatedProjectChangeRequestForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchAssociatedProjectChangeRequestForm[portfolioChangeRequest._id] = 'edit';}
		};

		$scope.switchRequestedFundsForm = {};
		$scope.selectRequestedFundsForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ $scope.switchRequestedFundsForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchRequestedFundsForm[portfolioChangeRequest._id] = 'edit';}
		};



		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortPortfolioChangeRequests = function(portfolioChangeRequest) {
			return new Date(portfolioChangeRequest.raisedOnDate);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.portfolioChangeRequestDetails = 'header';

		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalPortfolioChangeRequest = {};

		$scope.selectPortfolio = function(portfolio) {
			$scope.error = {};
			$scope.selectedPortfolio = null;
			$scope.portfolioChangeRequests = null;

			$scope.selectedPortfolioChangeRequest = null;
			originalPortfolioChangeRequest = {};

			$scope.selectedPortfolio = portfolio;

			PortfolioChangeRequests.query({
				portfolio: portfolio._id
			}, function (res) {
				$scope.portfolioChangeRequests = res;
			}, function (err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelViewPortfolio = function(){
			$scope.error = null;
			$scope.selectedPortfolio = null;
			$scope.portfolioChangeRequests = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------


		$scope.openNewPortfolioCRRaisedOnDate = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.newPortfolioCRRaisedOnDateOpened = true;
		};

		$scope.newPortfolioChangeRequest = {};

		$scope.createNewPortfolioChangeRequest = function(portfolio){
			var newPortfolioChangeRequest = new PortfolioChangeRequests({
				portfolio: portfolio._id,
				raisedOnDate : $scope.newPortfolioChangeRequest.raisedOnDate,
				title : $scope.newPortfolioChangeRequest.title
			});
			newPortfolioChangeRequest.$save(function(res) {
				// Clear new form
				$scope.newPortfolioChangeRequest = {};
				// Refresh the list of change requests
                $scope.portfolioChangeRequests.push(res);
				// Select in view mode the new review
				$scope.selectPortfolioChangeRequest(res);
				// Close new review form done directly in the view's html
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewPortfolioChangeRequest = function(){
			$scope.newPortfolioChangeRequest = {};
		};


		// ------------- SELECT CHANGE REQUEST ------------

		var portfolioChangeRequestFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of change requests

		$scope.selectPortfolioChangeRequest = function(portfolioChangeRequest){
			portfolioChangeRequestFromList[portfolioChangeRequest._id] = portfolioChangeRequest;
			PortfolioChangeRequests.get({
				portfolioChangeRequestId:portfolioChangeRequest._id
			}, function(res){
				$scope.selectedPortfolioChangeRequest = res;
				originalPortfolioChangeRequest[portfolioChangeRequest._id] = _.cloneDeep(res);
				//$scope.selectPortfolioChangeRequestForm('view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.selectedPortfolioChangeRequest = null;
				originalPortfolioChangeRequest = {};
			});
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

		$scope.headerDateOpened = {};
		$scope.openHeaderDate = function(portfolioChangeRequest, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.headerDateOpened[portfolioChangeRequest._id] = true;
		};

		$scope.editHeader = function(portfolioChangeRequest){
			$scope.selectHeaderForm('edit', portfolioChangeRequest);
		};

		$scope.saveEditHeader = function(portfolioChangeRequest){
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
					originalPortfolioChangeRequest[portfolioChangeRequest._id].reason = portfolioChangeRequest.reason;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].priority = portfolioChangeRequest.priority;
					// Update list of reviews with new date / title
					portfolioChangeRequestFromList[portfolioChangeRequest._id].raisedOnDate = portfolioChangeRequest.raisedOnDate;
					portfolioChangeRequestFromList[portfolioChangeRequest._id].title = portfolioChangeRequest.title;
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', portfolioChangeRequest);
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		$scope.cancelEditHeader = function(portfolioChangeRequest){
			portfolioChangeRequest.raisedOnDate = originalPortfolioChangeRequest[portfolioChangeRequest._id].raisedOnDate;
			portfolioChangeRequest.title = originalPortfolioChangeRequest[portfolioChangeRequest._id].title;
			portfolioChangeRequest.description = originalPortfolioChangeRequest[portfolioChangeRequest._id].description;
			portfolioChangeRequest.state = originalPortfolioChangeRequest[portfolioChangeRequest._id].state;
			portfolioChangeRequest.reason = originalPortfolioChangeRequest[portfolioChangeRequest._id].reason;
			portfolioChangeRequest.priority = originalPortfolioChangeRequest[portfolioChangeRequest._id].priority;
			$scope.selectHeaderForm('view', portfolioChangeRequest);
		};


		$scope.deletePortfolioChangeRequest = function(reviewObject, portfolioChangeRequest){
			PortfolioChangeRequests.remove({portfolioChangeRequestId: portfolioChangeRequest._id}, portfolioChangeRequest, function(res){
				reviewObject.portfolioChangeRequests = _.without(reviewObject.portfolioChangeRequests, _.find(reviewObject.portfolioChangeRequests, _.matchesProperty('_id',portfolioChangeRequest._id)));
				$scope.cancelNewPortfolioChangeRequest();
				$scope.selectedPortfolioChangeRequest = null;
				originalPortfolioChangeRequest = {};
			}, function(err){
				$scope.error = err.data.message;
			});
		};






	}
]);

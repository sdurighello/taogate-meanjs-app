'use strict';

// PORTFOLIO ISSUES controller
angular.module('portfolio-issues').controller('PortfolioIssuesController', ['$scope', '$stateParams', '$location', '$q', '$modal', '$log', '_', 'Authentication',
	'Portfolios', 'Projects', 'ProjectIssues', 'PortfolioIssues', 'GateProcesses', 'LogReasons', 'IssueStates', 'IssueActionStates', 'LogPriorities', 'LogStatusIndicators',
    'People',
	function($scope, $stateParams, $location, $q, $modal, $log, _, Authentication,
			 Portfolios, Projects, ProjectIssues, PortfolioIssues, GateProcesses, LogReasons, IssueStates, IssueActionStates, LogPriorities, LogStatusIndicators, People) {

        var vm = this;

		// ------------- INIT -------------

		vm.initError = [];

		vm.init = function () {

			Projects.query({'selection.selectedForDelivery': true}, function (projects) {
				vm.projects = _.filter(projects, function (project) {
					return project.process !== null;
				});
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
				vm.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				vm.initError.push(err.data.message);
			});

			GateProcesses.query(function (gateProcesses) {
				vm.gateProcesses = gateProcesses;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			LogReasons.query(function (res) {
				vm.logReasons = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			IssueStates.query(function (res) {
				vm.issueStates = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

            IssueActionStates.query(function (res) {
                vm.issueActionStates = res;
            }, function (err) {
                vm.initError.push(err.data.message);
            });

			LogPriorities.query(function (res) {
				vm.logPriorities = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function (res) {
				vm.logStatuses = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

            People.query(function (res) {
                vm.people = res;
            }, function (err) {
                vm.initError.push(err.data.message);
            });

		};

		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function (data) {
			var obj = _.clone(data);
			vm.userHasAuthorization = _.some(obj.user.roles, function (role) {
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


		// ------------------- UTILITIES ---------------------

		var allowNull = function (obj) {
			if (obj) {
				return obj._id;
			} else {
				return null;
			}
		};

		vm.sortProjectIssues = function (projectIssue) {
			return new Date(projectIssue.raisedOnDate);
		};

		vm.completionFilterArray = [
			{name : 'Completed', flag : true},
			{name : 'Not completed', flag : false}
		];


		// ------------- SELECT VIEW PORTFOLIO ------------

		vm.selectPortfolio = function (portfolio) {
			vm.error = {};
			vm.selectedPortfolio = null;
			vm.portfolioIssues = null;
			vm.selectedPortfolioIssue = null;

			vm.selectedPortfolio = portfolio;

			PortfolioIssues.query({
				portfolio: portfolio._id
			}, function (res) {
				vm.portfolioIssues = res;
			}, function (err) {
				vm.error = err.data.message;
			});
		};

		vm.cancelViewPortfolio = function () {
			vm.error = null;
			vm.selectedPortfolio = null;
			vm.portfolioIssues = null;

		};


// ******************************************************* ISSUE *******************************************************



		// ------------- NEW ISSUE ------------

		vm.newPortfolioIssueRaisedOnDateOpened = {};

		vm.openNewPortfolioIssueRaisedOnDate = function (portfolio, $event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.newPortfolioIssueRaisedOnDateOpened[portfolio._id] = true;
		};

		vm.newPortfolioIssue = {};

		vm.createNewPortfolioIssue = function (portfolio) {
			var newPortfolioIssue = new PortfolioIssues({
				portfolio: portfolio._id,
				raisedOnDate: vm.newPortfolioIssue.raisedOnDate,
				title: vm.newPortfolioIssue.title
			});
			newPortfolioIssue.$save(function (res) {
				// Refresh the list of gate reviews after populating portfolio
				res.portfolio = _.cloneDeep(portfolio);
				vm.portfolioIssues.push(res);
				// Clear new form
				vm.newPortfolioIssue = {};
				// Select in view mode the new review
				vm.selectPortfolioIssue(_.find(vm.portfolioIssues, _.matchesProperty('_id', res._id)), portfolio);
				// Close new review form done directly in the view's html
			}, function (err) {
				vm.error = err.data.message;
			});
		};

		vm.cancelNewPortfolioIssue = function () {
			vm.newPortfolioIssue = {};
		};



		// ------------- EDIT ISSUE ------------


		var modalUpdateIssue = function (size, issue, portfolio) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/portfolio-issues/views/edit-portfolio-issue.client.view.html',
				controller: function ($scope, $modalInstance, issue, availableProjectIssues, availableProjects) {

					$scope.originalPortfolioIssue = _.cloneDeep(issue);
					$scope.selectedPortfolioIssue = issue;
                    $scope.availableProjectIssues = availableProjectIssues;
                    $scope.availableProjects = availableProjects;

                    $scope.associateProjectIssue = function(portfolioIssue, projectIssue){
                        PortfolioIssues.addProjectIssue({
                            portfolioIssueId : portfolioIssue._id,
                            projectIssueId : projectIssue._id
                        }, portfolioIssue, function(res){
                            portfolioIssue.associatedProjectIssues.push(projectIssue);
                            $scope.availableProjectIssues = _.without($scope.availableProjectIssues, projectIssue);
                        }, function(err){
                            $scope.error = err.data.message;
                        });
                    };

                    $scope.disassociateProjectIssue = function(portfolioIssue, projectIssue){
                        PortfolioIssues.removeProjectIssue({
                            portfolioIssueId : portfolioIssue._id,
                            projectIssueId : projectIssue._id
                        }, portfolioIssue, function(res){
                            portfolioIssue.associatedProjectIssues = _.without(portfolioIssue.associatedProjectIssues, projectIssue);
                            $scope.availableProjectIssues.push(projectIssue);
                        }, function(err){
                            $scope.error = err.data.message;
                        });
                    };

					$scope.cancelModal = function () {
						$modalInstance.dismiss();
					};
				},
				size: size,
				resolve: {
					issue: function () {
						return issue;
					},
                    availableProjectIssues: function(PortfolioIssues){
                        return PortfolioIssues.getAvailableProjectIssues(
                            { portfolioId : portfolio._id, portfolioIssueId: issue._id},
                            function (res) { return res; },
                            function (err) { vm.error = err.data.message; }
                        );
                    },
                    availableProjects: function(Projects){
                        return Projects.query(
                            { portfolio : portfolio._id},
                            function (res) { return res; },
                            function (err) { vm.error = err.data.message; }
                        );
                    }
				},
				backdrop: 'static',
				keyboard: false
			});

		};

		vm.selectPortfolioIssue = function(issue, portfolio){
            modalUpdateIssue('lg', issue, portfolio);
		};

		// ------------------- NG-SWITCH ---------------------

		vm.portfolioIssueDetails = 'header';

		vm.selectHeaderForm = function (string) {
			if (string === 'view') {
				vm.switchHeaderForm = 'view';
			}
			if (string === 'edit') {
				vm.switchHeaderForm = 'edit';
			}
		};

		vm.selectStatusForm = function (string) {
			if (string === 'view') {
				vm.switchStatusForm = 'view';
			}
			if (string === 'edit') {
				vm.switchStatusForm = 'edit';
			}
		};

		// ------------------- HEADER --------------------------

		vm.openHeaderDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.headerDateOpened = true;
		};

		vm.editHeader = function () {
			vm.selectHeaderForm('edit');
		};

		vm.saveEditHeader = function (portfolioIssue, originalPortfolioIssue) {
			// Clean-up deepPopulate
			var copyPortfolioIssue = _.cloneDeep(portfolioIssue);
			copyPortfolioIssue.portfolio = _.get(copyPortfolioIssue.portfolio, '_id');
			copyPortfolioIssue.reason = allowNull(copyPortfolioIssue.reason);
			copyPortfolioIssue.priority = allowNull(copyPortfolioIssue.priority);
			copyPortfolioIssue.state = allowNull(copyPortfolioIssue.state);
			copyPortfolioIssue.statusReview.currentRecord.status = allowNull(copyPortfolioIssue.statusReview.currentRecord.status);
			// Update server header
			PortfolioIssues.updateHeader(
				{
					portfolioIssueId: copyPortfolioIssue._id
				}, copyPortfolioIssue,
				function (res) {
					// Update details pane view with new saved details
					originalPortfolioIssue.raisedOnDate = portfolioIssue.raisedOnDate;
					originalPortfolioIssue.title = portfolioIssue.title;
					originalPortfolioIssue.description = portfolioIssue.description;
					originalPortfolioIssue.state = portfolioIssue.state;
					originalPortfolioIssue.reason = portfolioIssue.reason;
					originalPortfolioIssue.priority = portfolioIssue.priority;
					// Close edit header form and back to view
					vm.selectHeaderForm('view');
				},
				function (err) {
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditHeader = function (portfolioIssue, originalPortfolioIssue) {
			portfolioIssue.gate = originalPortfolioIssue.gate;
			portfolioIssue.raisedOnDate = originalPortfolioIssue.raisedOnDate;
			portfolioIssue.title = originalPortfolioIssue.title;
			portfolioIssue.description = originalPortfolioIssue.description;
			portfolioIssue.state = originalPortfolioIssue.state;
			portfolioIssue.reason = originalPortfolioIssue.reason;
			portfolioIssue.priority = originalPortfolioIssue.priority;
			vm.selectHeaderForm('view');
		};


		vm.deletePortfolioIssue = function (portfolioIssue) {
			PortfolioIssues.remove({portfolioIssueId: portfolioIssue._id}, portfolioIssue, function (res) {
				vm.portfolioIssues = _.without(vm.portfolioIssues, portfolioIssue);
			}, function (err) {
				vm.error = err.data.message;
			});
		};


		// --------------------- STATUS -----------------------

		vm.openBaselineDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.baselineDeliveryDateOpened = true;
		};

		vm.openEstimateDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.estimateDeliveryDateOpened = true;
		};

		vm.openActualDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.actualDeliveryDateOpened = true;
		};

		vm.editStatus = function () {
			vm.selectStatusForm('edit');
		};

		vm.saveEditStatus = function (portfolioIssue, originalPortfolioIssue) {
			// Clean-up deepPopulate
			var copyPortfolioIssue = _.cloneDeep(portfolioIssue);
			copyPortfolioIssue.portfolio = _.get(copyPortfolioIssue.portfolio, '_id');
			copyPortfolioIssue.reason = allowNull(copyPortfolioIssue.reason);
			copyPortfolioIssue.priority = allowNull(copyPortfolioIssue.priority);
			copyPortfolioIssue.state = allowNull(copyPortfolioIssue.state);
			copyPortfolioIssue.statusReview.currentRecord.status = allowNull(copyPortfolioIssue.statusReview.currentRecord.status);
			// Update server header
			PortfolioIssues.updateStatus({portfolioIssueId: copyPortfolioIssue._id}, copyPortfolioIssue,
				function (res) {
					// Change the selected CR
					originalPortfolioIssue.statusReview.currentRecord.baselineDeliveryDate = portfolioIssue.statusReview.currentRecord.baselineDeliveryDate;
					originalPortfolioIssue.statusReview.currentRecord.estimateDeliveryDate = portfolioIssue.statusReview.currentRecord.estimateDeliveryDate;
					originalPortfolioIssue.statusReview.currentRecord.actualDeliveryDate = portfolioIssue.statusReview.currentRecord.actualDeliveryDate;
					originalPortfolioIssue.statusReview.currentRecord.status = portfolioIssue.statusReview.currentRecord.status;
					originalPortfolioIssue.statusReview.currentRecord.completed = portfolioIssue.statusReview.currentRecord.completed;
					originalPortfolioIssue.statusReview.currentRecord.statusComment = portfolioIssue.statusReview.currentRecord.statusComment;
					vm.selectStatusForm('view');
				},
				function (err) {
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditStatus = function (portfolioIssue, originalPortfolioIssue) {
			portfolioIssue.statusReview.currentRecord.baselineDeliveryDate = originalPortfolioIssue.statusReview.currentRecord.baselineDeliveryDate;
			portfolioIssue.statusReview.currentRecord.estimateDeliveryDate = originalPortfolioIssue.statusReview.currentRecord.estimateDeliveryDate;
			portfolioIssue.statusReview.currentRecord.actualDeliveryDate = originalPortfolioIssue.statusReview.currentRecord.actualDeliveryDate;
			portfolioIssue.statusReview.currentRecord.status = originalPortfolioIssue.statusReview.currentRecord.status;
			portfolioIssue.statusReview.currentRecord.completed = originalPortfolioIssue.statusReview.currentRecord.completed;
			portfolioIssue.statusReview.currentRecord.statusComment = originalPortfolioIssue.statusReview.currentRecord.statusComment;
			vm.selectStatusForm('view');
		};



// ******************************************************* ACTION *****************************************************



        // --------------------- NEW ACTION -----------------------


        vm.addNewAction = function (portfolioIssue) {
            var newAction = {
                raisedOnDate: Date.now(),
                title: 'New action title'
            };
            PortfolioIssues.createAction(
                { portfolioIssueId : portfolioIssue._id}, newAction,
                function(res){
                    portfolioIssue.escalationActions.push(res);
                },
                function(err){
                    vm.error = err.data.message;
                }
            );
        };


        // --------------------- EDIT ACTION -----------------------


        vm.selectAction = function(action){
            vm.originalAction = _.cloneDeep(action);
            vm.selectedAction = action;
        };


        // ------------------- NG-SWITCH ---------------------

        vm.actionDetails = 'header';

        vm.switchActionHeaderForm = {};
        vm.selectActionHeaderForm = function (string, action) {
            if (string === 'view') {
                vm.switchActionHeaderForm[action._id] = 'view';
            }
            if (string === 'edit') {
                vm.switchActionHeaderForm[action._id] = 'edit';
            }
        };

        vm.switchActionStatusForm = {};
        vm.selectActionStatusForm = function (string, action) {
            if (string === 'view') {
                vm.switchActionStatusForm[action._id] = 'view';
            }
            if (string === 'edit') {
                vm.switchActionStatusForm[action._id] = 'edit';
            }
        };

        // ------------------- HEADER --------------------------

        vm.actionHeaderDateOpened = {};
        vm.openActionHeaderDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionHeaderDateOpened[action._id] = true;
        };

        vm.editActionHeader = function (action) {
            vm.selectActionHeaderForm('edit', action);
        };

        vm.saveEditActionHeader = function (issue, action, originalAction) {
            // Clean-up deepPopulate
            var copyAction = _.cloneDeep(action);
            copyAction.portfolio = _.get(copyAction.portfolio, '_id');
            copyAction.reason = allowNull(copyAction.reason);
            copyAction.priority = allowNull(copyAction.priority);
            copyAction.state = allowNull(copyAction.state);
            copyAction.statusReview.currentRecord.status = allowNull(copyAction.statusReview.currentRecord.status);
            // Update server header
            PortfolioIssues.updateActionHeader(
                {
                    portfolioIssueId: issue._id,
                    escalationActionId: action._id
                }, copyAction,
                function (res) {
                    // Update details pane view with new saved details
                    originalAction.raisedOnDate = action.raisedOnDate;
                    originalAction.title = action.title;
                    originalAction.description = action.description;
                    originalAction.state = action.state;
                    originalAction.reason = action.reason;
                    originalAction.priority = action.priority;
                    // Close edit header form and back to view
                    vm.selectActionHeaderForm('view', action);
                },
                function (err) {
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditActionHeader = function (action, originalAction) {
            action.raisedOnDate = originalAction.raisedOnDate;
            action.title = originalAction.title;
            action.description = originalAction.description;
            action.state = originalAction.state;
            action.reason = originalAction.reason;
            action.priority = originalAction.priority;
            vm.selectActionHeaderForm('view', action);
        };


        vm.deleteAction = function (issue, action) {
            PortfolioIssues.removeAction({
                portfolioIssueId: issue._id,
                escalationActionId: action._id
            }, action, function (res) {
                vm.issue.escalationActions = _.without(vm.issue.escalationActions, action);
            }, function (err) {
                vm.error = err.data.message;
            });
        };


        // --------------------- STATUS -----------------------

        vm.actionBaselineDeliveryDateOpened = {};
        vm.openActionBaselineDeliveryDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionBaselineDeliveryDateOpened[action._id] = true;
        };

        vm.actionEstimateDeliveryDateOpened = {};
        vm.openActionEstimateDeliveryDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionEstimateDeliveryDateOpened[action._id] = true;
        };

        vm.actionActualDeliveryDateOpened = {};
        vm.openActionActualDeliveryDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionActualDeliveryDateOpened[action._id] = true;
        };

        vm.editActionStatus = function (action) {
            vm.selectActionStatusForm('edit', action);
        };

        vm.saveEditActionStatus = function (issue, action, originalAction) {
            // Clean-up deepPopulate
            var copyAction = _.cloneDeep(action);
            copyAction.portfolio = _.get(copyAction.portfolio, '_id');
            copyAction.reason = allowNull(copyAction.reason);
            copyAction.priority = allowNull(copyAction.priority);
            copyAction.state = allowNull(copyAction.state);
            copyAction.statusReview.currentRecord.status = allowNull(copyAction.statusReview.currentRecord.status);
            // Update server header
            PortfolioIssues.updateActionStatus({
                    portfolioIssueId: issue._id,
                    escalationActionId: action._id
                }, copyAction,
                function (res) {
                    // Change the selected action
                    originalAction.statusReview.currentRecord.baselineDeliveryDate = issue.statusReview.currentRecord.baselineDeliveryDate;
                    originalAction.statusReview.currentRecord.estimateDeliveryDate = issue.statusReview.currentRecord.estimateDeliveryDate;
                    originalAction.statusReview.currentRecord.actualDeliveryDate = issue.statusReview.currentRecord.actualDeliveryDate;
                    originalAction.statusReview.currentRecord.status = issue.statusReview.currentRecord.status;
                    originalAction.statusReview.currentRecord.completed = issue.statusReview.currentRecord.completed;
                    originalAction.statusReview.currentRecord.statusComment = issue.statusReview.currentRecord.statusComment;
                    vm.selectActionStatusForm('view', action);
                },
                function (err) {
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditActionStatus = function (action, originalAction) {
            action.statusReview.currentRecord.baselineDeliveryDate = originalAction.statusReview.currentRecord.baselineDeliveryDate;
            action.statusReview.currentRecord.estimateDeliveryDate = originalAction.statusReview.currentRecord.estimateDeliveryDate;
            action.statusReview.currentRecord.actualDeliveryDate = originalAction.statusReview.currentRecord.actualDeliveryDate;
            action.statusReview.currentRecord.status = originalAction.statusReview.currentRecord.status;
            action.statusReview.currentRecord.completed = originalAction.statusReview.currentRecord.completed;
            action.statusReview.currentRecord.statusComment = originalAction.statusReview.currentRecord.statusComment;
            vm.selectActionStatusForm('view', action);
        };


// ******************************************************* ASSOCIATE PROJECT ISSUES *****************************************************





	}

]);

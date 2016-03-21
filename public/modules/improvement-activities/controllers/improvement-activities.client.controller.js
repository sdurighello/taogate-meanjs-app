'use strict';

// IMPROVEMENT ACTIVITIES controller
angular.module('improvement-activities').controller('ImprovementActivitiesController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'ImprovementActivities', 'ImprovementTypes', 'ImprovementReasons', 'ImprovementStates', 'LogPriorities', 'LogStatusIndicators',
	'People', '$modal', '$log',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, ImprovementActivities, ImprovementTypes, ImprovementReasons, ImprovementStates, LogPriorities, LogStatusIndicators, People, $modal, $log) {

		$rootScope.staticMenu = false;

		var vm = this;

		// ------------- INIT -------------

		vm.initError = [];

		vm.init = function () {

			vm.userData = Authentication.user;

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
				vm.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				vm.initError.push(err.data.message);
			});

			ImprovementActivities.query(function (res) {
				vm.improvementActivities = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			ImprovementTypes.query(function (res) {
				vm.improvementTypes = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			ImprovementReasons.query(function (res) {
				vm.improvementReasons = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			ImprovementStates.query(function (res) {
				vm.improvementStates = res;
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

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, userData, improvementActivity){
            var userIsSuperhero, userIsOwner, userIsPortfolioManager;

            if(action === 'new'){

                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                return userIsSuperhero;
            }

            if(action === 'edit'){

                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                if(improvementActivity.assignedTo){
                    userIsOwner = userData._id === improvementActivity.assignedTo.assignedUser;
                }

                if(improvementActivity.portfolio){
                    userIsPortfolioManager = (userData._id === improvementActivity.portfolio.portfolioManager) || (userData._id === improvementActivity.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsOwner || userIsPortfolioManager;
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


		// ------------------- UTILITIES ---------------------

		var allowNull = function (obj) {
			if (obj) {
				return obj._id;
			} else {
				return null;
			}
		};

		vm.sortImprovementActivities = function (activity) {
			return new Date(activity.raisedOnDate);
		};

		vm.completionFilterArray = [
			{name : 'Completed', flag : true},
			{name : 'Not completed', flag : false}
		];


// ******************************************************* IMPROVEMENT ACTIVITY *******************************************************



		// ------------- NEW ACTIVITY ------------


		vm.openNewActivityRaisedOnDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.newImprovementActivityRaisedOnDateOpened = true;
		};

		vm.newImprovementActivity = {};

		vm.createNewImprovementActivity = function () {
			var newImprovementActivity = new ImprovementActivities({
				raisedOnDate: vm.newImprovementActivity.raisedOnDate,
				title: vm.newImprovementActivity.title
			});
			newImprovementActivity.$save(function (res) {
				// Refresh the list of gate reviews after populating portfolio
				vm.improvementActivities.push(res);
				// Clear new form
				vm.newImprovementActivity = {};
				// Select in view mode the new review
				vm.selectImprovementActivity(_.find(vm.improvementActivities, _.matchesProperty('_id', res._id)));
				// Close new review form done directly in the view's html
			}, function (err) {
				vm.error = err.data.message;
			});
		};

		vm.cancelNewImprovementActivity = function () {
			vm.newImprovementActivity = {};
		};



		// ------------- EDIT ACTIVITY ------------


		var modalUpdateActivity = function (size, activity) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/improvement-activities/views/edit-improvement-activity.client.view.html',
				controller: function ($scope, $modalInstance, activity) {

					$scope.originalImprovementActivity = _.cloneDeep(activity);
					$scope.selectedImprovementActivity = activity;

					$scope.cancelModal = function () {
						$modalInstance.dismiss();
					};
				},
				size: size,
				resolve: {
					activity: function () {
						return activity;
					}
				},
				backdrop: 'static',
				keyboard: false
			});

		};

		vm.selectImprovementActivity = function(activity){
			modalUpdateActivity('lg', activity);
		};

		// ------------------- NG-SWITCH ---------------------

		vm.improvementActivityDetails = 'header';

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

		vm.saveEditHeader = function (improvementActivity, originalImprovementActivity) {
			// Clean-up deepPopulate
			var copyImprovementActivity = _.cloneDeep(improvementActivity);
			copyImprovementActivity.portfolio = allowNull(copyImprovementActivity.portfolio);
			copyImprovementActivity.type = allowNull(copyImprovementActivity.type);
            copyImprovementActivity.assignedTo = allowNull(copyImprovementActivity.assignedTo);
			copyImprovementActivity.reason = allowNull(copyImprovementActivity.reason);
			copyImprovementActivity.priority = allowNull(copyImprovementActivity.priority);
			copyImprovementActivity.state = allowNull(copyImprovementActivity.state);
			copyImprovementActivity.statusReview.currentRecord.status = allowNull(copyImprovementActivity.statusReview.currentRecord.status);
			// Update server header
			ImprovementActivities.updateHeader(
				{
					improvementActivityId: copyImprovementActivity._id
				}, copyImprovementActivity,
				function (res) {
					// Update details pane view with new saved details
					originalImprovementActivity.raisedOnDate = improvementActivity.raisedOnDate;
					originalImprovementActivity.title = improvementActivity.title;
					originalImprovementActivity.description = improvementActivity.description;
                    originalImprovementActivity.type = improvementActivity.type;
                    originalImprovementActivity.portfolio = improvementActivity.portfolio;
                    originalImprovementActivity.assignedTo = improvementActivity.assignedTo;
					originalImprovementActivity.state = improvementActivity.state;
					originalImprovementActivity.reason = improvementActivity.reason;
					originalImprovementActivity.priority = improvementActivity.priority;
					// Close edit header form and back to view
					vm.selectHeaderForm('view');
				},
				function (err) {
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditHeader = function (improvementActivity, originalImprovementActivity) {
			improvementActivity.raisedOnDate = originalImprovementActivity.raisedOnDate;
			improvementActivity.title = originalImprovementActivity.title;
			improvementActivity.description = originalImprovementActivity.description;
            improvementActivity.type = originalImprovementActivity.type;
            improvementActivity.portfolio = originalImprovementActivity.portfolio;
            improvementActivity.assignedTo = originalImprovementActivity.assignedTo;
			improvementActivity.state = originalImprovementActivity.state;
			improvementActivity.reason = originalImprovementActivity.reason;
			improvementActivity.priority = originalImprovementActivity.priority;
			vm.selectHeaderForm('view');
		};


		vm.deleteImprovementActivity = function (improvementActivity) {
			ImprovementActivities.remove({improvementActivityId: improvementActivity._id}, improvementActivity, function (res) {
				vm.improvementActivities = _.without(vm.improvementActivities, improvementActivity);
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

		vm.saveEditStatus = function (improvementActivity, originalImprovementActivity) {
			// Clean-up deepPopulate
			var copyImprovementActivity = _.cloneDeep(improvementActivity);
			copyImprovementActivity.portfolio = allowNull(copyImprovementActivity.portfolio);
            copyImprovementActivity.type = allowNull(copyImprovementActivity.type);
            copyImprovementActivity.assignedTo = allowNull(copyImprovementActivity.assignedTo);
			copyImprovementActivity.reason = allowNull(copyImprovementActivity.reason);
			copyImprovementActivity.priority = allowNull(copyImprovementActivity.priority);
			copyImprovementActivity.state = allowNull(copyImprovementActivity.state);
			copyImprovementActivity.statusReview.currentRecord.status = allowNull(copyImprovementActivity.statusReview.currentRecord.status);
			// Update server header
			ImprovementActivities.updateStatus({improvementActivityId: copyImprovementActivity._id}, copyImprovementActivity,
				function (res) {
					// Change the selected CR
					originalImprovementActivity.statusReview.currentRecord.baselineDeliveryDate = improvementActivity.statusReview.currentRecord.baselineDeliveryDate;
					originalImprovementActivity.statusReview.currentRecord.estimateDeliveryDate = improvementActivity.statusReview.currentRecord.estimateDeliveryDate;
					originalImprovementActivity.statusReview.currentRecord.actualDeliveryDate = improvementActivity.statusReview.currentRecord.actualDeliveryDate;
					originalImprovementActivity.statusReview.currentRecord.status = improvementActivity.statusReview.currentRecord.status;
					originalImprovementActivity.statusReview.currentRecord.completed = improvementActivity.statusReview.currentRecord.completed;
					originalImprovementActivity.statusReview.currentRecord.statusComment = improvementActivity.statusReview.currentRecord.statusComment;
					vm.selectStatusForm('view');
				},
				function (err) {
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditStatus = function (improvementActivity, originalImprovementActivity) {
			improvementActivity.statusReview.currentRecord.baselineDeliveryDate = originalImprovementActivity.statusReview.currentRecord.baselineDeliveryDate;
			improvementActivity.statusReview.currentRecord.estimateDeliveryDate = originalImprovementActivity.statusReview.currentRecord.estimateDeliveryDate;
			improvementActivity.statusReview.currentRecord.actualDeliveryDate = originalImprovementActivity.statusReview.currentRecord.actualDeliveryDate;
			improvementActivity.statusReview.currentRecord.status = originalImprovementActivity.statusReview.currentRecord.status;
			improvementActivity.statusReview.currentRecord.completed = originalImprovementActivity.statusReview.currentRecord.completed;
			improvementActivity.statusReview.currentRecord.statusComment = originalImprovementActivity.statusReview.currentRecord.statusComment;
			vm.selectStatusForm('view');
		};




	}

]);

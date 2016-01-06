'use strict';

angular.module('project-change-requests').controller('ProjectChangeRequestController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcesses', 'ProjectChangeRequests', 'LogReasons', 'ChangeRequestStates', 'LogPriorities','LogStatusIndicators',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcesses, ProjectChangeRequests, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators) {

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

		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = '';
		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchHeaderForm = {};
		$scope.selectHeaderForm = function(string, projectChangeRequest){
			if(string === 'view'){ $scope.switchHeaderForm[projectChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectChangeRequest._id] = 'edit';}
		};

		$scope.switchApplyChangeForm = {};
		$scope.selectSetFinalForm = function(string, projectChangeRequest){
			if(string === 'view'){ $scope.switchApplyChangeForm[projectChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchApplyChangeForm[projectChangeRequest._id] = 'edit';}
		};

		$scope.switchStatusForm = {};
		$scope.selectStatusForm = function(string, projectChangeRequest){
			if(string === 'view'){ $scope.switchStatusForm[projectChangeRequest._id] = 'view';}
			if(string === 'edit'){$scope.switchStatusForm[projectChangeRequest._id] = 'edit';}
		};

		// Baseline

		$scope.switchBaselineDurationForm = {};
		$scope.selectBaselineDurationForm = function(string, baselineDuration){
			if(string === 'view'){ $scope.switchBaselineDurationForm[baselineDuration._id] = 'view';}
			if(string === 'edit'){$scope.switchBaselineDurationForm[baselineDuration._id] = 'edit';}
		};

		$scope.switchBaselineCostForm = {};
		$scope.selectBaselineCostForm = function(string, baselineCost){
			if(string === 'view'){ $scope.switchBaselineCostForm[baselineCost._id] = 'view';}
			if(string === 'edit'){$scope.switchBaselineCostForm[baselineCost._id] = 'edit';}
		};

		$scope.switchBaselineCompletionForm = {};
		$scope.selectBaselineCompletionForm = function(string, baselineCompletion){
			if(string === 'view'){ $scope.switchBaselineCompletionForm[baselineCompletion._id] = 'view';}
			if(string === 'edit'){$scope.switchBaselineCompletionForm[baselineCompletion._id] = 'edit';}
		};

		// Actual

		$scope.switchActualDurationForm = {};
		$scope.selectActualDurationForm = function(string, actualDuration){
			if(string === 'view'){ $scope.switchActualDurationForm[actualDuration._id] = 'view';}
			if(string === 'edit'){$scope.switchActualDurationForm[actualDuration._id] = 'edit';}
		};

		$scope.switchActualCostForm = {};
		$scope.selectActualCostForm = function(string, actualCost){
			if(string === 'view'){ $scope.switchActualCostForm[actualCost._id] = 'view';}
			if(string === 'edit'){$scope.switchActualCostForm[actualCost._id] = 'edit';}
		};

		$scope.switchActualCompletionForm = {};
		$scope.selectActualCompletionForm = function(string, actualCompletion){
			if(string === 'view'){ $scope.switchActualCompletionForm[actualCompletion._id] = 'view';}
			if(string === 'edit'){$scope.switchActualCompletionForm[actualCompletion._id] = 'edit';}
		};



		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortProjectChangeRequests = function(projectChangeRequest) {
			return new Date(projectChangeRequest.raisedOnDate);
		};

        $scope.sortAppliedChanges = function(appliedChange) {
            return new Date(appliedChange.created);
        };


		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectChangeRequestDetails = 'header';

		// ------------- SELECT VIEW PROJECT ------------

		var originalProjectChangeRequest = {};

		$scope.selectProject = function(project) {
			$scope.error = {};
			$scope.selectedProject = null;
			$scope.projectChangeRequestList = null;

			$scope.selectedProjectChangeRequest = null;
			originalProjectChangeRequest = {};

			$scope.selectedProject = project;

			ProjectChangeRequests.getChangeRequestsForProject({
				project: project._id
			}, function (res) {
				$scope.projectChangeRequestList = res;
			}, function (err) {
				$scope.error = err.data.message;
			});

            // Old client-side code now moved server-side
            //ProjectChangeRequests.query({
			//	project: project._id
			//}, function (projectCRs) {
			//	$scope.projectChangeRequestList = _.chain(_.get(project, 'process.gates'))
			//		.map(function (gate) {
			//			return {
			//				gate: gate,
             //               projectChangeRequests: _.filter(projectCRs, _.matchesProperty('gate', gate._id))};
			//		})
			//		.sortBy('gate.position')
			//		.value();
			//}, function (err) {
			//	$scope.error = err.data.message;
			//});
		};

		$scope.cancelViewProject = function(){
			$scope.error = null;
			$scope.selectedProject = null;
			$scope.projectChangeRequestList = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------

		$scope.newProjectCRRaisedOnDateOpened = {};

		$scope.openNewProjectCRRaisedOnDate = function(gate, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.newProjectCRRaisedOnDateOpened[gate._id] = true;
		};

		$scope.newProjectChangeRequest = {};

		$scope.createNewProjectChangeRequest = function(project, gate){
			var newProjectChangeRequest = new ProjectChangeRequests({
				project: project._id,
				gate : gate._id,
				raisedOnDate : $scope.newProjectChangeRequest.raisedOnDate,
				title : $scope.newProjectChangeRequest.title
			});
			newProjectChangeRequest.$save(function(res) {
				// Clear new form
				$scope.newProjectChangeRequest = {};
				// Refresh the list of gate reviews
				_.find($scope.projectChangeRequestList, _.matchesProperty('gate._id', gate._id)).projectChangeRequests.push(res);
				// Select in view mode the new review
				$scope.selectProjectChangeRequest(res);
				// Close new review form done directly in the view's html
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectChangeRequest = function(){
			$scope.newProjectChangeRequest = {};
		};


		// ------------- SELECT GATE REVIEW ------------

		var projectChangeRequestFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of gate reviews

		$scope.selectProjectChangeRequest = function(projectChangeRequest){
            projectChangeRequestFromList[projectChangeRequest._id] = projectChangeRequest;
            ProjectChangeRequests.get({
                projectChangeRequestId:projectChangeRequest._id
			}, function(res){
				$scope.selectedProjectChangeRequest = res;
				originalProjectChangeRequest[projectChangeRequest._id] = _.cloneDeep(res);
				//$scope.selectProjectChangeRequestForm('view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.selectedProjectChangeRequest = null;
				originalProjectChangeRequest = {};
			});
		};

		// ------------- CHANGE GATE ------------

		$scope.changeGate = function(){
			$scope.cancelNewProjectChangeRequest();
			$scope.selectedProjectChangeRequest = null;
			originalProjectChangeRequest = {};
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

		$scope.headerDateOpened = {};
		$scope.openHeaderDate = function(projectChangeRequest, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.headerDateOpened[projectChangeRequest._id] = true;
		};

		$scope.editHeader = function(projectChangeRequest){
			$scope.selectHeaderForm('edit', projectChangeRequest);
		};

		$scope.saveEditHeader = function(projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
			copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
			// Update server header
            ProjectChangeRequests.updateHeader(
				{
                    projectChangeRequestId : copyProjectChangeRequest._id
				}, copyProjectChangeRequest,
				function(res){
					// Update details pane view with new saved details
					originalProjectChangeRequest[projectChangeRequest._id].raisedOnDate = projectChangeRequest.raisedOnDate;
                    originalProjectChangeRequest[projectChangeRequest._id].title = projectChangeRequest.title;
                    originalProjectChangeRequest[projectChangeRequest._id].description = projectChangeRequest.description;
                    originalProjectChangeRequest[projectChangeRequest._id].state = projectChangeRequest.state;
                    originalProjectChangeRequest[projectChangeRequest._id].reason = projectChangeRequest.reason;
                    originalProjectChangeRequest[projectChangeRequest._id].priority = projectChangeRequest.priority;
					// Update list of reviews with new date / title
                    projectChangeRequestFromList[projectChangeRequest._id].raisedOnDate = projectChangeRequest.raisedOnDate;
                    projectChangeRequestFromList[projectChangeRequest._id].title = projectChangeRequest.title;
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', projectChangeRequest);
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		$scope.cancelEditHeader = function(projectChangeRequest){
            projectChangeRequest.raisedOnDate = originalProjectChangeRequest[projectChangeRequest._id].raisedOnDate;
            projectChangeRequest.title = originalProjectChangeRequest[projectChangeRequest._id].title;
            projectChangeRequest.description = originalProjectChangeRequest[projectChangeRequest._id].description;
            projectChangeRequest.state = originalProjectChangeRequest[projectChangeRequest._id].state;
            projectChangeRequest.reason = originalProjectChangeRequest[projectChangeRequest._id].reason;
            projectChangeRequest.priority = originalProjectChangeRequest[projectChangeRequest._id].priority;
			$scope.selectHeaderForm('view', projectChangeRequest);
		};


		$scope.deleteProjectChangeRequest = function(reviewObject, projectChangeRequest){
            ProjectChangeRequests.remove({projectChangeRequestId: projectChangeRequest._id}, projectChangeRequest, function(res){
				reviewObject.projectChangeRequests = _.without(reviewObject.projectChangeRequests, _.find(reviewObject.projectChangeRequests, _.matchesProperty('_id',projectChangeRequest._id)));
				$scope.cancelNewProjectChangeRequest();
				$scope.selectedProjectChangeRequest = null;
				originalProjectChangeRequest = {};
			}, function(err){
				$scope.error = err.data.message;
			});
		};


		// -------------------------------------------------------- APPLY CHANGE -------------------------------------------------

		$scope.applyChange = function(project, projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
			// Run server side applyChange
            ProjectChangeRequests.applyChange(
				{
                    projectChangeRequestId : copyProjectChangeRequest._id
				}, copyProjectChangeRequest,
				function(res){
					// Refresh the object with the current performances values
					$scope.selectProjectChangeRequest(projectChangeRequest);
					$scope.selectSetFinalForm('view', projectChangeRequest);
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		// -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.baselineDeliveryDateOpened = {};
        $scope.openBaselineDeliveryDate = function(projectChangeRequest, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDeliveryDateOpened[projectChangeRequest._id] = true;
        };

        $scope.estimateDeliveryDateOpened = {};
        $scope.openEstimateDeliveryDate = function(projectChangeRequest, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDeliveryDateOpened[projectChangeRequest._id] = true;
        };

        $scope.actualDeliveryDateOpened = {};
        $scope.openActualDeliveryDate = function(projectChangeRequest, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDeliveryDateOpened[projectChangeRequest._id] = true;
        };

		$scope.editStatus = function(projectChangeRequest){
			$scope.selectStatusForm('edit', projectChangeRequest);
		};

		$scope.saveEditStatus = function(projectChangeRequest){
			// Clean-up deepPopulate
			var copyProjectChangeRequest = _.cloneDeep(projectChangeRequest);
            copyProjectChangeRequest.project = _.get(copyProjectChangeRequest.project, '_id');
            copyProjectChangeRequest.gate = _.get(copyProjectChangeRequest.gate, '_id');
			// Update server header
            ProjectChangeRequests.updateStatus( { projectChangeRequestId : copyProjectChangeRequest._id }, copyProjectChangeRequest,
				function(res){
                    // Set the "final" in the gate from the list
                    projectChangeRequestFromList[projectChangeRequest._id].statusReview.currentRecord.completed = projectChangeRequest.statusReview.currentRecord.completed;
                    // Change the selected CR
					originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.baselineDeliveryDate = projectChangeRequest.statusReview.currentRecord.baselineDeliveryDate;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.estimateDeliveryDate = projectChangeRequest.statusReview.currentRecord.estimateDeliveryDate;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.actualDeliveryDate = projectChangeRequest.statusReview.currentRecord.actualDeliveryDate;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.status = projectChangeRequest.statusReview.currentRecord.status;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.completed = projectChangeRequest.statusReview.currentRecord.completed;
                    originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.statusComment = projectChangeRequest.statusReview.currentRecord.statusComment;
                    $scope.selectStatusForm('view', projectChangeRequest);
				},
				function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditStatus = function(projectChangeRequest){
            projectChangeRequest.statusReview.currentRecord.baselineDeliveryDate = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.baselineDeliveryDate;
            projectChangeRequest.statusReview.currentRecord.estimateDeliveryDate = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.estimateDeliveryDate;
            projectChangeRequest.statusReview.currentRecord.actualDeliveryDate = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.actualDeliveryDate;
            projectChangeRequest.statusReview.currentRecord.status = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.status;
            projectChangeRequest.statusReview.currentRecord.completed = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.completed;
            projectChangeRequest.statusReview.currentRecord.statusComment = originalProjectChangeRequest[projectChangeRequest._id].statusReview.currentRecord.statusComment;
            $scope.selectStatusForm('view', projectChangeRequest);
		};


		// -------------------------------------------------------- BASELINE DURATION -------------------------------------------------

		$scope.baselineDurationDateOpened = {};
		$scope.openBaselineDurationDate = function(baselineDurationReview, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.baselineDurationDateOpened[baselineDurationReview._id] = true;
		};

		var originalBaselineDurationReview = {};

		$scope.editBaselineDuration = function(baselineDurationReview){
			originalBaselineDurationReview[baselineDurationReview._id] = _.cloneDeep(baselineDurationReview);
			$scope.selectBaselineDurationForm('edit', baselineDurationReview);
		};

		$scope.saveEditBaselineDuration = function(projectChangeRequest, baselineDurationReview){
            ProjectChangeRequests.updateBaselineDuration(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					baselineDurationReviewId : baselineDurationReview._id
				}, baselineDurationReview,
				function(res){ },
				function(err){
					$scope.error = err.data.message;
				}
			);
			$scope.selectBaselineDurationForm('view', baselineDurationReview);
		};

		$scope.cancelEditBaselineDuration = function(baselineDurationReview){
			baselineDurationReview.newDate = originalBaselineDurationReview[baselineDurationReview._id].newDate;
			$scope.selectBaselineDurationForm('view', baselineDurationReview);
		};


		// -------------------------------------------------------- ACTUAL DURATION -------------------------------------------------

		$scope.actualDurationDateOpened = {};
		$scope.openActualDurationDate = function(actualDurationReview, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.actualDurationDateOpened[actualDurationReview._id] = true;
		};

		var originalActualDurationReview = {};

		$scope.editActualDuration = function(actualDurationReview){
			originalActualDurationReview[actualDurationReview._id] = _.cloneDeep(actualDurationReview);
			$scope.selectActualDurationForm('edit', actualDurationReview);
		};

		$scope.saveEditActualDuration = function(projectChangeRequest, actualDurationReview){
            ProjectChangeRequests.updateActualDuration(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					actualDurationReviewId : actualDurationReview._id
				}, actualDurationReview,
				function(res){ },
				function(err){
					$scope.error = err.data.message;
				}
			);
			$scope.selectActualDurationForm('view', actualDurationReview);
		};

		$scope.cancelEditActualDuration = function(actualDurationReview){
			actualDurationReview.newDate = originalActualDurationReview[actualDurationReview._id].newDate;
			$scope.selectActualDurationForm('view', actualDurationReview);
		};


		// -------------------------------------------------------- BASELINE COST -------------------------------------------------

		var originalBaselineCostReview = {};

		$scope.editBaselineCost = function(baselineCostReview){
			originalBaselineCostReview[baselineCostReview._id] = _.cloneDeep(baselineCostReview);
			$scope.selectBaselineCostForm('edit', baselineCostReview);
		};

		$scope.saveEditBaselineCost = function(projectChangeRequest, baselineCostReview){
            ProjectChangeRequests.updateBaselineCost(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					baselineCostReviewId : baselineCostReview._id
				}, baselineCostReview,
				function(res){ },
				function(err){
					$scope.error = err.data.message;
				}
			);
			$scope.selectBaselineCostForm('view', baselineCostReview);
		};

		$scope.cancelEditBaselineCost = function(baselineCostReview){
			baselineCostReview.newCost = originalBaselineCostReview[baselineCostReview._id].newCost;
			$scope.selectBaselineCostForm('view', baselineCostReview);
		};


		// -------------------------------------------------------- ACTUAL COST -------------------------------------------------

		var originalActualCostReview = {};

		$scope.editActualCost = function(actualCostReview){
			originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
			$scope.selectActualCostForm('edit', actualCostReview);
		};

		$scope.saveEditActualCost = function(projectChangeRequest, actualCostReview){
            ProjectChangeRequests.updateActualCost(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					actualCostReviewId : actualCostReview._id
				}, actualCostReview,
				function(res){ },
				function(err){
					$scope.error = err.data.message;
				}
			);
			$scope.selectActualCostForm('view', actualCostReview);
		};

		$scope.cancelEditActualCost = function(actualCostReview){
			actualCostReview.newCost = originalActualCostReview[actualCostReview._id].newCost;
			$scope.selectActualCostForm('view', actualCostReview);
		};



		// -------------------------------------------------------- BASELINE COMPLETION -------------------------------------------------

		var originalBaselineCompletionReview = {};

		$scope.editBaselineCompletion = function(baselineCompletionReview){
			originalBaselineCompletionReview[baselineCompletionReview._id] = _.cloneDeep(baselineCompletionReview);
			$scope.selectBaselineCompletionForm('edit', baselineCompletionReview);
		};

		$scope.saveEditBaselineCompletion = function(projectChangeRequest, baselineCompletionReview){
            ProjectChangeRequests.updateBaselineCompletion(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					baselineCompletionReviewId : baselineCompletionReview._id
				}, baselineCompletionReview,
				function(res){ },
				function(err){
					$scope.error = err.data.message;
				}
			);
			$scope.selectBaselineCompletionForm('view', baselineCompletionReview);
		};

		$scope.cancelEditBaselineCompletion = function(baselineCompletionReview){
			baselineCompletionReview.newCompletion = originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion;
			$scope.selectBaselineCompletionForm('view', baselineCompletionReview);
		};


		// -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

		var originalActualCompletionReview = {};

		$scope.editActualCompletion = function(actualCompletionReview){
			originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
			$scope.selectActualCompletionForm('edit', actualCompletionReview);
		};

		$scope.saveEditActualCompletion = function(projectChangeRequest, actualCompletionReview){
            ProjectChangeRequests.updateActualCompletion(
				{
                    projectChangeRequestId: projectChangeRequest._id,
					actualCompletionReviewId : actualCompletionReview._id
				}, actualCompletionReview,
				function(res){ },
				function(err){
					$scope.error = err.data.message;
				}
			);
			$scope.selectActualCompletionForm('view', actualCompletionReview);
		};

		$scope.cancelEditActualCompletion = function(actualCompletionReview){
			actualCompletionReview.newCompletion = originalActualCompletionReview[actualCompletionReview._id].newCompletion;
			$scope.selectActualCompletionForm('view', actualCompletionReview);
		};





	}
]);

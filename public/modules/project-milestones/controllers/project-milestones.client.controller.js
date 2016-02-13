'use strict';

angular.module('project-milestones').controller('ProjectMilestoneController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcesses', 'ProjectMilestones', 'ProjectMilestoneTypes', 'MilestoneStates', 'LogStatusIndicators',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcesses, ProjectMilestones, ProjectMilestoneTypes, MilestoneStates, LogStatusIndicators) {

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

			ProjectMilestoneTypes.query(function(projectMilestoneTypes){
				$scope.projectMilestoneTypes = projectMilestoneTypes;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			MilestoneStates.query(function(milestoneStates){
				$scope.milestoneStates = milestoneStates;
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
		$scope.selectHeaderForm = function(string, projectMilestone){
			if(string === 'view'){ $scope.switchHeaderForm[projectMilestone._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectMilestone._id] = 'edit';}
		};

		$scope.switchStatusForm = {};
		$scope.selectStatusForm = function(string, projectMilestone){
			if(string === 'view'){ $scope.switchStatusForm[projectMilestone._id] = 'view';}
			if(string === 'edit'){$scope.switchStatusForm[projectMilestone._id] = 'edit';}
		};


		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortProjectMilestones = function(projectMilestone) {
			return new Date(projectMilestone.statusReview.currentRecord.estimateDeliveryDate);
		};

		$scope.sortAppliedChanges = function(appliedChange) {
			return new Date(appliedChange.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectMilestoneDetails = 'header';

		$scope.activeTab = {};

		// ------------- SELECT VIEW PROJECT ------------

		var originalProjectMilestone = {};

		$scope.selectProject = function(project) {
			$scope.error = {};
			$scope.selectedProject = null;
			$scope.projectMilestoneList = null;

			$scope.selectedProjectMilestone = null;
			originalProjectMilestone = {};

			$scope.selectedProject = project;

			ProjectMilestones.getMilestonesForProject({
				project: project._id
			}, function (res) {
				$scope.projectMilestoneList = res;
			}, function (err) {
				$scope.error = err.data.message;
			});

		};

		$scope.cancelViewProject = function(){
			$scope.error = null;
			$scope.selectedProject = null;
			$scope.projectMilestoneList = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------

		$scope.newProjectMilestone = {};

		$scope.createNewProjectMilestone = function(project, gate){
			var newProjectMilestone = new ProjectMilestones({
				project: project._id,
				gate : gate._id,
				type : $scope.newProjectMilestone.type,
				name : $scope.newProjectMilestone.name
			});
			newProjectMilestone.$save(function(res) {
				// Clear new form
				$scope.newProjectMilestone = {};
				// Refresh the list of gate reviews
				_.find($scope.projectMilestoneList, _.matchesProperty('gate._id', gate._id)).projectMilestones.push(res);
				// Select in view mode the new review
				$scope.selectProjectMilestone(res);
				// Close new review form done directly in the view's html
			}, function(err) {
				console.log(err);
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectMilestone = function(){
			$scope.newProjectMilestone = {};
		};


		// ------------- SELECT GATE REVIEW ------------

		var projectMilestoneFromList = {};
		// Required to update the list when milestones details
		// in the details pane that are also reported in the list of gate reviews

		$scope.selectProjectMilestone = function(projectMilestone){
			projectMilestoneFromList[projectMilestone._id] = projectMilestone;
			ProjectMilestones.get({
				projectMilestoneId:projectMilestone._id
			}, function(res){
				$scope.selectedProjectMilestone = res;
				originalProjectMilestone[projectMilestone._id] = _.cloneDeep(res);
				//$scope.selectProjectMilestoneForm('view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
				$scope.selectedProjectMilestone = null;
				originalProjectMilestone = {};
			});
		};

		// ------------- CHANGE GATE ------------

		$scope.milestoneGate = function(){
			$scope.cancelNewProjectMilestone();
			$scope.selectedProjectMilestone = null;
			originalProjectMilestone = {};
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------


		$scope.editHeader = function(projectMilestone){
			$scope.selectHeaderForm('edit', projectMilestone);
		};

		$scope.saveEditHeader = function(projectMilestone){
			// Clean-up deepPopulate
			var copyProjectMilestone = _.cloneDeep(projectMilestone);
			copyProjectMilestone.project = _.get(copyProjectMilestone.project, '_id');
			copyProjectMilestone.gate = _.get(copyProjectMilestone.gate, '_id');
			// Update server header
			ProjectMilestones.updateHeader(
				{
					projectMilestoneId : copyProjectMilestone._id
				}, copyProjectMilestone,
				function(res){
					// Update details pane view with new saved details
					originalProjectMilestone[projectMilestone._id].name = projectMilestone.name;
					originalProjectMilestone[projectMilestone._id].description = projectMilestone.description;
					originalProjectMilestone[projectMilestone._id].state = projectMilestone.state;
					originalProjectMilestone[projectMilestone._id].type = projectMilestone.type;
					// Update list of reviews with new date / name
					projectMilestoneFromList[projectMilestone._id].name = projectMilestone.name;
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', projectMilestone);
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		$scope.cancelEditHeader = function(projectMilestone){
			projectMilestone.name = originalProjectMilestone[projectMilestone._id].name;
			projectMilestone.description = originalProjectMilestone[projectMilestone._id].description;
			projectMilestone.state = originalProjectMilestone[projectMilestone._id].state;
			projectMilestone.type = originalProjectMilestone[projectMilestone._id].type;
			$scope.selectHeaderForm('view', projectMilestone);
		};


		$scope.deleteProjectMilestone = function(reviewObject, projectMilestone){
			ProjectMilestones.remove({projectMilestoneId: projectMilestone._id}, projectMilestone, function(res){
				reviewObject.projectMilestones = _.without(reviewObject.projectMilestones, _.find(reviewObject.projectMilestones, _.matchesProperty('_id',projectMilestone._id)));
				$scope.cancelNewProjectMilestone();
				$scope.selectedProjectMilestone = null;
				originalProjectMilestone = {};
			}, function(err){
				$scope.error = err.data.message;
			});
		};


		// -------------------------------------------------------- STATUS -------------------------------------------------

		$scope.baselineDeliveryDateOpened = {};
		$scope.openBaselineDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.baselineDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.estimateDeliveryDateOpened = {};
		$scope.openEstimateDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.estimateDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.actualDeliveryDateOpened = {};
		$scope.openActualDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.actualDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.editStatus = function(projectMilestone){
			$scope.selectStatusForm('edit', projectMilestone);
		};

		$scope.saveEditStatus = function(projectMilestone){
			// Clean-up deepPopulate
			var copyProjectMilestone = _.cloneDeep(projectMilestone);
			copyProjectMilestone.project = _.get(copyProjectMilestone.project, '_id');
			copyProjectMilestone.gate = _.get(copyProjectMilestone.gate, '_id');
			// Update server header
			ProjectMilestones.updateStatus( { projectMilestoneId : copyProjectMilestone._id }, copyProjectMilestone,
				function(res){
					// Update the "estimate delivery date" and the "final" in the gate from the list
					projectMilestoneFromList[projectMilestone._id].statusReview.currentRecord.completed = projectMilestone.statusReview.currentRecord.completed;
                    projectMilestoneFromList[projectMilestone._id].statusReview.currentRecord.estimateDeliveryDate = projectMilestone.statusReview.currentRecord.estimateDeliveryDate;
                    // Change the selected CR
					originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.baselineDeliveryDate = projectMilestone.statusReview.currentRecord.baselineDeliveryDate;
					originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.estimateDeliveryDate = projectMilestone.statusReview.currentRecord.estimateDeliveryDate;
					originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.actualDeliveryDate = projectMilestone.statusReview.currentRecord.actualDeliveryDate;
					originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.status = projectMilestone.statusReview.currentRecord.status;
					originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.completed = projectMilestone.statusReview.currentRecord.completed;
					originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.statusComment = projectMilestone.statusReview.currentRecord.statusComment;
					$scope.selectStatusForm('view', projectMilestone);
				},
				function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditStatus = function(projectMilestone){
			projectMilestone.statusReview.currentRecord.baselineDeliveryDate = originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.baselineDeliveryDate;
			projectMilestone.statusReview.currentRecord.estimateDeliveryDate = originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.estimateDeliveryDate;
			projectMilestone.statusReview.currentRecord.actualDeliveryDate = originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.actualDeliveryDate;
			projectMilestone.statusReview.currentRecord.status = originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.status;
			projectMilestone.statusReview.currentRecord.completed = originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.completed;
			projectMilestone.statusReview.currentRecord.statusComment = originalProjectMilestone[projectMilestone._id].statusReview.currentRecord.statusComment;
			$scope.selectStatusForm('view', projectMilestone);
		};




	}
]);

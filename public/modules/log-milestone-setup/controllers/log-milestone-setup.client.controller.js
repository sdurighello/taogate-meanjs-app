'use strict';

angular.module('log-milestone-setup').controller('LogMilestoneSetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'MilestoneStates', 'ProjectMilestoneTypes', 'PortfolioMilestoneTypes', '_','$q',
	function($scope, $stateParams, $location, Authentication, MilestoneStates, ProjectMilestoneTypes, PortfolioMilestoneTypes, _ , $q) {

		// ----------- INIT ---------------

		$scope.init = function(){
			MilestoneStates.query(function(milestoneStates){
				ProjectMilestoneTypes.query(function(projectMilestoneTypes){
					PortfolioMilestoneTypes.query(function(portfolioMilestoneTypes){
						$scope.milestoneStates = milestoneStates;
						$scope.projectMilestoneTypes = projectMilestoneTypes;
						$scope.portfolioMilestoneTypes = portfolioMilestoneTypes;
					});
				});
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



// ----------------------------------------------- MILESTONE STATES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchMilestoneStateForm = {};

		$scope.selectMilestoneStateForm = function(state, string){
			if(string === 'view'){ $scope.switchMilestoneStateForm[state._id] = 'view';}
			if(string === 'new'){$scope.switchMilestoneStateForm[state._id] = 'new';}
			if(string === 'edit'){$scope.switchMilestoneStateForm[state._id] = 'edit';}
		};

		// ------------------- LIST STATES -----------------

		$scope.findMilestoneStates = function() {
			MilestoneStates.query(function(states){
				$scope.milestoneStates = states;
			});
		};

		// ------------------- EDIT -----------------

		var originalMilestoneState = {};
		$scope.selectMilestoneState = function(state){
			$scope.error = null;
			originalMilestoneState[state._id] = _.clone(state);
			$scope.selectMilestoneStateForm(state, 'edit');
		};

		$scope.updateMilestoneState = function(state) {
			$scope.error = null;
			state.$update(function(response) {
				$scope.findMilestoneStates();
				$scope.selectMilestoneStateForm(state, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditMilestoneState = function(state){
			state.name = originalMilestoneState[state._id].name;
			state.description = originalMilestoneState[state._id].description;
			$scope.selectMilestoneStateForm(state, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeMilestoneState = function(state) {
			$scope.error = null;
			state.$remove(function(response) {
				$scope.findMilestoneStates();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createMilestoneState = function() {
			$scope.error = null;
			var state = new MilestoneStates ({
				name: 'New milestone state'
			});
			state.$save(function(response) {
				$scope.findMilestoneStates();
				$scope.selectMilestoneStateForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ----------------------------------------------- PROJECT MILESTONE TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectMilestoneTypeForm = {};

		$scope.selectProjectMilestoneTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchProjectMilestoneTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchProjectMilestoneTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchProjectMilestoneTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST TYPES -----------------

		$scope.findProjectMilestoneTypes = function() {
			ProjectMilestoneTypes.query(function(types){
				$scope.projectMilestoneTypes = types;
			});
		};

		// ------------------- EDIT -----------------

		var originalProjectMilestoneType = {};
		$scope.selectProjectMilestoneType = function(type){
			$scope.error = null;
			originalProjectMilestoneType[type._id] = _.clone(type);
			$scope.selectProjectMilestoneTypeForm(type, 'edit');
		};

		$scope.updateProjectMilestoneType = function(type) {
			$scope.error = null;
            type.$update(function(response) {
				$scope.findProjectMilestoneTypes();
				$scope.selectProjectMilestoneTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditProjectMilestoneType = function(type){
			type.name = originalProjectMilestoneType[type._id].name;
			type.description = originalProjectMilestoneType[type._id].description;
			$scope.selectProjectMilestoneTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeProjectMilestoneType = function(type) {
			$scope.error = null;
			type.$remove(function(response) {
				$scope.findProjectMilestoneTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createProjectMilestoneType = function() {
			$scope.error = null;
			var type = new ProjectMilestoneTypes ({
				name: 'New project milestone type'
			});
			type.$save(function(response) {
				$scope.findProjectMilestoneTypes();
				$scope.selectProjectMilestoneTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};





		// ----------------------------------------------- PORTFOLIO MILESTONE TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioMilestoneTypeForm = {};

		$scope.selectPortfolioMilestoneTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchPortfolioMilestoneTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchPortfolioMilestoneTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchPortfolioMilestoneTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST TYPES -----------------

		$scope.findPortfolioMilestoneTypes = function() {
			PortfolioMilestoneTypes.query(function(types){
				$scope.portfolioMilestoneTypes = types;
			});
		};

		// ------------------- EDIT -----------------

		var originalPortfolioMilestoneType = {};
		$scope.selectPortfolioMilestoneType = function(type){
			$scope.error = null;
			originalPortfolioMilestoneType[type._id] = _.clone(type);
			$scope.selectPortfolioMilestoneTypeForm(type, 'edit');
		};

		$scope.updatePortfolioMilestoneType = function(type) {
			$scope.error = null;
            type.$update(function(response) {
				$scope.findPortfolioMilestoneTypes();
				$scope.selectPortfolioMilestoneTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPortfolioMilestoneType = function(type){
			type.name = originalPortfolioMilestoneType[type._id].name;
			type.description = originalPortfolioMilestoneType[type._id].description;
			$scope.selectPortfolioMilestoneTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removePortfolioMilestoneType = function(type) {
			$scope.error = null;
			type.$remove(function(response) {
				$scope.findPortfolioMilestoneTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createPortfolioMilestoneType = function() {
			$scope.error = null;
			var type = new PortfolioMilestoneTypes ({
				name: 'New portfolio milestone type'
			});
			type.$save(function(response) {
				$scope.findPortfolioMilestoneTypes();
				$scope.selectPortfolioMilestoneTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	}
]);

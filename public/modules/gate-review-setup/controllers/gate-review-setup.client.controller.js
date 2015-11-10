'use strict';

angular.module('gate-review-setup').controller('GateReviewSetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'GateOutcomeScores','GateStatuses','_','$q',
	function($scope, $stateParams, $location, Authentication, GateOutcomeScores, GateStatuses, _ , $q) {

		// ----------- INIT ---------------

		$scope.init = function(){
			GateOutcomeScores.query(function(scores){
				GateStatuses.query(function(statuses){
					$scope.outcomeScores = scores;
					$scope.gateStatuses = statuses;
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


// ----------------------------------------------- OUTCOME SCORES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchTypeForm = {};

		$scope.selectTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findTypes = function() {
			PortfolioTypes.query(function(types){
				$scope.portfolioTypes = _.clone(types);
			});
		};

		// ------------------- EDIT -----------------

		$scope.selectType = function(type){
			$scope.selectTypeForm(type, 'edit');
		};

		$scope.updateType = function(type) {
			type.$update(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditType = function(type){
			$scope.findTypes();
			$scope.selectTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeType = function(type) {
			type.$remove(function(response) {
				$scope.findTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createType = function() {
			var portfolioType = new PortfolioTypes ({
				name: 'New portfolio type'
			});
			portfolioType.$save(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};






	}
]);

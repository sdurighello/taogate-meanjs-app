'use strict';

angular.module('qualitative-analysis').controller('QualitativeAnalysisController', ['$scope','$stateParams', '$location', 'Authentication',
	'Projects','QualitativeImpactGroups', 'QualitativeImpacts', 'QualitativeImpactScores', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects,
             QualitativeImpactGroups, QualitativeImpacts, QualitativeImpactScores, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Projects.query({'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            QualitativeImpactGroups.query(function(impactGroups){
				$scope.impactGroups = impactGroups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            QualitativeImpacts.query(function(impacts){
				$scope.impacts = impacts;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            QualitativeImpactScores.query(function(scores){
				$scope.scores = scores;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			$scope.showScore = {};

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



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchImpactForm = {};

		$scope.selectImpactForm = function(assignedImpact, string){
			if(string === 'view'){$scope.switchImpactForm[assignedImpact._id] = 'view';}
			if(string === 'edit'){$scope.switchImpactForm[assignedImpact._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

		var originalImpactAssignment;
		$scope.selectProject = function(project){
			originalImpactAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio qualitativeAnalysis',
				deepPopulateArray : [
					'portfolio',
					'identification.projectManager','identification.backupProjectManager',
					'qualitativeAnalysis.group','qualitativeAnalysis.impacts.impact'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalImpactAssignment = null;
		};


		// ------------- SELECT IMPACT ASSIGNMENT ---------

		$scope.selectImpactAssignment = function(assignedImpact){
			originalImpactAssignment[assignedImpact._id] = _.clone(assignedImpact);
			$scope.selectImpactForm(assignedImpact, 'edit');
		};



		// ------------- EDIT IMPACT ASSIGNMENT ---------

		$scope.saveAssignedImpact = function(project, assignedGroup, assignedImpact){
            console.log(assignedImpact.score);
			Projects.updateImpactAssignment(
				{
					projectId: project._id,
					assignedGroupId: assignedGroup._id,
					assignedImpactId: assignedImpact._id,
					scoreId: assignedImpact.score
				},{}, function(res){
					$scope.selectImpactForm(assignedImpact, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedImpact = function(assignedImpact){
			assignedImpact.score = originalImpactAssignment[assignedImpact._id].score;
			$scope.selectImpactForm(assignedImpact, 'view');
		};


	}
]);

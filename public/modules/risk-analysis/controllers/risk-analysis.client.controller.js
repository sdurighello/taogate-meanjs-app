'use strict';

angular.module('risk-analysis').controller('RiskAnalysisController', ['$scope', '$stateParams', '$location', 'Authentication',
	'Projects','RiskCategories', 'Risks', 'RiskProbabilities','RiskImpacts','RiskSeverityAssignments','RiskSeverities', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects,
			 RiskCategories, Risks, RiskProbabilities, RiskImpacts, RiskSeverityAssignments, RiskSeverities, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			RiskCategories.query(function(categories){
				$scope.riskCategories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Risks.query(function(risks){
				$scope.risks = risks;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            RiskProbabilities.query(function(probabilities){
				$scope.probabilities = probabilities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            RiskImpacts.query(function(impacts){
                $scope.impacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskSeverities.query(function(severities){
                $scope.severities = severities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskSeverityAssignments.query(function(severityAssignments){
                $scope.severityAssignments = severityAssignments;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			$scope.showRiskAssignment = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };



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

		$scope.switchRiskForm = {};

		$scope.selectRiskForm = function(assignedRisk, string){
			if(string === 'view'){$scope.switchRiskForm[assignedRisk._id] = 'view';}
			if(string === 'edit'){$scope.switchRiskForm[assignedRisk._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------
		var originalRiskAssignment;
		$scope.selectProject = function(project){
			originalRiskAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio riskAnalysis',
				deepPopulateArray : [
					'portfolio',
					'identification.projectManager','identification.backupProjectManager',
					'riskAnalysis.category','riskAnalysis.risks.risk'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalRiskAssignment = null;
		};


		// ------------- SELECT RISK ASSIGNMENT ---------

		$scope.selectRiskAssignment = function(assignedRisk){
			originalRiskAssignment[assignedRisk._id] = _.clone(assignedRisk);
			$scope.selectRiskForm(assignedRisk, 'edit');
		};

        $scope.findSeverityAssignment = function(assignedRisk){
            return  _.find($scope.severityAssignments, function(assignment){
                return ((assignment.probability._id === assignedRisk.probability) && (assignment.impact._id === assignedRisk.impact));
            });
        };


		// ------------- EDIT RISK ASSIGNMENT ---------

		$scope.saveAssignedRisk = function(project, assignedCategory, assignedRisk){
            // url: 'projects/riskAssignment/:projectId/:assignedCategoryId/:assignedRiskId/:impactId/:probabilityId'
			Projects.updateRiskAssignment(
				{
					projectId: project._id,
					assignedCategoryId: assignedCategory._id,
					assignedRiskId: assignedRisk._id
				},{impactId: assignedRisk.impact, probabilityId: assignedRisk.probability}, function(res){
					$scope.selectRiskForm(assignedRisk, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedRisk = function(assignedRisk){
			assignedRisk.impact = originalRiskAssignment[assignedRisk._id].impact;
            assignedRisk.probability = originalRiskAssignment[assignedRisk._id].probability;
			$scope.selectRiskForm(assignedRisk, 'view');
		};


	}
]);

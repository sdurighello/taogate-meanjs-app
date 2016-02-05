'use strict';

angular.module('evaluation-dashboards').controller('DashboardQualitativeController', ['$scope', '$stateParams', '$location', 'Authentication',
	'EvaluationDashboards','Projects','Portfolios', 'GateProcesses', '_','$q',
	function($scope, $stateParams, $location, Authentication, EvaluationDashboards, Projects, Portfolios, GateProcesses, _, $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		var gatePerformances = [];

		$scope.typeOfChart = 'number';

		$scope.init = function(){

			Projects.query({'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
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

			EvaluationDashboards.qualitativeAnalysis(function(res){
				$scope.qualitativeAnalysis = res;
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


        $scope.selectStrategyProfile = function(profile){
            if(profile.parent){
                $scope.selectedStrategyNode = profile.parent.name;
            }
            if(_.isNull(profile.parent)){
                $scope.selectedStrategyNode = 'Unassigned';
            }
            $scope.selectedProjectProfiles = _.filter($scope.qualitativeAnalysis.projectProfiles, function(projectProfile){
                if(profile.parent && projectProfile.parent){
                    return projectProfile.parent._id === profile.parent._id;
                }
                if(_.isNull(profile.parent)){
                    if(_.isNull(projectProfile.parent)){
                        return true;
                    }
                }
            });
        };

        $scope.selectProjectProfile = function(profile){
            $scope.selectedProjectProfile = profile;
        };






	}
]);

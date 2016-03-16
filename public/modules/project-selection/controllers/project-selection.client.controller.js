'use strict';

angular.module('project-selection').controller('ProjectSelectionController', ['$scope','$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'StrategyNodes', 'CategoryGroups', 'PriorityGroups', 'PriorityValues', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, StrategyNodes, CategoryGroups, PriorityGroups, PriorityValues, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

            Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            StrategyNodes.query(function(res){
                $scope.strategyNodes = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            CategoryGroups.query(function(res){
                $scope.categoryGroups = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            PriorityGroups.query(function(res){
                $scope.priorityGroups = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            PriorityValues.query(function(res){
                $scope.priorityValues = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){
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
        };


        // ----------- FILTERS ------------

        $scope.showFilters = false;
        $scope.filterCategorization = {};
        $scope.filterPrioritization = {};

		// ------------- SELECT VIEW PROJECT ------------

        $scope.showEditProjectForm = {};
		var originalProject = {};
		$scope.selectProject = function(project){
			originalProject[project._id] = _.cloneDeep(project);
            $scope.showEditProjectForm[project._id] = true;
		};


		// ------------- EDIT PROJECT ------------

		$scope.saveEditProject = function(project){
			Projects.update({
                _id: project._id,
                selection: project.selection
            }, function(res) {
				$scope.showEditProjectForm[project._id] = false;
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditProject = function(project){
			project.selection = originalProject[project._id].selection;
            $scope.showEditProjectForm[project._id] = false;
		};


	}
]);

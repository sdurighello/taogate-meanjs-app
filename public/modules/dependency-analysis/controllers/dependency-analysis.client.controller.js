'use strict';

angular.module('dependency-analysis').controller('DependencyAnalysisController', ['$scope', '$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'DependencyTypes', 'DependencyStates', 'DependencyImpacts', 'Dependencies', 'LogStatusIndicators', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, DependencyTypes, DependencyStates, DependencyImpacts,
             Dependencies, LogStatusIndicators, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            DependencyTypes.query(function(dependencyTypes){
                $scope.dependencyTypes = dependencyTypes;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
			DependencyStates.query(function(res){
				$scope.dependencyStates = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
            DependencyImpacts.query(function(dependencyImpacts){
                $scope.dependencyImpacts = dependencyImpacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            Dependencies.query(function(dependencies){
                $scope.dependencies = dependencies;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(res){
                $scope.logStatuses = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, dependency){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager,
                userIsSourceProjectManager, userIsSourcePortfolioManager,
                userIsTargetProjectManager, userIsTargetPortfolioManager;

            if(action === 'edit' && user && dependency){
                var source = dependency.source;
                var target = dependency.target;

                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsSourceProjectManager = (user._id === source.identification.projectManager) || (user._id === source.identification.backupProjectManager);
                if(source.portfolio){
                    userIsSourcePortfolioManager = (user._id === source.portfolio.portfolioManager) || (user._id === source.portfolio.backupPortfolioManager);
                }
                userIsTargetProjectManager = (user._id === target.identification.projectManager) || (user._id === target.identification.backupProjectManager);
                if(target.portfolio){
                    userIsTargetPortfolioManager = (user._id === target.portfolio.portfolioManager) || (user._id === target.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero ||
                    userIsSourceProjectManager || userIsSourcePortfolioManager ||
                    userIsTargetProjectManager || userIsTargetPortfolioManager;
            }

            if(action === 'new' && user){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = !!_.some(user.roles, function(role){
                    return role === 'portfolioManager';
                });
                userIsProjectManager = !!_.some(user.roles, function(role){
                    return role === 'projectManager';
                });
                return userIsSuperhero || userIsPortfolioManager || userIsProjectManager;
            }
        };


		// ------- DATE PICKER ------

		$scope.openRequiredByDatePickerNew = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.requiredByDatePickerOpenedNew = true;
		};

		$scope.openRequiredByDatePickerEdit = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.requiredByDatePickerOpenedEdit = true;
		};



		// ------------------- NG-SWITCH ---------------------

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, dependency){
            if(string === 'view'){ $scope.switchHeaderForm[dependency._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[dependency._id] = 'edit';}
        };

        $scope.switchStatusForm = {};
        $scope.selectStatusForm = function(string, dependency){
            if(string === 'view'){ $scope.switchStatusForm[dependency._id] = 'view';}
            if(string === 'edit'){$scope.switchStatusForm[dependency._id] = 'edit';}
        };

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

        // ------------------- OTHER VARIABLES ---------------------

        $scope.projectDependencyDetails = 'header';

		// ------------- CREATE NEW DEPENDENCY -----------

		$scope.newDependency = {};

		$scope.createDependency = function(){
			var newDependency = new Dependencies({
                name: $scope.newDependency.name,
                description: $scope.newDependency.description,
                type: $scope.newDependency.type,
                state: $scope.newDependency.state,
                impact: $scope.newDependency.impact,
                source: $scope.newDependency.source,
                target: $scope.newDependency.target
			});
			newDependency.$save(function(res) {
				// Add new dependency to view after saving to server
				$scope.dependencies.push(res);
				// Clear form fields
				$scope.newDependency = {};
                // Open the new dependency in the view panel
                $scope.selectDependency(res);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelNewDependency = function(){
			$scope.newDependency = {};
		};


		// ------------- SELECT VIEW DEPENDENCY ------------

		var originalDependency = {};

		$scope.selectDependency = function(dependency){
            $scope.selectedDependency = dependency;
            originalDependency[dependency._id] = _.cloneDeep(dependency);
		};

        // -------------------------------------------------------- HEADER -------------------------------------------------


        $scope.editHeader = function(dependency){
            $scope.selectHeaderForm('edit', dependency);
        };

        $scope.saveEditHeader = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            Dependencies.updateHeader(
                {
                    dependencyId : dependency._id
                }, copyDependency,
                function(res){
                    // Update details pane view with new saved details
                    originalDependency[dependency._id].name = dependency.name;
                    originalDependency[dependency._id].description = dependency.description;
                    originalDependency[dependency._id].source = dependency.source;
                    originalDependency[dependency._id].target = dependency.target;
                    originalDependency[dependency._id].state = dependency.state;
                    originalDependency[dependency._id].type = dependency.type;
                    originalDependency[dependency._id].impact = dependency.impact;

                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', dependency);
                },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditHeader = function(dependency){
            dependency.name = originalDependency[dependency._id].name;
            dependency.description = originalDependency[dependency._id].description;
            dependency.source = originalDependency[dependency._id].source;
            dependency.target = originalDependency[dependency._id].target;
            dependency.state = originalDependency[dependency._id].state;
            dependency.type = originalDependency[dependency._id].type;
            dependency.impact = originalDependency[dependency._id].impact;
            $scope.selectHeaderForm('view', dependency);
        };


        $scope.deleteDependency = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            Dependencies.remove({dependencyId: dependency._id}, copyDependency, function(res){
                $scope.dependencies = _.without($scope.dependencies, dependency);
                $scope.cancelNewDependency();
                $scope.selectedDependency = null;
                originalDependency = {};
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.baselineDeliveryDateOpened = {};
        $scope.openBaselineDeliveryDate = function(dependency, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDeliveryDateOpened[dependency._id] = true;
        };

        $scope.estimateDeliveryDateOpened = {};
        $scope.openEstimateDeliveryDate = function(dependency, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDeliveryDateOpened[dependency._id] = true;
        };

        $scope.actualDeliveryDateOpened = {};
        $scope.openActualDeliveryDate = function(dependency, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDeliveryDateOpened[dependency._id] = true;
        };

        $scope.editStatus = function(dependency){
            $scope.selectStatusForm('edit', dependency);
        };

        $scope.saveEditStatus = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            Dependencies.updateStatus( { dependencyId : dependency._id }, copyDependency,
                function(res){
                    // Change the selected CR
                    originalDependency[dependency._id].statusReview.currentRecord.baselineDeliveryDate = dependency.statusReview.currentRecord.baselineDeliveryDate;
                    originalDependency[dependency._id].statusReview.currentRecord.estimateDeliveryDate = dependency.statusReview.currentRecord.estimateDeliveryDate;
                    originalDependency[dependency._id].statusReview.currentRecord.actualDeliveryDate = dependency.statusReview.currentRecord.actualDeliveryDate;
                    originalDependency[dependency._id].statusReview.currentRecord.status = dependency.statusReview.currentRecord.status;
                    originalDependency[dependency._id].statusReview.currentRecord.completed = dependency.statusReview.currentRecord.completed;
                    originalDependency[dependency._id].statusReview.currentRecord.statusComment = dependency.statusReview.currentRecord.statusComment;
                    $scope.selectStatusForm('view', dependency);
                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function(dependency){
            dependency.statusReview.currentRecord.baselineDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.baselineDeliveryDate;
            dependency.statusReview.currentRecord.estimateDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.estimateDeliveryDate;
            dependency.statusReview.currentRecord.actualDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.actualDeliveryDate;
            dependency.statusReview.currentRecord.status = originalDependency[dependency._id].statusReview.currentRecord.status;
            dependency.statusReview.currentRecord.completed = originalDependency[dependency._id].statusReview.currentRecord.completed;
            dependency.statusReview.currentRecord.statusComment = originalDependency[dependency._id].statusReview.currentRecord.statusComment;
            $scope.selectStatusForm('view', dependency);
        };


	}
]);

'use strict';

angular.module('dependency-analysis').controller('DependencyAnalysisController', ['$scope', '$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'DependencyTypes', 'DependencyStates', 'DependencyImpacts', 'Dependencies', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, DependencyTypes, DependencyStates, DependencyImpacts, Dependencies, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

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

            Dependencies.updateHeader(
                {
                    dependencyId : dependency._id
                }, dependency,
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
            dependency.state = originalDependency[dependency._id].state;
            dependency.type = originalDependency[dependency._id].type;
            $scope.selectHeaderForm('view', dependency);
        };


        $scope.deleteDependency = function(dependency){
            Dependencies.remove({dependencyId: dependency._id}, dependency, function(res){
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
            Dependencies.updateStatus( { dependencyId : dependency._id }, dependency,
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

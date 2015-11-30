'use strict';

angular.module('dependency-analysis').controller('DependencyAnalysisController', ['$scope', '$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'DependencyTypes', 'DependencyImpacts', 'Dependencies', '_','$q',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, DependencyTypes, DependencyImpacts, Dependencies, _ , $q) {

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

		$scope.switchDependencyForm = {};

		$scope.selectDependencyForm = function(string){
			if(string === 'default'){ $scope.switchDependencyForm = 'default';}
			if(string === 'new'){$scope.switchDependencyForm = 'new';}
			if(string === 'view'){ $scope.switchDependencyForm = 'view';}
			if(string === 'edit'){$scope.switchDependencyForm = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};


		// ------------- CREATE NEW DEPENDENCY -----------

		$scope.newDependency = {};

		$scope.createDependency = function(){
			var newDependency = new Dependencies({
                name: $scope.newDependency.name,
                description: $scope.newDependency.description,
                type: $scope.newDependency.type,
                impact: $scope.newDependency.impact,
                source: $scope.newDependency.source,
                target: $scope.newDependency.target,
                requiredByDate: $scope.newDependency.requiredByDate
			});
			newDependency.$save(function(response) {
				// Add new dependency to view after saving to server
				$scope.dependencies.unshift(newDependency);
				// Clear form fields
				$scope.newDependency = {};
				$scope.selectDependencyForm('default');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelNewDependency = function(){
			$scope.newDependency = {};
			$scope.selectDependencyForm('default');
		};


		// ------------- SELECT VIEW DEPENDENCY ------------

		var originalDependency;
		var clickedDependency;
		$scope.selectDependency = function(dependency){
			// Save the clicked dependency to update its text if changes to name happen
			clickedDependency = dependency;
			// Get the full dependency fat object from the "dependencyById" server function that populates everything
			Dependencies.get({
                dependencyId:dependency._id,
				retPropertiesString : 'user created name description type impact source target requiredByDate',
				deepPopulateArray : []
			}, function(res){
				$scope.selectedDependency = res;
				originalDependency = _.cloneDeep(res);
				$scope.selectDependencyForm('view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewDependency = function(){
			$scope.selectedDependency = null;
			clickedDependency = null;
			$scope.selectDependencyForm('default');
		};


		// ------------- EDIT DEPENDENCY ------------

		$scope.editDependency = function(){
			// Clean up the deep populate
			var dependencyCopy = _.cloneDeep($scope.selectedDependency);

			// Save the dependency to the server
			Dependencies.update(dependencyCopy, function(res) {
				// Update the text on the dependency list (dependency from $scope.dependencies)
				clickedDependency.name = res.name;
				$scope.selectDependency($scope.selectedDependency);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditDependency = function(){
			$scope.selectedDependency = _.cloneDeep(originalDependency);
			$scope.selectDependency($scope.selectedDependency);
		};



		// ------------- DELETE DEPENDENCY ------------

		$scope.deleteDependency = function(){
			Dependencies.remove({},{_id: $scope.selectedDependency._id}, function(dependencyRes){
				// Remove dependency from the "dependencies" collection
				$scope.dependencies = _.without($scope.dependencies, clickedDependency);
				$scope.selectedDependency = null;
				clickedDependency = null;
				$scope.selectDependencyForm('default');
			}, function(err){
				$scope.error = err.data.message;
			});
		};




	}
]);

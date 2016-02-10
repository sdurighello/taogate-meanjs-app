'use strict';

angular.module('dependency-setup').controller('DependencySetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'DependencyImpacts', 'DependencyTypes', 'DependencyStates', '$q', '_',
	function($scope, $stateParams, $location, Authentication, DependencyImpacts, DependencyTypes, DependencyStates, $q, _) {

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){
            DependencyImpacts.query(function(impacts){
                $scope.dependencyImpacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            DependencyTypes.query(function(types){
                $scope.dependencyTypes = types;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
			DependencyStates.query(function(res){
				$scope.dependencyStates = res;
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


// ---------------------------------------------------- DEPENDENCY IMPACTS --------------------------------------

		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
			//accept: function (sourceItemHandleScope, destSortableScope) {
			//    //override to determine drag is allowed or not. default is true.
			//    return true;
			//},
			//itemMoved: function (event) {
			//
			//},
			orderChanged: function(event) {
				for(var i = 0; i < $scope.dependencyImpacts.length; i++){
					$scope.updateImpact($scope.dependencyImpacts[i]);
				}
			}
			//containment: '#board',//optional param.
			//clone: true //optional param for clone feature.
		};

		/*
		 event object - structure
		 source:
		 index: original index before move.
		 itemScope: original item scope before move.
		 sortableScope: original sortable list scope.
		 dest:
		 index: index after move.
		 sortableScope: destination sortable scope.
		 -------------
		 sourceItemScope - the scope of the item being dragged.
		 destScope - the sortable destination scope, the list.
		 destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
		 */


		// ------------------- NG-SWITCH ---------------------

		$scope.selectImpactForm = function(string){
			if(string === 'view'){ $scope.switchImpactForm = 'view';}
			if(string === 'edit'){$scope.switchImpactForm = 'edit';}
		};

		// ------------------- LIST OF IMPACTS -----------------

		$scope.findImpacts = function() {
            $scope.initError = [];
			DependencyImpacts.query(function(impacts){
				$scope.dependencyImpacts = impacts;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalImpact;
		$scope.selectImpact = function(impact){
			$scope.error = null;
			$scope.selectImpactForm('view');
			$scope.dependencyImpact = impact;
			originalImpact = _.clone(impact);
		};

		$scope.updateImpact = function(impact) {
			$scope.error = null;
			impact.position = _.indexOf($scope.dependencyImpacts, impact) + 1;
			impact.$update(function(response) {
				$scope.selectImpactForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditImpact = function(impact){
			impact.name = originalImpact.name;
			impact.numericalValue = originalImpact.numericalValue;
			impact.description = originalImpact.description;
			$scope.selectImpactForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeImpact = function(impact) {
			$scope.error = null;
			impact.$remove(function(response) {
				$scope.dependencyImpacts = _.without($scope.dependencyImpacts, impact);
				for(var i = 0; i < $scope.dependencyImpacts.length; i++){
					if($scope.dependencyImpacts[i].position > impact.position){
						$scope.updateImpact($scope.dependencyImpacts[i]);
					}
				}
				$scope.dependencyImpact = null;
				$scope.selectImpactForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createImpact = function() {
			$scope.error = null;
			var dependencyImpact = new DependencyImpacts ({
				name: 'New impact level',
				numericalValue: 0,
				position: $scope.dependencyImpacts.length + 1
			});
			dependencyImpact.$save(function(response) {
				$scope.findImpacts();
				$scope.selectImpactForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};




// ----------------------------------------------- TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchTypeForm = {};

		$scope.selectTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findTypes = function() {
            $scope.initError = [];
			DependencyTypes.query(function(types){
				$scope.dependencyTypes = types;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalType = {};
		$scope.selectType = function(type){
			$scope.error = null;
			originalType[type._id] = _.clone(type);
			$scope.selectTypeForm(type, 'edit');
		};

		$scope.updateType = function(type) {
			$scope.error = null;
			type.$update(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditType = function(type){
			type.name = originalType[type._id].name;
			type.description = originalType[type._id].description;
			$scope.selectTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeType = function(type) {
			$scope.error = null;
			type.$remove(function(response) {
				$scope.findTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createType = function() {
			$scope.error = null;
			var type = new DependencyTypes ({
				name: 'New dependency type'
			});
			type.$save(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ----------------------------------------------- STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchStateForm = {};

        $scope.selectStateForm = function(state, string){
            if(string === 'view'){ $scope.switchStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST OF TYPES -----------------

        $scope.findStates = function() {
            $scope.initError = [];
            DependencyStates.query(function(states){
                $scope.dependencyStates = states;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalState = {};
        $scope.selectState = function(state){
            $scope.error = null;
            originalState[state._id] = _.clone(state);
            $scope.selectStateForm(state, 'edit');
        };

        $scope.updateState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findStates();
                $scope.selectStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditState = function(state){
            state.name = originalState[state._id].name;
            state.description = originalState[state._id].description;
            $scope.selectStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createState = function() {
            $scope.error = null;
            var state = new DependencyStates ({
                name: 'New dependency state'
            });
            state.$save(function(response) {
                $scope.findStates();
                $scope.selectStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };





    }
]);

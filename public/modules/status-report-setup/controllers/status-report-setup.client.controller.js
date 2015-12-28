'use strict';

angular.module('status-report-setup').controller('StatusReportSetupController', ['$scope','$stateParams', '$location', 'Authentication',
	'LogStatusIndicators', 'LogStatusAreas', '_','$q',
	function($scope, $stateParams, $location, Authentication, LogStatusIndicators, LogStatusAreas, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatusIndicators = logStatusIndicators;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogStatusAreas.query(function(logStatusAreas){
				$scope.logStatusAreas = logStatusAreas;
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



// ----------------------------------------------- STATUS-INDICATORS ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchStatusIndicatorForm = {};

		$scope.selectStatusIndicatorForm = function(status, string){
			if(string === 'view'){ $scope.switchStatusIndicatorForm[status._id] = 'view';}
			if(string === 'new'){$scope.switchStatusIndicatorForm[status._id] = 'new';}
			if(string === 'edit'){$scope.switchStatusIndicatorForm[status._id] = 'edit';}
		};

		// ------------------- LIST OF STATUSES -----------------

		$scope.findStatusIndicators = function() {
			$scope.initError = [];
			LogStatusIndicators.query(function(statuses){
				$scope.logStatusIndicators = statuses;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalStatusIndicator = {};
		$scope.selectStatusIndicator = function(statusIndicator){
			$scope.error = null;
			originalStatusIndicator[statusIndicator._id] = _.clone(statusIndicator);
			$scope.selectStatusIndicatorForm(statusIndicator, 'edit');
		};

		$scope.updateStatusIndicator = function(statusIndicator) {
			$scope.error = null;
			statusIndicator.$update(function(res) {
				$scope.findStatusIndicators();
				$scope.selectStatusIndicatorForm(statusIndicator, 'view');
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditStatusIndicator = function(statusIndicator){
            statusIndicator.name = originalStatusIndicator[statusIndicator._id].name;
            statusIndicator.description = originalStatusIndicator[statusIndicator._id].description;
			$scope.selectStatusIndicatorForm(statusIndicator, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeStatusIndicator = function(statusIndicator) {
			$scope.error = null;
            statusIndicator.$remove(function(res) {
				$scope.findStatusIndicators();
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createStatusIndicator = function() {
			$scope.error = null;
			var statusIndicator = new LogStatusIndicators ({
				name: 'New status indicator'
			});
			statusIndicator.$save(function(res) {
				$scope.findStatusIndicators();
				$scope.selectStatusIndicatorForm(res, 'view');

			}, function(err) {
				$scope.error = err.data.message;
			});
		};


// ----------------------------------------------- STATUS-AREAS ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchStatusAreaForm = {};

        $scope.selectStatusAreaForm = function(status, string){
            if(string === 'view'){ $scope.switchStatusAreaForm[status._id] = 'view';}
            if(string === 'new'){$scope.switchStatusAreaForm[status._id] = 'new';}
            if(string === 'edit'){$scope.switchStatusAreaForm[status._id] = 'edit';}
        };

        // ------------------- LIST OF STATUSES -----------------

        $scope.findStatusAreas = function() {
            $scope.initError = [];
            LogStatusAreas.query(function(statuses){
                $scope.logStatusAreas = statuses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalStatusArea = {};
        $scope.selectStatusArea = function(statusArea){
            $scope.error = null;
            originalStatusArea[statusArea._id] = _.clone(statusArea);
            $scope.selectStatusAreaForm(statusArea, 'edit');
        };

        $scope.updateStatusArea = function(statusArea) {
            $scope.error = null;
            statusArea.$update(function(res) {
                $scope.findStatusAreas();
                $scope.selectStatusAreaForm(statusArea, 'view');
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditStatusArea = function(statusArea){
            statusArea.name = originalStatusArea[statusArea._id].name;
            statusArea.description = originalStatusArea[statusArea._id].description;
            $scope.selectStatusAreaForm(statusArea, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeStatusArea = function(statusArea) {
            $scope.error = null;
            statusArea.$remove(function(res) {
                $scope.findStatusAreas();
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createStatusArea = function() {
            $scope.error = null;
            var statusArea = new LogStatusAreas ({
                name: 'New status area'
            });
            statusArea.$save(function(res) {
                $scope.findStatusAreas();
                $scope.selectStatusAreaForm(res, 'view');

            }, function(err) {
                $scope.error = err.data.message;
            });
        };



	}
]);

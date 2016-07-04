'use strict';

angular.module('status-report-setup').controller('StatusReportSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'LogStatusIndicators', 'LogStatusAreas', '_','$q', 'StatusReportTypes',
	function($rootScope, $scope, $stateParams, $location, Authentication, LogStatusIndicators, LogStatusAreas, _ , $q, StatusReportTypes) {

		$rootScope.staticMenu = false;

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

            StatusReportTypes.query(function(res){
                $scope.statusReportTypes = res;
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

        
        $scope.colors = [
            {colorName: 'Silver', colorString: 'silver'},
            {colorName: 'Gray', colorString: 'gray'},
            {colorName: 'White', colorString: 'white'},
            {colorName: 'Red', colorString: 'red'},
            {colorName: 'Purple', colorString: 'purple'},
            {colorName: 'Fuchsia', colorString: 'fuchsia'},
            {colorName: 'Green', colorString: 'green'},
            {colorName: 'Olive', colorString: 'olive'},
            {colorName: 'Yellow', colorString: 'yellow'},
            {colorName: 'Navy', colorString: 'navy'},
            {colorName: 'Teal', colorString: 'teal'},
            {colorName: 'Aqua', colorString: 'aqua'},
            {colorName: 'Orange', colorString: 'orange'}
        ];

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

        $scope.applicableToList = [
            {name: 'Project', text: 'project'},
            {name: 'Portfolio', text: 'portfolio'},
            {name: 'Project + Portfolio', text: 'both'}
        ];

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
            statusArea.applicableTo = originalStatusArea[statusArea._id].applicableTo;
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
                name: 'New status area',
                applicableTo : 'both'
            });
            statusArea.$save(function(res) {
                $scope.findStatusAreas();
                $scope.selectStatusAreaForm(res, 'view');

            }, function(err) {
                $scope.error = err.data.message;
            });
        };



        // ----------------------------------------------- STATUS-TYPES ---------------------------------------


        // ------------------- NG-SWITCH ---------------------

        $scope.switchStatusTypeForm = {};

        $scope.selectStatusTypeForm = function(status, string){
            if(string === 'view'){ $scope.switchStatusTypeForm[status._id] = 'view';}
            if(string === 'new'){$scope.switchStatusTypeForm[status._id] = 'new';}
            if(string === 'edit'){$scope.switchStatusTypeForm[status._id] = 'edit';}
        };

        // ------------------- LIST OF TYPES -----------------

        $scope.findStatusTypes = function() {
            $scope.initError = [];
            StatusReportTypes.query(function(statuses){
                $scope.statusReportTypes = statuses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalStatusType = {};
        $scope.selectStatusType = function(statusType){
            $scope.error = null;
            originalStatusType[statusType._id] = _.clone(statusType);
            $scope.selectStatusTypeForm(statusType, 'edit');
        };

        $scope.updateStatusType = function(statusType) {
            $scope.error = null;
            statusType.$update(function(res) {
                $scope.findStatusTypes();
                $scope.selectStatusTypeForm(statusType, 'view');
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditStatusType = function(statusType){
            statusType.name = originalStatusType[statusType._id].name;
            statusType.description = originalStatusType[statusType._id].description;
            $scope.selectStatusTypeForm(statusType, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeStatusType = function(statusType) {
            $scope.error = null;
            statusType.$remove(function(res) {
                $scope.findStatusTypes();
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createStatusType = function() {
            $scope.error = null;
            var statusType = new StatusReportTypes ({
                name: 'New report type'
            });
            statusType.$save(function(res) {
                $scope.findStatusTypes();
                $scope.selectStatusTypeForm(res, 'view');

            }, function(err) {
                $scope.error = err.data.message;
            });
        };




    }
]);

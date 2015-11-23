'use strict';

angular.module('financial-analysis-setup').controller('FinancialAnalysisSetupController', ['$scope', '$stateParams', '$location',
    'Authentication','FinancialBenefitGroups','FinancialBenefitTypes','FinancialCostGroups','FinancialCostTypes','$q', '_',
	function($scope, $stateParams, $location, Authentication, FinancialBenefitGroups, FinancialBenefitTypes, FinancialCostGroups,
             FinancialCostTypes, $q, _) {

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){
            FinancialBenefitGroups.query(function(benefitGroups){
                $scope.benefitGroups = benefitGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialBenefitTypes.query(function(benefitTypes){
                $scope.benefitTypes = benefitTypes;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialCostGroups.query(function(costGroups){
                $scope.costGroups = costGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialCostTypes.query(function(costTypes){
                $scope.costTypes = costTypes;
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

// ---------------------------------------------------- BENEFITS --------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchBenefitGroupForm = {};

		$scope.selectBenefitGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchBenefitGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchBenefitGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchBenefitGroupForm[group._id] = 'edit';}
		};

		$scope.switchBenefitTypeForm = {};

		$scope.selectBenefitTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchBenefitTypeForm[type._id] = 'view';}
			if(string === 'edit'){$scope.switchBenefitTypeForm[type._id] = 'edit';}
		};

		// ----------------- REFRESH BENEFIT GROUP LIST ------------

		$scope.benefitGroupList = function(){
            $scope.initError = [];
            FinancialBenefitGroups.query(function(groups){
				$scope.benefitGroups = groups;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE BENEFIT GROUP ----------------

		$scope.createBenefitGroup = function() {
			$scope.error = null;

			var benefitGroup = new FinancialBenefitGroups ({
				name: 'New benefit group',
				description: '',
				benefitTypes: []
			});

			benefitGroup.$save(function(response) {
				$scope.benefitGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditBenefitGroup = {};

		$scope.selectBenefitGroup = function(group){
			originalEditBenefitGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectBenefitGroupForm(group, 'edit');
		};

		$scope.updateBenefitGroup = function(group) {
			group.$update(function(response) {
				$scope.selectBenefitGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditBenefitGroup = function(group){
			$scope.error = null;
			group.name = originalEditBenefitGroup[group._id].name;
			group.description = originalEditBenefitGroup[group._id].description;
			$scope.selectBenefitGroupForm(group, 'view');
		};

		// ------------------- REMOVE BENEFIT GROUP -----------------

		$scope.removeBenefitGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.benefitGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------ CREATE BENEFIT TYPE ----------------

		$scope.createBenefitType = function(group) {
			$scope.error = null;

			var benefitType = new FinancialBenefitTypes ({
				name: 'New benefit type',
				description: ''
			});

			benefitType.$save(function(benefitRes) {
				group.benefitTypes.push(benefitRes);
				group.$update(function(groupRes) {

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT BENEFIT TYPE-----------------

		var originalEditBenefitType = {};

		$scope.selectEditBenefitType = function(group, type){
			originalEditBenefitType[type._id] = _.clone(type);
			$scope.selectBenefitTypeForm(type, 'edit');
		};

		$scope.updateBenefitType = function(group, type) {
			FinancialBenefitTypes.update(type, function(response) {
				$scope.selectBenefitTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditBenefitType = function(type){
			$scope.error = null;
            type.name = originalEditBenefitType[type._id].name;
            type.description = originalEditBenefitType[type._id].description;
			$scope.selectBenefitTypeForm(type, 'view');
		};

		// ------------------- REMOVE BENEFIT TYPE-----------------

		$scope.removeBenefitType = function(group, type) {
			$scope.error = null;
            FinancialBenefitTypes.remove({},type, function(res){
                group.benefitTypes = _.without(group.benefitTypes, type);
            }, function(err){
                $scope.error = err.data.message;
            });
		};


// ---------------------------------------------------- COSTS --------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchCostGroupForm = {};

        $scope.selectCostGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchCostGroupForm[group._id] = 'view';}
            if(string === 'new'){$scope.switchCostGroupForm[group._id] = 'new';}
            if(string === 'edit'){$scope.switchCostGroupForm[group._id] = 'edit';}
        };

        $scope.switchCostTypeForm = {};

        $scope.selectCostTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchCostTypeForm[type._id] = 'view';}
            if(string === 'edit'){$scope.switchCostTypeForm[type._id] = 'edit';}
        };

        // ----------------- REFRESH COST GROUP LIST ------------

        $scope.costGroupList = function(){
            $scope.initError = [];
            FinancialCostGroups.query(function(groups){
                $scope.costGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------ CREATE COST GROUP ----------------

        $scope.createCostGroup = function() {
            $scope.error = null;

            var costGroup = new FinancialCostGroups ({
                name: 'New cost group',
                description: '',
                costTypes: []
            });

            costGroup.$save(function(response) {
                $scope.costGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT GROUP -----------------

        var originalEditCostGroup = {};

        $scope.selectCostGroup = function(group){
            originalEditCostGroup[group._id] = _.clone(group);
            $scope.error = null;
            $scope.selectCostGroupForm(group, 'edit');
        };

        $scope.updateCostGroup = function(group) {
            group.$update(function(response) {
                $scope.selectCostGroupForm(group, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCostGroup = function(group){
            $scope.error = null;
            group.name = originalEditCostGroup[group._id].name;
            group.description = originalEditCostGroup[group._id].description;
            $scope.selectCostGroupForm(group, 'view');
        };

        // ------------------- REMOVE COST GROUP -----------------

        $scope.removeCostGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.costGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------ CREATE COST TYPE----------------

        $scope.createCostType = function(group) {
            $scope.error = null;

            var costType = new FinancialCostTypes ({
                name: 'New cost type',
                description: ''
            });

            costType.$save({groupId: group._id}, function(res) {
                // Add new type to the view group
                group.costTypes.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        // ------------------- EDIT COST TYPE-----------------

        var originalEditCostType = {};

        $scope.selectEditCostType = function(group, type){
            originalEditCostType[type._id] = _.clone(type);
            $scope.selectCostTypeForm(type, 'edit');
        };

        $scope.updateCostType = function(group, type) {
            FinancialCostTypes.update(type, function(response) {
                $scope.selectCostTypeForm(type, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCost = function(type){
            $scope.error = null;
            type.name = originalEditCostType[type._id].name;
            type.description = originalEditCostType[type._id].description;
            $scope.selectCostTypeForm(type, 'view');
        };

        // ------------------- REMOVE COST TYPE-----------------

        $scope.removeCostType = function(group, type) {
            $scope.error = null;

            FinancialCostTypes.remove({groupId: group._id}, type, function(res){
                group.costTypes = _.without(group.costTypes, type);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


    }
]);

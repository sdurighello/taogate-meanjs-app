'use strict';

angular.module('financial-analysis-setup').controller('FinancialAnalysisSetupController', ['$scope', '$stateParams', '$location',
    'Authentication','FinancialBenefitGroups','FinancialBenefits','FinancialCostGroups','FinancialCosts','$q', '_',
	function($scope, $stateParams, $location, Authentication, FinancialBenefitGroups, FinancialBenefits, FinancialCostGroups,
             FinancialCosts, $q, _) {

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){
            FinancialBenefitGroups.query(function(benefitGroups){
                $scope.benefitGroups = benefitGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialBenefits.query(function(benefits){
                $scope.benefits = benefits;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialCostGroups.query(function(costGroups){
                $scope.costGroups = costGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialCosts.query(function(costs){
                $scope.costs = costs;
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

		$scope.switchBenefitForm = {};

		$scope.selectBenefitForm = function(benefit, string){
			if(string === 'view'){ $scope.switchBenefitForm[benefit._id] = 'view';}
			if(string === 'edit'){$scope.switchBenefitForm[benefit._id] = 'edit';}
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
				description: 'new group description',
				benefits: []
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


		// ------------------ CREATE BENEFIT ----------------

		$scope.createBenefit = function(group) {
			$scope.error = null;

			var benefit = new FinancialBenefits ({
				name: 'New benefit',
				description: 'New benefit description'
			});

			benefit.$save(function(benefitRes) {
				group.benefits.push(benefitRes);
				group.$update(function(groupRes) {

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT BENEFIT -----------------

		var originalEditBenefit = {};

		$scope.selectEditBenefit = function(group, benefit){
			originalEditBenefit[benefit._id] = _.clone(benefit);
			$scope.selectBenefitForm(benefit, 'edit');
		};

		$scope.updateBenefit = function(group, benefit) {
			FinancialBenefits.update(benefit, function(response) {
				$scope.selectBenefitForm(benefit, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditBenefit = function(benefit){
			$scope.error = null;
			benefit.name = originalEditBenefit[benefit._id].name;
			benefit.description = originalEditBenefit[benefit._id].description;
			$scope.selectBenefitForm(benefit, 'view');
		};

		// ------------------- REMOVE BENEFIT -----------------

		$scope.removeBenefit = function(group, benefit) {
			$scope.error = null;
            FinancialBenefits.remove({},benefit, function(res){
                group.benefits = _.without(group.benefits, benefit);
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

        $scope.switchCostForm = {};

        $scope.selectCostForm = function(cost, string){
            if(string === 'view'){ $scope.switchCostForm[cost._id] = 'view';}
            if(string === 'edit'){$scope.switchCostForm[cost._id] = 'edit';}
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
                description: 'new group description',
                costs: []
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


        // ------------------ CREATE COST ----------------

        $scope.createCost = function(group) {
            $scope.error = null;

            var cost = new FinancialCosts ({
                name: 'New cost',
                description: 'New cost description'
            });

            cost.$save(function(costRes) {
                group.costs.push(costRes);
                group.$update(function(groupRes) {

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT COST -----------------

        var originalEditCost = {};

        $scope.selectEditCost = function(group, cost){
            originalEditCost[cost._id] = _.clone(cost);
            $scope.selectCostForm(cost, 'edit');
        };

        $scope.updateCost = function(group, cost) {
            FinancialCosts.update(cost, function(response) {
                $scope.selectCostForm(cost, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCost = function(cost){
            $scope.error = null;
            cost.name = originalEditCost[cost._id].name;
            cost.description = originalEditCost[cost._id].description;
            $scope.selectCostForm(cost, 'view');
        };

        // ------------------- REMOVE COST -----------------

        $scope.removeCost = function(group, cost) {
            $scope.error = null;
            FinancialCosts.remove({},cost, function(res){
                group.costs = _.without(group.costs, cost);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


    }
]);

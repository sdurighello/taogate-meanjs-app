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

        // ------------------- NG-SWITCH ---------------------

        $scope.switchCostGroupForm = {};

        $scope.selectCostGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchCostGroupForm[group._id] = 'view';}
            if(string === 'edit'){$scope.switchCostGroupForm[group._id] = 'edit';}
        };

        $scope.switchCostTypeForm = {};

        $scope.selectCostTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchCostTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchCostTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchCostTypeForm[type._id] = 'edit';}
        };

        $scope.switchBenefitGroupForm = {};

        $scope.selectBenefitGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchBenefitGroupForm[group._id] = 'view';}
            if(string === 'edit'){$scope.switchBenefitGroupForm[group._id] = 'edit';}
        };

        $scope.switchBenefitTypeForm = {};

        $scope.selectBenefitTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchBenefitTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchBenefitTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchBenefitTypeForm[type._id] = 'edit';}
        };

        $scope.costGroupDetails = 'header';
        $scope.benefitGroupDetails = 'header';


        // ----------------- REFRESH GROUPS LISTS ------------

        $scope.costGroupList = function(){
            FinancialCostGroups.query(function(costGroups){
                $scope.costGroups = costGroups;
            });
        };

        $scope.benefitGroupList = function(){
            FinancialBenefitGroups.query(function(benefitGroups){
                $scope.benefitGroups = benefitGroups;
            });
        };






// --------------------------------------------------------- COSTS ---------------------------------------------------






        // ------------------ CREATE COST GROUP ----------------

        $scope.createCostGroup = function() {
            $scope.error = null;

            var costGroup = new FinancialCostGroups ({
                name: 'New cost group',
                costTypes: []
            });

            costGroup.$save(function(response) {
                $scope.costGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------ CREATE COST TYPE ----------------

        $scope.createCostType = function(group) {
            var costType = new FinancialCostTypes ({
                name: 'New cost type',
                description: ''
            });
            costType.$save({groupId: group._id}, function(res) {
                // Add new category to the view group
                group.costTypes.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT COST GROUP (HEADER ONLY) -----------------

        var originalEditCostGroup = {};

        $scope.selectCostGroup = function(costGroup){
            originalEditCostGroup = _.clone(costGroup);
            $scope.selectedCostGroup = costGroup;
        };

        $scope.updateCostGroup = function(group) {
            FinancialCostGroups.update({
                _id: group._id,
                name: group.name,
                description: group.description
            }, function(group){
                $scope.selectCostGroupForm(group, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCostGroup = function(group){
            $scope.error = null;
            $scope.selectedCostGroup.name = originalEditCostGroup.name;
            $scope.selectedCostGroup.description = originalEditCostGroup.description;
            $scope.selectCostGroupForm(group, 'view');
        };

        // ------------------- EDIT COST TYPE (HEADER ONLY) -----------------

        var originalEditCostType = {};

        $scope.selectCostType = function(type){
            originalEditCostType[type._id] = _.clone(type);
            $scope.error = null;
            $scope.selectCostTypeForm(type, 'edit');
        };

        $scope.updateCostType = function(type) {
            FinancialCostTypes.update({
                _id: type._id,
                name: type.name,
                description: type.description
            }, function(res){
                $scope.selectCostTypeForm(res, 'view');
            },function(err){
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditCostType = function(type){
            $scope.error = null;
            type.name = originalEditCostType[type._id].name;
            type.description = originalEditCostType[type._id].description;
            $scope.selectCostTypeForm(type, 'view');
        };


        // ------------------- REMOVE COST GROUP -----------------

        $scope.removeCostGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.selectedCostGroup = null;
                $scope.costGroupList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------- REMOVE COST TYPE -----------------

        $scope.removeCostType = function(group, type) {
            $scope.error = null;

            FinancialCostTypes.remove({groupId: group._id}, type, function(res){
                group.costTypes = _.without(group.costTypes, type);
            }, function(err){
                $scope.error = err.data.message;
            });
        };






// --------------------------------------------------------- BENEFITS ---------------------------------------------------






        // ------------------ CREATE BENEFIT GROUP ----------------

        $scope.createBenefitGroup = function() {
            $scope.error = null;

            var benefitGroup = new FinancialBenefitGroups ({
                name: 'New benefit group',
                benefitTypes: []
            });

            benefitGroup.$save(function(response) {
                $scope.benefitGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------ CREATE BENEFIT TYPE ----------------

        $scope.createBenefitType = function(group) {
            var benefitType = new FinancialBenefitTypes ({
                name: 'New benefit type',
                description: ''
            });
            benefitType.$save({groupId: group._id}, function(res) {
                // Add new category to the view group
                group.benefitTypes.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT BENEFIT GROUP (HEADER ONLY) -----------------

        var originalEditBenefitGroup = {};

        $scope.selectBenefitGroup = function(benefitGroup){
            originalEditBenefitGroup = _.clone(benefitGroup);
            $scope.selectedBenefitGroup = benefitGroup;
        };

        $scope.updateBenefitGroup = function(group) {
            FinancialBenefitGroups.update({
                _id: group._id,
                name: group.name,
                description: group.description
            }, function(group){
                $scope.selectBenefitGroupForm(group, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditBenefitGroup = function(group){
            $scope.error = null;
            $scope.selectedBenefitGroup.name = originalEditBenefitGroup.name;
            $scope.selectedBenefitGroup.description = originalEditBenefitGroup.description;
            $scope.selectBenefitGroupForm(group, 'view');
        };

        // ------------------- EDIT BENEFIT TYPE (HEADER ONLY) -----------------

        var originalEditBenefitType = {};

        $scope.selectBenefitType = function(type){
            originalEditBenefitType[type._id] = _.clone(type);
            $scope.error = null;
            $scope.selectBenefitTypeForm(type, 'edit');
        };

        $scope.updateBenefitType = function(type) {
            FinancialBenefitTypes.update({
                _id: type._id,
                name: type.name,
                description: type.description
            }, function(res){
                $scope.selectBenefitTypeForm(res, 'view');
            },function(err){
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditBenefitType = function(type){
            $scope.error = null;
            type.name = originalEditBenefitType[type._id].name;
            type.description = originalEditBenefitType[type._id].description;
            $scope.selectBenefitTypeForm(type, 'view');
        };


        // ------------------- REMOVE BENEFIT GROUP -----------------

        $scope.removeBenefitGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.selectedBenefitGroup = null;
                $scope.benefitGroupList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------- REMOVE BENEFIT TYPE -----------------

        $scope.removeBenefitType = function(group, type) {
            $scope.error = null;

            FinancialBenefitTypes.remove({groupId: group._id}, type, function(res){
                group.benefitTypes = _.without(group.benefitTypes, type);
            }, function(err){
                $scope.error = err.data.message;
            });
        };




    }
]);

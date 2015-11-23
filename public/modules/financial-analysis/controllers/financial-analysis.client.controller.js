'use strict';

angular.module('financial-analysis').controller('FinancialAnalysisController', ['$scope','$stateParams', '$location',
	'Authentication','FinancialBenefitGroups','FinancialBenefits','FinancialCostGroups','FinancialCosts', 'Projects', 'Portfolios', '$q', '_',
	function($scope, $stateParams, $location, Authentication, FinancialBenefitGroups, FinancialBenefits, FinancialCostGroups,
			 FinancialCosts, Projects, Portfolios, $q, _) {

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){
            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
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



        // ------------------- NG-SWITCH ---------------------

        $scope.switchProjectForm = {};

        $scope.selectProjectForm = function(string){
            if(string === 'default'){ $scope.switchProjectForm = 'default';}
            if(string === 'new'){$scope.switchProjectForm = 'new';}
            if(string === 'view'){ $scope.switchProjectForm = 'view';}
            if(string === 'edit'){$scope.switchProjectForm = 'edit';}
        };

        $scope.switchCostForm = {};

        $scope.selectCostForm = function(assignedCost, string){
            if(string === 'view'){$scope.switchCostForm[assignedCost._id] = 'view';}
            if(string === 'edit'){$scope.switchCostForm[assignedCost._id] = 'edit';}
        };

        $scope.switchBenefitForm = {};

        $scope.selectBenefitForm = function(assignedBenefit, string){
            if(string === 'view'){$scope.switchBenefitForm[assignedBenefit._id] = 'view';}
            if(string === 'edit'){$scope.switchBenefitForm[assignedBenefit._id] = 'edit';}
        };

        var allowNull = function(obj){
            if(obj){return obj._id;} else {return null;}
        };



        // ------------- SELECT VIEW PROJECT ------------

        var originalCostAssignment, originalBenefitAssignment;
        $scope.selectProject = function(project){
            originalCostAssignment = {};
            originalBenefitAssignment = {};
            // Get the full project fat object from the "projectById" server function that populates everything
            Projects.get({
                projectId:project._id,
                retPropertiesString : 'user created selection identification portfolio financialAnalysis',
                deepPopulateArray : [
                    'portfolio',
                    'identification.projectManager','identification.backupProjectManager'
                ]
            }, function(res){
                $scope.selectedProject = res;
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.cancelViewProject = function(){
            $scope.selectedProject = null;
            originalCostAssignment = null;
            originalBenefitAssignment = null;
        };




    // -------------------------------------------------------- COSTS -------------------------------------------------


        // ------------- NEW COST ASSIGNMENT ---------




        // ------------- SELECT COST ASSIGNMENT ---------

        $scope.selectCostAssignment = function(assignedCost){
            originalCostAssignment[assignedCost._id] = _.clone(assignedCost);
            $scope.selectCostForm(assignedCost, 'edit');
        };



        // ------------- EDIT COST ASSIGNMENT ---------

        $scope.saveAssignedCost = function(project, assignedCost){
            Projects.updateCategoryAssignment(
                {
                    projectId: project._id,
                    assignedCostId: assignedCost._id
                },assignedCost, function(res){
                    $scope.selectCostForm(assignedCost, 'view');
                }, function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditAssignedCost = function(assignedCost){
            assignedCost.group = originalCostAssignment[assignedCost._id].group;
            assignedCost.cost = originalCostAssignment[assignedCost._id].cost;
            assignedCost.name = originalCostAssignment[assignedCost._id].name;
            assignedCost.year = originalCostAssignment[assignedCost._id].year;
            assignedCost.amount = originalCostAssignment[assignedCost._id].amount;
            $scope.selectCostForm(assignedCost, 'view');
        };


	}
]);

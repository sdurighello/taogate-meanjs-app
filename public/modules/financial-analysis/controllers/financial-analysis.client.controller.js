'use strict';

angular.module('financial-analysis').controller('FinancialAnalysisController', ['$scope','$stateParams', '$location',
	'Authentication','FinancialBenefitGroups','FinancialBenefitTypes','FinancialCostGroups','FinancialCostTypes','EvaluationDashboards',
    'FinancialCosts', 'FinancialBenefits', 'Projects', 'Portfolios', '$q', '_',
	function($scope, $stateParams, $location, Authentication, FinancialBenefitGroups, FinancialBenefitTypes, FinancialCostGroups,
			 FinancialCostTypes, EvaluationDashboards, FinancialCosts, FinancialBenefits, Projects, Portfolios, $q, _) {

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){
            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
			Projects.query({'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
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
            FinancialCosts.query(function(costs){
                $scope.costs = costs;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialBenefits.query(function(benefits){
                $scope.benefits = benefits;
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


        $scope.selectFinancialOverview = function(project){
            $scope.error = null;
            if(project){
                EvaluationDashboards.financialProfile(
                    {
                        projectId : project._id
                    }, project,
                    function(res){
                        $scope.financialProfile = res;
                    },
                    function(err){
                        $scope.financialProfile = null;
                        $scope.error = err.data.message;
                    }
                );
            } else {
                $scope.financialProfile = null;
            }
        };

        var originalCostAssignment, originalBenefitAssignment, originalDiscountRate, originalBaseYear;

        $scope.selectProject = function(project){
            originalCostAssignment = {};
            originalBenefitAssignment = {};
            // Get the full project fat object from the "projectById" server function that populates everything
            Projects.get({
                projectId:project._id,
                retPropertiesString : 'user created selection identification portfolio discountRate baseYear costs benefits',
                deepPopulateArray : [
                    'portfolio',
                    'identification.projectManager','identification.backupProjectManager',
                    'costs.group.costTypes','costs.type',
                    'benefits.group.benefitTypes','benefits.type'
                ]
            }, function(res){
                res.costs = _.sortBy(res.costs, 'year');
                $scope.selectedProject = res;
                $scope.selectFinancialOverview(res);
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.cancelViewProject = function(){
            $scope.selectedProject = null;
            originalCostAssignment = null;
            originalBenefitAssignment = null;
            originalDiscountRate = null;
            originalBaseYear = null;
        };




    // -------------------------------------------------------- COSTS -------------------------------------------------


        // ------------- NEW COST ASSIGNMENT ---------

        $scope.newCostAssignment = {};
        $scope.newCostAssignment.group = {};
        $scope.newCostAssignment.type = {};
        $scope.newCostAssignment.name = '';
        $scope.newCostAssignment.year = null;
        $scope.newCostAssignment.amount = null;

        $scope.createNewCostAssignment = function(project){
            var newCostAssignment = new FinancialCosts({
                group : $scope.newCostAssignment.group._id,
                type : $scope.newCostAssignment.type._id,
                name : $scope.newCostAssignment.name,
                year : $scope.newCostAssignment.year,
                amount : $scope.newCostAssignment.amount
            });

            newCostAssignment.$save({projectId: project._id}, function(res) {
                // Populate group and type since res doesn't
                res.group = $scope.newCostAssignment.group;
                res.type = $scope.newCostAssignment.type;
                // Add new category to the view group
                project.costs.unshift(res);
                // Clear new cost form
                $scope.newCostAssignment = {};
                $scope.newCostAssignment.group = {};
                $scope.newCostAssignment.type = {};
                $scope.newCostAssignment.name = '';
                $scope.newCostAssignment.year = null;
                $scope.newCostAssignment.amount = null;
                // Close new cost form done directly in the view's html
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------- SELECT COST ASSIGNMENT ---------

        $scope.selectCostAssignment = function(assignedCost){
            originalCostAssignment[assignedCost._id] = _.clone(assignedCost);
        };



        // ------------- EDIT COST ASSIGNMENT ---------

        $scope.editAssignedCost = function(project, assignedCost){
            // Check cost type since ngOptions doesn't update it if group changed but user didn't specifically selected a new type
            if(!_.find(assignedCost.group.costTypes, assignedCost.type)){
                assignedCost.type = null;
            }
            var copyAssignedCost = _.clone(assignedCost);
            copyAssignedCost.group = allowNull(copyAssignedCost.group);
            copyAssignedCost.type = allowNull(copyAssignedCost.type);
            FinancialCosts.update(copyAssignedCost,
                function(res){ },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditAssignedCost = function(assignedCost){
            assignedCost.group = originalCostAssignment[assignedCost._id].group;
            assignedCost.type = originalCostAssignment[assignedCost._id].type;
            assignedCost.name = originalCostAssignment[assignedCost._id].name;
            assignedCost.year = originalCostAssignment[assignedCost._id].year;
            assignedCost.amount = originalCostAssignment[assignedCost._id].amount;
        };


        // ------------- DELETE COST ASSIGNMENT ---------

        $scope.deleteAssignedCost = function(project, assignedCost){

            FinancialCosts.remove({projectId: project._id}, assignedCost, function(res){
                project.costs = _.without(project.costs, assignedCost);
            }, function(err){
                $scope.error = err.data.message;
            });

        };



        // -------------------------------------------------------- BENEFITS -------------------------------------------------


        // ------------- NEW BENEFIT ASSIGNMENT ---------

        $scope.newBenefitAssignment = {};
        $scope.newBenefitAssignment.group = {};
        $scope.newBenefitAssignment.type = {};
        $scope.newBenefitAssignment.name = '';
        $scope.newBenefitAssignment.year = null;
        $scope.newBenefitAssignment.amount = null;

        $scope.createNewBenefitAssignment = function(project){

            var newBenefitAssignment = new FinancialBenefits({
                group : $scope.newBenefitAssignment.group._id,
                type : $scope.newBenefitAssignment.type._id,
                name : $scope.newBenefitAssignment.name,
                year : $scope.newBenefitAssignment.year,
                amount : $scope.newBenefitAssignment.amount
            });

            newBenefitAssignment.$save({projectId: project._id}, function(res) {
                // Populate group and type since res doesn't
                res.group = $scope.newBenefitAssignment.group;
                res.type = $scope.newBenefitAssignment.type;
                // Add new category to the view group
                project.benefits.unshift(res);
                // Clear new cost form
                $scope.newBenefitAssignment = {};
                $scope.newBenefitAssignment.group = {};
                $scope.newBenefitAssignment.type = {};
                $scope.newBenefitAssignment.name = '';
                $scope.newBenefitAssignment.year = null;
                $scope.newBenefitAssignment.amount = null;
                // Close new cost form done directly in the view's html
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------- SELECT BENEFIT ASSIGNMENT ---------

        $scope.selectBenefitAssignment = function(assignedBenefit){
            originalBenefitAssignment[assignedBenefit._id] = _.clone(assignedBenefit);
        };



        // ------------- EDIT BENEFIT ASSIGNMENT ---------

        $scope.editAssignedBenefit = function(project, assignedBenefit){
            // Check benefit type since ngOptions doesn't update it if group changed but user didn't specifically selected a new type
            if(!_.find(assignedBenefit.group.benefitTypes, assignedBenefit.type)){
                assignedBenefit.type = null;
            }
            var copyAssignedBenefit = _.clone(assignedBenefit);
            copyAssignedBenefit.group = allowNull(copyAssignedBenefit.group);
            copyAssignedBenefit.type = allowNull(copyAssignedBenefit.type);
            FinancialBenefits.update(copyAssignedBenefit,
                function(res){ },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditAssignedBenefit = function(assignedBenefit){
            assignedBenefit.group = originalBenefitAssignment[assignedBenefit._id].group;
            assignedBenefit.type = originalBenefitAssignment[assignedBenefit._id].type;
            assignedBenefit.name = originalBenefitAssignment[assignedBenefit._id].name;
            assignedBenefit.year = originalBenefitAssignment[assignedBenefit._id].year;
            assignedBenefit.amount = originalBenefitAssignment[assignedBenefit._id].amount;
        };


        // ------------- DELETE BENEFIT ASSIGNMENT ---------

        $scope.deleteAssignedBenefit = function(project, assignedBenefit){
            FinancialBenefits.remove({projectId: project._id}, assignedBenefit, function(res){
                project.benefits = _.without(project.benefits, assignedBenefit);
            }, function(err){
                $scope.error = err.data.message;
            });
        };





    // -------------------------------------------------------- DISCOUNTING DATA -------------------------------------------------


        $scope.selectDiscountRate = function(project){
            originalDiscountRate = _.clone(project.discountRate);
            originalBaseYear = _.clone(project.baseYear);
        };

        $scope.saveDiscountRate = function(project){
            Projects.update({projectId:project._id},{discountRate: project.discountRate, baseYear: project.baseYear},
                function(res){

                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditDiscountRate = function(project){
            project.discountRate = originalDiscountRate;
            project.baseYear = originalBaseYear;
        };




	}
]);

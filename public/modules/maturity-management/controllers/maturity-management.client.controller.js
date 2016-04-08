'use strict';

angular.module('maturity-management').controller('MaturityManagementController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 
    'Authentication', 'MaturityModels', 'ProjectReviewScores',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication, MaturityModels, ProjectReviewScores) {

		$rootScope.staticMenu = false;

		var vm = this;

		// ------------- INIT -------------

        vm.isResolving = false;

		vm.initError = [];

		vm.init = function () {

			vm.userData = Authentication.user;

			MaturityModels.query(function (res) {
				vm.maturityModels = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

            ProjectReviewScores.query(function (res) {
                vm.projectReviewScores = res;
            }, function (err) {
                vm.initError.push(err.data.message);
            });

		};

		// -------------- AUTHORIZATION FOR BUTTONS -----------------

		vm.userHasAuthorization = function(userData){
			var userIsSuperhero;

            userIsSuperhero = !!_.some(userData.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });

            return userIsSuperhero;
		};

        
// ******************************************************* SELECT DIMENSION *******************************************************
        
        var originalDimension = {};
        
        vm.showHistoryComment = {};

        vm.dimensionEdit = {};

        vm.selectDimension = function(dimension){
            // Flush any changes to current selectedDimension
            if(vm.selectedDimension){
                vm.cancelEditDimension(vm.selectedDimension);
            }
            originalDimension[dimension._id] = _.cloneDeep(dimension);
            vm.selectedDimension = dimension;
            vm.dimensionEdit[dimension._id] = false;
        };

        vm.saveEditDimension = function(model, dimension) {
            vm.error = null;
            vm.isResolving = true;
            MaturityModels.updateMaturityReview({
                maturityModelId: model._id,
                dimensionId: dimension._id
            }, dimension, function(res){
                vm.isResolving = false;
                dimension.maturityReview = res.maturityReview;
                originalDimension[dimension._id].maturityReview = res.maturityReview;
                vm.dimensionEdit[dimension._id] = false;
            },function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };

        vm.cancelEditDimension = function(dimension){
            vm.error = null;
            dimension.maturityReview = originalDimension[dimension._id].maturityReview;
            vm.dimensionEdit[dimension._id] = false;
        };


        $scope.$watch(function(){return vm.selectedMaturityModel;}, function(newValue, oldValue){
            if(newValue !== oldValue){
                // At every maturity model change flush selected dimensions data
                if(vm.selectedDimension){
                    vm.cancelEditDimension(vm.selectedDimension);
                    vm.selectedDimension = null;
                }
                // Flush the filters from previous model selection
                vm.dimensionFilter = {};
            }
        });



	}

]);

'use strict';

angular.module('maturity-setup').controller('MaturitySetupController', ['$scope', '$stateParams', '$location', 'Authentication',
	'MaturityModels','$q','_',
	function($scope, $stateParams, $location, Authentication, MaturityModels, $q, _) {

		// ------------- INIT -------------

        $scope.isResolving = false;

		$scope.init = function(){

			MaturityModels.query(function(res){
				$scope.maturityModels = res;
			}, function(err){
                $scope.error = err.data.message;
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

		// ------------------- FORMS VIEW -> EDIT ---------------------

		$scope.maturityModelEdit = {};

		$scope.levelEdit = {};

		$scope.domainEdit = {};

		$scope.maturityModelDetails = 'header';



		// ------------------ MATURITY MODEL ----------------


        // Create

		$scope.createMaturityModel = function() {

			var maturityModel = new MaturityModels ({
				name: 'New maturity model',
				domains: [],
                levels: [],
                dimensions : []
			});

            $scope.error = null;
            $scope.isResolving = true;

            maturityModel.$save(function(res) {
                $scope.isResolving = false;
                $scope.maturityModels.push(res);

			}, function(err) {
				$scope.error = err.data.message;
			});
		};


		// Edit

		var originalMaturityModel = {};

		$scope.selectMaturityModel = function(model){
            originalMaturityModel[model._id] = _.cloneDeep(model);
			$scope.selectedMaturityModel = model;
            $scope.maturityModelEdit[model._id] = false;
		};

		$scope.saveEditMaturityModel = function(model) {
            $scope.error = null;
            $scope.isResolving = true;
			MaturityModels.update({
				_id: model._id,
				name: model.name,
				description: model.description
			}, function(res){
                $scope.isResolving = false;
                originalMaturityModel[model._id].name = model.name;
                originalMaturityModel[model._id].description = model.description;
                $scope.maturityModelEdit[model._id] = false;
			},function(err){
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditMaturityModel = function(model){
			$scope.error = null;
			model.name = originalMaturityModel[model._id].name;
			model.description = originalMaturityModel[model._id].description;
            $scope.maturityModelEdit[model._id] = false;
		};


		// Delete

		$scope.deleteMaturityModel = function(model) {
			$scope.error = null;
            $scope.isResolving = true;
			model.$remove(function(res) {
                $scope.isResolving = false;
				$scope.selectedMaturityModel = null;
				$scope.maturityModels = _.without($scope.maturityModels, model);

			}, function(err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};


        // ------------------  DOMAIN ----------------


        // Create

        $scope.createDomain = function(model) {

            var newDomain = {
                name: 'New maturity domain'
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createDomain({ maturityModelId: model._id }, newDomain,
                function (res) {
                    $scope.isResolving = false;
                    model.domains.push(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


        // Edit

        var originalDomain = {};

        $scope.selectDomain = function(domain){
            originalDomain[domain._id] = _.cloneDeep(domain);
            $scope.selectedDomain = domain;
            $scope.domainEdit[domain._id] = false;
        };

        $scope.saveEditDomain = function(model, domain) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateDomain({
                maturityModelId: model._id,
                domainId: domain._id
            }, domain, function(res){
                $scope.isResolving = false;
                originalDomain[domain._id].name = domain.name;
                originalDomain[domain._id].description = domain.description;
                $scope.domainEdit[domain._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditDomain = function(domain){
            $scope.error = null;
            domain.name = originalDomain[domain._id].name;
            domain.description = originalDomain[domain._id].description;
            $scope.domainEdit[domain._id] = false;
        };


        // Delete

        $scope.deleteDomain = function(model, domain) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteDomain({
                maturityModelId: model._id,
                domainId: domain._id
            }, domain, function(res){
                $scope.isResolving = false;
                $scope.selectedDomain = null;
                model.domains = _.without(model.domains, domain);
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };



        // ------------------  LEVEL ----------------


        // Create

        $scope.createLevel = function(model) {

            var newLevel = {
                name: 'New maturity level'
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createLevel({ maturityModelId: model._id }, newLevel,
                function (res) {
                    $scope.isResolving = false;
                    model.levels.push(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


        // Edit

        var originalLevel = {};

        $scope.selectLevel = function(level){
            originalLevel[level._id] = _.cloneDeep(level);
            $scope.selectedLevel = level;
            $scope.levelEdit[level._id] = false;
        };

        $scope.saveEditLevel = function(model, level) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateLevel({
                maturityModelId: model._id,
                levelId: level._id
            }, level, function(res){
                $scope.isResolving = false;
                originalLevel[level._id].name = level.name;
                originalLevel[level._id].description = level.description;
                $scope.levelEdit[level._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditLevel = function(level){
            $scope.error = null;
            level.name = originalLevel[level._id].name;
            level.description = originalLevel[level._id].description;
            $scope.levelEdit[level._id] = false;
        };


        // Delete

        $scope.deleteLevel = function(model, level) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteLevel({
                maturityModelId: model._id,
                levelId: level._id
            }, level, function(res){
                $scope.isResolving = false;
                $scope.selectedLevel = null;
                model.levels = _.without(model.levels, level);
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };




    }
]);

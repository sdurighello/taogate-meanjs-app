'use strict';

angular.module('maturity-setup').controller('MaturitySetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'MaturityModels','$q','_',
	function($rootScope, $scope, $stateParams, $location, Authentication, MaturityModels, $q, _) {

        $rootScope.staticMenu = false;

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


		// ------------------ MATURITY MODEL ----------------


        // Create

		$scope.createMaturityModel = function() {

			var maturityModel = new MaturityModels ({
				name: 'New maturity model',
				areas: [],
                levels: [],
                dimensions : []
			});

            $scope.error = null;
            $scope.isResolving = true;

            maturityModel.$save(function(res) {
                $scope.isResolving = false;
                $scope.maturityModels.push(res);
                $scope.selectMaturityModel(res);
			}, function(err) {
				$scope.error = err.data.message;
			});
		};


		// Edit

        $scope.maturityModelEdit = {};

        $scope.maturityModelDetails = 'header';

		var originalMaturityModel = {};

		$scope.selectMaturityModel = function(model){
            // Flush any changes to current selected objects
            if($scope.selectedMaturityModel){
                $scope.cancelEditMaturityModel($scope.selectedMaturityModel);
            }
            if($scope.selectedArea){
                $scope.cancelEditArea($scope.selectedArea);
            }
            if($scope.selectedLevel){
                $scope.cancelEditLevel($scope.selectedLevel);
            }
            if($scope.selectedDimension){
                $scope.cancelEditDimension($scope.selectedDimension);
            }
            // Reset the selected objects
            $scope.selectedArea = null;
            $scope.selectedLevel = null;
            $scope.selectedDimension = null;
            // Select the current model
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


        // ------------------  AREA ----------------


        // Create

        $scope.createArea = function(model) {

            var newArea = {
                name: 'New maturity area'
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createArea({ maturityModelId: model._id }, newArea,
                function (res) {
                    $scope.isResolving = false;
                    model.areas.push(res);
                    $scope.selectArea(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


        // Edit

        $scope.areaEdit = {};

        var originalArea = {};

        $scope.selectArea = function(area){
            // Flush any changes to current selectedArea
            if($scope.selectedArea){
                $scope.cancelEditArea($scope.selectedArea);
            }
            originalArea[area._id] = _.cloneDeep(area);
            $scope.selectedArea = area;
            $scope.areaEdit[area._id] = false;
        };

        $scope.saveEditArea = function(model, area) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateArea({
                maturityModelId: model._id,
                areaId: area._id
            }, area, function(res){
                $scope.isResolving = false;
                originalArea[area._id].name = area.name;
                originalArea[area._id].description = area.description;
                $scope.areaEdit[area._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditArea = function(area){
            $scope.error = null;
            area.name = originalArea[area._id].name;
            area.description = originalArea[area._id].description;
            $scope.areaEdit[area._id] = false;
        };


        // Delete

        $scope.deleteArea = function(model, area) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteArea({
                maturityModelId: model._id,
                areaId: area._id
            }, area, function(res){
                $scope.isResolving = false;
                $scope.selectedArea = null;
                model.areas = _.without(model.areas, area);
                // Sync dimensions
                if($scope.selectedDimension){
                    $scope.cancelEditDimension($scope.selectedDimension);
                    $scope.selectedDimension = null;
                }
                model.dimensions = _.filter(model.dimensions, function(dimension){
                    return dimension.area !== area._id;
                });
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
                    $scope.selectLevel(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // Sort

        var originalLevels;

        $scope.dragControlListeners = {
            accept: function (sourceItemHandleScope, destSortableScope) {
               //override to determine drag is allowed or not. default is true.
               return !$scope.isResolving;
            },
            dragStart : function(event){
                originalLevels = _.cloneDeep($scope.selectedMaturityModel.levels);
            },
            orderChanged: function(event) {

                $scope.error = null;
                $scope.isResolving = true;
                
                MaturityModels.sortLevels({ maturityModelId: $scope.selectedMaturityModel._id },
                    event.source.sortableScope.modelValue,
                    function (res) {
                        $scope.isResolving = false;
                    },
                    function (err) {
                        // Put back the original order
                        $scope.selectedMaturityModel.levels = originalLevels;
                        $scope.isResolving = false;
                        $scope.error = err.data.message;
                    }
                );
            }
        };


        // Edit

        $scope.levelEdit = {};

        var originalLevel = {};

        $scope.selectLevel = function(level){
            // Flush any changes to current selectedLevel
            if($scope.selectedLevel){
                $scope.cancelEditLevel($scope.selectedLevel);
            }

            originalLevel[level._id] = _.cloneDeep(level);
            $scope.selectedLevel = level;
            $scope.levelEdit[level._id] = false;
        };
        
        $scope.editLevel = function(level){
            $scope.levelEdit[level._id] = true;
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
                // Sync dimensions
                if($scope.selectedDimension){
                    $scope.cancelEditDimension($scope.selectedDimension);
                    $scope.selectedDimension = null;
                }
                model.dimensions = _.filter(model.dimensions, function(dimension){
                    return dimension.level !== level._id;
                });
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };



        // ------------------  DIMENSIONS ----------------


        // Create

        $scope.showNewDimensionForm = false;

        $scope.newDimensionFormObj = {};

        $scope.saveNewDimension = function(model) {

            var newDimension = {
                level: $scope.newDimensionFormObj[model._id].level._id,
                area: $scope.newDimensionFormObj[model._id].area._id,
                name: $scope.newDimensionFormObj[model._id].name,
                description: $scope.newDimensionFormObj[model._id].description,
                improvementActivities: []
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createDimension({ maturityModelId: model._id }, newDimension,
                function (res) {
                    $scope.isResolving = false;
                    model.dimensions.push(res);
                    // Reset new dimension form
                    //$scope.newDimensionFormObj[model._id].level = null; // So its easier to create multiple new dimensions
                    //$scope.newDimensionFormObj[model._id].area = null;
                    $scope.newDimensionFormObj[model._id].name = null;
                    $scope.newDimensionFormObj[model._id].description = null;
                    // Close form
                    $scope.showNewDimensionForm = false;
                    // Select newly created dimension
                    $scope.selectDimension(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewDimension = function(model){
            // Reset new dimension form
            if($scope.newDimensionFormObj[model._id]){
                $scope.newDimensionFormObj[model._id].level = null;
                $scope.newDimensionFormObj[model._id].area = null;
                $scope.newDimensionFormObj[model._id].name = null;
                $scope.newDimensionFormObj[model._id].description = null;
            }
            // Close form
            $scope.showNewDimensionForm = false;
        };


        // Edit

        $scope.dimensionEdit = {};

        var originalDimension = {};

        $scope.selectDimension = function(dimension){
            // Flush any changes to current selectedDimension
            if($scope.selectedDimension){
                $scope.cancelEditDimension($scope.selectedDimension);
            }
            originalDimension[dimension._id] = _.cloneDeep(dimension);
            $scope.selectedDimension = dimension;
            $scope.dimensionEdit[dimension._id] = false;
        };

        $scope.saveEditDimension = function(model, dimension) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateDimension({
                maturityModelId: model._id,
                dimensionId: dimension._id
            }, dimension, function(res){
                $scope.isResolving = false;
                originalDimension[dimension._id].name = dimension.name;
                originalDimension[dimension._id].description = dimension.description;
                $scope.dimensionEdit[dimension._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditDimension = function(dimension){
            $scope.error = null;
            dimension.name = originalDimension[dimension._id].name;
            dimension.description = originalDimension[dimension._id].description;
            $scope.dimensionEdit[dimension._id] = false;
        };


        // Delete

        $scope.deleteDimension = function(model, dimension) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteDimension({
                maturityModelId: model._id,
                dimensionId: dimension._id
            }, dimension, function(res){
                $scope.isResolving = false;
                $scope.selectedDimension = null;
                model.dimensions = _.without(model.dimensions, dimension);
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };



    }
]);

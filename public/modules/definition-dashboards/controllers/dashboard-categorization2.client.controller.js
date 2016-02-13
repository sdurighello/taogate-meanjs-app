'use strict';

// Definition dashboards controller
angular.module('definition-dashboards').controller('DashboardCategorizationController2', ['$scope', '$stateParams', '$location', 'Authentication',
    'DefinitionDashboards','CategoryGroups', 'Categories', '_','$q',
	function($scope, $stateParams, $location, Authentication, DefinitionDashboards, CategoryGroups, Categories, _, $q) {

        // ----------- INIT ---------------

        $scope.initError = [];

        $scope.oneAtATime = true;

        $scope.typeOfChart = 'number';

        $scope.init = function(){

            CategoryGroups.query(function(categoryGroups){
                $scope.categoryGroups = categoryGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            Categories.query(function(res){
                $scope.categories = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            DefinitionDashboards.projectCategorization2(function(res){
                $scope.projectCategorization = res;
                console.log(res);
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



        // ------- CATEGORIZATION DASHBOARD ------


        $scope.orderTable = 'countCategoryValue';



	}
]);

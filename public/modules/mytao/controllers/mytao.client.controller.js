'use strict';

angular.module('mytao').controller('MytaoController', ['$scope','$rootScope', '$location', 'Authentication','$q','_','$timeout','Mytao',
	function($scope, $rootScope, $location, Authentication, $q, _, $timeout, Mytao) {

		$rootScope.staticMenu = false;
        
        var vm = this;

        // ----------- INIT ---------------

        // No need for init() before rendering
        
        vm.error = {};

        Mytao.userProjects(function(res){
            vm.userProjects = res;
        }, function(err){
            vm.error.userProjects = err.data.message;
        });

        Mytao.userPortfolios(function(res){
            vm.userPortfolios = res;
        }, function(err){
            vm.error.userPortfolios = err.data.message;
        });

        Mytao.userProjectReviews(function(res){
            vm.userProjectReviews = res;
        }, function(err){
            vm.error.userProjectReviews = err.data.message;
        });

        Mytao.userPortfolioReviews(function(res){
            vm.userPortfolioReviews = res;
        }, function(err){
            vm.error.userPortfolioReviews = err.data.message;
        });

        Mytao.userImprovementActivities(function(res){
            vm.userImprovementActivities = res;
        }, function(err){
            vm.error.userImprovementActivities = err.data.message;
        });

        Mytao.userProjectChangeRequests(function(res){
            vm.userProjectChangeRequests = res;
        }, function(err){
            vm.error.userProjectChangeRequests = err.data.message;
        });

        Mytao.userProjectStatusUpdates(function(res){
            vm.userProjectStatusUpdates = res;
        }, function(err){
            vm.error.userProjectStatusUpdates = err.data.message;
        });

        Mytao.userPortfolioChangeRequests(function(res){
            vm.userPortfolioChangeRequests = res;
        }, function(err){
            vm.error.userPortfolioChangeRequests = err.data.message;
        });

        Mytao.userGateReviews(function(res){
            vm.userGateReviews = res;
        }, function(err){
            vm.error.userGateReviews = err.data.message;
        });

        
        // ------ Authentication ----

        var d = $q.defer();
        d.resolve(Authentication);
        d.promise.then(function(data){
            vm.userData = data.user;

            // If this was the homepage, the user would be re-directed to log-in if not logged in already
            if(!data.user){
                $location.path('/signin');
                $rootScope.staticMenu = true;
            }

            // --- showIfSuperhero for Gate Reviews
            vm.showIfSuperhero = !!_.find(data.user.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });

        });


        // ----------- CHART ---------------
        
        
        
        vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        vm.series = ['Series A', 'Series B'];
        vm.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        vm.onClick = function (points, evt) {
            console.log(points, evt);
        };

        // Simulate async data update
        $timeout(function () {
            vm.data = [
                [28, 48, 40, 19, 86, 27, 90],
                [65, 59, 80, 81, 56, 55, 40]
            ];
        }, 3000);



        // ------




	}
]);

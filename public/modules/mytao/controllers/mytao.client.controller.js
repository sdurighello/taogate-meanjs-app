'use strict';

angular.module('mytao').controller('MytaoController', ['$scope','$rootScope', '$location', 'Authentication','$q','_','$timeout','Mytao',
	function($scope, $rootScope, $location, Authentication, $q, _, $timeout, Mytao) {

		$rootScope.staticMenu = false;
        
        var vm = this;

        // ----------- INIT ---------------

        // No need for init() before rendering
        
        vm.initError = [];

        Mytao.userProjects(function(res){
            vm.userProjects = res;
        }, function(err){
            vm.initError.push(err.data.message);
        });

        Mytao.userPortfolios(function(res){
            vm.userPortfolios = res;
        }, function(err){
            vm.initError.push(err.data.message);
        });

        
        // If this was the homepage, the user would be re-directed to log-in if not logged in already
        var d = $q.defer();
        d.resolve(Authentication);
        d.promise.then(function(data){
            vm.userData = data.user;
            if(!data.user){
                $location.path('/signin');
                $rootScope.staticMenu = true;
            }
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

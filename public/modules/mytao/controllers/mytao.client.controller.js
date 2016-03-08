'use strict';

angular.module('mytao').controller('MytaoController', ['$scope','$rootScope', '$location', 'Authentication','$q','_','$timeout',
	function($scope, $rootScope, $location, Authentication, $q, _, $timeout) {

		$rootScope.staticMenu = false;

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            if(!data.user){
                $location.path('/signin');
                $rootScope.staticMenu = true;
            }
        });

        // -------
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        // Simulate async data update
        $timeout(function () {
            $scope.data = [
                [28, 48, 40, 19, 86, 27, 90],
                [65, 59, 80, 81, 56, 55, 40]
            ];
        }, 3000);



        // ------




	}
]);

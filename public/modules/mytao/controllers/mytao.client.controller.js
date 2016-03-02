'use strict';

angular.module('mytao').controller('MytaoController', ['$scope','$rootScope', '$location', 'Authentication','$q','_',
	function($scope, $rootScope, $location, Authentication, $q, _) {

		$rootScope.staticMenu = false;

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            if(!data.user){
                $location.path('/signin');
                $rootScope.staticMenu = true;
            }
        });

	}
]);

'use strict';

// People controller
angular.module('people').controller('PeopleController', ['$scope', '$stateParams', '$location', 'Authentication', 'People','$q','_',
	function($scope, $stateParams, $location, Authentication, People, $q, _) {

        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            _.map(_.get(obj,'user.roles'), function(role){
                obj[role] = true;
            });
            $scope.authentication = obj;

        });


        // ------------------- NG-SWITCH ---------------------

        $scope.switchPersonForm = {};

        $scope.selectPersonForm = function(person, string){
            if(string === 'view'){ $scope.switchPersonForm[person._id] = 'view';}
            if(string === 'new'){$scope.switchPersonForm[person._id] = 'new';}
            if(string === 'edit'){$scope.switchPersonForm[person._id] = 'edit';}
        };

        // ------------------- LIST OF PEOPLE -----------------

        $scope.find = function() {
            People.query(function(people){
                $scope.people = _.clone(people);
            },function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT -----------------


        $scope.selectPerson = function(person){
            $scope.selectPersonForm(person, 'edit');
        };

        $scope.update = function(person) {
            person.$update(function(response) {
                $scope.find();
                $scope.selectPersonForm(person, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEdit = function(person){
            $scope.find();
            $scope.selectPersonForm(person, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.remove = function(person) {
            person.$remove(function(response) {
                $scope.find();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.create = function() {
            var person = new People ({
                name: 'New person',
                title: '',
                email: '',
                phone: ''
            });
            person.$save(function(response) {
                $scope.name = '';
                $scope.title = '';
                $scope.email = '';
                $scope.phone = '';
                $scope.find();
                $scope.selectPersonForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


	}
]);

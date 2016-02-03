'use strict';

// Definition dashboards controller
angular.module('evaluation-dashboards').controller('DashboardFinancialController', ['$scope', '$stateParams', '$location', 'Authentication',
    'EvaluationDashboards','Projects','Portfolios', 'GateProcesses', '_','$q',
    function($scope, $stateParams, $location, Authentication, EvaluationDashboards, Projects, Portfolios, GateProcesses, _, $q) {

        // ----------- INIT ---------------

        $scope.initError = [];

        $scope.oneAtATime = true;

        var gatePerformances = [];

        $scope.typeOfChart = 'number';

        $scope.init = function(){

            Projects.query({'selection.selectedForEvaluation': true}, function(projects){
                $scope.projects = projects;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            GateProcesses.query(function(gateProcesses){
                $scope.gateProcesses = gateProcesses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            //DeliveryDashboards.gatePerformances(function(res){
            //	gatePerformances = res;
            //}, function(err){
            //	$scope.initError.push(err.data.message);
            //});


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



        // ------- GATE PERFORMANCES DASHBOARD ------


        $scope.selectProject = function(project){
            $scope.selectedProject = project;

            EvaluationDashboards.financialProfile(
                {
                    projectId : project._id
                }, project,
                function(res){
                    $scope.financialProfile = res;
                },
                function(err){$scope.error = err.data.message;}
            );


        };





    }
]);

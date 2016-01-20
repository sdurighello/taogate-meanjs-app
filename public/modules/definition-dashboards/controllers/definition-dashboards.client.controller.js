'use strict';

// Definition dashboards controller
angular.module('definition-dashboards').controller('DefinitionDashboardsController', ['$scope', '$stateParams', '$location', 'Authentication',
    'DefinitionDashboards', '_','$q',
	function($scope, $stateParams, $location, Authentication, DefinitionDashboards, _, $q) {

        // ----------- INIT ---------------

        $scope.initError = [];

        $scope.init = function(){

            DefinitionDashboards.projectCategorization(function(array){
                console.log(array);
                $scope.projectCategorization = array;
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


		//This is not a highcharts object. It just looks a little like one!
		$scope.chartConfig = {

			options: {
				//This is the Main Highcharts chart config. Any Highchart options are valid here.
				//will be overriden by values specified below.
				chart: {
					type: 'pie'
				},
				tooltip: {
					style: {
						padding: 10,
						fontWeight: 'bold'
					}
				}
			},
			//The below properties are watched separately for changes.

			//Series object (optional) - a list of series using normal Highcharts series options.
			series: [{
				data: [10, 15, 12, 8, 7]
			}],
			//Title configuration (optional)
			title: {
				text: 'Hello'
			},
			//Boolean to control showing loading status on chart (optional)
			//Could be a string if you want to show specific loading text.
			loading: false,
			//Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
			//properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
			xAxis: {
				currentMin: 0,
				currentMax: 20,
				title: {text: 'values'}
			},
			//Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
			useHighStocks: false,
			//size (optional) if left out the chart will default to size of the div or something sensible.
			//size: {
			//	width: 400,
			//	height: 300
			//},
			//function (optional)
			func: function (chart) {
				//setup some logic for the chart
			}
		};

		$scope.chartConfig2 = {

			title: {
				text: 'Basic drilldown'
			},
			xAxis: {
				type: 'category'
			},

			legend: {
				enabled: false
			},

            options : {

                chart: {
                    type: 'column'
                },

                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true
                        }
                    }
                },

                drilldown: {
                    series: [{
                        id: 'animals',
                        name: 'Animals',
                        data: [{
                            name: 'Cats',
                            y: 4,
                            drilldown: 'cats'
                        }, ['Dogs', 2],
                            ['Cows', 1],
                            ['Sheep', 2],
                            ['Pigs', 1]
                        ]
                    }, {

                        id: 'cats',
                        data: [{name:'calico',
                            y:1},
                            {name:'tabby',
                                y:2},
                            {name:'mix',
                                y:1}
                        ]
                    }]
                }
            },

            series: [{
                name: 'Things',
                colorByPoint: true,
                data: [{
                    name: 'Animals',
                    y: 5,
                    drilldown: 'animals'
                }]
            }]
		};





	}
]);

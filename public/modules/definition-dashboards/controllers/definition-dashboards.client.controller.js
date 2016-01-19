'use strict';

// Definition dashboards controller
angular.module('definition-dashboards').controller('DefinitionDashboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'DefinitionDashboards',
	function($scope, $stateParams, $location, Authentication, DefinitionDashboards) {
		$scope.authentication = Authentication;


		//This is not a highcharts object. It just looks a little like one!
		$scope.chartConfig = {

			options: {
				//This is the Main Highcharts chart config. Any Highchart options are valid here.
				//will be overriden by values specified below.
				chart: {
					type: 'bar'
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
			size: {
				width: 400,
				height: 300
			},
			//function (optional)
			func: function (chart) {
				//setup some logic for the chart
			}
		};








		// Create new Definition dashboard
		$scope.create = function() {
			// Create new Definition dashboard object
			var definitionDashboard = new DefinitionDashboards ({
				name: this.name
			});

			// Redirect after save
			definitionDashboard.$save(function(response) {
				$location.path('definition-dashboards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Definition dashboard
		$scope.remove = function(definitionDashboard) {
			if ( definitionDashboard ) { 
				definitionDashboard.$remove();

				for (var i in $scope.definitionDashboards) {
					if ($scope.definitionDashboards [i] === definitionDashboard) {
						$scope.definitionDashboards.splice(i, 1);
					}
				}
			} else {
				$scope.definitionDashboard.$remove(function() {
					$location.path('definition-dashboards');
				});
			}
		};

		// Update existing Definition dashboard
		$scope.update = function() {
			var definitionDashboard = $scope.definitionDashboard;

			definitionDashboard.$update(function() {
				$location.path('definition-dashboards/' + definitionDashboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Definition dashboards
		$scope.find = function() {
			$scope.definitionDashboards = DefinitionDashboards.query();
		};

		// Find existing Definition dashboard
		$scope.findOne = function() {
			$scope.definitionDashboard = DefinitionDashboards.get({ 
				definitionDashboardId: $stateParams.definitionDashboardId
			});
		};
	}
]);

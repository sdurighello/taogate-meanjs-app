'use strict';

// Definition dashboards controller
angular.module('definition-dashboards').controller('DashboardPrioritizationController', ['$scope', '$stateParams', '$location', 'Authentication',
	'DefinitionDashboards','PriorityGroups', '_','$q',
	function($scope, $stateParams, $location, Authentication, DefinitionDashboards, PriorityGroups, _, $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		var projectPrioritization = [];

		$scope.typeOfChart = 'number';

		$scope.init = function(){

			PriorityGroups.query(function(res){
				$scope.priorityGroups = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			DefinitionDashboards.projectPrioritization(function(res){
				projectPrioritization = res;
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



		// ------- PRIORITIZATION DASHBOARD ------


		$scope.selectPriorityGroup = function(group){
			$scope.selectedPriorityGroup = group;
			$scope.priorityChartConfigs = {};
			$scope.priorityChartConfigs.countPriorityValue = getConfigsForGroup(group, 'countPriorityValue', 'N. of projects');
			$scope.priorityChartConfigs.fundsPriorityValue = getConfigsForGroup(group, 'fundsPriorityValue', 'Amount of funds');
		};


		var getConfigsForGroup = function(group, property, nameSeries){
			var retArray = [];
			_.forEach(projectPrioritization, function(groupObj) {
				if (groupObj.group._id === group._id) {
					_.forEach(groupObj.priorities, function (priorityObj) {
						var priorityChartObj = {};
						priorityChartObj.title = { text: priorityObj.priority.name };
						priorityChartObj.options = {
							chart: {
								type: 'pie',
								borderColor: '#ddd',
								borderWidth: 1
							},
							tooltip: {
								style: {
									padding: 10,
									fontWeight: 'bold'
								}
							},
							legend:{
								align: 'left',
								verticalAlign: 'top',
								floating: true
							}
						};
						priorityChartObj.series = [];
						var seriesObj = {
                            name : nameSeries,
							data : []
						};
						_.forEach(priorityObj.priorityValues, function (valueObj) {
							seriesObj.data.push({
								name: valueObj.priorityValue.name,
								y: valueObj[property]
							});
						});
						priorityChartObj.series.push(seriesObj);
						retArray.push(priorityChartObj);
					});
				}
			});
			return retArray;
		};



		//var getChartSeriesData = function(projectCategorization){
		//   return _.map(projectCategorization, function(groupObj){
		//       return {
		//           name : groupObj.group.name,
		//           y : groupObj.countGroup,
		//           drilldown : groupObj.group._id
		//       };
		//   });
		//};
		//
		//var getDrilldownSeries = function(projectCategorization){
		//   var drilldownSeries = [];
		//   _.forEach(projectCategorization, function(groupObj){
		//       var groupSeriesObj = {};
		//       groupSeriesObj.id = groupObj.group._id;
		//       groupSeriesObj.name = groupObj.group.name;
		//       groupSeriesObj.data = [];
		//       _.forEach(groupObj.categories, function(categoryObj){
		//           groupSeriesObj.data.push({
		//               name: categoryObj.category.name,
		//               y: categoryObj.countCategory,
		//               drilldown: categoryObj.category._id
		//           });
		//           var categorySeriesObj = {};
		//           categorySeriesObj.id = categoryObj.category._id;
		//           categorySeriesObj.data = [];
		//           _.forEach(categoryObj.categoryValues, function(valueObj){
		//               categorySeriesObj.data.push({
		//                   name: valueObj.categoryValue.name,
		//                   y: valueObj.countCategoryValue
		//               });
		//           });
		//           drilldownSeries.push(categorySeriesObj);
		//       });
		//       drilldownSeries.push(groupSeriesObj);
		//   });
		//   return drilldownSeries;
		//};
		//
		//
		////This is not a highcharts object. It just looks a little like one!
		//$scope.chartConfig = {
		//
		//	options: {
		//		//This is the Main Highcharts chart config. Any Highchart options are valid here.
		//		//will be overriden by values specified below.
		//		chart: {
		//			type: 'pie'
		//		},
		//		tooltip: {
		//			style: {
		//				padding: 10,
		//				fontWeight: 'bold'
		//			}
		//		}
		//	},
		//	//The below properties are watched separately for changes.
		//
		//	//Series object (optional) - a list of series using normal Highcharts series options.
		//	series: [{
		//       name :'ciao',
		//		data: [{name:'ciao bello', y: 10}, 15, 12, 8, 7]
		//	}],
		//	//Title configuration (optional)
		//	title: {
		//		text: 'Hello'
		//	},
		//	//Boolean to control showing loading status on chart (optional)
		//	//Could be a string if you want to show specific loading text.
		//	loading: false,
		//	//Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
		//	//properties currentMin and currentMax provided 2-way binding to the chart's maximum and minimum
		//	xAxis: {
		//		currentMin: 0,
		//		currentMax: 20,
		//		title: {text: 'values'}
		//	},
		//	//Whether to use Highstocks instead of Highcharts (optional). Defaults to false.
		//	useHighStocks: false,
		//	//size (optional) if left out the chart will default to size of the div or something sensible.
		//	//size: {
		//	//	width: 400,
		//	//	height: 300
		//	//},
		//	//function (optional)
		//	func: function (chart) {
		//		//setup some logic for the chart
		//	}
		//};

		//$scope.chartConfig2 = {
		//
		//	title: {
		//		text: 'Basic drilldown'
		//	},
		//	xAxis: {
		//		type: 'category'
		//	},
		//
		//	legend: {
		//		enabled: false
		//	},
		//
		//   options : {
		//
		//       chart: {
		//           type: 'column'
		//       },
		//
		//       plotOptions: {
		//           series: {
		//               borderWidth: 0,
		//               dataLabels: {
		//                   enabled: true
		//               }
		//           }
		//       },
		//
		//       drilldown: {
		//           series: [{
		//               id: 'animals',
		//               name: 'Animals',
		//               data: [{
		//                   name: 'Cats',
		//                   y: 4,
		//                   drilldown: 'cats'
		//               }, ['Dogs', 2],
		//                   ['Cows', 1],
		//                   ['Sheep', 2],
		//                   ['Pigs', 1]
		//               ]
		//           }, {
		//
		//               id: 'cats',
		//               data: [{name:'calico',
		//                   y:1},
		//                   {name:'tabby',
		//                       y:2},
		//                   {name:'mix',
		//                       y:1}
		//               ]
		//           }]
		//       }
		//   },
		//
		//   series: [{
		//       name: 'Things',
		//       colorByPoint: true,
		//       data: [{
		//           name: 'Animals',
		//           y: 5,
		//           drilldown: 'animals'
		//       }]
		//   }]
		//};





	}
]);

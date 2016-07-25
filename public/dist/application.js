'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'meanjs-test2';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
		'ui.router', 'ui.bootstrap', 'ui.utils','checklist-model','as.sortable', 'angular-loading-bar'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

// Library: Angular-loading-bar
angular.module(ApplicationConfiguration.applicationModuleName).config(['cfpLoadingBarProvider',
	function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
	}
]);

// Loading bar

angular.module(ApplicationConfiguration.applicationModuleName).run(function($rootScope){

	//$rootScope.$on('$stateChangeStart',
	//	function(event, toState, toParams, fromState, fromParams){
	//		$rootScope.stateIsLoading = true; // Show progress bar while loading data
	//	}
	//);
    //
	//$rootScope.$on('$stateChangeSuccess',
	//	function(event, toState, toParams, fromState, fromParams){
	//		$rootScope.stateIsLoading = false;
	//	}
	//);

});


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('category-assignment');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('category-setup');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('dependency-analysis');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('dependency-setup');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('evaluation-summaries');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('financial-analysis-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('financial-analysis');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('gate-performances');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('gate-process-assignment');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('gate-process-templates');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('gate-review-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('gate-reviews');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('improvement-activities');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('improvement-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('log-delivery-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('log-milestone-setup');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('log-summaries');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('maturity-management');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('maturity-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('mytao');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('people-portfolio-analysis');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('people-project-analysis');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('people-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-assignment');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-change-requests');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-issues');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-milestones');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-ranking-assignment');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-review-templates');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-reviews');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-setup');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-status-reports');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('portfolio-status-updates');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('priority-assignment');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('priority-setup');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('project-change-requests');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('project-identification');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('project-issues');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('project-milestones');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('project-review-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('project-review-templates');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('project-reviews');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('project-selection');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('project-status-updates');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('qualitative-analysis-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('qualitative-analysis');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('review-summaries');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('risk-analysis-setup');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('risk-analysis');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('roadmaps');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('status-report-setup');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('status-summaries');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('strategy-alignment');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('strategy-node-setup');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('subusers');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown');
		// Menus.addSubMenuItem('topbar', 'definition', 'Articles', 'menuTitle');
		// Menus.addSubMenuItem('topbar', 'definition', 'List articles', 'articles');
		// Menus.addSubMenuItem('topbar', 'definition', 'New Article', 'articles/create');
	}
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);

'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.articlesCreateURL = function(){
			$location.path('articles/create');
		};

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('category-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Category assignment state routing
		$stateProvider.
		state('categorization-overview', {
			url: '/categorization-overview',
			templateUrl: 'modules/category-assignment/views/categorization-overview.client.view.html'
		}).
		state('category-assignment', {
			url: '/category-assignment',
			templateUrl: 'modules/category-assignment/views/category-assignment.client.view.html'
		});
	}
]);
'use strict';

// Definition dashboards controller
angular.module('category-assignment').controller('CategorizationOverviewController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'CategoryAssignment','CategoryGroups', 'Categories', 'Portfolios', 'StrategyNodes', '_','$q', '$sce',
	function($rootScope, $scope, $stateParams, $location, Authentication, CategoryAssignment, CategoryGroups, Categories, Portfolios, StrategyNodes, _, $q, $sce) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		$scope.typeOfChart = 'number';

		var projectCategorizationPortfolio = [];
        var projectCategorizationStrategy = [];

		$scope.init = function(){

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

            StrategyNodes.query(function(res){
                $scope.strategyNodes = res;
                $scope.strategyTrees = createNodeTrees(res);
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

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

			CategoryAssignment.categorizationOverviewPortfolio(function(res){
				projectCategorizationPortfolio = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            CategoryAssignment.categorizationOverviewStrategy(function(res){
                projectCategorizationStrategy = res;
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

		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};



		// ------- CATEGORIZATION DASHBOARD ------

        $scope.tooltipView = 'error';
		$scope.createTooltipView = function(projects){
            var stringArray = _.map(projects, function(project){
                return $sce.trustAsHtml('<a>'+project.identification.name+'</a><hr style="margin: 0.1%">');
            });
            $scope.tooltipView = stringArray.join('');// join as an empty string for between strings, override default ','
		};

		$scope.orderTable = 'countCategoryValue';

		$scope.selectPortfolio = function(portfolio){
			if(portfolio === 'all'){
				$scope.selectedPortfolio = {name : 'All'};
				$scope.projectCategorizationPortfolioView = _.filter(projectCategorizationPortfolio, function(item){
					return item.all === true;
				});
				return;
			}
			if(portfolio === 'unassigned'){
				$scope.selectedPortfolio = {name : 'Unassigned'};
				$scope.projectCategorizationPortfolioView = _.filter(projectCategorizationPortfolio, function(item){
					return (item.all === false) && (!item.portfolio);
				});
				return;
			}
			$scope.selectedPortfolio = portfolio;
			$scope.projectCategorizationPortfolioView = _.filter(projectCategorizationPortfolio, function(item){
				return (item.portfolio) && (item.portfolio === portfolio._id);
			});
		};

        $scope.selectStrategyNode = function(strategyNode){
            if(strategyNode === 'all'){
                $scope.selectedStrategyNode = {name : 'All'};
                $scope.projectCategorizationStrategyView = _.filter(projectCategorizationStrategy, function(item){
                    return item.all === true;
                });
                return;
            }
            if(strategyNode === 'unassigned'){
                $scope.selectedStrategyNode = {name : 'Unassigned'};
                $scope.projectCategorizationStrategyView = _.filter(projectCategorizationStrategy, function(item){
                    return (item.all === false) && (!item.parent);
                });
                return;
            }
            $scope.selectedStrategyNode = strategyNode;
            $scope.projectCategorizationStrategyView = _.filter(projectCategorizationStrategy, function(item){
                return (item.parent) && (item.parent === strategyNode._id);
            });
        };



	}
]);

'use strict';

angular.module('category-assignment').controller('CategoryAssignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'GateProcessTemplates', 'CategoryGroups', 'Categories', 'CategoryValues', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcessTemplates, CategoryGroups, Categories, CategoryValues, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

			Projects.query({'selection.active': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(res){
				$scope.portfolios = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            GateProcessTemplates.query(function(res){
                $scope.gateProcesses = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			CategoryGroups.query(function(groups){
				$scope.categoryGroups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Categories.query(function(categories){
				$scope.categories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            CategoryValues.query(function(values){
                $scope.categoryValues = values;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            $scope.showCategoryValue = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
        };



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

        $scope.switchCategoryForm = {};

        $scope.selectCategoryForm = function(assignedCategory, string){
            if(string === 'view'){$scope.switchCategoryForm[assignedCategory._id] = 'view';}
            if(string === 'edit'){$scope.switchCategoryForm[assignedCategory._id] = 'edit';}
        };

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

        var originalCategoryAssignment;
		$scope.selectProject = function(project){
            originalCategoryAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification categorization portfolio',
				deepPopulateArray : [
					'portfolio',
					'categorization.group','categorization.categories.category.categoryValues'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
            originalCategoryAssignment = null;
		};


        // ------------- SELECT CATEGORY ASSIGNMENT ---------

        $scope.selectCategoryAssignment = function(assignedCategory){
            originalCategoryAssignment[assignedCategory._id] = _.clone(assignedCategory);
            $scope.selectCategoryForm(assignedCategory, 'edit');
        };



        // ------------- EDIT CATEGORY ASSIGNMENT ---------

        $scope.saveAssignedCategory = function(project, assignedGroup, assignedCategory){
            Projects.updateCategoryAssignment(
                {
                    projectId: project._id,
                    assignedGroupId: assignedGroup._id,
                    assignedCategoryId: assignedCategory._id
                },{valueId: assignedCategory.categoryValue}, function(res){
                    $scope.error = null;
                    $scope.selectCategoryForm(assignedCategory, 'view');
                }, function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditAssignedCategory = function(assignedCategory){
            $scope.error = null;
            assignedCategory.categoryValue = originalCategoryAssignment[assignedCategory._id].categoryValue;
            $scope.selectCategoryForm(assignedCategory, 'view');
        };


	}
]);

'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('category-assignment').factory('CategoryAssignment', ['$resource',
	function($resource) {
		return $resource('category-assignment', {
		}, {
			categorizationOverviewPortfolio: {
				method: 'GET',
				isArray: true,
				url: 'category-assignment/categorizationOverviewPortfolio'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			},
            categorizationOverviewStrategy: {
                method: 'GET',
                isArray: true,
                url: 'category-assignment/categorizationOverviewStrategy'
                // req.query: { project: project._id }
                // Returns: [{gate: ... , projectChangeRequests: ... }]
            }
		});
	}
]);

'use strict';

//Setting up route
angular.module('category-setup').config(['$stateProvider',
	function($stateProvider) {
		// Category setup state routing
		$stateProvider.
		state('category-setup', {
			url: '/category-setup',
			templateUrl: 'modules/category-setup/views/category-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('category-setup').controller('CategorySetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'CategoryGroups','Categories','CategoryValues','$q','_',
    function($rootScope, $scope, $stateParams, $location, Authentication, CategoryGroups, Categories, CategoryValues, $q, _) {

        $rootScope.staticMenu = false;

        // ------------- INIT -------------

        $scope.init = function(){
            CategoryGroups.query(function(groups){
                $scope.categoryGroups = groups;
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

        // ------------------- NG-SWITCH ---------------------

        $scope.switchCategoryGroupForm = {};

        $scope.selectCategoryGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchCategoryGroupForm[group._id] = 'view';}
            if(string === 'edit'){$scope.switchCategoryGroupForm[group._id] = 'edit';}
        };

        $scope.switchCategoryForm = {};

        $scope.selectCategoryForm = function(category, string){
            if(string === 'view'){ $scope.switchCategoryForm[category._id] = 'view';}
            if(string === 'new'){$scope.switchCategoryForm[category._id] = 'new';}
            if(string === 'edit'){$scope.switchCategoryForm[category._id] = 'edit';}
        };

        $scope.switchCategoryValueForm = {};

        $scope.selectCategoryValueForm = function(categoryValue, string){
            if(string === 'view'){ $scope.switchCategoryValueForm[categoryValue._id] = 'view';}
            if(string === 'edit'){$scope.switchCategoryValueForm[categoryValue._id] = 'edit';}
        };

        $scope.categoryGroupDetails = 'groupHeader';

        $scope.categoryDetails = 'categoryHeader';

        // ----------------- REFRESH CATEGORY GROUPS LIST ------------

        $scope.categoryGroupList = function(){
            CategoryGroups.query(function(categoryGroups){
                $scope.categoryGroups = categoryGroups;
            });
        };


        // ------------------ CREATE CATEGORY GROUP ----------------

        $scope.createCategoryGroup = function() {
            $scope.error = null;

            var categoryGroup = new CategoryGroups ({
                name: 'New category group',
                categories: []
            });

            categoryGroup.$save(function(response) {
                $scope.categoryGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------ CREATE CATEGORY ----------------

        $scope.createCategory = function(group) {
            var category = new Categories ({
                name: 'New category',
                categoryValues: []
            });
            category.$save({groupId: group._id}, function(res) {
                // Add new category to the view group
                group.categories.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT CATEGORY GROUP (HEADER ONLY) -----------------

        var originalEditCategoryGroup = {};

        $scope.selectCategoryGroup = function(categoryGroup){
            originalEditCategoryGroup = _.clone(categoryGroup);
            $scope.selectedCategoryGroup = categoryGroup;
        };

        $scope.updateCategoryGroup = function(group) {
            CategoryGroups.update({
                _id: group._id,
                name: group.name,
                description: group.description
            }, function(group){
                $scope.selectCategoryGroupForm(group, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCategoryGroup = function(group){
            $scope.error = null;
            $scope.selectedCategoryGroup.name = originalEditCategoryGroup.name;
            $scope.selectedCategoryGroup.description = originalEditCategoryGroup.description;
            $scope.selectCategoryGroupForm(group, 'view');
        };

        // ------------------- EDIT CATEGORY (HEADER ONLY) -----------------

        var originalEditCategory = {};

        $scope.selectCategory = function(category){
            originalEditCategory[category._id] = _.clone(category);
            $scope.error = null;
            $scope.selectCategoryForm(category, 'edit');
        };

        $scope.updateCategory = function(category) {
            Categories.update({
                _id: category._id,
                name: category.name,
                description: category.description
            }, function(category){
                $scope.selectCategoryForm(category, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCategory = function(category){
            $scope.error = null;
            category.name = originalEditCategory[category._id].name;
            category.description = originalEditCategory[category._id].description;
            $scope.selectCategoryForm(category, 'view');
        };


        // ------------------- REMOVE CATEGORY GROUP -----------------

        $scope.removeCategoryGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.selectedCategoryGroup = null;
                $scope.categoryGroupList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------- REMOVE CATEGORY -----------------

        $scope.removeCategory = function(group, category) {
            $scope.error = null;

            Categories.remove({groupId: group._id},category, function(res){
                group.categories = _.without(group.categories, category);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // ------------------ CREATE CATEGORY VALUE ----------------

        $scope.createCategoryValue = function(category) {
            $scope.error = null;

            var categoryValue = new CategoryValues ({
                name: 'New category value',
                description: 'New category value description'
            });

            categoryValue.$save({categoryId: category._id}, function(categoryValueRes) {
                // Add values to the view category
                category.categoryValues.push(categoryValueRes);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT CATEGORY VALUE -----------------

        var originalEditCategoryValue = {};

        $scope.selectEditCategoryValue = function(category, categoryValue){
            originalEditCategoryValue[categoryValue._id] = _.clone(categoryValue);
            $scope.selectCategoryValueForm(categoryValue, 'edit');
        };

        $scope.updateCategoryValue = function(category, categoryValue) {
            CategoryValues.update(categoryValue, function(response) {
                $scope.selectCategoryValueForm(categoryValue, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCategoryValue = function(categoryValue){
            $scope.error = null;
            categoryValue.name = originalEditCategoryValue[categoryValue._id].name;
            categoryValue.description = originalEditCategoryValue[categoryValue._id].description;
            $scope.selectCategoryValueForm(categoryValue, 'view');
        };

        // ------------------- REMOVE CATEGORY VALUE -----------------

        $scope.removeCategoryValue = function(category, categoryValue) {
            $scope.error = null;
            CategoryValues.remove({categoryId: category._id},categoryValue, function(value){
                category.categoryValues = _.without(category.categoryValues, categoryValue);
            }, function(err){
                $scope.error = err.data.message;
            });
        };
    }
]);

'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('category-setup').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Category groups service used to communicate Category groups REST endpoints
angular.module('category-setup').factory('CategoryGroups', ['$resource',
	function($resource) {
		return $resource('category-groups/:categoryGroupId', { categoryGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Category values service used to communicate Category values REST endpoints
angular.module('category-setup').factory('CategoryValues', ['$resource',
	function($resource) {
		return $resource('category-values/:categoryValueId', { categoryValueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
            templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');


		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);

'use strict';


angular.module('core').controller('HomeController', ['$scope','$rootScope', 'Authentication', '$stateParams','_','$anchorScroll','$location',
	function($scope, $rootScope, Authentication, $stateParams, _, $anchorScroll, $location) {



		// This provides Authentication context.
		$scope.authentication = Authentication;

		

		$scope.goToRegistrationForm = function(){
				$location.hash('mc_embed_signup');
				$anchorScroll();
		};


	}
]);

'use strict';

angular.module('core').directive('graph', ['d3', '_',
	function(d3, _) {
        return {
            restrict: 'EA',
            scope:{
                data : '=data',
                selectNode : '=selectNode',
                selectLink : '=selectLink',
                width : '=width',
                height : '=height'
            },
            link: function(scope, element){

                var setupParameters, weightScale, valueScale,
                    drawGraph, redrawGraph;

                var width = scope.width,
                    height = scope.height,
                    inputData = scope.data;

                var color = d3.scale.category20();

                var force = d3.layout.force()
                    .charge(-200)
                    .linkDistance(100)
                    .size([width, height]);

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', width)
                    .attr('height', height);

                var onMouseoverLink, onMouseoverNode,
                    onMouseoutLink, onMouseoutNode,
                    onClickLink, onClickNode;


                var getNodeColorGroup = function(d){
                    return 1;
                };

                onMouseoverLink = function(that, d, i){

                };

                onMouseoutLink = function(that, d, i){

                };

                onClickLink = function(that, d, i){
                    scope.selectLink(d);
                };

                onMouseoverNode = function(that, d, i){

                };

                onMouseoutNode = function(that, d, i){

                };

                onClickNode = function(that, d, i){
                    scope.selectNode(d);
                    d.fixed = !d.fixed;
                };

                setupParameters = function(){

                    weightScale = d3.scale.linear()
                        .domain(d3.extent(inputData.nodes, function(d){ return d.weight; }))
                        .range([6, 20]);

                    valueScale = d3.scale.linear()
                        .domain(d3.extent(inputData.links, function(d){ return d.value; }))
                        .range([3, 10]);
                };

                drawGraph = function(){

                    setupParameters();
                    
                    force
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .links(inputData.links, function(d){return d._id;})
                        .start();

                    var link = svg.selectAll('.link')
                        .data(inputData.links, function(d){ return d._id; })
                        .enter().append('line')
                        .attr('class', 'link')
                        .style('stroke-width', function(d) { return valueScale(d.value); })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var node = svg.selectAll('.node')
                        .data(inputData.nodes, function(d){ return d._id; })
                        .enter().append('circle')
                        .attr('class', 'node')
                        .attr('r', function(d){ return weightScale(d.weight); })
                        .style('fill', function(d) { return color(getNodeColorGroup(d)); })
                        .call(force.drag)
                        .on('click', function(d,i){ onClickNode(this, d, i); });

                    node.append('title')
                        .text(function(d) { return d.identification.name; });

                    force.on('tick', function() {
                        link.attr('x1', function(d) { return d.source.x; })
                            .attr('y1', function(d) { return d.source.y; })
                            .attr('x2', function(d) { return d.target.x; })
                            .attr('y2', function(d) { return d.target.y; });

                        node.attr('cx', function(d) { return d.x; })
                            .attr('cy', function(d) { return d.y; });
                    });
                };

                drawGraph();

                scope.$watchCollection(
                    function(){ return scope.data; },
                    function(newVal, oldVal){
                        if(newVal !== oldVal){
                            console.log(newVal);
                            inputData = newVal;
                            redrawGraph();
                        }
                    });

                redrawGraph = function(){

                    force.stop();

                    force
                        .links(inputData.links, function(d){return d._id;})
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .start();

                    setupParameters();

                    var newLinks = svg.selectAll('.link')
                        .data(inputData.links, function(d){ return d._id; });

                    var newNodes = svg.selectAll('.node')
                        .data(inputData.nodes, function(d){ return d._id; });

                    // Redraw the existing one

                    var existingNewLinks = newLinks
                        .style('stroke-width', function(d) { return valueScale(d.value); })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var existingNewNodes = newNodes
                        .attr('r', function(d){ return weightScale(d.weight); })
                        .style('fill', function(d) { return color(getNodeColorGroup(d)); })
                        .call(force.drag)
                        .on('click', function(d,i){ onClickNode(this, d, i); });

                    existingNewNodes.append('title')
                        .text(function(d) { return d.identification.name; });

                    // Draw the newly appended

                    var appendedNewLinks = newLinks.enter()
                        .append('line')
                        .attr('class', 'link')
                        .style('stroke-width', function(d) { return valueScale(d.value); })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var appendedNewNodes = newNodes.enter()
                        .append('circle')
                        .attr('class', 'node')
                        .attr('r', function(d){ return weightScale(d.weight); })
                        .style('fill', function(d) { return color(getNodeColorGroup(d)); })
                        .call(force.drag)
                        .on('click', function(d,i){ onClickNode(this, d, i); });

                    appendedNewNodes.append('title')
                        .text(function(d) { return d.identification.name; });

                    // Delete the exited

                    newLinks.exit()
                        .transition()
                        .duration(1000)
                        .style('opacity', 0)
                        .remove();

                    newNodes.exit()
                        .transition()
                        .duration(2000)
                        .style('opacity', 0)
                        .remove();


                    force.on('tick', function() {
                        d3.selectAll('.link').attr('x1', function(d) { return d.source.x; })
                            .attr('y1', function(d) { return d.source.y; })
                            .attr('x2', function(d) { return d.target.x; })
                            .attr('y2', function(d) { return d.target.y; });

                        d3.selectAll('.node').attr('cx', function(d) { return d.x; })
                            .attr('cy', function(d) { return d.y; });
                    });

                };

            }
        };
	}
]);

'use strict';

angular.module('core').directive('portfolioTree', [
	function() {
		return {
			restrict: 'EA',
			scope: { portfolios:'=portfolios', portfolioTrees:'=portfolioTrees', selectPortfolio:'=selectPortfolio', isResolving:'=isResolving' },
			templateUrl:'modules/core/directives/portfolio-tree.client.directive.html'
		};
	}
]);

'use strict';

angular.module('core').directive('projectList', [
	function() {
		return {
            restrict: 'EA',
            scope: { projects:'=projects', selectProject:'=selectProject', portfolios:'=portfolios', gateProcesses:'=gateProcesses', isResolving:'=isResolving' },
            templateUrl:'modules/core/directives/project-list.client.directive.html'
		};
	}
]);

'use strict';

angular.module('core').directive('roadmapDelivery', ['d3', '_', '$parse',
    function(d3, _, $parse) {
        return {
            restrict: 'EA',
            // scope:{
            //     data : '=data',
            //     selectProject : '=selectProject'
            // },
            link: function(scope, element, attrs){

                var parseData = $parse(attrs.data);
                var parseSelectProject = $parse(attrs.selectProject);

                var selectProject = parseSelectProject(scope);
                var data = parseData(scope);

                var baseColorRectDelivery = '#d3d3d3';

                var margin = {top: 20, right: 20, left: 20},
                    width = 710 - margin.left - margin.right,
                    barHeight = 20;

                var x, xAxis, setChartParameters,
                    onMouseover, onMouseout, onClick,
                    drawChart, redrawChart;

                scope.$watchCollection(parseData, function(newVal, oldVal){
                    if(newVal !== oldVal){
                        data = newVal;
                        redrawChart();
                    }
                });

                setChartParameters = function(){

                    var minAbsolute = d3.min(data, function(d){if(d.gateData.start){return new Date(d.gateData.start);}});
                    var maxAbsolute = d3.max(data, function(d){if(d.gateData.end){return new Date(d.gateData.end);}});

                    x = d3.time.scale()
                        .domain([minAbsolute, maxAbsolute])
                        .range([0, width-(1.5*margin.left + 1.5*margin.right)]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('top');

                };

                onMouseover = function(that, d){
                    d3.select(that).style('cursor', 'pointer');
                };

                onMouseout = function(that, d){
                    d3.select(that).style('cursor', 'auto');
                };

                onClick = function(that, d){
                    selectProject(d);
                };

                d3.select(element[0]).append('svg').attr('id', 'svgDelivery');

                drawChart = function(){

                    setChartParameters();

                    var chart = d3.select('#svgDelivery')
                        .attr('width', width)
                        .attr('height', (barHeight * data.length) + 2 * margin.top)
                        .append('g')
                        .attr('id', 'chartDelivery')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    chart.append('g')
                        .attr('class', 'x axis')
                        .call(xAxis)
                        .attr('transform', 'translate(' + margin.left + ',' + 0 + ')');

                    var bar = chart.selectAll('.barDelivery')
                        .data(data, function(d){
                            return d._id;
                        })
                        .enter().append('g')
                        .attr('class', 'barDelivery')
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.gateData.start)) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });

                    bar.append('rect')
                        .attr('class', 'rectDelivery')
                        .attr('width', function(d){ return x(new Date(d.gateData.end)) - x(new Date(d.gateData.start));})
                        .attr('height', barHeight - 1)
                        .attr('fill', function(d){ if(d.gateData.status.color){return d.gateData.status.color;} return baseColorRectDelivery; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    bar.append('text')
                        .attr('x', function(d) { return (x(new Date(d.gateData.end)) - x(new Date(d.gateData.start)))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.identification.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                };

                redrawChart = function(){

                    setChartParameters();

                    var svg = d3.select('#svgDelivery')
                        .attr('height', (barHeight * data.length) + 2 * margin.top);

                    var chart = svg.select('#chartDelivery');

                    chart.select('.x.axis')
                        .call(xAxis);

                    // Bind the new data

                    var newBars = chart.selectAll('.barDelivery')
                        .data(data, function(d){
                            return d._id;
                        });

                    // Redraw the ones not changed

                    newBars
                        .transition().duration(1000)
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.gateData.start)) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });

                    newBars.selectAll('.rectDelivery')
                        .attr('width', function(d){ return x(new Date(d.gateData.end)) - x(new Date(d.gateData.start));})
                        .attr('fill', function(d){ if(d.gateData.status.color){return d.gateData.status.color;} return baseColorRectDelivery; });

                    newBars.selectAll('text')
                        .attr('x', function(d) { return (x(new Date(d.gateData.end)) - x(new Date(d.gateData.start)))/3; });


                    // Draw the ones added

                    var newAppendedBar = newBars.enter().append('g')
                        .attr('class', 'barDelivery')
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.gateData.start)) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });

                    newAppendedBar.append('rect')
                        .attr('class', 'rectDelivery')
                        .attr('width', function(d){ return x(new Date(d.gateData.end)) - x(new Date(d.gateData.start));})
                        .attr('height', barHeight - 1)
                        .attr('fill', function(d){ if(d.gateData.status.color){return d.gateData.status.color;} return baseColorRectDelivery; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); })
                        .append('title')
                        .text(function(d){ return d.identification.name +' - '+'Start: '+d3.time.format('%b %a %e, %Y')(new Date(d.gateData.start))+' - '+'End: '+d3.time.format('%b %a %e, %Y')(new Date(d.gateData.end)); });

                    newAppendedBar.append('text')
                        .attr('x', function(d) { return (x(new Date(d.gateData.end)) - x(new Date(d.gateData.start)))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.identification.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    // Remove the ones removed

                    var newRemovedBar = newBars.exit().remove();

                };

                drawChart();

            }
        };
    }
]);

'use strict';

angular.module('core').directive('roadmap', ['d3', '_', '$parse',
    function(d3, _, $parse) {
        return {
            restrict: 'EA',
            // scope:{
            //     data : '=data',
            //     selectProject : '=selectProject'
            // },
            link: function(scope, element, attrs){

                var parseData = $parse(attrs.data);
                var parseSelectProject = $parse(attrs.selectProject);

                var selectProject = parseSelectProject(scope);
                var data = parseData(scope);

                var baseColorRectDelivery = '#d3d3d3';

                var margin = {top: 20, right: 20, left: 20},
                    width = 710 - margin.left - margin.right,
                    barHeight = 20;

                var x, xAxis, setChartParameters,
                    onMouseover, onMouseout, onClick,
                    drawChart, redrawChart;

                scope.$watchCollection(parseData, function(newVal, oldVal){
                    if(newVal !== oldVal){
                        data = newVal;
                        redrawChart();
                    }
                });

                setChartParameters = function(){

                    var minAbsolute = d3.min(data, function(d){if(d.identification.reqStartDate){return new Date(d.identification.reqStartDate);}});
                    var maxAbsolute = d3.max(data, function(d){if(d.identification.reqEndDate){return new Date(d.identification.reqEndDate);}});

                    x = d3.time.scale()
                        .domain([minAbsolute, maxAbsolute])
                        .range([0, width-(1.5*margin.left + 1.5*margin.right)]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient('top');

                };

                onMouseover = function(that, d){
                    d3.select(that).style('cursor', 'pointer');
                };

                onMouseout = function(that, d){
                    d3.select(that).style('cursor', 'auto');
                };

                onClick = function(that, d){
                    selectProject(d);
                };

                d3.select(element[0]).append('svg').attr('id', 'svgDefinition');

                drawChart = function(){

                    setChartParameters();

                    var chart = d3.select('#svgDefinition')
                        .attr('width', width)
                        .attr('height', (barHeight * data.length) + 2 * margin.top)
                        .append('g')
                        .attr('id', 'chartDefinition')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    chart.append('g')
                        .attr('class', 'x axis')
                        .call(xAxis)
                        .attr('transform', 'translate(' + margin.left + ',' + 0 + ')');

                    var bar = chart.selectAll('.barDefinition')
                        .data(data, function(d){
                            return d._id;
                        })
                        .enter().append('g')
                        .attr('class', 'barDefinition')
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.identification.reqStartDate)) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });

                    bar.append('rect')
                        .attr('class', 'rectDefinition')
                        .attr('width', function(d){ return x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate));})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    bar.append('text')
                        .attr('x', function(d) { return (x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate)))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.identification.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                };

                redrawChart = function(){

                    setChartParameters();

                    var svg = d3.select('#svgDefinition')
                        .attr('height', (barHeight * data.length) + 2 * margin.top);

                    var chart = svg.select('#chartDefinition');

                    chart.select('.x.axis')
                        .call(xAxis);

                    // Bind the new data

                    var newBars = chart.selectAll('.barDefinition')
                        .data(data, function(d){
                            return d._id;
                        });

                    // Redraw the ones not changed

                    newBars
                        .transition().duration(1000)
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.identification.reqStartDate)) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });

                    newBars.selectAll('.rectDefinition')
                        .attr('width', function(d){ return x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate));});

                    newBars.selectAll('text')
                        .attr('x', function(d) { return (x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate)))/3; });


                    // Draw the ones added

                    var newAppendedBar = newBars.enter().append('g')
                        .attr('class', 'barDefinition')
                        .attr('transform', function(d, i) { return 'translate('+ (x(new Date(d.identification.reqStartDate)) + margin.left) +',' + ((i * barHeight) + margin.top) + ')'; });

                    newAppendedBar.append('rect')
                        .attr('class', 'rectDefinition')
                        .attr('width', function(d){ return x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate));})
                        .attr('height', barHeight - 1)
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); })
                        .append('title')
                        .text(function(d){ return d.identification.name +' - '+'Start: '+d3.time.format('%b %a %e, %Y')(new Date(d.identification.reqStartDate))+' - '+'End: '+d3.time.format('%b %a %e, %Y')(new Date(d.identification.reqEndDate)); });

                    newAppendedBar.append('text')
                        .attr('x', function(d) { return (x(new Date(d.identification.reqEndDate)) - x(new Date(d.identification.reqStartDate)))/3; })
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function(d) { return d.identification.name; })
                        .on('mouseover', function(d) { onMouseover(this, d); })
                        .on('mouseout', function(d) { onMouseout(this, d); })
                        .on('click', function(d){ onClick(this, d); });

                    // Remove the ones removed

                    var newRemovedBar = newBars.exit().remove();

                };

                drawChart();

            }
        };
    }
]);

'use strict';

angular.module('core').directive('sankey', ['d3', '_',
    function(d3, _) {
        return {
            restrict: 'EA',
            scope:{
                data : '=data',
                selectNode : '=selectNode',
                selectLink : '=selectLink',
                width : '=width',
                height : '=height'
            },
            link: function(scope, element){

                var setParameters, intensityRamp,
                    drawGraph, redrawGraph;

                var width = scope.width,
                    height = scope.height,
                    inputData = scope.data;

                var color = d3.scale.category20();

                var sankey = d3.sankey()
                    .size([width, height])
                    .nodeWidth(20)
                    .nodePadding(200);

                var gWidthOffset = 20;
                var gHeightOffset = 20;

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', width + gWidthOffset)
                    .attr('height', height + gHeightOffset);

                var sankeyG = svg.append('g')
                    .attr('transform', 'translate('+ gWidthOffset +','+ gHeightOffset +')')
                    .attr('id', 'sankeyG');

                var onMouseoverLink, onMouseoverNode,
                    onMouseoutLink, onMouseoutNode,
                    onClickLink, onClickNode;

                var allowNullImpact = function(impact){
                    if(impact && impact.numericalValue && (impact.numericalValue > 0)){
                        return impact.numericalValue;
                    }
                    return 1;
                };

                var getNodeColorGroup = function(d){
                    return 1;
                };

                // LINK interactivity functions

                onMouseoverLink = function(that, d, i){
                    d3.select(that).style('stroke-opacity', 0.8);
                };

                onMouseoutLink = function(that, d, i){
                    d3.selectAll('path.link').style('stroke-opacity', 0.5);
                };

                onClickLink = function(that, d, i){
                    scope.selectLink(d);
                };

                // NODE interactivity functions

                onMouseoverNode = function(that, d, i){

                };

                onMouseoutNode = function(that, d, i){

                };

                onClickNode = function(that, d, i){
                    scope.selectNode(d);
                };

                setParameters = function(){
                    intensityRamp = d3.scale.linear()
                        .domain([0, d3.max(inputData.links, function(d){
                            return d.value;
                        })])
                        .range(['black', 'red']);
                };

                // DRAW

                drawGraph = function(){

                    setParameters();

                    sankey
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .links(inputData.links, function(d){return d._id;})
                        .layout(200);

                    var link = sankeyG.selectAll('.link')
                        .data(inputData.links, function(d){return d._id;})
                        .enter().append('path')
                        .attr('class', 'link')
                        .attr('d', sankey.link())
                        .style('stroke-width', function(d){ return d.dy; })
                        .style('stroke-opacity', 0.5)
                        .style('fill', 'none')
                        .style('stroke', function(d){ return intensityRamp(d.value);})
                        .sort(function(a, b){ return b.dy - a.dy; })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var node = sankeyG.selectAll('.node')
                        .data(inputData.nodes, function(d){return d._id;})
                        .enter().append('g')
                        .attr('class', 'node')
                        .attr('transform', function(d){
                            return 'translate('+ d.x + ','+ d.y +')';
                        });

                    node.append('rect')
                        .attr('height', function(d){ return d.dy; })
                        .attr('width', 20)
                        .style('fill', 'pink')
                        .style('stroke', 'gray');

                    node.append('text')
                        .attr('x', 0)
                        .attr('y', function(d){ return d.dy / 2; })
                        .attr('text-anchor', 'middle')
                        .text(function(d) { return d.identification.name; });

                };

                drawGraph();

                scope.$watchCollection(
                    function(){ return scope.data; },
                    function(newVal, oldVal){
                        if(newVal !== oldVal){
                            console.log(newVal);
                            inputData = newVal;
                            redrawGraph();
                        }
                    });

                redrawGraph = function(){

                    setParameters();

                    sankey
                        .nodes(inputData.nodes, function(d){return d._id;})
                        .links(inputData.links, function(d){return d._id;})
                        .layout(32);

                    var newLinks = sankeyG.selectAll('.link')
                        .data(inputData.links, function(d){ return d._id; });

                    var newNodes = sankeyG.selectAll('.node')
                        .data(inputData.nodes, function(d){ return d._id; });

                    // Redraw the existing one

                    var existingNewLinks = newLinks
                        .attr('d', sankey.link())
                        .style('stroke-width', function(d){ return d.dy; })
                        .style('stroke', function(d){ return intensityRamp(d.value);})
                        .sort(function(a, b){ return b.dy - a.dy; })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var existingNewNodes = newNodes
                        .attr('transform', function(d){
                            return 'translate('+ d.x + ','+ d.y +')';
                        });

                    existingNewNodes.selectAll('rect')
                        .attr('height', function(d){ return d.dy; });

                    existingNewNodes.selectAll('text')
                        .attr('y', function(d){ return d.dy / 2; })
                        .text(function(d) { return d.identification.name; });

                    // Draw the newly appended

                    var appendedNewLinks = newLinks.enter()
                        .append('path')
                        .attr('class', 'link')
                        .attr('d', sankey.link())
                        .style('stroke-width', function(d){ return d.dy; })
                        .style('stroke-opacity', 0.5)
                        .style('fill', 'none')
                        .style('stroke', function(d){ return intensityRamp(d.value);})
                        .sort(function(a, b){ return b.dy - a.dy; })
                        .on('mouseover', function(d,i) { onMouseoverLink(this, d, i); })
                        .on('mouseout', function(d,i) { onMouseoutLink(this, d, i); })
                        .on('click', function(d,i){ onClickLink(this, d, i); });

                    var appendedNewNodes = newNodes.enter()
                        .append('g')
                        .attr('class', 'node')
                        .attr('transform', function(d){
                            return 'translate('+ d.x + ','+ d.y +')';
                        });

                    appendedNewNodes.append('rect')
                        .attr('height', function(d){ return d.dy; })
                        .attr('width', 20)
                        .style('fill', 'pink')
                        .style('stroke', 'gray');

                    appendedNewNodes.append('text')
                        .attr('x', 0)
                        .attr('y', function(d){ return d.dy / 2; })
                        .attr('text-anchor', 'middle')
                        .text(function(d) { return d.identification.name; });

                    // Delete the exited

                    newLinks.exit()
                        .transition()
                        .duration(3000)
                        .style('opacity', 0)
                        .remove();

                    newNodes.exit()
                        .transition()
                        .duration(4000)
                        .style('opacity', 0)
                        .remove();


                };

            }
        };
    }
]);

'use strict';

angular.module('core').filter('projectsCategorization', ['_',
	function(_) {
		return function(projects, filterCategorization) {
            if(filterCategorization.group && filterCategorization.category && filterCategorization.categoryValue){
                return _.filter(projects, function(project){
                    return _.find(project.categorization, function (assignedGroup) {
                        // Filter group
                        if(assignedGroup.group === filterCategorization.group._id){
                            return _.find(assignedGroup.categories, function(assignedCategory){
                                // Filter category & value
                                return (assignedCategory.category === filterCategorization.category._id &&
                                assignedCategory.categoryValue === filterCategorization.categoryValue._id);
                            });
                        }
                    });
                });
            } else {
                return projects;
            }
		};
	}
]);

'use strict';

angular.module('core').filter('projectsPrioritization', ['_',
	function(_) {
		return function(projects, filterPrioritization) {
			if(filterPrioritization.group && filterPrioritization.priority && filterPrioritization.priorityValue){
				return _.filter(projects, function(project){
					return _.find(project.prioritization, function (assignedGroup) {
						// Filter group
						if(assignedGroup.group === filterPrioritization.group._id){
							return _.find(assignedGroup.priorities, function(assignedPriority){
								// Filter priority & value
								return (assignedPriority.priority === filterPrioritization.priority._id &&
								assignedPriority.priorityValue === filterPrioritization.priorityValue._id);
							});
						}
					});
				});
			} else {
				return projects;
			}
		};
	}
]);

'use strict';

angular.module('core').filter('projectsProcess', ['_',
	function(_) {
		return function(projects, filterProcess) {
			if(filterProcess.unassigned){
				return _.filter(projects, function(project){
					return _.isNull(project.process);
				});
			} else if(filterProcess.process){
				return _.filter(projects, function(project){
                    if(project.process){
                        return project.process._id === filterProcess.process._id;
                    }
				});
			} else {
				return projects;
			}
		};
	}
]);

'use strict';

angular.module('core').factory('d3', ['$window',
    function($window) {
        // Lodash service logic
        // ...

        // Public API
        return $window.d3;
    }
]);

'use strict';

angular.module('core').factory('jQuery', ['$window',
	function($window) {
		// Jquery service logic
		// ...

		// Public API
		return $window.jQuery;
	}
]);

'use strict';

angular.module('core').factory('_', ['$window',
	function($window) {
		// Lodash service logic
		// ...

		// Public API
		return $window._;
	}
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');

		// taoPortfolio.com additions for menu
		this.addMenuItem('topbar','My Portfolios','mytao','item','mytao',false,['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
		this.addMenuItem('topbar','Admin','admin','dropdown','admin',false,['superAdmin','admin'],1);

		// SETUP
		this.addMenuItem('topbar','Setup','setup','dropdown','setup',false,['superAdmin','admin','pmo'],2);

			// Portfolio Definition
		this.addSubMenuItem('topbar', 'setup', 'Portfolio definition', 'menuTitle','menuTitle',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Strategy nodes
        this.addSubMenuItem('topbar', 'setup', 'Strategy nodes', 'strategy-node-setup','strategy-node-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
        		// Portfolios
		this.addSubMenuItem('topbar', 'setup', 'Portfolios', 'portfolio-setup','portfolio-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
				// Priorities
		this.addSubMenuItem('topbar', 'setup', 'Priorities', 'priority-setup','priority-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
				// Categories
		this.addSubMenuItem('topbar', 'setup', 'Categories', 'category-setup','category-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);

			// Portfolio Evaluation
		this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
		this.addSubMenuItem('topbar', 'setup', 'Portfolio evaluation', 'menuTitle','menuTitle',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
                // Financial analysis
        this.addSubMenuItem('topbar', 'setup', 'Financial analysis', 'financial-analysis-setup','financial-analysis-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
                // Qualitative analysis
        this.addSubMenuItem('topbar', 'setup', 'Qualitative analysis', 'qualitative-analysis-setup','qualitative-analysis-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
                // Risk analysis
        this.addSubMenuItem('topbar', 'setup', 'Risk analysis', 'risk-analysis-setup','risk-analysis-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
				// Dependencies
		this.addSubMenuItem('topbar', 'setup', 'Dependencies', 'dependency-setup','dependency-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Stakeholders
        this.addSubMenuItem('topbar', 'setup', 'Stakeholders', 'people-setup','people-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);

            // Review and Improvement
        this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
        this.addSubMenuItem('topbar', 'setup', 'Review and Improvement', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
                // Review setup
        this.addSubMenuItem('topbar', 'setup', 'Review setup', 'project-review-setup','project-review-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
                // Project Review
        this.addSubMenuItem('topbar', 'setup', 'Project review', 'project-review-templates','project-review-templates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
                // Portfolio Review
        this.addSubMenuItem('topbar', 'setup', 'Portfolio review', 'portfolio-review-templates','portfolio-review-templates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);
                // Maturity model
        this.addSubMenuItem('topbar', 'setup', 'Maturity model', 'maturity-setup','maturity-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],17);
                // Improvement activities
        this.addSubMenuItem('topbar', 'setup', 'Improvement activity', 'improvement-setup','improvement-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],18);

            // Portfolio Delivery
        this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],19);
        this.addSubMenuItem('topbar', 'setup', 'Portfolio delivery', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],20);
                // Gate Process
        this.addSubMenuItem('topbar', 'setup', 'Gate process templates', 'gate-process-templates','gate-process-templates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],21);
                // Gate Review
        this.addSubMenuItem('topbar', 'setup', 'Gate review', 'gate-review-setup','gate-review-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],22);
                // Issues & Changes
        this.addSubMenuItem('topbar', 'setup', 'Issues & Changes', 'log-delivery-setup','log-delivery-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],23);
                // Milestone log
        this.addSubMenuItem('topbar', 'setup', 'Milestones', 'log-milestone-setup','log-milestone-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],24);
			    // Status Report
		this.addSubMenuItem('topbar', 'setup', 'Status report', 'status-report-setup','status-report-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],25);


        // DEFINITION
		this.addMenuItem('topbar','Definition','definition','dropdown','definition',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
            // Identification
        this.addSubMenuItem('topbar', 'definition', 'Identification', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Projects identification
        this.addSubMenuItem('topbar', 'definition', 'Projects identification', 'project-identification','project-identification',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
                // Strategy alignment
        this.addSubMenuItem('topbar', 'definition', 'Strategy alignment', 'strategy-alignment','strategy-alignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
                // Portfolio assignment
        this.addSubMenuItem('topbar', 'definition', 'Portfolio assignment', 'portfolio-assignment','portfolio-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
            // Categorization
        this.addSubMenuItem('topbar', 'definition', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
        this.addSubMenuItem('topbar', 'definition', 'Categorization', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
                // Category assignment
        this.addSubMenuItem('topbar', 'definition', 'Category assignment', 'category-assignment','category-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
				// Categorization overview
		this.addSubMenuItem('topbar', 'definition', 'Categorization overview', 'categorization-overview','categorization-overview',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
            // Selection
        this.addSubMenuItem('topbar', 'definition', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
        this.addSubMenuItem('topbar', 'definition', 'Selection and Roadmaps', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
                // Projects selection
        this.addSubMenuItem('topbar', 'definition', 'Projects selection', 'project-selection','project-selection',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Portfolio roadmaps
        this.addSubMenuItem('topbar', 'definition', 'Portfolio roadmaps', 'roadmaps','roadmaps',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);
            // Prioritization
        this.addSubMenuItem('topbar', 'definition', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
        this.addSubMenuItem('topbar', 'definition', 'Prioritization', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
                // Priorities assignment
        this.addSubMenuItem('topbar', 'definition', 'Priority assignment', 'priority-assignment','priority-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
				// Prioritization overview
		this.addSubMenuItem('topbar', 'definition', 'Prioritization overview', 'prioritization-overview','prioritization-overview',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
                // Portfolio rankings
        this.addSubMenuItem('topbar', 'definition', 'Portfolio rankings', 'portfolio-ranking-assignment','portfolio-ranking-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);



        // EVALUATION
		this.addMenuItem('topbar','Evaluation','evaluation','dropdown','evaluation',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
            // Evaluation profiles
        this.addSubMenuItem('topbar', 'evaluation', 'Evaluation profiles', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Financial
        this.addSubMenuItem('topbar', 'evaluation', 'Financial analysis', 'financial-analysis','financial-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
                // Qualitative
        this.addSubMenuItem('topbar', 'evaluation', 'Qualitative analysis', 'qualitative-analysis','qualitative-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
                // Risk
        this.addSubMenuItem('topbar', 'evaluation', 'Risk analysis', 'risk-analysis','risk-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
                // Evaluation summary
        this.addSubMenuItem('topbar', 'evaluation', 'Evaluation summary', 'portfolio-evaluation-summary','portfolio-evaluation-summary',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
            // Stakeholders
        this.addSubMenuItem('topbar', 'evaluation', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
        this.addSubMenuItem('topbar', 'evaluation', 'Stakeholders', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
                // Project Stakeholders analysis
        this.addSubMenuItem('topbar', 'evaluation', 'Project stakeholders analysis', 'people-project-analysis','people-project-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
                // Portfolio Stakeholders analysis
        this.addSubMenuItem('topbar', 'evaluation', 'Portfolio stakeholders analysis', 'people-portfolio-analysis','people-portfolio-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
            // Review and Improvement
        this.addSubMenuItem('topbar', 'evaluation', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
        this.addSubMenuItem('topbar', 'evaluation', 'Review and Improvement', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Project Reviews
        this.addSubMenuItem('topbar', 'evaluation', 'Project reviews', 'project-reviews','project-reviews',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);
                // Portfolio Reviews
        this.addSubMenuItem('topbar', 'evaluation', 'Portfolio reviews', 'portfolio-reviews','portfolio-reviews',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
                // Maturity Assessments
        this.addSubMenuItem('topbar', 'evaluation', 'Maturity assessments', 'maturity-management','maturity-management',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
                // Reviews summary
        this.addSubMenuItem('topbar', 'evaluation', 'Reviews summary', 'review-summaries','review-summaries',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
                // Improvement activities
        this.addSubMenuItem('topbar', 'evaluation', 'Improvement activities', 'improvement-activities','improvement-activities',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
            // Dependencies
        this.addSubMenuItem('topbar', 'evaluation', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);
        this.addSubMenuItem('topbar', 'evaluation', 'Dependencies', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],17);
                // Project dependencies
        this.addSubMenuItem('topbar', 'evaluation', 'Project dependencies', 'project-dependency','project-dependency',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],18);
                // Dependency analysis
        this.addSubMenuItem('topbar', 'evaluation', 'Dependency analysis', 'dependency-analysis','dependency-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],19);



        // DELIVERY
		this.addMenuItem('topbar','Delivery','delivery','dropdown','delivery',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
            // Gate management
        this.addSubMenuItem('topbar', 'delivery', 'Gate management', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Gate process assignment
        this.addSubMenuItem('topbar', 'delivery', 'Gate process assignment', 'gate-process-assignment','gate-process-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
                // Gate reviews
        this.addSubMenuItem('topbar', 'delivery', 'Gate reviews', 'gate-reviews','gate-reviews',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
                // Delivery Performances
        this.addSubMenuItem('topbar', 'delivery', 'Delivery performances', 'gate-performances-portfolio','gate-performances-portfolio',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
            // Project Logs
        this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
        this.addSubMenuItem('topbar', 'delivery', 'Project Logs', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
                // Project change requests
        this.addSubMenuItem('topbar', 'delivery', 'Project changes', 'project-change-requests','project-change-requests',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
                // Project issues
        this.addSubMenuItem('topbar', 'delivery', 'Project issues', 'project-issues', 'project-issues',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
                // Project milestones
        this.addSubMenuItem('topbar', 'delivery', 'Project milestones', 'project-milestones','project-milestones',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
            // Portfolio Logs
        this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio Logs', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Portfolio change requests
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio changes', 'portfolio-change-requests','portfolio-change-requests',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);
                // Portfolio issues
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio issues', 'portfolio-issues','portfolio-issues',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
                // Portfolio milestones
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio milestones', 'portfolio-milestones','portfolio-milestones',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
                // Logs Summary
        // this.addSubMenuItem('topbar', 'delivery', 'Logs summary', 'log-summaries/portfolioLogs','log-summaries/portfolioLogs',false,
        //     ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
            // Status reports
        this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
        this.addSubMenuItem('topbar', 'delivery', 'Status', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);
                // Project status
        this.addSubMenuItem('topbar', 'delivery', 'Project status update', 'project-status-updates','project-status-updates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],17);
                // Portfolio status
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio status update', 'portfolio-status-updates','portfolio-status-updates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],18);
                // Portfolio status reports
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio status reports', 'portfolio-status-reports','portfolio-status-reports',false,
           ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],19);


	}
]);

'use strict';

//Setting up route
angular.module('dependency-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Dependency analysis state routing
		$stateProvider.
		state('project-dependency', {
			url: '/project-dependency',
			templateUrl: 'modules/dependency-analysis/views/project-dependency.client.view.html'
		}).
		state('dependency-analysis', {
			url: '/dependency-analysis',
			templateUrl: 'modules/dependency-analysis/views/dependency-analysis.client.view.html'
		});
	}
]);

'use strict';

angular.module('dependency-analysis').controller('DependencyAnalysisController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'Projects','Portfolios','Dependencies', 'DependencyTypes', 'DependencyImpacts', 'DependencyStates', 'LogStatusIndicators', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, Dependencies, DependencyTypes, DependencyImpacts, DependencyStates, LogStatusIndicators, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var portfolioDependenciesObject = {
            nodes : [],
            links : []
        };

        vm.portfoliosSelectedForView = {
            //    portfolioID : true/false
        };

        var dependencyTypes = [], dependencyImpacts = [], dependencyStates = [], logStatuses = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
                // Create the properties for the portfolio selection
                _.each(portfolios, function(portfolio){
                    vm.portfoliosSelectedForView[portfolio._id] = false;
                });
                vm.portfoliosSelectedForView.all = false;
                vm.portfoliosSelectedForView.unassigned = false;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Dependencies.getDependenciesAnalysis(function(res){
                portfolioDependenciesObject = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            DependencyTypes.query(function(res){
                dependencyTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            DependencyImpacts.query(function(res){
                dependencyImpacts = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            DependencyStates.query(function(res){
                dependencyStates = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(res){
                logStatuses = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };

        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


        // ------ PORTFOLIO SELECTION -----------


        vm.dependenciesForGraphObject = {
            nodes : [],
            links : []
        };

        vm.isPortfolioSelectionEmpty = function () {
            // If no portfolios are selected, then all values should be false and this should return true
            var flag = true;
            _.each(vm.portfoliosSelectedForView, function(v, k){
                if(v){
                    flag = false;
                }
            });
            return flag;
        };


        vm.selectPortfolio = function(portfolio){

            if(portfolio === 'unassigned'){
                if(vm.portfoliosSelectedForView.unassigned){
                    vm.portfoliosSelectedForView.unassigned = false;
                } else {
                    vm.portfoliosSelectedForView.unassigned = true;
                }

            } else if(portfolio === 'all'){
                if(vm.portfoliosSelectedForView.all){
                    vm.portfoliosSelectedForView.all = false;
                    _.forEach(vm.portfoliosSelectedForView, function(v, k){
                        vm.portfoliosSelectedForView[k] = false;
                    });
                } else {
                    vm.portfoliosSelectedForView.all = true;
                    _.each(vm.portfoliosSelectedForView, function(v, k){
                        vm.portfoliosSelectedForView[k] = true;
                    });
                }

            } else {

                if(vm.portfoliosSelectedForView[portfolio._id]){
                    vm.portfoliosSelectedForView[portfolio._id] = false;
                } else {
                    vm.portfoliosSelectedForView[portfolio._id] = true;
                }
            }

        };

        var createDependenciesForGraph = function(){

            var arrayOfPortfolioIds = _.keys(_.pick(vm.portfoliosSelectedForView, function(v, k){ return v; }));
            var newLinks = [];
            var newNodes = [];

            // LINKS: Pick all the dependencies where the sourcePortfolio or the targetPortfolio equals to the selected portfolio
            newLinks = _.filter(portfolioDependenciesObject.links, function(link){
                return _.some(arrayOfPortfolioIds, function(portfolioId){
                    if(portfolioId === 'unassigned' && ((link.sourcePortfolioId === null) || (link.targetPortfolioId === null))){
                        return true;
                    } else {
                        return (link.sourcePortfolioId === portfolioId) || (link.targetPortfolioId === portfolioId);
                    }
                });
            });

            // NODES: Remove from nodes the nodes that are not in any of the new dependencies
            newNodes = _.filter(portfolioDependenciesObject.nodes, function(node){
                return _.some(newLinks, function(link){
                    return (link.dependency.source._id === node._id) || (link.dependency.target._id === node._id);
                });
            });

            // Remap the indexOf the source/target in the links array based on the newNodes
            newLinks = _.map(newLinks, function(link){
                link.source = _.findIndex(newNodes, function(node){
                    return node._id === link.dependency.source._id;
                });
                link.target = _.findIndex(newNodes, function(node){
                    return node._id === link.dependency.target._id;
                });
                return link;
            });

            // Attach the new values to the view
            vm.dependenciesForGraphObject.links = newLinks;
            vm.dependenciesForGraphObject.nodes = newNodes;
        };

        $scope.$watch(
            function($scope){ return vm.portfoliosSelectedForView; },
            function ( newValue, oldValue ) {
                if(newValue !== oldValue){
                    createDependenciesForGraph();
                }
            }, true
        );

        vm.getPortfolioSelectionStatus = function(portfolio){
            if(portfolio === 'all'){
                return vm.portfoliosSelectedForView.all;
            }
            if(portfolio === 'unassigned'){
                return vm.portfoliosSelectedForView.unassigned;
            }
            return vm.portfoliosSelectedForView[portfolio._id];
        };

        // ------ PROJECT SELECTION -----------

        var getOneProjectDependencies = function(project){
            var retArray = [];
            if(project){
                retArray = _.chain(vm.dependenciesForGraphObject.links)
                    .filter(function(link){
                        return (link.dependency.source._id === project._id) || (link.dependency.target._id === project._id);
                    })
                    .map(function(link){
                        return link.dependency;
                    })
                    .value();

                return retArray;
            }
        };

        var getSourceTargetDependencies = function(source, target){
            var retArray = [];
            if(source && target){
                retArray = _.chain(vm.dependenciesForGraphObject.links)
                    .filter(function(link){
                        return ((link.dependency.source._id === source._id) && (link.dependency.target._id === target._id)) || ((link.dependency.source._id === target._id) && (link.dependency.target._id === source._id));
                    })
                    .map(function(link){
                        return link.dependency;
                    })
                    .value();

                return retArray;
            }
        };

        var modalDependencyProfile = function (size, dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, dependencies, source, target) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/dependency-analysis/views/dependency-details.client.view.html',
                controller: function ($scope, $modalInstance, dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, dependencies, source, target) {

                    $scope.dependencyTypes = dependencyTypes;
                    $scope.dependencyImpacts = dependencyImpacts;
                    $scope.dependencyStates = dependencyStates;
                    $scope.logStatuses = logStatuses;

                    $scope.dependencies = dependencies;
                    $scope.source = source;
                    $scope.target = target;

                    $scope.completionFilterArray = [
                        {name:'Completed', flag:true},
                        {name:'Not completed', flag:false}
                    ];

                    $scope.projectDependencyDetails = 'header';

                    $scope.selectDependency = function(dependency){
                        $scope.selectedDependency = dependency;
                    };

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    dependencyTypes: function () {
                        return dependencyTypes;
                    },
                    dependencyImpacts: function () {
                        return dependencyImpacts;
                    },
                    dependencyStates: function () {
                        return dependencyStates;
                    },
                    logStatuses: function () {
                        return logStatuses;
                    },
                    dependencies: function () {
                        return dependencies;
                    },
                    source: function () {
                        return source;
                    },
                    target: function () {
                        return target;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectNode = function(node){
            modalDependencyProfile('lg', dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, getOneProjectDependencies(node), node, null);
        };

        vm.selectLink = function(link){
            modalDependencyProfile('lg', dependencyTypes, dependencyImpacts, dependencyStates, logStatuses, getSourceTargetDependencies(link.dependency.source, link.dependency.target), link.dependency.source, link.dependency.target);
        };

    }
]);

'use strict';

angular.module('dependency-analysis').controller('ProjectDependencyController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'Projects','Portfolios', 'DependencyTypes', 'DependencyStates', 'DependencyImpacts', 'Dependencies', 'LogStatusIndicators', '_','$q',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, DependencyTypes, DependencyStates, DependencyImpacts,
             Dependencies, LogStatusIndicators, _ , $q) {

        $rootScope.staticMenu = false;

        // ----------- INIT ---------------

        $scope.error = null;
        $scope.isResolving = false;
        
        $scope.initError = [];

        $scope.init = function(){

            $scope.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
                $scope.projects = projects;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            DependencyTypes.query(function(dependencyTypes){
                $scope.dependencyTypes = dependencyTypes;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            DependencyStates.query(function(res){
                $scope.dependencyStates = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            DependencyImpacts.query(function(dependencyImpacts){
                $scope.dependencyImpacts = dependencyImpacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            Dependencies.query(function(dependencies){
                $scope.dependencies = dependencies;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(res){
                $scope.logStatuses = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

        };


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, dependency){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager,
                userIsSourceProjectManager, userIsSourcePortfolioManager,
                userIsTargetProjectManager, userIsTargetPortfolioManager;

            if(action === 'edit' && user && dependency){
                var source = dependency.source;
                var target = dependency.target;

                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsSourceProjectManager = (user._id === source.identification.projectManager) || (user._id === source.identification.backupProjectManager);
                if(source.portfolio){
                    userIsSourcePortfolioManager = (user._id === source.portfolio.portfolioManager) || (user._id === source.portfolio.backupPortfolioManager);
                }
                userIsTargetProjectManager = (user._id === target.identification.projectManager) || (user._id === target.identification.backupProjectManager);
                if(target.portfolio){
                    userIsTargetPortfolioManager = (user._id === target.portfolio.portfolioManager) || (user._id === target.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero ||
                    userIsSourceProjectManager || userIsSourcePortfolioManager ||
                    userIsTargetProjectManager || userIsTargetPortfolioManager;
            }

            if(action === 'new' && user){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = !!_.some(user.roles, function(role){
                    return role === 'portfolioManager';
                });
                userIsProjectManager = !!_.some(user.roles, function(role){
                    return role === 'projectManager';
                });
                return userIsSuperhero || userIsPortfolioManager || userIsProjectManager;
            }
        };


        // ------- DATE PICKER ------

        $scope.openRequiredByDatePickerNew = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.requiredByDatePickerOpenedNew = true;
        };

        $scope.openRequiredByDatePickerEdit = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.requiredByDatePickerOpenedEdit = true;
        };



        // ------------------- NG-SWITCH ---------------------

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, dependency){
            if(string === 'view'){ $scope.switchHeaderForm[dependency._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[dependency._id] = 'edit';}
        };

        $scope.switchStatusForm = {};
        $scope.selectStatusForm = function(string, dependency){
            if(string === 'view'){ $scope.switchStatusForm[dependency._id] = 'view';}
            if(string === 'edit'){$scope.switchStatusForm[dependency._id] = 'edit';}
        };

        var allowNull = function(obj){
            if(obj){return obj._id;} else {return null;}
        };

        // ------------------- OTHER VARIABLES ---------------------

        $scope.completionFilterArray = [
            {name:'Completed', flag:true},
            {name:'Not completed', flag:false}
        ];

        $scope.projectDependencyDetails = 'header';

        // ------------- CREATE NEW DEPENDENCY -----------

        var cancelEditHeaderData, cancelEditStatusData;

        $scope.newDependency = {};

        $scope.showNewDependency = function(dependency){

            // If selectedDependency, cancel any existing changes and set editDependency to view (behind the new form)
            if(dependency){
                $scope.cancelEditStatus(dependency);
                $scope.cancelEditHeader(dependency);
            }

            $scope.showNewDependencyForm = true;
        };

        $scope.createDependency = function(){
            
            var newDependency = new Dependencies({
                name: $scope.newDependency.name,
                description: $scope.newDependency.description,
                type: $scope.newDependency.type,
                state: $scope.newDependency.state,
                impact: $scope.newDependency.impact,
                source: $scope.newDependency.source,
                target: $scope.newDependency.target
            });

            $scope.error = null;
            $scope.isResolving = true;
            
            newDependency.$save(function(res) {
                $scope.isResolving = false;
                // Add new dependency to view after saving to server
                $scope.dependencies.push(res);
                // Clear form fields
                $scope.newDependency = {};
                // Close the new dependency form
                $scope.showNewDependencyForm = false;
                // Open the new dependency in the view panel
                $scope.selectDependency(res);
            }, function(err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewDependency = function(){
            $scope.error = null;
            $scope.newDependency = {};
            // Close the new dependency form
            $scope.showNewDependencyForm = false;
        };


        // ------------- SELECT VIEW DEPENDENCY ------------

        var originalDependency = {};

        $scope.selectDependency = function(dependency){
            $scope.selectedDependency = dependency;
            originalDependency[dependency._id] = _.cloneDeep(dependency);
        };

        // -------------------------------------------------------- HEADER -------------------------------------------------


        $scope.editHeader = function(dependency){
            $scope.selectHeaderForm('edit', dependency);
        };

        $scope.saveEditHeader = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            $scope.error = null;
            $scope.isResolving = true;

            Dependencies.updateHeader(
                {
                    dependencyId : dependency._id
                }, copyDependency,
                function(res){
                    $scope.isResolving = false;
                    // Update details pane view with new saved details
                    originalDependency[dependency._id].name = dependency.name;
                    originalDependency[dependency._id].description = dependency.description;
                    originalDependency[dependency._id].source = dependency.source;
                    originalDependency[dependency._id].target = dependency.target;
                    originalDependency[dependency._id].state = dependency.state;
                    originalDependency[dependency._id].type = dependency.type;
                    originalDependency[dependency._id].impact = dependency.impact;

                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', dependency);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };
        
        cancelEditHeaderData = function(dependency){
            dependency.name = originalDependency[dependency._id].name;
            dependency.description = originalDependency[dependency._id].description;
            dependency.source = originalDependency[dependency._id].source;
            dependency.target = originalDependency[dependency._id].target;
            dependency.state = originalDependency[dependency._id].state;
            dependency.type = originalDependency[dependency._id].type;
            dependency.impact = originalDependency[dependency._id].impact;
        };

        $scope.cancelEditHeader = function(dependency){
            $scope.error = null;
            cancelEditHeaderData(dependency);
            $scope.selectHeaderForm('view', dependency);
        };


        $scope.deleteDependency = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            $scope.error = null;
            $scope.isResolving = true;
            
            Dependencies.remove({dependencyId: dependency._id}, copyDependency, function(res){
                $scope.isResolving = false;
                $scope.dependencies = _.without($scope.dependencies, dependency);
                $scope.cancelNewDependency();
                $scope.selectedDependency = null;
                originalDependency = {};
            }, function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };


        // -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.baselineDeliveryDateOpened = {};
        $scope.openBaselineDeliveryDate = function(dependency, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDeliveryDateOpened[dependency._id] = true;
        };

        $scope.estimateDeliveryDateOpened = {};
        $scope.openEstimateDeliveryDate = function(dependency, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDeliveryDateOpened[dependency._id] = true;
        };

        $scope.actualDeliveryDateOpened = {};
        $scope.openActualDeliveryDate = function(dependency, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDeliveryDateOpened[dependency._id] = true;
        };

        $scope.editStatus = function(dependency){
            $scope.selectStatusForm('edit', dependency);
        };

        $scope.saveEditStatus = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            $scope.error = null;
            $scope.isResolving = true;

            Dependencies.updateStatus( { dependencyId : dependency._id }, copyDependency,
                function(res){
                    $scope.isResolving = false;
                    // Change the selected CR
                    originalDependency[dependency._id].statusReview.currentRecord.baselineDeliveryDate = dependency.statusReview.currentRecord.baselineDeliveryDate;
                    originalDependency[dependency._id].statusReview.currentRecord.estimateDeliveryDate = dependency.statusReview.currentRecord.estimateDeliveryDate;
                    originalDependency[dependency._id].statusReview.currentRecord.actualDeliveryDate = dependency.statusReview.currentRecord.actualDeliveryDate;
                    originalDependency[dependency._id].statusReview.currentRecord.status = dependency.statusReview.currentRecord.status;
                    originalDependency[dependency._id].statusReview.currentRecord.completed = dependency.statusReview.currentRecord.completed;
                    originalDependency[dependency._id].statusReview.currentRecord.statusComment = dependency.statusReview.currentRecord.statusComment;
                    $scope.selectStatusForm('view', dependency);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };
        
        cancelEditStatusData = function(dependency){
            dependency.statusReview.currentRecord.baselineDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.baselineDeliveryDate;
            dependency.statusReview.currentRecord.estimateDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.estimateDeliveryDate;
            dependency.statusReview.currentRecord.actualDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.actualDeliveryDate;
            dependency.statusReview.currentRecord.status = originalDependency[dependency._id].statusReview.currentRecord.status;
            dependency.statusReview.currentRecord.completed = originalDependency[dependency._id].statusReview.currentRecord.completed;
            dependency.statusReview.currentRecord.statusComment = originalDependency[dependency._id].statusReview.currentRecord.statusComment;
        };

        $scope.cancelEditStatus = function(dependency){
            $scope.error = null;
            cancelEditStatusData(dependency);
            $scope.selectStatusForm('view', dependency);
        };


    }
]);

'use strict';

//Dependencies service used to communicate Dependencies REST endpoints
angular.module('dependency-analysis').factory('Dependencies', ['$resource',
	function($resource) {
		return $resource('dependencies/:dependencyId', { dependencyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'dependencies/:dependencyId/header'
				// req.body: {whole milestone object}
			},

			// --- Status --

			updateStatus: {
				method: 'PUT',
				url: 'dependencies/:dependencyId/status'
				// req.body: {whole milestone object}
			},
            
            // --- Analysis --

            getDependenciesAnalysis: {
                method: 'GET',
                isArray: false,
                url: 'dependencies-analysis'
            }
            
		});
	}
]);

'use strict';

//Setting up route
angular.module('dependency-setup').config(['$stateProvider',
	function($stateProvider) {
		// Dependency setup state routing
		$stateProvider.
		state('dependency-setup', {
			url: '/dependency-setup',
			templateUrl: 'modules/dependency-setup/views/dependency-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('dependency-setup').controller('DependencySetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'DependencyImpacts', 'DependencyTypes', 'DependencyStates', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, DependencyImpacts, DependencyTypes, DependencyStates, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){
            DependencyImpacts.query(function(impacts){
                $scope.dependencyImpacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            DependencyTypes.query(function(types){
                $scope.dependencyTypes = types;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
			DependencyStates.query(function(res){
				$scope.dependencyStates = res;
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


// ---------------------------------------------------- DEPENDENCY IMPACTS --------------------------------------

		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
			//accept: function (sourceItemHandleScope, destSortableScope) {
			//    //override to determine drag is allowed or not. default is true.
			//    return true;
			//},
			//itemMoved: function (event) {
			//
			//},
			orderChanged: function(event) {
				for(var i = 0; i < $scope.dependencyImpacts.length; i++){
					$scope.updateImpact($scope.dependencyImpacts[i]);
				}
			}
			//containment: '#board',//optional param.
			//clone: true //optional param for clone feature.
		};

		/*
		 event object - structure
		 source:
		 index: original index before move.
		 itemScope: original item scope before move.
		 sortableScope: original sortable list scope.
		 dest:
		 index: index after move.
		 sortableScope: destination sortable scope.
		 -------------
		 sourceItemScope - the scope of the item being dragged.
		 destScope - the sortable destination scope, the list.
		 destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
		 */


		// ------------------- NG-SWITCH ---------------------

		$scope.selectImpactForm = function(string){
			if(string === 'view'){ $scope.switchImpactForm = 'view';}
			if(string === 'edit'){$scope.switchImpactForm = 'edit';}
		};

		// ------------------- LIST OF IMPACTS -----------------

		$scope.findImpacts = function() {
            $scope.initError = [];
			DependencyImpacts.query(function(impacts){
				$scope.dependencyImpacts = impacts;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalImpact;
		$scope.selectImpact = function(impact){
			$scope.error = null;
			$scope.selectImpactForm('view');
			$scope.dependencyImpact = impact;
			originalImpact = _.clone(impact);
		};

		$scope.updateImpact = function(impact) {
			$scope.error = null;
			impact.position = _.indexOf($scope.dependencyImpacts, impact) + 1;
			impact.$update(function(response) {
				$scope.selectImpactForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditImpact = function(impact){
			impact.name = originalImpact.name;
			impact.numericalValue = originalImpact.numericalValue;
			impact.description = originalImpact.description;
			$scope.selectImpactForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeImpact = function(impact) {
			$scope.error = null;
			impact.$remove(function(response) {
				$scope.dependencyImpacts = _.without($scope.dependencyImpacts, impact);
				for(var i = 0; i < $scope.dependencyImpacts.length; i++){
					if($scope.dependencyImpacts[i].position > impact.position){
						$scope.updateImpact($scope.dependencyImpacts[i]);
					}
				}
				$scope.dependencyImpact = null;
				$scope.selectImpactForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createImpact = function() {
			$scope.error = null;
			var dependencyImpact = new DependencyImpacts ({
				name: 'New impact level',
				numericalValue: 0,
				position: $scope.dependencyImpacts.length + 1
			});
			dependencyImpact.$save(function(response) {
				$scope.findImpacts();
				$scope.selectImpactForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};




// ----------------------------------------------- TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchTypeForm = {};

		$scope.selectTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findTypes = function() {
            $scope.initError = [];
			DependencyTypes.query(function(types){
				$scope.dependencyTypes = types;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalType = {};
		$scope.selectType = function(type){
			$scope.error = null;
			originalType[type._id] = _.clone(type);
			$scope.selectTypeForm(type, 'edit');
		};

		$scope.updateType = function(type) {
			$scope.error = null;
			type.$update(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditType = function(type){
			type.name = originalType[type._id].name;
			type.description = originalType[type._id].description;
			$scope.selectTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeType = function(type) {
			$scope.error = null;
			type.$remove(function(response) {
				$scope.findTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createType = function() {
			$scope.error = null;
			var type = new DependencyTypes ({
				name: 'New dependency type'
			});
			type.$save(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ----------------------------------------------- STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchStateForm = {};

        $scope.selectStateForm = function(state, string){
            if(string === 'view'){ $scope.switchStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST OF TYPES -----------------

        $scope.findStates = function() {
            $scope.initError = [];
            DependencyStates.query(function(states){
                $scope.dependencyStates = states;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalState = {};
        $scope.selectState = function(state){
            $scope.error = null;
            originalState[state._id] = _.clone(state);
            $scope.selectStateForm(state, 'edit');
        };

        $scope.updateState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findStates();
                $scope.selectStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditState = function(state){
            state.name = originalState[state._id].name;
            state.description = originalState[state._id].description;
            $scope.selectStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createState = function() {
            $scope.error = null;
            var state = new DependencyStates ({
                name: 'New dependency state'
            });
            state.$save(function(response) {
                $scope.findStates();
                $scope.selectStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };





    }
]);

'use strict';

//Dependency impacts service used to communicate Dependency impacts REST endpoints
angular.module('dependency-setup').factory('DependencyImpacts', ['$resource',
	function($resource) {
		return $resource('dependency-impacts/:dependencyImpactId', { dependencyImpactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Dependency states service used to communicate Dependency states REST endpoints
angular.module('dependency-setup').factory('DependencyStates', ['$resource',
	function($resource) {
		return $resource('dependency-states/:dependencyStateId', { dependencyStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Dependency types service used to communicate Dependency types REST endpoints
angular.module('dependency-setup').factory('DependencyTypes', ['$resource',
	function($resource) {
		return $resource('dependency-types/:dependencyTypeId', { dependencyTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('evaluation-summaries').config(['$stateProvider',
	function($stateProvider) {
		// Evaluation summaries state routing
		$stateProvider.
		state('portfolio-evaluation-summary', {
			url: '/portfolio-evaluation-summary',
			templateUrl: 'modules/evaluation-summaries/views/portfolio-summary.client.view.html'
		});
	}
]);

'use strict';

angular.module('evaluation-summaries').controller('EvaluationSummaryController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'EvaluationSummaries', 'QualitativeImpactScores','RiskSeverities','Risks','Projects','Portfolios', 'GateProcessTemplates', '_','$q','$modal',
	function($rootScope, $scope, $stateParams, $location, Authentication, EvaluationSummaries, QualitativeImpactScores, RiskSeverities, Risks, Projects, Portfolios, GateProcessTemplates, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

		// ----------- INIT ---------------

		vm.initError = [];

		var projectProfiles = [];

		vm.init = function(){

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				vm.projects = projects;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
				vm.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				vm.initError.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initError.push(err.data.message);
			});

            EvaluationSummaries.portfolioSummary(function(res){
                projectProfiles = res;
			}, function(err){
				vm.initError.push(err.data.message);
			});

            QualitativeImpactScores.query(function(res){
                vm.maxQualitativeScore = _.max(res, 'numericalValue');
                vm.minQualitativeScore = _.min(res, 'numericalValue');
            }, function(err){
                vm.initError.push(err.data.message);
            });

            RiskSeverities.query(function(resSev){
                Risks.query(function(resRisk){
                    if(resSev && resRisk){
                        vm.maxRiskScore = _.max(resSev, 'severityValue').severityValue * resRisk.length;
                        vm.minRiskScore = _.min(resSev, 'severityValue').severityValue * resRisk.length;
                    }
                }, function(err){
                    vm.initError.push(err.data.message);
                });
            }, function(err){
                vm.initError.push(err.data.message);
            });



		};



        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


        // ------ PORTFOLIO SELECTION -----------

        vm.selectPortfolio = function(portfolio){
            if(portfolio === 'all'){
                vm.treeSelectionFlag = 'all';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'All'};
                vm.qualitativeSummaryView = projectProfiles;
                return;
            }
            if(portfolio === 'unassigned'){
                vm.treeSelectionFlag = 'unassigned';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'Unassigned'};
                vm.qualitativeSummaryView = _.filter(projectProfiles, function(profile){
                    return _.isNull(profile.portfolio);
                });
                return;
            }
            vm.selectedProjectProfile = null;
            vm.treeSelectionFlag = 'portfolio';
            vm.selectedPortfolio = portfolio;
            vm.qualitativeSummaryView = _.filter(projectProfiles, function(profile){
                return (profile.portfolio) && (profile.portfolio._id === portfolio._id);
            });

        };

        // ------ FILTER RANKING -----------

        vm.orderByProperty = 'qualitativeScore';
        vm.orderByDirection = true; // From highest to lowest
        vm.orderByRanking = function(property, direction){
            vm.orderByProperty = property;
            vm.orderByDirection = direction;
        };

        // ------ PROJECT SELECTION -----------

        vm.projectProfileDetails = 'financial';

        var modalProjectProfile = function (size, profile) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/evaluation-summaries/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, profile) {

                    $scope.profile = profile;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    profile: function () {
                        return profile;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(profile){
            modalProjectProfile('lg', profile);
        };






	}
]);

'use strict';

//Evaluation summaries service used to communicate Evaluation summaries REST endpoints
angular.module('evaluation-summaries').factory('EvaluationSummaries', ['$resource',
	function($resource) {
		return $resource('evaluation-summaries', {
		}, {
			portfolioSummary: {
				method: 'GET',
				isArray: true,
				url: 'evaluation-summaries/portfolioSummary'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('financial-analysis-setup').config(['$stateProvider',
	function($stateProvider) {
		// Financial analysis setup state routing
		$stateProvider.
		state('financial-analysis-setup', {
			url: '/financial-analysis-setup',
			templateUrl: 'modules/financial-analysis-setup/views/financial-analysis-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('financial-analysis-setup').controller('FinancialAnalysisSetupController', ['$rootScope', '$scope', '$stateParams', '$location',
    'Authentication','FinancialBenefitGroups','FinancialBenefitTypes','FinancialCostGroups','FinancialCostTypes','$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, FinancialBenefitGroups, FinancialBenefitTypes, FinancialCostGroups,
             FinancialCostTypes, $q, _) {

        $rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){
            FinancialBenefitGroups.query(function(benefitGroups){
                $scope.benefitGroups = benefitGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialBenefitTypes.query(function(benefitTypes){
                $scope.benefitTypes = benefitTypes;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialCostGroups.query(function(costGroups){
                $scope.costGroups = costGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialCostTypes.query(function(costTypes){
                $scope.costTypes = costTypes;
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

        // ------------------- NG-SWITCH ---------------------

        $scope.switchCostGroupForm = {};

        $scope.selectCostGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchCostGroupForm[group._id] = 'view';}
            if(string === 'edit'){$scope.switchCostGroupForm[group._id] = 'edit';}
        };

        $scope.switchCostTypeForm = {};

        $scope.selectCostTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchCostTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchCostTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchCostTypeForm[type._id] = 'edit';}
        };

        $scope.switchBenefitGroupForm = {};

        $scope.selectBenefitGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchBenefitGroupForm[group._id] = 'view';}
            if(string === 'edit'){$scope.switchBenefitGroupForm[group._id] = 'edit';}
        };

        $scope.switchBenefitTypeForm = {};

        $scope.selectBenefitTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchBenefitTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchBenefitTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchBenefitTypeForm[type._id] = 'edit';}
        };

        $scope.costGroupDetails = 'header';
        $scope.benefitGroupDetails = 'header';


        // ----------------- REFRESH GROUPS LISTS ------------

        $scope.costGroupList = function(){
            FinancialCostGroups.query(function(costGroups){
                $scope.costGroups = costGroups;
            });
        };

        $scope.benefitGroupList = function(){
            FinancialBenefitGroups.query(function(benefitGroups){
                $scope.benefitGroups = benefitGroups;
            });
        };






// --------------------------------------------------------- COSTS ---------------------------------------------------






        // ------------------ CREATE COST GROUP ----------------

        $scope.createCostGroup = function() {
            $scope.error = null;

            var costGroup = new FinancialCostGroups ({
                name: 'New cost group',
                costTypes: []
            });

            costGroup.$save(function(response) {
                $scope.costGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------ CREATE COST TYPE ----------------

        $scope.createCostType = function(group) {
            var costType = new FinancialCostTypes ({
                name: 'New cost type',
                description: ''
            });
            costType.$save({groupId: group._id}, function(res) {
                // Add new category to the view group
                group.costTypes.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT COST GROUP (HEADER ONLY) -----------------

        var originalEditCostGroup = {};

        $scope.selectCostGroup = function(costGroup){
            originalEditCostGroup = _.clone(costGroup);
            $scope.selectedCostGroup = costGroup;
        };

        $scope.updateCostGroup = function(group) {
            FinancialCostGroups.update({
                _id: group._id,
                name: group.name,
                description: group.description
            }, function(group){
                $scope.selectCostGroupForm(group, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCostGroup = function(group){
            $scope.error = null;
            $scope.selectedCostGroup.name = originalEditCostGroup.name;
            $scope.selectedCostGroup.description = originalEditCostGroup.description;
            $scope.selectCostGroupForm(group, 'view');
        };

        // ------------------- EDIT COST TYPE (HEADER ONLY) -----------------

        var originalEditCostType = {};

        $scope.selectCostType = function(type){
            originalEditCostType[type._id] = _.clone(type);
            $scope.error = null;
            $scope.selectCostTypeForm(type, 'edit');
        };

        $scope.updateCostType = function(type) {
            FinancialCostTypes.update({
                _id: type._id,
                name: type.name,
                description: type.description
            }, function(res){
                $scope.selectCostTypeForm(res, 'view');
            },function(err){
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditCostType = function(type){
            $scope.error = null;
            type.name = originalEditCostType[type._id].name;
            type.description = originalEditCostType[type._id].description;
            $scope.selectCostTypeForm(type, 'view');
        };


        // ------------------- REMOVE COST GROUP -----------------

        $scope.removeCostGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.selectedCostGroup = null;
                $scope.costGroupList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------- REMOVE COST TYPE -----------------

        $scope.removeCostType = function(group, type) {
            $scope.error = null;

            FinancialCostTypes.remove({groupId: group._id}, type, function(res){
                group.costTypes = _.without(group.costTypes, type);
            }, function(err){
                $scope.error = err.data.message;
            });
        };






// --------------------------------------------------------- BENEFITS ---------------------------------------------------






        // ------------------ CREATE BENEFIT GROUP ----------------

        $scope.createBenefitGroup = function() {
            $scope.error = null;

            var benefitGroup = new FinancialBenefitGroups ({
                name: 'New benefit group',
                benefitTypes: []
            });

            benefitGroup.$save(function(response) {
                $scope.benefitGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------ CREATE BENEFIT TYPE ----------------

        $scope.createBenefitType = function(group) {
            var benefitType = new FinancialBenefitTypes ({
                name: 'New benefit type',
                description: ''
            });
            benefitType.$save({groupId: group._id}, function(res) {
                // Add new category to the view group
                group.benefitTypes.push(res);

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT BENEFIT GROUP (HEADER ONLY) -----------------

        var originalEditBenefitGroup = {};

        $scope.selectBenefitGroup = function(benefitGroup){
            originalEditBenefitGroup = _.clone(benefitGroup);
            $scope.selectedBenefitGroup = benefitGroup;
        };

        $scope.updateBenefitGroup = function(group) {
            FinancialBenefitGroups.update({
                _id: group._id,
                name: group.name,
                description: group.description
            }, function(group){
                $scope.selectBenefitGroupForm(group, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditBenefitGroup = function(group){
            $scope.error = null;
            $scope.selectedBenefitGroup.name = originalEditBenefitGroup.name;
            $scope.selectedBenefitGroup.description = originalEditBenefitGroup.description;
            $scope.selectBenefitGroupForm(group, 'view');
        };

        // ------------------- EDIT BENEFIT TYPE (HEADER ONLY) -----------------

        var originalEditBenefitType = {};

        $scope.selectBenefitType = function(type){
            originalEditBenefitType[type._id] = _.clone(type);
            $scope.error = null;
            $scope.selectBenefitTypeForm(type, 'edit');
        };

        $scope.updateBenefitType = function(type) {
            FinancialBenefitTypes.update({
                _id: type._id,
                name: type.name,
                description: type.description
            }, function(res){
                $scope.selectBenefitTypeForm(res, 'view');
            },function(err){
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditBenefitType = function(type){
            $scope.error = null;
            type.name = originalEditBenefitType[type._id].name;
            type.description = originalEditBenefitType[type._id].description;
            $scope.selectBenefitTypeForm(type, 'view');
        };


        // ------------------- REMOVE BENEFIT GROUP -----------------

        $scope.removeBenefitGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.selectedBenefitGroup = null;
                $scope.benefitGroupList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------- REMOVE BENEFIT TYPE -----------------

        $scope.removeBenefitType = function(group, type) {
            $scope.error = null;

            FinancialBenefitTypes.remove({groupId: group._id}, type, function(res){
                group.benefitTypes = _.without(group.benefitTypes, type);
            }, function(err){
                $scope.error = err.data.message;
            });
        };




    }
]);

'use strict';

//Financial benefit groups service used to communicate Financial benefit groups REST endpoints
angular.module('financial-analysis-setup').factory('FinancialBenefitGroups', ['$resource',
	function($resource) {
		return $resource('financial-benefit-groups/:financialBenefitGroupId', { financialBenefitGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Financial benefit types service used to communicate Financial benefit types REST endpoints
angular.module('financial-analysis-setup').factory('FinancialBenefitTypes', ['$resource',
	function($resource) {
		return $resource('financial-benefit-types/:financialBenefitTypeId', { financialBenefitTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Financial cost groups service used to communicate Financial cost groups REST endpoints
angular.module('financial-analysis-setup').factory('FinancialCostGroups', ['$resource',
	function($resource) {
		return $resource('financial-cost-groups/:financialCostGroupId', { financialCostGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Financial cost types service used to communicate Financial cost types REST endpoints
angular.module('financial-analysis-setup').factory('FinancialCostTypes', ['$resource',
	function($resource) {
		return $resource('financial-cost-types/:financialCostTypeId', { financialCostTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('financial-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Financial analysis state routing
		$stateProvider.
		state('financial-analysis', {
			url: '/financial-analysis',
			templateUrl: 'modules/financial-analysis/views/financial-analysis.client.view.html'
		});
	}
]);
'use strict';

angular.module('financial-analysis').controller('FinancialAnalysisController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication','FinancialBenefitGroups','FinancialBenefitTypes','FinancialCostGroups','FinancialCostTypes','FinancialAnalysis',
    'FinancialCosts', 'FinancialBenefits', 'Projects', 'Portfolios', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, FinancialBenefitGroups, FinancialBenefitTypes, FinancialCostGroups,
			 FinancialCostTypes, FinancialAnalysis, FinancialCosts, FinancialBenefits, Projects, Portfolios, $q, _) {


        $rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			FinancialBenefitGroups.query(function(benefitGroups){
				$scope.benefitGroups = benefitGroups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			FinancialBenefitTypes.query(function(benefitTypes){
				$scope.benefitTypes = benefitTypes;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			FinancialCostGroups.query(function(costGroups){
				$scope.costGroups = costGroups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			FinancialCostTypes.query(function(costTypes){
				$scope.costTypes = costTypes;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
            FinancialCosts.query(function(costs){
                $scope.costs = costs;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            FinancialBenefits.query(function(benefits){
                $scope.benefits = benefits;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };



        // ------------------- NG-SWITCH ---------------------

        $scope.switchProjectForm = {};

        $scope.selectProjectForm = function(string){
            if(string === 'default'){ $scope.switchProjectForm = 'default';}
            if(string === 'new'){$scope.switchProjectForm = 'new';}
            if(string === 'view'){ $scope.switchProjectForm = 'view';}
            if(string === 'edit'){$scope.switchProjectForm = 'edit';}
        };

        $scope.switchCostForm = {};

        $scope.selectCostForm = function(assignedCost, string){
            if(string === 'view'){$scope.switchCostForm[assignedCost._id] = 'view';}
            if(string === 'edit'){$scope.switchCostForm[assignedCost._id] = 'edit';}
        };

        $scope.switchBenefitForm = {};

        $scope.selectBenefitForm = function(assignedBenefit, string){
            if(string === 'view'){$scope.switchBenefitForm[assignedBenefit._id] = 'view';}
            if(string === 'edit'){$scope.switchBenefitForm[assignedBenefit._id] = 'edit';}
        };

        var allowNull = function(obj){
            if(obj){return obj._id;} else {return null;}
        };



        // ------------- SELECT VIEW PROJECT ------------


        $scope.selectFinancialOverview = function(project){
            $scope.error = null;
            if(project){
                FinancialAnalysis.financialProfile(
                    {
                        projectId : project._id
                    }, project,
                    function(res){
                        $scope.financialProfile = res;
                    },
                    function(err){
                        $scope.financialProfile = null;
                        $scope.error = err.data.message;
                    }
                );
            } else {
                $scope.financialProfile = null;
            }
        };

        var originalCostAssignment, originalBenefitAssignment, originalDiscountRate, originalBaseYear;

        $scope.selectProject = function(project){
            originalCostAssignment = {};
            originalBenefitAssignment = {};
            // Get the full project fat object from the "projectById" server function that populates everything
            Projects.get({
                projectId:project._id,
                retPropertiesString : 'user created selection identification portfolio discountRate baseYear costs benefits',
                deepPopulateArray : [
                    'portfolio',
                    'costs.group.costTypes','costs.type',
                    'benefits.group.benefitTypes','benefits.type'
                ]
            }, function(res){
                res.costs = _.sortBy(res.costs, 'year');
                $scope.selectedProject = res;
                $scope.selectFinancialOverview(res);
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };


        $scope.cancelViewProject = function(){
            $scope.selectedProject = null;
            originalCostAssignment = null;
            originalBenefitAssignment = null;
            originalDiscountRate = null;
            originalBaseYear = null;
        };




    // -------------------------------------------------------- COSTS -------------------------------------------------


        // ------------- NEW COST ASSIGNMENT ---------

        $scope.newCostAssignment = {};
        $scope.newCostAssignment.group = {};
        $scope.newCostAssignment.type = {};
        $scope.newCostAssignment.name = '';
        $scope.newCostAssignment.year = null;
        $scope.newCostAssignment.amount = null;

        $scope.createNewCostAssignment = function(project){
            var newCostAssignment = new FinancialCosts({
                group : $scope.newCostAssignment.group._id,
                type : $scope.newCostAssignment.type._id,
                name : $scope.newCostAssignment.name,
                year : $scope.newCostAssignment.year,
                amount : $scope.newCostAssignment.amount
            });

            newCostAssignment.$save({projectId: project._id}, function(res) {
                // Populate group and type since res doesn't
                res.group = $scope.newCostAssignment.group;
                res.type = $scope.newCostAssignment.type;
                // Add new cost to the view
                project.costs.unshift(res);
                // Clear new cost form
                $scope.newCostAssignment = {};
                $scope.newCostAssignment.group = {};
                $scope.newCostAssignment.type = {};
                $scope.newCostAssignment.name = '';
                $scope.newCostAssignment.year = null;
                $scope.newCostAssignment.amount = null;
                // Close new cost form done directly in the view's html
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------- SELECT COST ASSIGNMENT ---------

        $scope.selectCostAssignment = function(assignedCost){
            originalCostAssignment[assignedCost._id] = _.clone(assignedCost);
        };



        // ------------- EDIT COST ASSIGNMENT ---------

        $scope.editAssignedCost = function(project, assignedCost){
            // Check cost type since ngOptions doesn't update it if group changed but user didn't specifically selected a new type
            if(!_.find(assignedCost.group.costTypes, assignedCost.type)){
                assignedCost.type = null;
            }
            var copyAssignedCost = _.clone(assignedCost);
            copyAssignedCost.group = allowNull(copyAssignedCost.group);
            copyAssignedCost.type = allowNull(copyAssignedCost.type);
            FinancialCosts.update(copyAssignedCost,
                function(res){ },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditAssignedCost = function(assignedCost){
            assignedCost.group = originalCostAssignment[assignedCost._id].group;
            assignedCost.type = originalCostAssignment[assignedCost._id].type;
            assignedCost.name = originalCostAssignment[assignedCost._id].name;
            assignedCost.year = originalCostAssignment[assignedCost._id].year;
            assignedCost.amount = originalCostAssignment[assignedCost._id].amount;
        };


        // ------------- DELETE COST ASSIGNMENT ---------

        $scope.deleteAssignedCost = function(project, assignedCost){

            FinancialCosts.remove({projectId: project._id}, assignedCost, function(res){
                project.costs = _.without(project.costs, assignedCost);
            }, function(err){
                $scope.error = err.data.message;
            });

        };



        // -------------------------------------------------------- BENEFITS -------------------------------------------------


        // ------------- NEW BENEFIT ASSIGNMENT ---------

        $scope.newBenefitAssignment = {};
        $scope.newBenefitAssignment.group = {};
        $scope.newBenefitAssignment.type = {};
        $scope.newBenefitAssignment.name = '';
        $scope.newBenefitAssignment.year = null;
        $scope.newBenefitAssignment.amount = null;

        $scope.createNewBenefitAssignment = function(project){

            var newBenefitAssignment = new FinancialBenefits({
                group : $scope.newBenefitAssignment.group._id,
                type : $scope.newBenefitAssignment.type._id,
                name : $scope.newBenefitAssignment.name,
                year : $scope.newBenefitAssignment.year,
                amount : $scope.newBenefitAssignment.amount
            });

            newBenefitAssignment.$save({projectId: project._id}, function(res) {
                // Populate group and type since res doesn't
                res.group = $scope.newBenefitAssignment.group;
                res.type = $scope.newBenefitAssignment.type;
                // Add new category to the view group
                project.benefits.unshift(res);
                // Clear new cost form
                $scope.newBenefitAssignment = {};
                $scope.newBenefitAssignment.group = {};
                $scope.newBenefitAssignment.type = {};
                $scope.newBenefitAssignment.name = '';
                $scope.newBenefitAssignment.year = null;
                $scope.newBenefitAssignment.amount = null;
                // Close new cost form done directly in the view's html
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------- SELECT BENEFIT ASSIGNMENT ---------

        $scope.selectBenefitAssignment = function(assignedBenefit){
            originalBenefitAssignment[assignedBenefit._id] = _.clone(assignedBenefit);
        };



        // ------------- EDIT BENEFIT ASSIGNMENT ---------

        $scope.editAssignedBenefit = function(project, assignedBenefit){
            // Check benefit type since ngOptions doesn't update it if group changed but user didn't specifically selected a new type
            if(!_.find(assignedBenefit.group.benefitTypes, assignedBenefit.type)){
                assignedBenefit.type = null;
            }
            var copyAssignedBenefit = _.clone(assignedBenefit);
            copyAssignedBenefit.group = allowNull(copyAssignedBenefit.group);
            copyAssignedBenefit.type = allowNull(copyAssignedBenefit.type);
            FinancialBenefits.update(copyAssignedBenefit,
                function(res){ },
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditAssignedBenefit = function(assignedBenefit){
            assignedBenefit.group = originalBenefitAssignment[assignedBenefit._id].group;
            assignedBenefit.type = originalBenefitAssignment[assignedBenefit._id].type;
            assignedBenefit.name = originalBenefitAssignment[assignedBenefit._id].name;
            assignedBenefit.year = originalBenefitAssignment[assignedBenefit._id].year;
            assignedBenefit.amount = originalBenefitAssignment[assignedBenefit._id].amount;
        };


        // ------------- DELETE BENEFIT ASSIGNMENT ---------

        $scope.deleteAssignedBenefit = function(project, assignedBenefit){
            FinancialBenefits.remove({projectId: project._id}, assignedBenefit, function(res){
                project.benefits = _.without(project.benefits, assignedBenefit);
            }, function(err){
                $scope.error = err.data.message;
            });
        };





    // -------------------------------------------------------- DISCOUNTING DATA -------------------------------------------------


        $scope.selectDiscountRate = function(project){
            originalDiscountRate = _.clone(project.discountRate);
            originalBaseYear = _.clone(project.baseYear);
        };

        $scope.saveDiscountRate = function(project){
            Projects.update({projectId:project._id},{discountRate: project.discountRate, baseYear: project.baseYear},
                function(res){

                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditDiscountRate = function(project){
            project.discountRate = originalDiscountRate;
            project.baseYear = originalBaseYear;
        };




	}
]);

'use strict';

//Evaluation dashboards service used to communicate Evaluation dashboards REST endpoints
angular.module('financial-analysis').factory('FinancialAnalysis', ['$resource',
	function($resource) {
		return $resource('financial-analysis', {
		}, {
			financialProfile: {
				method: 'GET',
				isArray: false,
				url: 'financial-analysis/financialProfile/:projectId'
			}
		});
	}
]);

'use strict';

//Financial benefits service used to communicate Financial benefits REST endpoints
angular.module('financial-analysis').factory('FinancialBenefits', ['$resource',
	function($resource) {
		return $resource('financial-benefits/:financialBenefitId', { financialBenefitId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Financial costs service used to communicate Financial costs REST endpoints
angular.module('financial-analysis').factory('FinancialCosts', ['$resource',
	function($resource) {
		return $resource('financial-costs/:financialCostId', { financialCostId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('gate-performances').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Delivery dashboards', 'delivery-dashboards', 'dropdown', '/delivery-dashboards(/create)?');
		//Menus.addSubMenuItem('topbar', 'delivery-dashboards', 'List Delivery dashboards', 'delivery-dashboards');
		//Menus.addSubMenuItem('topbar', 'delivery-dashboards', 'New Delivery dashboard', 'delivery-dashboards/create');
	}
]);

'use strict';

//Setting up route
angular.module('gate-performances').config(['$stateProvider',
	function($stateProvider) {
		// Delivery dashboards state routing
		$stateProvider.
		state('gate-performances-portfolio', {
			url: '/gate-performances-portfolio',
			templateUrl: 'modules/gate-performances/views/gate-performances-portfolio.client.view.html'
		}).
		state('gate-performances-project', {
			url: '/gate-performances-project',
			templateUrl: 'modules/gate-performances/views/gate-performances.client.view.html'
		});
	}
]);

'use strict';

angular.module('gate-performances').controller('GatePerformancesPortfolioController', ['$scope', '$stateParams', '$location', 'Authentication',
    'GatePerformances','Projects','Portfolios', 'GateProcessTemplates', '_','$q','$modal',
    function($scope, $stateParams, $location, Authentication, GatePerformances, Projects, Portfolios, GateProcessTemplates, _, $q, $modal) {

        var vm = this;

        // ----------- INIT ---------------

        vm.isResolving = false;
        
        vm.initError = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });
            
        };


        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            vm.userHasAuthorization = _.some(obj.user.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });
        });

        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


        // ------ PORTFOLIO SELECTION -----------

        vm.selectPortfolio = function(portfolio){
            
            vm.selectedProjectProfile = null;
            vm.selectedPortfolio = portfolio || {name: 'Unassigned'};

            vm.error = null;
            vm.isResolving = true;
            GatePerformances.portfolioPerformances(
                {
                    _id: (portfolio && portfolio._id) || null
                },
                function(res){
                    vm.isResolving = false;
                    vm.portfolioPerformances = res;
                    console.log(res);
                },
                function(err){
                    vm.error = err;
                    vm.isResolving = false;
                }
            );
        };

        // ------ PROJECT SELECTION -----------

        vm.projectProfileDetails = 'financial';

        var modalProjectProfile = function (size, profile) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/gate-performances/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, profile) {

                    $scope.profile = profile;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                    
                    $scope.getProjectStatusAreaData = function(projectStatusArea, gate){
                        return _.find(gate.deliveryStatus.projectStatusAreas, function(gatePSA){
                            return gatePSA._id === projectStatusArea._id;
                        });
                    };
                },
                size: size,
                resolve: {
                    profile: function () {
                        return profile;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(profile){
            modalProjectProfile('lg', profile);
        };






    }
]);

'use strict';

//Delivery dashboards service used to communicate Delivery dashboards REST endpoints
angular.module('gate-performances').factory('GatePerformances', ['$resource',
	function($resource) {
		return $resource('gate-performances', {
		}, {
			portfolioPerformances: {
				method: 'GET',
				isArray: false,
				url: 'gate-performances/portfolioPerformances'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('gate-process-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Gate management assignment state routing
		$stateProvider.
		state('gate-process-assignment', {
			url: '/gate-process-assignment',
			templateUrl: 'modules/gate-process-assignment/views/gate-process-assignment.client.view.html'
		});
	}
]);

'use strict';

angular.module('gate-process-assignment').controller('GateProcessAssignmentController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects','Portfolios', 'GateProcessTemplates', 'StrategyNodes',
    'CategoryGroups', 'PriorityGroups', 'PriorityValues', '_','$q', '$modal', '$log',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcessTemplates, StrategyNodes,
             CategoryGroups, PriorityGroups, PriorityValues, _ , $q, $modal, $log) {

        $rootScope.staticMenu = false;

        var vm = this;

        vm.isResolving = false;

        // ----------- INIT ---------------

        vm.initError = [];

        vm.init = function(){

            vm.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function(projects){
                vm.projects = projects;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcessTemplates.query({'approval.currentRecord.approvalState': 'approved'},function(res){
                vm.gateProcesses = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            StrategyNodes.query(function(res){
                vm.strategyNodes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            CategoryGroups.query(function(res){
                vm.categoryGroups = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            PriorityGroups.query(function(res){
                vm.priorityGroups = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            PriorityValues.query(function(res){
                vm.priorityValues = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, userData, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (userData._id === project.projectManager) || (userData._id === project.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
        };

        vm.isProcessEditable = function(project){
            if(project){
                return (project.process.assignmentType === 'custom') && (project.process.assignmentConfirmed === false);
            }
        };

        vm.isProcessApprovable = function(project){
            if(project){
                return project.process.assignmentConfirmed === false;
            }
        };


        // ----------- FILTERS ------------

        vm.filterProcess = {};
        vm.filterCategorization = {};
        vm.filterPrioritization = {};

        // ------------- SELECT VIEW PROJECT ------------

        vm.showEditProjectForm = {};
        var originalProject = {};
        vm.selectProject = function(project){
            originalProject[project._id] = _.cloneDeep(project);
            vm.showEditProjectForm[project._id] = true;
        };

        // ------------- EDIT PROJECT ------------

        var allowNull = function(obj){
            if(obj){
                return obj._id;
            }
            return null;
        };
        
        vm.selectedBlueprintProcess = {};

        vm.confirmAssignment = function(project){
            // Save the project to the server
            Projects.confirmAssignment(
                {projectId: project._id},
                project,
                function(res) {
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    console.log(err);
                    vm.error = err.data.message;
                });
        };

        vm.standardAssignment = function(project, blueprintProcess){
            // Save the project to the server
            Projects.standardAssignment(
                {projectId: project._id},
                {processId: blueprintProcess._id, assignmentType: 'standard'},
                function(res) {
                    project.process = res.process;
                    project.process.assignmentType = res.process.assignmentType;
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    vm.error = err.data.message;
                });
        };

        vm.customAssignment = function(project, blueprintProcess){
            // Save the project to the server
            Projects.customAssignment(
                {projectId: project._id},
                {processId: (blueprintProcess && blueprintProcess._id) || null, assignmentType: 'custom'},
                function(res) {
                    // Update project data
                    project.process = res.process;
                    project.process.assignmentType = res.process.assignmentType;
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    // Switch view to read only
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    vm.error = err.data.message;
                });
        };

        vm.removeAssignment = function(project){
            // Save the project to the server
            Projects.removeAssignment(
                {projectId: project._id},
                {processId: (project.process && project.process._id) || null, assignmentType: 'unassigned'},
                function(res) {
                    // Update project data
                    project.process = res.process;
                    project.process.assignmentType = res.process.assignmentType;
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    // Switch view to read only
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    vm.error = err.data.message;
                });
        };

        vm.cancelEditProject = function(project){
            vm.error = null;
            project.process = originalProject[project._id].process;
            project.process.assignmentType = originalProject[project._id].process.assignmentType;
            project.process.assignmentConfirmed = originalProject[project._id].process.assignmentConfirmed;
            vm.showEditProjectForm[project._id] = false;
        };


        // ------------- PROJECT PROFILE -------------

        var modalUpdateIssue = function (size, user, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/gate-process-assignment/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, Projects, user, project) {

                    $scope.user = user;

                    $scope.selectedProject = project;

                    $scope.originalProject = _.cloneDeep(project);

                    var originalProcess, originalGateHeader,  originalGatePosition, originalOutcome;

                    $scope.cancelModal = function () {
                        if($scope.selectedGate && originalGateHeader){
                            $scope.cancelEditGateHeader($scope.selectedGate);
                        }
                        if($scope.selectedGate && originalGatePosition){
                            $scope.cancelEditGatePosition($scope.selectedGate);
                        }
                        if($scope.selectedOutcome && originalOutcome){
                            $scope.cancelEditOutcome($scope.selectedOutcome);
                        }
                        $scope.error = null;
                        $modalInstance.dismiss();
                    };

                    // --- Select process ---

                    $scope.processDetails = 'header';

                    // Edit process

                    $scope.editProcess = function(project){
                        originalProcess = _.cloneDeep(project.process);
                        $scope.switchProcessHeaderForm = 'edit';
                    };

                    $scope.saveEditProcess = function(project){

                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateProcess(
                            { projectId: project._id }, project.process,
                            function(res){
                                $scope.isResolving = false;
                                originalProcess = null;
                                $scope.switchProcessHeaderForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditProcess = function(project){
                        project.process.name = originalProcess.name;
                        project.process.description = originalProcess.description;
                        originalProcess = null;
                        $scope.switchProcessHeaderForm = 'view';
                    };
                    

                    // ------------------------- GATE -----------------

                    $scope.createGate = function(project) {
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.createGate(
                            {projectId: project._id}, {},
                            function(res){
                                $scope.isResolving = false;
                                project.process.gates = res.process.gates;
                                if($scope.selectedGate && originalGateHeader){
                                    $scope.cancelEditGateHeader($scope.selectedGate);
                                }
                                if($scope.selectedGate && originalGatePosition){
                                    $scope.cancelEditGatePosition($scope.selectedGate);
                                }
                                if($scope.selectedOutcome && originalOutcome){
                                    $scope.cancelEditOutcome($scope.selectedOutcome);
                                }
                                $scope.selectedGate = null;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    // --- SELECT GATE HEADER ---

                    $scope.gateDetails = 'header';
                    
                    $scope.selectGate = function(gate){
                        // If a gate was selected and also clicked for edit, cancel header changes and put original to null
                        if($scope.selectedGate && originalGateHeader){
                            $scope.cancelEditGateHeader($scope.selectedGate);
                        }
                        // If a gate was selected and also clicked for edit, cancel header changes and put original to null
                        if($scope.selectedGate && originalGatePosition){
                            $scope.cancelEditGatePosition($scope.selectedGate);
                        }
                        // If an outcome was selected and also clicked for edit, cancel changes, put original to null and flush selectedOutcome
                        if($scope.selectedOutcome && originalOutcome){
                            $scope.cancelEditOutcome($scope.selectedOutcome);
                        }
                        $scope.selectedOutcome = null;
                        $scope.selectedGate = gate;
                        $scope.switchHeaderForm = 'view';
                    };

                    // --- EDIT GATE HEADER ---

                    $scope.editGateHeader = function(gate){
                        originalGateHeader = _.cloneDeep(gate);
                        $scope.switchHeaderForm = 'edit';
                    };

                    $scope.saveEditGateHeader = function(project, gate){
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateGateHeader(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, gate,
                            function(res){
                                $scope.isResolving = false;
                                originalGateHeader = null;
                                $scope.switchHeaderForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditGateHeader = function(gate){
                        gate.name = originalGateHeader.name;
                        gate.description = originalGateHeader.description;
                        originalGateHeader = null;
                        $scope.switchHeaderForm = 'view';
                    };


                    // --- EDIT GATE POSITION ---

                    $scope.getAllowedGatePositions = function(project){
                        var process = project.process;
                        if(process){// Otherwise Angularjs error that it cant interpolate
                            // All positions between 2 and length-1. Requires the length to be at least 3.
                            var retArray = [];
                            if(process.gates.length < 3){
                                return retArray;
                            }
                            if(process.gates.length >= 3){
                                for(var i = 2; i< process.gates.length; i++){
                                    retArray.push(i);
                                }
                                return retArray;
                            }
                        }
                    };

                    $scope.editGatePosition = function(gate){
                        originalGatePosition = _.cloneDeep(gate);
                        $scope.switchPositionForm = 'edit';
                    };

                    $scope.saveEditGatePosition = function(project, gate){

                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateGatePosition(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, gate,
                            function(res){
                                $scope.isResolving = false;
                                // If a gate head was selected and also clicked for edit, cancel header changes and put original to null
                                if($scope.selectedGate && originalGateHeader){
                                    $scope.cancelEditGateHeader($scope.selectedGate);
                                }
                                originalGatePosition = null;
                                $scope.selectedGate = null;
                                project.process.gates = res.process.gates;
                                $scope.switchPositionForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditGatePosition = function(gate){
                        gate.position = originalGatePosition.position;
                        originalGatePosition = null;
                        $scope.switchPositionForm = 'view';
                    };

                    // --- DELETE GATE ---

                    $scope.deleteGate = function(project, gate){
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.deleteGate(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, gate,
                            function(res){
                                $scope.isResolving = false;
                                originalGateHeader = null;
                                originalGatePosition = null;
                                $scope.selectedGate = null;
                                project.process.gates = res.process.gates;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    // --- CREATE OUTCOME ---

                    $scope.createOutcome = function(project, gate) {
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.createOutcome(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, {},
                            function(res){
                                $scope.isResolving = false;
                                gate.outcomes.push(res);
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    // --- SELECT OUTCOME ---
                    
                    $scope.selectOutcome = function(outcome){
                        // If the outcome was selected and also clicked for edit, cancel changes and put original to null
                        if($scope.selectedOutcome && originalOutcome){
                            $scope.cancelEditOutcome($scope.selectedOutcome);
                        }
                        $scope.selectedOutcome = outcome;
                        $scope.switchOutcomeForm = 'view';
                    };

                    // --- EDIT OUTCOME ---

                    $scope.editOutcome = function(outcome){
                        originalOutcome = _.cloneDeep(outcome);
                        $scope.switchOutcomeForm = 'edit';
                    };

                    $scope.saveEditOutcome = function(project, gate, outcome){

                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateOutcome(
                            {
                                projectId: project._id,
                                projectGateId: gate._id,
                                projectOutcomeId: outcome._id
                            }, outcome,
                            function(res){
                                $scope.isResolving = false;
                                originalOutcome = null;
                                $scope.switchOutcomeForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditOutcome = function(outcome){
                        outcome.name = originalOutcome.name;
                        outcome.description = originalOutcome.description;
                        originalOutcome = null;
                        $scope.switchOutcomeForm = 'view';
                    };

                    // --- DELETE OUTCOME ---

                    $scope.deleteOutcome = function(project, gate, outcome){
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.deleteOutcome(
                            {
                                projectId: project._id,
                                projectGateId: gate._id,
                                projectOutcomeId: outcome._id
                            }, outcome,
                            function(res){
                                $scope.isResolving = false;
                                originalOutcome = null;
                                $scope.selectedOutcome = null;
                                gate.outcomes = res.outcomes;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };


                    // --- APPROVAL ---

                    $scope.submitProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.submitProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.approveProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.approveProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.rejectProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.rejectProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.draftProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.draftProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    },
                    user: function () {
                        return user;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(user, project){
            modalUpdateIssue('lg', user, project);
        };



    }
]);

'use strict';

//Setting up route
angular.module('gate-process-templates').config(['$stateProvider',
	function($stateProvider) {
		// Gate process templates state routing
		$stateProvider.
		state('gate-process-templates', {
			url: '/gate-process-templates',
			templateUrl: 'modules/gate-process-templates/views/gate-process-templates.client.view.html'
		});
	}
]);

'use strict';

angular.module('gate-process-templates').controller('GateProcessTemplatesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'GateProcessTemplates', '$q', '_',
    function($rootScope, $scope, $stateParams, $location, Authentication, GateProcessTemplates, $q, _) {

        $rootScope.staticMenu = false;

        // ------------- INIT -------------

        $scope.initError = [];

        $scope.init = function(){
            GateProcessTemplates.query(function(processes){
                $scope.gateProcesses = processes;
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

        // ------------------- NG-SWITCH ---------------------

        $scope.switchGateProcessForm = {};

        $scope.selectGateProcessForm = function(process, string){
            if(string === 'view'){ $scope.switchGateProcessForm[process._id] = 'view';}
            if(string === 'edit'){$scope.switchGateProcessForm[process._id] = 'edit';}
        };

        $scope.switchGateHeaderForm = {};

        $scope.selectGateHeaderForm = function(gate, string){
            if(string === 'view'){ $scope.switchGateHeaderForm[gate._id] = 'view';}
            if(string === 'edit'){$scope.switchGateHeaderForm[gate._id] = 'edit';}
        };

        $scope.switchGatePositionForm = {};

        $scope.selectGatePositionForm = function(gate, string){
            if(string === 'view'){ $scope.switchGatePositionForm[gate._id] = 'view';}
            if(string === 'edit'){$scope.switchGatePositionForm[gate._id] = 'edit';}
        };

        $scope.switchGateOutcomeForm = {};

        $scope.selectGateOutcomeForm = function(gateOutcome, string){
            if(string === 'view'){ $scope.switchGateOutcomeForm[gateOutcome._id] = 'view';}
            if(string === 'edit'){$scope.switchGateOutcomeForm[gateOutcome._id] = 'edit';}
        };

        // ---------------- PROCESS ------------------

        // Create process

        $scope.createProcess = function(){

            var newProcess = new GateProcessTemplates({
                name: 'New process'
            });

            $scope.isResolving = true;
            $scope.error = null;
            newProcess.$save(function(res) {
                $scope.isResolving = false;
                $scope.gateProcesses.push(res);
            }, function(err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        // Select process

        $scope.processDetails = 'header';

        var originalProcess;

        $scope.selectProcess = function(process){
            // If a process was selected and also clicked for edit, cancel header changes and put original to null
            if($scope.selectedProcess && originalProcess){
                $scope.cancelEditProcess($scope.selectedProcess);
            }
            // If a gate was selected and also clicked for edit, cancel header changes and put original to null
            if($scope.selectedGate && originalGateHeader){
                $scope.cancelEditGateHeader($scope.selectedGate);
            }
            // If a gate was selected and also clicked for edit, cancel header changes and put original to null
            if($scope.selectedGate && originalGatePosition){
                $scope.cancelEditGatePosition($scope.selectedGate);
            }
            // If an outcome was selected and also clicked for edit, cancel changes, put original to null and flush selectedOutcome
            if($scope.selectedOutcome && originalOutcome){
                $scope.cancelEditOutcome($scope.selectedOutcome);
            }
            $scope.selectedOutcome = null;
            $scope.selectedGate = null;
            $scope.selectedProcess = process;
            $scope.switchProcessHeaderForm = 'view';
        };

        // Edit process

        $scope.editProcess = function(process){
            originalProcess = _.cloneDeep(process);
            $scope.switchProcessHeaderForm = 'edit';
        };

        $scope.saveEditProcess = function(process){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.update(
                { gateProcessTemplateId: process._id }, process,
                function(res){
                    $scope.isResolving = false;
                    originalProcess = null;
                    $scope.switchProcessHeaderForm = 'view';
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditProcess = function(process){
            process.name = originalProcess.name;
            process.description = originalProcess.description;
            originalProcess = null;
            $scope.switchProcessHeaderForm = 'view';
        };

        // Delete process

        $scope.deleteProcess = function(process){
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.delete(
                { gateProcessTemplateId: process._id }, process,
                function(res){
                    $scope.isResolving = false;
                    // If a process was selected and also clicked for edit, cancel header changes and put original to null
                    if($scope.selectedProcess && originalProcess){
                        $scope.cancelEditProcess($scope.selectedProcess);
                    }
                    // If a gate was selected and also clicked for edit, cancel header changes and put original to null
                    if($scope.selectedGate && originalGateHeader){
                        $scope.cancelEditGateHeader($scope.selectedGate);
                    }
                    // If a gate was selected and also clicked for edit, cancel header changes and put original to null
                    if($scope.selectedGate && originalGatePosition){
                        $scope.cancelEditGatePosition($scope.selectedGate);
                    }
                    // If an outcome was selected and also clicked for edit, cancel changes, put original to null and flush selectedOutcome
                    if($scope.selectedOutcome && originalOutcome){
                        $scope.cancelEditOutcome($scope.selectedOutcome);
                    }
                    $scope.selectedOutcome = null;
                    $scope.selectedGate = null;
                    originalProcess = null;
                    $scope.selectedProcess = null;
                    $scope.gateProcesses = _.without($scope.gateProcesses, process);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // ------------------------- GATE -----------------

        $scope.createGate = function(process) {
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.createGate(
                {gateProcessTemplateId: process._id}, {},
                function(res){
                    $scope.isResolving = false;
                    process.gates = res.gates;
                    if($scope.selectedGate && originalGateHeader){
                        $scope.cancelEditGateHeader($scope.selectedGate);
                    }
                    if($scope.selectedGate && originalGatePosition){
                        $scope.cancelEditGatePosition($scope.selectedGate);
                    }
                    if($scope.selectedOutcome && originalOutcome){
                        $scope.cancelEditOutcome($scope.selectedOutcome);
                    }
                    $scope.selectedGate = null;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // --- SELECT GATE HEADER ---

        $scope.gateDetails = 'header';

        var originalGateHeader, originalGatePosition;

        $scope.selectGate = function(gate){
            // If a gate was selected and also clicked for edit, cancel header changes and put original to null
            if($scope.selectedGate && originalGateHeader){
                $scope.cancelEditGateHeader($scope.selectedGate);
            }
            // If a gate was selected and also clicked for edit, cancel header changes and put original to null
            if($scope.selectedGate && originalGatePosition){
                $scope.cancelEditGatePosition($scope.selectedGate);
            }
            // If an outcome was selected and also clicked for edit, cancel changes, put original to null and flush selectedOutcome
            if($scope.selectedOutcome && originalOutcome){
                $scope.cancelEditOutcome($scope.selectedOutcome);
            }
            $scope.selectedOutcome = null;
            $scope.selectedGate = gate;
            $scope.switchHeaderForm = 'view';
        };

        // --- EDIT GATE HEADER ---

        $scope.editGateHeader = function(gate){
            originalGateHeader = _.cloneDeep(gate);
            $scope.switchHeaderForm = 'edit';
        };

        $scope.saveEditGateHeader = function(process, gate){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.updateGateHeader(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
                }, gate,
                function(res){
                    $scope.isResolving = false;
                    originalGateHeader = null;
                    $scope.switchHeaderForm = 'view';
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditGateHeader = function(gate){
            gate.name = originalGateHeader.name;
            gate.description = originalGateHeader.description;
            originalGateHeader = null;
            $scope.switchHeaderForm = 'view';
        };


        // --- EDIT GATE POSITION ---

        $scope.getAllowedGatePositions = function(process){
            if(process){// Otherwise Angularjs error that it cant interpolate
                // All positions between 2 and length-1. Requires the length to be at least 3.
                var retArray = [];
                if(process.gates.length < 3){
                    return retArray;
                }
                if(process.gates.length >= 3){
                    for(var i = 2; i< process.gates.length; i++){
                        retArray.push(i);
                    }
                    return retArray;
                }
            }
        };

        $scope.editGatePosition = function(gate){
            originalGatePosition = _.cloneDeep(gate);
            $scope.switchPositionForm = 'edit';
        };

        $scope.saveEditGatePosition = function(process, gate){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.updateGatePosition(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
                }, gate,
                function(res){
                    $scope.isResolving = false;
                    // If a gate head was selected and also clicked for edit, cancel header changes and put original to null
                    if($scope.selectedGate && originalGateHeader){
                        $scope.cancelEditGateHeader($scope.selectedGate);
                    }
                    originalGatePosition = null;
                    $scope.selectedGate = null;
                    process.gates = res.gates;
                    $scope.switchPositionForm = 'view';
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditGatePosition = function(gate){
            gate.position = originalGatePosition.position;
            originalGatePosition = null;
            $scope.switchPositionForm = 'view';
        };

        // --- DELETE GATE ---

        $scope.deleteGate = function(process, gate){
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.deleteGate(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
                }, gate,
                function(res){
                    $scope.isResolving = false;
                    originalGateHeader = null;
                    originalGatePosition = null;
                    $scope.selectedGate = null;
                    process.gates = res.gates;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // --- CREATE OUTCOME ---

        $scope.createOutcome = function(process, gate) {
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.createOutcome(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
                }, {},
                function(res){
                    $scope.isResolving = false;
                    gate.outcomes.push(res);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // --- SELECT OUTCOME ---

        var originalOutcome;

        $scope.selectOutcome = function(outcome){
            // If the outcome was selected and also clicked for edit, cancel changes and put original to null
            if($scope.selectedOutcome && originalOutcome){
                $scope.cancelEditOutcome($scope.selectedOutcome);
            }
            $scope.selectedOutcome = outcome;
            $scope.switchOutcomeForm = 'view';
        };

        // --- EDIT OUTCOME ---

        $scope.editOutcome = function(outcome){
            originalOutcome = _.cloneDeep(outcome);
            $scope.switchOutcomeForm = 'edit';
        };

        $scope.saveEditOutcome = function(process, gate, outcome){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.updateOutcome(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id,
                    outcomeTemplateId: outcome._id
                }, outcome,
                function(res){
                    $scope.isResolving = false;
                    originalOutcome = null;
                    $scope.switchOutcomeForm = 'view';
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditOutcome = function(outcome){
            outcome.name = originalOutcome.name;
            outcome.description = originalOutcome.description;
            originalOutcome = null;
            $scope.switchOutcomeForm = 'view';
        };

        // --- DELETE OUTCOME ---

        $scope.deleteOutcome = function(process, gate, outcome){
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.deleteOutcome(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id,
                    outcomeTemplateId: outcome._id
                }, outcome,
                function(res){
                    $scope.isResolving = false;
                    originalOutcome = null;
                    $scope.selectedOutcome = null;
                    gate.outcomes = res.outcomes;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        $scope.submit = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.submit(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.approve(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.reject(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.draft(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


    }
]);

'use strict';

//Gate process templates service used to communicate Gate process templates REST endpoints
angular.module('gate-process-templates').factory('GateProcessTemplates', ['$resource',
	function($resource) {
		return $resource('gate-process-templates/:gateProcessTemplateId', { gateProcessTemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            
            // --- Gate ---
            
            createGate: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/createGate'
            },
            updateGateHeader: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/updateHeader'
            },
            updateGatePosition: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/updatePosition'
            },
            deleteGate: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/delete'
            },
            
            // --- Outcome ---
            
            createOutcome: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/createOutcome'
            },
            updateOutcome: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/outcome-templates/:outcomeTemplateId/update'
            },
            deleteOutcome: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/outcome-templates/:outcomeTemplateId/delete'
            },
            
            // --- Approval --

            submit: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/submit'
                // req.body: {whole gate review object}
            },
            approve: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/approve'
                // req.body: {whole gate review object}
            },
            reject: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/reject'
                // req.body: {whole gate review object}
            },
            draft: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/draft'
                // req.body: {whole gate review object}
            }
		});
	}
]);

'use strict';

//Setting up route
angular.module('gate-review-setup').config(['$stateProvider',
	function($stateProvider) {
		// Gate review setup state routing
		$stateProvider.
		state('gate-review-setup', {
			url: '/gate-review-setup',
			templateUrl: 'modules/gate-review-setup/views/gate-review-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('gate-review-setup').controller('GateReviewSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'GateOutcomeScores','GateStates','_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, GateOutcomeScores, GateStates, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

        $scope.initError = [];

		$scope.init = function(){
            GateOutcomeScores.query(function(scores){
                $scope.outcomeScores = scores;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            GateStates.query(function(states){
                $scope.gateStates = states;
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


// ----------------------------------------------- OUTCOME SCORES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchScoreForm = {};

		$scope.selectScoreForm = function(score, string){
			if(string === 'view'){ $scope.switchScoreForm[score._id] = 'view';}
			if(string === 'new'){$scope.switchScoreForm[score._id] = 'new';}
			if(string === 'edit'){$scope.switchScoreForm[score._id] = 'edit';}
		};

		// ------------------- LIST OF SCORES -----------------

		$scope.findScores = function() {
            $scope.initError = [];
			GateOutcomeScores.query(function(scores){
				$scope.outcomeScores = _.clone(scores);
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		$scope.selectScore = function(score){
			$scope.selectScoreForm(score, 'edit');
		};

		$scope.updateScore = function(score) {
			score.$update(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(score, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditScore = function(score){
			$scope.findScores();
			$scope.selectScoreForm(score, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeScore = function(score) {
			score.$remove(function(response) {
				$scope.findScores();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createScore = function() {
			var outcomeScore = new GateOutcomeScores ({
				name: 'New outcome score'
			});
			outcomeScore.$save(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



// ----------------------------------------------- GATE STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchStatusForm = {};

        $scope.selectStatusForm = function(status, string){
            if(string === 'view'){ $scope.switchStatusForm[status._id] = 'view';}
            if(string === 'new'){$scope.switchStatusForm[status._id] = 'new';}
            if(string === 'edit'){$scope.switchStatusForm[status._id] = 'edit';}
        };

        // ------------------- LIST OF STATUSES -----------------

        $scope.findStatuses = function() {
            $scope.initError = [];
            GateStates.query(function(states){
                $scope.gateStates = _.clone(states);
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        $scope.selectStatus = function(status){
            $scope.selectStatusForm(status, 'edit');
        };

        $scope.updateStatus = function(status) {
            status.$update(function(response) {
                $scope.findStatuses();
                $scope.selectStatusForm(status, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditStatus = function(status){
            $scope.findStatuses();
            $scope.selectStatusForm(status, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeStatus = function(status) {
            status.$remove(function(response) {
                $scope.findStatuses();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createStatus = function() {
            var gateStatus = new GateStates ({
                name: 'New gate state'
            });
            gateStatus.$save(function(response) {
                $scope.findStatuses();
                $scope.selectStatusForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

'use strict';

//Gate outcome scores service used to communicate Gate outcome scores REST endpoints
angular.module('gate-review-setup').factory('GateOutcomeScores', ['$resource',
	function($resource) {
		return $resource('gate-outcome-scores/:gateOutcomeScoreId', { gateOutcomeScoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Gate statuses service used to communicate Gate statuses REST endpoints
angular.module('gate-review-setup').factory('GateStates', ['$resource',
	function($resource) {
		return $resource('gate-states/:gateStateId', { gateStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('gate-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Gate management review state routing
		$stateProvider.
		state('gate-reviews', {
			url: '/gate-reviews',
			templateUrl: 'modules/gate-reviews/views/gate-reviews.client.view.html'
		});
	}
]);

'use strict';

angular.module('gate-reviews').controller('GateReviewsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
    'GateProcessTemplates', 'GateOutcomeScores', 'GateStates',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, GateOutcomeScores, GateStates) {

        $rootScope.staticMenu = false;

        // ------------- INIT -------------

        $scope.isResolving = false;

        $scope.initError = [];

        $scope.init = function(){

            $scope.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                $scope.projects = _.filter(projects, function(project){return project.process.assignmentType !== 'unassigned';});
                // Form myTao
                if($stateParams.projectId){
                    var foundProject = _.find($scope.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(foundProject){
                        $scope.selectProject(foundProject);
                    } else {
                        $scope.error = 'Cannot find project ' + $stateParams.projectId;
                    }
                }
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            GateProcessTemplates.query(function(gateProcesses){
                $scope.gateProcesses = gateProcesses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            GateOutcomeScores.query(function(outcomeScores){
                $scope.outcomeScores = outcomeScores;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            GateStates.query(function(res){
                $scope.gateStates = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

        };


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){

            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

            if((action === 'edit') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }

            if((action === 'approve') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                return userIsSuperhero;
            }
        };

        // ------------------- NG-SWITCH ---------------------

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, document){
            if(string === 'view'){ $scope.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[document._id] = 'edit';}
        };

        $scope.switchBudgetForm = {};
        $scope.selectBudgetForm = function(string, document){
            if(string === 'view'){ $scope.switchBudgetForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchBudgetForm[document._id] = 'edit';}
        };

        $scope.switchStateForm = {};
        $scope.selectStateForm = function(string, document){
            if(string === 'view'){ $scope.switchStateForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchStateForm[document._id] = 'edit';}
        };

        $scope.switchOutcomeReviewForm = {};
        $scope.selectOutcomeReviewForm = function(string, outcomeReview){
            if(string === 'view'){ $scope.switchOutcomeReviewForm[outcomeReview._id] = 'view';}
            if(string === 'edit'){$scope.switchOutcomeReviewForm[outcomeReview._id] = 'edit';}
        };

        // Baseline

        $scope.switchBaselineDurationForm = {};
        $scope.selectBaselineDurationForm = function(string, baselineDuration){
            if(string === 'view'){ $scope.switchBaselineDurationForm[baselineDuration._id] = 'view';}
            if(string === 'edit'){$scope.switchBaselineDurationForm[baselineDuration._id] = 'edit';}
        };

        $scope.switchBaselineCostForm = {};
        $scope.selectBaselineCostForm = function(string, baselineCost){
            if(string === 'view'){ $scope.switchBaselineCostForm[baselineCost._id] = 'view';}
            if(string === 'edit'){$scope.switchBaselineCostForm[baselineCost._id] = 'edit';}
        };

        $scope.switchBaselineCompletionForm = {};
        $scope.selectBaselineCompletionForm = function(string, baselineCompletion){
            if(string === 'view'){ $scope.switchBaselineCompletionForm[baselineCompletion._id] = 'view';}
            if(string === 'edit'){$scope.switchBaselineCompletionForm[baselineCompletion._id] = 'edit';}
        };

        // Estimate

        $scope.switchEstimateDurationForm = {};
        $scope.selectEstimateDurationForm = function(string, estimateDuration){
            if(string === 'view'){ $scope.switchEstimateDurationForm[estimateDuration._id] = 'view';}
            if(string === 'edit'){$scope.switchEstimateDurationForm[estimateDuration._id] = 'edit';}
        };

        $scope.switchEstimateCostForm = {};
        $scope.selectEstimateCostForm = function(string, estimateCost){
            if(string === 'view'){ $scope.switchEstimateCostForm[estimateCost._id] = 'view';}
            if(string === 'edit'){$scope.switchEstimateCostForm[estimateCost._id] = 'edit';}
        };

        $scope.switchEstimateCompletionForm = {};
        $scope.selectEstimateCompletionForm = function(string, estimateCompletion){
            if(string === 'view'){ $scope.switchEstimateCompletionForm[estimateCompletion._id] = 'view';}
            if(string === 'edit'){$scope.switchEstimateCompletionForm[estimateCompletion._id] = 'edit';}
        };

        // Actual

        $scope.switchActualDurationForm = {};
        $scope.selectActualDurationForm = function(string, actualDuration){
            if(string === 'view'){ $scope.switchActualDurationForm[actualDuration._id] = 'view';}
            if(string === 'edit'){$scope.switchActualDurationForm[actualDuration._id] = 'edit';}
        };

        $scope.switchActualCostForm = {};
        $scope.selectActualCostForm = function(string, actualCost){
            if(string === 'view'){ $scope.switchActualCostForm[actualCost._id] = 'view';}
            if(string === 'edit'){$scope.switchActualCostForm[actualCost._id] = 'edit';}
        };

        $scope.switchActualCompletionForm = {};
        $scope.selectActualCompletionForm = function(string, actualCompletion){
            if(string === 'view'){ $scope.switchActualCompletionForm[actualCompletion._id] = 'view';}
            if(string === 'edit'){$scope.switchActualCompletionForm[actualCompletion._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        $scope.sortGateReviews = function(gateReview) {
            return new Date(gateReview.reviewDate);
        };

        $scope.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        $scope.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        $scope.showNewDocumentForm = false;

        $scope.documentDetails = 'header';

        $scope.activeTab = {};



        // ------------- SELECT PROJECT ------------


        $scope.selectProject = function(project) {
            $scope.error = null;
            $scope.cancelNewDocument();
            $scope.selectedGate = null;
            $scope.selectedDocument = null;
            $scope.selectedProject = project;
        };


        // ------------ SELECT GATE ----------------


        $scope.selectGate = function(gate){
            // Delete previous selections
            $scope.error = null;
            $scope.cancelNewDocument();
            $scope.selectedDocument = null;
            // Set new selected gate
            $scope.selectedGate = gate;
        };

        // ----------- NEW GATE REVIEW ------------


        $scope.newHeaderDateOpened = {};

        $scope.openNewHeaderDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newHeaderDateOpened[gate._id] = true;
        };

        $scope.newDocument = {};

        $scope.createNewDocument = function(project, gate){
            $scope.error = null;

            var newDocument = {
                reviewDate : $scope.newDocument.reviewDate,
                title : $scope.newDocument.title
            };

            Projects.createGateReview(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    $scope.isResolving = false;
                    gate.gateReviews.push(res);
                    $scope.newDocument = {};
                    $scope.showNewDocumentForm = false;
                    $scope.selectDocument(res);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewDocument = function(){
            $scope.error = null;
            $scope.showNewDocumentForm = false;
            $scope.newDocument = {};
        };


        // ------------- SELECT GATE REVIEW ------------


        $scope.selectDocument = function(doc){
            $scope.selectedDocument = doc;
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.headerDateOpened = {};
        $scope.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        $scope.editHeader = function(gateReview){
            originalHeader[gateReview._id] = {
                reviewDate: gateReview.reviewDate,
                title : gateReview.title,
                overallComment : gateReview.overallComment
            };
            $scope.selectHeaderForm('edit', gateReview);
        };

        $scope.saveEditHeader = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateReviewHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    // Update details pane view with new saved details
                    originalHeader[gateReview._id].reviewDate = gateReview.reviewDate;
                    originalHeader[gateReview._id].title = gateReview.title;
                    originalHeader[gateReview._id].overallComment = gateReview.overallComment;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function(gateReview){
            $scope.error = null;
            gateReview.reviewDate = originalHeader[gateReview._id].reviewDate;
            gateReview.title = originalHeader[gateReview._id].title;
            gateReview.overallComment = originalHeader[gateReview._id].overallComment;
            $scope.selectHeaderForm('view', gateReview);
        };


        $scope.deleteDocument = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.deleteGateReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview, function(res){
                    $scope.isResolving = false;
                    gate.gateReviews = _.without(gate.gateReviews, gateReview);
                    $scope.cancelNewDocument();
                    $scope.selectedDocument = null;
            }, function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };
        
        // -------------------------------------------------------- STATE -------------------------------------------------

        var originalState = {};

        $scope.editState = function(gateReview){
            originalState[gateReview._id] = {
                newOverallScore : gateReview.gateStateReview.newOverallScore,
                newState : gateReview.gateStateReview.newState,
                newCompleted : gateReview.gateStateReview.newCompleted
            };
            $scope.selectStateForm('edit', gateReview);
        };

        $scope.saveEditState = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateStateReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    originalState[gateReview._id].newOverallScore = gateReview.gateStateReview.newOverallScore;
                    originalState[gateReview._id].newState = gateReview.gateStateReview.newState;
                    originalState[gateReview._id].newCompleted = gateReview.gateStateReview.newCompleted;
                    $scope.selectStateForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditState = function(gateReview){
            $scope.error = null;
            gateReview.gateStateReview.newOverallScore = originalState[gateReview._id].newOverallScore;
            gateReview.gateStateReview.newState = originalState[gateReview._id].newState;
            gateReview.gateStateReview.newCompleted = originalState[gateReview._id].newCompleted;
            $scope.selectStateForm('view', gateReview);
        };



        // -------------------------------------------------------- BUDGET -------------------------------------------------

        var originalGateBudget = {};

        $scope.editBudget = function(gateReview){
            originalGateBudget[gateReview._id] = {
                newAmount : gateReview.budgetReview.newAmount
            };
            $scope.selectBudgetForm('edit', gateReview);
        };

        $scope.saveEditBudget = function(project, gate, gateReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateBudgetReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    originalGateBudget[gateReview._id].newAmount = gateReview.budgetReview.newAmount;
                    $scope.selectBudgetForm('view', gateReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBudget = function(gateReview){
            $scope.error = null;
            gateReview.budgetReview.newAmount = originalGateBudget[gateReview._id].newAmount;
            $scope.selectBudgetForm('view', gateReview);
        };




        // -------------------------------------------------------- OUTCOMES -------------------------------------------------

        var originalOutcomeReview = {};

        $scope.editOutcomeReview = function(outcomeReview){
            originalOutcomeReview[outcomeReview._id] = _.cloneDeep(outcomeReview);
            $scope.selectOutcomeReviewForm('edit', outcomeReview);
        };

        $scope.saveEditOutcomeReview = function(project, gate, gateReview, outcomeReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateOutcomeScoreReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    outcomeScoreReviewId : outcomeReview._id
                }, outcomeReview,
                function(res){
                    $scope.isResolving = false;
                    $scope.error = null;
                    originalOutcomeReview[outcomeReview._id].newScore = outcomeReview.newScore;
                    originalOutcomeReview[outcomeReview._id].newComment = outcomeReview.newComment;
                    $scope.selectOutcomeReviewForm('view', outcomeReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditOutcomeReview = function(outcomeReview){
            $scope.error = null;
            outcomeReview.newScore = originalOutcomeReview[outcomeReview._id].newScore;
            outcomeReview.newComment = originalOutcomeReview[outcomeReview._id].newComment;
            $scope.selectOutcomeReviewForm('view', outcomeReview);
        };



        // -------------------------------------------------------- BASELINE DURATION -------------------------------------------------

        $scope.baselineDurationDateOpened = {};
        $scope.openBaselineDurationDate = function(baselineDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDurationDateOpened[baselineDurationReview._id] = true;
        };

        var originalBaselineDurationReview = {};

        $scope.editBaselineDuration = function(baselineDurationReview){
            originalBaselineDurationReview[baselineDurationReview._id] = _.cloneDeep(baselineDurationReview);
            $scope.selectBaselineDurationForm('edit', baselineDurationReview);
        };

        $scope.saveEditBaselineDuration = function(project, gate, gateReview, baselineDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateBaselineDurationReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    baselineDurationReviewId : baselineDurationReview._id
                }, baselineDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineDurationReview[baselineDurationReview._id].newDate = baselineDurationReview.newDate;
                    $scope.selectBaselineDurationForm('view', baselineDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBaselineDuration = function(baselineDurationReview){
            $scope.error = null;
            baselineDurationReview.newDate = originalBaselineDurationReview[baselineDurationReview._id].newDate;
            $scope.selectBaselineDurationForm('view', baselineDurationReview);
        };


        // -------------------------------------------------------- ESTIMATE DURATION -------------------------------------------------

        $scope.estimateDurationDateOpened = {};
        $scope.openEstimateDurationDate = function(estimateDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDurationDateOpened[estimateDurationReview._id] = true;
        };

        var originalEstimateDurationReview = {};

        $scope.editEstimateDuration = function(estimateDurationReview){
            $scope.error = null;
            originalEstimateDurationReview[estimateDurationReview._id] = _.cloneDeep(estimateDurationReview);
            $scope.selectEstimateDurationForm('edit', estimateDurationReview);
        };

        $scope.saveEditEstimateDuration = function(project, gate, gateReview, estimateDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateEstimateDurationReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    estimateDurationReviewId : estimateDurationReview._id
                }, estimateDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalEstimateDurationReview[estimateDurationReview._id].newDate = estimateDurationReview.newDate;
                    $scope.selectEstimateDurationForm('view', estimateDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditEstimateDuration = function(estimateDurationReview){
            $scope.error = null;
            estimateDurationReview.newDate = originalEstimateDurationReview[estimateDurationReview._id].newDate;
            $scope.selectEstimateDurationForm('view', estimateDurationReview);
        };


        // -------------------------------------------------------- ACTUAL DURATION -------------------------------------------------

        $scope.actualDurationDateOpened = {};
        $scope.openActualDurationDate = function(actualDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDurationDateOpened[actualDurationReview._id] = true;
        };

        var originalActualDurationReview = {};

        $scope.editActualDuration = function(actualDurationReview){
            $scope.error = null;
            originalActualDurationReview[actualDurationReview._id] = _.cloneDeep(actualDurationReview);
            $scope.selectActualDurationForm('edit', actualDurationReview);
        };

        $scope.saveEditActualDuration = function(project, gate, gateReview, actualDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateActualDurationReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    actualDurationReviewId : actualDurationReview._id
                }, actualDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualDurationReview[actualDurationReview._id].newDate = actualDurationReview.newDate;
                    $scope.selectActualDurationForm('view', actualDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditActualDuration = function(actualDurationReview){
            $scope.error = null;
            actualDurationReview.newDate = originalActualDurationReview[actualDurationReview._id].newDate;
            $scope.selectActualDurationForm('view', actualDurationReview);
        };


        // -------------------------------------------------------- BASELINE COST -------------------------------------------------

        var originalBaselineCostReview = {};

        $scope.editBaselineCost = function(baselineCostReview){
            originalBaselineCostReview[baselineCostReview._id] = _.cloneDeep(baselineCostReview);
            $scope.selectBaselineCostForm('edit', baselineCostReview);
        };

        $scope.saveEditBaselineCost = function(project, gate, gateReview, baselineCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCostReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    baselineCostReviewId : baselineCostReview._id
                }, baselineCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineCostReview[baselineCostReview._id].newCost = baselineCostReview.newCost;
                    $scope.selectBaselineCostForm('view', baselineCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBaselineCost = function(baselineCostReview){
            $scope.error = null;
            baselineCostReview.newCost = originalBaselineCostReview[baselineCostReview._id].newCost;
            $scope.selectBaselineCostForm('view', baselineCostReview);
        };


        // -------------------------------------------------------- ESTIMATE COST -------------------------------------------------

        var originalEstimateCostReview = {};

        $scope.editEstimateCost = function(estimateCostReview){
            originalEstimateCostReview[estimateCostReview._id] = _.cloneDeep(estimateCostReview);
            $scope.selectEstimateCostForm('edit', estimateCostReview);
        };

        $scope.saveEditEstimateCost = function(project, gate, gateReview, estimateCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateEstimateCostReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    estimateCostReviewId : estimateCostReview._id
                }, estimateCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalEstimateCostReview[estimateCostReview._id].newCost = estimateCostReview.newCost;
                    $scope.selectEstimateCostForm('view', estimateCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditEstimateCost = function(estimateCostReview){
            $scope.error = null;
            estimateCostReview.newCost = originalEstimateCostReview[estimateCostReview._id].newCost;
            $scope.selectEstimateCostForm('view', estimateCostReview);
        };


        // -------------------------------------------------------- ACTUAL COST -------------------------------------------------

        var originalActualCostReview = {};

        $scope.editActualCost = function(actualCostReview){
            originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
            $scope.selectActualCostForm('edit', actualCostReview);
        };

        $scope.saveEditActualCost = function(project, gate, gateReview, actualCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCostReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    actualCostReviewId : actualCostReview._id
                }, actualCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualCostReview[actualCostReview._id].newCost = actualCostReview.newCost;
                    $scope.selectActualCostForm('view', actualCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditActualCost = function(actualCostReview){
            $scope.error = true;
            actualCostReview.newCost = originalActualCostReview[actualCostReview._id].newCost;
            $scope.selectActualCostForm('view', actualCostReview);
        };



        // -------------------------------------------------------- BASELINE COMPLETION -------------------------------------------------

        var originalBaselineCompletionReview = {};

        $scope.editBaselineCompletion = function(baselineCompletionReview){
            originalBaselineCompletionReview[baselineCompletionReview._id] = _.cloneDeep(baselineCompletionReview);
            $scope.selectBaselineCompletionForm('edit', baselineCompletionReview);
        };

        $scope.saveEditBaselineCompletion = function(project, gate, gateReview, baselineCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCompletionReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    baselineCompletionReviewId : baselineCompletionReview._id
                }, baselineCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion = baselineCompletionReview.newCompletion;
                    $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditBaselineCompletion = function(baselineCompletionReview){
            $scope.error = null;
            baselineCompletionReview.newCompletion = originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion;
            $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
        };


        // -------------------------------------------------------- ESTIMATE COMPLETION -------------------------------------------------

        var originalEstimateCompletionReview = {};

        $scope.editEstimateCompletion = function(estimateCompletionReview){
            originalEstimateCompletionReview[estimateCompletionReview._id] = _.cloneDeep(estimateCompletionReview);
            $scope.selectEstimateCompletionForm('edit', estimateCompletionReview);
        };

        $scope.saveEditEstimateCompletion = function(project, gate, gateReview, estimateCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateEstimateCompletionReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    estimateCompletionReviewId : estimateCompletionReview._id
                }, estimateCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion = estimateCompletionReview.newCompletion;
                    $scope.selectEstimateCompletionForm('view', estimateCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditEstimateCompletion = function(estimateCompletionReview){
            $scope.error = null;
            estimateCompletionReview.newCompletion = originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion;
            $scope.selectEstimateCompletionForm('view', estimateCompletionReview);
        };


        // -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

        var originalActualCompletionReview = {};

        $scope.editActualCompletion = function(actualCompletionReview){
            originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
            $scope.selectActualCompletionForm('edit', actualCompletionReview);
        };

        $scope.saveEditActualCompletion = function(project, gate, gateReview, actualCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCompletionReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId: gateReview._id,
                    actualCompletionReviewId : actualCompletionReview._id
                }, actualCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualCompletionReview[actualCompletionReview._id].newCompletion = actualCompletionReview.newCompletion;
                    $scope.selectActualCompletionForm('view', actualCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditActualCompletion = function(actualCompletionReview){
            $scope.error = null;
            actualCompletionReview.newCompletion = originalActualCompletionReview[actualCompletionReview._id].newCompletion;
            $scope.selectActualCompletionForm('view', actualCompletionReview);
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        // Check that all fields are filled in before proceeding, if not, return (except for Reject and Draft)
        $scope.submitMissingFields = {};
        var setSubmitMissingFields = function(gateReview){
            
            var missingFields = [];

            if(!gateReview.budgetReview.newAmount){
                missingFields.push('Budget amount');
            }

            _.each(gateReview.performances.duration.baselineDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Baseline date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });
            _.each(gateReview.performances.duration.estimateDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Estimate date for ' + performanceReview.estimateDuration.targetGate.name);
                }
            });
            _.each(gateReview.performances.duration.actualDurationReviews, function(performanceReview){
                if(!performanceReview.newDate && gateReview.gateStateReview.newCompleted){
                    missingFields.push('Actual date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });

            _.each(gateReview.performances.cost.baselineCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Baseline cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });
            _.each(gateReview.performances.cost.estimateCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Estimate cost for ' + performanceReview.estimateCost.targetGate.name);
                }
            });
            _.each(gateReview.performances.cost.actualCostReviews, function(performanceReview){
                if(!performanceReview.newCost && gateReview.gateStateReview.newCompleted){
                    missingFields.push('Actual cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });

            _.each(gateReview.performances.completion.baselineCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Baseline completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });
            _.each(gateReview.performances.completion.estimateCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Estimate completion for ' + performanceReview.estimateCompletion.targetGate.name);
                }
            });
            _.each(gateReview.performances.completion.actualCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion && gateReview.gateStateReview.newCompleted){
                    missingFields.push('Actual completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });
            
            return missingFields;
        };

        // Check that date are consistent with current dates of previous and next gates
        $scope.dateConsistencyErrors = {};
        var checkDateConsistency = function(editedGateReview, editedGate, project){
            // Check that this gate baseline/estimate/actual are not earlier than previous gate or later than next gate

            var gates = project.process.gates;

            var dateConsistencyErrors = [];

            // Gate Review new dates

            var thisGate_BaselineDurationReview_NewDate = _.find(editedGateReview.performances.duration.baselineDurationReviews, function(performanceReview){
                return performanceReview.baselineDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_BaselineDurationReview_NewDate = thisGate_BaselineDurationReview_NewDate && new Date(thisGate_BaselineDurationReview_NewDate);

            var thisGate_EstimateDurationReview_NewDate = _.find(editedGateReview.performances.duration.estimateDurationReviews, function(performanceReview){
                return performanceReview.estimateDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_EstimateDurationReview_NewDate = thisGate_EstimateDurationReview_NewDate && new Date(thisGate_EstimateDurationReview_NewDate);

            var thisGate_ActualDurationReview_NewDate = _.find(editedGateReview.performances.duration.actualDurationReviews, function(performanceReview){
                return performanceReview.actualDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_ActualDurationReview_NewDate = thisGate_ActualDurationReview_NewDate && new Date(thisGate_ActualDurationReview_NewDate);

            _.each(gates, function(gate){

                // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
                if((gate.position < editedGate.position) && (editedGate._id !== project.process.startGate)){

                    var previousGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_BaselineDuration_CurrentDate = previousGate_BaselineDuration_CurrentDate && new Date(previousGate_BaselineDuration_CurrentDate);

                    var previousGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_EstimateDuration_CurrentDate = previousGate_EstimateDuration_CurrentDate && new Date(previousGate_EstimateDuration_CurrentDate);

                    var previousGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_ActualDuration_CurrentDate = previousGate_ActualDuration_CurrentDate && new Date(previousGate_ActualDuration_CurrentDate);

                    if(previousGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (previousGate_BaselineDuration_CurrentDate > thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(previousGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (previousGate_EstimateDuration_CurrentDate > thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_EstimateDuration_CurrentDate.toDateString());
                    }

                    if(previousGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (previousGate_ActualDuration_CurrentDate > thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

                // NEXT gates dates (for next gate as a target). Skip is editedGate is END
                if((gate.position > editedGate.position) && (editedGate._id !== project.process.endGate)){

                    var nextGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_BaselineDuration_CurrentDate = nextGate_BaselineDuration_CurrentDate && new Date(nextGate_BaselineDuration_CurrentDate);

                    var nextGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_EstimateDuration_CurrentDate = nextGate_EstimateDuration_CurrentDate && new Date(nextGate_EstimateDuration_CurrentDate);

                    var nextGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_ActualDuration_CurrentDate = nextGate_ActualDuration_CurrentDate && new Date(nextGate_ActualDuration_CurrentDate);

                    if(nextGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (nextGate_BaselineDuration_CurrentDate < thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(nextGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (nextGate_EstimateDuration_CurrentDate < thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_EstimateDuration_CurrentDate.toDateString());
                    }

                    if(nextGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (nextGate_ActualDuration_CurrentDate < thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

            });

            return dateConsistencyErrors;
        };

        $scope.submit = function(project, gate, gateReview){

            $scope.submitMissingFields[gateReview._id] = setSubmitMissingFields(gateReview);
            $scope.dateConsistencyErrors[gateReview._id] = checkDateConsistency(gateReview, gate, project);

            if(($scope.submitMissingFields[gateReview._id].length > 0) || ($scope.dateConsistencyErrors[gateReview._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.submitGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(project, gate, gateReview){

            $scope.submitMissingFields[gateReview._id] = setSubmitMissingFields(gateReview);
            $scope.dateConsistencyErrors[gateReview._id] = checkDateConsistency(gateReview, gate, project);

            if(($scope.submitMissingFields[gateReview._id].length > 0) || ($scope.dateConsistencyErrors[gateReview._id].length > 0)){
                return; // Must exit
            }
            
            $scope.error = null;
            $scope.isResolving = true;
            Projects.approveGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(project, gate, gateReview){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.rejectGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, gate, gateReview){
            
            $scope.error = null;
            $scope.isResolving = true;
            Projects.draftGateReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    gateReviewId : gateReview._id
                }, gateReview,
                function(res){
                    $scope.isResolving = false;
                    gateReview.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };
        

    }
]);

'use strict';

// Configuring the Articles module
angular.module('improvement-activities').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Improvement activities', 'improvement-activities', 'dropdown', '/improvement-activities(/create)?');
		//Menus.addSubMenuItem('topbar', 'improvement-activities', 'List Improvement activities', 'improvement-activities');
		//Menus.addSubMenuItem('topbar', 'improvement-activities', 'New Improvement activity', 'improvement-activities/create');
	}
]);

'use strict';

//Setting up route
angular.module('improvement-activities').config(['$stateProvider',
	function($stateProvider) {
		// Improvement activities state routing
		$stateProvider.
		state('improvement-activities', {
			url: '/improvement-activities',
			templateUrl: 'modules/improvement-activities/views/improvement-activities.client.view.html'
		})
        .state('improvement-activities-id', {
            url: '/improvement-activities/:activityId',
            templateUrl: 'modules/improvement-activities/views/improvement-activities.client.view.html'
        });
	}
]);

'use strict';

// IMPROVEMENT ACTIVITIES controller
angular.module('improvement-activities').controller('ImprovementActivitiesController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'ImprovementActivities', 'ImprovementTypes', 'ImprovementReasons', 'ImprovementStates', 'LogPriorities', 'LogStatusIndicators',
	'People', '$modal', '$log',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, ImprovementActivities, ImprovementTypes, ImprovementReasons, ImprovementStates, LogPriorities, LogStatusIndicators, People, $modal, $log) {

		$rootScope.staticMenu = false;

		var vm = this;

		// ------------- INIT -------------

		vm.initError = [];

		vm.init = function () {



			// Portfolios.query(function(portfolios){
			// 	vm.portfolios = portfolios;
			// 	vm.portfolioTrees = createNodeTrees(portfolios);
			// }, function(err){
			// 	vm.initError.push(err.data.message);
			// });
            //
			// ImprovementActivities.query(function (res) {
			// 	vm.improvementActivities = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });
            //
			// ImprovementTypes.query(function (res) {
			// 	vm.improvementTypes = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });
            //
			// ImprovementReasons.query(function (res) {
			// 	vm.improvementReasons = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });
            //
			// ImprovementStates.query(function (res) {
			// 	vm.improvementStates = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });
            //
			// LogPriorities.query(function (res) {
			// 	vm.logPriorities = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });
            //
			// LogStatusIndicators.query(function (res) {
			// 	vm.logStatuses = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });
            //
			// People.query(function (res) {
			// 	vm.people = res;
			// }, function (err) {
			// 	vm.initError.push(err.data.message);
			// });

		};

        vm.userData = Authentication.user;

        $q.all([
            Portfolios.query().$promise,
            ImprovementActivities.query().$promise,
            ImprovementTypes.query().$promise,
            ImprovementReasons.query().$promise,
            ImprovementStates.query().$promise,
            LogPriorities.query().$promise,
            LogStatusIndicators.query().$promise,
            People.query().$promise
        ]).then(function(data) {
            vm.portfolios = data[0];
            vm.portfolioTrees = createNodeTrees(data[0]);

            vm.improvementActivities = data[1];
            vm.improvementTypes = data[2];
            vm.improvementReasons = data[3];
            vm.improvementStates = data[4];
            vm.logPriorities = data[5];
            vm.logStatuses = data[6];
            vm.people = data[7];

        }, function(err){
            vm.initError.push(err);
        });

        // This is called multiple times in an infinite loop so no called
        var processParams = function(improvementActivities){
            if($stateParams.activityId){
                var foundActivity = _.find(improvementActivities, _.matchesProperty('_id', $stateParams.activityId));
                if(foundActivity){
                    vm.selectImprovementActivity(foundActivity);
                } else {
                    vm.error = 'Cannot find activity ' + $stateParams.activityId;
                }
            }
        };


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, userData, improvementActivity){
            var userIsSuperhero, userIsOwner, userIsPortfolioManager;

            if(action === 'new' && userData){

                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                return userIsSuperhero;
            }

            if(action === 'edit' && userData && improvementActivity){

                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                if(improvementActivity.assignedTo){
                    userIsOwner = userData._id === improvementActivity.assignedTo.assignedUser;
                }

                if(improvementActivity.portfolio){
                    userIsPortfolioManager = (userData._id === improvementActivity.portfolio.portfolioManager) || (userData._id === improvementActivity.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsOwner || userIsPortfolioManager;
            }
        };

		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};


		// ------------------- UTILITIES ---------------------

		var allowNull = function (obj) {
			if (obj) {
				return obj._id;
			} else {
				return null;
			}
		};

		vm.sortImprovementActivities = function (activity) {
			return new Date(activity.raisedOnDate);
		};

		vm.completionFilterArray = [
			{name : 'Completed', flag : true},
			{name : 'Not completed', flag : false}
		];


// ******************************************************* IMPROVEMENT ACTIVITY *******************************************************



		// ------------- NEW ACTIVITY ------------


		vm.openNewActivityRaisedOnDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.newImprovementActivityRaisedOnDateOpened = true;
		};

		vm.newImprovementActivity = {};

		vm.createNewImprovementActivity = function () {
			var newImprovementActivity = new ImprovementActivities({
				raisedOnDate: vm.newImprovementActivity.raisedOnDate,
				title: vm.newImprovementActivity.title
			});
			newImprovementActivity.$save(function (res) {
				// Refresh the list of gate reviews after populating portfolio
				vm.improvementActivities.push(res);
				// Clear new form
				vm.newImprovementActivity = {};
				// Select in view mode the new review
				vm.selectImprovementActivity(_.find(vm.improvementActivities, _.matchesProperty('_id', res._id)));
				// Close new review form done directly in the view's html
			}, function (err) {
				vm.error = err.data.message;
			});
		};

		vm.cancelNewImprovementActivity = function () {
			vm.newImprovementActivity = {};
		};



		// ------------- EDIT ACTIVITY ------------


		var modalUpdateActivity = function (size, activity, userData, portfolios, improvementTypes, improvementReasons, improvementStates, logPriorities, logStatuses, people) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/improvement-activities/views/edit-improvement-activity.client.view.html',
				controller: function ($scope, $modalInstance, activity, userData, portfolios, improvementTypes, improvementReasons, improvementStates, logPriorities, logStatuses, people) {

                    $scope.userData = userData;
					$scope.originalImprovementActivity = _.cloneDeep(activity);
					$scope.selectedImprovementActivity = activity;

                    $scope.portfolios = portfolios;
                    $scope.improvementTypes = improvementTypes;
                    $scope.improvementReasons = improvementReasons;
                    $scope.improvementStates = improvementStates;
                    $scope.logPriorities = logPriorities;
                    $scope.logStatuses = logStatuses;
                    $scope.people = people;

					$scope.cancelModal = function () {
						$modalInstance.dismiss();
					};
				},
				size: size,
				resolve: {
					activity: function () {
						return activity;
					},
                    userData: function () {
                        return userData;
                    },
                    portfolios: function () {
                        return portfolios;
                    },
                    improvementTypes: function () {
                        return improvementTypes;
                    },
                    improvementReasons: function () {
                        return improvementReasons;
                    },
                    improvementStates: function () {
                        return improvementStates;
                    },
                    logPriorities: function () {
                        return logPriorities;
                    },
                    logStatuses: function () {
                        return logStatuses;
                    },
                    people: function () {
                        return people;
                    }
				},
				backdrop: 'static',
				keyboard: false
			});

		};

		vm.selectImprovementActivity = function(activity){
			modalUpdateActivity('lg', activity, vm.userData, vm.portfolios, vm.improvementTypes, vm.improvementReasons, vm.improvementStates, vm.logPriorities, vm.logStatuses, vm.people);
		};

		// ------------------- NG-SWITCH ---------------------

		vm.improvementActivityDetails = 'header';

		vm.selectHeaderForm = function (string) {
			if (string === 'view') {
				vm.switchHeaderForm = 'view';
			}
			if (string === 'edit') {
				vm.switchHeaderForm = 'edit';
			}
		};

		vm.selectStatusForm = function (string) {
			if (string === 'view') {
				vm.switchStatusForm = 'view';
			}
			if (string === 'edit') {
				vm.switchStatusForm = 'edit';
			}
		};

		// ------------------- HEADER --------------------------

		vm.openHeaderDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.headerDateOpened = true;
		};

		vm.editHeader = function () {
			vm.selectHeaderForm('edit');
		};

		vm.saveEditHeader = function (improvementActivity, originalImprovementActivity) {
			// Clean-up deepPopulate
			var copyImprovementActivity = _.cloneDeep(improvementActivity);
			copyImprovementActivity.portfolio = allowNull(copyImprovementActivity.portfolio);
			copyImprovementActivity.type = allowNull(copyImprovementActivity.type);
            copyImprovementActivity.assignedTo = allowNull(copyImprovementActivity.assignedTo);
			copyImprovementActivity.reason = allowNull(copyImprovementActivity.reason);
			copyImprovementActivity.priority = allowNull(copyImprovementActivity.priority);
			copyImprovementActivity.state = allowNull(copyImprovementActivity.state);
			copyImprovementActivity.statusReview.currentRecord.status = allowNull(copyImprovementActivity.statusReview.currentRecord.status);
			// Update server header
			ImprovementActivities.updateHeader(
				{
					improvementActivityId: copyImprovementActivity._id
				}, copyImprovementActivity,
				function (res) {
					// Update details pane view with new saved details
					originalImprovementActivity.raisedOnDate = improvementActivity.raisedOnDate;
					originalImprovementActivity.title = improvementActivity.title;
					originalImprovementActivity.description = improvementActivity.description;
                    originalImprovementActivity.type = improvementActivity.type;
                    originalImprovementActivity.portfolio = improvementActivity.portfolio;
                    originalImprovementActivity.assignedTo = improvementActivity.assignedTo;
					originalImprovementActivity.state = improvementActivity.state;
					originalImprovementActivity.reason = improvementActivity.reason;
					originalImprovementActivity.priority = improvementActivity.priority;
					// Close edit header form and back to view
					vm.selectHeaderForm('view');
				},
				function (err) {
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditHeader = function (improvementActivity, originalImprovementActivity) {
			improvementActivity.raisedOnDate = originalImprovementActivity.raisedOnDate;
			improvementActivity.title = originalImprovementActivity.title;
			improvementActivity.description = originalImprovementActivity.description;
            improvementActivity.type = originalImprovementActivity.type;
            improvementActivity.portfolio = originalImprovementActivity.portfolio;
            improvementActivity.assignedTo = originalImprovementActivity.assignedTo;
			improvementActivity.state = originalImprovementActivity.state;
			improvementActivity.reason = originalImprovementActivity.reason;
			improvementActivity.priority = originalImprovementActivity.priority;
			vm.selectHeaderForm('view');
		};


		vm.deleteImprovementActivity = function (improvementActivity) {
			ImprovementActivities.remove({improvementActivityId: improvementActivity._id}, improvementActivity, function (res) {
				vm.improvementActivities = _.without(vm.improvementActivities, improvementActivity);
			}, function (err) {
				vm.error = err.data.message;
			});
		};


		// --------------------- STATUS -----------------------

		vm.openBaselineDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.baselineDeliveryDateOpened = true;
		};

		vm.openEstimateDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.estimateDeliveryDateOpened = true;
		};

		vm.openActualDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.actualDeliveryDateOpened = true;
		};

		vm.editStatus = function () {
			vm.selectStatusForm('edit');
		};

		vm.saveEditStatus = function (improvementActivity, originalImprovementActivity) {
			// Clean-up deepPopulate
			var copyImprovementActivity = _.cloneDeep(improvementActivity);
			copyImprovementActivity.portfolio = allowNull(copyImprovementActivity.portfolio);
            copyImprovementActivity.type = allowNull(copyImprovementActivity.type);
            copyImprovementActivity.assignedTo = allowNull(copyImprovementActivity.assignedTo);
			copyImprovementActivity.reason = allowNull(copyImprovementActivity.reason);
			copyImprovementActivity.priority = allowNull(copyImprovementActivity.priority);
			copyImprovementActivity.state = allowNull(copyImprovementActivity.state);
			copyImprovementActivity.statusReview.currentRecord.status = allowNull(copyImprovementActivity.statusReview.currentRecord.status);
			// Update server header
			ImprovementActivities.updateStatus({improvementActivityId: copyImprovementActivity._id}, copyImprovementActivity,
				function (res) {
					// Change the selected CR
					originalImprovementActivity.statusReview.currentRecord.baselineDeliveryDate = improvementActivity.statusReview.currentRecord.baselineDeliveryDate;
					originalImprovementActivity.statusReview.currentRecord.estimateDeliveryDate = improvementActivity.statusReview.currentRecord.estimateDeliveryDate;
					originalImprovementActivity.statusReview.currentRecord.actualDeliveryDate = improvementActivity.statusReview.currentRecord.actualDeliveryDate;
					originalImprovementActivity.statusReview.currentRecord.status = improvementActivity.statusReview.currentRecord.status;
					originalImprovementActivity.statusReview.currentRecord.completed = improvementActivity.statusReview.currentRecord.completed;
					originalImprovementActivity.statusReview.currentRecord.statusComment = improvementActivity.statusReview.currentRecord.statusComment;
					vm.selectStatusForm('view');
				},
				function (err) {
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditStatus = function (improvementActivity, originalImprovementActivity) {
			improvementActivity.statusReview.currentRecord.baselineDeliveryDate = originalImprovementActivity.statusReview.currentRecord.baselineDeliveryDate;
			improvementActivity.statusReview.currentRecord.estimateDeliveryDate = originalImprovementActivity.statusReview.currentRecord.estimateDeliveryDate;
			improvementActivity.statusReview.currentRecord.actualDeliveryDate = originalImprovementActivity.statusReview.currentRecord.actualDeliveryDate;
			improvementActivity.statusReview.currentRecord.status = originalImprovementActivity.statusReview.currentRecord.status;
			improvementActivity.statusReview.currentRecord.completed = originalImprovementActivity.statusReview.currentRecord.completed;
			improvementActivity.statusReview.currentRecord.statusComment = originalImprovementActivity.statusReview.currentRecord.statusComment;
			vm.selectStatusForm('view');
		};




	}

]);

'use strict';

//Improvement activities service used to communicate Improvement activities REST endpoints
angular.module('improvement-activities').factory('ImprovementActivities', ['$resource',
	function($resource) {
		return $resource('improvement-activities/:improvementActivityId', { improvementActivityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			updateHeader: {
				method: 'PUT',
				url: 'improvement-activities/:improvementActivityId/header'
				// req.body: {whole issue object}
			},

			updateStatus: {
				method: 'PUT',
				url: 'improvement-activities/:improvementActivityId/status'
				// req.body: {whole issue object}
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('improvement-setup').config(['$stateProvider',
	function($stateProvider) {
		// Improvement setup state routing
		$stateProvider.
		state('improvement-setup', {
			url: '/improvement-setup',
			templateUrl: 'modules/improvement-setup/views/improvement-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('improvement-setup').controller('ImprovementSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'ImprovementStates', 'ImprovementTypes', 'ImprovementReasons', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, ImprovementStates, ImprovementTypes, ImprovementReasons, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			ImprovementStates.query(function(res){
				$scope.improvementStates = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ImprovementTypes.query(function(res){
				$scope.improvementTypes = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ImprovementReasons.query(function(res){
				$scope.improvementReasons = res;
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



// ----------------------------------------------- IMPROVEMENT STATES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchImprovementStateForm = {};

		$scope.selectImprovementStateForm = function(state, string){
			if(string === 'view'){ $scope.switchImprovementStateForm[state._id] = 'view';}
			if(string === 'new'){$scope.switchImprovementStateForm[state._id] = 'new';}
			if(string === 'edit'){$scope.switchImprovementStateForm[state._id] = 'edit';}
		};

		// ------------------- LIST STATES -----------------

		$scope.findImprovementStates = function() {
			$scope.initError = [];
			ImprovementStates.query(function(states){
				$scope.improvementStates = states;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalImprovementState = {};
		$scope.selectImprovementState = function(state){
			$scope.error = null;
			originalImprovementState[state._id] = _.clone(state);
			$scope.selectImprovementStateForm(state, 'edit');
		};

		$scope.updateImprovementState = function(state) {
			$scope.error = null;
			state.$update(function(response) {
				$scope.findImprovementStates();
				$scope.selectImprovementStateForm(state, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditImprovementState = function(state){
			state.name = originalImprovementState[state._id].name;
			state.description = originalImprovementState[state._id].description;
			$scope.selectImprovementStateForm(state, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeImprovementState = function(state) {
			$scope.error = null;
			state.$remove(function(response) {
				$scope.findImprovementStates();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createImprovementState = function() {
			$scope.error = null;
			var state = new ImprovementStates ({
				name: 'New improvement activity state'
			});
			state.$save(function(response) {
				$scope.findImprovementStates();
				$scope.selectImprovementStateForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ----------------------------------------------- REASONS ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchReasonForm = {};

		$scope.selectReasonForm = function(reason, string){
			if(string === 'view'){ $scope.switchReasonForm[reason._id] = 'view';}
			if(string === 'new'){$scope.switchReasonForm[reason._id] = 'new';}
			if(string === 'edit'){$scope.switchReasonForm[reason._id] = 'edit';}
		};

		// ------------------- LIST OF REASONS -----------------

		$scope.findReasons = function() {
			$scope.initError = [];
			ImprovementReasons.query(function(reasons){
				$scope.improvementReasons = reasons;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalReason = {};
		$scope.selectReason = function(reason){
			$scope.error = null;
			originalReason[reason._id] = _.clone(reason);
			$scope.selectReasonForm(reason, 'edit');
		};

		$scope.updateReason = function(reason) {
			$scope.error = null;
			reason.$update(function(response) {
				$scope.findReasons();
				$scope.selectReasonForm(reason, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditReason = function(reason){
			reason.name = originalReason[reason._id].name;
			reason.description = originalReason[reason._id].description;
			$scope.selectReasonForm(reason, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeReason = function(reason) {
			$scope.error = null;
			reason.$remove(function(response) {
				$scope.findReasons();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createReason = function() {
			$scope.error = null;
			var reason = new ImprovementReasons ({
				name: 'New reason for improvement'
			});
			reason.$save(function(response) {
				$scope.findReasons();
				$scope.selectReasonForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



        // ----------------------------------------------- TYPES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchTypeForm = {};

        $scope.selectTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
        };

        // ------------------- LIST OF REASONS -----------------

        $scope.findTypes = function() {
            $scope.initError = [];
            ImprovementTypes.query(function(types){
                $scope.improvementTypes = types;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalType = {};
        $scope.selectType = function(type){
            $scope.error = null;
            originalType[type._id] = _.clone(type);
            $scope.selectTypeForm(type, 'edit');
        };

        $scope.updateType = function(type) {
            $scope.error = null;
            type.$update(function(response) {
                $scope.findTypes();
                $scope.selectTypeForm(type, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditType = function(type){
            type.name = originalType[type._id].name;
            type.description = originalType[type._id].description;
            $scope.selectTypeForm(type, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeType = function(type) {
            $scope.error = null;
            type.$remove(function(response) {
                $scope.findTypes();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createType = function() {
            $scope.error = null;
            var type = new ImprovementTypes ({
                name: 'New improvement activity type'
            });
            type.$save(function(response) {
                $scope.findTypes();
                $scope.selectTypeForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

'use strict';

//Improvement reasons service used to communicate Improvement reasons REST endpoints
angular.module('improvement-setup').factory('ImprovementReasons', ['$resource',
	function($resource) {
		return $resource('improvement-reasons/:improvementReasonId', { improvementReasonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Improvement states service used to communicate Improvement states REST endpoints
angular.module('improvement-setup').factory('ImprovementStates', ['$resource',
	function($resource) {
		return $resource('improvement-states/:improvementStateId', { improvementStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Improvement types service used to communicate Improvement types REST endpoints
angular.module('improvement-setup').factory('ImprovementTypes', ['$resource',
	function($resource) {
		return $resource('improvement-types/:improvementTypeId', { improvementTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('log-delivery-setup').config(['$stateProvider',
	function($stateProvider) {
		// Log delivery setup state routing
		$stateProvider.
		state('log-delivery-setup', {
			url: '/log-delivery-setup',
			templateUrl: 'modules/log-delivery-setup/views/log-delivery-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('log-delivery-setup').controller('LogDeliverySetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'IssueStates', 'IssueActionStates', 'ChangeRequestStates', 'LogPriorities', 'LogReasons', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, IssueStates, IssueActionStates, ChangeRequestStates, LogPriorities, LogReasons, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

        $scope.initError = [];

		$scope.init = function(){
            IssueStates.query(function(issueStates){
                $scope.issueStates = issueStates;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            IssueActionStates.query(function(actionStates){
                $scope.actionStates = actionStates;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            ChangeRequestStates.query(function(changeRequestStates){
                $scope.changeRequestStates = changeRequestStates;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogPriorities.query(function(priorities){
                $scope.logPriorities = priorities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogReasons.query(function(reasons){
                $scope.logReasons = reasons;
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



// ----------------------------------------------- ISSUE STATES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchIssueStateForm = {};

		$scope.selectIssueStateForm = function(state, string){
			if(string === 'view'){ $scope.switchIssueStateForm[state._id] = 'view';}
			if(string === 'new'){$scope.switchIssueStateForm[state._id] = 'new';}
			if(string === 'edit'){$scope.switchIssueStateForm[state._id] = 'edit';}
		};

		// ------------------- LIST STATES -----------------

		$scope.findIssueStates = function() {
            $scope.initError = [];
			IssueStates.query(function(states){
				$scope.issueStates = states;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalIssueState = {};
		$scope.selectIssueState = function(state){
			$scope.error = null;
			originalIssueState[state._id] = _.clone(state);
			$scope.selectIssueStateForm(state, 'edit');
		};

		$scope.updateIssueState = function(state) {
			$scope.error = null;
			state.$update(function(response) {
				$scope.findIssueStates();
				$scope.selectIssueStateForm(state, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditIssueState = function(state){
			state.name = originalIssueState[state._id].name;
			state.description = originalIssueState[state._id].description;
			$scope.selectIssueStateForm(state, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeIssueState = function(state) {
			$scope.error = null;
			state.$remove(function(response) {
				$scope.findIssueStates();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createIssueState = function() {
			$scope.error = null;
			var state = new IssueStates ({
				name: 'New issue state'
			});
			state.$save(function(response) {
				$scope.findIssueStates();
				$scope.selectIssueStateForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};




// ----------------------------------------------- ACTION STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchActionStateForm = {};

        $scope.selectActionStateForm = function(state, string){
            if(string === 'view'){ $scope.switchActionStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchActionStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchActionStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST STATES -----------------

        $scope.findActionStates = function() {
            $scope.initError = [];
            IssueActionStates.query(function(states){
                $scope.actionStates = states;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalActionState = {};
        $scope.selectActionState = function(state){
            $scope.error = null;
            originalActionState[state._id] = _.clone(state);
            $scope.selectActionStateForm(state, 'edit');
        };

        $scope.updateActionState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findActionStates();
                $scope.selectActionStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditActionState = function(state){
            state.name = originalActionState[state._id].name;
            state.description = originalActionState[state._id].description;
            $scope.selectActionStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeActionState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findActionStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createActionState = function() {
            $scope.error = null;
            var state = new IssueActionStates ({
                name: 'New action state'
            });
            state.$save(function(response) {
                $scope.findActionStates();
                $scope.selectActionStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


// ----------------------------------------------- CHANGE REQUEST STATES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchChangeRequestStateForm = {};

        $scope.selectChangeRequestStateForm = function(state, string){
            if(string === 'view'){ $scope.switchChangeRequestStateForm[state._id] = 'view';}
            if(string === 'new'){$scope.switchChangeRequestStateForm[state._id] = 'new';}
            if(string === 'edit'){$scope.switchChangeRequestStateForm[state._id] = 'edit';}
        };

        // ------------------- LIST STATES -----------------

        $scope.findChangeRequestStates = function() {
            $scope.initError = [];
            ChangeRequestStates.query(function(states){
                $scope.changeRequestStates = states;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalChangeRequestState = {};
        $scope.selectChangeRequestState = function(state){
            $scope.error = null;
            originalChangeRequestState[state._id] = _.clone(state);
            $scope.selectChangeRequestStateForm(state, 'edit');
        };

        $scope.updateChangeRequestState = function(state) {
            $scope.error = null;
            state.$update(function(response) {
                $scope.findChangeRequestStates();
                $scope.selectChangeRequestStateForm(state, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditChangeRequestState = function(state){
            state.name = originalChangeRequestState[state._id].name;
            state.description = originalChangeRequestState[state._id].description;
            $scope.selectChangeRequestStateForm(state, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeChangeRequestState = function(state) {
            $scope.error = null;
            state.$remove(function(response) {
                $scope.findChangeRequestStates();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createChangeRequestState = function() {
            $scope.error = null;
            var state = new ChangeRequestStates ({
                name: 'New change request state'
            });
            state.$save(function(response) {
                $scope.findChangeRequestStates();
                $scope.selectChangeRequestStateForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ---------------------------------------------------- LOG PRIORITIES --------------------------------------

        // ------------------- DRAG AND DROP LISTENERS -------

        $scope.dragControlListeners = {
            //accept: function (sourceItemHandleScope, destSortableScope) {
            //    //override to determine drag is allowed or not. default is true.
            //    return true;
            //},
            //itemMoved: function (event) {
            //
            //},
            orderChanged: function(event) {
                for(var i = 0; i < $scope.logPriorities.length; i++){
                    $scope.updateValue($scope.logPriorities[i]);
                }
            }
            //containment: '#board',//optional param.
            //clone: true //optional param for clone feature.
        };

        /*
         event object - structure
         source:
         index: original index before move.
         itemScope: original item scope before move.
         sortableScope: original sortable list scope.
         dest:
         index: index after move.
         sortableScope: destination sortable scope.
         -------------
         sourceItemScope - the scope of the item being dragged.
         destScope - the sortable destination scope, the list.
         destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
         */


        // ------------------- NG-SWITCH ---------------------

        $scope.selectValueForm = function(string){
            if(string === 'view'){ $scope.switchValueForm = 'view';}
            if(string === 'edit'){$scope.switchValueForm = 'edit';}
        };

        // ------------------- LIST OF VALUES -----------------

        $scope.findValues = function() {
            $scope.initError = [];
            LogPriorities.query(function(values){
                $scope.logPriorities = values;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalValue;
        $scope.selectValue = function(value){
            $scope.error = null;
            $scope.selectValueForm('view');
            $scope.priorityValue = value;
            originalValue = _.clone(value);
        };

        $scope.updateValue = function(value) {
            $scope.error = null;
            value.position = _.indexOf($scope.logPriorities, value) + 1;
            value.$update(function(response) {
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditValue = function(value){
            value.name = originalValue.name;
            value.numericalValue = originalValue.numericalValue;
            value.description = originalValue.description;
            $scope.selectValueForm('view');
        };

        // ------------------- DELETE -----------------

        $scope.removeValue = function(value) {
            $scope.error = null;
            value.$remove(function(response) {
                $scope.logPriorities = _.without($scope.logPriorities, value);
                for(var i = 0; i < $scope.logPriorities.length; i++){
                    if($scope.logPriorities[i].position > value.position){
                        $scope.updateValue($scope.logPriorities[i]);
                    }
                }
                $scope.priorityValue = null;
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createValue = function() {
            $scope.error = null;
            var priorityValue = new LogPriorities ({
                name: 'New log priority',
                numericalValue: 0,
                position: $scope.logPriorities.length + 1
            });
            priorityValue.$save(function(response) {
                $scope.findValues();
                $scope.selectValueForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

// ----------------------------------------------- REASONS ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchReasonForm = {};

        $scope.selectReasonForm = function(reason, string){
            if(string === 'view'){ $scope.switchReasonForm[reason._id] = 'view';}
            if(string === 'new'){$scope.switchReasonForm[reason._id] = 'new';}
            if(string === 'edit'){$scope.switchReasonForm[reason._id] = 'edit';}
        };

        // ------------------- LIST OF REASONS -----------------

        $scope.findReasons = function() {
            $scope.initError = [];
            LogReasons.query(function(reasons){
                $scope.logReasons = reasons;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalReason = {};
        $scope.selectReason = function(reason){
            $scope.error = null;
            originalReason[reason._id] = _.clone(reason);
            $scope.selectReasonForm(reason, 'edit');
        };

        $scope.updateReason = function(reason) {
            $scope.error = null;
            reason.$update(function(response) {
                $scope.findReasons();
                $scope.selectReasonForm(reason, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditReason = function(reason){
            reason.name = originalReason[reason._id].name;
            reason.description = originalReason[reason._id].description;
            $scope.selectReasonForm(reason, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeReason = function(reason) {
            $scope.error = null;
            reason.$remove(function(response) {
                $scope.findReasons();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createReason = function() {
            $scope.error = null;
            var reason = new LogReasons ({
                name: 'New reason for change'
            });
            reason.$save(function(response) {
                $scope.findReasons();
                $scope.selectReasonForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

'use strict';

//Change request states service used to communicate Change request states REST endpoints
angular.module('log-delivery-setup').factory('ChangeRequestStates', ['$resource',
	function($resource) {
		return $resource('change-request-states/:changeRequestStateId', { changeRequestStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Issue action states service used to communicate Issue action states REST endpoints
angular.module('log-delivery-setup').factory('IssueActionStates', ['$resource',
	function($resource) {
		return $resource('issue-action-states/:issueActionStateId', { issueActionStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Issue states service used to communicate Issue states REST endpoints
angular.module('log-delivery-setup').factory('IssueStates', ['$resource',
	function($resource) {
		return $resource('issue-states/:issueStateId', { issueStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Log priorities service used to communicate Log priorities REST endpoints
angular.module('log-delivery-setup').factory('LogPriorities', ['$resource',
	function($resource) {
		return $resource('log-priorities/:logPriorityId', { logPriorityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Log reasons service used to communicate Log reasons REST endpoints
angular.module('log-delivery-setup').factory('LogReasons', ['$resource',
	function($resource) {
		return $resource('log-reasons/:logReasonId', { logReasonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('log-milestone-setup').config(['$stateProvider',
	function($stateProvider) {
		// Log milestone setup state routing
		$stateProvider.
		state('log-milestone-setup', {
			url: '/log-milestone-setup',
			templateUrl: 'modules/log-milestone-setup/views/log-milestone-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('log-milestone-setup').controller('LogMilestoneSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'MilestoneStates', 'ProjectMilestoneTypes', 'PortfolioMilestoneTypes', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, MilestoneStates, ProjectMilestoneTypes, PortfolioMilestoneTypes, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){
			MilestoneStates.query(function(milestoneStates){
				$scope.milestoneStates = milestoneStates;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			ProjectMilestoneTypes.query(function(projectMilestoneTypes){
				$scope.projectMilestoneTypes = projectMilestoneTypes;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
			PortfolioMilestoneTypes.query(function(portfolioMilestoneTypes){
				$scope.portfolioMilestoneTypes = portfolioMilestoneTypes;
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



// ----------------------------------------------- MILESTONE STATES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchMilestoneStateForm = {};

		$scope.selectMilestoneStateForm = function(state, string){
			if(string === 'view'){ $scope.switchMilestoneStateForm[state._id] = 'view';}
			if(string === 'new'){$scope.switchMilestoneStateForm[state._id] = 'new';}
			if(string === 'edit'){$scope.switchMilestoneStateForm[state._id] = 'edit';}
		};

		// ------------------- LIST STATES -----------------

		$scope.findMilestoneStates = function() {
			$scope.initError = [];
			MilestoneStates.query(function(states){
				$scope.milestoneStates = states;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalMilestoneState = {};
		$scope.selectMilestoneState = function(state){
			$scope.error = null;
			originalMilestoneState[state._id] = _.clone(state);
			$scope.selectMilestoneStateForm(state, 'edit');
		};

		$scope.updateMilestoneState = function(state) {
			$scope.error = null;
			state.$update(function(response) {
				$scope.findMilestoneStates();
				$scope.selectMilestoneStateForm(state, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditMilestoneState = function(state){
			state.name = originalMilestoneState[state._id].name;
			state.description = originalMilestoneState[state._id].description;
			$scope.selectMilestoneStateForm(state, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeMilestoneState = function(state) {
			$scope.error = null;
			state.$remove(function(response) {
				$scope.findMilestoneStates();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createMilestoneState = function() {
			$scope.error = null;
			var state = new MilestoneStates ({
				name: 'New milestone state'
			});
			state.$save(function(response) {
				$scope.findMilestoneStates();
				$scope.selectMilestoneStateForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ----------------------------------------------- PROJECT MILESTONE TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectMilestoneTypeForm = {};

		$scope.selectProjectMilestoneTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchProjectMilestoneTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchProjectMilestoneTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchProjectMilestoneTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST TYPES -----------------

		$scope.findProjectMilestoneTypes = function() {
			$scope.initError = [];
			ProjectMilestoneTypes.query(function(types){
				$scope.projectMilestoneTypes = types;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalProjectMilestoneType = {};
		$scope.selectProjectMilestoneType = function(type){
			$scope.error = null;
			originalProjectMilestoneType[type._id] = _.clone(type);
			$scope.selectProjectMilestoneTypeForm(type, 'edit');
		};

		$scope.updateProjectMilestoneType = function(type) {
			$scope.error = null;
            type.$update(function(response) {
				$scope.findProjectMilestoneTypes();
				$scope.selectProjectMilestoneTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditProjectMilestoneType = function(type){
			type.name = originalProjectMilestoneType[type._id].name;
			type.description = originalProjectMilestoneType[type._id].description;
			$scope.selectProjectMilestoneTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeProjectMilestoneType = function(type) {
			$scope.error = null;
			type.$remove(function(response) {
				$scope.findProjectMilestoneTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createProjectMilestoneType = function() {
			$scope.error = null;
			var type = new ProjectMilestoneTypes ({
				name: 'New project milestone type'
			});
			type.$save(function(response) {
				$scope.findProjectMilestoneTypes();
				$scope.selectProjectMilestoneTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};





		// ----------------------------------------------- PORTFOLIO MILESTONE TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioMilestoneTypeForm = {};

		$scope.selectPortfolioMilestoneTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchPortfolioMilestoneTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchPortfolioMilestoneTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchPortfolioMilestoneTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST TYPES -----------------

		$scope.findPortfolioMilestoneTypes = function() {
			$scope.initError = [];
			PortfolioMilestoneTypes.query(function(types){
				$scope.portfolioMilestoneTypes = types;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalPortfolioMilestoneType = {};
		$scope.selectPortfolioMilestoneType = function(type){
			$scope.error = null;
			originalPortfolioMilestoneType[type._id] = _.clone(type);
			$scope.selectPortfolioMilestoneTypeForm(type, 'edit');
		};

		$scope.updatePortfolioMilestoneType = function(type) {
			$scope.error = null;
            type.$update(function(response) {
				$scope.findPortfolioMilestoneTypes();
				$scope.selectPortfolioMilestoneTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPortfolioMilestoneType = function(type){
			type.name = originalPortfolioMilestoneType[type._id].name;
			type.description = originalPortfolioMilestoneType[type._id].description;
			$scope.selectPortfolioMilestoneTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removePortfolioMilestoneType = function(type) {
			$scope.error = null;
			type.$remove(function(response) {
				$scope.findPortfolioMilestoneTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createPortfolioMilestoneType = function() {
			$scope.error = null;
			var type = new PortfolioMilestoneTypes ({
				name: 'New portfolio milestone type'
			});
			type.$save(function(response) {
				$scope.findPortfolioMilestoneTypes();
				$scope.selectPortfolioMilestoneTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	}
]);

'use strict';

//Milestone states service used to communicate Milestone states REST endpoints
angular.module('log-milestone-setup').factory('MilestoneStates', ['$resource',
	function($resource) {
		return $resource('milestone-states/:milestoneStateId', { milestoneStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Portfolio milestone types service used to communicate Portfolio milestone types REST endpoints
angular.module('log-milestone-setup').factory('PortfolioMilestoneTypes', ['$resource',
	function($resource) {
		return $resource('portfolio-milestone-types/:portfolioMilestoneTypeId', { portfolioMilestoneTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Project milestone types service used to communicate Project milestone types REST endpoints
angular.module('log-milestone-setup').factory('ProjectMilestoneTypes', ['$resource',
	function($resource) {
		return $resource('project-milestone-types/:projectMilestoneTypeId', { projectMilestoneTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('log-summaries').config(['$stateProvider',
	function($stateProvider) {
		// Log summaries state routing
		$stateProvider.
		state('portfolioLogSummaries', {
			url: '/log-summaries/portfolioLogs',
			templateUrl: 'modules/log-summaries/views/portfolio-logs-summary.client.view.html'
		});
	}
]);

'use strict';

// Log summaries controller
angular.module('log-summaries').controller('LogSummariesController', ['$scope', '$stateParams', '$location', 'Authentication',
    'LogSummaries','Projects','Portfolios', 'GateProcessTemplates', '_','$q','$modal',
    function($scope, $stateParams, $location, Authentication, LogSummaries, Projects, Portfolios, GateProcessTemplates, _, $q, $modal) {

        var vm = this;

        // ----------- INIT ---------------

        vm.isResolving = false;

        vm.initError = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };


        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function(data){
            var obj = _.clone(data);
            vm.userHasAuthorization = _.some(obj.user.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });
        });

        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


        // ------ PORTFOLIO SELECTION -----------

        vm.selectPortfolio = function(portfolio){

            vm.selectedProjectProfile = null;
            vm.selectedPortfolio = portfolio;

            vm.error = null;
            vm.isResolving = true;
            LogSummaries.portfolioLogsSummary(
                {
                    portfolioId: portfolio._id
                },
                function(res){
                    vm.isResolving = false;
                    vm.portfolioPerformances = res;
                    console.log(res);
                },
                function(err){
                    vm.error = err;
                    vm.isResolving = false;
                }
            );
        };

        // ------ PROJECT SELECTION -----------

        vm.projectProfileDetails = 'financial';

        var modalProjectProfile = function (size, profile) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/gate-performances/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, profile) {

                    $scope.profile = profile;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };

                    $scope.getProjectStatusAreaData = function(projectStatusArea, gate){
                        return _.find(gate.deliveryStatus.projectStatusAreas, function(gatePSA){
                            return gatePSA._id === projectStatusArea._id;
                        });
                    };
                },
                size: size,
                resolve: {
                    profile: function () {
                        return profile;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(profile){
            modalProjectProfile('lg', profile);
        };






    }
]);

'use strict';

//Log summaries service used to communicate Log summaries REST endpoints
angular.module('log-summaries').factory('LogSummaries', ['$resource',
	function($resource) {
		return $resource('log-summaries', { 
		}, {
            portfolioLogsSummary: {
                method: 'GET',
                isArray: false,
                url: 'log-summaries/portfolioLogs'
            }
		});
	}
]);

'use strict';

//Setting up route
angular.module('maturity-management').config(['$stateProvider',
	function($stateProvider) {
		// Maturity management state routing
		$stateProvider.
		state('maturity-management', {
			url: '/maturity-management',
			templateUrl: 'modules/maturity-management/views/maturity-management.client.view.html'
		});
	}
]);
'use strict';

angular.module('maturity-management').controller('MaturityManagementController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 
    'Authentication', 'MaturityModels', 'ProjectReviewScores',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication, MaturityModels, ProjectReviewScores) {

		$rootScope.staticMenu = false;

		var vm = this;

		// ------------- INIT -------------

        vm.isResolving = false;

		vm.initError = [];

		vm.init = function () {

			vm.userData = Authentication.user;

			MaturityModels.query(function (res) {
				vm.maturityModels = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

            ProjectReviewScores.query(function (res) {
                vm.projectReviewScores = res;
            }, function (err) {
                vm.initError.push(err.data.message);
            });

		};

		// -------------- AUTHORIZATION FOR BUTTONS -----------------

		vm.userHasAuthorization = function(userData){
			var userIsSuperhero;

            userIsSuperhero = !!_.some(userData.roles, function(role){
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });

            return userIsSuperhero;
		};

        
// ******************************************************* SELECT DIMENSION *******************************************************
        
        var originalDimension = {};
        
        vm.showHistoryComment = {};

        vm.dimensionEdit = {};

        vm.selectDimension = function(dimension){
            // Flush any changes to current selectedDimension
            if(vm.selectedDimension){
                vm.cancelEditDimension(vm.selectedDimension);
            }
            originalDimension[dimension._id] = _.cloneDeep(dimension);
            vm.selectedDimension = dimension;
            vm.dimensionEdit[dimension._id] = false;
        };

        vm.saveEditDimension = function(model, dimension) {
            vm.error = null;
            vm.isResolving = true;
            MaturityModels.updateMaturityReview({
                maturityModelId: model._id,
                dimensionId: dimension._id
            }, dimension, function(res){
                vm.isResolving = false;
                dimension.maturityReview = res.maturityReview;
                originalDimension[dimension._id].maturityReview = res.maturityReview;
                vm.dimensionEdit[dimension._id] = false;
            },function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };

        vm.cancelEditDimension = function(dimension){
            vm.error = null;
            dimension.maturityReview = originalDimension[dimension._id].maturityReview;
            vm.dimensionEdit[dimension._id] = false;
        };


        $scope.$watch(function(){return vm.selectedMaturityModel;}, function(newValue, oldValue){
            if(newValue !== oldValue){
                // At every maturity model change flush selected dimensions data
                if(vm.selectedDimension){
                    vm.cancelEditDimension(vm.selectedDimension);
                    vm.selectedDimension = null;
                }
                // Flush the filters from previous model selection
                vm.dimensionFilter = {};
            }
        });



	}

]);

'use strict';

//Setting up route
angular.module('maturity-setup').config(['$stateProvider',
	function($stateProvider) {
		// Maturity setup state routing
		$stateProvider.
		state('maturity-setup', {
			url: '/maturity-setup',
			templateUrl: 'modules/maturity-setup/views/maturity-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('maturity-setup').controller('MaturitySetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'MaturityModels','$q','_',
	function($rootScope, $scope, $stateParams, $location, Authentication, MaturityModels, $q, _) {

        $rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.isResolving = false;

		$scope.init = function(){

			MaturityModels.query(function(res){
				$scope.maturityModels = res;
			}, function(err){
                $scope.error = err.data.message;
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


		// ------------------ MATURITY MODEL ----------------


        // Create

		$scope.createMaturityModel = function() {

			var maturityModel = new MaturityModels ({
				name: 'New maturity model',
				areas: [],
                levels: [],
                dimensions : []
			});

            $scope.error = null;
            $scope.isResolving = true;

            maturityModel.$save(function(res) {
                $scope.isResolving = false;
                $scope.maturityModels.push(res);
                $scope.selectMaturityModel(res);
			}, function(err) {
				$scope.error = err.data.message;
			});
		};


		// Edit

        $scope.maturityModelEdit = {};

        $scope.maturityModelDetails = 'header';

		var originalMaturityModel = {};

		$scope.selectMaturityModel = function(model){
            // Flush any changes to current selected objects
            if($scope.selectedMaturityModel){
                $scope.cancelEditMaturityModel($scope.selectedMaturityModel);
            }
            if($scope.selectedArea){
                $scope.cancelEditArea($scope.selectedArea);
            }
            if($scope.selectedLevel){
                $scope.cancelEditLevel($scope.selectedLevel);
            }
            if($scope.selectedDimension){
                $scope.cancelEditDimension($scope.selectedDimension);
            }
            // Reset the selected objects
            $scope.selectedArea = null;
            $scope.selectedLevel = null;
            $scope.selectedDimension = null;
            // Select the current model
            originalMaturityModel[model._id] = _.cloneDeep(model);
			$scope.selectedMaturityModel = model;
            $scope.maturityModelEdit[model._id] = false;
		};

		$scope.saveEditMaturityModel = function(model) {
            $scope.error = null;
            $scope.isResolving = true;
			MaturityModels.update({
				_id: model._id,
				name: model.name,
				description: model.description
			}, function(res){
                $scope.isResolving = false;
                originalMaturityModel[model._id].name = model.name;
                originalMaturityModel[model._id].description = model.description;
                $scope.maturityModelEdit[model._id] = false;
			},function(err){
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditMaturityModel = function(model){
			$scope.error = null;
			model.name = originalMaturityModel[model._id].name;
			model.description = originalMaturityModel[model._id].description;
            $scope.maturityModelEdit[model._id] = false;
		};


		// Delete

		$scope.deleteMaturityModel = function(model) {
			$scope.error = null;
            $scope.isResolving = true;
			model.$remove(function(res) {
                $scope.isResolving = false;
				$scope.selectedMaturityModel = null;
				$scope.maturityModels = _.without($scope.maturityModels, model);

			}, function(err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};


        // ------------------  AREA ----------------


        // Create

        $scope.createArea = function(model) {

            var newArea = {
                name: 'New maturity area'
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createArea({ maturityModelId: model._id }, newArea,
                function (res) {
                    $scope.isResolving = false;
                    model.areas.push(res);
                    $scope.selectArea(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


        // Edit

        $scope.areaEdit = {};

        var originalArea = {};

        $scope.selectArea = function(area){
            // Flush any changes to current selectedArea
            if($scope.selectedArea){
                $scope.cancelEditArea($scope.selectedArea);
            }
            originalArea[area._id] = _.cloneDeep(area);
            $scope.selectedArea = area;
            $scope.areaEdit[area._id] = false;
        };

        $scope.saveEditArea = function(model, area) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateArea({
                maturityModelId: model._id,
                areaId: area._id
            }, area, function(res){
                $scope.isResolving = false;
                originalArea[area._id].name = area.name;
                originalArea[area._id].description = area.description;
                $scope.areaEdit[area._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditArea = function(area){
            $scope.error = null;
            area.name = originalArea[area._id].name;
            area.description = originalArea[area._id].description;
            $scope.areaEdit[area._id] = false;
        };


        // Delete

        $scope.deleteArea = function(model, area) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteArea({
                maturityModelId: model._id,
                areaId: area._id
            }, area, function(res){
                $scope.isResolving = false;
                $scope.selectedArea = null;
                model.areas = _.without(model.areas, area);
                // Sync dimensions
                if($scope.selectedDimension){
                    $scope.cancelEditDimension($scope.selectedDimension);
                    $scope.selectedDimension = null;
                }
                model.dimensions = _.filter(model.dimensions, function(dimension){
                    return dimension.area !== area._id;
                });
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };



        // ------------------  LEVEL ----------------


        // Create

        $scope.createLevel = function(model) {

            var newLevel = {
                name: 'New maturity level'
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createLevel({ maturityModelId: model._id }, newLevel,
                function (res) {
                    $scope.isResolving = false;
                    model.levels.push(res);
                    $scope.selectLevel(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // Sort

        var originalLevels;

        $scope.dragControlListeners = {
            accept: function (sourceItemHandleScope, destSortableScope) {
               //override to determine drag is allowed or not. default is true.
               return !$scope.isResolving;
            },
            dragStart : function(event){
                originalLevels = _.cloneDeep($scope.selectedMaturityModel.levels);
            },
            orderChanged: function(event) {

                $scope.error = null;
                $scope.isResolving = true;
                
                MaturityModels.sortLevels({ maturityModelId: $scope.selectedMaturityModel._id },
                    event.source.sortableScope.modelValue,
                    function (res) {
                        $scope.isResolving = false;
                    },
                    function (err) {
                        // Put back the original order
                        $scope.selectedMaturityModel.levels = originalLevels;
                        $scope.isResolving = false;
                        $scope.error = err.data.message;
                    }
                );
            }
        };


        // Edit

        $scope.levelEdit = {};

        var originalLevel = {};

        $scope.selectLevel = function(level){
            // Flush any changes to current selectedLevel
            if($scope.selectedLevel){
                $scope.cancelEditLevel($scope.selectedLevel);
            }

            originalLevel[level._id] = _.cloneDeep(level);
            $scope.selectedLevel = level;
            $scope.levelEdit[level._id] = false;
        };
        
        $scope.editLevel = function(level){
            $scope.levelEdit[level._id] = true;
        };

        $scope.saveEditLevel = function(model, level) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateLevel({
                maturityModelId: model._id,
                levelId: level._id
            }, level, function(res){
                $scope.isResolving = false;
                originalLevel[level._id].name = level.name;
                originalLevel[level._id].description = level.description;
                $scope.levelEdit[level._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditLevel = function(level){
            $scope.error = null;
            level.name = originalLevel[level._id].name;
            level.description = originalLevel[level._id].description;
            $scope.levelEdit[level._id] = false;
        };


        // Delete

        $scope.deleteLevel = function(model, level) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteLevel({
                maturityModelId: model._id,
                levelId: level._id
            }, level, function(res){
                $scope.isResolving = false;
                $scope.selectedLevel = null;
                model.levels = _.without(model.levels, level);
                // Sync dimensions
                if($scope.selectedDimension){
                    $scope.cancelEditDimension($scope.selectedDimension);
                    $scope.selectedDimension = null;
                }
                model.dimensions = _.filter(model.dimensions, function(dimension){
                    return dimension.level !== level._id;
                });
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };



        // ------------------  DIMENSIONS ----------------


        // Create

        $scope.showNewDimensionForm = false;

        $scope.newDimensionFormObj = {};

        $scope.saveNewDimension = function(model) {

            var newDimension = {
                level: $scope.newDimensionFormObj[model._id].level._id,
                area: $scope.newDimensionFormObj[model._id].area._id,
                name: $scope.newDimensionFormObj[model._id].name,
                description: $scope.newDimensionFormObj[model._id].description,
                improvementActivities: []
            };

            $scope.error = null;
            $scope.isResolving = true;

            MaturityModels.createDimension({ maturityModelId: model._id }, newDimension,
                function (res) {
                    $scope.isResolving = false;
                    model.dimensions.push(res);
                    // Reset new dimension form
                    //$scope.newDimensionFormObj[model._id].level = null; // So its easier to create multiple new dimensions
                    //$scope.newDimensionFormObj[model._id].area = null;
                    $scope.newDimensionFormObj[model._id].name = null;
                    $scope.newDimensionFormObj[model._id].description = null;
                    // Close form
                    $scope.showNewDimensionForm = false;
                    // Select newly created dimension
                    $scope.selectDimension(res);
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewDimension = function(model){
            // Reset new dimension form
            if($scope.newDimensionFormObj[model._id]){
                $scope.newDimensionFormObj[model._id].level = null;
                $scope.newDimensionFormObj[model._id].area = null;
                $scope.newDimensionFormObj[model._id].name = null;
                $scope.newDimensionFormObj[model._id].description = null;
            }
            // Close form
            $scope.showNewDimensionForm = false;
        };


        // Edit

        $scope.dimensionEdit = {};

        var originalDimension = {};

        $scope.selectDimension = function(dimension){
            // Flush any changes to current selectedDimension
            if($scope.selectedDimension){
                $scope.cancelEditDimension($scope.selectedDimension);
            }
            originalDimension[dimension._id] = _.cloneDeep(dimension);
            $scope.selectedDimension = dimension;
            $scope.dimensionEdit[dimension._id] = false;
        };

        $scope.saveEditDimension = function(model, dimension) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.updateDimension({
                maturityModelId: model._id,
                dimensionId: dimension._id
            }, dimension, function(res){
                $scope.isResolving = false;
                originalDimension[dimension._id].name = dimension.name;
                originalDimension[dimension._id].description = dimension.description;
                $scope.dimensionEdit[dimension._id] = false;
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditDimension = function(dimension){
            $scope.error = null;
            dimension.name = originalDimension[dimension._id].name;
            dimension.description = originalDimension[dimension._id].description;
            $scope.dimensionEdit[dimension._id] = false;
        };


        // Delete

        $scope.deleteDimension = function(model, dimension) {
            $scope.error = null;
            $scope.isResolving = true;
            MaturityModels.deleteDimension({
                maturityModelId: model._id,
                dimensionId: dimension._id
            }, dimension, function(res){
                $scope.isResolving = false;
                $scope.selectedDimension = null;
                model.dimensions = _.without(model.dimensions, dimension);
            },function(err){
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };



    }
]);

'use strict';

//Maturity models service used to communicate Maturity models REST endpoints
angular.module('maturity-setup').factory('MaturityModels', ['$resource',
	function($resource) {
		return $resource('maturity-models/:maturityModelId', { maturityModelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            // ----- Levels -----
            createLevel: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createLevel'
            },
            sortLevels: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/sortLevels'
            },
            updateLevel: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateLevel/:levelId'
            },
            deleteLevel: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteLevel/:levelId'
            },

            // ----- Areas -----
            createArea: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createArea'
            },
            updateArea: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateArea/:areaId'
            },
            deleteArea: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteArea/:areaId'
            },

            // ----- Dimensions -----
            createDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createDimension'
            },
            updateDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateDimension/:dimensionId'
            },
            deleteDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteDimension/:dimensionId'
            },

            // ----- Maturity Review -----
            updateMaturityReview: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateMaturityReview/:dimensionId'
            },

            // ----- Activities -----
            createActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createActivity/:dimensionId'
            },
            updateActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateActivity/:dimensionId/:activityId'
            },
            deleteActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteActivity/:dimensionId/:activityId'
            }

		});
	}
]);

'use strict';

// Mytao module config
angular.module('mytao').run(['Menus',
	function(Menus) {
		//Menus.addMenuItem('topbar', 'My taoApp', 'mytao', 'item');
		//Code line above has been moved to public/core/services/menus.client.service.js as top level item
	}
]);

'use strict';

//Setting up route
angular.module('mytao').config(['$stateProvider',
	function($stateProvider) {
		// Mytao state routing
		$stateProvider.
		state('mytao', {
			url: '/mytao',
			templateUrl: 'modules/mytao/views/mytao.client.view.html'
		});
	}
]);
'use strict';

angular.module('mytao').controller('MytaoController', ['$scope','$rootScope', '$location', 'Authentication','$q','_','$timeout','Mytao',
	function($scope, $rootScope, $location, Authentication, $q, _, $timeout, Mytao) {

		$rootScope.staticMenu = false;
        
        var vm = this;
        
        
        
        vm.seed = function () {
            Mytao.seed(function(res){
                vm.seedRes = res;
            }, function(err){
                vm.seedErr = err.data.message;
            });  
        };



        

        


        // ----------- INIT ---------------

        vm.init = function(){
            vm.user = Authentication.user;
            if(!vm.user){
                $location.path('/signin');
                $rootScope.staticMenu = true;
            }
        };
        
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

'use strict';

angular.module('mytao').factory('Mytao', ['$resource',
	function($resource) {
        return $resource('mytao', {
        }, {
            userProjects: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-projects'
            },
            userPortfolios: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-portfolios'
            },
            userProjectReviews: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-project-reviews'
            },
            userPortfolioReviews: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-portfolio-reviews'
            },
            userImprovementActivities: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-improvement-activities'
            },
            userProjectChangeRequests: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-project-change-requests'
            },
            userProjectStatusUpdates: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-project-status-updates'
            },
            userPortfolioChangeRequests: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-portfolio-change-requests'
            },
            userGateReviews: {
                method: 'GET',
                isArray: true,
                url: 'mytao/user-gate-reviews'
            },


            seed: {
                method: 'POST',
                isArray: true,
                url: 'mytao/seed'
            }
            
            
        });
	}
]);

'use strict';

//Setting up route
angular.module('people-portfolio-analysis').config(['$stateProvider',
	function($stateProvider) {
		// People portfolio analysis state routing
		$stateProvider.
		state('people-portfolio-analysis', {
			url: '/people-portfolio-analysis',
			templateUrl: 'modules/people-portfolio-analysis/views/people-portfolio-analysis.client.view.html'
		});
	}
]);
'use strict';

angular.module('people-portfolio-analysis').controller('PeoplePortfolioAnalysisController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','PeoplePortfolioGroups', 'PeopleCategories','PeopleCategoryValues', 'People', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios,
			 PeoplePortfolioGroups, PeopleCategories, PeopleCategoryValues, People, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeoplePortfolioGroups.query(function(groups){
				$scope.groups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleCategories.query(function(categories){
				$scope.categories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleCategoryValues.query(function(categoryValues){
				$scope.categoryValues = categoryValues;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			People.query(function(people){
				$scope.people = people;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			$scope.showRoleAssignment = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, portfolio){

            // Guard against undefined at view startup
            if(action && userData && portfolio){

                var userIsSuperhero, userIsPortfolioManager, userIsBackupPortfolioManager;

                if(action === 'edit'){

                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });

                    if(portfolio.portfolioManager){
                        userIsPortfolioManager = userData._id === portfolio.portfolioManager._id;
                    }

                    if(portfolio.backupPortfolioManager){
                        userIsBackupPortfolioManager = userData._id === portfolio.backupPortfolioManager._id;
                    }

                    return userIsSuperhero || userIsPortfolioManager || userIsBackupPortfolioManager;
                }
            }
        };


        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };



        // ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioForm = {};

		$scope.selectPortfolioForm = function(string){
			if(string === 'default'){ $scope.switchPortfolioForm = 'default';}
			if(string === 'new'){$scope.switchPortfolioForm = 'new';}
			if(string === 'view'){ $scope.switchPortfolioForm = 'view';}
			if(string === 'edit'){$scope.switchPortfolioForm = 'edit';}
		};

		$scope.switchRoleForm = {};

		$scope.selectRoleForm = function(assignedRole, string){
			if(string === 'view'){$scope.switchRoleForm[assignedRole._id] = 'view';}
			if(string === 'edit'){$scope.switchRoleForm[assignedRole._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalRoleAssignment;
		$scope.selectPortfolio = function(portfolio){
			originalRoleAssignment = {};
			// Get the full portfolio fat object from the "portfolioById" server function that populates everything
			Portfolios.get({
				portfolioId:portfolio._id,
				retPropertiesString : 'user created name parent ancestors type portfolioManager backupPortfolioManager stakeholders',
				deepPopulateArray : [
					'parent','type','portfolioManager','backupPortfolioManager',
                    'stakeholders.group','stakeholders.roles.categorization.category.categoryValues'
				]
			}, function(res){
				$scope.selectedPortfolio = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewPortfolio = function(){
			$scope.selectedPortfolio = null;
			originalRoleAssignment = null;
		};


        // ------------- CREATE ROLE ASSIGNMENT ---------

        $scope.createAssignedRole = function(portfolio, assignedGroup){

            Portfolios.createAssignedRole({
                portfolioId: portfolio._id,
                assignedGroupId: assignedGroup._id
            },{}, function(res){
                assignedGroup.roles.push(res);
            }, function(err){
                $scope.error = err.data.message;
            });
        };
        

		// ------------- SELECT ROLE ASSIGNMENT ---------

		$scope.selectRoleAssignment = function(assignedRole){
			originalRoleAssignment[assignedRole._id] = _.cloneDeep(assignedRole);
			$scope.selectRoleForm(assignedRole, 'edit');
		};


		// ------------- EDIT ROLE ASSIGNMENT ---------

		$scope.saveEditAssignedRole = function(portfolio, assignedGroup, assignedRole){
			// Clean deepPopulate
			var copyAssignedRole = _.cloneDeep(assignedRole);
			copyAssignedRole.role = copyAssignedRole.role._id;
			copyAssignedRole.categorization = _.map(copyAssignedRole.categorization, function(assignedCategory){
				assignedCategory.category = allowNull(assignedCategory.category);
				return assignedCategory;
			});
			// url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/:assignedRoleId'
			Portfolios.updateAssignedRole(
				{
					portfolioId: portfolio._id,
					assignedGroupId: assignedGroup._id,
					assignedRoleId: assignedRole._id
				},copyAssignedRole, function(res){
					$scope.selectRoleForm(assignedRole, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedRole = function(assignedRole){
            assignedRole.role = originalRoleAssignment[assignedRole._id].role;
			assignedRole.person = originalRoleAssignment[assignedRole._id].person;
			assignedRole.categorization = originalRoleAssignment[assignedRole._id].categorization;
			$scope.selectRoleForm(assignedRole, 'view');
		};


        // ------------- DELETE ROLE ASSIGNMENT ---------

        $scope.deleteAssignedRole = function(portfolio, assignedGroup, assignedRole){

            Portfolios.deleteAssignedRole({
                portfolioId: portfolio._id,
                assignedGroupId: assignedGroup._id,
                assignedRoleId: assignedRole._id
            }, assignedRole, function(res){
                assignedGroup.roles = _.without(assignedGroup.roles, assignedRole);
            }, function(err){
                $scope.error = err.data.message;
            });
        };

	}
]);

'use strict';

//Setting up route
angular.module('people-project-analysis').config(['$stateProvider',
	function($stateProvider) {
		// People project analysis state routing
		$stateProvider.
		state('people-project-analysis', {
			url: '/people-project-analysis',
			templateUrl: 'modules/people-project-analysis/views/people-project-analysis.client.view.html'
		});
	}
]);
'use strict';

angular.module('people-project-analysis').controller('PeopleProjectAnalysisController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'Projects','PeopleProjectGroups', 'PeopleCategories','PeopleCategoryValues', 'People', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects,
			 PeopleProjectGroups, PeopleCategories, PeopleCategoryValues, People, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleProjectGroups.query(function(groups){
				$scope.groups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleCategories.query(function(categories){
				$scope.categories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PeopleCategoryValues.query(function(categoryValues){
				$scope.categoryValues = categoryValues;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            People.query(function(people){
                $scope.people = people;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			$scope.showRoleAssignment = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchRoleForm = {};

		$scope.selectRoleForm = function(assignedRole, string){
			if(string === 'view'){$scope.switchRoleForm[assignedRole._id] = 'view';}
			if(string === 'edit'){$scope.switchRoleForm[assignedRole._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

		var originalRoleAssignment;
		$scope.selectProject = function(project){
			originalRoleAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio stakeholders',
				deepPopulateArray : [
					'portfolio',
					'stakeholders.group','stakeholders.roles.categorization.category.categoryValues'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalRoleAssignment = null;
		};


        // ------------- CREATE ROLE ASSIGNMENT ---------

        $scope.createAssignedRole = function(project, assignedGroup){

            Projects.createAssignedRole({
                projectId: project._id,
                assignedGroupId: assignedGroup._id
            },{}, function(res){
                assignedGroup.roles.push(res);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // ------------- SELECT ROLE ASSIGNMENT ---------

		$scope.selectRoleAssignment = function(assignedRole){
			originalRoleAssignment[assignedRole._id] = _.cloneDeep(assignedRole);
			$scope.selectRoleForm(assignedRole, 'edit');
		};


		// ------------- EDIT ROLE ASSIGNMENT ---------

		$scope.saveEditAssignedRole = function(project, assignedGroup, assignedRole){
            // Clean deepPopulate
            var copyAssignedRole = _.cloneDeep(assignedRole);
            copyAssignedRole.role = copyAssignedRole.role._id;
            copyAssignedRole.categorization = _.map(copyAssignedRole.categorization, function(assignedCategory){
                assignedCategory.category = allowNull(assignedCategory.category);
                return assignedCategory;
            });
			Projects.updateAssignedRole(
				{
					projectId: project._id,
					assignedGroupId: assignedGroup._id,
					assignedRoleId: assignedRole._id
				},copyAssignedRole, function(res){
					$scope.selectRoleForm(assignedRole, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedRole = function(assignedRole){
            assignedRole.role = originalRoleAssignment[assignedRole._id].role;
			assignedRole.person = originalRoleAssignment[assignedRole._id].person;
            assignedRole.categorization = originalRoleAssignment[assignedRole._id].categorization;
			$scope.selectRoleForm(assignedRole, 'view');
		};


        // ------------- DELETE ROLE ASSIGNMENT ---------

        $scope.deleteAssignedRole = function(project, assignedGroup, assignedRole){

            Projects.deleteAssignedRole({
                projectId: project._id,
                assignedGroupId: assignedGroup._id,
                assignedRoleId: assignedRole._id
            }, assignedRole, function(res){
                assignedGroup.roles = _.without(assignedGroup.roles, assignedRole);
            }, function(err){
                $scope.error = err.data.message;
            });
        };

	}
]);

'use strict';

//Setting up route
angular.module('people-setup').config(['$stateProvider',
	function($stateProvider) {
		// People setup state routing
		$stateProvider.
		state('people-setup', {
			url: '/people-setup',
			templateUrl: 'modules/people-setup/views/people-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('people-setup').controller('PeopleSetupController', ['$rootScope', '$scope', '$stateParams', '$location',
	'Authentication','People', 'PeoplePortfolioGroups', 'PeopleProjectGroups',
    'PeopleCategories', 'PeopleCategoryValues', '$q','_',
	function($rootScope, $scope, $stateParams, $location, Authentication, People, PeoplePortfolioGroups, PeopleProjectGroups,
             PeopleCategories, PeopleCategoryValues, $q, _) {


        $rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

            PeoplePortfolioGroups.query(function(portfolioGroups){
                $scope.peoplePortfolioGroups = portfolioGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            PeopleProjectGroups.query(function(projectGroups){
                $scope.peopleProjectGroups = projectGroups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            People.query(function(people){
                $scope.people = people;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            PeopleCategories.query(function(peopleCategories){
                $scope.peopleCategories = peopleCategories;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
            PeopleCategoryValues.query(function(peopleCategoryValues){
                $scope.peopleCategoryValues = peopleCategoryValues;
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


// ------------------------------------------------------  PEOPLE ---------------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.selectPersonForm = function(string){
			if(string === 'view'){$scope.switchPersonForm = 'view';}
			if(string === 'edit'){$scope.switchPersonForm = 'edit';}
		};

		// ------------------- LIST OF PEOPLE -----------------

		$scope.findPeople = function() {
            $scope.initError = [];
            People.query(function(people){
				$scope.people = people;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

        var originalPerson = {};
		$scope.selectPerson = function(person){
            $scope.error = null;
            $scope.selectPersonForm('view');
            $scope.person = person;
            originalPerson = _.clone(person);
		};

		$scope.updatePerson = function(person) {
            $scope.error = null;
			person.$update(function(response) {
				$scope.findPeople();
				$scope.selectPersonForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPerson = function(person){
			person.name = originalPerson.name;
            person.organization = originalPerson.organization;
            person.title = originalPerson.title;
            person.email = originalPerson.email;
            person.phone = originalPerson.phone;
			$scope.selectPersonForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removePerson = function(person) {
			person.$remove(function(response) {
                $scope.people = _.without($scope.people, person);
                $scope.person = null;
                $scope.selectPersonForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createPerson = function() {
			var person = new People ({
				name: 'New person',
                organization: '',
				title: '',
				email: '',
				phone: ''
			});
			person.$save(function(response) {
				$scope.people.push(response);
                $scope.selectPerson(response);
                $scope.selectPersonForm('edit');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};






// ------------------------------------------------------ PROJECT GROUPS --------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectGroupForm = {};

		$scope.selectProjectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchProjectGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchProjectGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchProjectGroupForm[group._id] = 'edit';}
		};

		// ----------------- REFRESH GROUP LIST ------------

		$scope.projectGroupList = function(){
            $scope.initError = [];
            PeopleProjectGroups.query(function(groups){
				$scope.peopleProjectGroups = groups;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE GROUP ----------------

		$scope.createProjectGroup = function() {
			$scope.error = null;

			var peopleProjectGroup = new PeopleProjectGroups ({
				name: 'New project stakeholder group',
				description: ''
			});

			peopleProjectGroup.$save(function(response) {
				$scope.projectGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditProjectGroup = {};

		$scope.selectProjectGroup = function(group){
			originalEditProjectGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectProjectGroupForm(group, 'edit');
		};

		$scope.updateProjectGroup = function(group) {
			group.$update(function(response) {
				$scope.selectProjectGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditProjectGroup = function(group){
			$scope.error = null;
			group.name = originalEditProjectGroup[group._id].name;
			group.description = originalEditProjectGroup[group._id].description;
			$scope.selectProjectGroupForm(group, 'view');
		};

		// ------------------- REMOVE GROUP -----------------

		$scope.removeProjectGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.projectGroupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};






// ------------------------------------------------------ PORTFOLIO GROUPS --------------------------------------






        // ------------------- NG-SWITCH ---------------------

        $scope.switchPortfolioGroupForm = {};

        $scope.selectPortfolioGroupForm = function(group, string){
            if(string === 'view'){ $scope.switchPortfolioGroupForm[group._id] = 'view';}
            if(string === 'new'){$scope.switchPortfolioGroupForm[group._id] = 'new';}
            if(string === 'edit'){$scope.switchPortfolioGroupForm[group._id] = 'edit';}
        };

        // ----------------- REFRESH GROUP LIST ------------

        $scope.portfolioGroupList = function(){
            $scope.initError = [];
            PeoplePortfolioGroups.query(function(groups){
                $scope.peoplePortfolioGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------ CREATE GROUP ----------------

        $scope.createPortfolioGroup = function() {
            $scope.error = null;

            var peoplePortfolioGroup = new PeoplePortfolioGroups ({
                name: 'New portfolio stakeholder group',
                description: ''
            });

            peoplePortfolioGroup.$save(function(response) {
                $scope.portfolioGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT GROUP -----------------

        var originalEditPortfolioGroup = {};

        $scope.selectPortfolioGroup = function(group){
            originalEditPortfolioGroup[group._id] = _.clone(group);
            $scope.error = null;
            $scope.selectPortfolioGroupForm(group, 'edit');
        };

        $scope.updatePortfolioGroup = function(group) {
            group.$update(function(response) {
                $scope.selectPortfolioGroupForm(group, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditPortfolioGroup = function(group){
            $scope.error = null;
            group.name = originalEditPortfolioGroup[group._id].name;
            group.description = originalEditPortfolioGroup[group._id].description;
            $scope.selectPortfolioGroupForm(group, 'view');
        };

        // ------------------- REMOVE GROUP -----------------

        $scope.removePortfolioGroup = function(group) {
            $scope.error = null;
            group.$remove(function(response) {
                $scope.portfolioGroupList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



// ------------------------------------------------------ STAKEHOLDER CATEGORIES --------------------------------------




        // ------------------- NG-SWITCH ---------------------

        $scope.switchCategoryForm = {};

        $scope.selectCategoryForm = function(category, string){
            if(string === 'view'){ $scope.switchCategoryForm[category._id] = 'view';}
            if(string === 'new'){$scope.switchCategoryForm[category._id] = 'new';}
            if(string === 'edit'){$scope.switchCategoryForm[category._id] = 'edit';}
        };

        $scope.switchCategoryValueForm = {};

        $scope.selectCategoryValueForm = function(categoryValue, string){
            if(string === 'view'){ $scope.switchCategoryValueForm[categoryValue._id] = 'view';}
            if(string === 'edit'){$scope.switchCategoryValueForm[categoryValue._id] = 'edit';}
        };


        // ------------------ CREATE CATEGORY ----------------

        $scope.createCategory = function() {
            $scope.error = null;

            var category = new PeopleCategories ({
                name: 'New stakeholder category',
                categoryValues: []
            });

            category.$save(function(res) {
                $scope.peopleCategories.push(res);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT CATEGORY (HEADER ONLY) -----------------

        var originalEditCategory = {};

        $scope.selectCategory = function(category){
            originalEditCategory[category._id] = _.clone(category);
            $scope.error = null;
            $scope.selectCategoryForm(category, 'edit');
        };

        $scope.updateCategory = function(category) {
            PeopleCategories.update({
                _id: category._id,
                name: category.name,
                description: category.description
            }, function(category){
                $scope.selectCategoryForm(category, 'view');
            },function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCategory = function(category){
            $scope.error = null;
            category.name = originalEditCategory[category._id].name;
            category.description = originalEditCategory[category._id].description;
            $scope.selectCategoryForm(category, 'view');
        };


        // ------------------- REMOVE CATEGORY -----------------

        $scope.removeCategory = function(category) {
            $scope.error = null;

            PeopleCategories.remove({},category, function(res){
                $scope.peopleCategories = _.without($scope.peopleCategories, category);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // ------------------ CREATE CATEGORY VALUE ----------------

        $scope.createCategoryValue = function(category) {
            $scope.error = null;

            var categoryValue = new PeopleCategoryValues ({
                name: 'New stakeholder category value'
            });

            categoryValue.$save({categoryId: category._id}, function(res) {
                // Add new cat value to the view category
                category.categoryValues.push(res);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT CATEGORY VALUE -----------------

        var originalEditCategoryValue = {};

        $scope.selectEditCategoryValue = function(category, categoryValue){
            originalEditCategoryValue[categoryValue._id] = _.clone(categoryValue);
            $scope.selectCategoryValueForm(categoryValue, 'edit');
        };

        $scope.updateCategoryValue = function(category, categoryValue) {
            PeopleCategoryValues.update(categoryValue, function(response) {
                $scope.selectCategoryValueForm(categoryValue, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditCategoryValue = function(categoryValue){
            $scope.error = null;
            categoryValue.name = originalEditCategoryValue[categoryValue._id].name;
            categoryValue.description = originalEditCategoryValue[categoryValue._id].description;
            $scope.selectCategoryValueForm(categoryValue, 'view');
        };

        // ------------------- REMOVE CATEGORY VALUE -----------------

        $scope.removeCategoryValue = function(category, categoryValue) {
            $scope.error = null;
            PeopleCategoryValues.remove({categoryId: category._id}, categoryValue, function(res){
                category.categoryValues = _.without(category.categoryValues, categoryValue);
            }, function(err){
                $scope.error = err.data.message;
            });
        };



	}
]);

'use strict';

//People categories service used to communicate People categories REST endpoints
angular.module('people-setup').factory('PeopleCategories', ['$resource',
	function($resource) {
		return $resource('people-categories/:peopleCategoryId', { peopleCategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//People category values service used to communicate People category values REST endpoints
angular.module('people-setup').factory('PeopleCategoryValues', ['$resource',
	function($resource) {
		return $resource('people-category-values/:peopleCategoryValueId', { peopleCategoryValueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//People portfolio groups service used to communicate People portfolio groups REST endpoints
angular.module('people-setup').factory('PeoplePortfolioGroups', ['$resource',
	function($resource) {
		return $resource('people-portfolio-groups/:peoplePortfolioGroupId', { peoplePortfolioGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//People project groups service used to communicate People project groups REST endpoints
angular.module('people-setup').factory('PeopleProjectGroups', ['$resource',
	function($resource) {
		return $resource('people-project-groups/:peopleProjectGroupId', { peopleProjectGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//People service used to communicate People REST endpoints
angular.module('people-setup').factory('People', ['$resource',
	function($resource) {
		return $resource('people/:personId', { personId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio assignment state routing
		$stateProvider.
		state('portfolio-assignment', {
			url: '/portfolio-assignment',
			templateUrl: 'modules/portfolio-assignment/views/portfolio-assignment.client.view.html'
		});
	}
]);
'use strict';

angular.module('portfolio-assignment').controller('PortfolioAssignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios, Projects, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

			$q.all([
				Portfolios.query().$promise,
				Projects.query({'selection.active': true}).$promise
			]).then(function(data) {
				var portfolios = data[0];
				var projects = data[1];

				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
				$scope.projects = projects;

				$scope.selectedAssignments = {};
				$scope.selectedAssignments.assignedProjects = {};
				$scope.selectedAssignments.unassignedProjects = [];
				createProjectAssignments(projects, portfolios, $scope.selectedAssignments);
			});

		};

		var createProjectAssignments = function(projects, portfolios, selectedAssignments){
			_.forEach(portfolios, function(node){
				selectedAssignments.assignedProjects[node._id] = [];
			});
			_.map(projects, function(project){
				if(_.isNull(project.portfolio) || _.isUndefined(project.portfolio)){
					selectedAssignments.unassignedProjects.push(project);
				} else {
					_.forEach(portfolios, function(node){
						if(project.portfolio._id === node._id){selectedAssignments.assignedProjects[node._id].push(project);}
					});
				}
			});
		};



		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			$scope.userHasAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo' || role === 'portfolioManager';
			});
		});


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};



		// ------------------- PROJECTS FOR NODE ------------

		$scope.selectNode = function(node){
            $scope.error = null;
			$scope.selectedNode = node;
		};

        $scope.getTotalEarmarkedFunds = function(projects){
            return _.reduce(projects, function(sum, project){
                return sum + project.identification.earmarkedFunds;
            },0);
        };

		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListenersAssigned = {
			itemMoved: function (eventObj) {
                var movedProjectFromAssigned = eventObj.source.itemScope.project;
                var originalPortfolio = movedProjectFromAssigned.portfolio;
                movedProjectFromAssigned.portfolio = null;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updatePortfolioAssignment(movedProjectFromAssigned,
                    function(res){
                        $scope.isResolving = false;
                    },
                    function(err){
                        $scope.isResolving = false;
                        $scope.error = err.data.message;
                        // put back project in case of failure
                         movedProjectFromAssigned.portfolio = originalPortfolio;
                        eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                        eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromAssigned);
                    }
                );
			}
		};

        $scope.dragControlListenersUnassigned = {
            itemMoved: function (eventObj) {
                var movedProjectFromUnassigned = eventObj.source.itemScope.project;
                movedProjectFromUnassigned.portfolio = $scope.selectedNode;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updatePortfolioAssignment(movedProjectFromUnassigned,
                    function(res){
                        $scope.isResolving = false;
                    },
                    function(err){
                        $scope.isResolving = false;
                        $scope.error = err.data.message;
                        // put back project in case of failure
                        movedProjectFromUnassigned.portfolio = null;
                        eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                        eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromUnassigned);
                    }
                );
            }
        };


	}
]);

'use strict';

// Configuring the Articles module
angular.module('portfolio-change-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Portfolio change requests', 'portfolio-change-requests', 'dropdown', '/portfolio-change-requests(/create)?');
		//Menus.addSubMenuItem('topbar', 'portfolio-change-requests', 'List Portfolio change requests', 'portfolio-change-requests');
		//Menus.addSubMenuItem('topbar', 'portfolio-change-requests', 'New Portfolio change request', 'portfolio-change-requests/create');
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-change-requests').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio change requests state routing
		$stateProvider.
		state('PortfolioChangeRequests', {
			url: '/portfolio-change-requests',
			templateUrl: 'modules/portfolio-change-requests/views/portfolio-change-requests.client.view.html'
		})
        .state('portfolio-change-requests-id', {
            url: '/portfolio-change-requests/:portfolioChangeRequestId/portfolios/:portfolioId',
            templateUrl: 'modules/portfolio-change-requests/views/portfolio-change-requests.client.view.html'
        });
	}
]);

'use strict';

angular.module('portfolio-change-requests').controller('PortfolioChangeRequestsController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'PortfolioTypes', 'Projects', 'PortfolioChangeRequests', 'GateProcessTemplates', 'LogReasons', 'ChangeRequestStates', 'LogPriorities', 'LogStatusIndicators',
	'People', '$modal', '$log',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, PortfolioTypes, Projects, PortfolioChangeRequests, GateProcessTemplates, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators, People, $modal, $log) {

        $rootScope.staticMenu = false;

		var vm = this;

		vm.isResolving = false;

		// ------------- INIT -------------

		vm.initError = [];

		vm.init = function(){

            vm.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(res){
				vm.projects = res;
			}, function(err){
				vm.initError.push(err.data.message);
			});

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            PortfolioTypes.query(function(res){
                vm.portfolioTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

			GateProcessTemplates.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogReasons.query(function(logReasons){
				vm.logReasons = logReasons;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			ChangeRequestStates.query(function(changeRequestStates){
				vm.changeRequestStates = changeRequestStates;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogPriorities.query(function(logPriorities){
				vm.logPriorities = logPriorities;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				vm.logStatuses = logStatusIndicators;
			}, function(err){
				vm.initError.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, portfolio){

            var userIsSuperhero, userIsPortfolioManager;

            if((action === 'edit') && user && portfolio){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = (user._id === portfolio.portfolioManager) || (user._id === portfolio.backupPortfolioManager);


                return userIsSuperhero || userIsPortfolioManager;
            }

            if((action === 'approve') && user && portfolio){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                return userIsSuperhero;
            }
        };

		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};


		// ------------------- NG-SWITCH ---------------------


		vm.switchHeaderForm = {};
		vm.selectHeaderForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ vm.switchHeaderForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){vm.switchHeaderForm[portfolioChangeRequest._id] = 'edit';}
		};

		vm.switchAssociatedProjectChangeRequestForm = {};
		vm.selectAssociatedProjectChangeRequestForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ vm.switchAssociatedProjectChangeRequestForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){vm.switchAssociatedProjectChangeRequestForm[portfolioChangeRequest._id] = 'edit';}
		};

		vm.switchRequestedFundsForm = {};
		vm.selectRequestedFundsForm = function(string, portfolioChangeRequest){
			if(string === 'view'){ vm.switchRequestedFundsForm[portfolioChangeRequest._id] = 'view';}
			if(string === 'edit'){vm.switchRequestedFundsForm[portfolioChangeRequest._id] = 'edit';}
		};



		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		vm.sortPortfolioChangeRequests = function(portfolioChangeRequest) {
			return new Date(portfolioChangeRequest.raisedOnDate);
		};

		vm.sortByCreated = function(object){
			return new Date(object.created);
		};

        vm.calculateTotalCRBudget = function(){
            if(vm.selectedPortfolioChangeRequest){
                return _.reduce(vm.selectedPortfolioChangeRequest.associatedProjectChangeRequests, function(sum, request){
                    return sum + request.budgetReview.budgetChange;
                }, 0);
            } else {
                return 0;
            }
        };

        vm.calculateTotalRequests = function(){
            if(vm.selectedPortfolioChangeRequest){
                return _.reduce(vm.selectedPortfolioChangeRequest.fundingRequests, function(sum, request){
                    return sum + request.funds;
                }, 0);
            } else {
                return 0;
            }
        };


		// ------------------- OTHER VARIABLES ---------------------

		vm.portfolioChangeRequestDetails = 'header';
        
        vm.associatedChangeRequestDetails = 'associated';

		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalPortfolioChangeRequest = {};

		vm.selectPortfolio = function(portfolio) {

            vm.cancelNewPortfolioChangeRequest();

			vm.selectedPortfolio = null;
			vm.portfolioChangeRequests = null;

			vm.selectedPortfolioChangeRequest = null;
			originalPortfolioChangeRequest = {};

			vm.selectedPortfolio = portfolio;

            vm.error = null;
            vm.isResolving = true;
			PortfolioChangeRequests.query({
				portfolio: portfolio._id
			}, function (res) {
                vm.isResolving = false;
				vm.portfolioChangeRequests = res;
			}, function (err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelViewPortfolio = function(){
			vm.error = null;
			vm.selectedPortfolio = null;
			vm.portfolioChangeRequests = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------

        vm.showNewPortfolioChangeRequestForm = false;

		vm.openNewPortfolioCRRaisedOnDate = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			vm.newPortfolioCRRaisedOnDateOpened = true;
		};

		vm.newPortfolioChangeRequest = {};

		vm.createNewPortfolioChangeRequest = function(portfolio){
			var newPortfolioChangeRequest = new PortfolioChangeRequests({
				portfolio: portfolio._id,
				raisedOnDate : vm.newPortfolioChangeRequest.raisedOnDate,
				title : vm.newPortfolioChangeRequest.title
			});
            vm.error = null;
            vm.isResolving = true;
			newPortfolioChangeRequest.$save(function(res) {
                vm.isResolving = false;
                vm.showNewPortfolioChangeRequestForm = false;
				// Clear new form
				vm.newPortfolioChangeRequest = {};
				// Refresh the list of change requests
                vm.portfolioChangeRequests.push(res);
				// Select in view mode the new review
				vm.selectPortfolioChangeRequest(portfolio, res);
				// Close new review form
                vm.showNewPortfolioChangeRequestForm = false;
			}, function(err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelNewPortfolioChangeRequest = function(){
            vm.error = null;
			vm.newPortfolioChangeRequest = {};
            vm.showNewPortfolioChangeRequestForm = false;
		};


		// ------------- SELECT CHANGE REQUEST ------------

		var portfolioChangeRequestFromList = {};
		// Required to update the list when changes details
		// in the details pane that are also reported in the list of change requests

		vm.selectPortfolioChangeRequest = function(portfolio, portfolioChangeRequest){
            vm.error = null;
            vm.isResolving = true;
			$q.all([
                PortfolioChangeRequests.get({
                        portfolioChangeRequestId:portfolioChangeRequest._id }).$promise,
                PortfolioChangeRequests.getAvailableProjectChangeRequests(
                    { portfolioId : portfolio._id, portfolioChangeRequestId: portfolioChangeRequest._id }).$promise,
                Projects.query(
                    { portfolio : portfolio._id, 'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true }).$promise
            ]).then(function(data) {
                vm.isResolving = false;
                portfolioChangeRequestFromList[portfolioChangeRequest._id] = portfolioChangeRequest;
                originalPortfolioChangeRequest[portfolioChangeRequest._id] = _.cloneDeep(data[0]);
                vm.selectedPortfolioChangeRequest = data[0];
                vm.availableProjectChangeRequests = data[1];
                vm.availableProjects = data[2];
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });

		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

		vm.headerDateOpened = {};
		vm.openHeaderDate = function(portfolioChangeRequest, $event){
			$event.preventDefault();
			$event.stopPropagation();
			vm.headerDateOpened[portfolioChangeRequest._id] = true;
		};

		vm.editHeader = function(portfolioChangeRequest){
			vm.selectHeaderForm('edit', portfolioChangeRequest);
		};

		vm.saveEditHeader = function(portfolioChangeRequest){
			// Clean-up deepPopulate
			var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
			copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
			// Update server header
            vm.error = null;
            vm.isResolving = true;
			PortfolioChangeRequests.updateHeader(
				{
					portfolioChangeRequestId : copyPortfolioChangeRequest._id
				}, copyPortfolioChangeRequest,
				function(res){
                    vm.isResolving = false;
					// Update details pane view with new saved details
					originalPortfolioChangeRequest[portfolioChangeRequest._id].raisedOnDate = portfolioChangeRequest.raisedOnDate;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].title = portfolioChangeRequest.title;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].description = portfolioChangeRequest.description;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].state = portfolioChangeRequest.state;
					originalPortfolioChangeRequest[portfolioChangeRequest._id].priority = portfolioChangeRequest.priority;
					// Update list of reviews with new date / title
					portfolioChangeRequestFromList[portfolioChangeRequest._id].raisedOnDate = portfolioChangeRequest.raisedOnDate;
					portfolioChangeRequestFromList[portfolioChangeRequest._id].title = portfolioChangeRequest.title;
					// Close edit header form and back to view
					vm.selectHeaderForm('view', portfolioChangeRequest);
				},
				function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
			);
		};

		vm.cancelEditHeader = function(portfolioChangeRequest){
            vm.error = null;
			portfolioChangeRequest.raisedOnDate = originalPortfolioChangeRequest[portfolioChangeRequest._id].raisedOnDate;
			portfolioChangeRequest.title = originalPortfolioChangeRequest[portfolioChangeRequest._id].title;
			portfolioChangeRequest.description = originalPortfolioChangeRequest[portfolioChangeRequest._id].description;
			portfolioChangeRequest.state = originalPortfolioChangeRequest[portfolioChangeRequest._id].state;
			portfolioChangeRequest.priority = originalPortfolioChangeRequest[portfolioChangeRequest._id].priority;
			vm.selectHeaderForm('view', portfolioChangeRequest);
		};


		vm.deletePortfolioChangeRequest = function(portfolioChangeRequest){
            vm.error = null;
            vm.isResolving = true;
			PortfolioChangeRequests.remove(
                {portfolioChangeRequestId: portfolioChangeRequest._id},
                portfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    vm.portfolioChangeRequests = _.without(vm.portfolioChangeRequests, _.find(vm.portfolioChangeRequests, _.matchesProperty('_id',portfolioChangeRequest._id)));
                    vm.cancelNewPortfolioChangeRequest();
                    vm.selectedPortfolioChangeRequest = null;
                    originalPortfolioChangeRequest = {};
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
		};


		// ---------------------------------------------------------- APPROVAL -----------------------------------------------------------

        vm.submit = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.submit(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        vm.approve = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.approve(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    portfolioChangeRequestFromList[portfolioChangeRequest._id].approval = res.approval;
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        vm.reject = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.reject(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    portfolioChangeRequestFromList[portfolioChangeRequest._id].approval = res.approval;
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        vm.draft = function(portfolio, portfolioChangeRequest){
            // Clean-up deepPopulate
            var copyPortfolioChangeRequest = _.cloneDeep(portfolioChangeRequest);
            copyPortfolioChangeRequest.portfolio = _.get(copyPortfolioChangeRequest.portfolio, '_id');
            // Run server side approve
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.draft(
                {
                    portfolioChangeRequestId : copyPortfolioChangeRequest._id
                }, copyPortfolioChangeRequest,
                function(res){
                    vm.isResolving = false;
                    // Refresh the object with the current performances values
                    originalPortfolioChangeRequest[portfolioChangeRequest._id].approval = res.approval;
                    portfolioChangeRequest.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };



        // ----------------------------------------------- ASSOCIATED PROJECT CHANGE REQUESTS -------------------------------------------------


        // Used only to show the details of the change (adding/removing all done on main ctrl/view)
        var modalProjectChangeRequest = function (size, change, logReasons, changeRequestStates, logPriorities, logStatuses) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/portfolio-change-requests/views/associated-project-change.client.view.html',
                controller: function ($scope, $modalInstance, change, logReasons, changeRequestStates, logPriorities, logStatuses) {
                    $scope.selectedProjectChangeRequest = change;

                    $scope.logReasons = logReasons;
                    $scope.changeRequestStates = changeRequestStates;
                    $scope.logPriorities = logPriorities;
                    $scope.logStatuses = logStatuses;

                    $scope.projectChangeRequestDetails = 'header';

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    change: function () {
                        return change;
                    },
                    logReasons: function () {
                        return logReasons;
                    },
                    changeRequestStates: function () {
                        return changeRequestStates;
                    },
                    logPriorities: function () {
                        return logPriorities;
                    },
                    logStatuses: function () {
                        return logStatuses;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });
        };

        vm.viewProjectChangeRequest = function(change){
            modalProjectChangeRequest('lg', change, vm.logReasons, vm.changeRequestStates, vm.logPriorities, vm.logStatuses);
        };

        vm.addProjectChangeRequest = function(portfolioChange, projectChange){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.addProjectChangeRequest({
                portfolioChangeRequestId : portfolioChange._id,
                projectChangeRequestId : projectChange._id
            }, projectChange, function(res){
                vm.isResolving = false;
                portfolioChange.associatedProjectChangeRequests.push(projectChange);
                vm.availableProjectChangeRequests = _.without(vm.availableProjectChangeRequests, projectChange);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };

        vm.removeProjectChangeRequest = function(portfolioChange, projectChange){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.removeProjectChangeRequest({
                portfolioChangeRequestId : portfolioChange._id,
                projectChangeRequestId : projectChange._id
            }, projectChange, function(res){
                vm.isResolving = false;
                portfolioChange.associatedProjectChangeRequests = _.without(portfolioChange.associatedProjectChangeRequests, projectChange);
                vm.availableProjectChangeRequests.push(projectChange);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };



        // ----------------------------------------------- FUNDING REQUESTS -------------------------------------------------

        vm.switchFundingRequestForm = {};
        vm.selectFundingRequestForm = function(string, fundingRequest){
            if(string === 'view'){ vm.switchFundingRequestForm[fundingRequest._id] = 'view';}
            if(string === 'edit'){vm.switchFundingRequestForm[fundingRequest._id] = 'edit';}
        };

        vm.createFundingRequest = function(portfolioChange){
            var newFundingRequest = {
                title : 'New funding request item',
                description : '',
                funds : 0
            };
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.createFundingRequest({
                portfolioChangeRequestId : portfolioChange._id
            }, newFundingRequest, function(res){
                vm.isResolving = false;
                portfolioChange.fundingRequests.push(res);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };

        var originalFundingRequest = {};
        vm.editFundingRequest = function(fundingRequest){
            originalFundingRequest[fundingRequest._id] = _.cloneDeep(fundingRequest);
            vm.selectedFundingRequest = fundingRequest;
            vm.selectFundingRequestForm('edit', fundingRequest);
        };


        vm.saveEditFundingRequest = function(portfolioChange, fundingRequest){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.updateFundingRequest({
                portfolioChangeRequestId : portfolioChange._id,
                fundingRequestId : fundingRequest._id
            }, fundingRequest, function(res){
                vm.isResolving = false;
                vm.selectFundingRequestForm('view', fundingRequest);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
                vm.selectFundingRequestForm('view', fundingRequest);
            });
        };

        vm.cancelEditFundingRequest = function(portfolioChange, fundingRequest){
            vm.error = null;
            fundingRequest.title = originalFundingRequest[fundingRequest._id].title;
            fundingRequest.description = originalFundingRequest[fundingRequest._id].description;
            fundingRequest.funds = originalFundingRequest[fundingRequest._id].funds;
            vm.selectFundingRequestForm('view', fundingRequest);
        };

        vm.deleteFundingRequest = function(portfolioChange, fundingRequest){
            vm.error = null;
            vm.isResolving = true;
            PortfolioChangeRequests.deleteFundingRequest({
                portfolioChangeRequestId : portfolioChange._id,
                fundingRequestId : fundingRequest._id
            }, fundingRequest, function(res){
                vm.isResolving = false;
                portfolioChange.fundingRequests = _.without(portfolioChange.fundingRequests, fundingRequest);
            }, function(err){
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };





	}
]);

'use strict';

//Portfolio change requests service used to communicate Portfolio change requests REST endpoints
angular.module('portfolio-change-requests').factory('PortfolioChangeRequests', ['$resource',
	function($resource) {
		return $resource('portfolio-change-requests/:portfolioChangeRequestId', { portfolioChangeRequestId: '@_id'
		}, {

// ********************* PORTFOLIO CHANGES **********************

			update: {
				method: 'PUT'
			},

			// --- Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/header'
				// req.body: {whole portfolioChangeRequest object}
			},


// ********************* APPROVAL **********************

			submit: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/submit'
				// req.body: {whole portfolioChangeRequest object}
			},

			approve: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/approve'
				// req.body: {whole portfolioChangeRequest object}
			},

			reject: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/reject'
				// req.body: {whole portfolioChangeRequest object}
			},

			draft: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/draft'
				// req.body: {whole portfolioChangeRequest object}
			},


// **************** ASSOCIATED PROJECT CHANGES ******************

			// --- Get available project changes --
			getAvailableProjectChangeRequests: {
				method: 'GET',
				isArray: true,
				url: 'portfolio-change-requests/:portfolioChangeRequestId/portfolios/:portfolioId'
				// req.query: { }
				// Returns: [{projectChangeRequest}]
			},

			// --- Add associated project change --
			addProjectChangeRequest: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/addProjectChange'
				// req.body: {portfolio change object}
			},

			// --- Remove associated project change --
			removeProjectChangeRequest: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/removeProjectChange'
				// req.body: {portfolio change object}
			},

// **************** FUNDING REQUESTS ******************

			// --- Create funding request --
			createFundingRequest: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/createFundingRequest'
				// req.body: {funding request object}
			},

            // --- Delete funding request --
            deleteFundingRequest: {
                method: 'PUT',
                url: 'portfolio-change-requests/:portfolioChangeRequestId/funding-requests/:fundingRequestId/deleteFundingRequest'
                // req.body: {funding request object}
            },

            // --- Delete funding request --
            updateFundingRequest: {
                method: 'PUT',
                url: 'portfolio-change-requests/:portfolioChangeRequestId/funding-requests/:fundingRequestId/updateFundingRequest'
                // req.body: {funding request object}
            }

		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('portfolio-issues').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Portfolio issues', 'portfolio-issues', 'dropdown', '/portfolio-issues(/create)?');
		//Menus.addSubMenuItem('topbar', 'portfolio-issues', 'List Portfolio issues', 'portfolio-issues');
		//Menus.addSubMenuItem('topbar', 'portfolio-issues', 'New Portfolio issue', 'portfolio-issues/create');
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-issues').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio issues state routing
		$stateProvider.
		state('portfolio-issues', {
			url: '/portfolio-issues',
			templateUrl: 'modules/portfolio-issues/views/portfolio-issues.client.view.html'
		});
	}
]);

'use strict';

// PORTFOLIO ISSUES controller
angular.module('portfolio-issues').controller('PortfolioIssuesController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'Projects', 'ProjectIssues', 'PortfolioIssues', 'GateProcessTemplates', 'LogReasons', 'IssueStates', 'IssueActionStates', 'LogPriorities', 'LogStatusIndicators',
    'People', '$modal', '$log',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, Projects, ProjectIssues, PortfolioIssues, GateProcessTemplates, LogReasons, IssueStates, IssueActionStates, LogPriorities, LogStatusIndicators, People, $modal, $log) {

		$rootScope.staticMenu = false;

        var vm = this;

		vm.isResolving = false;

		// ------------- INIT -------------

		vm.initErrors = [];

		vm.init = function () {

            vm.user = Authentication.user;

			Projects.query({'selection.selectedForDelivery': true}, function (projects) {
				vm.projects = _.filter(projects, function (project) {
					return project.process !== null;
				});
			}, function (err) {
				vm.initErrors.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
				vm.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

			GateProcessTemplates.query(function (gateProcesses) {
				vm.gateProcesses = gateProcesses;
			}, function (err) {
				vm.initErrors.push(err.data.message);
			});

			LogReasons.query(function (res) {
				vm.logReasons = res;
			}, function (err) {
				vm.initErrors.push(err.data.message);
			});

			IssueStates.query(function (res) {
				vm.issueStates = res;
			}, function (err) {
				vm.initErrors.push(err.data.message);
			});

            IssueActionStates.query(function (res) {
                vm.issueActionStates = res;
            }, function (err) {
                vm.initErrors.push(err.data.message);
            });

			LogPriorities.query(function (res) {
				vm.logPriorities = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function (res) {
				vm.logStatuses = res;
			}, function (err) {
				vm.initError.push(err.data.message);
			});

            People.query(function (res) {
                vm.people = res;
            }, function (err) {
                vm.initError.push(err.data.message);
            });

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, portfolio){

            var userIsSuperhero, userIsPortfolioManager;

            if((action === 'edit') && user && portfolio){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = (user._id === portfolio.portfolioManager) || (user._id === portfolio.backupPortfolioManager);


                return userIsSuperhero || userIsPortfolioManager;
            }
        };

		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};


		// ------------------- UTILITIES ---------------------

		var allowNull = function (obj) {
			if (obj) {
				return obj._id;
			} else {
				return null;
			}
		};

		vm.sortProjectIssues = function (projectIssue) {
			return new Date(projectIssue.raisedOnDate);
		};

		vm.completionFilterArray = [
			{name : 'Completed', flag : true},
			{name : 'Not completed', flag : false}
		];


		// ------------- SELECT VIEW PORTFOLIO ------------

		vm.selectPortfolio = function (portfolio) {
			vm.portfolioIssues = null;
			vm.selectedPortfolioIssue = null;

			vm.selectedPortfolio = portfolio;

            vm.error = null;
            vm.isResolving = true;

			PortfolioIssues.query({
				portfolio: portfolio._id
			}, function (res) {
                vm.isResolving = false;
				vm.portfolioIssues = res;
			}, function (err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};


// ******************************************************* ISSUE *******************************************************



		// ------------- NEW ISSUE ------------

        vm.showNewPortfolioIssueForm = false;

		vm.newPortfolioIssueRaisedOnDateOpened = {};

		vm.openNewPortfolioIssueRaisedOnDate = function (portfolio, $event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.newPortfolioIssueRaisedOnDateOpened[portfolio._id] = true;
		};

		vm.newPortfolioIssue = {};

		vm.createNewPortfolioIssue = function (portfolio) {
			var newPortfolioIssue = new PortfolioIssues({
				portfolio: portfolio._id,
				raisedOnDate: vm.newPortfolioIssue.raisedOnDate,
				title: vm.newPortfolioIssue.title
			});

            vm.error = null;
            vm.isResolving = true;

			newPortfolioIssue.$save(function (res) {
                vm.isResolving = false;
				// Refresh the list of gate reviews after populating portfolio
				res.portfolio = _.cloneDeep(portfolio);
				vm.portfolioIssues.push(res);
				// Clear new form
				vm.newPortfolioIssue = {};
				// Select in view mode the new review
				vm.selectPortfolioIssue(_.find(vm.portfolioIssues, _.matchesProperty('_id', res._id)), portfolio);
				// Close new review form html
                vm.showNewPortfolioIssueForm = false;
			}, function (err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelNewPortfolioIssue = function () {
            vm.error = null;
			vm.newPortfolioIssue = {};
            vm.showNewPortfolioIssueForm = false;
		};



		// ------------- EDIT ISSUE ------------


		var modalUpdateIssue = function (size, issue, portfolio) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/portfolio-issues/views/edit-portfolio-issue.client.view.html',
				controller: function ($scope, $modalInstance, issue, portfolio, availableProjectIssues, availableProjects) {

                    $scope.selectedPortfolio = portfolio;

					$scope.originalPortfolioIssue = _.cloneDeep(issue);
					$scope.selectedPortfolioIssue = issue;
                    $scope.availableProjectIssues = availableProjectIssues;
                    $scope.availableProjects = availableProjects;

                    $scope.associateProjectIssue = function(portfolioIssue, projectIssue){
                        $scope.error = null;
                        $scope.isResolving = true;
                        PortfolioIssues.addProjectIssue({
                            portfolioIssueId : portfolioIssue._id,
                            projectIssueId : projectIssue._id
                        }, portfolioIssue, function(res){
                            $scope.isResolving = false;
                            portfolioIssue.associatedProjectIssues.push(projectIssue);
                            $scope.availableProjectIssues = _.without($scope.availableProjectIssues, projectIssue);
                        }, function(err){
                            $scope.isResolving = false;
                            $scope.error = err.data.message;
                        });
                    };

                    $scope.disassociateProjectIssue = function(portfolioIssue, projectIssue){
                        $scope.error = null;
                        $scope.isResolving = true;
                        PortfolioIssues.removeProjectIssue({
                            portfolioIssueId : portfolioIssue._id,
                            projectIssueId : projectIssue._id
                        }, portfolioIssue, function(res){
                            $scope.isResolving = false;
                            portfolioIssue.associatedProjectIssues = _.without(portfolioIssue.associatedProjectIssues, projectIssue);
                            $scope.availableProjectIssues.push(projectIssue);
                        }, function(err){
                            $scope.isResolving = false;
                            $scope.error = err.data.message;
                        });
                    };

					$scope.cancelModal = function () {
                        $scope.error = null;
						$modalInstance.dismiss();
					};
				},
				size: size,
				resolve: {
					issue: function () {
						return issue;
					},
                    portfolio: function () {
                        return portfolio;
                    },
                    availableProjectIssues: function(PortfolioIssues){
                        return PortfolioIssues.getAvailableProjectIssues(
                            { portfolioId : portfolio._id, portfolioIssueId: issue._id},
                            function (res) { return res; },
                            function (err) { vm.error = err.data.message; }
                        );
                    },
                    availableProjects: function(Projects){
                        return Projects.query(
                            { portfolio : portfolio._id},
                            function (res) { return res; },
                            function (err) { vm.error = err.data.message; }
                        );
                    }
				},
				backdrop: 'static',
				keyboard: false
			});

		};

		vm.selectPortfolioIssue = function(issue, portfolio){
            vm.issue = null;
            modalUpdateIssue('lg', issue, portfolio);
		};

		// ------------------- NG-SWITCH ---------------------

		vm.portfolioIssueDetails = 'header';

		vm.selectHeaderForm = function (string) {
			if (string === 'view') {
				vm.switchHeaderForm = 'view';
			}
			if (string === 'edit') {
				vm.switchHeaderForm = 'edit';
			}
		};

		vm.selectStatusForm = function (string) {
			if (string === 'view') {
				vm.switchStatusForm = 'view';
			}
			if (string === 'edit') {
				vm.switchStatusForm = 'edit';
			}
		};

		// ------------------- HEADER --------------------------

		vm.openHeaderDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.headerDateOpened = true;
		};

		vm.editHeader = function () {
			vm.selectHeaderForm('edit');
		};

		vm.saveEditHeader = function (portfolioIssue, originalPortfolioIssue) {
			// Clean-up deepPopulate
			var copyPortfolioIssue = _.cloneDeep(portfolioIssue);
			copyPortfolioIssue.portfolio = _.get(copyPortfolioIssue.portfolio, '_id');
			copyPortfolioIssue.reason = allowNull(copyPortfolioIssue.reason);
			copyPortfolioIssue.priority = allowNull(copyPortfolioIssue.priority);
			copyPortfolioIssue.state = allowNull(copyPortfolioIssue.state);
			copyPortfolioIssue.statusReview.currentRecord.status = allowNull(copyPortfolioIssue.statusReview.currentRecord.status);
			// Update server header
            vm.error = null;
            vm.isResolving = true;
			PortfolioIssues.updateHeader(
				{
					portfolioIssueId: copyPortfolioIssue._id
				}, copyPortfolioIssue,
				function (res) {
                    vm.isResolving = false;
					// Update details pane view with new saved details
					originalPortfolioIssue.raisedOnDate = portfolioIssue.raisedOnDate;
					originalPortfolioIssue.title = portfolioIssue.title;
					originalPortfolioIssue.description = portfolioIssue.description;
					originalPortfolioIssue.state = portfolioIssue.state;
					originalPortfolioIssue.reason = portfolioIssue.reason;
					originalPortfolioIssue.priority = portfolioIssue.priority;
					// Close edit header form and back to view
					vm.selectHeaderForm('view');
				},
				function (err) {
                    vm.isResolving = false;
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditHeader = function (portfolioIssue, originalPortfolioIssue) {
            vm.error = null;
			portfolioIssue.gate = originalPortfolioIssue.gate;
			portfolioIssue.raisedOnDate = originalPortfolioIssue.raisedOnDate;
			portfolioIssue.title = originalPortfolioIssue.title;
			portfolioIssue.description = originalPortfolioIssue.description;
			portfolioIssue.state = originalPortfolioIssue.state;
			portfolioIssue.reason = originalPortfolioIssue.reason;
			portfolioIssue.priority = originalPortfolioIssue.priority;
			vm.selectHeaderForm('view');
		};


		vm.deletePortfolioIssue = function (portfolioIssue) {
            vm.error = null;
            vm.isResolving = true;
			PortfolioIssues.remove({portfolioIssueId: portfolioIssue._id}, portfolioIssue, function (res) {
                vm.isResolving = false;
				vm.portfolioIssues = _.without(vm.portfolioIssues, portfolioIssue);
			}, function (err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};


		// --------------------- STATUS -----------------------

		vm.openBaselineDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.baselineDeliveryDateOpened = true;
		};

		vm.openEstimateDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.estimateDeliveryDateOpened = true;
		};

		vm.openActualDeliveryDate = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			vm.actualDeliveryDateOpened = true;
		};

		vm.editStatus = function () {
			vm.selectStatusForm('edit');
		};

		vm.saveEditStatus = function (portfolioIssue, originalPortfolioIssue) {
			// Clean-up deepPopulate
			var copyPortfolioIssue = _.cloneDeep(portfolioIssue);
			copyPortfolioIssue.portfolio = _.get(copyPortfolioIssue.portfolio, '_id');
			copyPortfolioIssue.reason = allowNull(copyPortfolioIssue.reason);
			copyPortfolioIssue.priority = allowNull(copyPortfolioIssue.priority);
			copyPortfolioIssue.state = allowNull(copyPortfolioIssue.state);
			copyPortfolioIssue.statusReview.currentRecord.status = allowNull(copyPortfolioIssue.statusReview.currentRecord.status);
			// Update server header
            vm.error = null;
            vm.isResolving = true;
			PortfolioIssues.updateStatus({portfolioIssueId: copyPortfolioIssue._id}, copyPortfolioIssue,
				function (res) {
                    vm.isResolving = false;
					// Change the selected CR
					originalPortfolioIssue.statusReview.currentRecord.baselineDeliveryDate = portfolioIssue.statusReview.currentRecord.baselineDeliveryDate;
					originalPortfolioIssue.statusReview.currentRecord.estimateDeliveryDate = portfolioIssue.statusReview.currentRecord.estimateDeliveryDate;
					originalPortfolioIssue.statusReview.currentRecord.actualDeliveryDate = portfolioIssue.statusReview.currentRecord.actualDeliveryDate;
					originalPortfolioIssue.statusReview.currentRecord.status = portfolioIssue.statusReview.currentRecord.status;
					originalPortfolioIssue.statusReview.currentRecord.completed = portfolioIssue.statusReview.currentRecord.completed;
					originalPortfolioIssue.statusReview.currentRecord.statusComment = portfolioIssue.statusReview.currentRecord.statusComment;
					vm.selectStatusForm('view');
				},
				function (err) {
                    vm.isResolving = false;
					vm.error = err.data.message;
				}
			);
		};

		vm.cancelEditStatus = function (portfolioIssue, originalPortfolioIssue) {
            vm.error = null;
			portfolioIssue.statusReview.currentRecord.baselineDeliveryDate = originalPortfolioIssue.statusReview.currentRecord.baselineDeliveryDate;
			portfolioIssue.statusReview.currentRecord.estimateDeliveryDate = originalPortfolioIssue.statusReview.currentRecord.estimateDeliveryDate;
			portfolioIssue.statusReview.currentRecord.actualDeliveryDate = originalPortfolioIssue.statusReview.currentRecord.actualDeliveryDate;
			portfolioIssue.statusReview.currentRecord.status = originalPortfolioIssue.statusReview.currentRecord.status;
			portfolioIssue.statusReview.currentRecord.completed = originalPortfolioIssue.statusReview.currentRecord.completed;
			portfolioIssue.statusReview.currentRecord.statusComment = originalPortfolioIssue.statusReview.currentRecord.statusComment;
			vm.selectStatusForm('view');
		};



// ******************************************************* ACTION *****************************************************



        // --------------------- NEW ACTION -----------------------


        vm.addNewAction = function (portfolioIssue) {
            var newAction = {
                raisedOnDate: Date.now(),
                title: 'New action title'
            };
            vm.error = null;
            vm.isResolving = true;
            PortfolioIssues.createAction(
                { portfolioIssueId : portfolioIssue._id}, newAction,
                function(res){
                    vm.isResolving = false;
                    portfolioIssue.escalationActions.push(res);
                    vm.selectAction(_.find(portfolioIssue.escalationActions, _.matchesProperty('_id', res._id)));
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };


        // --------------------- EDIT ACTION -----------------------


        vm.selectAction = function(action){
            vm.originalAction = _.cloneDeep(action);
            vm.selectedAction = action;
        };


        // ------------------- NG-SWITCH ---------------------

        vm.actionDetails = 'header';

        vm.switchActionHeaderForm = {};
        vm.selectActionHeaderForm = function (string, action) {
            if (string === 'view') {
                vm.switchActionHeaderForm[action._id] = 'view';
            }
            if (string === 'edit') {
                vm.switchActionHeaderForm[action._id] = 'edit';
            }
        };

        vm.switchActionStatusForm = {};
        vm.selectActionStatusForm = function (string, action) {
            if (string === 'view') {
                vm.switchActionStatusForm[action._id] = 'view';
            }
            if (string === 'edit') {
                vm.switchActionStatusForm[action._id] = 'edit';
            }
        };

        // ------------------- HEADER --------------------------

        vm.actionHeaderDateOpened = {};
        vm.openActionHeaderDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionHeaderDateOpened[action._id] = true;
        };

        vm.editActionHeader = function (action) {
            vm.selectActionHeaderForm('edit', action);
        };

        vm.saveEditActionHeader = function (issue, action, originalAction) {
            // Clean-up deepPopulate
            var copyAction = _.cloneDeep(action);
            copyAction.portfolio = _.get(copyAction.portfolio, '_id');
            copyAction.escalatedTo = allowNull(copyAction.escalatedTo);
            copyAction.priority = allowNull(copyAction.priority);
            copyAction.state = allowNull(copyAction.state);
            copyAction.statusReview.currentRecord.status = allowNull(copyAction.statusReview.currentRecord.status);
            // Update server header
            vm.error = null;
            vm.isResolving = true;
            PortfolioIssues.updateActionHeader(
                {
                    portfolioIssueId: issue._id,
                    escalationActionId: action._id
                }, copyAction,
                function (res) {
                    vm.isResolving = false;
                    // Update details pane view with new saved details
                    originalAction.raisedOnDate = action.raisedOnDate;
                    originalAction.title = action.title;
                    originalAction.description = action.description;
                    originalAction.state = action.state;
                    originalAction.escalatedTo = action.escalatedTo;
                    originalAction.priority = action.priority;
                    // Close edit header form and back to view
                    vm.selectActionHeaderForm('view', action);
                },
                function (err) {
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditActionHeader = function (action, originalAction) {
            vm.error = null;
            action.raisedOnDate = originalAction.raisedOnDate;
            action.title = originalAction.title;
            action.description = originalAction.description;
            action.state = originalAction.state;
            action.escalatedTo = originalAction.escalatedTo;
            action.priority = originalAction.priority;
            vm.selectActionHeaderForm('view', action);
        };


        vm.deleteAction = function (issue, action) {
            vm.error = null;
            vm.isResolving = true;
            PortfolioIssues.deleteAction({
                portfolioIssueId: issue._id,
                escalationActionId: action._id
            }, action, function (res) {
                vm.isResolving = false;
                issue.escalationActions = _.without(issue.escalationActions, action);
                vm.originalAction = null;
                vm.selectedAction = null;
            }, function (err) {
                vm.isResolving = false;
                vm.error = err.data.message;
            });
        };


        // --------------------- STATUS -----------------------

        vm.actionBaselineDeliveryDateOpened = {};
        vm.openActionBaselineDeliveryDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionBaselineDeliveryDateOpened[action._id] = true;
        };

        vm.actionEstimateDeliveryDateOpened = {};
        vm.openActionEstimateDeliveryDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionEstimateDeliveryDateOpened[action._id] = true;
        };

        vm.actionActualDeliveryDateOpened = {};
        vm.openActionActualDeliveryDate = function ($event, action) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.actionActualDeliveryDateOpened[action._id] = true;
        };

        vm.editActionStatus = function (action) {
            vm.selectActionStatusForm('edit', action);
        };

        vm.saveEditActionStatus = function (issue, action, originalAction) {
            // Clean-up deepPopulate
            var copyAction = _.cloneDeep(action);
            copyAction.portfolio = _.get(copyAction.portfolio, '_id');
            copyAction.escalatedTo = allowNull(copyAction.escalatedTo);
            copyAction.priority = allowNull(copyAction.priority);
            copyAction.state = allowNull(copyAction.state);
            copyAction.statusReview.currentRecord.status = allowNull(copyAction.statusReview.currentRecord.status);
            // Update server header
            vm.error = null;
            vm.isResolving = true;
            PortfolioIssues.updateActionStatus({
                    portfolioIssueId: issue._id,
                    escalationActionId: action._id
                }, copyAction,
                function (res) {
                    vm.isResolving = false;
                    // Change the selected action
                    originalAction.statusReview.currentRecord.baselineDeliveryDate = issue.statusReview.currentRecord.baselineDeliveryDate;
                    originalAction.statusReview.currentRecord.estimateDeliveryDate = issue.statusReview.currentRecord.estimateDeliveryDate;
                    originalAction.statusReview.currentRecord.actualDeliveryDate = issue.statusReview.currentRecord.actualDeliveryDate;
                    originalAction.statusReview.currentRecord.status = issue.statusReview.currentRecord.status;
                    originalAction.statusReview.currentRecord.completed = issue.statusReview.currentRecord.completed;
                    originalAction.statusReview.currentRecord.statusComment = issue.statusReview.currentRecord.statusComment;
                    vm.selectActionStatusForm('view', action);
                },
                function (err) {
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditActionStatus = function (action, originalAction) {
            vm.error = null;
            action.statusReview.currentRecord.baselineDeliveryDate = originalAction.statusReview.currentRecord.baselineDeliveryDate;
            action.statusReview.currentRecord.estimateDeliveryDate = originalAction.statusReview.currentRecord.estimateDeliveryDate;
            action.statusReview.currentRecord.actualDeliveryDate = originalAction.statusReview.currentRecord.actualDeliveryDate;
            action.statusReview.currentRecord.status = originalAction.statusReview.currentRecord.status;
            action.statusReview.currentRecord.completed = originalAction.statusReview.currentRecord.completed;
            action.statusReview.currentRecord.statusComment = originalAction.statusReview.currentRecord.statusComment;
            vm.selectActionStatusForm('view', action);
        };



	}

]);

'use strict';

//Portfolio issues service used to communicate Portfolio issues REST endpoints
angular.module('portfolio-issues').factory('PortfolioIssues', ['$resource',
	function($resource) {
		return $resource('portfolio-issues/:portfolioIssueId', { portfolioIssueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
// **************** ISSUE ******************

			// --- Issue Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-issues/:portfolioIssueId/header'
				// req.body: {whole issue object}
			},

			// --- Issue Status --
			updateStatus: {
				method: 'PUT',
				url: 'portfolio-issues/:portfolioIssueId/status'
				// req.body: {whole issue object}
			},

// **************** ACTION ******************

            // --- Create action --
            createAction: {
                method: 'POST',
                url: 'portfolio-issues/:portfolioIssueId/createAction'
                // req.body: {the new action object}
            },

            // --- Action Header --
            updateActionHeader: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/actionHeader'
                // req.body: {action object}
            },

            // --- Action Status --
            updateActionStatus: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/actionStatus'
                // req.body: {action object}
            },

            // --- Delete action --
            deleteAction: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/deleteAction'
                // req.body: {action object}
            },

// **************** ASSOCIATED PROJECT ISSUES ******************

            // --- Get available project issues for associatedProjectIssues --
            getAvailableProjectIssues: {
                method: 'GET',
                isArray: true,
                url: 'portfolio-issues/:portfolioIssueId/portfolios/:portfolioId'
                // req.query: { }
                // Returns: [{projectIssue}]
            },

            // --- Add associated project issue --
            addProjectIssue: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/project-issues/:projectIssueId/addProjectIssue'
                // req.body: {portfolio issue object}
            },

            // --- Remove associated project issue --
            removeProjectIssue: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/project-issues/:projectIssueId/removeProjectIssue'
                // req.body: {portfolio issue object}
            }
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('portfolio-milestones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Portfolio milestones', 'portfolio-milestones', 'dropdown', '/portfolio-milestones(/create)?');
		//Menus.addSubMenuItem('topbar', 'portfolio-milestones', 'List Portfolio milestones', 'portfolio-milestones');
		//Menus.addSubMenuItem('topbar', 'portfolio-milestones', 'New Portfolio milestone', 'portfolio-milestones/create');
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-milestones').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio milestones state routing
		$stateProvider.
		state('portfolio-milestones', {
			url: '/portfolio-milestones',
			templateUrl: 'modules/portfolio-milestones/views/portfolio-milestones.client.view.html'
		});
	}
]);

'use strict';

angular.module('portfolio-milestones').controller('PortfolioMilestonesController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
	'Portfolios', 'Projects', 'PortfolioMilestones', 'GateProcessTemplates',
	'MilestoneStates', 'PortfolioMilestoneTypes', 'ProjectMilestoneTypes', 'LogStatusIndicators',
	'$modal', '$log',
	function($rootScope, $scope, $stateParams, $location, $q, _, Authentication,
			 Portfolios, Projects, PortfolioMilestones, GateProcessTemplates,
             MilestoneStates, PortfolioMilestoneTypes, ProjectMilestoneTypes, LogStatusIndicators, $modal, $log) {

		$rootScope.staticMenu = false;

		var vm = this;

		vm.isResolving = false;

		// ------------- INIT -------------

		vm.initErrors = [];

		vm.init = function(){

			vm.user = Authentication.user;

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
				vm.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

            MilestoneStates.query(function(milestoneStates){
				vm.milestoneStates = milestoneStates;
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

            PortfolioMilestoneTypes.query(function(portfolioMilestoneTypes){
				vm.portfolioMilestoneTypes = portfolioMilestoneTypes;
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

            ProjectMilestoneTypes.query(function(projectMilestoneTypes){
				vm.projectMilestoneTypes = projectMilestoneTypes;
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				vm.logStatuses = logStatusIndicators;
			}, function(err){
				vm.initErrors.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, portfolio){

            var userIsSuperhero, userIsPortfolioManager;

            if((action === 'edit') && user && portfolio){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = (user._id === portfolio.portfolioManager) || (user._id === portfolio.backupPortfolioManager);


                return userIsSuperhero || userIsPortfolioManager;
            }
        };


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};


		// ------------------- NG-SWITCH ---------------------


		vm.switchHeaderForm = {};
		vm.selectHeaderForm = function(string, portfolioMilestone){
			if(string === 'view'){ vm.switchHeaderForm[portfolioMilestone._id] = 'view';}
			if(string === 'edit'){vm.switchHeaderForm[portfolioMilestone._id] = 'edit';}
		};

        vm.switchStatusForm = {};
        vm.selectStatusForm = function(string, portfolioMilestone){
            if(string === 'view'){ vm.switchStatusForm[portfolioMilestone._id] = 'view';}
            if(string === 'edit'){vm.switchStatusForm[portfolioMilestone._id] = 'edit';}
        };

		vm.switchAssociatedProjectMilestoneForm = {};
		vm.selectAssociatedProjectMilestoneForm = function(string, portfolioMilestone){
			if(string === 'view'){ vm.switchAssociatedProjectMilestoneForm[portfolioMilestone._id] = 'view';}
			if(string === 'edit'){vm.switchAssociatedProjectMilestoneForm[portfolioMilestone._id] = 'edit';}
		};


		// ------------------- UTILITIES ---------------------

		vm.portfolioMilestoneFilter = {};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		vm.sortMilestones = function(milestone) {
			return new Date(milestone.statusReview.currentRecord.estimateDeliveryDate);
		};

		vm.sortByCreated = function(object){
			return new Date(object.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		vm.portfolioMilestoneDetails = 'header';

		// ------------- SELECT VIEW PORTFOLIO ------------

		var originalPortfolioMilestone = {};

		vm.selectPortfolio = function(portfolio) {

            vm.cancelNewPortfolioMilestone();

			vm.selectedPortfolio = null;
			vm.portfolioMilestones = null;

			vm.selectedPortfolioMilestone = null;
			originalPortfolioMilestone = {};

			vm.selectedPortfolio = portfolio;

            vm.error = null;
            vm.isResolving = true;

			PortfolioMilestones.query({
				portfolio: portfolio._id
			}, function (res) {
                vm.isResolving = false;
				vm.portfolioMilestones = res;
			}, function (err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelViewPortfolio = function(){
			vm.error = null;
			vm.selectedPortfolio = null;
			vm.portfolioMilestones = null;

		};



		// ------------- NEW PROJECT CHANGE REQUEST ------------

        vm.showNewPortfolioMilestoneForm = false;

		vm.openNewPortfolioCRRaisedOnDate = function($event){
			$event.preventDefault();
			$event.stopPropagation();
			vm.newPortfolioCRRaisedOnDateOpened = true;
		};

		vm.newPortfolioMilestone = {};

		vm.createNewPortfolioMilestone = function(portfolio){
			var newPortfolioMilestone = new PortfolioMilestones({
				portfolio: portfolio._id,
				type : vm.newPortfolioMilestone.type,
				name : vm.newPortfolioMilestone.name
			});
            vm.error = null;
            vm.isResolving = true;
			newPortfolioMilestone.$save(function(res) {
                vm.isResolving = false;
				// Clear new form
				vm.newPortfolioMilestone = {};
				// Refresh the list of milestone
				vm.portfolioMilestones.push(res);
				// Select in view mode the new review
				vm.selectPortfolioMilestone(portfolio, res);
				// Close new review form in the view's html
                vm.showNewPortfolioMilestoneForm = false;
			}, function(err) {
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.cancelNewPortfolioMilestone = function(){
            vm.error = null;
			vm.newPortfolioMilestone = {};
            vm.showNewPortfolioMilestoneForm = false;
		};


		// ------------- SELECT MILESTONE ------------

		var portfolioMilestoneFromList = {};
		// Required to update the list when milestones details
		// in the details pane that are also reported in the list of milestone requests

		vm.selectPortfolioMilestone = function(portfolio, portfolioMilestone){
            vm.error = null;
            vm.isResolving = true;
			$q.all([
				PortfolioMilestones.get({
					portfolioMilestoneId:portfolioMilestone._id }).$promise,
				PortfolioMilestones.getAvailableProjectMilestones(
					{ portfolioId : portfolio._id, portfolioMilestoneId: portfolioMilestone._id }).$promise,
				Projects.query(
					{ portfolio : portfolio._id }).$promise
			]).then(function(data) {
                vm.isResolving = false;
				portfolioMilestoneFromList[portfolioMilestone._id] = portfolioMilestone;
				originalPortfolioMilestone[portfolioMilestone._id] = _.cloneDeep(data[0]);
				vm.selectedPortfolioMilestone = data[0];
				vm.availableProjectMilestones = data[1];
				vm.availableProjects = data[2];
			}, function(err){
                vm.isResolving = false;
				vm.error = err.data.message;
			});

		};



		// -------------------------------------------------------- HEADER -------------------------------------------------


		vm.editHeader = function(portfolioMilestone){
			vm.selectHeaderForm('edit', portfolioMilestone);
		};

		vm.saveEditHeader = function(portfolioMilestone){
			// Clean-up deepPopulate
			var copyPortfolioMilestone = _.cloneDeep(portfolioMilestone);
			copyPortfolioMilestone.portfolio = _.get(copyPortfolioMilestone.portfolio, '_id');
			// Update server header
            vm.error = null;
            vm.isResolving = true;
			PortfolioMilestones.updateHeader(
				{
					portfolioMilestoneId : copyPortfolioMilestone._id
				}, copyPortfolioMilestone,
				function(res){
                    vm.isResolving = false;
					// Update details pane view with new saved details
					originalPortfolioMilestone[portfolioMilestone._id].name = portfolioMilestone.name;
					originalPortfolioMilestone[portfolioMilestone._id].description = portfolioMilestone.description;
					originalPortfolioMilestone[portfolioMilestone._id].state = portfolioMilestone.state;
					originalPortfolioMilestone[portfolioMilestone._id].type = portfolioMilestone.type;
					// Update list of reviews with new date / name
					portfolioMilestoneFromList[portfolioMilestone._id].name = portfolioMilestone.name;
					// Close edit header form and back to view
					vm.selectHeaderForm('view', portfolioMilestone);
				},
				function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
			);
		};

		vm.cancelEditHeader = function(portfolioMilestone){
            vm.error = null;
			portfolioMilestone.name = originalPortfolioMilestone[portfolioMilestone._id].name;
			portfolioMilestone.description = originalPortfolioMilestone[portfolioMilestone._id].description;
			portfolioMilestone.state = originalPortfolioMilestone[portfolioMilestone._id].state;
            portfolioMilestone.type = originalPortfolioMilestone[portfolioMilestone._id].type;
			vm.selectHeaderForm('view', portfolioMilestone);
		};


		vm.deletePortfolioMilestone = function(portfolioMilestone){
            vm.error = null;
            vm.isResolving = true;
			PortfolioMilestones.remove(
				{portfolioMilestoneId: portfolioMilestone._id},
				portfolioMilestone, function(res){
                    vm.isResolving = false;
					vm.portfolioMilestones = _.without(vm.portfolioMilestones, _.find(vm.portfolioMilestones, _.matchesProperty('_id',portfolioMilestone._id)));
					vm.cancelNewPortfolioMilestone();
					vm.selectedPortfolioMilestone = null;
					originalPortfolioMilestone = {};
				}, function(err){
                    vm.isResolving = false;
					vm.error = err.data.message;
				});
		};


        // -------------------------------------------------------- STATUS -------------------------------------------------

        vm.baselineDeliveryDateOpened = {};
        vm.openBaselineDeliveryDate = function(portfolioMilestone, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.baselineDeliveryDateOpened[portfolioMilestone._id] = true;
        };

        vm.estimateDeliveryDateOpened = {};
        vm.openEstimateDeliveryDate = function(portfolioMilestone, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.estimateDeliveryDateOpened[portfolioMilestone._id] = true;
        };

        vm.actualDeliveryDateOpened = {};
        vm.openActualDeliveryDate = function(portfolioMilestone, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.actualDeliveryDateOpened[portfolioMilestone._id] = true;
        };

        vm.editStatus = function(portfolioMilestone){
            vm.selectStatusForm('edit', portfolioMilestone);
        };

        vm.saveEditStatus = function(portfolioMilestone){
            // Clean-up deepPopulate
            var copyPortfolioMilestone = _.cloneDeep(portfolioMilestone);
            copyPortfolioMilestone.project = _.get(copyPortfolioMilestone.project, '_id');
            copyPortfolioMilestone.gate = _.get(copyPortfolioMilestone.gate, '_id');
            // Update server header
            vm.error = null;
            vm.isResolving = true;
            PortfolioMilestones.updateStatus( { portfolioMilestoneId : copyPortfolioMilestone._id }, copyPortfolioMilestone,
                function(res){
                    vm.isResolving = false;
                    // Update the "estimate delivery date" and the "final" in the gate from the list
                    portfolioMilestoneFromList[portfolioMilestone._id].statusReview.currentRecord.completed = portfolioMilestone.statusReview.currentRecord.completed;
                    portfolioMilestoneFromList[portfolioMilestone._id].statusReview.currentRecord.estimateDeliveryDate = portfolioMilestone.statusReview.currentRecord.estimateDeliveryDate;
                    // Change the selected CR
                    originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.baselineDeliveryDate = portfolioMilestone.statusReview.currentRecord.baselineDeliveryDate;
                    originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.estimateDeliveryDate = portfolioMilestone.statusReview.currentRecord.estimateDeliveryDate;
                    originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.actualDeliveryDate = portfolioMilestone.statusReview.currentRecord.actualDeliveryDate;
                    originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.status = portfolioMilestone.statusReview.currentRecord.status;
                    originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.completed = portfolioMilestone.statusReview.currentRecord.completed;
                    originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.statusComment = portfolioMilestone.statusReview.currentRecord.statusComment;
                    vm.selectStatusForm('view', portfolioMilestone);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditStatus = function(portfolioMilestone){
            vm.error = null;
            portfolioMilestone.statusReview.currentRecord.baselineDeliveryDate = originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.baselineDeliveryDate;
            portfolioMilestone.statusReview.currentRecord.estimateDeliveryDate = originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.estimateDeliveryDate;
            portfolioMilestone.statusReview.currentRecord.actualDeliveryDate = originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.actualDeliveryDate;
            portfolioMilestone.statusReview.currentRecord.status = originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.status;
            portfolioMilestone.statusReview.currentRecord.completed = originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.completed;
            portfolioMilestone.statusReview.currentRecord.statusComment = originalPortfolioMilestone[portfolioMilestone._id].statusReview.currentRecord.statusComment;
            vm.selectStatusForm('view', portfolioMilestone);
        };



        // ----------------------------------------------- ASSOCIATED PROJECT MILESTONES -------------------------------------------------


		// Used only to show the details of the milestone (adding/removing all done on main ctrl/view)
		var modalProjectMilestone = function (size, milestone, milestoneStates, portfolioMilestoneTypes, projectMilestoneTypes, logStatuses, availableProjects) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/portfolio-milestones/views/associated-project-milestone.client.view.html',
				controller: function ($scope, $modalInstance, milestone) {
					$scope.selectedProjectMilestone = milestone;

                    $scope.milestoneStates = milestoneStates;
                    $scope.portfolioMilestoneTypes = portfolioMilestoneTypes;
                    $scope.projectMilestoneTypes = projectMilestoneTypes;
                    $scope.logStatuses = logStatuses;
                    $scope.availableProjects = availableProjects;

					$scope.projectMilestoneDetails = 'header';

					$scope.cancelModal = function () {
						$modalInstance.dismiss();
					};
				},
				size: size,
				resolve: {
					milestone: function () {
                        return milestone;
                    },
                    milestoneStates: function () {
                        return milestoneStates;
                    },
                    portfolioMilestoneTypes: function () {
                        return portfolioMilestoneTypes;
                    },
                    projectMilestoneTypes: function () {
                        return projectMilestoneTypes;
                    },
                    logStatuses: function () {
                        return logStatuses;
                    },
                    availableProjects: function () {
                        return availableProjects;
                    }
				},
				backdrop: 'static',
				keyboard: false
			});
		};

		vm.viewProjectMilestone = function(milestone){
			modalProjectMilestone('lg', milestone, vm.milestoneStates, vm.portfolioMilestoneTypes, vm.projectMilestoneTypes, vm.logStatuses, vm.availableProjects);
		};

		vm.addProjectMilestone = function(portfolioMilestone, projectMilestone){
            vm.error = null;
            vm.isResolving = true;
			PortfolioMilestones.addProjectMilestone({
				portfolioMilestoneId : portfolioMilestone._id,
				projectMilestoneId : projectMilestone._id
			}, projectMilestone, function(res){
                vm.isResolving = false;
                portfolioMilestone.associatedProjectMilestones.push(projectMilestone);
				vm.availableProjectMilestones = _.without(vm.availableProjectMilestones, projectMilestone);
			}, function(err){
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};

		vm.removeProjectMilestone = function(portfolioMilestone, projectMilestone){
            vm.error = null;
            vm.isResolving = true;
			PortfolioMilestones.removeProjectMilestone({
				portfolioMilestoneId : portfolioMilestone._id,
				projectMilestoneId : projectMilestone._id
			}, projectMilestone, function(res){
                vm.isResolving = false;
                portfolioMilestone.associatedProjectMilestones = _.without(portfolioMilestone.associatedProjectMilestones, projectMilestone);
				vm.availableProjectMilestones.push(projectMilestone);
			}, function(err){
                vm.isResolving = false;
				vm.error = err.data.message;
			});
		};



	}
]);

'use strict';

//Portfolio milestones service used to communicate Portfolio milestones REST endpoints
angular.module('portfolio-milestones').factory('PortfolioMilestones', ['$resource',
	function($resource) {
		return $resource('portfolio-milestones/:portfolioMilestoneId', { portfolioMilestoneId: '@_id'
		}, {

// ********************* PORTFOLIO MILESTONES **********************

			update: {
				method: 'PUT'
			},

			// --- Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/header'
				// req.body: {whole portfolioChangeRequest object}
			},

			// --- Status --
			updateStatus: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/status'
				// req.body: {whole portfolioChangeRequest object}
			},

// **************** ASSOCIATED PROJECT MILESTONES ******************

			// --- Get available project milestones --
			getAvailableProjectMilestones: {
				method: 'GET',
				isArray: true,
				url: 'portfolio-milestones/:portfolioMilestoneId/portfolios/:portfolioId'
				// req.query: { }
				// Returns: [{projectMilestone}]
			},

			// --- Add associated project milestone --
			addProjectMilestone: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/project-milestones/:projectMilestoneId/addProjectMilestone'
				// req.body: {portfolio milestone object}
			},

			// --- Remove associated project milestone --
			removeProjectMilestone: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/project-milestones/:projectMilestoneId/removeProjectMilestone'
				// req.body: {portfolio milestone object}
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-ranking-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio ranking assignment state routing
		$stateProvider.
		state('portfolio-ranking-assignment', {
			url: '/portfolio-ranking-assignment',
			templateUrl: 'modules/portfolio-ranking-assignment/views/portfolio-ranking-assignment.client.view.html'
		});
	}
]);
'use strict';

angular.module('portfolio-ranking-assignment').controller('PortfolioRankingAssignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Portfolios','Projects', 'PortfolioRankings', 'OverallRankings', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios, Projects, PortfolioRankings, OverallRankings, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForPrioritization': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
                $scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            PortfolioRankings.query(function(portfolioRankings){
                $scope.portfolioRankings = portfolioRankings;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            OverallRankings.query(function(res){
                $scope.overallRankings = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};

        // ------------------- AUTHORIZATION FUNCTION -------

        var userHasAuthorization = false;

        var getAuthorization = function(portfolio, userData){
            var isPortfolioManager, isBackupPortfolioManager, isSuperhero;
            if(portfolio.portfolioManager){
                isPortfolioManager = portfolio.portfolioManager === userData._id;
            }
            if(portfolio.backupPortfolioManager){
                isBackupPortfolioManager = portfolio.backupPortfolioManager === userData._id;
            }
            isSuperhero = !!_.find(userData.roles, function(role){
                return (role === 'superAdmin' || role === 'admin' || role === 'pmo');
            });
            return isPortfolioManager || isBackupPortfolioManager || isSuperhero;
        };


		// ------------------- PROJECTS FOR NODE ------------

        var selectedPortfolioRanking = {};
        $scope.selectedAssignment = {};
        var overallSelected = false; // Required for the drag and drop listeners
		$scope.selectNode = function(node, userData){
            userHasAuthorization = getAuthorization(node, userData);
            if(node === 'overall'){
                $scope.error = null;
                $scope.selectedNode = {name : 'Overall'};
                overallSelected = true;
                OverallRankings.query(function(res){
                    selectedPortfolioRanking = res[0]; // Returns an array with one object
                    $scope.selectedAssignment.assignedProjects = _.map(res[0].projects, function(project){
                        return {
                            _id: project._id,
                            idReference: project.identification.idReference,
                            name: project.identification.name
                        };
                    });
                    $scope.selectedAssignment.unassignedProjects = [];
                    _.forEach($scope.projects, function(project){
                        // Check if the project has been already added to the ranking, if not then push it in the unassigned
                        if(!_.find(res[0].projects,'_id', project._id)){
                            $scope.selectedAssignment.unassignedProjects.push({
                                _id: project._id,
                                idReference : project.identification.idReference,
                                name: project.identification.name
                            });
                        }
                    });
                });
            } else {
                $scope.error = null;
                $scope.selectedNode = node;
                overallSelected = false;
                PortfolioRankings.get({
                    portfolioId: node._id,
                    retPropertiesString : 'user created selection identification portfolio',
                    deepPopulateArray : [
                        'portfolio',
                        'identification.projectManager','identification.backupProjectManager'
                    ]
                }, function(res){
                    selectedPortfolioRanking = res;
                    $scope.selectedAssignment.assignedProjects = _.map(res.projects, function(project){
                        return {
                            _id: project._id,
                            idReference: project.identification.idReference,
                            name: project.identification.name
                        };
                    });
                    $scope.selectedAssignment.unassignedProjects = [];
                    _.forEach($scope.projects, function(project){
                        //Check if project belongs to ranking portfolio
                        if(project.portfolio && (project.portfolio._id === node._id)){
                            // Check if the project has been already added to the ranking, if not then push it in the unassigned
                            if(!_.find(res.projects,'_id', project._id)){
                                $scope.selectedAssignment.unassignedProjects.push({
                                    _id: project._id,
                                    idReference : project.identification.idReference,
                                    name: project.identification.name
                                });
                            }
                        }

                    });
                });
            }
		};


		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
            // Check for user authorization
            accept: function (sourceItemHandleScope, destSortableScope) {
                return userHasAuthorization;
            },
            // Just save the all "projects" array property to the object on the server every time there is a change
			itemMoved: function (eventObj) {
                if(eventObj){
                    // Clean up the "assignedProjects" array from the deep populate and get only IDs
                    var cleanProjectsArray = _.map($scope.selectedAssignment.assignedProjects, function(project){
                        return project._id;
                    });
                    // Save the new "projects" array to the server
                    if(overallSelected){
                        OverallRankings.update({overallRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    } else {
                        PortfolioRankings.update({portfolioRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    }
                }
			},
            orderChanged: function(eventObj) {
                if(eventObj){
                    // Clean up the "assignedProjects" array from the deep populate and get only IDs
                    var cleanProjectsArray = _.map($scope.selectedAssignment.assignedProjects, function(project){
                        return project._id;
                    });
                    // Save the new "projects" array to the server
                    if(overallSelected){
                        OverallRankings.update({overallRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    } else {
                        PortfolioRankings.update({portfolioRankingId: selectedPortfolioRanking._id},{projects: cleanProjectsArray}, function(res){
                            $scope.error = null;
                        }, function(err){
                            $scope.error = err.data.message;
                            eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                            eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, eventObj.source.itemScope.project);
                        });
                    }
                }
            }
		};


	}
]);

'use strict';

//Overall rankings service used to communicate Overall rankings REST endpoints
angular.module('portfolio-ranking-assignment').factory('OverallRankings', ['$resource',
	function($resource) {
		return $resource('overall-rankings/:overallRankingId', { overallRankingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Portfolio rankings service used to communicate Portfolio rankings REST endpoints
angular.module('portfolio-ranking-assignment').factory('PortfolioRankings', ['$resource',
	function($resource) {
		return $resource('portfolio-rankings/:portfolioRankingId', { portfolioRankingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-review-templates').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio review templates state routing
		$stateProvider.
		state('portfolio-review-templates', {
			url: '/portfolio-review-templates',
			templateUrl: 'modules/portfolio-review-templates/views/portfolio-review-templates.client.view.html'
		});
	}
]);
'use strict';

angular.module('portfolio-review-templates').controller('PortfolioReviewTemplatesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'PortfolioReviewTemplates', 'PortfolioReviewTypes', 'PeoplePortfolioGroups', '$q','_',
	function($rootScope, $scope, $stateParams, $location, Authentication, PortfolioReviewTemplates, PortfolioReviewTypes, PeoplePortfolioGroups, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

			PortfolioReviewTemplates.query(function (res) {
				$scope.templates = res;
			}, function (err) {
				$scope.initError.push(err.data.message);
			});

			PortfolioReviewTypes.query(function (res) {
				$scope.templateTypes = res;
			}, function (err) {
				$scope.initError.push(err.data.message);
			});

			PeoplePortfolioGroups.query(function (res) {
				$scope.stakeholderGroups = res;
			}, function (err) {
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

		// ------------------- NG-SWITCH ---------------------

		$scope.switchTemplateForm = {};

		$scope.selectTemplateForm = function(template, string){
			if(string === 'view'){ $scope.switchTemplateForm[template._id] = 'view';}
			if(string === 'edit'){$scope.switchTemplateForm[template._id] = 'edit';}
		};

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchItemForm = {};

		$scope.selectItemForm = function(item, string){
			if(string === 'view'){ $scope.switchItemForm[item._id] = 'view';}
			if(string === 'edit'){$scope.switchItemForm[item._id] = 'edit';}
		};

		// ----------------- REFRESH TEMPLATE LIST ------------

		$scope.templateList = function(){
			PortfolioReviewTemplates.query(function(templates){
				$scope.templates = templates;
			});
		};


		// ------------------- CALCULATE WEIGHTS -------------

		$scope.getTotalTemplateWeights = function(template){
			if(template){
				return _.reduce(template.groups, function(memo, group){
					return memo + group.weight;
				}, 0);
			}
		};

		$scope.getTotalItemWeights = function(group){
			if(group){
				return _.reduce(group.items, function(memo, impact){
					return memo + impact.weight;
				}, 0);
			}
		};



		// ------------------ CREATE TEMPLATE ----------------

		$scope.newTemplate = {};

		$scope.showNewTemplateForm = false;

		$scope.saveNewTemplate = function(newTemplate) {
			$scope.error = null;
			var template = new PortfolioReviewTemplates ({
				name: newTemplate.name,
				type: newTemplate.type,
				groups : []
			});
			template.$save(function(res) {
				$scope.error = null;
				$scope.newTemplate = {};
				$scope.showNewTemplateForm = false;
				$scope.templateList();
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewTemplate = function(){
			$scope.error = null;
			$scope.newTemplate = {};
			$scope.showNewTemplateForm = false;
		};

		// ------------------- EDIT TEMPLATE (HEADER ONLY) -----------------

		var originalEditTemplate = {};

		$scope.selectTemplate = function(template){
			originalEditTemplate = _.clone(template);
			$scope.selectedTemplate = template;
		};

		$scope.updateTemplate = function(template) {
			PortfolioReviewTemplates.update({
				_id: template._id,
				name: template.name,
				type : template.type,
				description: template.description
			}, function(template){
				$scope.error = null;
				$scope.selectTemplateForm(template, 'view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditTemplate = function(template){
			$scope.error = null;
			$scope.selectedTemplate.name = originalEditTemplate.name;
			$scope.selectedTemplate.description = originalEditTemplate.description;
			$scope.selectedTemplate.type = originalEditTemplate.type;
			$scope.selectTemplateForm(template, 'view');
		};


		// ------------------ CREATE REVIEW GROUP ----------------

		$scope.createGroup = function(template) {
			var newGroup = {
				name : 'New group',
				weight : 0,
				peopleGroups : [],
				items : []
			};
			PortfolioReviewTemplates.createGroup(
				{
					portfolioReviewTemplateId: template._id
				}, newGroup,
				function (res) {
					$scope.error = null;
					template.groups.push(res);
				},
				function (err) {
					console.log(err.data.message);
					$scope.error = err.data.message;
				}
			);
		};


		// ------------------- EDIT GROUP (HEADER ONLY) -----------------

		var originalEditGroup = {};
		$scope.selectedStakeholderGroup = {};

		$scope.selectGroup = function(group){
			$scope.selectedStakeholderGroup[group._id] = null;
			originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(template, group) {
			PortfolioReviewTemplates.updateGroup({
				portfolioReviewTemplateId : template._id,
				groupId : group._id
			}, group, function(res){
				$scope.error = null;
				$scope.selectGroupForm(res, 'view');
			},function(err){
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
			group.description = originalEditGroup[group._id].description;
			group.weight = originalEditGroup[group._id].weight;
			$scope.selectGroupForm(group, 'view');
		};



		// ----- ADD/REMOVE STAKEHOLDER GROUPS ----



		$scope.getAllowedStakeholderGroups = function(reviewGroup){
			return _.filter($scope.stakeholderGroups, function(stakeholderGroup){
				return !_.find(reviewGroup.peopleGroups, function(sGroup){
					return sGroup._id === stakeholderGroup._id;
				});
			});
		};

		$scope.stringForAllowedStakeholderGroups = 'No selectable groups';

		$scope.addStakeholderGroup = function(template, group, stakeholderGroup){
			$scope.selectedStakeholderGroup[group._id] = null;
			PortfolioReviewTemplates.addStakeholderGroup(
				{
					portfolioReviewTemplateId : template._id,
					groupId : group._id,
					peopleGroupId : stakeholderGroup._id
				}, stakeholderGroup,
				function (res) {
					$scope.error = null;
					group.peopleGroups.push(stakeholderGroup);
				},
				function (err) {
					$scope.error = err.data.message;
				}
			);
		};

		$scope.removeStakeholderGroup = function(template, group, stakeholderGroup){
			$scope.selectedStakeholderGroup[group._id] = null;
			PortfolioReviewTemplates.removeStakeholderGroup(
				{
					portfolioReviewTemplateId : template._id,
					groupId : group._id,
					peopleGroupId : stakeholderGroup._id
				}, stakeholderGroup,
				function (res) {
					$scope.error = null;
					group.peopleGroups = _.without(group.peopleGroups, stakeholderGroup);
				},
				function (err) {
					$scope.error = err.data.message;
				}
			);
		};



		// ------------------ CREATE ITEM ----------------

		$scope.createItem = function(template, group) {
			$scope.error = null;
			var newItem = {
				name: 'New review item',
				weight: 0,
				peopleReviews : []
			};

			PortfolioReviewTemplates.createItem(
				{
					portfolioReviewTemplateId : template._id,
					groupId : group._id
				}, newItem,
				function (res) {
					group.items.push(res);
				},
				function (err) {
					$scope.error = err.data.message;
				}
			);
		};

		// ------------------- EDIT ITEM (Header) -----------------

		var originalEditItem = {};

		$scope.selectEditItem = function(group, item){
			originalEditItem[item._id] = _.clone(item);
			$scope.selectItemForm(item, 'edit');
		};

		$scope.updateItem = function(template, group, item) {
			PortfolioReviewTemplates.updateItem({
				portfolioReviewTemplateId : template._id,
				groupId : group._id,
				itemId : item._id
			}, item, function(res){
				$scope.selectItemForm(item, 'view');
			},function(err){
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditItem = function(item){
			$scope.error = null;
			item.name = originalEditItem[item._id].name;
			item.description = originalEditItem[item._id].description;
			item.weight = originalEditItem[item._id].weight;
			$scope.selectItemForm(item, 'view');
		};


		// ------------------- DELETE TEMPLATE -----------------

		$scope.removeTemplate = function(template) {
			$scope.error = null;
			template.$remove(function(response) {
				$scope.selectedTemplate = null;
				$scope.templateList();

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------- DELETE GROUP -----------------

		$scope.removeGroup = function(template, group) {
			$scope.error = null;

			PortfolioReviewTemplates.deleteGroup({
				portfolioReviewTemplateId : template._id,
				groupId : group._id
			}, group, function(res){
				template.groups = _.without(template.groups, group);
			}, function(err){
				$scope.error = err.data.message;
			});
		};


		// ------------------- DELETE ITEM -----------------

		$scope.removeItem = function(template, group, item) {
			$scope.error = null;
			PortfolioReviewTemplates.deleteItem({
				portfolioReviewTemplateId : template._id,
				groupId : group._id,
				itemId : item._id
			}, item, function(res){
				group.items = _.without(group.items, item);
			}, function(err){
				$scope.error = err.data.message;
			});
		};



	}
]);

'use strict';

//Portfolio review templates service used to communicate Portfolio review templates REST endpoints
angular.module('portfolio-review-templates').factory('PortfolioReviewTemplates', ['$resource',
	function($resource) {
		return $resource('portfolio-review-templates/:portfolioReviewTemplateId', { portfolioReviewTemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Review Group --

			createGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups'
				// req.body: {new group obj}
			},

			updateGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/update'
				// req.body: {new group obj}
			},

			deleteGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/delete'
				// req.body: {new group obj}
			},

			// --- Add/Remove Stakeholder Groups ---

			addStakeholderGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/add'
				// req.body: {new group obj}
			},

			removeStakeholderGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/remove'
				// req.body: {new group obj}
			},

			// --- Review Item --

			createItem: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items'
				// req.body: {new group obj}
			},

			updateItem: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items/:itemId/update'
				// req.body: {new group obj}
			},

			deleteItem: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items/:itemId/delete'
				// req.body: {new group obj}
			}


		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('portfolio-reviews').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Portfolio reviews', 'portfolio-reviews', 'dropdown', '/portfolio-reviews(/create)?');
		//Menus.addSubMenuItem('topbar', 'portfolio-reviews', 'List Portfolio reviews', 'portfolio-reviews');
		//Menus.addSubMenuItem('topbar', 'portfolio-reviews', 'New Portfolio review', 'portfolio-reviews/create');
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio reviews state routing
		$stateProvider.
		state('portfolio-reviews', {
			url: '/portfolio-reviews',
			templateUrl: 'modules/portfolio-reviews/views/portfolio-reviews.client.view.html'
		})
        .state('portfolio-reviews-id', {
            url: '/portfolio-reviews/:portfolioReviewId/portfolios/:portfolioId',
            templateUrl: 'modules/portfolio-reviews/views/portfolio-reviews.client.view.html'
        });
	}
]);

'use strict';

// Portfolio reviews controller
angular.module('portfolio-reviews').controller('PortfolioReviewsController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'PortfolioReviewTemplates', 'ProjectReviewScores', 'PortfolioReviewTypes','PortfolioReviews',
	'PeoplePortfolioGroups',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 PortfolioReviewTemplates, ProjectReviewScores, PortfolioReviewTypes, PortfolioReviews,
			 PeoplePortfolioGroups) {


		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(res){
				$scope.projects = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			Portfolios.query(function(res){
				$scope.portfolios = res;
				$scope.portfolioTrees = createNodeTrees(res);
                // From myTao page
                if($stateParams.portfolioId){
                    var foundPortfolio = _.find(res, _.matchesProperty('_id', $stateParams.portfolioId));
                    if(foundPortfolio){
                        $scope.selectPortfolio(foundPortfolio);
                    } else {
                        $scope.error = 'Cannot find portfolio' + $stateParams.portfolioId;
                        $stateParams.portfolioReviewId = null;
                    }
                }
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			PortfolioReviewTemplates.query(function(res){
				$scope.portfolioReviewTemplates = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			ProjectReviewScores.query(function(res){
				$scope.projectReviewScores = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			PortfolioReviewTypes.query(function(res){
				$scope.portfolioReviewTypes = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			PeoplePortfolioGroups.query(function(res){
				$scope.peoplePortfolioGroups = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasManagementAuthorization = function(action, userData, portfolio){

            // Guard against undefined at view startup
            if(action && userData && portfolio){

                var userIsSuperhero, userIsPortfolioManager, userIsBackupPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsPortfolioManager = userData._id === portfolio.portfolioManager;
                    userIsBackupPortfolioManager = userData._id === portfolio.backupPortfolioManager;

                    return userIsSuperhero || userIsPortfolioManager || userIsBackupPortfolioManager;
                }
            }
        };

        $scope.userHasReviewAuthorization = function(action, userData, peopleReview){

            // Guard against undefined at view startup
            if(action && userData && peopleReview){

                var userIsSuperhero, userIsReviewer;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    if(peopleReview.person){
                        userIsReviewer = (userData._id === peopleReview.person._id);
                    }
                    return userIsSuperhero || userIsReviewer;
                }
            }
        };


        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


		// ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioForm = '';
		$scope.selectPortfolioForm = function(string){
			if(string === 'default'){ $scope.switchPortfolioForm = 'default';}
			if(string === 'new'){$scope.switchPortfolioForm = 'new';}
			if(string === 'view'){ $scope.switchPortfolioForm = 'view';}
			if(string === 'edit'){$scope.switchPortfolioForm = 'edit';}
		};

		$scope.switchHeaderForm = {};
		$scope.selectHeaderForm = function(string, portfolioReview){
			if(string === 'view'){ $scope.switchHeaderForm[portfolioReview._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[portfolioReview._id] = 'edit';}
		};

		$scope.switchPeopleReviewForm = {};
		$scope.selectPeopleReviewForm = function(string, peopleReview){
			if(string === 'view'){ $scope.switchPeopleReviewForm[peopleReview._id] = 'view';}
			if(string === 'edit'){$scope.switchPeopleReviewForm[peopleReview._id] = 'edit';}
		};

		$scope.switchWorkflowForm = {};
		$scope.selectWorkflowForm = function(string, portfolioReview){
			if(string === 'view'){ $scope.switchWorkflowForm[portfolioReview._id] = 'view';}
			if(string === 'edit'){$scope.switchWorkflowForm[portfolioReview._id] = 'edit';}
		};




		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortAppliedChanges = function(record) {
			return new Date(record.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.portfolioReviewDetails = 'header';

		// ------------- SELECT VIEW PROJECT ------------

		var originalPortfolioReview = {};

		$scope.selectPortfolio = function(portfolio) {
			$scope.error = null;
			$scope.selectedPortfolio = null;
			$scope.portfolioReviews = null;

			$scope.selectedPortfolioReview = null;
			originalPortfolioReview = {};

			$scope.selectedPortfolio = portfolio;

			PortfolioReviews.query({
				portfolio: portfolio._id
			}, function (res) {
				$scope.portfolioReviews = res;
                // From myTao page, triggered from Portfolios.query in init()
                if($stateParams.portfolioReviewId){
                    var foundPortfolioReview = _.find($scope.portfolioReviews, _.matchesProperty('_id', $stateParams.portfolioReviewId));
                    if(foundPortfolioReview){
                        $scope.selectPortfolioReview(foundPortfolioReview);
                    } else {
                        $scope.error = 'Cannot find portfolio review' + $stateParams.portfolioReviewId;
                    }
                }
			}, function (err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelViewPortfolio = function(){
			$scope.error = null;
			$scope.selectedPortfolio = null;
			$scope.portfolioReviews = null;

		};



		// ------------- NEW PROJECT REVIEW ------------

		$scope.newStartDateOpened = {};
		$scope.openNewStartDate = function(portfolio, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.newStartDateOpened[portfolio._id] = true;
		};

		$scope.newEndDateOpened = {};
		$scope.openNewEndDate = function(portfolio, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.newEndDateOpened[portfolio._id] = true;
		};

		$scope.newPortfolioReview = {};

		$scope.allowedPortfolioReviewTemplates = function(){
			return _.filter($scope.portfolioReviewTemplates, _.matchesProperty('type', $scope.newPortfolioReview.type));
		};

		$scope.createNewPortfolioReview = function(portfolio){
			$scope.error = null;
			var newPortfolioReview = new PortfolioReviews({
				portfolio: portfolio._id,
				name : $scope.newPortfolioReview.name,
				startDate : $scope.newPortfolioReview.startDate,
				endDate : $scope.newPortfolioReview.startDate,
				// type : will be populated automatically on server side from template
				template : $scope.newPortfolioReview.template
			});
			newPortfolioReview.$save(function(res) {
				// Clear new form
				$scope.newPortfolioReview = {};
				// Refresh the list of reviews
				$scope.portfolioReviews.push(res);
				// Select in view mode the new review
				$scope.selectPortfolioReview(res);
				// Close new review form done directly in the view's html
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewPortfolioReview = function(){
			$scope.error = null;
			$scope.newPortfolioReview = {};
		};


		// ------------- SELECT PROJECT REVIEW ------------


		$scope.selectPortfolioReview = function(portfolioReview){
			$scope.error = null;
			$scope.selectedPortfolioReview = portfolioReview;
			originalPortfolioReview[portfolioReview._id] = _.cloneDeep(portfolioReview);
		};


		// -------------------------------------------------------- HEADER -------------------------------------------------

		$scope.editStartDateOpened = {};
		$scope.openEditStartDate = function(review, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.editStartDateOpened[review._id] = true;
		};

		$scope.editEndDateOpened = {};
		$scope.openEditEndDate = function(review, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.editEndDateOpened[review._id] = true;
		};

		$scope.editHeader = function(portfolioReview){
			originalPortfolioReview[portfolioReview._id] = _.cloneDeep(portfolioReview);
			$scope.selectHeaderForm('edit', portfolioReview);
		};

		$scope.saveEditHeader = function(portfolioReview){
			// Clean-up deepPopulate
			var copyPortfolioReview = _.cloneDeep(portfolioReview);

			// Update server header
			PortfolioReviews.updateHeader(
				{
					portfolioReviewId : copyPortfolioReview._id
				}, copyPortfolioReview,
				function(res){
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', portfolioReview);
				},
				function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditHeader = function(portfolioReview){
			$scope.error = null;
			portfolioReview.name = originalPortfolioReview[portfolioReview._id].name;
			portfolioReview.startDate = originalPortfolioReview[portfolioReview._id].startDate;
			portfolioReview.endDate = originalPortfolioReview[portfolioReview._id].endDate;
			portfolioReview.description = originalPortfolioReview[portfolioReview._id].description;
			$scope.selectHeaderForm('view', portfolioReview);
		};


		$scope.deletePortfolioReview = function(portfolioReview){
			PortfolioReviews.remove({
				portfolioReviewId: portfolioReview._id
			}, portfolioReview, function(res){
				$scope.portfolioReviews = _.without($scope.portfolioReviews, portfolioReview);
				$scope.cancelNewPortfolioReview();
				$scope.selectedPortfolioReview = null;
				originalPortfolioReview = {};
			}, function(err){
				$scope.error = err.data.message;
			});
		};



		// -------------------------------------------------------- PEOPLE REVIEWS -------------------------------------------------

		$scope.oneAtATime = true;

		var originalPeopleReview = {};

		$scope.editPeopleReview = function(peopleReview){
			$scope.error = null;
			$scope.selectPeopleReviewForm('edit', peopleReview);
			originalPeopleReview[peopleReview._id] = _.cloneDeep(peopleReview);
		};

		$scope.saveEditPeopleReview = function(portfolioReview, reviewGroup, reviewItem, peopleReview){
			// Clean-up deepPopulate
			var copyPeopleReview = _.cloneDeep(peopleReview);
			copyPeopleReview.person = copyPeopleReview.person._id;

			// Update server header
			PortfolioReviews.updatePeopleReview(
				{
					portfolioReviewId : portfolioReview._id,
					groupId : reviewGroup._id,
					itemId : reviewItem._id,
					peopleReviewId : peopleReview._id
				}, copyPeopleReview,
				function(res){
					// Close edit header form and back to view
					$scope.selectPeopleReviewForm('view', peopleReview);
				},
				function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditPeopleReview = function(peopleReview){
			peopleReview.score = originalPeopleReview[peopleReview._id].score;
			peopleReview.comment = originalPeopleReview[peopleReview._id].comment;
			$scope.error = null;
			$scope.selectPeopleReviewForm('view', peopleReview);
		};

		$scope.submitPeopleReview = function(portfolioReview, reviewGroup, reviewItem, peopleReview){
			$scope.error = null;
			// Clean-up deepPopulate
			var copyPeopleReview = _.cloneDeep(peopleReview);
			copyPeopleReview.person = copyPeopleReview.person._id;

			PortfolioReviews.submitPeopleReview(
				{
					portfolioReviewId : portfolioReview._id,
					groupId : reviewGroup._id,
					itemId : reviewItem._id,
					peopleReviewId : peopleReview._id
				}, copyPeopleReview,
				function(res){
					peopleReview.submitted = res.submitted;
					// Close edit header form and back to view
					$scope.selectPeopleReviewForm('view', peopleReview);
				},
				function(err){
					$scope.error = err.data.message;
				}
			);
		};




		// -------------------------------------------------------- APPROVAL -------------------------------------------------


		$scope.submit = function(portfolioReview){
			$scope.error = null;
			PortfolioReviews.submit(
				{
					portfolioReviewId : portfolioReview._id
				}, portfolioReview,
				function(res){
					portfolioReview.approval = res.approval;
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		$scope.complete = function(portfolioReview){
			$scope.error = null;
			PortfolioReviews.complete(
				{
					portfolioReviewId : portfolioReview._id
				}, portfolioReview,
				function(res){
					portfolioReview.approval = res.approval;
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		$scope.draft = function(portfolioReview){
			$scope.error = null;
			PortfolioReviews.draft(
				{
					portfolioReviewId : portfolioReview._id
				}, portfolioReview,
				function(res){
					portfolioReview.approval = res.approval;
				},
				function(err){$scope.error = err.data.message;}
			);
		};


	}
]);

'use strict';

//Portfolio reviews service used to communicate Portfolio reviews REST endpoints
angular.module('portfolio-reviews').factory('PortfolioReviews', ['$resource',
	function($resource) {
		return $resource('portfolio-reviews/:portfolioReviewId', { portfolioReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/header'
				// req.body: {whole gate review object}
			},

			// --- People reviews --

			updatePeopleReview: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update'
				// req.body: {outcomeReview object}
			},

			submitPeopleReview: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit'
				// req.body: {outcomeReview object}
			},

			// --- Approval --

			submit: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/submit'
				// req.body: {whole gate review object}
			},

			complete: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/complete'
				// req.body: {whole gate review object}
			},

			draft: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/draft'
				// req.body: {whole gate review object}
			}

		});
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-setup').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio setup state routing
		$stateProvider.
		state('portfolio-setup', {
			url: '/portfolio-setup',
			templateUrl: 'modules/portfolio-setup/views/portfolio-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('portfolio-setup').controller('PortfolioSetupController', ['$rootScope','$scope', '$stateParams', '$location', 'Authentication',
	'Portfolios','PortfolioTypes','Subusers','_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Portfolios, PortfolioTypes, Subusers, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Subusers.query(function(users){
				$scope.users = users;
				$scope.portfolioManagers = _.filter(users, function(user){
					return _.find(_.get(user,'roles'), function(role){
						return role === 'portfolioManager';
					});
				});
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PortfolioTypes.query(function(portfolioTypes){
				$scope.portfolioTypes = _.clone(portfolioTypes);
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


        // ------- UTILITIES ------

        var allowNull = function(obj){
            if(obj){
                return obj._id;
            }
            return null;
        };



// ----------------------------------------------- PORTFOLIO TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchTypeForm = {};

		$scope.selectTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findTypes = function() {
			$scope.initError = [];
			PortfolioTypes.query(function(types){
				$scope.portfolioTypes = _.clone(types);
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		$scope.selectType = function(type){
			$scope.selectTypeForm(type, 'edit');
		};

		$scope.updateType = function(type) {
			type.$update(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditType = function(type){
			$scope.findTypes();
			$scope.selectTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeType = function(type) {
			type.$remove(function(response) {
				$scope.findTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createType = function() {
			var portfolioType = new PortfolioTypes ({
				name: 'New portfolio type'
			});
			portfolioType.$save(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};




// ----------------------------------------------- PORTFOLIOS --------------------------------------------


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};

		// Create ancestors array: add parent and parent's ancestors to child's ancestors. Returns ancestors array.
		var ancestorsArray = function(parent){
			if(parent){
				var retArray = [];
				retArray.push(parent._id);
				_.map(parent.ancestors, function(ancestor){
					retArray.push(ancestor);
				});
				return retArray;
			} else {return [];}
		};

		// allow the moving of children back to root
		var editParent = function(parent){
			if(parent){
				return _.get($scope.editPortfolio,'parent._id');
			} else {
				return null;
			}
		};

		// ------------- REFRESH PORTFOLIO LIST ------------

		$scope.portfolioList = function(){
			$scope.initError = [];
			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioForm = 'view';

		$scope.selectPortfolioForm = function(string){
			if(string === 'view'){ $scope.switchPortfolioForm = 'view';}
			if(string === 'new'){$scope.switchPortfolioForm = 'new';}
			if(string === 'edit'){$scope.switchPortfolioForm = 'edit';}
		};


		// ------------- VIEW ONE PORTFOLIO ---------------------

		var masterPortfolio;

		$scope.selectPortfolio = function(portfolioId){
			$scope.selectPortfolioForm('view');
			Portfolios.get({
				portfolioId:portfolioId,
				retPropertiesString : 'user created name parent ancestors type portfolioManager backupPortfolioManager earmarkedFunds budget',
				deepPopulateArray : ['parent','type','portfolioManager','backupPortfolioManager']
			}, function(portfolio){
				masterPortfolio = portfolio;
				$scope.viewPortfolio = _.clone(portfolio);
				$scope.editPortfolio = _.clone(portfolio);

				// Only nodes without children can be moved
				// A portfolio cannot be a child of himself.
				// Can only be moved to nodes without children or that have only one layer of children.
				if(_.find($scope.portfolios, function(chkItem){
						return _.get(chkItem,'parent') === portfolio._id;
					})){$scope.editParents = [_.get(portfolio,'parent')];} else {
					$scope.editParents = _.filter($scope.portfolios, function(item){
						if(item._id === portfolioId){return false;}
						else {
							if(_.isNull(item.parent) || _.isUndefined(item.parent)){return true;} else {
								if(
									_.find($scope.portfolios, function(chkItem){
										return _.get(chkItem,'parent') === item._id && (
												_.find($scope.portfolios, function(chkItem2){
													return _.get(chkItem2,'parent') === chkItem._id;
												})
											);
									})
								){return false;} else {
									return true;
								}
							}
						}
					});
				}
				$scope.error = null;
			}, function(errorResponse){$scope.error = errorResponse.data.message;});
		};

		// ------------ EDIT ONE PORTFOLIO ---------------

		$scope.update = function() {
			masterPortfolio.name = _.get($scope.editPortfolio,'name');
			masterPortfolio.portfolioManager = allowNull($scope.editPortfolio.portfolioManager);
			masterPortfolio.backupPortfolioManager = allowNull($scope.editPortfolio.backupPortfolioManager);
			masterPortfolio.parent = editParent(_.get($scope.editPortfolio,'parent'));
			masterPortfolio.type = allowNull($scope.editPortfolio.type);
			masterPortfolio.earmarkedFunds = _.get($scope.editPortfolio,'earmarkedFunds');
			masterPortfolio.ancestors = ancestorsArray(_.get($scope.editPortfolio,'parent'));

			masterPortfolio.$update(function() {
				$scope.portfolioList();
				$scope.selectPortfolio(masterPortfolio._id);
				$scope.selectPortfolioForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		// ------------ DELETE PORTFOLIO -------------

		$scope.remove = function() {
			// Only nodes with no children can be deleted
			if(_.find($scope.portfolios, function(chkItem){
					return _.get(chkItem,'parent') === masterPortfolio._id;
				})){
				$scope.error = 'Only portfolios without children can be deleted';
			} else {
				masterPortfolio.$remove(function(response){
					for (var i in $scope.portfolios) {
						if ($scope.portfolios[i] === masterPortfolio) {
							$scope.portfolios.splice(i, 1);
						}
					}
					//refresh the list after removing
					$scope.portfolioList();
					// close edit
					$scope.selectPortfolioForm('view');
					$scope.editPortfolio = null;

				}, function(errorResponse){
					$scope.error = errorResponse.data.message;
				});
			}
		};


		// -------------------- CREATE NEW PORTFOLIO ----------------

		$scope.selectNewPortfolio = function(){

			$scope.selectPortfolioForm('new');

			$scope.error = null;

			$scope.newPortfolio = {};
			$scope.newPortfolio.name = null;
			$scope.newPortfolio.portfolioManager = null;
			$scope.newPortfolio.backupPortfolioManager = null;
			$scope.newPortfolio.type = null;
			$scope.newPortfolio.parent = null;
			$scope.newPortfolio.earmarkedFunds = null;

			// A new portfolio can be a child of:
			// any root
			// or a child that it's either last level (no parent) or, if parent, its child has no children


			$scope.newParents = _.filter($scope.portfolios, function(item){
				if(_.isNull(item.parent) || _.isUndefined(item.parent)){return true;} else {
					if(_.find($scope.portfolios, function(chkItem){
							return _.get(chkItem,'parent') === item._id && (
									_.find($scope.portfolios, function(chkItem2){
										return _.get(chkItem2,'parent') === chkItem._id;
									})
								);
						})
					){return false;} else {
						return true;
					}
				}
			});
		};

		$scope.create = function() {
			// Create new Portfolio object
			var portfolio = new Portfolios ({
				name: _.get($scope.newPortfolio,'name'),
				portfolioManager: _.get($scope.newPortfolio,'portfolioManager._id'),
				backupPortfolioManager: _.get($scope.newPortfolio,'backupPortfolioManager._id'),
				type: _.get($scope.newPortfolio,'type._id'),
				parent: _.get($scope.newPortfolio,'parent._id'),
				ancestors: ancestorsArray(_.get($scope.newPortfolio,'parent')),
				earmarkedFunds: _.get($scope.newPortfolio,'earmarkedFunds')
			});

			portfolio.$save(function(response) {
				//Refresh after save
				$scope.portfolioList();
				$scope.selectPortfolio(response._id);
				$scope.selectPortfolioForm('view');

				// Clear form fields
				$scope.newPortfolio.name = null;
				$scope.newPortfolio.portfolioManager = null;
				$scope.newPortfolio.backupPortfolioManager = null;
				$scope.newPortfolio.type = null;
				$scope.newPortfolio.parent = null;
				$scope.newPortfolio.earmarkedFunds = null;

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

'use strict';

//Portfolio types service used to communicate Portfolio types REST endpoints
angular.module('portfolio-setup').factory('PortfolioTypes', ['$resource',
	function($resource) {
		return $resource('portfolio-types/:portfolioTypeId', { portfolioTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Portfolios service used to communicate Portfolios REST endpoints
angular.module('portfolio-setup').factory('Portfolios', ['$resource',
	function($resource) {
		return $resource('portfolios/:portfolioId', { portfolioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            // Stakeholders

            createAssignedRole: {
                method: 'POST',
                url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/assignedRoles'
                // req.body: {the whole "assignedRole" object}
            },

            updateAssignedRole: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/assignedRoles/:assignedRoleId'
                // req.body: {the whole "assignedRole" object}
            },

            deleteAssignedRole: {
                method: 'DELETE',
                url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/assignedRoles/:assignedRoleId'
                // req.body: {the whole "assignedRole" object}
            }
            
		});
	}
]);

/*

 GET (using "getById"): add "query" properties to set return-properties and deep populate in addition to the "portfolioId"

 if(req.query.retPropertiesString){
 retPropertiesString = req.query.retPropertiesString;
 }

 if(req.query.deepPopulateArray){
 deepPopulateArray = req.query.deepPopulateArray;
 }

 QUERY (using "list"): the server will automatically filter the return objects based on any property added to the "query"


 */

'use strict';

//Setting up route
angular.module('portfolio-status-reports').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio status reports state routing
		$stateProvider.
        state('listPortfolioStatusReports', {
            url: '/portfolio-status-reports',
            templateUrl: 'modules/portfolio-status-reports/views/list-portfolio-status-reports.client.view.html'
        }).
        state('listPortfolioStatusReportsWithPortfolioId', {
            url: '/portfolio-status-reports/list/:portfolioId',
            templateUrl: 'modules/portfolio-status-reports/views/list-portfolio-status-reports.client.view.html'
        }).
        state('createPortfolioStatusReport', {
            url: '/portfolio-status-reports/create',
            templateUrl: 'modules/portfolio-status-reports/views/create-portfolio-status-report.client.view.html'
        }).
        state('editPortfolioStatusReport', {
            url: '/portfolio-status-reports/document/:portfolioStatusReportId/list/:portfolioId',
            templateUrl: 'modules/portfolio-status-reports/views/edit-portfolio-status-report.client.view.html'
        });
	}
]);

'use strict';

angular.module('portfolio-status-reports').controller('PortfolioStatusReportsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_', 'GateProcessTemplates', 'LogStatusIndicators', 'PortfolioStatusReports', '$modal', 'StatusReportTypes',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, LogStatusIndicators, PortfolioStatusReports, $modal, StatusReportTypes) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ------------- INIT -------------

        vm.isResolving = false;

        vm.initError = [];

        vm.init = function(){

            vm.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                vm.projects = projects;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
                // If there is a stateParam _id , then select a portfolio
                if($stateParams.portfolioId){
                    var requestedPortfolio = _.find(vm.portfolios, _.matchesProperty('_id', $stateParams.portfolioId));
                    if(requestedPortfolio){
                        vm.selectPortfolio(requestedPortfolio);
                    } else {
                        vm.error = 'Cannot find Portfolio with id: ' + $stateParams.portfolioId;
                    }
                }
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcessTemplates.query(function(gateProcesses){
                vm.gateProcesses = gateProcesses;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(logStatusIndicators){
                vm.logStatusIndicators = logStatusIndicators;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            StatusReportTypes.query(function(res){
                vm.statusReportTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };

        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, portfolio){

            return true;

        };

        // ------------------- NG-SWITCH ---------------------

        // Title

        vm.switchHeaderTitleForm = {};
        vm.selectHeaderTitleForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderTitleForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderTitleForm[document._id] = 'edit';}
        };

        // Type

        vm.switchHeaderTypeForm = {};
        vm.selectHeaderTypeForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderTypeForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderTypeForm[document._id] = 'edit';}
        };

        // Date

        vm.switchHeaderDateForm = {};
        vm.selectHeaderDateForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderDateForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderDateForm[document._id] = 'edit';}
        };
        
        // Delivery Status

        vm.switchOverallStatusForm = {};
        vm.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ vm.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchOverallStatusForm[document._id] = 'edit';}
        };

        vm.switchStatusAreaForm = {};
        vm.selectStatusAreaForm = function(string, statusAreaReview){
            if(string === 'view'){ vm.switchStatusAreaForm[statusAreaReview._id] = 'view';}
            if(string === 'edit'){vm.switchStatusAreaForm[statusAreaReview._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        vm.sortChangeRequests = function(doc) {
            return new Date(doc.updateDate);
        };

        vm.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        vm.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        vm.showNewDocumentForm = false;

        vm.documentDetails = 'header';

        vm.activeTab = {};


        // ------------- SELECT PORTFOLIO ------------


        vm.selectPortfolio = function(portfolio) {
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.query({'portfolio._id' : portfolio._id},
                function(res){
                    vm.isResolving = false;
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                    vm.selectedPortfolio = portfolio;
                    vm.portfolioStatusReports = res;
                }, 
                function(err){
                    vm.isResolving = false;
                    vm.error = err;
                }
            );
        };


        // ----------- NEW STATUS UPDATE ------------


        vm.newHeaderDateOpened = {};

        vm.openNewHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.newHeaderDateOpened[document._id] = true;
        };

        vm.newDocument = {};

        vm.createNewDocument = function(portfolio){

            var newDocument = new PortfolioStatusReports({
                portfolio : {
                    _id : portfolio._id,
                    name : portfolio.name
                },
                type : {
                    _id: (vm.newDocument.type && vm.newDocument.type._id) || null,
                    name: (vm.newDocument.type && vm.newDocument.type.name) || null
                },
                date : vm.newDocument.updateDate,
                title : vm.newDocument.title,
                previousReport : {
                    _id : vm.newDocument.previousReport && vm.newDocument.previousReport._id,
                    title : vm.newDocument.previousReport && vm.newDocument.previousReport.title,
                    date : vm.newDocument.previousReport && vm.newDocument.previousReport.date
                }
            });

            vm.error = null;
            vm.isResolving = true;
            newDocument.$save(
                function(res){
                    vm.isResolving = false;
                    vm.portfolioStatusReports.push(res);
                    vm.newDocument = {};
                    vm.showNewDocumentForm = false;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelNewDocument = function(){
            vm.error = null;
            vm.showNewDocumentForm = false;
            vm.newDocument = {};
        };


        // ------------- VIEW STATUS REPORT ------------
        
        
        vm.goToDocument = function(document, portfolio){
            $location.path('portfolio-status-reports/document/' + document._id + '/list/' + portfolio._id);
        };

        vm.initDocumentDetails = function(){

            vm.selectedPortfolioId = $stateParams.portfolioId;

            PortfolioStatusReports.get({
                portfolioStatusReportId: $stateParams.portfolioStatusReportId
            }, function(res){
                vm.selectedDocument = res;
                vm.selectedDocumentStatusAreas = _.chunk(res.deliveryStatus.portfolioStatusAreas, 2);
                console.log(res);
            }, function(err){
                vm.error = err.data.message;
            });

            StatusReportTypes.query(function(res){
                vm.statusReportTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };

        vm.goToList = function(selectedPortfolioId){
            $location.path('portfolio-status-reports/list/' + selectedPortfolioId);
        };



        // -------------------------------------------------------- HEADER -------------------------------------------------

        vm.headerDateOpened = {};
        vm.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.headerDateOpened[document._id] = true;
        };

        var originalHeaderTitle = {};
        var originalHeaderType = {};
        var originalHeaderDate = {};

        vm.editHeaderTitle = function(document){
            originalHeaderTitle[document._id] = {
                title : document.title
            };
            vm.selectHeaderTitleForm('edit', document);
        };

        vm.editHeaderType = function(document){
            originalHeaderType[document._id] = {
                type : document.type
            };
            vm.selectHeaderTypeForm('edit', document);
        };

        vm.editHeaderDate = function(document){
            originalHeaderDate[document._id] = {
                date : document.date
            };
            vm.selectHeaderDateForm('edit', document);
        };

        vm.saveEditHeaderTitle = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateHeader(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderTitleForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.saveEditHeaderType = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateHeader(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderTypeForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.saveEditHeaderDate = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateHeader(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderDateForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditHeaderTitle = function(document){
            vm.error = null;
            document.title = originalHeaderTitle[document._id].title;
            vm.selectHeaderTitleForm('view', document);
        };

        vm.cancelEditHeaderType = function(document){
            vm.error = null;
            document.type = originalHeaderType[document._id].type;
            vm.selectHeaderTypeForm('view', document);
        };

        vm.cancelEditHeaderDate = function(document){
            vm.error = null;
            document.date = originalHeaderDate[document._id].date;
            vm.selectHeaderDateForm('view', document);
        };


        // ------------- DELETE REPORT ----------------------------
        
        vm.deleteDocument = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.delete(
                {
                    portfolioStatusReportId: document._id
                }, document, function(res){
                    vm.isResolving = false;
                    vm.portfolioStatusReports = _.without(vm.portfolioStatusReports, document);
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                    // Redirect to list
                    $location.path('portfolio-status-reports');
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                });
        };


        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status

        var originalOverallStatus = {};

        vm.editOverallStatus = function(document){
            originalOverallStatus[document._id] = {
                comment : document.deliveryStatus.overallStatus.comment
            };
            vm.selectOverallStatusForm('edit', document);
        };

        vm.saveEditOverallStatus = function(document){

            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateOverallStatus(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    vm.selectOverallStatusForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOverallStatus = function(document){
            vm.error = null;
            document.deliveryStatus.overallStatus.comment = originalOverallStatus[document._id].comment;
            vm.selectOverallStatusForm('view', document);
        };

        // Status Area

        var originalStatusArea = {};

        vm.editStatusArea = function(statusArea){
            originalStatusArea[statusArea._id] = {
                comment : statusArea.comment
            };
            vm.selectStatusAreaForm('edit', statusArea);
        };

        vm.saveEditStatusArea = function(document, statusArea){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateStatusArea(
                {
                    portfolioStatusReportId : document._id,
                    portfolioStatusAreaId : statusArea._id
                }, statusArea,
                function(res){
                    vm.isResolving = false;
                    vm.selectStatusAreaForm('view', statusArea);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditStatusArea = function(statusArea){
            vm.error = null;
            statusArea.comment = originalStatusArea[statusArea._id].comment;
            vm.selectStatusAreaForm('view', statusArea);
        };


    }
]);

'use strict';

//Portfolio status reports service used to communicate Portfolio status reports REST endpoints
angular.module('portfolio-status-reports').factory('PortfolioStatusReports', ['$resource',
	function($resource) {
		return $resource('portfolio-status-reports/:portfolioStatusReportId', { portfolioStatusReportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            updateHeader: {
                method: 'PUT',
                url: 'portfolio-status-reports/:portfolioStatusReportId/header'
            },

            updateOverallStatus: {
                method: 'PUT',
                url: 'portfolio-status-reports/:portfolioStatusReportId/overallStatus'
            },

            updateStatusArea: {
                method: 'PUT',
                url: 'portfolio-status-reports/:portfolioStatusReportId/portfolioStatusAreas/:portfolioStatusAreaId'
            }
            
		});
	}
]);

'use strict';

//Setting up route
angular.module('portfolio-status-updates').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio status updates state routing
		$stateProvider.
		state('portfolio-status-updates', {
			url: '/portfolio-status-updates',
			templateUrl: 'modules/portfolio-status-updates/views/portfolio-status-updates.client.view.html'
		});
	}
]);

'use strict';

angular.module('portfolio-status-updates').controller('PortfolioStatusUpdatesController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
    'GateProcessTemplates', 'LogStatusIndicators','PortfolioStatusUpdates',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, LogStatusIndicators, PortfolioStatusUpdates) {

        $rootScope.staticMenu = false;

        // ------------- INIT -------------

        $scope.isResolving = false;

        $scope.initError = [];

        $scope.init = function(){

            $scope.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                $scope.projects = projects;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                $scope.portfolios = portfolios;
                $scope.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            GateProcessTemplates.query(function(gateProcesses){
                $scope.gateProcesses = gateProcesses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(logStatusIndicators){
                $scope.logStatusIndicators = logStatusIndicators;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

        };

        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, portfolio){

            return true;

        };

        // ------------------- NG-SWITCH ---------------------

        // Header

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, document){
            if(string === 'view'){ $scope.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[document._id] = 'edit';}
        };

        // Budget

        $scope.switchBudgetForm = {};
        $scope.selectBudgetForm = function(string, document){
            if(string === 'view'){ $scope.switchBudgetForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchBudgetForm[document._id] = 'edit';}
        };

        // Delivery Status

        $scope.switchOverallStatusForm = {};
        $scope.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchOverallStatusForm[document._id] = 'edit';}
        };

        // Status Areas

        $scope.switchStatusAreaForm = {};
        $scope.selectStatusAreaForm = function(string, statusAreaReview){
            if(string === 'view'){ $scope.switchStatusAreaForm[statusAreaReview._id] = 'view';}
            if(string === 'edit'){$scope.switchStatusAreaForm[statusAreaReview._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        $scope.sortChangeRequests = function(doc) {
            return new Date(doc.updateDate);
        };

        $scope.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        $scope.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        $scope.showNewDocumentForm = false;

        $scope.documentDetails = 'header';

        $scope.activeTab = {};


        // ------------- SELECT PORTFOLIO ------------


        $scope.selectPortfolio = function(portfolio) {
            $scope.cancelNewDocument();
            $scope.selectedDocument = null;
            $scope.selectedPortfolio = portfolio;

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.query({portfolio: portfolio._id},
                function(res){
                    $scope.isResolving = false;
                    $scope.portfolioStatusUpdates = res;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err;
                }
            );
        };
        

        // ----------- NEW STATUS UPDATE ------------


        $scope.newHeaderDateOpened = {};

        $scope.openNewHeaderDate = function(portfolio, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newHeaderDateOpened[portfolio._id] = true;
        };

        $scope.newDocument = {};

        $scope.createNewDocument = function(portfolio){

            var newDocument = new PortfolioStatusUpdates({
                portfolio : portfolio._id,
                updateDate : $scope.newDocument.updateDate,
                title : $scope.newDocument.title
            });

            $scope.error = null;
            $scope.isResolving = true;
            newDocument.$save(function(res){
                    $scope.isResolving = false;
                    $scope.portfolioStatusUpdates.push(res);
                    $scope.newDocument = {};
                    $scope.showNewDocumentForm = false;
                    $scope.selectDocument(res);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewDocument = function(){
            $scope.error = null;
            $scope.showNewDocumentForm = false;
            $scope.newDocument = {};
        };


        // ------------- SELECT STATUS UPDATE ------------


        $scope.selectDocument = function(doc){
            $scope.selectedDocument = doc;
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.headerDateOpened = {};
        $scope.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        $scope.editHeader = function(statusUpdate){
            originalHeader[statusUpdate._id] = {
                updateDate: statusUpdate.updateDate,
                title : statusUpdate.title,
                description : statusUpdate.description
            };
            $scope.selectHeaderForm('edit', statusUpdate);
        };

        $scope.saveEditHeader = function(portfolio, statusUpdate){
            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.updateHeader(
                {
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function(statusUpdate){
            $scope.error = null;
            statusUpdate.updateDate = originalHeader[statusUpdate._id].updateDate;
            statusUpdate.title = originalHeader[statusUpdate._id].title;
            statusUpdate.description = originalHeader[statusUpdate._id].description;
            $scope.selectHeaderForm('view', statusUpdate);
        };


        $scope.deleteDocument = function(statusUpdate){
            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.delete(
                {
                    portfolioStatusUpdateId: statusUpdate._id
                }, statusUpdate, function(res){
                    $scope.isResolving = false;
                    $scope.portfolioStatusUpdates = _.without($scope.portfolioStatusUpdates, statusUpdate);
                    $scope.cancelNewDocument();
                    $scope.selectedDocument = null;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                });
        };


        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status

        var originalOverallStatus = {};

        $scope.editOverallStatus = function(statusUpdate){
            originalOverallStatus[statusUpdate._id] = {
                newStatus: statusUpdate.portfolioStatus.overallStatusReview.newStatus,
                newComment : statusUpdate.portfolioStatus.overallStatusReview.newComment
            };
            $scope.selectOverallStatusForm('edit', statusUpdate);
        };

        $scope.saveEditOverallStatus = function(statusUpdate){

            // Avoid the "undefined" and make sure is "null" otherwise the gatePerformances groupBy considers them different
            statusUpdate.status._id = (statusUpdate.status && statusUpdate.status._id) || null;
            statusUpdate.status.name = (statusUpdate.status && statusUpdate.status.name) || null;
            statusUpdate.status.color = (statusUpdate.status && statusUpdate.status.color) || null;

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.updateOverallDeliveryStatus(
                {
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectOverallStatusForm('view', statusUpdate);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditOverallStatus = function(statusUpdate){
            $scope.error = null;
            statusUpdate.portfolioStatus.overallStatusReview.newStatus = originalOverallStatus[statusUpdate._id].newStatus;
            statusUpdate.portfolioStatus.overallStatusReview.newComment = originalOverallStatus[statusUpdate._id].newComment;
            $scope.selectOverallStatusForm('view', statusUpdate);
        };

        // Project status area reviews

        var originalStatusAreaReview = {};

        $scope.editStatusArea = function(statusAreaReview){
            originalStatusAreaReview[statusAreaReview._id] = _.cloneDeep(statusAreaReview);
            $scope.selectStatusAreaForm('edit', statusAreaReview);
        };

        $scope.saveEditStatusArea = function(statusUpdate, statusAreaReview){

            statusAreaReview.projectStatusArea.currentRecord.status._id = (statusAreaReview.projectStatusArea.currentRecord.status && statusAreaReview.projectStatusArea.currentRecord.status._id) || null;
            statusAreaReview.projectStatusArea.currentRecord.status.color = (statusAreaReview.projectStatusArea.currentRecord.status && statusAreaReview.projectStatusArea.currentRecord.status.color) || null;
            statusAreaReview.projectStatusArea.currentRecord.status.name = (statusAreaReview.projectStatusArea.currentRecord.status && statusAreaReview.projectStatusArea.currentRecord.status.name) || null;

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.updateStatusAreaReview(
                {
                    portfolioStatusUpdateId : statusUpdate._id,
                    statusAreaReviewId : statusAreaReview._id
                }, statusAreaReview,
                function(res){
                    $scope.isResolving = false;
                    $scope.selectStatusAreaForm('view', statusAreaReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatusArea = function(statusAreaReview){
            $scope.error = null;
            statusAreaReview.newStatus = originalStatusAreaReview[statusAreaReview._id].newStatus;
            statusAreaReview.newComment = originalStatusAreaReview[statusAreaReview._id].newComment;
            $scope.selectStatusAreaForm('view', statusAreaReview);
        };



        // -------------------------------------------------------- APPROVAL -------------------------------------------------


        $scope.submit = function(statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.submit(
                {
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.approve(
                {
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.reject(
                {
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(statusUpdate){

            $scope.error = null;
            $scope.isResolving = true;
            PortfolioStatusUpdates.draft(
                {
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    $scope.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


    }
]);

'use strict';

//Portfolio status updates service used to communicate Portfolio status updates REST endpoints
angular.module('portfolio-status-updates').factory('PortfolioStatusUpdates', ['$resource',
	function($resource) {
		return $resource('portfolio-status-updates/:portfolioStatusUpdateId', { portfolioStatusUpdateId: '@_id'
		}, {

            // --- Header ---

            updateHeader: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/header'
            },

            // --- Overall Delivery Status ---

            updateOverallDeliveryStatus: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/overallDeliveryStatus'
            },

            // --- Log status area

            updateStatusAreaReview: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/status-area-reviews/:statusAreaReviewId'
            },

            // --- Approval --

            submit: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/submit'
            },

            approve: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/approve'
            },

            reject: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/reject'
            },

            draft: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/draft'
            }
		});
	}
]);

'use strict';

//Setting up route
angular.module('priority-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Priority assignment state routing
		$stateProvider.
		state('prioritization-overview', {
			url: '/prioritization-overview',
			templateUrl: 'modules/priority-assignment/views/prioritization-overview.client.view.html'
		}).
		state('priority-assignment', {
			url: '/priority-assignment',
			templateUrl: 'modules/priority-assignment/views/priority-assignment.client.view.html'
		});
	}
]);
'use strict';

// Definition dashboards controller
angular.module('priority-assignment').controller('PrioritizationOverviewController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'PriorityAssignment','PriorityGroups', 'Priorities', 'PriorityValues', 'Portfolios', 'StrategyNodes', '_','$q', '$sce',
	function($rootScope, $scope, $stateParams, $location, Authentication, PriorityAssignment, PriorityGroups, Priorities, PriorityValues, Portfolios, StrategyNodes, _, $q, $sce) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.oneAtATime = true;

		$scope.typeOfChart = 'number';

		var projectPrioritizationPortfolio = [];
        var projectPrioritizationStrategy = [];

		$scope.init = function(){

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

            StrategyNodes.query(function(res){
                $scope.strategyNodes = res;
                $scope.strategyTrees = createNodeTrees(res);
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

			PriorityGroups.query(function(res){
				$scope.priorityGroups = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Priorities.query(function(res){
				$scope.priorities = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityValues.query(function(res){
				$scope.priorityValues = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityAssignment.prioritizationOverviewPortfolio(function(res){
				projectPrioritizationPortfolio = res;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            PriorityAssignment.prioritizationOverviewStrategy(function(res){
                projectPrioritizationStrategy = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });


		};


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};



            // ------- PRIORITIZATION DASHBOARD ------

		$scope.tooltipView = 'error';
		$scope.createTooltipView = function(projects){
			var stringArray = _.map(projects, function(project){
				return $sce.trustAsHtml('<div>'+project.identification.name+'</div><hr style="margin: 0.2%">');
			});
			$scope.tooltipView = stringArray.join('');// join as an empty string for between strings, override default ','
		};

		$scope.orderTable = 'countPriorityValue';

		$scope.selectPortfolio = function(portfolio){
			if(portfolio === 'all'){
				$scope.selectedPortfolio = {name : 'All'};
				$scope.projectPrioritizationPortfolioView = _.filter(projectPrioritizationPortfolio, function(item){
					return item.all === true;
				});
				return;
			}
			if(portfolio === 'unassigned'){
				$scope.selectedPortfolio = {name : 'Unassigned'};
				$scope.projectPrioritizationPortfolioView = _.filter(projectPrioritizationPortfolio, function(item){
					return (item.all === false) && (!item.portfolio);
				});
				return;
			}
			$scope.selectedPortfolio = portfolio;
			$scope.projectPrioritizationPortfolioView = _.filter(projectPrioritizationPortfolio, function(item){
				return (item.portfolio) && (item.portfolio === portfolio._id);
			});
		};

        $scope.selectStrategyNode = function(strategyNode){
            if(strategyNode === 'all'){
                $scope.selectedStrategyNode = {name : 'All'};
                $scope.projectPrioritizationStrategyView = _.filter(projectPrioritizationStrategy, function(item){
                    return item.all === true;
                });
                return;
            }
            if(strategyNode === 'unassigned'){
                $scope.selectedStrategyNode = {name : 'Unassigned'};
                $scope.projectPrioritizationStrategyView = _.filter(projectPrioritizationStrategy, function(item){
                    return (item.all === false) && (!item.parent);
                });
                return;
            }
            $scope.selectedStrategyNode = strategyNode;
            $scope.projectPrioritizationStrategyView = _.filter(projectPrioritizationStrategy, function(item){
                return (item.parent) && (item.parent === strategyNode._id);
            });
        };



	}
]);

'use strict';

angular.module('priority-assignment').controller('PriorityAssignmentController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'Projects','PriorityGroups', 'Priorities', 'PriorityValues', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, PriorityGroups, Priorities, PriorityValues, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForPrioritization': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Priorities.query(function(priorities){
				$scope.priorities = priorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityValues.query(function(values){
				$scope.priorityValues = values;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			$scope.showPriorityValue = {};

		};


		// -------------- AUTHORIZATION FOR BUTTONS -----------------

		$scope.userHasAuthorization = function(action, userData, project){
			var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
			if(action === 'edit'){
				userIsSuperhero = !!_.some(userData.roles, function(role){
					return role === 'superAdmin' || role === 'admin' || role === 'pmo';
				});
				userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
				if(project.portfolio){
					userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
				}
				return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
			}
		};



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchPriorityForm = {};

		$scope.selectPriorityForm = function(assignedPriority, string){
			if(string === 'view'){$scope.switchPriorityForm[assignedPriority._id] = 'view';}
			if(string === 'edit'){$scope.switchPriorityForm[assignedPriority._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

		var originalPriorityAssignment;
		$scope.selectProject = function(project){
			originalPriorityAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification prioritization portfolio',
				deepPopulateArray : [
                    'portfolio',
                    'prioritization.group','prioritization.priorities.priority'
                ]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalPriorityAssignment = null;
		};


		// ------------- SELECT PRIORITY ASSIGNMENT ---------

		$scope.selectPriorityAssignment = function(assignedPriority){
			originalPriorityAssignment[assignedPriority._id] = _.clone(assignedPriority);
			$scope.selectPriorityForm(assignedPriority, 'edit');
		};



		// ------------- EDIT PRIORITY ASSIGNMENT ---------

		$scope.saveAssignedPriority = function(project, assignedGroup, assignedPriority){
			Projects.updatePriorityAssignment(
				{
					projectId: project._id,
					assignedGroupId: assignedGroup._id,
					assignedPriorityId: assignedPriority._id
				},{valueId: assignedPriority.priorityValue}, function(res){
					$scope.selectPriorityForm(assignedPriority, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedPriority = function(assignedPriority){
			assignedPriority.priorityValue = originalPriorityAssignment[assignedPriority._id].priorityValue;
			$scope.selectPriorityForm(assignedPriority, 'view');
		};


	}
]);

'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('priority-assignment').factory('PriorityAssignment', ['$resource',
	function($resource) {
		return $resource('priority-assignment', {
		}, {
			prioritizationOverviewPortfolio: {
				method: 'GET',
				isArray: true,
				url: 'priority-assignment/prioritizationOverviewPortfolio'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			},
            prioritizationOverviewStrategy: {
                method: 'GET',
                isArray: true,
                url: 'priority-assignment/prioritizationOverviewStrategy'
                // req.query: { project: project._id }
                // Returns: [{gate: ... , projectChangeRequests: ... }]
            }
		});
	}
]);

'use strict';

//Setting up route
angular.module('priority-setup').config(['$stateProvider',
	function($stateProvider) {
		// Priority setup state routing
		$stateProvider.
		state('priority-setup', {
			url: '/priority-setup',
			templateUrl: 'modules/priority-setup/views/priority-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('priority-setup').controller('PrioritySetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'PriorityValues', 'PriorityGroups', 'Priorities', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, PriorityValues, PriorityGroups, Priorities, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

			Priorities.query(function(priorities){
				$scope.priorities = priorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			PriorityValues.query(function(values){
				$scope.priorityValues = values;
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


// ---------------------------------------------------- PRIORITY VALUES --------------------------------------

		// ------------------- DRAG AND DROP LISTENERS -------

		$scope.dragControlListeners = {
			//accept: function (sourceItemHandleScope, destSortableScope) {
			//    //override to determine drag is allowed or not. default is true.
			//    return true;
			//},
			//itemMoved: function (event) {
			//
			//},
			orderChanged: function(event) {
                for(var i = 0; i < $scope.priorityValues.length; i++){
                    $scope.updateValue($scope.priorityValues[i]);
                }
			}
			//containment: '#board',//optional param.
			//clone: true //optional param for clone feature.
		};

		/*
		 event object - structure
		 source:
		 index: original index before move.
		 itemScope: original item scope before move.
		 sortableScope: original sortable list scope.
		 dest:
		 index: index after move.
		 sortableScope: destination sortable scope.
		 -------------
		 sourceItemScope - the scope of the item being dragged.
		 destScope - the sortable destination scope, the list.
		 destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
		 */


		// ------------------- NG-SWITCH ---------------------

		$scope.selectValueForm = function(string){
			if(string === 'view'){ $scope.switchValueForm = 'view';}
			if(string === 'edit'){$scope.switchValueForm = 'edit';}
		};

		// ------------------- LIST OF VALUES -----------------

		$scope.findValues = function() {
            $scope.initError = [];
			PriorityValues.query(function(values){
				$scope.priorityValues = values;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalValue;
		$scope.selectValue = function(value){
			$scope.error = null;
			$scope.selectValueForm('view');
			$scope.priorityValue = value;
			originalValue = _.clone(value);
		};

		$scope.updateValue = function(value) {
			$scope.error = null;
			value.position = _.indexOf($scope.priorityValues, value) + 1;
			value.$update(function(response) {
				$scope.selectValueForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditValue = function(value){
			value.name = originalValue.name;
			value.numericalValue = originalValue.numericalValue;
			value.description = originalValue.description;
			$scope.selectValueForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeValue = function(value) {
			$scope.error = null;
            value.$remove(function(response) {
                $scope.priorityValues = _.without($scope.priorityValues, value);
                for(var i = 0; i < $scope.priorityValues.length; i++){
                    if($scope.priorityValues[i].position > value.position){
                        $scope.updateValue($scope.priorityValues[i]);
                    }
                }
                $scope.priorityValue = null;
                $scope.selectValueForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};

		// ------------------- NEW -----------------

		$scope.createValue = function() {
			$scope.error = null;
			var priorityValue = new PriorityValues ({
				name: 'New priority value',
				numericalValue: 0,
				position: $scope.priorityValues.length + 1
			});
			priorityValue.$save(function(response) {
				$scope.findValues();
				$scope.selectValueForm('view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ---------------------------------------------------- GROUPS & PRIORITIES --------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchPriorityForm = {};

		$scope.selectPriorityForm = function(priority, string){
			if(string === 'view'){ $scope.switchPriorityForm[priority._id] = 'view';}
			if(string === 'edit'){$scope.switchPriorityForm[priority._id] = 'edit';}
		};

		// ----------------- REFRESH GROUP LIST ------------

		$scope.groupList = function(){
            $scope.initError = [];
			PriorityGroups.query(function(groups){
				$scope.priorityGroups = groups;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE GROUP ----------------

		$scope.createGroup = function() {
			$scope.error = null;

			var priorityGroup = new PriorityGroups ({
				name: 'New priority group',
				description: 'new group description',
				priorities: []
			});

			priorityGroup.$save(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditGroup = {};

		$scope.selectGroup = function(group){
			originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(group) {
			group.$update(function(response) {
				$scope.selectGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
			group.description = originalEditGroup[group._id].description;
			$scope.selectGroupForm(group, 'view');
		};

		// ------------------- REMOVE GROUP -----------------

		$scope.removeGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------ CREATE PRIORITY ----------------

		$scope.createPriority = function(group) {
			$scope.error = null;

			var priority = new Priorities ({
				name: 'New priority',
				description: 'New priority description'
			});

			priority.$save({groupId: group._id}, function(res) {
				// Add new priority to the view group
				group.priorities.push(res);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT PRIORITY -----------------

		var originalEditPriority = {};

		$scope.selectEditPriority = function(group, priority){
			originalEditPriority[priority._id] = _.clone(priority);
			$scope.selectPriorityForm(priority, 'edit');
		};

		$scope.updatePriority = function(group, priority) {
			Priorities.update(priority, function(response) {
				$scope.selectPriorityForm(priority, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPriority = function(priority){
			$scope.error = null;
			priority.name = originalEditPriority[priority._id].name;
			priority.description = originalEditPriority[priority._id].description;
			$scope.selectPriorityForm(priority, 'view');
		};

		// ------------------- REMOVE PRIORITY -----------------

		$scope.removePriority = function(group, priority) {
			$scope.error = null;

            Priorities.remove({groupId: group._id}, priority, function(res){
                group.priorities = _.without(group.priorities, priority);
            }, function(err){
                $scope.error = err.data.message;
            });

		};
	}
]);

'use strict';

//Priorities service used to communicate Priorities REST endpoints
angular.module('priority-setup').factory('Priorities', ['$resource',
	function($resource) {
		return $resource('priorities/:priorityId', { priorityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Priority groups service used to communicate Priority groups REST endpoints
angular.module('priority-setup').factory('PriorityGroups', ['$resource',
	function($resource) {
		return $resource('priority-groups/:priorityGroupId', { priorityGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Priority values service used to communicate Priority values REST endpoints
angular.module('priority-setup').factory('PriorityValues', ['$resource',
	function($resource) {
		return $resource('priority-values/:priorityValueId', { priorityValueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('project-change-requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project change requests', 'project-change-requests', 'dropdown', '/project-change-requests(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-change-requests', 'List Project change requests', 'project-change-requests');
		//Menus.addSubMenuItem('topbar', 'project-change-requests', 'New Project change request', 'project-change-requests/create');
	}
]);

'use strict';

//Setting up route
angular.module('project-change-requests').config(['$stateProvider',
	function($stateProvider) {
		// Project change requests state routing
		$stateProvider.
		state('ProjectChangeRequests', {
			url: '/project-change-requests',
			templateUrl: 'modules/project-change-requests/views/project-change-requests.client.view.html'
		})
            // Route required from myTao
        .state('project-change-requests-id', {
            url: '/project-change-requests/:projectChangeRequestId/projects/:projectId/gates/:gateId',
            templateUrl: 'modules/project-change-requests/views/project-change-requests.client.view.html'
        });
	}
]);

'use strict';

angular.module('project-change-requests').controller('ProjectChangeRequestsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcessTemplates', 'LogReasons', 'ChangeRequestStates', 'LogPriorities','LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcessTemplates, LogReasons, ChangeRequestStates, LogPriorities, LogStatusIndicators) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

			$scope.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                $scope.projects = _.filter(projects, function(project){return project.process.assignmentType !== 'unassigned';});
                // Form myTao
                if($stateParams.projectId){
                    var foundProject = _.find($scope.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(foundProject){
                        $scope.selectProject(foundProject);
                    } else {
                        $scope.error = 'Cannot find project ' + $stateParams.projectId;
                    }
                }
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				$scope.gateProcesses = gateProcesses;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogReasons.query(function(logReasons){
				$scope.logReasons = logReasons;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			ChangeRequestStates.query(function(changeRequestStates){
				$scope.changeRequestStates = changeRequestStates;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            LogPriorities.query(function(logPriorities){
				$scope.logPriorities = logPriorities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            LogStatusIndicators.query(function(logStatusIndicators){
                $scope.logStatuses = logStatusIndicators;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){

            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            
            if((action === 'edit') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }

            if((action === 'approve') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsPortfolioManager;
            }

        };

        // ------------------- NG-SWITCH ---------------------

        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function(string, document){
            if(string === 'view'){ $scope.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchHeaderForm[document._id] = 'edit';}
        };

        $scope.switchBudgetForm = {};
        $scope.selectBudgetForm = function(string, document){
            if(string === 'view'){ $scope.switchBudgetForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchBudgetForm[document._id] = 'edit';}
        };

        $scope.switchStatusForm = {};
        $scope.selectStatusForm = function(string, document){
            if(string === 'view'){ $scope.switchStatusForm[document._id] = 'view';}
            if(string === 'edit'){$scope.switchStatusForm[document._id] = 'edit';}
        };

        $scope.switchOutcomeReviewForm = {};
        $scope.selectOutcomeReviewForm = function(string, outcomeReview){
            if(string === 'view'){ $scope.switchOutcomeReviewForm[outcomeReview._id] = 'view';}
            if(string === 'edit'){$scope.switchOutcomeReviewForm[outcomeReview._id] = 'edit';}
        };

        // Baseline

        $scope.switchBaselineDurationForm = {};
        $scope.selectBaselineDurationForm = function(string, baselineDuration){
            if(string === 'view'){ $scope.switchBaselineDurationForm[baselineDuration._id] = 'view';}
            if(string === 'edit'){$scope.switchBaselineDurationForm[baselineDuration._id] = 'edit';}
        };

        $scope.switchBaselineCostForm = {};
        $scope.selectBaselineCostForm = function(string, baselineCost){
            if(string === 'view'){ $scope.switchBaselineCostForm[baselineCost._id] = 'view';}
            if(string === 'edit'){$scope.switchBaselineCostForm[baselineCost._id] = 'edit';}
        };

        $scope.switchBaselineCompletionForm = {};
        $scope.selectBaselineCompletionForm = function(string, baselineCompletion){
            if(string === 'view'){ $scope.switchBaselineCompletionForm[baselineCompletion._id] = 'view';}
            if(string === 'edit'){$scope.switchBaselineCompletionForm[baselineCompletion._id] = 'edit';}
        };

        // Actual

        $scope.switchActualDurationForm = {};
        $scope.selectActualDurationForm = function(string, actualDuration){
            if(string === 'view'){ $scope.switchActualDurationForm[actualDuration._id] = 'view';}
            if(string === 'edit'){$scope.switchActualDurationForm[actualDuration._id] = 'edit';}
        };

        $scope.switchActualCostForm = {};
        $scope.selectActualCostForm = function(string, actualCost){
            if(string === 'view'){ $scope.switchActualCostForm[actualCost._id] = 'view';}
            if(string === 'edit'){$scope.switchActualCostForm[actualCost._id] = 'edit';}
        };

        $scope.switchActualCompletionForm = {};
        $scope.selectActualCompletionForm = function(string, actualCompletion){
            if(string === 'view'){ $scope.switchActualCompletionForm[actualCompletion._id] = 'view';}
            if(string === 'edit'){$scope.switchActualCompletionForm[actualCompletion._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        $scope.sortChangeRequests = function(doc) {
            return new Date(doc.raisedOnDate);
        };

        $scope.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        $scope.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        $scope.showNewDocumentForm = false;

        $scope.documentDetails = 'header';

        $scope.activeTab = {};
        

        // ------------- SELECT PROJECT ------------


        $scope.selectProject = function(project) {
            $scope.error = null;
            $scope.cancelNewDocument();
            $scope.selectedGate = null;
            $scope.selectedDocument = null;
            $scope.selectedProject = project;
        };


        // ------------ SELECT GATE ----------------


        $scope.selectGate = function(gate){
            // Delete previous selections
            $scope.error = null;
            $scope.cancelNewDocument();
            $scope.selectedDocument = null;
            // Set new selected gate
            $scope.selectedGate = gate;
        };

        // ----------- NEW CHANGE REQUEST ------------


        $scope.newHeaderDateOpened = {};

        $scope.openNewHeaderDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newHeaderDateOpened[gate._id] = true;
        };

        $scope.newDocument = {};

        $scope.createNewDocument = function(project, gate){
            $scope.error = null;

            var newDocument = {
                raisedOnDate : $scope.newDocument.raisedOnDate,
                title : $scope.newDocument.title
            };

            Projects.createChangeRequest(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    $scope.isResolving = false;
                    gate.projectChangeRequests.push(res);
                    $scope.newDocument = {};
                    $scope.showNewDocumentForm = false;
                    $scope.selectDocument(res);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelNewDocument = function(){
            $scope.error = null;
            $scope.showNewDocumentForm = false;
            $scope.newDocument = {};
        };


        // ------------- SELECT CHANGE REQUEST ------------


        $scope.selectDocument = function(doc){
            $scope.selectedDocument = doc;
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.headerDateOpened = {};
        $scope.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        $scope.editHeader = function(changeRequest){
            originalHeader[changeRequest._id] = {
                raisedOnDate: changeRequest.raisedOnDate,
                title : changeRequest.title,
                description : changeRequest.description,
                reason : changeRequest.reason,
                state : changeRequest.state,
                priority : changeRequest.priority
            };
            $scope.selectHeaderForm('edit', changeRequest);
        };

        $scope.saveEditHeader = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateChangeRequestHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', changeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function(changeRequest){
            $scope.error = null;
            changeRequest.raisedOnDate = originalHeader[changeRequest._id].raisedOnDate;
            changeRequest.title = originalHeader[changeRequest._id].title;
            changeRequest.description = originalHeader[changeRequest._id].description;
            changeRequest.reason = originalHeader[changeRequest._id].reason;
            changeRequest.state = originalHeader[changeRequest._id].state;
            changeRequest.priority = originalHeader[changeRequest._id].priority;
            $scope.selectHeaderForm('view', changeRequest);
        };


        $scope.deleteDocument = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.deleteChangeRequest(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id
                }, changeRequest, function(res){
                    $scope.isResolving = false;
                    gate.projectChangeRequests = _.without(gate.projectChangeRequests, changeRequest);
                    $scope.cancelNewDocument();
                    $scope.selectedDocument = null;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                });
        };

        // -------------------------------------------------------- CHANGE STATUS -------------------------------------------------

        $scope.baselineDateOpened = {};
        $scope.openBaselineDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDateOpened[document._id] = true;
        };

        $scope.estimateDateOpened = {};
        $scope.openEstimateDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDateOpened[document._id] = true;
        };

        $scope.actualDateOpened = {};
        $scope.openActualDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDateOpened[document._id] = true;
        };
        
        var originalStatus = {};

        $scope.editStatus = function(changeRequest){
            originalStatus[changeRequest._id] = {
                baselineDeliveryDate : changeRequest.changeStatus.currentRecord.baselineDeliveryDate,
                estimateDeliveryDate : changeRequest.changeStatus.currentRecord.estimateDeliveryDate,
                actualDeliveryDate : changeRequest.changeStatus.currentRecord.actualDeliveryDate,
                completed : changeRequest.changeStatus.currentRecord.completed,
                status : changeRequest.changeStatus.currentRecord.status,
                comment : changeRequest.changeStatus.currentRecord.comment
            };
            $scope.selectStatusForm('edit', changeRequest);
        };

        $scope.saveEditStatus = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateChangeRequestStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.changeStatus = res.changeStatus;
                    $scope.selectStatusForm('view', changeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function(changeRequest){
            $scope.error = null;
            changeRequest.changeStatus.currentRecord.baselineDeliveryDate = originalStatus[changeRequest._id].baselineDeliveryDate;
            changeRequest.changeStatus.currentRecord.estimateDeliveryDate = originalStatus[changeRequest._id].estimateDeliveryDate;
            changeRequest.changeStatus.currentRecord.actualDeliveryDate = originalStatus[changeRequest._id].actualDeliveryDate;
            changeRequest.changeStatus.currentRecord.completed = originalStatus[changeRequest._id].completed;
            changeRequest.changeStatus.currentRecord.status = originalStatus[changeRequest._id].status;
            changeRequest.changeStatus.currentRecord.comment = originalStatus[changeRequest._id].comment;
            
            $scope.selectStatusForm('view', changeRequest);
        };



        // -------------------------------------------------------- BUDGET -------------------------------------------------

        var originalGateBudget = {};

        $scope.editBudget = function(changeRequest){
            originalGateBudget[changeRequest._id] = {
                newAmount : changeRequest.budgetReview.newAmount
            };
            $scope.selectBudgetForm('edit', changeRequest);
        };

        $scope.saveEditBudget = function(project, gate, changeRequest){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateGateBudgetReviewForCR(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    originalGateBudget[changeRequest._id].newAmount = changeRequest.budgetReview.newAmount;
                    $scope.selectBudgetForm('view', changeRequest);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBudget = function(changeRequest){
            $scope.error = null;
            changeRequest.budgetReview.newAmount = originalGateBudget[changeRequest._id].newAmount;
            $scope.selectBudgetForm('view', changeRequest);
        };


        // -------------------------------------------------------- BASELINE DURATION -------------------------------------------------

        $scope.baselineDurationDateOpened = {};
        $scope.openBaselineDurationDate = function(baselineDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDurationDateOpened[baselineDurationReview._id] = true;
        };

        var originalBaselineDurationReview = {};

        $scope.editBaselineDuration = function(baselineDurationReview){
            originalBaselineDurationReview[baselineDurationReview._id] = _.cloneDeep(baselineDurationReview);
            $scope.selectBaselineDurationForm('edit', baselineDurationReview);
        };

        $scope.saveEditBaselineDuration = function(project, gate, changeRequest, baselineDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateBaselineDurationReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    baselineDurationReviewId : baselineDurationReview._id
                }, baselineDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineDurationReview[baselineDurationReview._id].newDate = baselineDurationReview.newDate;
                    $scope.selectBaselineDurationForm('view', baselineDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBaselineDuration = function(baselineDurationReview){
            $scope.error = null;
            baselineDurationReview.newDate = originalBaselineDurationReview[baselineDurationReview._id].newDate;
            $scope.selectBaselineDurationForm('view', baselineDurationReview);
        };


        // -------------------------------------------------------- ACTUAL DURATION -------------------------------------------------

        $scope.actualDurationDateOpened = {};
        $scope.openActualDurationDate = function(actualDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDurationDateOpened[actualDurationReview._id] = true;
        };

        var originalActualDurationReview = {};

        $scope.editActualDuration = function(actualDurationReview){
            $scope.error = null;
            originalActualDurationReview[actualDurationReview._id] = _.cloneDeep(actualDurationReview);
            $scope.selectActualDurationForm('edit', actualDurationReview);
        };

        $scope.saveEditActualDuration = function(project, gate, changeRequest, actualDurationReview){
            $scope.isResolving = true;
            $scope.error = null;
            Projects.updateActualDurationReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    actualDurationReviewId : actualDurationReview._id
                }, actualDurationReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualDurationReview[actualDurationReview._id].newDate = actualDurationReview.newDate;
                    $scope.selectActualDurationForm('view', actualDurationReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditActualDuration = function(actualDurationReview){
            $scope.error = null;
            actualDurationReview.newDate = originalActualDurationReview[actualDurationReview._id].newDate;
            $scope.selectActualDurationForm('view', actualDurationReview);
        };

        // -------------------------------------------------------- BASELINE COST -------------------------------------------------

        var originalBaselineCostReview = {};

        $scope.editBaselineCost = function(baselineCostReview){
            originalBaselineCostReview[baselineCostReview._id] = _.cloneDeep(baselineCostReview);
            $scope.selectBaselineCostForm('edit', baselineCostReview);
        };

        $scope.saveEditBaselineCost = function(project, gate, changeRequest, baselineCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCostReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    baselineCostReviewId : baselineCostReview._id
                }, baselineCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineCostReview[baselineCostReview._id].newCost = baselineCostReview.newCost;
                    $scope.selectBaselineCostForm('view', baselineCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditBaselineCost = function(baselineCostReview){
            $scope.error = null;
            baselineCostReview.newCost = originalBaselineCostReview[baselineCostReview._id].newCost;
            $scope.selectBaselineCostForm('view', baselineCostReview);
        };

        // -------------------------------------------------------- ACTUAL COST -------------------------------------------------

        var originalActualCostReview = {};

        $scope.editActualCost = function(actualCostReview){
            originalActualCostReview[actualCostReview._id] = _.cloneDeep(actualCostReview);
            $scope.selectActualCostForm('edit', actualCostReview);
        };

        $scope.saveEditActualCost = function(project, gate, changeRequest, actualCostReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCostReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    actualCostReviewId : actualCostReview._id
                }, actualCostReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualCostReview[actualCostReview._id].newCost = actualCostReview.newCost;
                    $scope.selectActualCostForm('view', actualCostReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditActualCost = function(actualCostReview){
            $scope.error = true;
            actualCostReview.newCost = originalActualCostReview[actualCostReview._id].newCost;
            $scope.selectActualCostForm('view', actualCostReview);
        };



        // -------------------------------------------------------- BASELINE COMPLETION -------------------------------------------------

        var originalBaselineCompletionReview = {};

        $scope.editBaselineCompletion = function(baselineCompletionReview){
            originalBaselineCompletionReview[baselineCompletionReview._id] = _.cloneDeep(baselineCompletionReview);
            $scope.selectBaselineCompletionForm('edit', baselineCompletionReview);
        };

        $scope.saveEditBaselineCompletion = function(project, gate, changeRequest, baselineCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateBaselineCompletionReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    baselineCompletionReviewId : baselineCompletionReview._id
                }, baselineCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion = baselineCompletionReview.newCompletion;
                    $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditBaselineCompletion = function(baselineCompletionReview){
            $scope.error = null;
            baselineCompletionReview.newCompletion = originalBaselineCompletionReview[baselineCompletionReview._id].newCompletion;
            $scope.selectBaselineCompletionForm('view', baselineCompletionReview);
        };

        // -------------------------------------------------------- ACTUAL COMPLETION -------------------------------------------------

        var originalActualCompletionReview = {};

        $scope.editActualCompletion = function(actualCompletionReview){
            originalActualCompletionReview[actualCompletionReview._id] = _.cloneDeep(actualCompletionReview);
            $scope.selectActualCompletionForm('edit', actualCompletionReview);
        };

        $scope.saveEditActualCompletion = function(project, gate, changeRequest, actualCompletionReview){
            $scope.error = null;
            $scope.isResolving = true;
            Projects.updateActualCompletionReviewForCR(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId: changeRequest._id,
                    actualCompletionReviewId : actualCompletionReview._id
                }, actualCompletionReview,
                function(res){
                    $scope.isResolving = false;
                    originalActualCompletionReview[actualCompletionReview._id].newCompletion = actualCompletionReview.newCompletion;
                    $scope.selectActualCompletionForm('view', actualCompletionReview);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );

        };

        $scope.cancelEditActualCompletion = function(actualCompletionReview){
            $scope.error = null;
            actualCompletionReview.newCompletion = originalActualCompletionReview[actualCompletionReview._id].newCompletion;
            $scope.selectActualCompletionForm('view', actualCompletionReview);
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        // Check that all fields are filled in before proceeding, if not, return (except for Reject and Draft)
        $scope.submitMissingFields = {};
        var setSubmitMissingFields = function(changeRequest, gate){

            var missingFields = [];

            if(!changeRequest.budgetReview.newAmount){
                missingFields.push('Budget amount');
            }

            _.each(changeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Baseline date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });
            _.each(changeRequest.performances.duration.actualDurationReviews, function(performanceReview){
                if(!performanceReview.newDate && gate.gateState.currentRecord.completed){
                    missingFields.push('Actual date for ' + performanceReview.baselineDuration.targetGate.name);
                }
            });

            _.each(changeRequest.performances.cost.baselineCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Baseline cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });
            _.each(changeRequest.performances.cost.actualCostReviews, function(performanceReview){
                if(!performanceReview.newCost && gate.gateState.currentRecord.completed){
                    missingFields.push('Actual cost for ' + performanceReview.baselineCost.targetGate.name);
                }
            });

            _.each(changeRequest.performances.completion.baselineCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Baseline completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });
            _.each(changeRequest.performances.completion.actualCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion && gate.gateState.currentRecord.completed){
                    missingFields.push('Actual completion for ' + performanceReview.baselineCompletion.targetGate.name);
                }
            });

            return missingFields;
        };

        // Check that date are consistent with current dates of previous and next gates
        $scope.dateConsistencyErrors = {};
        var checkDateConsistency = function(editedChangeRequest, editedGate, project){
            // Check that this gate baseline/actual are not earlier than previous gate or later than next gate

            var gates = project.process.gates;

            var dateConsistencyErrors = [];

            // Gate Review new dates

            var thisGate_BaselineDurationReview_NewDate = _.find(editedChangeRequest.performances.duration.baselineDurationReviews, function(performanceReview){
                return performanceReview.baselineDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_BaselineDurationReview_NewDate = thisGate_BaselineDurationReview_NewDate && new Date(thisGate_BaselineDurationReview_NewDate);

            var thisGate_ActualDurationReview_NewDate = _.find(editedChangeRequest.performances.duration.actualDurationReviews, function(performanceReview){
                return performanceReview.actualDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_ActualDurationReview_NewDate = thisGate_ActualDurationReview_NewDate && new Date(thisGate_ActualDurationReview_NewDate);

            _.each(gates, function(gate){

                // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
                if((gate.position < editedGate.position) && (editedGate._id !== project.process.startGate)){

                    var previousGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_BaselineDuration_CurrentDate = previousGate_BaselineDuration_CurrentDate && new Date(previousGate_BaselineDuration_CurrentDate);

                    var previousGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_ActualDuration_CurrentDate = previousGate_ActualDuration_CurrentDate && new Date(previousGate_ActualDuration_CurrentDate);

                    if(previousGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (previousGate_BaselineDuration_CurrentDate > thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(previousGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (previousGate_ActualDuration_CurrentDate > thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

                // NEXT gates dates (for next gate as a target). Skip is editedGate is END
                if((gate.position > editedGate.position) && (editedGate._id !== project.process.endGate)){

                    var nextGate_BaselineDuration_CurrentDate = _.find(gate.performances.duration.baselineDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_BaselineDuration_CurrentDate = nextGate_BaselineDuration_CurrentDate && new Date(nextGate_BaselineDuration_CurrentDate);
                    
                    var nextGate_ActualDuration_CurrentDate = _.find(gate.performances.duration.actualDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_ActualDuration_CurrentDate = nextGate_ActualDuration_CurrentDate && new Date(nextGate_ActualDuration_CurrentDate);

                    if(nextGate_BaselineDuration_CurrentDate && thisGate_BaselineDurationReview_NewDate && (nextGate_BaselineDuration_CurrentDate < thisGate_BaselineDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Baseline date ' + thisGate_BaselineDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_BaselineDuration_CurrentDate.toDateString());
                    }

                    if(nextGate_ActualDuration_CurrentDate && thisGate_ActualDurationReview_NewDate && (nextGate_ActualDuration_CurrentDate < thisGate_ActualDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Actual date ' + thisGate_ActualDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_ActualDuration_CurrentDate.toDateString());
                    }
                }

            });

            return dateConsistencyErrors;
        };

        $scope.submit = function(project, gate, changeRequest){

            $scope.submitMissingFields[changeRequest._id] = setSubmitMissingFields(changeRequest, gate);
            $scope.dateConsistencyErrors[changeRequest._id] = checkDateConsistency(changeRequest, gate, project);

            if(($scope.submitMissingFields[changeRequest._id].length > 0) || ($scope.dateConsistencyErrors[changeRequest._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.submitChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(project, gate, changeRequest){

            $scope.submitMissingFields[changeRequest._id] = setSubmitMissingFields(changeRequest, gate);
            $scope.dateConsistencyErrors[changeRequest._id] = checkDateConsistency(changeRequest, gate, project);

            if(($scope.submitMissingFields[changeRequest._id].length > 0) || ($scope.dateConsistencyErrors[changeRequest._id].length > 0)){
                return; // Must exit
            }

            $scope.error = null;
            $scope.isResolving = true;
            Projects.approveChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(project, gate, changeRequest){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.rejectChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(project, gate, changeRequest){

            $scope.error = null;
            $scope.isResolving = true;
            Projects.draftChangeRequest(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectChangeRequestId : changeRequest._id
                }, changeRequest,
                function(res){
                    $scope.isResolving = false;
                    changeRequest.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


    }
]);

'use strict';

//Setting up route
angular.module('project-identification').config(['$stateProvider',
	function($stateProvider) {
		// Project identification state routing
		$stateProvider.
		state('project-identification', {
			url: '/project-identification',
			templateUrl: 'modules/project-identification/views/project-identification.client.view.html'
		})
        .state('project-identification-id', {
            url: '/projects/:projectId',
            templateUrl: 'modules/project-identification/views/project-identification.client.view.html'
        });
	}
]);

'use strict';

angular.module('project-identification').controller('ProjectIdentificationController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Projects', 'Portfolios', 'GateProcessTemplates', 'Subusers', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcessTemplates, Subusers, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initErrors = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

			Subusers.query(function(users){
				$scope.users = users;
				$scope.projectManagers = _.filter(users, function(user){
					return _.find(user.roles, function(role){
                        return role === 'projectManager';
                    });
				});
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			Projects.query({'selection.active': true}, function(projects){
				$scope.projects = projects;
                // If there is a stateParam _id , then select a project
                if($stateParams.projectId){
                    var requestedProject = _.find($scope.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(requestedProject){
                        $scope.selectProject(requestedProject);
                    } else {
                        $scope.error = 'Project not found';
                    }
                }
            }, function(err){
				$scope.initErrors.push(err.data.message);
			});

            Portfolios.query(function(res){
                $scope.portfolios = res;
            }, function(err){
                $scope.initErrors.push(err.data.message);
            });

            GateProcessTemplates.query(function(res){
                $scope.gateProcesses = res;
            }, function(err){
                $scope.initErrors.push(err.data.message);
            });

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
            if(action === 'new'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsPortfolioManager = !!_.some(userData.roles, function(role){
                    return role === 'portfolioManager';
                });
                return userIsSuperhero || userIsPortfolioManager;
            }
        };


        // ------- DATE PICKER ------

        $scope.openStartDatePickerNew = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startDatePickerOpenedNew = true;
        };

        $scope.openEndDatePickerNew = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endDatePickerOpenedNew = true;
        };

        $scope.openStartDatePickerEdit = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startDatePickerOpenedEdit = true;
        };

        $scope.openEndDatePickerEdit = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endDatePickerOpenedEdit = true;
        };


		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initErrors = [];
			Projects.query({'selection.active': true}, function(projects){
                $scope.projects = projects;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});
		};


        // ------------------- NG-SWITCH ---------------------

        $scope.switchProjectForm = {};

        $scope.selectProjectForm = function(string){
            if(string === 'default'){ $scope.switchProjectForm = 'default';}
            if(string === 'new'){$scope.switchProjectForm = 'new';}
            if(string === 'view'){ $scope.switchProjectForm = 'view';}
            if(string === 'edit'){$scope.switchProjectForm = 'edit';}
        };

        var allowNull = function(obj){
            if(obj){return obj._id;} else {return null;}
        };


        // ------------- CREATE NEW PROJECT -----------

        $scope.newProject = {};

        $scope.createProject = function(){
            var newProject = new Projects({
                // Definition
                parent: null,
                portfolio: null,
                identification: {
                    idReference : $scope.newProject.idReference,
                    name : $scope.newProject.name,
                    description : $scope.newProject.description,
                    reqStartDate: $scope.newProject.reqStartDate,
                    reqEndDate : $scope.newProject.reqEndDate,
                    earmarkedFunds : $scope.newProject.earmarkedFunds,
                    projectManager: allowNull($scope.newProject.projectManager),
                    backupProjectManager: allowNull($scope.newProject.backupProjectManager)
                },
                categorization: [],
                prioritization: [],
                selection: {active : true},
                // Evaluation
                costs: [],
                benefits: [],
                qualitativeAnalysis: [],
                riskAnalysis: [],
                stakeholders: [],
                // Delivery
                process: null
            });
            newProject.$save(function(res) {
                // Add new project to view after saving to server
                $scope.projects.push(newProject);
                // Clear form fields
                $scope.newProject = {};
                // Select the newly created project
                $scope.selectProject(newProject);
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewProject = function(){
            $scope.newProject = {};
            $scope.selectProjectForm('default');
        };


        // ------------- SELECT VIEW PROJECT ------------


        var originalProject = {};
        $scope.selectProject = function(project){
            $scope.error = null;
            originalProject[project._id] = _.cloneDeep(project);
            $scope.selectedProject = project;
            $scope.selectProjectForm('view');
        };

        $scope.cancelViewProject = function(){
            originalProject = {};
            $scope.selectedProject = null;
            $scope.selectProjectForm('default');
        };

        // ------------- EDIT PROJECT ------------

        $scope.saveEditProject = function(project){
            // Clean up the deep populate
            var projectCopy = _.cloneDeep(project);
            projectCopy.process = allowNull(project.process);
            projectCopy.portfolio = allowNull(project.portfolio);
            // Save the project to the server
            Projects.update(projectCopy, function(res) {
                $scope.selectProject(project);
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditProject = function(project){
            project.identification = originalProject[project._id].identification;
            $scope.selectProject(project);
        };



        // ------------- DELETE PROJECT ------------

        $scope.deleteProject = function(project){
            Projects.remove({},{_id: project._id}, function(res){
                $scope.projects = _.without($scope.projects, project);
                $scope.selectedProject = null;
                $scope.selectProjectForm('default');
            }, function(err){
                $scope.error = err.data.message;
            });
        };




	}
]);

'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('project-identification').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            updateStrategyAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/strategyAssignment'
                // req.body: {valueId: category value id}
            },
			updatePortfolioAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/portfolioAssignment'
				// req.body: {valueId: category value id}
			},
			updateCategoryAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/categoryAssignment/:assignedGroupId/:assignedCategoryId'
				// req.body: {valueId: category value id}
			},
			updatePriorityAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/priorityAssignment/:assignedGroupId/:assignedPriorityId'
				// req.body: {valueId: priority value id}
			},
			updateImpactAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/impactAssignment/:assignedGroupId/:assignedImpactId'
				// req.body: {scoreId: impact score id}
			},
			updateRiskAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/riskAssignment/:assignedCategoryId/:assignedRiskId'
				// req.body: {probabilityId: risk probability id, impactId: risk impact id}
			},
            
            // Stakeholders

            createAssignedRole: {
                method: 'POST',
                url: 'projects/:projectId/stakeholders/:assignedGroupId/assignedRoles'
                // req.body: {the whole "assignedRole" object}
            },
            
			updateAssignedRole: {
				method: 'PUT',
				url: 'projects/:projectId/stakeholders/:assignedGroupId/assignedRoles/:assignedRoleId'
				// req.body: {the whole "assignedRole" object}
			},

            deleteAssignedRole: {
                method: 'DELETE',
                url: 'projects/:projectId/stakeholders/:assignedGroupId/assignedRoles/:assignedRoleId'
                // req.body: {the whole "assignedRole" object}
            },

            // ------- DELIVERY PROCESS -------

            confirmAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/confirmAssignment'
                // req.body: {processId: gate process id}
            },
            customAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/customAssignment'
                // req.body: {processId: gate process id}
            },
            standardAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/standardAssignment'
                // req.body: {processId: gate process id}
            },
            removeAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/removeAssignment'
                // req.body: {processId: gate process id}
            },

            // --- Process header ---
            
            updateProcess: {
                method: 'PUT',
                url: 'projects/:projectId/updateProcess'
            },
            
            // --- Gate ---

            createGate: {
                method: 'PUT',
                url: 'projects/:projectId/createGate'
            },
            updateGateHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/updateHeader'
            },
            updateGatePosition: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/updatePosition'
            },
            deleteGate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/delete'
            },

            // --- Outcome ---

            createOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createOutcome'
            },
            updateOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/update'
            },
            deleteOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/delete'
            },

            // --- Approval --

            submitProcess: {
                method: 'PUT',
                url: 'projects/:projectId/submitProcess'
            },
            approveProcess: {
                method: 'PUT',
                url: 'projects/:projectId/approveProcess'
            },
            rejectProcess: {
                method: 'PUT',
                url: 'projects/:projectId/rejectProcess'
            },
            draftProcess: {
                method: 'PUT',
                url: 'projects/:projectId/draftProcess'
            },

            // ----------------- GATE REVIEWS ---------------------

            createGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createGateReview'
                // req.body: {gate review object}
            },

            deleteGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/delete'
                // req.body: {gate review object}
            },

            // --- Header & Status & Budget--

            updateGateReviewHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/header'
                // req.body: {whole gate review object}
            },
            updateGateStateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/state'
                // req.body: {whole gate review object}
            },
            updateGateBudgetReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/budget'
                // req.body: {whole gate review object}
            },

            // --- Outcomes --

            updateOutcomeScoreReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/outcome-score-reviews/:outcomeScoreReviewId'
            },

            // --- Actuals --

            updateActualCompletionReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-completion-reviews/:actualCompletionReviewId'
                // req.body: {actual-completion-review object}
            },
            updateActualCostReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-cost-reviews/:actualCostReviewId'
                // req.body: {actual-cost-review object}
            },
            updateActualDurationReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-duration-reviews/:actualDurationReviewId'
                // req.body: {actual-duration-review object}
            },

            // --- Estimates --

            updateEstimateCompletionReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-completion-reviews/:estimateCompletionReviewId'
                // req.body: {estimate-completion-review object}
            },
            updateEstimateCostReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-cost-reviews/:estimateCostReviewId'
                // req.body: {estimate-cost-review object}
            },
            updateEstimateDurationReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-duration-reviews/:estimateDurationReviewId'
                // req.body: {estimate-duration-review object}
            },

            // --- Baseline --

            updateBaselineCompletionReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-completion-reviews/:baselineCompletionReviewId'
                // req.body: {baseline-completion-review object}
            },
            updateBaselineCostReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-cost-reviews/:baselineCostReviewId'
                // req.body: {baseline-cost-review object}
            },
            updateBaselineDurationReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId'
                // req.body: {baselineDurationReview object}
            },

            // --- Approval --

            submitGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/submit'
                // req.body: {whole gate review object}
            },

            approveGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/approve'
                // req.body: {whole gate review object}
            },

            rejectGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/reject'
                // req.body: {whole gate review object}
            },

            draftGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/draft'
                // req.body: {whole gate review object}
            },

            // ----------------- PROJECT CHANGE REQUESTS ---------------------

            createChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createChangeRequest'
                // req.body: {gate review object}
            },

            deleteChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/delete'
                // req.body: {gate review object}
            },

            // --- Header & Status --

            updateChangeRequestHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/header'
                // req.body: {whole gate review object}
            },
            updateChangeRequestStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/status'
                // req.body: {whole gate review object}
            },
            
            // --- Budget ---

            updateGateBudgetReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/budget'
                // req.body: {whole gate review object}
            },

            // --- Actuals --

            updateActualCompletionReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-completion-reviews/:actualCompletionReviewId'
                // req.body: {actual-completion-review object}
            },
            updateActualCostReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-cost-reviews/:actualCostReviewId'
                // req.body: {actual-cost-review object}
            },
            updateActualDurationReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-duration-reviews/:actualDurationReviewId'
                // req.body: {actual-duration-review object}
            },
            
            // --- Baseline --

            updateBaselineCompletionReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-completion-reviews/:baselineCompletionReviewId'
                // req.body: {baseline-completion-review object}
            },
            updateBaselineCostReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-cost-reviews/:baselineCostReviewId'
                // req.body: {baseline-cost-review object}
            },
            updateBaselineDurationReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-duration-reviews/:baselineDurationReviewId'
                // req.body: {baselineDurationReview object}
            },

            // --- Approval --

            submitChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/submit'
            },

            approveChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/approve'
            },

            rejectChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/reject'
            },

            draftChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/draft'
            },

            // ----------------- PROJECT STATUS UPDATES ---------------------

            createStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createStatusUpdate'
            },

            deleteStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/delete'
            },

            // --- Header ---

            updateStatusUpdateHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/header'
            },
            
            // --- Overall Delivery Status ---
            
            updateOverallDeliveryStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/overallDeliveryStatus'
            },
            
            // --- Log status area

            updateStatusAreaReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/status-area-reviews/:statusAreaReviewId'
            },

            // --- Outcomes --

            updateOutcomeStatusReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/outcome-status-reviews/:outcomeStatusReviewId'
            },

            // --- Estimates --

            updateEstimateCompletionReviewForSU: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-completion-reviews/:estimateCompletionReviewId'
            },
            updateEstimateCostReviewForSU: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-cost-reviews/:estimateCostReviewId'
            },
            updateEstimateDurationReviewForSU: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-duration-reviews/:estimateDurationReviewId'
            },

            // --- Approval --

            submitStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/submit'
            },

            approveStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/approve'
            },

            rejectStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/reject'
            },

            draftStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/draft'
            }
            
            
		});
	}
]);

/*

 GET (using "getById"): add "query" properties to set return-properties and deep populate in addition to the "projectId"

 if(req.query.retPropertiesString){
 retPropertiesString = req.query.retPropertiesString;
 }

 if(req.query.deepPopulateArray){
 deepPopulateArray = req.query.deepPopulateArray;
 }

 QUERY (using "list"): the server will automatically filter the return objects based on any property added to the "query"

 if(!_.isEmpty(req.query)){
 for (var property in req.query) {
 if (req.query.hasOwnProperty(property)) {
 queryObj[property] = req.query[property];
 }
 }
 }

 */

'use strict';

// Configuring the Articles module
angular.module('project-issues').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project issues', 'project-issues', 'dropdown', '/project-issues(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-issues', 'List Project issues', 'project-issues/list');
		//Menus.addSubMenuItem('topbar', 'project-issues', 'New Project issue', 'project-issues/create');
	}
]);

'use strict';

//Setting up route
angular.module('project-issues').config(['$stateProvider',
	function($stateProvider) {
		// Project issues state routing
		$stateProvider.
		state('project-issues', {
			url: '/project-issues',
			templateUrl: 'modules/project-issues/views/project-issues.client.view.html'
		});
	}
]);

'use strict';

// Project issues controller
angular.module('project-issues').controller('ProjectIssuesController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '$modal', '$log', '_', 'Authentication',
    'Portfolios', 'Projects', 'ProjectIssues', 'GateProcessTemplates', 'LogReasons', 'IssueStates', 'LogPriorities', 'LogStatusIndicators',
    function($rootScope, $scope, $stateParams, $location, $q, $modal, $log, _, Authentication,
             Portfolios, Projects, ProjectIssues, GateProcessTemplates, LogReasons, IssueStates, LogPriorities, LogStatusIndicators) {

        $rootScope.staticMenu = false;
        
        // ------------- INIT -------------

        $scope.isResolving = false;

        $scope.initErrors = [];
        var logReasons = [];
        var issueStates = [];
        var logPriorities = [];
        var logStatuses = [];

        $scope.init = function () {

            $scope.user = Authentication.user;

            // For main controller

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function (res) {
                $scope.projects = res;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            Portfolios.query(function (portfolios) {
                $scope.portfolios = portfolios;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            GateProcessTemplates.query(function (gateProcesses) {
                $scope.gateProcesses = gateProcesses;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            // For modal controller

            LogReasons.query(function (res) {
                logReasons = res;
                $scope.logReasons = res;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            IssueStates.query(function (res) {
                issueStates = res;
                $scope.issueStates = res;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            LogPriorities.query(function (res) {
                logPriorities = res;
                $scope.logPriorities = res;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            LogStatusIndicators.query(function (res) {
                logStatuses = res;
                $scope.logStatuses = res;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

        };

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){

            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

            if(action === 'edit' && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }

        };


        // ------------------- UTILITIES ---------------------

        var allowNull = function (obj) {
            if (obj) {
                return obj._id;
            } else {
                return null;
            }
        };

        $scope.sortProjectIssues = function (projectIssue) {
            return new Date(projectIssue.raisedOnDate);
        };

        $scope.completionFilterArray = [
            {name : 'Completed', flag : true},
            {name : 'Not completed', flag : false}
        ];


        // ------------- SELECT VIEW PROJECT ------------

        $scope.selectProject = function (project) {

            $scope.cancelNewProjectIssue();

            $scope.selectedProject = null;
            $scope.projectIssues = null;
            $scope.selectedProjectIssue = null;

            $scope.selectedProject = project;

            $scope.error = null;
            $scope.isResolving = true;
            ProjectIssues.query({
                project: project._id
            }, function (res) {
                $scope.isResolving = false;
                $scope.projectIssues = res;
            }, function (err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelViewProject = function () {
            $scope.error = null;
            $scope.selectedProject = null;
            $scope.projectIssues = null;

        };


        // ------------- NEW ISSUE ------------
        
        
        $scope.newProjectIssueRaisedOnDateOpened = {};

        $scope.openNewProjectIssueRaisedOnDate = function (project, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newProjectIssueRaisedOnDateOpened[project._id] = true;
        };

        $scope.newProjectIssue = {};

        $scope.createNewProjectIssue = function (user, project) {
            var newProjectIssue = new ProjectIssues({
                project: project._id,
                raisedOnDate: $scope.newProjectIssue.raisedOnDate,
                title: $scope.newProjectIssue.title
            });
            $scope.error = null;
            $scope.isResolving = true;
            newProjectIssue.$save(function (res) {
                $scope.isResolving = false;
                res.project = _.cloneDeep(project);
                $scope.projectIssues.push(res);
                // Clear new form
                $scope.newProjectIssue = {};
                // Select in view mode the new review
                $scope.selectProjectIssue(user, _.find($scope.projectIssues, _.matchesProperty('_id', res._id)), project);
                // Close new review form
                $scope.showNewProjectIssueForm = false;
            }, function (err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewProjectIssue = function () {
            $scope.error = null;
            $scope.newProjectIssue = {};
            $scope.showNewProjectIssueForm = false;
        };



        // ------------- EDIT ISSUE ------------


        var modalUpdateIssue = function (size, user, issue, project, logReasons, issueStates, logPriorities, logStatuses) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/project-issues/views/edit-project-issue.client.view.html',
                controller: function ($scope, $modalInstance, user, issue, project, logReasons, issueStates, logPriorities, logStatuses) {

                    $scope.user = user;

                    $scope.originalProjectIssue = _.cloneDeep(issue);
                    $scope.selectedProjectIssue = issue;
                    $scope.selectedProject = project;

                    $scope.logReasons = logReasons;
                    $scope.issueStates = issueStates;
                    $scope.logPriorities = logPriorities;
                    $scope.logStatuses = logStatuses;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    user : function(){
                        return user;
                    },
                    issue: function () {
                        return issue;
                    },
                    project : function(){
                        return project;
                    },
                    logReasons : function(){
                        return logReasons;
                    },
                    issueStates : function(){
                        return issueStates;
                    },
                    logPriorities : function(){
                        return logPriorities;
                    },
                    logStatuses : function(){
                        return logStatuses;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        $scope.selectProjectIssue = function(user, issue, project){
            modalUpdateIssue('lg', user, issue, project, logReasons, issueStates, logPriorities, logStatuses);
        };

        // ------------------- NG-SWITCH ---------------------

        $scope.projectIssueDetails = 'header';

        $scope.selectHeaderForm = function (string) {
            if (string === 'view') {
                $scope.switchHeaderForm = 'view';
            }
            if (string === 'edit') {
                $scope.switchHeaderForm = 'edit';
            }
        };

        $scope.selectStatusForm = function (string) {
            if (string === 'view') {
                $scope.switchStatusForm = 'view';
            }
            if (string === 'edit') {
                $scope.switchStatusForm = 'edit';
            }
        };

        // ------------------- HEADER --------------------------

        $scope.openHeaderDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened = true;
        };

        $scope.editHeader = function () {
            $scope.selectHeaderForm('edit');
        };

        $scope.saveEditHeader = function (projectIssue, originalProjectIssue) {
            // Clean-up deepPopulate
            var copyProjectIssue = _.cloneDeep(projectIssue);
            copyProjectIssue.project = _.get(copyProjectIssue.project, '_id');
            copyProjectIssue.reason = allowNull(copyProjectIssue.reason);
            copyProjectIssue.priority = allowNull(copyProjectIssue.priority);
            copyProjectIssue.state = allowNull(copyProjectIssue.state);
            copyProjectIssue.statusReview.currentRecord.status = allowNull(copyProjectIssue.statusReview.currentRecord.status);
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectIssues.updateHeader(
                {
                    projectIssueId: copyProjectIssue._id
                }, copyProjectIssue,
                function (res) {
                    $scope.isResolving = false;
                    // Update details pane view with new saved details
                    originalProjectIssue.raisedOnDate = projectIssue.raisedOnDate;
                    originalProjectIssue.title = projectIssue.title;
                    originalProjectIssue.description = projectIssue.description;
                    originalProjectIssue.state = projectIssue.state;
                    originalProjectIssue.reason = projectIssue.reason;
                    originalProjectIssue.priority = projectIssue.priority;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view');
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function (projectIssue, originalProjectIssue) {
            $scope.error = null;
            projectIssue.raisedOnDate = originalProjectIssue.raisedOnDate;
            projectIssue.title = originalProjectIssue.title;
            projectIssue.description = originalProjectIssue.description;
            projectIssue.state = originalProjectIssue.state;
            projectIssue.reason = originalProjectIssue.reason;
            projectIssue.priority = originalProjectIssue.priority;
            $scope.selectHeaderForm('view');
        };


        $scope.deleteProjectIssue = function (projectIssue) {
            $scope.error = null;
            $scope.isResolving = true;
            ProjectIssues.remove({projectIssueId: projectIssue._id}, projectIssue, function (res) {
                $scope.isResolving = false;
                $scope.projectIssues = _.without($scope.projectIssues, projectIssue);
            }, function (err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };


        // --------------------- STATUS -----------------------

        $scope.openBaselineDeliveryDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDeliveryDateOpened = true;
        };

        $scope.openEstimateDeliveryDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDeliveryDateOpened = true;
        };

        $scope.openActualDeliveryDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDeliveryDateOpened = true;
        };

        $scope.editStatus = function () {
            $scope.selectStatusForm('edit');
        };

        $scope.saveEditStatus = function (projectIssue, originalProjectIssue) {
            // Clean-up deepPopulate
            var copyProjectIssue = _.cloneDeep(projectIssue);
            copyProjectIssue.project = _.get(copyProjectIssue.project, '_id');
            copyProjectIssue.reason = allowNull(copyProjectIssue.reason);
            copyProjectIssue.priority = allowNull(copyProjectIssue.priority);
            copyProjectIssue.state = allowNull(copyProjectIssue.state);
            copyProjectIssue.statusReview.currentRecord.status = allowNull(copyProjectIssue.statusReview.currentRecord.status);
            // Update server header
            $scope.error = null;
            $scope.isResolving = true;
            ProjectIssues.updateStatus({projectIssueId: copyProjectIssue._id}, copyProjectIssue,
                function (res) {
                    $scope.isResolving = false;
                    // Change the selected CR
                    originalProjectIssue.statusReview.currentRecord.baselineDeliveryDate = projectIssue.statusReview.currentRecord.baselineDeliveryDate;
                    originalProjectIssue.statusReview.currentRecord.estimateDeliveryDate = projectIssue.statusReview.currentRecord.estimateDeliveryDate;
                    originalProjectIssue.statusReview.currentRecord.actualDeliveryDate = projectIssue.statusReview.currentRecord.actualDeliveryDate;
                    originalProjectIssue.statusReview.currentRecord.status = projectIssue.statusReview.currentRecord.status;
                    originalProjectIssue.statusReview.currentRecord.completed = projectIssue.statusReview.currentRecord.completed;
                    originalProjectIssue.statusReview.currentRecord.statusComment = projectIssue.statusReview.currentRecord.statusComment;
                    $scope.selectStatusForm('view');
                },
                function (err) {
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function (projectIssue, originalProjectIssue) {
            $scope.error = null;
            projectIssue.statusReview.currentRecord.baselineDeliveryDate = originalProjectIssue.statusReview.currentRecord.baselineDeliveryDate;
            projectIssue.statusReview.currentRecord.estimateDeliveryDate = originalProjectIssue.statusReview.currentRecord.estimateDeliveryDate;
            projectIssue.statusReview.currentRecord.actualDeliveryDate = originalProjectIssue.statusReview.currentRecord.actualDeliveryDate;
            projectIssue.statusReview.currentRecord.status = originalProjectIssue.statusReview.currentRecord.status;
            projectIssue.statusReview.currentRecord.completed = originalProjectIssue.statusReview.currentRecord.completed;
            projectIssue.statusReview.currentRecord.statusComment = originalProjectIssue.statusReview.currentRecord.statusComment;
            $scope.selectStatusForm('view');
        };


    }

]);

'use strict';

//Project issues service used to communicate Project issues REST endpoints
angular.module('project-issues').factory('ProjectIssues', ['$resource',
	function($resource) {
		return $resource('project-issues/:projectIssueId', { projectIssueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-issues/:projectIssueId/header'
				// req.body: {whole issue object}
			},

			// --- Status --

			updateStatus: {
				method: 'PUT',
				url: 'project-issues/:projectIssueId/status'
				// req.body: {whole issue object}
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('project-milestones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project milestones', 'project-milestones', 'dropdown', '/project-milestones(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-milestones', 'List Project milestones', 'project-milestones');
		//Menus.addSubMenuItem('topbar', 'project-milestones', 'New Project milestone', 'project-milestones/create');
	}
]);

'use strict';

//Setting up route
angular.module('project-milestones').config(['$stateProvider',
	function($stateProvider) {
		// Project milestones state routing
		$stateProvider.
		state('project-milestones', {
			url: '/project-milestones',
			templateUrl: 'modules/project-milestones/views/project-milestones.client.view.html'
		});
	}
]);

'use strict';

angular.module('project-milestones').controller('ProjectMilestoneController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'GateProcessTemplates', 'ProjectMilestones', 'ProjectMilestoneTypes', 'MilestoneStates', 'LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 GateProcessTemplates, ProjectMilestones, ProjectMilestoneTypes, MilestoneStates, LogStatusIndicators) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.isResolving = false;

		$scope.initErrors = [];

		$scope.init = function(){

			$scope.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function(res){
				$scope.projects = res;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				$scope.gateProcesses = gateProcesses;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			ProjectMilestoneTypes.query(function(projectMilestoneTypes){
				$scope.projectMilestoneTypes = projectMilestoneTypes;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			MilestoneStates.query(function(milestoneStates){
				$scope.milestoneStates = milestoneStates;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatuses = logStatusIndicators;
			}, function(err){
				$scope.initErrors.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, user, project){

            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

            if(action === 'edit' && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }

        };

		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = '';
		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchHeaderForm = {};
		$scope.selectHeaderForm = function(string, projectMilestone){
			if(string === 'view'){ $scope.switchHeaderForm[projectMilestone._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectMilestone._id] = 'edit';}
		};

		$scope.switchStatusForm = {};
		$scope.selectStatusForm = function(string, projectMilestone){
			if(string === 'view'){ $scope.switchStatusForm[projectMilestone._id] = 'view';}
			if(string === 'edit'){$scope.switchStatusForm[projectMilestone._id] = 'edit';}
		};


		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortProjectMilestones = function(projectMilestone) {
			return new Date(projectMilestone.statusReview.currentRecord.estimateDeliveryDate);
		};

		$scope.sortAppliedChanges = function(appliedChange) {
			return new Date(appliedChange.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectMilestoneDetails = 'header';

		$scope.activeTab = {};



		// ------------- SELECT PROJECT ------------


		$scope.selectProject = function(project) {

			$scope.projectMilestones = null;
            $scope.selectedGate = null;
            $scope.selectedProjectMilestone = null;

            $scope.cancelNewProjectMilestone();
            
			$scope.selectedProject = project;

            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.query({
				project: project._id
			}, function (res) {
                $scope.isResolving = false;
                $scope.projectMilestones = res;
			}, function (err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});

		};

        // -------------- SELECT GATE ---------------------

        $scope.selectGate = function(gate){
            $scope.error = null;
            $scope.selectedProjectMilestone = null;
            $scope.cancelNewProjectMilestone();
            $scope.selectedGate = gate;
        };


		// ------------- NEW MILESTONE ------------

		$scope.newProjectMilestone = {};

		$scope.createNewProjectMilestone = function(project, gate){
			var newProjectMilestone = new ProjectMilestones({
				project: project._id,
				gate : {_id: gate._id, name: gate.name, standardGate: gate.standardGate},
				type : $scope.newProjectMilestone.type,
				name : $scope.newProjectMilestone.name
			});
            $scope.error = null;
            $scope.isResolving = true;
			newProjectMilestone.$save(function(res) {
                $scope.isResolving = false;
				// Clear new form
				$scope.newProjectMilestone = {};
				// Refresh the list of gate reviews
				$scope.projectMilestones.push(res);
				// Select in view mode the new review
				$scope.selectProjectMilestone(res);
				// Close new review form
                $scope.showNewProjectMilestoneForm = false;
			}, function(err) {
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectMilestone = function(){
            $scope.error = null;
			$scope.newProjectMilestone = {};
            $scope.showNewProjectMilestoneForm = false;
		};


		// ------------- SELECT MILESTONE ------------


		$scope.selectProjectMilestone = function(projectMilestone){
            $scope.selectedProjectMilestone = projectMilestone;
		};



		// -------------------------------------------------------- HEADER -------------------------------------------------

        var originalProjectMilestoneHeader = {};

		$scope.editHeader = function(projectMilestone){
            originalProjectMilestoneHeader[projectMilestone._id] = {
                name : projectMilestone.name,
                description : projectMilestone.description,
                state : projectMilestone.state,
                type : projectMilestone.type
            };
			$scope.selectHeaderForm('edit', projectMilestone);
		};

		$scope.saveEditHeader = function(projectMilestone){

            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.updateHeader(
				{
					projectMilestoneId : projectMilestone._id
				}, projectMilestone,
				function(res){
                    $scope.isResolving = false;
					$scope.selectHeaderForm('view', projectMilestone);
				},
				function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
			);
		};

		$scope.cancelEditHeader = function(projectMilestone){
            $scope.error = null;
			projectMilestone.name = originalProjectMilestoneHeader[projectMilestone._id].name;
			projectMilestone.description = originalProjectMilestoneHeader[projectMilestone._id].description;
			projectMilestone.state = originalProjectMilestoneHeader[projectMilestone._id].state;
			projectMilestone.type = originalProjectMilestoneHeader[projectMilestone._id].type;
			$scope.selectHeaderForm('view', projectMilestone);
		};


		$scope.deleteProjectMilestone = function(projectMilestone){
            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.remove({projectMilestoneId: projectMilestone._id}, projectMilestone,
                function(res){
                $scope.isResolving = false;
				$scope.projectMilestones = _.without($scope.projectMilestones, projectMilestone);
				$scope.cancelNewProjectMilestone();
				$scope.selectedProjectMilestone = null;
			}, function(err){
                $scope.isResolving = false;
				$scope.error = err.data.message;
			});
		};


		// -------------------------------------------------------- STATUS -------------------------------------------------

		$scope.baselineDeliveryDateOpened = {};
		$scope.openBaselineDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.baselineDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.estimateDeliveryDateOpened = {};
		$scope.openEstimateDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.estimateDeliveryDateOpened[projectMilestone._id] = true;
		};

		$scope.actualDeliveryDateOpened = {};
		$scope.openActualDeliveryDate = function(projectMilestone, $event){
			$event.preventDefault();
			$event.stopPropagation();
			$scope.actualDeliveryDateOpened[projectMilestone._id] = true;
		};

        var originalProjectMilestoneStatus = {};

		$scope.editStatus = function(projectMilestone){
            originalProjectMilestoneStatus = {
                baselineDeliveryDate : projectMilestone.statusReview.currentRecord.baselineDeliveryDate,
                estimateDeliveryDate : projectMilestone.statusReview.currentRecord.estimateDeliveryDate,
                actualDeliveryDate : projectMilestone.statusReview.currentRecord.actualDeliveryDate,
                status : projectMilestone.statusReview.currentRecord.status,
                completed : projectMilestone.statusReview.currentRecord.completed,
                statusComment : projectMilestone.statusReview.currentRecord.statusComment
            };
			$scope.selectStatusForm('edit', projectMilestone);
		};

		$scope.saveEditStatus = function(projectMilestone){
            $scope.error = null;
            $scope.isResolving = true;
			ProjectMilestones.updateStatus( { projectMilestoneId : projectMilestone._id }, projectMilestone,
				function(res){
                    $scope.isResolving = false;
                    projectMilestone.statusReview = res.statusReview;
					$scope.selectStatusForm('view', projectMilestone);
				},
				function(err){
                    $scope.isResolving = false;
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditStatus = function(projectMilestone){
            $scope.error = null;
			projectMilestone.statusReview.currentRecord.baselineDeliveryDate = originalProjectMilestoneStatus[projectMilestone._id].baselineDeliveryDate;
			projectMilestone.statusReview.currentRecord.estimateDeliveryDate = originalProjectMilestoneStatus[projectMilestone._id].estimateDeliveryDate;
			projectMilestone.statusReview.currentRecord.actualDeliveryDate = originalProjectMilestoneStatus[projectMilestone._id].actualDeliveryDate;
			projectMilestone.statusReview.currentRecord.status = originalProjectMilestoneStatus[projectMilestone._id].status;
			projectMilestone.statusReview.currentRecord.completed = originalProjectMilestoneStatus[projectMilestone._id].completed;
			projectMilestone.statusReview.currentRecord.statusComment = originalProjectMilestoneStatus[projectMilestone._id].statusComment;
			$scope.selectStatusForm('view', projectMilestone);
		};




	}
]);

'use strict';

//Project milestones service used to communicate Project milestones REST endpoints
angular.module('project-milestones').factory('ProjectMilestones', ['$resource',
	function($resource) {
		return $resource('project-milestones/:projectMilestoneId', { projectMilestoneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            
			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-milestones/:projectMilestoneId/header'
				// req.body: {whole milestone object}
			},

			// --- Status --

			updateStatus: {
				method: 'PUT',
				url: 'project-milestones/:projectMilestoneId/status'
				// req.body: {whole milestone object}
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('project-review-setup').config(['$stateProvider',
	function($stateProvider) {
		// Project review setup state routing
		$stateProvider.
		state('project-review-setup', {
			url: '/project-review-setup',
			templateUrl: 'modules/project-review-setup/views/project-review-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('project-review-setup').controller('ProjectReviewSetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'ProjectReviewScores','ProjectReviewTypes','PortfolioReviewTypes', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, ProjectReviewScores, ProjectReviewTypes, PortfolioReviewTypes, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

            ProjectReviewScores.query(function(scores){
				$scope.reviewScores = scores;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            ProjectReviewTypes.query(function(res){
                $scope.projectReviewTypes = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            PortfolioReviewTypes.query(function(res){
                $scope.portfolioReviewTypes = res;
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


// ---------------------------------------------------- IMPACT SCORES --------------------------------------


		// ------------------- NG-SWITCH ---------------------

		$scope.selectScoreForm = function(string){
			if(string === 'view'){ $scope.switchScoreForm = 'view';}
			if(string === 'edit'){$scope.switchScoreForm = 'edit';}
		};

		// ------------------- LIST OF SCORES -----------------

		$scope.findScores = function() {
			$scope.initError = [];
			ProjectReviewScores.query(function(scores){
				$scope.reviewScores = scores;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalScore;
		$scope.selectScore = function(score){
			$scope.error = null;
			$scope.selectScoreForm('view');
			$scope.reviewScore = score;
			originalScore = _.clone(score);
		};

		$scope.updateScore = function(score) {
			$scope.error = null;
			score.$update(function(response) {
				$scope.reviewScores = _.sortBy($scope.reviewScores,'numericalValue');
				$scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditScore = function(score){
			score.name = originalScore.name;
			score.numericalValue = originalScore.numericalValue;
			score.description = originalScore.description;
			$scope.selectScoreForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeScore = function(score) {
			$scope.error = null;
			score.$remove(function(response) {
				$scope.reviewScore = null;
				$scope.findScores();
				$scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createScore = function() {
			$scope.error = null;
			var reviewScore = new ProjectReviewScores ({
				name: 'New review score',
				numericalValue: 0
			});
			reviewScore.$save(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ----------------------------------------------- PORTFOLIO REVIEW TYPES ---------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchPortfolioTypeForm = {};

		$scope.selectPortfolioTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchPortfolioTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchPortfolioTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchPortfolioTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findPortfolioTypes = function() {
			$scope.initError = [];
			PortfolioReviewTypes.query(function(types){
				$scope.portfolioReviewTypes = _.clone(types);
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		$scope.selectPortfolioType = function(type){
			$scope.selectPortfolioTypeForm(type, 'edit');
		};

		$scope.updatePortfolioType = function(type) {
			type.$update(function(response) {
				$scope.findPortfolioTypes();
				$scope.selectPortfolioTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditPortfolioType = function(type){
			$scope.findPortfolioTypes();
			$scope.selectPortfolioTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removePortfolioType = function(type) {
			type.$remove(function(response) {
				$scope.findPortfolioTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createPortfolioType = function() {
			var portfolioType = new PortfolioReviewTypes ({
				name: 'New portfolio review type'
			});
			portfolioType.$save(function(response) {
				$scope.findPortfolioTypes();
				$scope.selectPortfolioTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

        // ----------------------------------------------- PROJECT REVIEW TYPES ---------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchProjectTypeForm = {};

        $scope.selectProjectTypeForm = function(type, string){
            if(string === 'view'){ $scope.switchProjectTypeForm[type._id] = 'view';}
            if(string === 'new'){$scope.switchProjectTypeForm[type._id] = 'new';}
            if(string === 'edit'){$scope.switchProjectTypeForm[type._id] = 'edit';}
        };

        // ------------------- LIST OF TYPES -----------------

        $scope.findProjectTypes = function() {
            $scope.initError = [];
            ProjectReviewTypes.query(function(types){
                $scope.projectReviewTypes = _.clone(types);
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        $scope.selectProjectType = function(type){
            $scope.selectProjectTypeForm(type, 'edit');
        };

        $scope.updateProjectType = function(type) {
            type.$update(function(response) {
                $scope.findProjectTypes();
                $scope.selectProjectTypeForm(type, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditProjectType = function(type){
            $scope.findProjectTypes();
            $scope.selectProjectTypeForm(type, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeProjectType = function(type) {
            type.$remove(function(response) {
                $scope.findProjectTypes();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createProjectType = function() {
            var projectType = new ProjectReviewTypes ({
                name: 'New project review type'
            });
            projectType.$save(function(response) {
                $scope.findProjectTypes();
                $scope.selectProjectTypeForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };



    }
]);

'use strict';

//Portfolio review types service used to communicate Portfolio review types REST endpoints
angular.module('project-review-setup').factory('PortfolioReviewTypes', ['$resource',
	function($resource) {
		return $resource('portfolio-review-types/:portfolioReviewTypeId', { portfolioReviewTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Project review scores service used to communicate Project review scores REST endpoints
angular.module('project-review-setup').factory('ProjectReviewScores', ['$resource',
	function($resource) {
		return $resource('project-review-scores/:projectReviewScoreId', { projectReviewScoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Project review types service used to communicate Project review types REST endpoints
angular.module('project-review-setup').factory('ProjectReviewTypes', ['$resource',
	function($resource) {
		return $resource('project-review-types/:projectReviewTypeId', { projectReviewTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('project-review-templates').config(['$stateProvider',
	function($stateProvider) {
		// Project review templates state routing
		$stateProvider.
		state('project-review-templates', {
			url: '/project-review-templates',
			templateUrl: 'modules/project-review-templates/views/project-review-templates.client.view.html'
		});
	}
]);

'use strict';

angular.module('project-review-templates').controller('ProjectReviewTemplatesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'ProjectReviewTemplates', 'ProjectReviewTypes', 'PeopleProjectGroups', '$q','_',
	function($rootScope, $scope, $stateParams, $location, Authentication, ProjectReviewTemplates, ProjectReviewTypes, PeopleProjectGroups, $q, _) {

        $rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

            ProjectReviewTemplates.query(function (res) {
                $scope.templates = res;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            ProjectReviewTypes.query(function (res) {
                $scope.templateTypes = res;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            PeopleProjectGroups.query(function (res) {
                $scope.stakeholderGroups = res;
            }, function (err) {
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

		// ------------------- NG-SWITCH ---------------------

		$scope.switchTemplateForm = {};

		$scope.selectTemplateForm = function(template, string){
			if(string === 'view'){ $scope.switchTemplateForm[template._id] = 'view';}
			if(string === 'edit'){$scope.switchTemplateForm[template._id] = 'edit';}
		};

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchItemForm = {};

		$scope.selectItemForm = function(item, string){
			if(string === 'view'){ $scope.switchItemForm[item._id] = 'view';}
			if(string === 'edit'){$scope.switchItemForm[item._id] = 'edit';}
		};

		// ----------------- REFRESH TEMPLATE LIST ------------

		$scope.templateList = function(){
			ProjectReviewTemplates.query(function(templates){
				$scope.templates = templates;
			});
		};


        // ------------------- CALCULATE WEIGHTS -------------

        $scope.getTotalTemplateWeights = function(template){
            if(template){
                return _.reduce(template.groups, function(memo, group){
                    return memo + group.weight;
                }, 0);
            }
        };

        $scope.getTotalItemWeights = function(group){
            if(group){
                return _.reduce(group.items, function(memo, impact){
                    return memo + impact.weight;
                }, 0);
            }
        };



		// ------------------ CREATE TEMPLATE ----------------

        $scope.newTemplate = {};

        $scope.showNewTemplateForm = false;

		$scope.saveNewTemplate = function(newTemplate) {
			$scope.error = null;
			var template = new ProjectReviewTemplates ({
				name: newTemplate.name,
                type: newTemplate.type,
				groups : []
			});
			template.$save(function(res) {
                $scope.error = null;
                $scope.newTemplate = {};
                $scope.showNewTemplateForm = false;
				$scope.templateList();
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

        $scope.cancelNewTemplate = function(){
            $scope.error = null;
            $scope.newTemplate = {};
            $scope.showNewTemplateForm = false;
        };

            // ------------------- EDIT TEMPLATE (HEADER ONLY) -----------------

        var originalEditTemplate = {};

        $scope.selectTemplate = function(template){
        	originalEditTemplate = _.clone(template);
        	$scope.selectedTemplate = template;
        };

        $scope.updateTemplate = function(template) {
        	ProjectReviewTemplates.update({
        		_id: template._id,
        		name: template.name,
                type : template.type,
        		description: template.description
        	}, function(template){
                $scope.error = null;
        		$scope.selectTemplateForm(template, 'view');
        	},function(errorResponse){
        		$scope.error = errorResponse.data.message;
        	});
        };

        $scope.cancelEditTemplate = function(template){
        	$scope.error = null;
        	$scope.selectedTemplate.name = originalEditTemplate.name;
        	$scope.selectedTemplate.description = originalEditTemplate.description;
            $scope.selectedTemplate.type = originalEditTemplate.type;
        	$scope.selectTemplateForm(template, 'view');
        };


		// ------------------ CREATE REVIEW GROUP ----------------

		$scope.createGroup = function(template) {
			var newGroup = {
				name : 'New group',
                weight : 0,
                peopleGroups : [],
				items : []
			};
            ProjectReviewTemplates.createGroup(
                {
                    projectReviewTemplateId: template._id
                }, newGroup,
                function (res) {
                    $scope.error = null;
                    template.groups.push(res);
                },
                function (err) {
                    console.log(err.data.message);
                    $scope.error = err.data.message;
                }
            );
		};


		// ------------------- EDIT GROUP (HEADER ONLY) -----------------

		var originalEditGroup = {};
        $scope.selectedStakeholderGroup = {};

		$scope.selectGroup = function(group){
            $scope.selectedStakeholderGroup[group._id] = null;
            originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(template, group) {
            ProjectReviewTemplates.updateGroup({
                projectReviewTemplateId : template._id,
                groupId : group._id
            }, group, function(res){
                $scope.error = null;
				$scope.selectGroupForm(res, 'view');
			},function(err){
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
			group.description = originalEditGroup[group._id].description;
            group.weight = originalEditGroup[group._id].weight;
			$scope.selectGroupForm(group, 'view');
		};



        // ----- ADD/REMOVE STAKEHOLDER GROUPS ----



        $scope.getAllowedStakeholderGroups = function(reviewGroup){
            return _.filter($scope.stakeholderGroups, function(stakeholderGroup){
                return !_.find(reviewGroup.peopleGroups, function(sGroup){
                    return sGroup._id === stakeholderGroup._id;
                });
            });
        };

        $scope.stringForAllowedStakeholderGroups = 'No selectable groups';

        $scope.addStakeholderGroup = function(template, group, stakeholderGroup){
            $scope.selectedStakeholderGroup[group._id] = null;
            ProjectReviewTemplates.addStakeholderGroup(
                {
                    projectReviewTemplateId : template._id,
                    groupId : group._id,
                    peopleGroupId : stakeholderGroup._id
                }, stakeholderGroup,
                function (res) {
                    $scope.error = null;
                    group.peopleGroups.push(stakeholderGroup);
                },
                function (err) {
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.removeStakeholderGroup = function(template, group, stakeholderGroup){
            $scope.selectedStakeholderGroup[group._id] = null;
            ProjectReviewTemplates.removeStakeholderGroup(
                {
                    projectReviewTemplateId : template._id,
                    groupId : group._id,
                    peopleGroupId : stakeholderGroup._id
                }, stakeholderGroup,
                function (res) {
                    $scope.error = null;
                    group.peopleGroups = _.without(group.peopleGroups, stakeholderGroup);
                },
                function (err) {
                    $scope.error = err.data.message;
                }
            );
        };



		// ------------------ CREATE ITEM ----------------

		$scope.createItem = function(template, group) {
			$scope.error = null;
			var newItem = {
				name: 'New review item',
				weight: 0,
                peopleReviews : []
			};

            ProjectReviewTemplates.createItem(
                {
                    projectReviewTemplateId : template._id,
                    groupId : group._id
                }, newItem,
                function (res) {
                    group.items.push(res);
                },
                function (err) {
                    $scope.error = err.data.message;
                }
            );
		};

		// ------------------- EDIT ITEM (Header) -----------------

		var originalEditItem = {};

		$scope.selectEditItem = function(group, item){
			originalEditItem[item._id] = _.clone(item);
			$scope.selectItemForm(item, 'edit');
		};

        $scope.updateItem = function(template, group, item) {
            ProjectReviewTemplates.updateItem({
                projectReviewTemplateId : template._id,
                groupId : group._id,
                itemId : item._id
            }, item, function(res){
                $scope.selectItemForm(item, 'view');
            },function(err){
                $scope.error = err.data.message;
            });
        };

		$scope.cancelEditItem = function(item){
			$scope.error = null;
			item.name = originalEditItem[item._id].name;
			item.description = originalEditItem[item._id].description;
            item.weight = originalEditItem[item._id].weight;
			$scope.selectItemForm(item, 'view');
		};


        // ------------------- DELETE TEMPLATE -----------------

        $scope.removeTemplate = function(template) {
            $scope.error = null;
            template.$remove(function(response) {
                $scope.selectedTemplate = null;
                $scope.templateList();

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // ------------------- DELETE GROUP -----------------

        $scope.removeGroup = function(template, group) {
            $scope.error = null;

            ProjectReviewTemplates.deleteGroup({
                projectReviewTemplateId : template._id,
                groupId : group._id
            }, group, function(res){
                template.groups = _.without(template.groups, group);
            }, function(err){
                $scope.error = err.data.message;
            });
        };


        // ------------------- DELETE ITEM -----------------

        $scope.removeItem = function(template, group, item) {
            $scope.error = null;
            ProjectReviewTemplates.deleteItem({
                projectReviewTemplateId : template._id,
                groupId : group._id,
                itemId : item._id
            }, item, function(res){
                group.items = _.without(group.items, item);
            }, function(err){
                $scope.error = err.data.message;
            });
        };



	}
]);

'use strict';

//Project review templates service used to communicate Project review templates REST endpoints
angular.module('project-review-templates').factory('ProjectReviewTemplates', ['$resource',
	function($resource) {
		return $resource('project-review-templates/:projectReviewTemplateId', { projectReviewTemplateId: '@_id'
		}, {
            update: {
                method: 'PUT'
            },

			// --- Review Group --

			createGroup: {
				method: 'PUT',
				url: 'project-review-templates/:projectReviewTemplateId/groups'
				// req.body: {new group obj}
			},

            updateGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/update'
                // req.body: {new group obj}
            },

            deleteGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/delete'
                // req.body: {new group obj}
            },

            // --- Add/Remove Stakeholder Groups ---

            addStakeholderGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/add'
                // req.body: {new group obj}
            },

            removeStakeholderGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/remove'
                // req.body: {new group obj}
            },

            // --- Review Item --

            createItem: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/items'
                // req.body: {new group obj}
            },

            updateItem: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/items/:itemId/update'
                // req.body: {new group obj}
            },

            deleteItem: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/items/:itemId/delete'
                // req.body: {new group obj}
            }




		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('project-reviews').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Project reviews', 'project-reviews', 'dropdown', '/project-reviews(/create)?');
		//Menus.addSubMenuItem('topbar', 'project-reviews', 'List Project reviews', 'project-reviews');
		//Menus.addSubMenuItem('topbar', 'project-reviews', 'New Project review', 'project-reviews/create');
	}
]);

'use strict';

//Setting up route
angular.module('project-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Project reviews state routing
		$stateProvider.
		state('project-reviews', {
			url: '/project-reviews',
			templateUrl: 'modules/project-reviews/views/project-reviews.client.view.html'
		})
        .state('project-reviews-id', {
            url: '/project-reviews/:projectReviewId/projects/:projectId',
            templateUrl: 'modules/project-reviews/views/project-reviews.client.view.html'
        });
	}
]);

'use strict';

angular.module('project-reviews').controller('ProjectReviewsController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'ProjectReviewTemplates', 'ProjectReviewScores', 'ProjectReviewTypes','ProjectReviews',
    'PeopleProjectGroups', 'GateProcessTemplates',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 ProjectReviewTemplates, ProjectReviewScores, ProjectReviewTypes, ProjectReviews,
             PeopleProjectGroups, GateProcessTemplates) {

        $rootScope.staticMenu = false;

        $scope.isResolving = false;

		// ------------- INIT -------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(res){
				$scope.projects = res;
                // From myTao page
                if($stateParams.projectId){
                    var foundProject = _.find(res, _.matchesProperty('_id', $stateParams.projectId));
                    if(foundProject){
                        $scope.selectProject(foundProject);
                    } else {
                        $scope.error = 'Cannot find project' + $stateParams.projectId;
                        $stateParams.projectReviewId = null;
                    }
                }
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});
            
            GateProcessTemplates.query(function(res){
                $scope.gateProcesses = res;
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

            ProjectReviewTemplates.query(function(res){
				$scope.projectReviewTemplates = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

            ProjectReviewScores.query(function(res){
                $scope.projectReviewScores = res;
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

            ProjectReviewTypes.query(function(res){
                $scope.projectReviewTypes = res;
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

            PeopleProjectGroups.query(function(res){
                $scope.peopleProjectGroups = res;
            }, function(err){
                $scope.initError.push({message: err.data.message});
            });

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasManagementAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };

        $scope.userHasReviewAuthorization = function(action, userData, peopleReview){

            // Guard against undefined at view startup
            if(action && userData && peopleReview){

                var userIsSuperhero, userIsReviewer;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    if(peopleReview.person){
                        userIsReviewer = (userData._id === peopleReview.person._id);
                    }
                    return userIsSuperhero || userIsReviewer;
                }
            }
        };

		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = '';
		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchHeaderForm = {};
		$scope.selectHeaderForm = function(string, projectReview){
			if(string === 'view'){ $scope.switchHeaderForm[projectReview._id] = 'view';}
			if(string === 'edit'){$scope.switchHeaderForm[projectReview._id] = 'edit';}
		};

		$scope.switchPeopleReviewForm = {};
		$scope.selectPeopleReviewForm = function(string, peopleReview){
			if(string === 'view'){ $scope.switchPeopleReviewForm[peopleReview._id] = 'view';}
			if(string === 'edit'){$scope.switchPeopleReviewForm[peopleReview._id] = 'edit';}
		};

		$scope.switchWorkflowForm = {};
		$scope.selectWorkflowForm = function(string, projectReview){
			if(string === 'view'){ $scope.switchWorkflowForm[projectReview._id] = 'view';}
			if(string === 'edit'){$scope.switchWorkflowForm[projectReview._id] = 'edit';}
		};




		// ------------------- UTILITIES ---------------------

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};

		$scope.sortAppliedChanges = function(record) {
			return new Date(record.created);
		};


		// ------------------- OTHER VARIABLES ---------------------

		$scope.projectReviewDetails = 'header';

		// ------------- SELECT VIEW PROJECT ------------

		var originalProjectReview = {};

		$scope.selectProject = function(project) {
            $scope.error = null;
			$scope.selectedProject = null;
			$scope.projectReviews = null;

			$scope.selectedProjectReview = null;
			originalProjectReview = {};

			$scope.selectedProject = project;

			ProjectReviews.query({
				project: project._id
			}, function (res) {
				$scope.projectReviews = res;
                // From myTao page, triggered from Projects.query in init()
                if($stateParams.projectReviewId){
                    var foundProjectReview = _.find($scope.projectReviews, _.matchesProperty('_id', $stateParams.projectReviewId));
                    if(foundProjectReview){
                        $scope.selectProjectReview(foundProjectReview);
                    } else {
                        $scope.error = 'Cannot find project review' + $stateParams.projectReviewId;
                    }
                }
			}, function (err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelViewProject = function(){
			$scope.error = null;
			$scope.selectedProject = null;
			$scope.projectReviews = null;

		};



		// ------------- NEW PROJECT REVIEW ------------

        $scope.newStartDateOpened = {};
        $scope.openNewStartDate = function(project, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newStartDateOpened[project._id] = true;
        };

        $scope.newEndDateOpened = {};
        $scope.openNewEndDate = function(project, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.newEndDateOpened[project._id] = true;
        };

		$scope.newProjectReview = {};

        $scope.allowedProjectReviewTemplates = function(){
            return _.filter($scope.projectReviewTemplates, _.matchesProperty('type', $scope.newProjectReview.type));
        };

		$scope.createNewProjectReview = function(project){
            $scope.error = null;
			var newProjectReview = new ProjectReviews({
				project: project._id,
                name : $scope.newProjectReview.name,
                startDate : $scope.newProjectReview.startDate,
                endDate : $scope.newProjectReview.startDate,
                // type : will be populated automatically on server side from template
                template : $scope.newProjectReview.template
			});
			newProjectReview.$save(function(res) {
				// Clear new form
				$scope.newProjectReview = {};
				// Refresh the list of reviews
				$scope.projectReviews.push(res);
				// Select in view mode the new review
				$scope.selectProjectReview(res);
				// Close new review form done directly in the view's html
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelNewProjectReview = function(){
            $scope.error = null;
			$scope.newProjectReview = {};
		};


		// ------------- SELECT PROJECT REVIEW ------------


		$scope.selectProjectReview = function(projectReview){
            $scope.error = null;
            $scope.selectedProjectReview = projectReview;
            originalProjectReview[projectReview._id] = _.cloneDeep(projectReview);
		};


		// -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.editStartDateOpened = {};
        $scope.openEditStartDate = function(review, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.editStartDateOpened[review._id] = true;
        };

        $scope.editEndDateOpened = {};
        $scope.openEditEndDate = function(review, $event){
            $event.preventDefault();
            $event.stopPropagation();
            $scope.editEndDateOpened[review._id] = true;
        };

		$scope.editHeader = function(projectReview){
            originalProjectReview[projectReview._id] = _.cloneDeep(projectReview);
			$scope.selectHeaderForm('edit', projectReview);
		};

		$scope.saveEditHeader = function(projectReview){
			// Clean-up deepPopulate
			var copyProjectReview = _.cloneDeep(projectReview);

			// Update server header
			ProjectReviews.updateHeader(
				{
					projectReviewId : copyProjectReview._id
				}, copyProjectReview,
				function(res){
					// Close edit header form and back to view
					$scope.selectHeaderForm('view', projectReview);
				},
				function(err){
                    $scope.error = err.data.message;
                }
			);
		};

		$scope.cancelEditHeader = function(projectReview){
            $scope.error = null;
			projectReview.name = originalProjectReview[projectReview._id].name;
            projectReview.startDate = originalProjectReview[projectReview._id].startDate;
            projectReview.endDate = originalProjectReview[projectReview._id].endDate;
			projectReview.description = originalProjectReview[projectReview._id].description;
			$scope.selectHeaderForm('view', projectReview);
		};


		$scope.deleteProjectReview = function(projectReview){
			ProjectReviews.remove({
                projectReviewId: projectReview._id
            }, projectReview, function(res){
				$scope.projectReviews = _.without($scope.projectReviews, projectReview);
				$scope.cancelNewProjectReview();
				$scope.selectedProjectReview = null;
				originalProjectReview = {};
			}, function(err){
				$scope.error = err.data.message;
			});
		};



        // -------------------------------------------------------- PEOPLE REVIEWS -------------------------------------------------

        $scope.oneAtATime = true;

        var originalPeopleReview = {};

        $scope.editPeopleReview = function(peopleReview){
            $scope.error = null;
            $scope.selectPeopleReviewForm('edit', peopleReview);
            originalPeopleReview[peopleReview._id] = _.cloneDeep(peopleReview);
        };

        $scope.saveEditPeopleReview = function(projectReview, reviewGroup, reviewItem, peopleReview){
            // Clean-up deepPopulate
            var copyPeopleReview = _.cloneDeep(peopleReview);
            copyPeopleReview.person = copyPeopleReview.person._id;

            // Update server header
            ProjectReviews.updatePeopleReview(
                {
                    projectReviewId : projectReview._id,
                    groupId : reviewGroup._id,
                    itemId : reviewItem._id,
                    peopleReviewId : peopleReview._id
                }, copyPeopleReview,
                function(res){
                    // Close edit header form and back to view
                    $scope.selectPeopleReviewForm('view', peopleReview);
                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditPeopleReview = function(peopleReview){
            peopleReview.score = originalPeopleReview[peopleReview._id].score;
            peopleReview.comment = originalPeopleReview[peopleReview._id].comment;
            $scope.error = null;
            $scope.selectPeopleReviewForm('view', peopleReview);
        };

        $scope.submitPeopleReview = function(projectReview, reviewGroup, reviewItem, peopleReview){
            $scope.error = null;
            // Clean-up deepPopulate
            var copyPeopleReview = _.cloneDeep(peopleReview);
            copyPeopleReview.person = copyPeopleReview.person._id;

            ProjectReviews.submitPeopleReview(
                {
                    projectReviewId : projectReview._id,
                    groupId : reviewGroup._id,
                    itemId : reviewItem._id,
                    peopleReviewId : peopleReview._id
                }, copyPeopleReview,
                function(res){
                    peopleReview.submitted = res.submitted;
                    // Close edit header form and back to view
                    $scope.selectPeopleReviewForm('view', peopleReview);
                },
                function(err){
                    $scope.error = err.data.message;
                }
            );
        };




        // -------------------------------------------------------- APPROVAL -------------------------------------------------


		$scope.submit = function(projectReview){
            $scope.error = null;
			ProjectReviews.submit(
				{
					projectReviewId : projectReview._id
				}, projectReview,
				function(res){
                    projectReview.approval = res.approval;
				},
				function(err){$scope.error = err.data.message;}
			);
		};

		$scope.complete = function(projectReview){
            $scope.error = null;
            ProjectReviews.complete(
                {
                    projectReviewId : projectReview._id
                }, projectReview,
                function(res){
                    projectReview.approval = res.approval;
                },
                function(err){$scope.error = err.data.message;}
            );
		};

		$scope.draft = function(projectReview){
            $scope.error = null;
            ProjectReviews.draft(
                {
                    projectReviewId : projectReview._id
                }, projectReview,
                function(res){
                    projectReview.approval = res.approval;
                },
                function(err){$scope.error = err.data.message;}
            );
		};


	}
]);

'use strict';

//Project reviews service used to communicate Project reviews REST endpoints
angular.module('project-reviews').factory('ProjectReviews', ['$resource',
	function($resource) {
		return $resource('project-reviews/:projectReviewId', { projectReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-reviews/:projectReviewId/header'
				// req.body: {whole gate review object}
			},

            // --- People reviews --

            updatePeopleReview: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update'
                // req.body: {outcomeReview object}
            },

            submitPeopleReview: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit'
                // req.body: {outcomeReview object}
            },

            // --- Approval --

            submit: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/submit'
                // req.body: {whole gate review object}
            },

            complete: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/complete'
                // req.body: {whole gate review object}
            },

            draft: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/draft'
                // req.body: {whole gate review object}
            }

        });
	}
]);

'use strict';

//Setting up route
angular.module('project-selection').config(['$stateProvider',
	function($stateProvider) {
		// Project selection state routing
		$stateProvider.
		state('project-selection', {
			url: '/project-selection',
			templateUrl: 'modules/project-selection/views/project-selection.client.view.html'
		});
	}
]);
'use strict';

angular.module('project-selection').controller('ProjectSelectionController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'StrategyNodes', 'CategoryGroups', 'PriorityGroups', 'PriorityValues', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, StrategyNodes, CategoryGroups, PriorityGroups, PriorityValues, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

            $scope.userData = Authentication.user;

            Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            StrategyNodes.query(function(res){
                $scope.strategyNodes = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            CategoryGroups.query(function(res){
                $scope.categoryGroups = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            PriorityGroups.query(function(res){
                $scope.priorityGroups = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            PriorityValues.query(function(res){
                $scope.priorityValues = res;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
        };


        // ----------- FILTERS ------------

        $scope.showFilters = false;
        $scope.filterCategorization = {};
        $scope.filterPrioritization = {};

		// ------------- SELECT VIEW PROJECT ------------

        $scope.showEditProjectForm = {};
		var originalProject = {};
		$scope.selectProject = function(project){
			originalProject[project._id] = _.cloneDeep(project);
            $scope.showEditProjectForm[project._id] = true;
		};


		// ------------- EDIT PROJECT ------------

		$scope.saveEditProject = function(project){
			Projects.update({
                _id: project._id,
                selection: project.selection
            }, function(res) {
				$scope.showEditProjectForm[project._id] = false;
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditProject = function(project){
			project.selection = originalProject[project._id].selection;
            $scope.showEditProjectForm[project._id] = false;
		};


	}
]);

'use strict';

//Setting up route
angular.module('project-status-updates').config(['$stateProvider',
	function($stateProvider) {
		// Project status management state routing
		$stateProvider.
		state('project-status-updates', {
			url: '/project-status-updates',
			templateUrl: 'modules/project-status-updates/views/project-status-updates.client.view.html'
		})
        .state('project-status-updates-id', {
            url: '/project-status-updates/:projectStatusUpdateId/projects/:projectId/gates/:gateId',
            templateUrl: 'modules/project-status-updates/views/project-status-updates.client.view.html'
        });
	}
]);

'use strict';

angular.module('project-status-updates').controller('ProjectStatusUpdatesController', ['$rootScope', '$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_', '$modal',
	'GateProcessTemplates', 'LogStatusIndicators',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _, $modal,
			 GateProcessTemplates, LogStatusIndicators) {

		$rootScope.staticMenu = false;
        
        var vm = this;

		// ------------- INIT -------------

		vm.isResolving = false;

		vm.initError = [];

		vm.init = function(){

            vm.user = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                vm.projects = _.filter(projects, function(project){return project.process.assignmentType !== 'unassigned';});
                // Form myTao
                if($stateParams.projectId){
                    var foundProject = _.find(vm.projects, _.matchesProperty('_id', $stateParams.projectId));
                    if(foundProject){
                        vm.selectProject(foundProject);
                    } else {
                        vm.error = 'Cannot find project ' + $stateParams.projectId;
                    }
                }
			}, function(err){
				vm.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			LogStatusIndicators.query(function(logStatusIndicators){
				vm.logStatusIndicators = logStatusIndicators;
			}, function(err){
				vm.initError.push(err.data.message);
			});

		};

        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, user, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if((action === 'edit') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (user._id === project.identification.projectManager) || (user._id === project.identification.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
            if((action === 'approve') && user && project){
                userIsSuperhero = !!_.some(user.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });

                if(project.portfolio){
                    userIsPortfolioManager = (user._id === project.portfolio.portfolioManager) || (user._id === project.portfolio.backupPortfolioManager);
                }

                return userIsSuperhero || userIsPortfolioManager;
            }

        };

        // ------------------- NG-SWITCH ---------------------

        // Header
        
        vm.switchHeaderForm = {};
        vm.selectHeaderForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderForm[document._id] = 'edit';}
        };
        
        // Delivery Status

        vm.switchOverallStatusForm = {};
        vm.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ vm.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchOverallStatusForm[document._id] = 'edit';}
        };
        
        // Status Areas

        vm.switchStatusAreaForm = {};
        vm.selectStatusAreaForm = function(string, statusAreaReview){
            if(string === 'view'){ vm.switchStatusAreaForm[statusAreaReview._id] = 'view';}
            if(string === 'edit'){vm.switchStatusAreaForm[statusAreaReview._id] = 'edit';}
        };
        
        // Outcome

        vm.switchOutcomeReviewForm = {};
        vm.selectOutcomeReviewForm = function(string, outcomeReview){
            if(string === 'view'){ vm.switchOutcomeReviewForm[outcomeReview._id] = 'view';}
            if(string === 'edit'){vm.switchOutcomeReviewForm[outcomeReview._id] = 'edit';}
        };
        
        
        // Estimate

        vm.switchEstimateDurationForm = {};
        vm.selectEstimateDurationForm = function(string, estimateDuration){
            if(string === 'view'){ vm.switchEstimateDurationForm[estimateDuration._id] = 'view';}
            if(string === 'edit'){vm.switchEstimateDurationForm[estimateDuration._id] = 'edit';}
        };

        vm.switchEstimateCostForm = {};
        vm.selectEstimateCostForm = function(string, estimateCost){
            if(string === 'view'){ vm.switchEstimateCostForm[estimateCost._id] = 'view';}
            if(string === 'edit'){vm.switchEstimateCostForm[estimateCost._id] = 'edit';}
        };

        vm.switchEstimateCompletionForm = {};
        vm.selectEstimateCompletionForm = function(string, estimateCompletion){
            if(string === 'view'){ vm.switchEstimateCompletionForm[estimateCompletion._id] = 'view';}
            if(string === 'edit'){vm.switchEstimateCompletionForm[estimateCompletion._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        vm.sortChangeRequests = function(doc) {
            return new Date(doc.updateDate);
        };

        vm.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        vm.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        vm.showNewDocumentForm = false;

        vm.documentDetails = 'header';

        vm.activeTab = {};


        // ------------- SELECT PROJECT ------------


        vm.selectProject = function(project) {
            vm.error = null;
            vm.cancelNewDocument();
            vm.selectedGate = null;
            vm.selectedDocument = null;
            vm.selectedProject = project;
        };


        // ------------ SELECT GATE ----------------


        vm.selectGate = function(gate){
            // Delete previous selections
            vm.error = null;
            vm.cancelNewDocument();
            vm.selectedDocument = null;
            // Set new selected gate
            vm.selectedGate = gate;
        };

        // ----------- NEW STATUS UPDATE ------------


        vm.newHeaderDateOpened = {};

        vm.openNewHeaderDate = function(gate, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.newHeaderDateOpened[gate._id] = true;
        };

        vm.newDocument = {};

        vm.createNewDocument = function(project, gate){
            vm.error = null;

            var newDocument = {
                updateDate : vm.newDocument.updateDate,
                title : vm.newDocument.title
            };

            Projects.createStatusUpdate(
                {
                    projectId : project._id,
                    projectGateId : gate._id
                }, newDocument,
                function(res){
                    vm.isResolving = false;
                    gate.projectStatusUpdates.push(res);
                    vm.newDocument = {};
                    vm.showNewDocumentForm = false;
                    vm.selectDocument(res);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelNewDocument = function(){
            vm.error = null;
            vm.showNewDocumentForm = false;
            vm.newDocument = {};
        };


        // ------------- SELECT STATUS UPDATE ------------


        vm.selectDocument = function(doc){
            vm.selectedDocument = doc;
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        vm.headerDateOpened = {};
        vm.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        vm.editHeader = function(statusUpdate){
            originalHeader[statusUpdate._id] = {
                updateDate: statusUpdate.updateDate,
                title : statusUpdate.title,
                description : statusUpdate.description
            };
            vm.selectHeaderForm('edit', statusUpdate);
        };

        vm.saveEditHeader = function(project, gate, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateStatusUpdateHeader(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditHeader = function(statusUpdate){
            vm.error = null;
            statusUpdate.updateDate = originalHeader[statusUpdate._id].updateDate;
            statusUpdate.title = originalHeader[statusUpdate._id].title;
            statusUpdate.description = originalHeader[statusUpdate._id].description;
            vm.selectHeaderForm('view', statusUpdate);
        };


        vm.deleteDocument = function(project, gate, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Projects.deleteStatusUpdate(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id
                }, statusUpdate, function(res){
                    vm.isResolving = false;
                    gate.projectStatusUpdates = _.without(gate.projectStatusUpdates, statusUpdate);
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                });
        };

        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status
        
        var originalOverallStatus = {};

        vm.editOverallStatus = function(statusUpdate){
            originalOverallStatus[statusUpdate._id] = {
                newStatus: statusUpdate.deliveryStatus.overallStatusReview.newStatus,
                newComment : statusUpdate.deliveryStatus.overallStatusReview.newComment
            };
            vm.selectOverallStatusForm('edit', statusUpdate);
        };

        vm.saveEditOverallStatus = function(project, gate, statusUpdate){
            
            vm.error = null;
            vm.isResolving = true;
            Projects.updateOverallDeliveryStatus(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    vm.selectOverallStatusForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOverallStatus = function(statusUpdate){
            vm.error = null;
            statusUpdate.deliveryStatus.overallStatusReview.newStatus = originalOverallStatus[statusUpdate._id].newStatus;
            statusUpdate.deliveryStatus.overallStatusReview.newComment = originalOverallStatus[statusUpdate._id].newComment;
            vm.selectOverallStatusForm('view', statusUpdate);
        };
        
        // Project status area reviews

        var originalStatusAreaReview = {};

        vm.editStatusArea = function(statusAreaReview){
            originalStatusAreaReview[statusAreaReview._id] = _.cloneDeep(statusAreaReview);
            vm.selectStatusAreaForm('edit', statusAreaReview);
        };

        vm.saveEditStatusArea = function(project, gate, statusUpdate, statusAreaReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateStatusAreaReview(
                {
                    projectId : project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id,
                    statusAreaReviewId : statusAreaReview._id
                }, statusAreaReview,
                function(res){
                    vm.isResolving = false;
                    vm.selectStatusAreaForm('view', statusAreaReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditStatusArea = function(statusAreaReview){
            vm.error = null;
            statusAreaReview.newStatus = originalStatusAreaReview[statusAreaReview._id].newStatus;
            statusAreaReview.newComment = originalStatusAreaReview[statusAreaReview._id].newComment;
            vm.selectStatusAreaForm('view', statusAreaReview);
        };
        

        // -------------------------------------------------------- OUTCOMES -------------------------------------------------

        var originalOutcomeReview = {};

        vm.editOutcomeReview = function(outcomeReview){
            originalOutcomeReview[outcomeReview._id] = _.cloneDeep(outcomeReview);
            vm.selectOutcomeReviewForm('edit', outcomeReview);
        };

        vm.saveEditOutcomeReview = function(project, gate, statusUpdate, outcomeReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateOutcomeStatusReview(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    outcomeStatusReviewId : outcomeReview._id
                }, outcomeReview,
                function(res){
                    vm.isResolving = false;
                    vm.error = null;
                    originalOutcomeReview[outcomeReview._id].newStatus = outcomeReview.newStatus;
                    originalOutcomeReview[outcomeReview._id].newComment = outcomeReview.newComment;
                    vm.selectOutcomeReviewForm('view', outcomeReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOutcomeReview = function(outcomeReview){
            vm.error = null;
            outcomeReview.newStatus = originalOutcomeReview[outcomeReview._id].newStatus;
            outcomeReview.newComment = originalOutcomeReview[outcomeReview._id].newComment;
            vm.selectOutcomeReviewForm('view', outcomeReview);
        };

        // -------------------------------------------------------- ESTIMATE DURATION -------------------------------------------------

        vm.estimateDurationDateOpened = {};
        vm.openEstimateDurationDate = function(estimateDurationReview, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.estimateDurationDateOpened[estimateDurationReview._id] = true;
        };

        var originalEstimateDurationReview = {};

        vm.editEstimateDuration = function(estimateDurationReview){
            vm.error = null;
            originalEstimateDurationReview[estimateDurationReview._id] = _.cloneDeep(estimateDurationReview);
            vm.selectEstimateDurationForm('edit', estimateDurationReview);
        };

        vm.saveEditEstimateDuration = function(project, gate, statusUpdate, estimateDurationReview){
            vm.isResolving = true;
            vm.error = null;
            Projects.updateEstimateDurationReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    estimateDurationReviewId : estimateDurationReview._id
                }, estimateDurationReview,
                function(res){
                    vm.isResolving = false;
                    originalEstimateDurationReview[estimateDurationReview._id].newDate = estimateDurationReview.newDate;
                    vm.selectEstimateDurationForm('view', estimateDurationReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditEstimateDuration = function(estimateDurationReview){
            vm.error = null;
            estimateDurationReview.newDate = originalEstimateDurationReview[estimateDurationReview._id].newDate;
            vm.selectEstimateDurationForm('view', estimateDurationReview);
        };

        // -------------------------------------------------------- ESTIMATE COST -------------------------------------------------

        var originalEstimateCostReview = {};

        vm.editEstimateCost = function(estimateCostReview){
            originalEstimateCostReview[estimateCostReview._id] = _.cloneDeep(estimateCostReview);
            vm.selectEstimateCostForm('edit', estimateCostReview);
        };

        vm.saveEditEstimateCost = function(project, gate, statusUpdate, estimateCostReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateEstimateCostReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    estimateCostReviewId : estimateCostReview._id
                }, estimateCostReview,
                function(res){
                    vm.isResolving = false;
                    originalEstimateCostReview[estimateCostReview._id].newCost = estimateCostReview.newCost;
                    vm.selectEstimateCostForm('view', estimateCostReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );

        };

        vm.cancelEditEstimateCost = function(estimateCostReview){
            vm.error = null;
            estimateCostReview.newCost = originalEstimateCostReview[estimateCostReview._id].newCost;
            vm.selectEstimateCostForm('view', estimateCostReview);
        };

        // -------------------------------------------------------- ESTIMATE COMPLETION -------------------------------------------------

        var originalEstimateCompletionReview = {};

        vm.editEstimateCompletion = function(estimateCompletionReview){
            originalEstimateCompletionReview[estimateCompletionReview._id] = _.cloneDeep(estimateCompletionReview);
            vm.selectEstimateCompletionForm('edit', estimateCompletionReview);
        };

        vm.saveEditEstimateCompletion = function(project, gate, statusUpdate, estimateCompletionReview){
            vm.error = null;
            vm.isResolving = true;
            Projects.updateEstimateCompletionReviewForSU(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId: statusUpdate._id,
                    estimateCompletionReviewId : estimateCompletionReview._id
                }, estimateCompletionReview,
                function(res){
                    vm.isResolving = false;
                    originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion = estimateCompletionReview.newCompletion;
                    vm.selectEstimateCompletionForm('view', estimateCompletionReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );

        };

        vm.cancelEditEstimateCompletion = function(estimateCompletionReview){
            vm.error = null;
            estimateCompletionReview.newCompletion = originalEstimateCompletionReview[estimateCompletionReview._id].newCompletion;
            vm.selectEstimateCompletionForm('view', estimateCompletionReview);
        };


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        // Check that all fields are filled in before proceeding, if not, return (except for Reject and Draft)
        vm.submitMissingFields = {};
        var setSubmitMissingFields = function(statusUpdate){

            var missingFields = [];

            _.each(statusUpdate.performances.duration.estimateDurationReviews, function(performanceReview){
                if(!performanceReview.newDate){
                    missingFields.push('Estimate date for ' + performanceReview.estimateDuration.targetGate.name);
                }
            });

            _.each(statusUpdate.performances.cost.estimateCostReviews, function(performanceReview){
                if(!performanceReview.newCost){
                    missingFields.push('Estimate cost for ' + performanceReview.estimateCost.targetGate.name);
                }
            });

            _.each(statusUpdate.performances.completion.estimateCompletionReviews, function(performanceReview){
                if(!performanceReview.newCompletion){
                    missingFields.push('Estimate completion for ' + performanceReview.estimateCompletion.targetGate.name);
                }
            });

            return missingFields;
        };

        // Check that date are consistent with current dates of previous and next gates
        vm.dateConsistencyErrors = {};
        var checkDateConsistency = function(editedStatusUpdate, editedGate, project){
            // Check that this gate baseline/actual are not earlier than previous gate or later than next gate

            var gates = project.process.gates;

            var dateConsistencyErrors = [];

            // New dates
            
            var thisGate_EstimateDurationReview_NewDate = _.find(editedStatusUpdate.performances.duration.estimateDurationReviews, function(performanceReview){
                return performanceReview.estimateDuration.targetGate._id === (editedGate._id);
            }).newDate;
            thisGate_EstimateDurationReview_NewDate = thisGate_EstimateDurationReview_NewDate && new Date(thisGate_EstimateDurationReview_NewDate);
            
            _.each(gates, function(gate){

                // PREVIOUS gates dates (for itself as a target). Skip if editedGate is START
                if((gate.position < editedGate.position) && (editedGate._id !== project.process.startGate)){
                    
                    var previousGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    previousGate_EstimateDuration_CurrentDate = previousGate_EstimateDuration_CurrentDate && new Date(previousGate_EstimateDuration_CurrentDate);
                    
                    if(previousGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (previousGate_EstimateDuration_CurrentDate > thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be earlier than previous gate ' + gate.name + ' ' + previousGate_EstimateDuration_CurrentDate.toDateString());
                    }
                }

                // NEXT gates dates (for next gate as a target). Skip is editedGate is END
                if((gate.position > editedGate.position) && (editedGate._id !== project.process.endGate)){
                    
                    var nextGate_EstimateDuration_CurrentDate = _.find(gate.performances.duration.estimateDurations, function(performance){
                        return performance.targetGate._id === (gate._id);
                    }).currentRecord.gateDate;
                    nextGate_EstimateDuration_CurrentDate = nextGate_EstimateDuration_CurrentDate && new Date(nextGate_EstimateDuration_CurrentDate);

                    if(nextGate_EstimateDuration_CurrentDate && thisGate_EstimateDurationReview_NewDate && (nextGate_EstimateDuration_CurrentDate < thisGate_EstimateDurationReview_NewDate)){
                        dateConsistencyErrors.push(editedGate.name + ' Estimate date ' + thisGate_EstimateDurationReview_NewDate.toDateString() + ' cannot be later than next gate ' + gate.name + ' ' + nextGate_EstimateDuration_CurrentDate.toDateString());
                    }
                }

            });

            return dateConsistencyErrors;
        };

        vm.submit = function(project, gate, statusUpdate){

            vm.submitMissingFields[statusUpdate._id] = setSubmitMissingFields(statusUpdate);
            vm.dateConsistencyErrors[statusUpdate._id] = checkDateConsistency(statusUpdate, gate, project);

            if((vm.submitMissingFields[statusUpdate._id].length > 0) || (vm.dateConsistencyErrors[statusUpdate._id].length > 0)){
                return; // Must exit
            }

            vm.error = null;
            vm.isResolving = true;
            Projects.submitStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.approve = function(project, gate, statusUpdate){

            vm.submitMissingFields[statusUpdate._id] = setSubmitMissingFields(statusUpdate);
            vm.dateConsistencyErrors[statusUpdate._id] = checkDateConsistency(statusUpdate, gate, project);

            if((vm.submitMissingFields[statusUpdate._id].length > 0) || (vm.dateConsistencyErrors[statusUpdate._id].length > 0)){
                return; // Must exit
            }

            vm.error = null;
            vm.isResolving = true;
            Projects.approveStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.reject = function(project, gate, statusUpdate){

            vm.error = null;
            vm.isResolving = true;
            Projects.rejectStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.draft = function(project, gate, statusUpdate){

            vm.error = null;
            vm.isResolving = true;
            Projects.draftStatusUpdate(
                {
                    projectId: project._id,
                    projectGateId: gate._id,
                    projectStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    statusUpdate.approval = res.approval;
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };


        // ------ PROJECT SELECTION -----------

        vm.projectReportDetails = 'financial';

        var modalProjectReport = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/project-status-updates/views/project-status-report.client.view.html',
                controller: function ($scope, $modalInstance, project) {

                    $scope.project = project;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectReport = function(project){
            modalProjectReport('lg', project);
        };


    }
]);

'use strict';

//Setting up route
angular.module('qualitative-analysis-setup').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative analysis setup state routing
		$stateProvider.
		state('qualitative-analysis-setup', {
			url: '/qualitative-analysis-setup',
			templateUrl: 'modules/qualitative-analysis-setup/views/qualitative-analysis-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('qualitative-analysis-setup').controller('QualitativeAnalysisSetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'QualitativeImpactScores', 'QualitativeImpactGroups', 'QualitativeImpacts', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, QualitativeImpactScores, QualitativeImpactGroups, QualitativeImpacts, $q, _) {

		$rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

            QualitativeImpacts.query(function(impacts){
                $scope.impacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            QualitativeImpactGroups.query(function(groups){
                $scope.impactGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            QualitativeImpactScores.query(function(scores){
                $scope.impactScores = scores;
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


// ---------------------------------------------------- IMPACT SCORES --------------------------------------


		// ------------------- NG-SWITCH ---------------------

		$scope.selectScoreForm = function(string){
			if(string === 'view'){ $scope.switchScoreForm = 'view';}
			if(string === 'edit'){$scope.switchScoreForm = 'edit';}
		};

		// ------------------- LIST OF SCORES -----------------

		$scope.findScores = function() {
            $scope.initError = [];
			QualitativeImpactScores.query(function(scores){
				$scope.impactScores = scores;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		var originalScore;
		$scope.selectScore = function(score){
			$scope.error = null;
			$scope.selectScoreForm('view');
			$scope.impactScore = score;
			originalScore = _.clone(score);
		};

		$scope.updateScore = function(score) {
			$scope.error = null;
			score.$update(function(response) {
                $scope.impactScores = _.sortBy($scope.impactScores,'numericalValue');
                $scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditScore = function(score){
			score.name = originalScore.name;
            score.numericalValue = originalScore.numericalValue;
			score.description = originalScore.description;
			$scope.selectScoreForm('view');
		};

		// ------------------- DELETE -----------------

		$scope.removeScore = function(score) {
			$scope.error = null;
			score.$remove(function(response) {
				$scope.impactScore = null;
				$scope.findScores();
				$scope.selectScoreForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createScore = function() {
			$scope.error = null;
			var impactScore = new QualitativeImpactScores ({
				name: 'New impact score',
				numericalValue: 0
			});
			impactScore.$save(function(response) {
				$scope.findScores();
				$scope.selectScoreForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


// ---------------------------------------------------- GROUPS & IMPACTS --------------------------------------

        // ------------------- CALCULATE WEIGHTS -------------

        $scope.getTotalGroupWeights = function(groups){
            if(groups){
                return _.reduce(groups, function(memo, group){
                    return memo + group.weight;
                }, 0);
            }
        };

        $scope.getTotalImpactWeights = function(group){
            if(group){
                return _.reduce(group.impacts, function(memo, impact){
                    return memo + impact.weight;
                }, 0);
            }
        };

		// ------------------- NG-SWITCH ---------------------

		$scope.switchGroupForm = {};

		$scope.selectGroupForm = function(group, string){
			if(string === 'view'){ $scope.switchGroupForm[group._id] = 'view';}
			if(string === 'new'){$scope.switchGroupForm[group._id] = 'new';}
			if(string === 'edit'){$scope.switchGroupForm[group._id] = 'edit';}
		};

		$scope.switchImpactForm = {};

		$scope.selectImpactForm = function(impact, string){
			if(string === 'view'){ $scope.switchImpactForm[impact._id] = 'view';}
			if(string === 'edit'){$scope.switchImpactForm[impact._id] = 'edit';}
		};

		// ----------------- REFRESH GROUP LIST ------------

		$scope.groupList = function(){
            $scope.initError = [];
			QualitativeImpactGroups.query(function(groups){
				$scope.impactGroups = groups;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE GROUP ----------------

		$scope.createGroup = function() {
			$scope.error = null;

			var impactGroup = new QualitativeImpactGroups ({
				name: 'New impact group',
				description: 'new group description',
                weight: 0,
				impacts: []
			});

			impactGroup.$save(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GROUP -----------------

		var originalEditGroup = {};

        $scope.selectGroup = function(group){
			originalEditGroup[group._id] = _.clone(group);
			$scope.error = null;
			$scope.selectGroupForm(group, 'edit');
		};

		$scope.updateGroup = function(group) {
			group.$update(function(response) {
                $scope.selectGroupForm(group, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGroup = function(group){
			$scope.error = null;
			group.name = originalEditGroup[group._id].name;
            group.weight = originalEditGroup[group._id].weight;
			group.description = originalEditGroup[group._id].description;
			$scope.selectGroupForm(group, 'view');
		};

		// ------------------- REMOVE GROUP -----------------

		$scope.removeGroup = function(group) {
			$scope.error = null;
			group.$remove(function(response) {
				$scope.groupList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------ CREATE IMPACT ----------------

		$scope.createImpact = function(group) {
			$scope.error = null;

			var impact = new QualitativeImpacts ({
				name: 'New impact',
                weight: 0,
				description: ''
			});

			impact.$save({groupId: group._id}, function(res) {
				// Add new priority to the view group
				group.impacts.push(res);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT IMPACT -----------------

		var originalEditImpact = {};

		$scope.selectEditImpact = function(group, impact){
			originalEditImpact[impact._id] = _.clone(impact);
			$scope.selectImpactForm(impact, 'edit');
		};

		$scope.updateImpact = function(group, impact) {
			QualitativeImpacts.update(impact, function(response) {
				$scope.selectImpactForm(impact, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditImpact = function(impact){
			$scope.error = null;
			impact.name = originalEditImpact[impact._id].name;
            impact.weight = originalEditImpact[impact._id].weight;
			impact.description = originalEditImpact[impact._id].description;
			$scope.selectImpactForm(impact, 'view');
		};

		// ------------------- REMOVE IMPACT -----------------

		$scope.removeImpact = function(group, impact) {
			$scope.error = null;

            QualitativeImpacts.remove({groupId: group._id}, impact, function(res){
                group.impacts = _.without(group.impacts, impact);
            }, function(err){
                $scope.error = err.data.message;
            });

		};
	}
]);

'use strict';

//Qualitative impact groups service used to communicate Qualitative impact groups REST endpoints
angular.module('qualitative-analysis-setup').factory('QualitativeImpactGroups', ['$resource',
	function($resource) {
		return $resource('qualitative-impact-groups/:qualitativeImpactGroupId', { qualitativeImpactGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Qualitative impact scores service used to communicate Qualitative impact scores REST endpoints
angular.module('qualitative-analysis-setup').factory('QualitativeImpactScores', ['$resource',
	function($resource) {
		return $resource('qualitative-impact-scores/:qualitativeImpactScoreId', { qualitativeImpactScoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Qualitative impacts service used to communicate Qualitative impacts REST endpoints
angular.module('qualitative-analysis-setup').factory('QualitativeImpacts', ['$resource',
	function($resource) {
		return $resource('qualitative-impacts/:qualitativeImpactId', { qualitativeImpactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('qualitative-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative analysis state routing
		$stateProvider.
		state('qualitative-analysis', {
			url: '/qualitative-analysis',
			templateUrl: 'modules/qualitative-analysis/views/qualitative-analysis.client.view.html'
		});
	}
]);
'use strict';

angular.module('qualitative-analysis').controller('QualitativeAnalysisController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'Projects','QualitativeImpactGroups', 'QualitativeImpacts', 'QualitativeImpactScores', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects,
             QualitativeImpactGroups, QualitativeImpacts, QualitativeImpactScores, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            QualitativeImpactGroups.query(function(impactGroups){
				$scope.impactGroups = impactGroups;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            QualitativeImpacts.query(function(impacts){
				$scope.impacts = impacts;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            QualitativeImpactScores.query(function(scores){
				$scope.scores = scores;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			$scope.showScore = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchImpactForm = {};

		$scope.selectImpactForm = function(assignedImpact, string){
			if(string === 'view'){$scope.switchImpactForm[assignedImpact._id] = 'view';}
			if(string === 'edit'){$scope.switchImpactForm[assignedImpact._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------

		var originalImpactAssignment;
		$scope.selectProject = function(project){
			originalImpactAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio qualitativeAnalysis',
				deepPopulateArray : [
					'portfolio',
					'qualitativeAnalysis.group','qualitativeAnalysis.impacts.impact'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalImpactAssignment = null;
		};


		// ------------- SELECT IMPACT ASSIGNMENT ---------

		$scope.selectImpactAssignment = function(assignedImpact){
			originalImpactAssignment[assignedImpact._id] = _.clone(assignedImpact);
			$scope.selectImpactForm(assignedImpact, 'edit');
		};



		// ------------- EDIT IMPACT ASSIGNMENT ---------

		$scope.saveAssignedImpact = function(project, assignedGroup, assignedImpact){
			Projects.updateImpactAssignment(
				{
					projectId: project._id,
					assignedGroupId: assignedGroup._id,
					assignedImpactId: assignedImpact._id
				},{scoreId: assignedImpact.score}, function(res){
					$scope.selectImpactForm(assignedImpact, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedImpact = function(assignedImpact){
			assignedImpact.score = originalImpactAssignment[assignedImpact._id].score;
			$scope.selectImpactForm(assignedImpact, 'view');
		};


	}
]);

'use strict';

// Configuring the Articles module
angular.module('review-summaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Review summaries', 'review-summaries', 'dropdown', '/review-summaries(/create)?');
		//Menus.addSubMenuItem('topbar', 'review-summaries', 'List Review summaries', 'review-summaries');
		//Menus.addSubMenuItem('topbar', 'review-summaries', 'New Review summary', 'review-summaries/create');
	}
]);

'use strict';

//Setting up route
angular.module('review-summaries').config(['$stateProvider',
	function($stateProvider) {
		// Review summaries state routing
		$stateProvider.
		state('review-summaries', {
			url: '/review-summaries',
			templateUrl: 'modules/review-summaries/views/portfolio-review-summary.client.view.html'
		});
	}
]);

'use strict';

angular.module('review-summaries').controller('ReviewSummariesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'ReviewSummaries','Projects','Portfolios', 'GateProcessTemplates', '_','$q','$modal',
	function($rootScope, $scope, $stateParams, $location, Authentication, ReviewSummaries, Projects, Portfolios, GateProcessTemplates, _, $q, $modal) {

		$rootScope.staticMenu = false;

		var vm = this;

		// ----------- INIT ---------------

		vm.initError = [];

		var portfolioProfiles = [];
        var projectProfiles = [];

		vm.init = function(){

			Projects.query({'selection.selectedForEvaluation': true}, function(projects){
				vm.projects = projects;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				vm.portfolios = portfolios;
				vm.portfolioTrees = createNodeTrees(portfolios);
			}, function(err){
				vm.initError.push(err.data.message);
			});

			GateProcessTemplates.query(function(gateProcesses){
				vm.gateProcesses = gateProcesses;
			}, function(err){
				vm.initError.push(err.data.message);
			});

			ReviewSummaries.portfolioReviews(function(res){
				portfolioProfiles = res;
			}, function(err){
				vm.initError.push(err.data.message);
			});

            ReviewSummaries.projectReviews(function(res){
                projectProfiles = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });


		};


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};


		// ------ PORTFOLIO SELECTION -----------

		vm.selectPortfolio = function(portfolio){
			vm.selectedPortfolioReviews = false;
			if(portfolio === 'unassigned'){
				vm.treeSelectionFlag = 'unassigned';
				vm.selectedReviewProfile = null;
				vm.selectedPortfolio = {name : 'Unassigned'};
				vm.projectProfilesView = _.find(projectProfiles, function(profile){
					return _.isNull(profile.portfolioId);
				});
                vm.portfolioProfilesView = null;
                vm.selectedProjectProfile = null;
				return;
			}
			vm.selectedReviewProfile = null;
			vm.treeSelectionFlag = 'portfolio';
			vm.selectedPortfolio = portfolio;
            vm.selectedProjectProfile = null;
			vm.projectProfilesView = _.find(projectProfiles, function(profile){
				return (profile.portfolioId) && (profile.portfolioId === portfolio._id);
			});
            vm.portfolioProfilesView = _.find(portfolioProfiles, function(profile){
                return (profile.portfolio) && (profile.portfolio._id === portfolio._id);
            });

		};

		// ------ FILTER RANKING -----------

		vm.orderByProperty = 'qualitativeScore';
		vm.orderByDirection = true; // From highest to lowest
		vm.orderByRanking = function(property, direction){
			vm.orderByProperty = property;
			vm.orderByDirection = direction;
		};

        // ------ PROJECT SELECTION -----------

        vm.filterProjectName = '';

        vm.selectProjectProfile = function(profile){
            vm.selectedProjectProfile = profile;
            vm.selectedPortfolioReviews = false;
        };

        vm.viewPortfolioReviews = function(portfolio){
            vm.selectedPortfolioReviews = true;
            vm.selectedProjectProfile = null;
        };


		// ------ REVIEW SELECTION -----------

		vm.reviewProfileDetails = 'financial';

		var modalReviewProfile = function (size, profile) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/review-summaries/views/project-profile.client.view.html',
				controller: function ($scope, $modalInstance, profile) {

					$scope.profile = profile;
                    $scope.oneAtATime = true;

					$scope.cancelModal = function () {
						$modalInstance.dismiss();
					};
				},
				size: size,
				resolve: {
					profile: function () {
						return profile;
					}
				},
				backdrop: 'static',
				keyboard: false
			});

		};

		vm.selectReviewProfile = function(profile){
			modalReviewProfile('lg', profile);
		};






	}
]);

'use strict';

//Review summaries service used to communicate Review summaries REST endpoints
angular.module('review-summaries').factory('ReviewSummaries', ['$resource',
	function($resource) {
		return $resource('review-summaries', {
		}, {
			projectReviews: {
				method: 'GET',
				isArray: true,
				url: 'review-summaries/projectReviews'
			},
			portfolioReviews: {
				method: 'GET',
				isArray: true,
				url: 'review-summaries/portfolioReviews'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('risk-analysis-setup').config(['$stateProvider',
	function($stateProvider) {
		// Risk analysis setup state routing
		$stateProvider.
		state('risk-analysis-setup', {
			url: '/risk-analysis-setup',
			templateUrl: 'modules/risk-analysis-setup/views/risk-analysis-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('risk-analysis-setup').controller('RiskAnalysisSetupController', ['$rootScope', '$scope', '$stateParams', '$location',
	'Authentication','RiskCategories','RiskImpacts','RiskProbabilities','RiskSeverities','RiskSeverityAssignments', 'Risks', '$q', '_',
	function($rootScope, $scope, $stateParams, $location, Authentication, RiskCategories, RiskImpacts, RiskProbabilities, RiskSeverities,
			 RiskSeverityAssignments, Risks, $q, _) {

        $rootScope.staticMenu = false;

		// ------------- INIT -------------

        $scope.initError = [];

		$scope.init = function(){

            RiskCategories.query(function(categories){
                $scope.riskCategories = categories;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskImpacts.query(function(impacts){
                $scope.impacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskProbabilities.query(function(probabilities){
                $scope.probabilities = probabilities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskSeverities.query(function(severities){
                $scope.severities = severities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskSeverityAssignments.query(function(severityAssignments){
                $scope.severityMatrix = createSeverityMatrix(severityAssignments);
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            Risks.query(function(risks){
                $scope.risks = risks;
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


        // ------ CREATE SEVERITY MATRIX --------

        var createSeverityMatrix = function(severityAssignments){
            /*
            severityMatrix = [
                    {impact: <impact>, probabilities: [
                                                { probability: <probability>, severityAssignment : <severityAssignment> }
                                              ]
                ]
             */
            return _.chain(severityAssignments)
                .groupBy('impact._id')
                .map(function(value, key) {
                    return {
                        impact: value[0].impact,
                        probabilities: value
                    };
                })
                .value();

        };



// ---------------------------------------------------- RISKS & CATEGORIES --------------------------------------



		// ------------------- NG-SWITCH ---------------------

		$scope.switchRiskCategoryForm = {};

		$scope.selectRiskCategoryForm = function(category, string){
			if(string === 'view'){ $scope.switchRiskCategoryForm[category._id] = 'view';}
			if(string === 'new'){$scope.switchRiskCategoryForm[category._id] = 'new';}
			if(string === 'edit'){$scope.switchRiskCategoryForm[category._id] = 'edit';}
		};

		$scope.switchRiskForm = {};

		$scope.selectRiskForm = function(risk, string){
			if(string === 'view'){ $scope.switchRiskForm[risk._id] = 'view';}
			if(string === 'edit'){$scope.switchRiskForm[risk._id] = 'edit';}
		};

		// ----------------- REFRESH RISK CATEGORY LIST ------------

		$scope.riskCategoryList = function(){
            $scope.initError = [];
			RiskCategories.query(function(categories){
				$scope.riskCategories = categories;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------ CREATE RISK CATEGORY ----------------

		$scope.createRiskCategory = function() {
			$scope.error = null;

			var riskCategory = new RiskCategories ({
				name: 'New risk category',
				description: 'new category description',
				risks: []
			});

			riskCategory.$save(function(response) {
				$scope.riskCategoryList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT CATEGORY -----------------

		var originalEditRiskCategory = {};

		$scope.selectRiskCategory = function(category){
			originalEditRiskCategory[category._id] = _.clone(category);
			$scope.error = null;
			$scope.selectRiskCategoryForm(category, 'edit');
		};

		$scope.updateRiskCategory = function(category) {
			category.$update(function(response) {
				$scope.selectRiskCategoryForm(category, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditRiskCategory = function(category){
			$scope.error = null;
			category.name = originalEditRiskCategory[category._id].name;
			category.description = originalEditRiskCategory[category._id].description;
			$scope.selectRiskCategoryForm(category, 'view');
		};

		// ------------------- REMOVE RISK CATEGORY -----------------

		$scope.removeRiskCategory = function(category) {
			$scope.error = null;
			category.$remove(function(response) {
				$scope.riskCategoryList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------ CREATE RISK ----------------

		$scope.createRisk = function(category) {
			$scope.error = null;

			var risk = new Risks ({
				name: 'New risk',
				description: ''
			});

            risk.$save({groupId: category._id}, function(res) {
                // Add new risk to the view category
                category.risks.push(res);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
		};

		// ------------------- EDIT RISK -----------------

		var originalEditRisk = {};

		$scope.selectEditRisk = function(category, risk){
			originalEditRisk[risk._id] = _.clone(risk);
			$scope.selectRiskForm(risk, 'edit');
		};

		$scope.updateRisk = function(category, risk) {
			Risks.update(risk, function(response) {
				$scope.selectRiskForm(risk, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditRisk = function(risk){
			$scope.error = null;
			risk.name = originalEditRisk[risk._id].name;
			risk.description = originalEditRisk[risk._id].description;
			$scope.selectRiskForm(risk, 'view');
		};

		// ------------------- REMOVE RISK -----------------

		$scope.removeRisk = function(category, risk) {
			$scope.error = null;
			Risks.remove({groupId: category._id},risk, function(res){
				category.risks = _.without(category.risks, risk);
			}, function(err){
				$scope.error = err.data.message;
			});
		};





// ------------------------------------------------------  IMPACTS ---------------------------------------------





        // ------------------- NG-SWITCH ---------------------

        $scope.switchImpactForm = {};

        $scope.selectImpactForm = function(impact, string){
            if(string === 'view'){ $scope.switchImpactForm[impact._id] = 'view';}
            if(string === 'new'){$scope.switchImpactForm[impact._id] = 'new';}
            if(string === 'edit'){$scope.switchImpactForm[impact._id] = 'edit';}
        };

        // ----------------- REFRESH IMPACT LIST ------------

        $scope.impactList = function(){
            $scope.initError = [];
            RiskImpacts.query(function(impacts){
                $scope.impacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------ CREATE IMPACT ----------------

        $scope.createImpact = function() {
            $scope.error = null;

            var impact = new RiskImpacts ({
                name: 'New impact',
                description: '',
                impactValue: 0
            });

            impact.$save(function(response) {
                $scope.impactList();
                $scope.assignmentsList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT IMPACT -----------------

        var originalEditImpact = {};

        $scope.selectImpact = function(impact){
            originalEditImpact[impact._id] = _.clone(impact);
            $scope.error = null;
            $scope.selectImpactForm(impact, 'edit');
        };

        $scope.updateImpact = function(impact) {
            impact.$update(function(response) {
                $scope.assignmentsList();
                $scope.selectImpactForm(impact, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditImpact = function(impact){
            $scope.error = null;
            impact.name = originalEditImpact[impact._id].name;
            impact.description = originalEditImpact[impact._id].description;
            impact.impactValue = originalEditImpact[impact._id].impactValue;
            $scope.selectImpactForm(impact, 'view');
        };

        // ------------------- REMOVE IMPACT -----------------

        $scope.removeImpact = function(impact) {
            $scope.error = null;
            impact.$remove(function(response) {
                $scope.impactList();
                $scope.assignmentsList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };





// ------------------------------------------------------  PROBABILITIES ---------------------------------------------





        // ------------------- NG-SWITCH ---------------------

        $scope.switchProbabilityForm = {};

        $scope.selectProbabilityForm = function(probability, string){
            if(string === 'view'){ $scope.switchProbabilityForm[probability._id] = 'view';}
            if(string === 'new'){$scope.switchProbabilityForm[probability._id] = 'new';}
            if(string === 'edit'){$scope.switchProbabilityForm[probability._id] = 'edit';}
        };

        // ----------------- REFRESH PROBABILITY LIST ------------

        $scope.probabilityList = function(){
            $scope.initError = [];
            RiskProbabilities.query(function(probabilities){
                $scope.probabilities = probabilities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------ CREATE PROBABILITY ----------------

        $scope.createProbability = function() {
            $scope.error = null;

            var probability = new RiskProbabilities ({
                name: 'New probability',
                description: '',
                probabilityValue: 0
            });

            probability.$save(function(response) {
                $scope.probabilityList();
                $scope.assignmentsList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT PROBABILITY -----------------

        var originalEditProbability = {};

        $scope.selectProbability = function(probability){
            originalEditProbability[probability._id] = _.clone(probability);
            $scope.error = null;
            $scope.selectProbabilityForm(probability, 'edit');
        };

        $scope.updateProbability = function(probability) {
            probability.$update(function(response) {
                $scope.assignmentsList();
                $scope.selectProbabilityForm(probability, 'view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditProbability = function(probability){
            $scope.error = null;
            probability.name = originalEditProbability[probability._id].name;
            probability.description = originalEditProbability[probability._id].description;
            probability.probabilityValue = originalEditProbability[probability._id].probabilityValue;
            $scope.selectProbabilityForm(probability, 'view');
        };

        // ------------------- REMOVE PROBABILITY -----------------

        $scope.removeProbability = function(probability) {
            $scope.error = null;
            probability.$remove(function(response) {
                $scope.probabilityList();
                $scope.assignmentsList();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };






// ---------------------------------------------------- SEVERITIES --------------------------------------






        // ------------------- DRAG AND DROP LISTENERS -------

        $scope.dragControlListeners = {
            //accept: function (sourceItemHandleScope, destSortableScope) {
            //    //override to determine drag is allowed or not. default is true.
            //    return true;
            //},
            //itemMoved: function (event) {
            //
            //},
            orderChanged: function(event) {
                for(var i = 0; i < $scope.severities.length; i++){
                    $scope.updateSeverity($scope.severities[i]);
                }
            }
            //containment: '#board',//optional param.
            //clone: true //optional param for clone feature.
        };

        /*
         event object - structure
         source:
         index: original index before move.
         itemScope: original item scope before move.
         sortableScope: original sortable list scope.
         dest:
         index: index after move.
         sortableScope: destination sortable scope.
         -------------
         sourceItemScope - the scope of the item being dragged.
         destScope - the sortable destination scope, the list.
         destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
         */


        // ------------------- NG-SWITCH SEVERITIES ---------------------

        $scope.selectSeverityForm = function(string){
            if(string === 'view'){ $scope.switchSeverityForm = 'view';}
            if(string === 'edit'){$scope.switchSeverityForm = 'edit';}
        };

        // ------------------- LIST OF SEVERITIES -----------------

        $scope.findSeverities = function() {
            $scope.initError = [];
            RiskSeverities.query(function(severities){
                $scope.severities = severities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT SEVERITY -----------------

        var originalSeverity;
        $scope.selectSeverity = function(severity){
            $scope.error = null;
            $scope.selectSeverityForm('view');
            $scope.severity = severity;
            originalSeverity = _.clone(severity);
        };

        $scope.updateSeverity = function(severity) {
            $scope.error = null;
            severity.position = _.indexOf($scope.severities, severity) + 1;
            severity.$update(function(response) {
                $scope.selectSeverityForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.cancelEditSeverity = function(severity){
            severity.name = originalSeverity.name;
            severity.severityValue = originalSeverity.severityValue;
            severity.description = originalSeverity.description;
            $scope.selectSeverityForm('view');
        };

        // ------------------- DELETE SEVERITY -----------------

        $scope.removeSeverity = function(severity) {
            $scope.error = null;
            severity.$remove(function(response) {
                $scope.severities = _.without($scope.severities, severity);
                for(var i = 0; i < $scope.severities.length; i++){
                    if($scope.severities[i].position > severity.position){
                        $scope.updateSeverity($scope.severities[i]);
                    }
                }
                $scope.severity = null;
                $scope.selectSeverityForm('view');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createSeverity = function() {
            $scope.error = null;
            var severity = new RiskSeverities ({
                name: 'New severity',
                severityValue: 0,
                position: $scope.severities.length + 1
            });
            severity.$save(function(response) {
                $scope.findSeverities();
                $scope.selectSeverityForm(response._id, 'view');

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };





// ------------------------------------------------------  SEVERITY ASSIGNMENTS ---------------------------------------------



        // ------------------- NG-SWITCH ---------------------

        $scope.switchAssignmentForm = {};

        $scope.selectAssignmentForm = function(assignment, string){
            if(string === 'view'){ $scope.switchAssignmentForm[assignment._id] = 'view';}
            if(string === 'new'){$scope.switchAssignmentForm[assignment._id] = 'new';}
            if(string === 'edit'){$scope.switchAssignmentForm[assignment._id] = 'edit';}
        };

        // ------------------- LIST OF ASSIGNMENTS -----------------

        $scope.assignmentsList = function() {
            $scope.initError = [];
            RiskSeverityAssignments.query(function(assignments){
                $scope.severityMatrix = createSeverityMatrix(assignments);
            },function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // ------------------- EDIT -----------------

        var originalSeverityAssignment = {};
        $scope.selectAssignment = function(assignment){
            $scope.error = null;
            originalSeverityAssignment[assignment._id] = _.cloneDeep(assignment);
            $scope.selectAssignmentForm(assignment, 'edit');
        };

        $scope.updateAssignment = function(assignment) {
            // Allow null
            var allowNull = function(obj){
                if(obj){return obj._id;} else {return null;}
            };
             //Clean deep populate
            var copySeverityAssignment = _.cloneDeep(assignment);
            copySeverityAssignment.impact = copySeverityAssignment.impact._id;
            copySeverityAssignment.probability = copySeverityAssignment.probability._id;
            copySeverityAssignment.severity = allowNull(copySeverityAssignment.severity);
            // Save only cleaned up severity assignments
            RiskSeverityAssignments.update(copySeverityAssignment, function(res){
                $scope.selectAssignmentForm(assignment, 'view');
            },function(err){
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditAssignment = function(assignment){
            $scope.error = null;
             assignment.severity = originalSeverityAssignment[assignment._id].severity;
            $scope.selectAssignmentForm(assignment, 'view');
        };

    }
]);

'use strict';

//Risk categories service used to communicate Risk categories REST endpoints
angular.module('risk-analysis-setup').factory('RiskCategories', ['$resource',
	function($resource) {
		return $resource('risk-categories/:riskCategoryId', { riskCategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Risk impacts service used to communicate Risk impacts REST endpoints
angular.module('risk-analysis-setup').factory('RiskImpacts', ['$resource',
	function($resource) {
		return $resource('risk-impacts/:riskImpactId', { riskImpactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Risk probabilities service used to communicate Risk probabilities REST endpoints
angular.module('risk-analysis-setup').factory('RiskProbabilities', ['$resource',
	function($resource) {
		return $resource('risk-probabilities/:riskProbabilityId', { riskProbabilityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Risk severities service used to communicate Risk severities REST endpoints
angular.module('risk-analysis-setup').factory('RiskSeverities', ['$resource',
	function($resource) {
		return $resource('risk-severities/:riskSeverityId', { riskSeverityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Risk severity assignments service used to communicate Risk severity assignments REST endpoints
angular.module('risk-analysis-setup').factory('RiskSeverityAssignments', ['$resource',
	function($resource) {
		return $resource('risk-severity-assignments/:riskSeverityAssignmentId', { riskSeverityAssignmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Risks service used to communicate Risks REST endpoints
angular.module('risk-analysis-setup').factory('Risks', ['$resource',
	function($resource) {
		return $resource('risks/:riskId', { riskId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Setting up route
angular.module('risk-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Risk analysis state routing
		$stateProvider.
		state('risk-analysis', {
			url: '/risk-analysis',
			templateUrl: 'modules/risk-analysis/views/risk-analysis.client.view.html'
		});
	}
]);
'use strict';

angular.module('risk-analysis').controller('RiskAnalysisController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'Projects','RiskCategories', 'Risks', 'RiskProbabilities','RiskImpacts','RiskSeverityAssignments','RiskSeverities', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects,
			 RiskCategories, Risks, RiskProbabilities, RiskImpacts, RiskSeverityAssignments, RiskSeverities, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			$scope.userData = Authentication.user;

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			RiskCategories.query(function(categories){
				$scope.riskCategories = categories;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Risks.query(function(risks){
				$scope.risks = risks;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            RiskProbabilities.query(function(probabilities){
				$scope.probabilities = probabilities;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            RiskImpacts.query(function(impacts){
                $scope.impacts = impacts;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskSeverities.query(function(severities){
                $scope.severities = severities;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            RiskSeverityAssignments.query(function(severityAssignments){
                $scope.severityAssignments = severityAssignments;
            }, function(err){
                $scope.initError.push(err.data.message);
            });

			$scope.showRiskAssignment = {};

		};


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        $scope.userHasAuthorization = function(action, userData, project){

            // Guard against undefined at view startup
            if(action && userData && project){

                var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;

                if(action === 'edit'){
                    userIsSuperhero = !!_.some(userData.roles, function(role){
                        return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                    });
                    userIsProjectManager = (userData._id === project.identification.projectManager) || (userData._id === project.identification.backupProjectManager);
                    if(project.portfolio){
                        userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                    }
                    return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
                }
            }
        };



		// ------------- REFRESH PROJECT LIST ------------

		var projectList = function(){
			$scope.initError = [];
			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'default'){ $scope.switchProjectForm = 'default';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		$scope.switchRiskForm = {};

		$scope.selectRiskForm = function(assignedRisk, string){
			if(string === 'view'){$scope.switchRiskForm[assignedRisk._id] = 'view';}
			if(string === 'edit'){$scope.switchRiskForm[assignedRisk._id] = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};



		// ------------- SELECT VIEW PROJECT ------------
		var originalRiskAssignment;
		$scope.selectProject = function(project){
			originalRiskAssignment = {};
			// Get the full project fat object from the "projectById" server function that populates everything
			Projects.get({
				projectId:project._id,
				retPropertiesString : 'user created selection identification portfolio riskAnalysis',
				deepPopulateArray : [
					'portfolio',
					'riskAnalysis.category','riskAnalysis.risks.risk'
				]
			}, function(res){
				$scope.selectedProject = res;
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.cancelViewProject = function(){
			$scope.selectedProject = null;
			originalRiskAssignment = null;
		};


		// ------------- SELECT RISK ASSIGNMENT ---------

		$scope.selectRiskAssignment = function(assignedRisk){
			originalRiskAssignment[assignedRisk._id] = _.clone(assignedRisk);
			$scope.selectRiskForm(assignedRisk, 'edit');
		};

        $scope.findSeverityAssignment = function(assignedRisk){
            return  _.find($scope.severityAssignments, function(assignment){
                return ((assignment.probability._id === assignedRisk.probability) && (assignment.impact._id === assignedRisk.impact));
            });
        };


		// ------------- EDIT RISK ASSIGNMENT ---------

		$scope.saveAssignedRisk = function(project, assignedCategory, assignedRisk){
            // url: 'projects/riskAssignment/:projectId/:assignedCategoryId/:assignedRiskId/:impactId/:probabilityId'
			Projects.updateRiskAssignment(
				{
					projectId: project._id,
					assignedCategoryId: assignedCategory._id,
					assignedRiskId: assignedRisk._id
				},{impactId: assignedRisk.impact, probabilityId: assignedRisk.probability}, function(res){
					$scope.selectRiskForm(assignedRisk, 'view');
				}, function(err){
					$scope.error = err.data.message;
				}
			);
		};

		$scope.cancelEditAssignedRisk = function(assignedRisk){
			assignedRisk.impact = originalRiskAssignment[assignedRisk._id].impact;
            assignedRisk.probability = originalRiskAssignment[assignedRisk._id].probability;
			$scope.selectRiskForm(assignedRisk, 'view');
		};


	}
]);

'use strict';

// Configuring the Articles module
angular.module('roadmaps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Roadmaps', 'roadmaps', 'dropdown', '/roadmaps(/create)?');
		// Menus.addSubMenuItem('topbar', 'roadmaps', 'List Roadmaps', 'roadmaps');
		// Menus.addSubMenuItem('topbar', 'roadmaps', 'New Roadmap', 'roadmaps/create');
	}
]);

'use strict';

//Setting up route
angular.module('roadmaps').config(['$stateProvider',
	function($stateProvider) {
		// Roadmaps state routing
		$stateProvider.
		state('definition-roadmap', {
			url: '/roadmaps',
			templateUrl: 'modules/roadmaps/views/roadmaps.client.view.html'
		});
	}
]);

'use strict';

angular.module('roadmaps').controller('RoadmapsController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'Projects','Portfolios', 'GateProcessTemplates','Roadmaps', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcessTemplates, Roadmaps, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var roadmaps = [];

        vm.portfoliosSelectedForRoadmap = {
            //    portfolioID : true/false
        };

        vm.init = function(){

            vm.selectedRoadmapType = 'definition';

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
                // Create the properties for the portfolio selection
                _.each(portfolios, function(portfolio){
                    vm.portfoliosSelectedForRoadmap[portfolio._id] = false;
                });
                vm.portfoliosSelectedForRoadmap.all = false;
                vm.portfoliosSelectedForRoadmap.unassigned = false;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcessTemplates.query(function(gateProcesses){
                vm.gateProcesses = gateProcesses;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Roadmaps.getDefinitionRoadmap(function(res){
                roadmaps = res;
                console.log(res);
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };



        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


        // ------ PORTFOLIO SELECTION -----------


        vm.definitionRoadmaps = [];

        vm.isPortfolioSelectionEmpty = function () {
            // If no portfolios are selected, then all values should be false and this should return true
            var flag = true;
            _.each(vm.portfoliosSelectedForRoadmap, function(v, k){
                if(v){
                    flag = false;
                }
            });
            return flag;
        };


        vm.selectPortfolio = function(portfolio){

            if(portfolio === 'unassigned'){
                if(vm.portfoliosSelectedForRoadmap.unassigned){
                    vm.portfoliosSelectedForRoadmap.unassigned = false;
                } else {
                    vm.portfoliosSelectedForRoadmap.unassigned = true;
                }

            } else if(portfolio === 'all'){
                if(vm.portfoliosSelectedForRoadmap.all){
                    vm.portfoliosSelectedForRoadmap.all = false;
                    _.forEach(vm.portfoliosSelectedForRoadmap, function(v, k){
                        vm.portfoliosSelectedForRoadmap[k] = false;
                    });
                } else {
                    vm.portfoliosSelectedForRoadmap.all = true;
                    _.each(vm.portfoliosSelectedForRoadmap, function(v, k){
                        vm.portfoliosSelectedForRoadmap[k] = true;
                    });
                }

            } else {

                if(vm.portfoliosSelectedForRoadmap[portfolio._id]){
                    vm.portfoliosSelectedForRoadmap[portfolio._id] = false;
                } else {
                    vm.portfoliosSelectedForRoadmap[portfolio._id] = true;
                }
            }

        };

        var createDefinitionRoadmap = function(){
            var arrayOfPortfolioIds = _.keys(_.pick(vm.portfoliosSelectedForRoadmap, function(v, k){ return v; }));
            vm.definitionRoadmaps = _.filter(roadmaps, function(project){
                return _.some(arrayOfPortfolioIds, function(portfolioId){
                    if(portfolioId === 'unassigned' && project.portfolio === null){
                        return true;
                    } else {
                        return project.portfolio === portfolioId;
                    }
                });
            });
        };

        $scope.$watch(
            function($scope){ return vm.portfoliosSelectedForRoadmap; },
            function ( newValue, oldValue ) {
                if(newValue !== oldValue){
                    createDefinitionRoadmap();
                }
            }, true
        );

        vm.getPortfolioSelectionStatus = function(portfolio){
            if(portfolio === 'all'){
                return vm.portfoliosSelectedForRoadmap.all;
            }
            if(portfolio === 'unassigned'){
                return vm.portfoliosSelectedForRoadmap.unassigned;
            }
          return vm.portfoliosSelectedForRoadmap[portfolio._id]; 
        };

        // ------- FILTERS FOR ROADMAP DIRECTIVES ----

        vm.onlyDefinitionProjects = function(projects){
            return _.filter(projects, function(project){
                return project.identification.reqStartDate && project.identification.reqEndDate;
            });
        };

        vm.onlyDeliveryProjects = function(projects){
            return _.filter(projects, function(project){
                return project.gateData.start && project.gateData.end;
            });
        };


        // ------ PROJECT SELECTION -----------
        

        var modalProjectProfile = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/roadmaps/views/project-details.client.view.html',
                controller: function ($scope, $modalInstance, project) {

                    $scope.selectedProject = project;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(project){
            modalProjectProfile('lg', project);
        };






    }
]);

'use strict';

//Roadmaps service used to communicate Roadmaps REST endpoints
angular.module('roadmaps').factory('Roadmaps', ['$resource',
	function($resource) {
        return $resource('roadmaps', {
        }, {
            getDefinitionRoadmap: {
                method: 'GET',
                isArray: true,
                url: 'roadmaps/definition'
            }
        });
	}
]);

'use strict';

//Setting up route
angular.module('status-report-setup').config(['$stateProvider',
	function($stateProvider) {
		// Status report setup state routing
		$stateProvider.
		state('status-report-setup', {
			url: '/status-report-setup',
			templateUrl: 'modules/status-report-setup/views/status-report-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('status-report-setup').controller('StatusReportSetupController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'LogStatusIndicators', 'LogStatusAreas', '_','$q', 'StatusReportTypes',
	function($rootScope, $scope, $stateParams, $location, Authentication, LogStatusIndicators, LogStatusAreas, _ , $q, StatusReportTypes) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			LogStatusIndicators.query(function(logStatusIndicators){
				$scope.logStatusIndicators = logStatusIndicators;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			LogStatusAreas.query(function(logStatusAreas){
				$scope.logStatusAreas = logStatusAreas;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

            StatusReportTypes.query(function(res){
                $scope.statusReportTypes = res;
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



// ----------------------------------------------- STATUS-INDICATORS ---------------------------------------

        
        $scope.colors = [
            {colorName: 'Silver', colorString: 'silver'},
            {colorName: 'Gray', colorString: 'gray'},
            {colorName: 'White', colorString: 'white'},
            {colorName: 'Red', colorString: 'red'},
            {colorName: 'Purple', colorString: 'purple'},
            {colorName: 'Fuchsia', colorString: 'fuchsia'},
            {colorName: 'Green', colorString: 'green'},
            {colorName: 'Olive', colorString: 'olive'},
            {colorName: 'Yellow', colorString: 'yellow'},
            {colorName: 'Navy', colorString: 'navy'},
            {colorName: 'Teal', colorString: 'teal'},
            {colorName: 'Aqua', colorString: 'aqua'},
            {colorName: 'Orange', colorString: 'orange'}
        ];

		// ------------------- NG-SWITCH ---------------------

		$scope.switchStatusIndicatorForm = {};

		$scope.selectStatusIndicatorForm = function(status, string){
			if(string === 'view'){ $scope.switchStatusIndicatorForm[status._id] = 'view';}
			if(string === 'new'){$scope.switchStatusIndicatorForm[status._id] = 'new';}
			if(string === 'edit'){$scope.switchStatusIndicatorForm[status._id] = 'edit';}
		};

		// ------------------- LIST OF STATUSES -----------------

		$scope.findStatusIndicators = function() {
			$scope.initError = [];
			LogStatusIndicators.query(function(statuses){
				$scope.logStatusIndicators = statuses;
			}, function(err){
				$scope.initError.push(err.data.message);
			});
		};

		// ------------------- EDIT -----------------

		var originalStatusIndicator = {};
		$scope.selectStatusIndicator = function(statusIndicator){
			$scope.error = null;
			originalStatusIndicator[statusIndicator._id] = _.clone(statusIndicator);
			$scope.selectStatusIndicatorForm(statusIndicator, 'edit');
		};

		$scope.updateStatusIndicator = function(statusIndicator) {
			$scope.error = null;
			statusIndicator.$update(function(res) {
				$scope.findStatusIndicators();
				$scope.selectStatusIndicatorForm(statusIndicator, 'view');
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		$scope.cancelEditStatusIndicator = function(statusIndicator){
            statusIndicator.name = originalStatusIndicator[statusIndicator._id].name;
            statusIndicator.description = originalStatusIndicator[statusIndicator._id].description;
			$scope.selectStatusIndicatorForm(statusIndicator, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeStatusIndicator = function(statusIndicator) {
			$scope.error = null;
            statusIndicator.$remove(function(res) {
				$scope.findStatusIndicators();
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createStatusIndicator = function() {
			$scope.error = null;
			var statusIndicator = new LogStatusIndicators ({
				name: 'New status indicator'
			});
			statusIndicator.$save(function(res) {
				$scope.findStatusIndicators();
				$scope.selectStatusIndicatorForm(res, 'view');

			}, function(err) {
				$scope.error = err.data.message;
			});
		};


// ----------------------------------------------- STATUS-AREAS ---------------------------------------

        $scope.applicableToList = [
            {name: 'Project', text: 'project'},
            {name: 'Portfolio', text: 'portfolio'},
            {name: 'Project + Portfolio', text: 'both'}
        ];

        // ------------------- NG-SWITCH ---------------------

        $scope.switchStatusAreaForm = {};

        $scope.selectStatusAreaForm = function(status, string){
            if(string === 'view'){ $scope.switchStatusAreaForm[status._id] = 'view';}
            if(string === 'new'){$scope.switchStatusAreaForm[status._id] = 'new';}
            if(string === 'edit'){$scope.switchStatusAreaForm[status._id] = 'edit';}
        };

        // ------------------- LIST OF STATUSES -----------------

        $scope.findStatusAreas = function() {
            $scope.initError = [];
            LogStatusAreas.query(function(statuses){
                $scope.logStatusAreas = statuses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalStatusArea = {};
        $scope.selectStatusArea = function(statusArea){
            $scope.error = null;
            originalStatusArea[statusArea._id] = _.clone(statusArea);
            $scope.selectStatusAreaForm(statusArea, 'edit');
        };

        $scope.updateStatusArea = function(statusArea) {
            $scope.error = null;
            statusArea.$update(function(res) {
                $scope.findStatusAreas();
                $scope.selectStatusAreaForm(statusArea, 'view');
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditStatusArea = function(statusArea){
            statusArea.name = originalStatusArea[statusArea._id].name;
            statusArea.description = originalStatusArea[statusArea._id].description;
            statusArea.applicableTo = originalStatusArea[statusArea._id].applicableTo;
            $scope.selectStatusAreaForm(statusArea, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeStatusArea = function(statusArea) {
            $scope.error = null;
            statusArea.$remove(function(res) {
                $scope.findStatusAreas();
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createStatusArea = function() {
            $scope.error = null;
            var statusArea = new LogStatusAreas ({
                name: 'New status area',
                applicableTo : 'both'
            });
            statusArea.$save(function(res) {
                $scope.findStatusAreas();
                $scope.selectStatusAreaForm(res, 'view');

            }, function(err) {
                $scope.error = err.data.message;
            });
        };



        // ----------------------------------------------- STATUS-TYPES ---------------------------------------


        // ------------------- NG-SWITCH ---------------------

        $scope.switchStatusTypeForm = {};

        $scope.selectStatusTypeForm = function(status, string){
            if(string === 'view'){ $scope.switchStatusTypeForm[status._id] = 'view';}
            if(string === 'new'){$scope.switchStatusTypeForm[status._id] = 'new';}
            if(string === 'edit'){$scope.switchStatusTypeForm[status._id] = 'edit';}
        };

        // ------------------- LIST OF TYPES -----------------

        $scope.findStatusTypes = function() {
            $scope.initError = [];
            StatusReportTypes.query(function(statuses){
                $scope.statusReportTypes = statuses;
            }, function(err){
                $scope.initError.push(err.data.message);
            });
        };

        // ------------------- EDIT -----------------

        var originalStatusType = {};
        $scope.selectStatusType = function(statusType){
            $scope.error = null;
            originalStatusType[statusType._id] = _.clone(statusType);
            $scope.selectStatusTypeForm(statusType, 'edit');
        };

        $scope.updateStatusType = function(statusType) {
            $scope.error = null;
            statusType.$update(function(res) {
                $scope.findStatusTypes();
                $scope.selectStatusTypeForm(statusType, 'view');
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelEditStatusType = function(statusType){
            statusType.name = originalStatusType[statusType._id].name;
            statusType.description = originalStatusType[statusType._id].description;
            $scope.selectStatusTypeForm(statusType, 'view');
        };

        // ------------------- DELETE -----------------

        $scope.removeStatusType = function(statusType) {
            $scope.error = null;
            statusType.$remove(function(res) {
                $scope.findStatusTypes();
            }, function(err) {
                $scope.error = err.data.message;
            });
        };

        // ------------------- NEW -----------------

        $scope.createStatusType = function() {
            $scope.error = null;
            var statusType = new StatusReportTypes ({
                name: 'New report type'
            });
            statusType.$save(function(res) {
                $scope.findStatusTypes();
                $scope.selectStatusTypeForm(res, 'view');

            }, function(err) {
                $scope.error = err.data.message;
            });
        };




    }
]);

'use strict';

//Log status areas service used to communicate Log status areas REST endpoints
angular.module('status-report-setup').factory('LogStatusAreas', ['$resource',
	function($resource) {
		return $resource('log-status-areas/:logStatusAreaId', { logStatusAreaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Log statuses service used to communicate Log statuses REST endpoints
angular.module('status-report-setup').factory('LogStatusIndicators', ['$resource',
	function($resource) {
		return $resource('log-status-indicators/:logStatusIndicatorId', { logStatusIndicatorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Status report types service used to communicate Status report types REST endpoints
angular.module('status-report-setup').factory('StatusReportTypes', ['$resource',
	function($resource) {
		return $resource('status-report-types/:statusReportTypeId', { statusReportTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('status-summaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Status summaries', 'status-summaries', 'dropdown', '/status-summaries(/create)?');
		// Menus.addSubMenuItem('topbar', 'status-summaries', 'List Status summaries', 'status-summaries');
		// Menus.addSubMenuItem('topbar', 'status-summaries', 'New Status summary', 'status-summaries/create');
	}
]);

'use strict';

//Setting up route
angular.module('status-summaries').config(['$stateProvider',
    function($stateProvider) {
        // Status summaries state routing
        $stateProvider.
        state('portfolio-status-summary', {
            url: '/portfolio-status-summary',
            templateUrl: 'modules/status-summaries/views/portfolio-summary.client.view.html'
        });
    }
]);

'use strict';

angular.module('status-summaries').controller('StatusSummaryController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'StatusSummaries','LogStatusAreas','Projects','Portfolios', 'GateProcessTemplates', '_','$q','$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, StatusSummaries, LogStatusAreas, Projects, Portfolios, GateProcessTemplates, _, $q, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ----------- INIT ---------------

        vm.initError = [];

        var projects = [];

        vm.init = function(){

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Projects.query({'selection.active':true, 'selection.selectedForDelivery':true, 'process.assignmentConfirmed':true}, function(res){
                projects = res;
                console.log(res);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusAreas.query(function(res){
                vm.logStatusAreas = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };



        // ------ TREE RECURSIONS -----------

        var createNodeTrees = function(strategicNodes){
            var nodeTrees = [];
            strategicNodes.forEach(function(node){
                if(node.parent === null){
                    nodeTrees.push(
                        {node : node, nodeTrees : []}
                    );
                }
            });
            var recursionOnNodeTrees = function(nodeTrees){
                nodeTrees.forEach(function(node){
                    strategicNodes.forEach(function(strategicNode){
                        if(strategicNode.parent !== null){
                            if(node.node._id === strategicNode.parent){
                                node.nodeTrees.push(
                                    {node : strategicNode, nodeTrees : []}
                                );
                            }
                        }
                    });
                    recursionOnNodeTrees(node.nodeTrees);
                });
            };
            recursionOnNodeTrees(nodeTrees);
            return nodeTrees;
        };


        // ------ PORTFOLIO SELECTION -----------

        vm.selectPortfolio = function(portfolio){
            if(portfolio === 'all'){
                vm.treeSelectionFlag = 'all';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'All'};
                vm.projects = projects;
                return;
            }
            if(portfolio === 'unassigned'){
                vm.treeSelectionFlag = 'unassigned';
                vm.selectedProjectProfile = null;
                vm.selectedPortfolio = {name : 'Unassigned'};
                vm.projects = _.filter(projects, function(project){
                    return _.isNull(project.portfolio);
                });
                return;
            }
            vm.selectedProjectProfile = null;
            vm.treeSelectionFlag = 'portfolio';
            vm.selectedPortfolio = portfolio;
            vm.projects = _.filter(projects, function(project){
                return (project.portfolio && (project.portfolio._id === portfolio._id));
            });

        };

        // ------ FILTER RANKING -----------

        vm.orderByProperty = 'qualitativeScore';
        vm.orderByDirection = true; // From highest to lowest
        vm.orderByRanking = function(property, direction){
            vm.orderByProperty = property;
            vm.orderByDirection = direction;
        };

        // ------ PROJECT SELECTION -----------

        vm.projectProfileDetails = 'financial';

        var modalProjectProfile = function (size, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/status-summaries/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, project) {

                    $scope.project = project;

                    $scope.cancelModal = function () {
                        $modalInstance.dismiss();
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(project){
            modalProjectProfile('lg', project);
        };






    }
]);

'use strict';

//Status summaries service used to communicate Status summaries REST endpoints
angular.module('status-summaries').factory('StatusSummaries', ['$resource',
    function($resource) {
        return $resource('status-summaries', {
        }, {
            portfolioSummary: {
                method: 'GET',
                isArray: true,
                url: 'status-summaries/portfolioSummary'
            }
        });
    }
]);

'use strict';

//Setting up route
angular.module('strategy-alignment').config(['$stateProvider',
	function($stateProvider) {
		// Strategy alignment state routing
		$stateProvider.
		state('strategy-alignment', {
			url: '/strategy-alignment',
			templateUrl: 'modules/strategy-alignment/views/strategy-alignment.client.view.html'
		});
	}
]);
'use strict';

angular.module('strategy-alignment').controller('StrategyAlignmentController', ['$rootScope', '$scope','$stateParams', '$location', 'Authentication',
	'StrategyNodes','Projects', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, StrategyNodes, Projects, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

        $scope.isResolving = false;

		$scope.initError = [];

		$scope.init = function(){

            $q.all([
                StrategyNodes.query().$promise,
                Projects.query({'selection.active': true}).$promise
            ]).then(function(data) {
                var strategyNodes = data[0];
                var projects = data[1];

                $scope.strategyNodes = strategyNodes;
                $scope.strategyTrees = createNodeTrees(strategyNodes);
                $scope.projects = projects;

                $scope.selectedAssignments = {};
                $scope.selectedAssignments.assignedProjects = {};
                $scope.selectedAssignments.unassignedProjects = [];
                createProjectAssignments(projects, strategyNodes, $scope.selectedAssignments);
            });

		};

		var createProjectAssignments = function(projects, strategyNodes, selectedAssignments){
            _.forEach(strategyNodes, function(node){
                selectedAssignments.assignedProjects[node._id] = [];
            });
            _.map(projects, function(project){
				if(_.isNull(project.parent) || _.isUndefined(project.parent)){
                    selectedAssignments.unassignedProjects.push(project);
				} else {
                    _.forEach(strategyNodes, function(node){
                        if(project.parent === node._id){selectedAssignments.assignedProjects[node._id].push(project);}
                    });
				}
			});
		};



		// ------- ROLES FOR BUTTONS ------

		var d = $q.defer();
		d.resolve(Authentication);

		d.promise.then(function(data){
			var obj = _.clone(data);
			$scope.userHasAuthorization = _.some(obj.user.roles, function(role){
				return role === 'superAdmin' || role === 'admin' || role === 'pmo' || role === 'portfolioManager';
			});
		});


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};



		// ------------------- PROJECTS FOR NODE ------------

		$scope.selectNode = function(node){
            $scope.error = null;
			$scope.selectedNode = node;
		};


        // ------------------- DRAG AND DROP LISTENERS -------

        $scope.dragControlListenersAssigned = {
            itemMoved: function (eventObj) {
                var movedProjectFromAssigned = eventObj.source.itemScope.project;
                var originalParent = movedProjectFromAssigned.parent;
                movedProjectFromAssigned.parent = null;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updateStrategyAssignment(movedProjectFromAssigned, function(res){
                    $scope.isResolving = false;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                    // put back project in case of failure
                    movedProjectFromAssigned.parent = originalParent;
                    eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                    eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromAssigned);
                });
            }
        };

        $scope.dragControlListenersUnassigned = {
            itemMoved: function (eventObj) {
                var movedProjectFromUnassigned = eventObj.source.itemScope.project;
                movedProjectFromUnassigned.parent = $scope.selectedNode._id;
                $scope.error = null;
                $scope.isResolving = true;
                Projects.updateStrategyAssignment(movedProjectFromUnassigned, function(res){
                    $scope.isResolving = false;
                }, function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                    // put back project in case of failure
                    movedProjectFromUnassigned.parent = null;
                    eventObj.dest.sortableScope.removeItem(eventObj.dest.index);
                    eventObj.source.itemScope.sortableScope.insertItem(eventObj.source.index, movedProjectFromUnassigned);
                });
            }
        };


	}
]);

'use strict';

//Setting up route
angular.module('strategy-node-setup').config(['$stateProvider',
	function($stateProvider) {
		// Strategy node setup state routing
		$stateProvider.
		state('strategy-node-setup', {
			url: '/strategy-node-setup',
			templateUrl: 'modules/strategy-node-setup/views/strategy-node-setup.client.view.html'
		});
	}
]);
'use strict';

angular.module('strategy-node-setup').controller('StrategyNodeSetupController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'StrategyNodes','StrategyNodeTypes','Subusers','_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, StrategyNodes, StrategyNodeTypes, Subusers, _ , $q) {

		$rootScope.staticMenu = false;

		// ----------- INIT ---------------

        $scope.initError = [];

		$scope.init = function(){

            StrategyNodes.query(function(strategyNodes){
                $scope.strategyNodes = strategyNodes;
                $scope.strategyTrees = createNodeTrees(strategyNodes);
            }, function(err){
                $scope.initError.push(err.data.message);
            });

            StrategyNodeTypes.query(function(strategyNodeTypes){
                $scope.strategyNodeTypes = strategyNodeTypes;
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


// ------------------------------------------------ STRATEGY NODE TYPES -----------------------------------------

		// ------------------- NG-SWITCH ---------------------

		$scope.switchTypeForm = {};

		$scope.selectTypeForm = function(type, string){
			if(string === 'view'){ $scope.switchTypeForm[type._id] = 'view';}
			if(string === 'new'){$scope.switchTypeForm[type._id] = 'new';}
			if(string === 'edit'){$scope.switchTypeForm[type._id] = 'edit';}
		};

		// ------------------- LIST OF TYPES -----------------

		$scope.findTypes = function() {
            $scope.initError = [];
			StrategyNodeTypes.query(function(types){
				$scope.strategyNodeTypes = types;
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- EDIT -----------------

		$scope.selectType = function(type){
			$scope.selectTypeForm(type, 'edit');
		};

		$scope.updateType = function(type) {
			type.$update(function(response) {
				$scope.findTypes();
				$scope.selectTypeForm(type, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditType = function(type){
			$scope.findTypes();
			$scope.selectTypeForm(type, 'view');
		};

		// ------------------- DELETE -----------------

		$scope.removeType = function(type) {
			type.$remove(function(response) {
				$scope.findTypes();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- NEW -----------------

		$scope.createType = function() {
			var strategyNodeType = new StrategyNodeTypes ({
				name: 'New strategy node type'
			});
			strategyNodeType.$save(function(response) {
				$scope.name = '';
				$scope.findTypes();
				$scope.selectTypeForm(response._id, 'view');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



// ------------------------------------------------ STRATEGY DECOMPOSITION --------------------------------------


		// ------ TREE RECURSIONS -----------

		var createNodeTrees = function(strategicNodes){
			var nodeTrees = [];
			strategicNodes.forEach(function(node){
				if(node.parent === null){
					nodeTrees.push(
						{node : node, nodeTrees : []}
					);
				}
			});
			var recursionOnNodeTrees = function(nodeTrees){
				nodeTrees.forEach(function(node){
					strategicNodes.forEach(function(strategicNode){
						if(strategicNode.parent !== null){
							if(node.node._id === strategicNode.parent){
								node.nodeTrees.push(
									{node : strategicNode, nodeTrees : []}
								);
							}
						}
					});
					recursionOnNodeTrees(node.nodeTrees);
				});
			};
			recursionOnNodeTrees(nodeTrees);
			return nodeTrees;
		};

		// Create ancestors array: add parent and parent's ancestors to child's ancestors. Returns ancestors array.
		var ancestorsArray = function(parent){
			if(parent){
				var retArray = [];
				retArray.push(parent._id);
				_.map(parent.ancestors, function(ancestor){
					retArray.push(ancestor);
				});
				return retArray;
			} else {return [];}
		};


		// ------------- REFRESH NODES LIST ------------

		$scope.strategyNodeList = function(){
            $scope.initError = [];
			StrategyNodes.query(function(strategyNodes){
				$scope.strategyNodes = strategyNodes;
				$scope.strategyTrees = createNodeTrees(strategyNodes);
			}, function(err){
                $scope.initError.push(err.data.message);
            });
		};

		// ------------------- NG-SWITCH ---------------------

		$scope.switchStrategyNodeForm = 'view';

		$scope.selectStrategyNodeForm = function(string){
			if(string === 'view'){ $scope.switchStrategyNodeForm = 'view';}
			if(string === 'new'){$scope.switchStrategyNodeForm = 'new';}
			if(string === 'edit'){$scope.switchStrategyNodeForm = 'edit';}
		};


		// ------------- VIEW ONE NODE ---------------------

		var masterStrategyNode = {};

		$scope.selectStrategyNode = function(strategyNodeId){
			$scope.editParents = [];
			$scope.selectStrategyNodeForm('view');
			StrategyNodes.get({strategyNodeId:strategyNodeId}, function(strategyNode){
				masterStrategyNode = strategyNode;
				$scope.editStrategyNode = _.clone(strategyNode);

				// Only nodes without children can be moved
				// A node cannot be a child of himself.
				// Can only be moved to nodes without children or that have only one layer of children.
				if(_.find($scope.strategyNodes, function(chkItem){
						return _.get(chkItem,'parent') === strategyNode._id;
					})){$scope.editParents = [_.get(strategyNode,'parent')];} else {
					$scope.editParents = _.filter($scope.strategyNodes, function(item){
						if(item._id === strategyNodeId){return false;}
						else {
							if(_.isNull(item.parent) || _.isUndefined(item.parent)){return true;} else {
								if(
									_.find($scope.strategyNodes, function(chkItem){
										return _.get(chkItem,'parent') === item._id && (
												_.find($scope.strategyNodes, function(chkItem2){
													return _.get(chkItem2,'parent') === chkItem._id;
												})
											);
									})
								){return false;} else {
									return true;
								}
							}
						}
					});
				}
				$scope.error = null;
			}, function(errorResponse){$scope.error = errorResponse.data.message;});
		};

		// ------------ EDIT ONE NODE ---------------

		// allow the moving of children back to root
		var editParent = function(parent){
			if(parent){
				return _.get($scope.editStrategyNode,'parent._id');
			} else {
				return null;
			}
		};

		// allow assigning no type to node
		var editType = function(type){
			if(type){
				return _.get($scope.editStrategyNode,'type._id');
			} else {
				return null;
			}
		};

		$scope.update = function() {

			masterStrategyNode.name = _.get($scope.editStrategyNode,'name');
			masterStrategyNode.parent = editParent(_.get($scope.editStrategyNode,'parent'));
			masterStrategyNode.type = editType(_.get($scope.editStrategyNode,'type'));
			masterStrategyNode.ancestors = ancestorsArray(_.get($scope.editStrategyNode,'parent'));

			masterStrategyNode.$update(function() {
				$scope.strategyNodeList();
				$scope.selectStrategyNode(masterStrategyNode._id);
				$scope.selectStrategyNodeForm('view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};

		// ------------ DELETE NODE -------------

		$scope.remove = function() {
			// Only nodes with no children can be deleted
			if(_.find($scope.strategyNodes, function(chkItem){
					return _.get(chkItem,'parent') === masterStrategyNode._id;
				})){
				$scope.error = 'Only strategy nodes without children can be deleted';
			} else {
				masterStrategyNode.$remove(function(response){
					for (var i in $scope.strategyNodes) {
						if ($scope.strategyNodes[i] === masterStrategyNode) {
							$scope.strategyNodes.splice(i, 1);
						}
					}
					//refresh the list after removing
					$scope.strategyNodeList();
					// close edit
					$scope.selectStrategyNodeForm('view');
					$scope.editStrategyNode = null;

				}, function(errorResponse){
					$scope.error = errorResponse.data.message;
				});
			}
		};


		// -------------------- CREATE NEW NODE ----------------

		$scope.selectNewStrategyNode = function(){

			$scope.selectStrategyNodeForm('new');

			$scope.error = null;

			$scope.newStrategyNode = {};
			$scope.newStrategyNode.name = null;
			$scope.newStrategyNode.type = null;
			$scope.newStrategyNode.parent = null;

			// A new node can be a child of:
			// any root
			// or a child that it's either last level (no parent) or, if parent, its child has no children


			$scope.newParents = _.filter($scope.strategyNodes, function(item){
				if(_.isNull(item.parent) || _.isUndefined(item.parent)){return true;} else {
					if(_.find($scope.strategyNodes, function(chkItem){
							return _.get(chkItem,'parent') === item._id && (
									_.find($scope.strategyNodes, function(chkItem2){
										return _.get(chkItem2,'parent') === chkItem._id;
									})
								);
						})
					){return false;} else {
						return true;
					}
				}
			});
		};

		$scope.create = function() {
			// Create new node object
			var strategyNode = new StrategyNodes ({
				name: _.get($scope.newStrategyNode,'name'),
				type: _.get($scope.newStrategyNode,'type._id'),
				parent: _.get($scope.newStrategyNode,'parent._id'),
				ancestors: ancestorsArray(_.get($scope.newStrategyNode,'parent'))
			});

			strategyNode.$save(function(response) {
				//Refresh after save
				$scope.strategyNodeList();
				$scope.selectStrategyNode(response._id);
				$scope.selectStrategyNodeForm('view');

				// Clear form fields
				$scope.newStrategyNode.name = null;
				$scope.newStrategyNode.type = null;
				$scope.newStrategyNode.parent = null;

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);


'use strict';

//Strategy node types service used to communicate Strategy node types REST endpoints
angular.module('strategy-node-setup').factory('StrategyNodeTypes', ['$resource',
	function($resource) {
		return $resource('strategy-node-types/:strategyNodeTypeId', { strategyNodeTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Strategy nodes service used to communicate Strategy nodes REST endpoints
angular.module('strategy-node-setup').factory('StrategyNodes', ['$resource',
	function($resource) {
		return $resource('strategy-nodes/:strategyNodeId', { strategyNodeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('subusers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Subusers', 'subusers', 'dropdown', '/subusers(/create)?', false, ['superAdmin']);
		Menus.addSubMenuItem('topbar', 'admin', 'Subusers', 'menuTitle');
		Menus.addSubMenuItem('topbar', 'admin', 'List Subusers', 'subusers');
		Menus.addSubMenuItem('topbar', 'admin', 'New Subuser', 'subusers/create');
	}
]);

'use strict';

//Setting up route
angular.module('subusers').config(['$stateProvider',
	function($stateProvider) {
		// Subusers state routing
		$stateProvider.
		state('listSubusers', {
			url: '/subusers',
			templateUrl: 'modules/subusers/views/list-subusers.client.view.html'
		}).
		state('createSubuser', {
			url: '/subusers/create',
			templateUrl: 'modules/subusers/views/create-subuser.client.view.html'
		}).
		state('editSubuser', {
			url: '/subusers/:subuserId',
			templateUrl: 'modules/subusers/views/edit-subuser.client.view.html'
		});
	}
]);

'use strict';

// Subusers controller
angular.module('subusers').controller('SubusersController', ['$rootScope', '$http','$scope', '$stateParams', '$location', 'Authentication', 'Subusers','$q','_',
	function($rootScope, $http, $scope, $stateParams, $location, Authentication, Subusers, $q, _) {


		$rootScope.staticMenu = false;

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

		// ------



		$scope.roles = [
			{roleString:'admin', roleTitle: 'Administrator', selected:false},
			{roleString:'pmo', roleTitle: 'PMO', selected:false},
			{roleString: 'projectManager', roleTitle: 'Project Manager', selected:false},
			{roleString: 'portfolioManager', roleTitle: 'Portfolio Manager', selected:false},
			{roleString: 'executive', roleTitle: 'Executive', selected:false}
		];

		$scope.credentials = {
			roles:['portfolioManager']
		};

		$scope.subuserFilter = {
			firstName: '',
			lastName: '',
			company : '',
			email : '',
			username : '',
			roles : []
		};

        // Roles filter
		$scope.hasRole = function(subuser){
            if($scope.subuserFilter.roles.length){
                var foundRole = false;
                _.forEach(subuser.roles, function(role){
                    _.forEach($scope.subuserFilter.roles, function(fRole){
                       if(role === fRole){
                           foundRole = true;
                       }
                    });
                });
                return foundRole;
            } else {
                return true;
            }
        };

        $scope.getDisplayRoleName = function (role) {
            if(role){
                return _.find($scope.roles, 'roleString', role).roleTitle;
            }
        };

		// Create new Subuser
        
        $scope.hasNoRolesCheck = function(roles){
            return _.isEmpty(roles);
        };
        
		$scope.create = function() {
			$http.post('/subusers', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				//$scope.authentication.user = response;

				// And redirect to the list of subuser

				$location.path('subusers');
			}).error(function(response) {
				$scope.error = response.message;
			});
			// Create new Subuser object
			//var subuser = new Subusers ({
			//	name: this.name
			//});
            //
			//// Redirect after save
			//subuser.$save(function(response) {
			//	$location.path('subusers/' + response._id);
            //
			//	// Clear form fields
			//	$scope.name = '';
			//}, function(errorResponse) {
			//	$scope.error = errorResponse.data.message;
			//});
		};

		// Remove existing Subuser
		$scope.remove = function(subuser) {
			if ( subuser ) { 
				subuser.$remove();

				for (var i in $scope.subusers) {
					if ($scope.subusers [i] === subuser) {
						$scope.subusers.splice(i, 1);
					}
				}
			} else {
				$scope.subuser.$remove(function() {
					$location.path('subusers');
				});
			}
		};

		// Update existing Subuser
        
        $scope.switchUserForm = {};
        
        var originalSubuser = {};
        
        $scope.editSubuser = function (subuser) {
            originalSubuser[subuser._id] = _.cloneDeep(subuser);
            $scope.switchUserForm[subuser._id] = 'edit';
        };

        $scope.cancelEditSubuser = function (subuser) {
            subuser.firstName = originalSubuser[subuser._id].firstName;
            subuser.lastName = originalSubuser[subuser._id].lastName;
            subuser.email = originalSubuser[subuser._id].email;
            subuser.title = originalSubuser[subuser._id].title;
            subuser.organization = originalSubuser[subuser._id].organization;
            subuser.roles = originalSubuser[subuser._id].roles;
            subuser.username = originalSubuser[subuser._id].username;
            subuser.password = originalSubuser[subuser._id].password;
            
            $scope.switchUserForm[subuser._id] = 'view';
        };
        
		$scope.update = function() {
			var subuser = $scope.subuser;

			subuser.$update(function(res) {
                $scope.switchUserForm[subuser._id] = 'view';
			}, function(err) {
				$scope.error = err.data.message;
			});
		};

		// Find a list of Subusers
		$scope.find = function() {
			$scope.subusers = Subusers.query();
		};

		// Find existing Subuser
		$scope.findOne = function() {
			$scope.subuser = Subusers.get({ 
				subuserId: $stateParams.subuserId
			});
		};
	}
]);

'use strict';

angular.module('subusers').filter('filterSubuser', [
	function() {
		return function(input) {
			// Filter subuser directive logic
			// ...

			return 'filterSubuser filter: ' + input;
		};
	}
]);
'use strict';

//Subusers service used to communicate Subusers REST endpoints
angular.module('subusers').factory('Subusers', ['$resource',
	function($resource) {
		return $resource('subusers/:subuserId', { subuserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		//state('accounts', {
		//	url: '/settings/accounts',
		//	templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		//}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$location', 'Authentication',
	function($rootScope, $scope, $http, $location, Authentication) {

        $rootScope.staticMenu = true;
        
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

        // Set default checkbox for seed data
        $scope.credentials = {};
        $scope.credentials.seedData = true;

		$scope.signup = function() {
            $scope.isResolving = true;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
                $scope.isResolving = false;

				// And redirect to the index page
				$location.path('/mytao');
			}).error(function(response) {
				$scope.error = response.message;
                $scope.isResolving = false;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/mytao');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('PasswordController', ['$rootScope', '$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($rootScope, $scope, $stateParams, $http, $location, Authentication) {

        $rootScope.staticMenu = !!Authentication;
        
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

angular.module('users').controller('SettingsController', ['$rootScope', '$scope', '$http', '$location', 'Users', 'Authentication',
	function($rootScope, $scope, $http, $location, Users, Authentication) {

        $rootScope.staticMenu = false;

		$scope.user = Authentication.user;

        // SD: To see the roles in the 'view'
		$scope.roles = [
            {roleString:'superAdmin', roleTitle: 'Super Administrator', selected:false},
			{roleString:'admin', roleTitle: 'Administrator', selected:false},
			{roleString:'pmo', roleTitle: 'PMO', selected:false},
			{roleString: 'projectManager', roleTitle: 'Project Manager', selected:false},
			{roleString: 'portfolioManager', roleTitle: 'Portfolio Manager', selected:false},
			{roleString: 'executive', roleTitle: 'Executive', selected:false}
		];

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
            // SD: isValid defaults to false, so I've negated the if, before it was if(isValid){}
			if (!isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$q',
	function($q) {
		var _this = this;




		_this._data = {
			user: window.user
		};



		return _this._data;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
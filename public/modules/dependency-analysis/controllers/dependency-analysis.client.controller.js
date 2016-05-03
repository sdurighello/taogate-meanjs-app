'use strict';

angular.module('dependency-analysis').controller('DependencyAnalysisController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
	'Projects','Portfolios', 'DependencyTypes', 'DependencyStates', 'DependencyImpacts', 'Dependencies', 'LogStatusIndicators', '_','$q',
	function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, DependencyTypes, DependencyStates, DependencyImpacts,
             Dependencies, LogStatusIndicators, _ , $q) {

        $rootScope.staticMenu = false;

		// ----------- INIT ---------------

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

        // ------- D3 --------

        $scope.dependencyData = {
            'nodes':[
                {'name':'Myriel','group':1},
                {'name':'Napoleon','group':1},
                {'name':'Mlle.Baptistine','group':1},
                {'name':'Mme.Magloire','group':1},
                {'name':'CountessdeLo','group':1},
                {'name':'Geborand','group':1},
                {'name':'Champtercier','group':1},
                {'name':'Cravatte','group':1},
                {'name':'Count','group':1},
                {'name':'OldMan','group':1},
                {'name':'Labarre','group':2},
                {'name':'Valjean','group':2},
                {'name':'Marguerite','group':3},
                {'name':'Mme.deR','group':2},
                {'name':'Isabeau','group':2},
                {'name':'Gervais','group':2},
                {'name':'Tholomyes','group':3},
                {'name':'Listolier','group':3},
                {'name':'Fameuil','group':3},
                {'name':'Blacheville','group':3},
                {'name':'Favourite','group':3},
                {'name':'Dahlia','group':3},
                {'name':'Zephine','group':3},
                {'name':'Fantine','group':3},
                {'name':'Mme.Thenardier','group':4},
                {'name':'Thenardier','group':4},
                {'name':'Cosette','group':5},
                {'name':'Javert','group':4},
                {'name':'Fauchelevent','group':0},
                {'name':'Bamatabois','group':2},
                {'name':'Perpetue','group':3},
                {'name':'Simplice','group':2},
                {'name':'Scaufflaire','group':2},
                {'name':'Woman1','group':2},
                {'name':'Judge','group':2},
                {'name':'Champmathieu','group':2},
                {'name':'Brevet','group':2},
                {'name':'Chenildieu','group':2},
                {'name':'Cochepaille','group':2},
                {'name':'Pontmercy','group':4},
                {'name':'Boulatruelle','group':6},
                {'name':'Eponine','group':4},
                {'name':'Anzelma','group':4},
                {'name':'Woman2','group':5},
                {'name':'MotherInnocent','group':0},
                {'name':'Gribier','group':0},
                {'name':'Jondrette','group':7},
                {'name':'Mme.Burgon','group':7},
                {'name':'Gavroche','group':8},
                {'name':'Gillenormand','group':5},
                {'name':'Magnon','group':5},
                {'name':'Mlle.Gillenormand','group':5},
                {'name':'Mme.Pontmercy','group':5},
                {'name':'Mlle.Vaubois','group':5},
                {'name':'Lt.Gillenormand','group':5},
                {'name':'Marius','group':8},
                {'name':'BaronessT','group':5},
                {'name':'Mabeuf','group':8},
                {'name':'Enjolras','group':8},
                {'name':'Combeferre','group':8},
                {'name':'Prouvaire','group':8},
                {'name':'Feuilly','group':8},
                {'name':'Courfeyrac','group':8},
                {'name':'Bahorel','group':8},
                {'name':'Bossuet','group':8},
                {'name':'Joly','group':8},
                {'name':'Grantaire','group':8},
                {'name':'MotherPlutarch','group':9},
                {'name':'Gueulemer','group':4},
                {'name':'Babet','group':4},
                {'name':'Claquesous','group':4},
                {'name':'Montparnasse','group':4},
                {'name':'Toussaint','group':5},
                {'name':'Child1','group':10},
                {'name':'Child2','group':10},
                {'name':'Brujon','group':4},
                {'name':'Mme.Hucheloup','group':8}
            ],
            'links':[
                {'source':1,'target':0,'value':1},
                {'source':1,'target':0,'value':1},
                {'source':1,'target':1,'value':1},
                {'source':2,'target':0,'value':8},
                {'source':3,'target':0,'value':10},
                {'source':3,'target':2,'value':6},
                {'source':4,'target':0,'value':1},
                {'source':5,'target':0,'value':1},
                {'source':6,'target':0,'value':1},
                {'source':7,'target':0,'value':1},
                {'source':8,'target':0,'value':2},
                {'source':9,'target':0,'value':1},
                {'source':11,'target':10,'value':1},
                {'source':11,'target':3,'value':3},
                {'source':11,'target':2,'value':3},
                {'source':11,'target':0,'value':5},
                {'source':12,'target':11,'value':1},
                {'source':13,'target':11,'value':1},
                {'source':14,'target':11,'value':1},
                {'source':15,'target':11,'value':1},
                {'source':17,'target':16,'value':4},
                {'source':18,'target':16,'value':4},
                {'source':18,'target':17,'value':4},
                {'source':19,'target':16,'value':4},
                {'source':19,'target':17,'value':4},
                {'source':19,'target':18,'value':4},
                {'source':20,'target':16,'value':3},
                {'source':20,'target':17,'value':3},
                {'source':20,'target':18,'value':3},
                {'source':20,'target':19,'value':4},
                {'source':21,'target':16,'value':3},
                {'source':21,'target':17,'value':3},
                {'source':21,'target':18,'value':3},
                {'source':21,'target':19,'value':3},
                {'source':21,'target':20,'value':5},
                {'source':22,'target':16,'value':3},
                {'source':22,'target':17,'value':3},
                {'source':22,'target':18,'value':3},
                {'source':22,'target':19,'value':3},
                {'source':22,'target':20,'value':4},
                {'source':22,'target':21,'value':4},
                {'source':23,'target':16,'value':3},
                {'source':23,'target':17,'value':3},
                {'source':23,'target':18,'value':3},
                {'source':23,'target':19,'value':3},
                {'source':23,'target':20,'value':4},
                {'source':23,'target':21,'value':4},
                {'source':23,'target':22,'value':4},
                {'source':23,'target':12,'value':2},
                {'source':23,'target':11,'value':9},
                {'source':24,'target':23,'value':2},
                {'source':24,'target':11,'value':7},
                {'source':25,'target':24,'value':13},
                {'source':25,'target':23,'value':1},
                {'source':25,'target':11,'value':12},
                {'source':26,'target':24,'value':4},
                {'source':26,'target':11,'value':31},
                {'source':26,'target':16,'value':1},
                {'source':26,'target':25,'value':1},
                {'source':27,'target':11,'value':17},
                {'source':27,'target':23,'value':5},
                {'source':27,'target':25,'value':5},
                {'source':27,'target':24,'value':1},
                {'source':27,'target':26,'value':1},
                {'source':28,'target':11,'value':8},
                {'source':28,'target':27,'value':1},
                {'source':29,'target':23,'value':1},
                {'source':29,'target':27,'value':1},
                {'source':29,'target':11,'value':2},
                {'source':30,'target':23,'value':1},
                {'source':31,'target':30,'value':2},
                {'source':31,'target':11,'value':3},
                {'source':31,'target':23,'value':2},
                {'source':31,'target':27,'value':1},
                {'source':32,'target':11,'value':1},
                {'source':33,'target':11,'value':2},
                {'source':33,'target':27,'value':1},
                {'source':34,'target':11,'value':3},
                {'source':34,'target':29,'value':2},
                {'source':35,'target':11,'value':3},
                {'source':35,'target':34,'value':3},
                {'source':35,'target':29,'value':2},
                {'source':36,'target':34,'value':2},
                {'source':36,'target':35,'value':2},
                {'source':36,'target':11,'value':2},
                {'source':36,'target':29,'value':1},
                {'source':37,'target':34,'value':2},
                {'source':37,'target':35,'value':2},
                {'source':37,'target':36,'value':2},
                {'source':37,'target':11,'value':2},
                {'source':37,'target':29,'value':1},
                {'source':38,'target':34,'value':2},
                {'source':38,'target':35,'value':2},
                {'source':38,'target':36,'value':2},
                {'source':38,'target':37,'value':2},
                {'source':38,'target':11,'value':2},
                {'source':38,'target':29,'value':1},
                {'source':39,'target':25,'value':1},
                {'source':40,'target':25,'value':1},
                {'source':41,'target':24,'value':2},
                {'source':41,'target':25,'value':3},
                {'source':42,'target':41,'value':2},
                {'source':42,'target':25,'value':2},
                {'source':42,'target':24,'value':1},
                {'source':43,'target':11,'value':3},
                {'source':43,'target':26,'value':1},
                {'source':43,'target':27,'value':1},
                {'source':44,'target':28,'value':3},
                {'source':44,'target':11,'value':1},
                {'source':45,'target':28,'value':2},
                {'source':47,'target':46,'value':1},
                {'source':48,'target':47,'value':2},
                {'source':48,'target':25,'value':1},
                {'source':48,'target':27,'value':1},
                {'source':48,'target':11,'value':1},
                {'source':49,'target':26,'value':3},
                {'source':49,'target':11,'value':2},
                {'source':50,'target':49,'value':1},
                {'source':50,'target':24,'value':1},
                {'source':51,'target':49,'value':9},
                {'source':51,'target':26,'value':2},
                {'source':51,'target':11,'value':2},
                {'source':52,'target':51,'value':1},
                {'source':52,'target':39,'value':1},
                {'source':53,'target':51,'value':1},
                {'source':54,'target':51,'value':2},
                {'source':54,'target':49,'value':1},
                {'source':54,'target':26,'value':1},
                {'source':55,'target':51,'value':6},
                {'source':55,'target':49,'value':12},
                {'source':55,'target':39,'value':1},
                {'source':55,'target':54,'value':1},
                {'source':55,'target':26,'value':21},
                {'source':55,'target':11,'value':19},
                {'source':55,'target':16,'value':1},
                {'source':55,'target':25,'value':2},
                {'source':55,'target':41,'value':5},
                {'source':55,'target':48,'value':4},
                {'source':56,'target':49,'value':1},
                {'source':56,'target':55,'value':1},
                {'source':57,'target':55,'value':1},
                {'source':57,'target':41,'value':1},
                {'source':57,'target':48,'value':1},
                {'source':58,'target':55,'value':7},
                {'source':58,'target':48,'value':7},
                {'source':58,'target':27,'value':6},
                {'source':58,'target':57,'value':1},
                {'source':58,'target':11,'value':4},
                {'source':59,'target':58,'value':15},
                {'source':59,'target':55,'value':5},
                {'source':59,'target':48,'value':6},
                {'source':59,'target':57,'value':2},
                {'source':60,'target':48,'value':1},
                {'source':60,'target':58,'value':4},
                {'source':60,'target':59,'value':2},
                {'source':61,'target':48,'value':2},
                {'source':61,'target':58,'value':6},
                {'source':61,'target':60,'value':2},
                {'source':61,'target':59,'value':5},
                {'source':61,'target':57,'value':1},
                {'source':61,'target':55,'value':1},
                {'source':62,'target':55,'value':9},
                {'source':62,'target':58,'value':17},
                {'source':62,'target':59,'value':13},
                {'source':62,'target':48,'value':7},
                {'source':62,'target':57,'value':2},
                {'source':62,'target':41,'value':1},
                {'source':62,'target':61,'value':6},
                {'source':62,'target':60,'value':3},
                {'source':63,'target':59,'value':5},
                {'source':63,'target':48,'value':5},
                {'source':63,'target':62,'value':6},
                {'source':63,'target':57,'value':2},
                {'source':63,'target':58,'value':4},
                {'source':63,'target':61,'value':3},
                {'source':63,'target':60,'value':2},
                {'source':63,'target':55,'value':1},
                {'source':64,'target':55,'value':5},
                {'source':64,'target':62,'value':12},
                {'source':64,'target':48,'value':5},
                {'source':64,'target':63,'value':4},
                {'source':64,'target':58,'value':10},
                {'source':64,'target':61,'value':6},
                {'source':64,'target':60,'value':2},
                {'source':64,'target':59,'value':9},
                {'source':64,'target':57,'value':1},
                {'source':64,'target':11,'value':1},
                {'source':65,'target':63,'value':5},
                {'source':65,'target':64,'value':7},
                {'source':65,'target':48,'value':3},
                {'source':65,'target':62,'value':5},
                {'source':65,'target':58,'value':5},
                {'source':65,'target':61,'value':5},
                {'source':65,'target':60,'value':2},
                {'source':65,'target':59,'value':5},
                {'source':65,'target':57,'value':1},
                {'source':65,'target':55,'value':2},
                {'source':66,'target':64,'value':3},
                {'source':66,'target':58,'value':3},
                {'source':66,'target':59,'value':1},
                {'source':66,'target':62,'value':2},
                {'source':66,'target':65,'value':2},
                {'source':66,'target':48,'value':1},
                {'source':66,'target':63,'value':1},
                {'source':66,'target':61,'value':1},
                {'source':66,'target':60,'value':1},
                {'source':67,'target':57,'value':3},
                {'source':68,'target':25,'value':5},
                {'source':68,'target':11,'value':1},
                {'source':68,'target':24,'value':1},
                {'source':68,'target':27,'value':1},
                {'source':68,'target':48,'value':1},
                {'source':68,'target':41,'value':1},
                {'source':69,'target':25,'value':6},
                {'source':69,'target':68,'value':6},
                {'source':69,'target':11,'value':1},
                {'source':69,'target':24,'value':1},
                {'source':69,'target':27,'value':2},
                {'source':69,'target':48,'value':1},
                {'source':69,'target':41,'value':1},
                {'source':70,'target':25,'value':4},
                {'source':70,'target':69,'value':4},
                {'source':70,'target':68,'value':4},
                {'source':70,'target':11,'value':1},
                {'source':70,'target':24,'value':1},
                {'source':70,'target':27,'value':1},
                {'source':70,'target':41,'value':1},
                {'source':70,'target':58,'value':1},
                {'source':71,'target':27,'value':1},
                {'source':71,'target':69,'value':2},
                {'source':71,'target':68,'value':2},
                {'source':71,'target':70,'value':2},
                {'source':71,'target':11,'value':1},
                {'source':71,'target':48,'value':1},
                {'source':71,'target':41,'value':1},
                {'source':71,'target':25,'value':1},
                {'source':72,'target':26,'value':2},
                {'source':72,'target':27,'value':1},
                {'source':72,'target':11,'value':1},
                {'source':73,'target':48,'value':2},
                {'source':74,'target':48,'value':2},
                {'source':74,'target':73,'value':3},
                {'source':75,'target':69,'value':3},
                {'source':75,'target':68,'value':3},
                {'source':75,'target':25,'value':3},
                {'source':75,'target':48,'value':1},
                {'source':75,'target':41,'value':1},
                {'source':75,'target':70,'value':1},
                {'source':75,'target':71,'value':1},
                {'source':76,'target':64,'value':1},
                {'source':76,'target':65,'value':1},
                {'source':76,'target':66,'value':1},
                {'source':76,'target':63,'value':1},
                {'source':76,'target':62,'value':1},
                {'source':76,'target':48,'value':1},
                {'source':76,'target':58,'value':1}
            ]
        };

        $scope.selectNode = function(project){
            console.log(project);
        };

        $scope.selectLink = function(dependency){
            console.log(dependency);
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

        $scope.projectDependencyDetails = 'header';

		// ------------- CREATE NEW DEPENDENCY -----------

		$scope.newDependency = {};

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
			newDependency.$save(function(res) {
				// Add new dependency to view after saving to server
				$scope.dependencies.push(res);
				// Clear form fields
				$scope.newDependency = {};
                // Open the new dependency in the view panel
                $scope.selectDependency(res);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelNewDependency = function(){
			$scope.newDependency = {};
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

            Dependencies.updateHeader(
                {
                    dependencyId : dependency._id
                }, copyDependency,
                function(res){
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
                function(err){$scope.error = err.data.message;}
            );
        };

        $scope.cancelEditHeader = function(dependency){
            dependency.name = originalDependency[dependency._id].name;
            dependency.description = originalDependency[dependency._id].description;
            dependency.source = originalDependency[dependency._id].source;
            dependency.target = originalDependency[dependency._id].target;
            dependency.state = originalDependency[dependency._id].state;
            dependency.type = originalDependency[dependency._id].type;
            dependency.impact = originalDependency[dependency._id].impact;
            $scope.selectHeaderForm('view', dependency);
        };


        $scope.deleteDependency = function(dependency){
            // Cleanup deepPopulate
            var copyDependency = _.cloneDeep(dependency);
            copyDependency.source = copyDependency.source._id;
            copyDependency.target = copyDependency.target._id;

            Dependencies.remove({dependencyId: dependency._id}, copyDependency, function(res){
                $scope.dependencies = _.without($scope.dependencies, dependency);
                $scope.cancelNewDependency();
                $scope.selectedDependency = null;
                originalDependency = {};
            }, function(err){
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

            Dependencies.updateStatus( { dependencyId : dependency._id }, copyDependency,
                function(res){
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
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function(dependency){
            dependency.statusReview.currentRecord.baselineDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.baselineDeliveryDate;
            dependency.statusReview.currentRecord.estimateDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.estimateDeliveryDate;
            dependency.statusReview.currentRecord.actualDeliveryDate = originalDependency[dependency._id].statusReview.currentRecord.actualDeliveryDate;
            dependency.statusReview.currentRecord.status = originalDependency[dependency._id].statusReview.currentRecord.status;
            dependency.statusReview.currentRecord.completed = originalDependency[dependency._id].statusReview.currentRecord.completed;
            dependency.statusReview.currentRecord.statusComment = originalDependency[dependency._id].statusReview.currentRecord.statusComment;
            $scope.selectStatusForm('view', dependency);
        };


	}
]);

'use strict';

angular.module('strategy-alignment').controller('StrategyAlignmentController', ['$scope','$stateParams', '$location', 'Authentication',
	'StrategyNodes','Projects','Subusers', 'GateProcesses', 'Portfolios', '_','$q',
	function($scope, $stateParams, $location, Authentication, StrategyNodes, Projects, Subusers, GateProcesses, Portfolios, _ , $q) {

		// ----------- INIT ---------------

		$scope.initError = [];

		$scope.init = function(){

			Subusers.query(function(users){
				$scope.users = users;
				$scope.projectManagers = _.filter(users, function(user){
					return _.find(_.get(user,'roles'), function(role){
						return role === 'projectManager';
					});
				});
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			StrategyNodes.query(function(strategyNodes){
				$scope.strategyNodes = strategyNodes;
				$scope.strategyTrees = createNodeTrees(strategyNodes);
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Projects.query(function(projects){
				$scope.projects = projects;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			GateProcesses.query(function(processes){
				$scope.gateProcesses = processes;
			}, function(err){
				$scope.initError.push(err.data.message);
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
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


		// ------------- REFRESH NODES LIST ------------

		//var strategyNodeList = function(){
		//	$scope.initError = [];
		//	StrategyNodes.query(function(strategyNodes){
		//       Projects.query(function(projects){
		//           $scope.strategyNodes = strategyNodes;
		//           $scope.strategyTrees = createNodeTrees(strategyNodes);
		//           $scope.projects = projects;
		//           $scope.selectProjectForm('list');
		//       });
		//
		//	}, function(err){
		//		$scope.initError.push(err.data.message);
		//	});
		//};


		// ------------------- NG-SWITCH ---------------------

		$scope.switchProjectForm = {};

		$scope.selectProjectForm = function(string){
			if(string === 'list'){ $scope.switchProjectForm = 'list';}
			if(string === 'new'){$scope.switchProjectForm = 'new';}
			if(string === 'view'){ $scope.switchProjectForm = 'view';}
			if(string === 'edit'){$scope.switchProjectForm = 'edit';}
		};

		var allowNull = function(obj){
			if(obj){return obj._id;} else {return null;}
		};


		// ------------- PROJECTS FOR NODE ------------

		$scope.selectStrategyNode = function(node){
			// Gather projects for the strategy node for the list
			$scope.selectedStrategyNode = node;
			$scope.strategyNodeProjects = _.filter($scope.projects, _.matchesProperty('identification.parent', node._id));
			$scope.selectProjectForm('list');
		};



		// ------------- CREATE NEW PROJECT -----------

		$scope.selectNewProject = function(){
			$scope.selectProjectForm('new');
		};

		$scope.newProject = {};

		$scope.createProject = function(){
			var newProject = new Projects({
				process: allowNull($scope.newProject.process),
				identification: {
					idNumber : $scope.newProject.idNumber,
					name : $scope.newProject.name,
					description : $scope.newProject.description,
					reqStartDate: $scope.newProject.reqStartDate,
					reqEndDate : $scope.newProject.reqEndDate,
					earmarkedFunds : $scope.newProject.earmarkedFunds,
					projectManager: allowNull($scope.newProject.projectManager),
					backupProjectManager: allowNull($scope.newProject.backupProjectManager),
					parent: allowNull($scope.selectedStrategyNode),
					portfolio: allowNull($scope.newProject.portfolio)
				},
				selection: {
					current: {
						active : true
					},
					history:[]
				}
			});
			newProject.$save(function(response) {
				// Add new project to view after saving to server
				$scope.projects.push(newProject);
				$scope.strategyNodeProjects.push(newProject);
				// Clear form fields
				$scope.newProject = null;
				// Show new project in view
				$scope.selectProject(newProject);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelNewProject = function(){
			$scope.newProject = null;
			$scope.selectProjectForm('list');
		};


		// ------------- SELECT VIEW PROJECT ------------

		var originalProject = {};

		$scope.selectProject = function(project){
			Projects.query({_id: project._id}, function(projectRes){
				var obj = projectRes[0]; // Query returns an array
				originalProject = _.cloneDeep(obj);
				$scope.selectedProject = obj;
				$scope.selectProjectForm('view');

			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelViewProject = function(){
			$scope.selectProjectForm('list');
		};


		// ------------- EDIT PROJECT ------------

		$scope.editProject = function(){
			// Clean up the deep populate
			var projectCopy = {};
			projectCopy = _.clone($scope.selectedProject);
			projectCopy.process = allowNull($scope.selectedProject.process);
			projectCopy.identification.projectManager = allowNull($scope.selectedProject.identification.projectManager);
			projectCopy.identification.backupProjectManager = allowNull($scope.selectedProject.identification.backupProjectManager);
			projectCopy.identification.parent = allowNull($scope.selectedStrategyNode);
			projectCopy.identification.portfolio = allowNull($scope.selectedProject.identification.portfolio);

			// Save the project to the server
			Projects.update(projectCopy, function(response) {
				// Update the view list array
				$scope.strategyNodeProjects = _.map($scope.strategyNodeProjects, function(project){
					if(project._id === projectCopy._id){return projectCopy;}
					return project;
				});
				// Show the edited project in view mode
				$scope.selectProject(projectCopy);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditProject = function(){
			$scope.selectedProject = originalProject;
			$scope.selectProjectForm('view');
		};



		// ------------- DELETE PROJECT ------------

		$scope.deleteProject = function(){
			Projects.remove({},{_id: $scope.selectedProject._id}, function(projectRes){
				// Remove project from the "projects" collection
				$scope.projects = _.without($scope.projects, $scope.selectedProject);
				$scope.strategyNodeProjects = _.without($scope.strategyNodeProjects, $scope.selectedProject);
				$scope.selectedProject = null;
				$scope.selectProjectForm('list');
			}, function(err){
				$scope.error = err.data.message;
			});
		};








	}
]);

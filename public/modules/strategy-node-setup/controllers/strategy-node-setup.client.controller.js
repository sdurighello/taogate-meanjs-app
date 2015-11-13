'use strict';

angular.module('strategy-node-setup').controller('StrategyNodeSetupController', ['$scope', '$stateParams', '$location', 'Authentication',
	'StrategyNodes','StrategyNodeTypes','Subusers','_','$q',
	function($scope, $stateParams, $location, Authentication, StrategyNodes, StrategyNodeTypes, Subusers, _ , $q) {

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

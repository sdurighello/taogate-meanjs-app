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
				retPropertiesString : 'user created name parent ancestors type portfolioManager backupPortfolioManager funds',
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
			masterPortfolio.funds = _.get($scope.editPortfolio,'funds');
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
			$scope.newPortfolio.funds = null;

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
				funds: _.get($scope.newPortfolio,'funds')
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
				$scope.newPortfolio.funds = null;

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

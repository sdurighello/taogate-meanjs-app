'use strict';

// Portfolio reviews controller
angular.module('portfolio-reviews').controller('PortfolioReviewsController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'PortfolioReviewTemplates', 'ProjectReviewScores', 'PortfolioReviewTypes','PortfolioReviews',
	'PeoplePortfolioGroups', 'PeoplePortfolioRoles',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 PortfolioReviewTemplates, ProjectReviewScores, PortfolioReviewTypes, PortfolioReviews,
			 PeoplePortfolioGroups, PeoplePortfolioRoles) {

		// ------------- INIT -------------

		$scope.initError = [];
		$scope.error = {};

		$scope.init = function(){

			Projects.query({'selection.selectedForEvaluation': true}, function(res){
				$scope.projects = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
				$scope.portfolioTrees = createNodeTrees(portfolios);
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

			PeoplePortfolioRoles.query(function(res){
				$scope.peoplePortfolioRoles = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
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
			$scope.error.portfolioReviews = null;
			$scope.selectedPortfolio = null;
			$scope.portfolioReviews = null;

			$scope.selectedPortfolioReview = null;
			originalPortfolioReview = {};

			$scope.selectedPortfolio = portfolio;

			PortfolioReviews.query({
				portfolio: portfolio._id
			}, function (res) {
				$scope.portfolioReviews = res;
			}, function (err) {
				$scope.error.portfolioReviews = err.data.message;
			});
		};

		$scope.cancelViewPortfolio = function(){
			$scope.error.portfolioReviews = null;
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
			$scope.error.newReview = null;
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
				$scope.error.newReview = err.data.message;
			});
		};

		$scope.cancelNewPortfolioReview = function(){
			$scope.error.newReview = null;
			$scope.newPortfolioReview = {};
		};


		// ------------- SELECT PROJECT REVIEW ------------


		$scope.selectPortfolioReview = function(portfolioReview){
			$scope.error.editReview = null;
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
					$scope.error.editReview = err.data.message;
				}
			);
		};

		$scope.cancelEditHeader = function(portfolioReview){
			$scope.error.editReview = null;
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
			$scope.error.editPeopleReview = null;
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
					$scope.error.editPeopleReview = err.data.message;
				}
			);
		};

		$scope.cancelEditPeopleReview = function(peopleReview){
			peopleReview.score = originalPeopleReview[peopleReview._id].score;
			peopleReview.comment = originalPeopleReview[peopleReview._id].comment;
			$scope.error.editPeopleReview = null;
			$scope.selectPeopleReviewForm('view', peopleReview);
		};

		$scope.submitPeopleReview = function(portfolioReview, reviewGroup, reviewItem, peopleReview){
			$scope.error.editPeopleReview = null;
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
					$scope.error.editPeopleReview = err.data.message;
				}
			);
		};




		// -------------------------------------------------------- APPROVAL -------------------------------------------------


		$scope.submit = function(portfolioReview){
			$scope.error.approval = null;
			PortfolioReviews.submit(
				{
					portfolioReviewId : portfolioReview._id
				}, portfolioReview,
				function(res){
					portfolioReview.approval = res.approval;
				},
				function(err){$scope.error.approval = err.data.message;}
			);
		};

		$scope.complete = function(portfolioReview){
			$scope.error.approval = null;
			PortfolioReviews.complete(
				{
					portfolioReviewId : portfolioReview._id
				}, portfolioReview,
				function(res){
					portfolioReview.approval = res.approval;
				},
				function(err){$scope.error.approval = err.data.message;}
			);
		};

		$scope.draft = function(portfolioReview){
			$scope.error.approval = null;
			PortfolioReviews.draft(
				{
					portfolioReviewId : portfolioReview._id
				}, portfolioReview,
				function(res){
					portfolioReview.approval = res.approval;
				},
				function(err){$scope.error.approval = err.data.message;}
			);
		};


	}
]);

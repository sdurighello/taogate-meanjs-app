'use strict';

angular.module('project-reviews').controller('ProjectReviewsController', ['$scope','$stateParams', '$location',
	'Authentication', 'Projects', 'Portfolios','$q', '_',
	'ProjectReviewTemplates', 'ProjectReviewScores', 'ProjectReviewTypes','ProjectReviews',
    'PeopleProjectGroups', 'PeopleProjectRoles',
	function($scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
			 ProjectReviewTemplates, ProjectReviewScores, ProjectReviewTypes, ProjectReviews,
             PeopleProjectGroups, PeopleProjectRoles) {

		// ------------- INIT -------------

		$scope.initError = [];
        $scope.error = {};

		$scope.init = function(){

			Projects.query({'selection.active': true, 'selection.selectedForEvaluation': true}, function(res){
				$scope.projects = res;
			}, function(err){
				$scope.initError.push({message: err.data.message});
			});

			Portfolios.query(function(portfolios){
				$scope.portfolios = portfolios;
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

            PeopleProjectRoles.query(function(res){
                $scope.peopleProjectRoles = res;
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
            $scope.error.projectReviews = null;
			$scope.selectedProject = null;
			$scope.projectReviews = null;

			$scope.selectedProjectReview = null;
			originalProjectReview = {};

			$scope.selectedProject = project;

			ProjectReviews.query({
				project: project._id
			}, function (res) {
				$scope.projectReviews = res;
			}, function (err) {
				$scope.error.projectReviews = err.data.message;
			});
		};

		$scope.cancelViewProject = function(){
			$scope.error.projectReviews = null;
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
            $scope.error.newReview = null;
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
				$scope.error.newReview = err.data.message;
			});
		};

		$scope.cancelNewProjectReview = function(){
            $scope.error.newReview = null;
			$scope.newProjectReview = {};
		};


		// ------------- SELECT PROJECT REVIEW ------------


		$scope.selectProjectReview = function(projectReview){
            $scope.error.editReview = null;
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
                    $scope.error.editReview = err.data.message;
                }
			);
		};

		$scope.cancelEditHeader = function(projectReview){
            $scope.error.editReview = null;
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
            $scope.error.editPeopleReview = null;
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

        $scope.submitPeopleReview = function(projectReview, reviewGroup, reviewItem, peopleReview){
            $scope.error.editPeopleReview = null;
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
                    $scope.error.editPeopleReview = err.data.message;
                }
            );
        };




        // -------------------------------------------------------- APPROVAL -------------------------------------------------


		$scope.submit = function(projectReview){
            $scope.error.approval = null;
			ProjectReviews.submit(
				{
					projectReviewId : projectReview._id
				}, projectReview,
				function(res){
                    projectReview.approval = res.approval;
				},
				function(err){$scope.error.approval = err.data.message;}
			);
		};

		$scope.complete = function(projectReview){
            $scope.error.approval = null;
            ProjectReviews.complete(
                {
                    projectReviewId : projectReview._id
                }, projectReview,
                function(res){
                    projectReview.approval = res.approval;
                },
                function(err){$scope.error.approval = err.data.message;}
            );
		};

		$scope.draft = function(projectReview){
            $scope.error.approval = null;
            ProjectReviews.draft(
                {
                    projectReviewId : projectReview._id
                }, projectReview,
                function(res){
                    projectReview.approval = res.approval;
                },
                function(err){$scope.error.approval = err.data.message;}
            );
		};


	}
]);

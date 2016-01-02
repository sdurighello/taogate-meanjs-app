'use strict';

// Project issues controller
angular.module('project-issues').controller('ProjectIssuesController', ['$scope', '$stateParams', '$location', '$q', '_', 'Authentication',
    'Portfolios', 'Projects', 'ProjectIssues', 'GateProcesses', 'LogReasons', 'IssueStates', 'LogPriorities', 'LogStatusIndicators',
    function($scope, $stateParams, $location, $q, _, Authentication,
             Portfolios, Projects, ProjectIssues, GateProcesses, LogReasons, IssueStates, LogPriorities, LogStatusIndicators) {

        // ------------- INIT -------------

        $scope.initError = [];

        $scope.init = function () {

            Projects.query({'selection.selectedForDelivery': true}, function (projects) {
                $scope.projects = _.filter(projects, function (project) {
                    return project.process !== null;
                });
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            Portfolios.query(function (portfolios) {
                $scope.portfolios = portfolios;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            GateProcesses.query(function (gateProcesses) {
                $scope.gateProcesses = gateProcesses;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            LogReasons.query(function (logReasons) {
                $scope.logReasons = logReasons;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            IssueStates.query(function (issueStates) {
                $scope.issueStates = issueStates;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            LogPriorities.query(function (logPriorities) {
                $scope.logPriorities = logPriorities;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function (logStatusIndicators) {
                $scope.logStatuses = logStatusIndicators;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

        };

        // ------- ROLES FOR BUTTONS ------

        var d = $q.defer();
        d.resolve(Authentication);

        d.promise.then(function (data) {
            var obj = _.clone(data);
            $scope.userHasAuthorization = _.some(obj.user.roles, function (role) {
                return role === 'superAdmin' || role === 'admin' || role === 'pmo';
            });
        });

        // ------------------- NG-SWITCH ---------------------


        $scope.switchHeaderForm = {};
        $scope.selectHeaderForm = function (string, projectIssue) {
            if (string === 'view') {
                $scope.switchHeaderForm[projectIssue._id] = 'view';
            }
            if (string === 'edit') {
                $scope.switchHeaderForm[projectIssue._id] = 'edit';
            }
        };

        $scope.switchStatusForm = {};
        $scope.selectStatusForm = function (string, projectIssue) {
            if (string === 'view') {
                $scope.switchStatusForm[projectIssue._id] = 'view';
            }
            if (string === 'edit') {
                $scope.switchStatusForm[projectIssue._id] = 'edit';
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


        // ------------------- OTHER VARIABLES ---------------------

        $scope.projectIssueDetails = 'header';

        // ------------- SELECT VIEW PROJECT ------------

        var originalProjectIssue = {};

        $scope.selectProject = function (project) {
            $scope.error = {};
            $scope.selectedProject = null;
            $scope.projectIssues = null;

            $scope.selectedprojectIssue = null;
            originalProjectIssue = {};

            $scope.selectedProject = project;

            ProjectIssues.query({
                project: project._id
            }, function (projectIssues) {
                $scope.projectIssues = projectIssues;
            }, function (err) {
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

        $scope.createNewProjectIssue = function (project) {
            var newProjectIssue = new ProjectIssues({
                project: project._id,
                gate: $scope.newProjectIssue.gate,
                raisedOnDate: $scope.newProjectIssue.raisedOnDate,
                title: $scope.newProjectIssue.title
            });
            newProjectIssue.$save(function (res) {
                // Clear new form
                $scope.newProjectIssue = {};
                // Refresh the list of gate reviews
                $scope.projectIssues.push(res);
                // Select in view mode the new review
                $scope.selectProjectIssue(res);
                // Close new review form done directly in the view's html
            }, function (err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewProjectIssue = function () {
            $scope.newProjectIssue = {};
        };


        // ------------- SELECT ISSUE ------------

        var projectIssueFromList = {};
        // Required to update the list when changes details
        // in the details pane that are also reported in the list of gate reviews

        $scope.selectProjectIssue = function (projectIssue) {
            projectIssueFromList[projectIssue._id] = projectIssue;
            ProjectIssues.get({
                projectIssueId: projectIssue._id
            }, function (res) {
                $scope.selectedProjectIssue = res;
                originalProjectIssue[projectIssue._id] = _.cloneDeep(res);
                //$scope.selectProjectIssueForm('view');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.selectedProjectIssue = null;
                originalProjectIssue = {};
            });
        };


        // -------------------------------------------------------- HEADER -------------------------------------------------

        $scope.headerDateOpened = {};
        $scope.openHeaderDate = function (projectIssue, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.headerDateOpened[projectIssue._id] = true;
        };

        $scope.editHeader = function (projectIssue) {
            $scope.selectHeaderForm('edit', projectIssue);
        };

        $scope.saveEditHeader = function (projectIssue) {
            // Clean-up deepPopulate
            var copyProjectIssue = _.cloneDeep(projectIssue);
            copyProjectIssue.project = _.get(copyProjectIssue.project, '_id');
            // Update server header
            ProjectIssues.updateHeader(
                {
                    projectIssueId: copyProjectIssue._id
                }, copyProjectIssue,
                function (res) {
                    // Update details pane view with new saved details
                    originalProjectIssue[projectIssue._id].raisedOnDate = projectIssue.raisedOnDate;
                    originalProjectIssue[projectIssue._id].title = projectIssue.title;
                    originalProjectIssue[projectIssue._id].description = projectIssue.description;
                    originalProjectIssue[projectIssue._id].state = projectIssue.state;
                    originalProjectIssue[projectIssue._id].reason = projectIssue.reason;
                    originalProjectIssue[projectIssue._id].priority = projectIssue.priority;
                    // Update list of reviews with new date / title
                    projectIssueFromList[projectIssue._id].raisedOnDate = projectIssue.raisedOnDate;
                    projectIssueFromList[projectIssue._id].title = projectIssue.title;
                    // Close edit header form and back to view
                    $scope.selectHeaderForm('view', projectIssue);
                },
                function (err) {
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function (projectIssue) {
            projectIssue.raisedOnDate = originalProjectIssue[projectIssue._id].raisedOnDate;
            projectIssue.title = originalProjectIssue[projectIssue._id].title;
            projectIssue.description = originalProjectIssue[projectIssue._id].description;
            projectIssue.state = originalProjectIssue[projectIssue._id].state;
            projectIssue.reason = originalProjectIssue[projectIssue._id].reason;
            projectIssue.priority = originalProjectIssue[projectIssue._id].priority;
            $scope.selectHeaderForm('view', projectIssue);
        };


        $scope.deleteProjectIssue = function (projectIssue) {
            ProjectIssues.remove({projectIssueId: projectIssue._id}, projectIssue, function (res) {
                $scope.projectIssues = _.without($scope.projectIssues, _.find($scope.projectIssues, _.matchesProperty('_id', projectIssue._id)));
                $scope.cancelNewProjectIssue();
                $scope.selectedProjectIssue = null;
                originalProjectIssue = {};
            }, function (err) {
                $scope.error = err.data.message;
            });
        };


        // -------------------------------------------------------- STATUS -------------------------------------------------

        $scope.baselineDeliveryDateOpened = {};
        $scope.openBaselineDeliveryDate = function (projectIssue, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.baselineDeliveryDateOpened[projectIssue._id] = true;
        };

        $scope.estimateDeliveryDateOpened = {};
        $scope.openEstimateDeliveryDate = function (projectIssue, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.estimateDeliveryDateOpened[projectIssue._id] = true;
        };

        $scope.actualDeliveryDateOpened = {};
        $scope.openActualDeliveryDate = function (projectIssue, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.actualDeliveryDateOpened[projectIssue._id] = true;
        };

        $scope.editStatus = function (projectIssue) {
            $scope.selectStatusForm('edit', projectIssue);
        };

        $scope.saveEditStatus = function (projectIssue) {
            // Clean-up deepPopulate
            var copyProjectIssue = _.cloneDeep(projectIssue);
            copyProjectIssue.project = _.get(copyProjectIssue.project, '_id');
            // Update server header
            ProjectIssues.updateStatus({projectIssueId: copyProjectIssue._id}, copyProjectIssue,
                function (res) {
                    // Set the "final" in the gate from the list
                    projectIssueFromList[projectIssue._id].statusReview.currentRecord.completed = projectIssue.statusReview.currentRecord.completed;
                    // Change the selected CR
                    originalProjectIssue[projectIssue._id].statusReview.currentRecord.baselineDeliveryDate = projectIssue.statusReview.currentRecord.baselineDeliveryDate;
                    originalProjectIssue[projectIssue._id].statusReview.currentRecord.estimateDeliveryDate = projectIssue.statusReview.currentRecord.estimateDeliveryDate;
                    originalProjectIssue[projectIssue._id].statusReview.currentRecord.actualDeliveryDate = projectIssue.statusReview.currentRecord.actualDeliveryDate;
                    originalProjectIssue[projectIssue._id].statusReview.currentRecord.status = projectIssue.statusReview.currentRecord.status;
                    originalProjectIssue[projectIssue._id].statusReview.currentRecord.completed = projectIssue.statusReview.currentRecord.completed;
                    originalProjectIssue[projectIssue._id].statusReview.currentRecord.statusComment = projectIssue.statusReview.currentRecord.statusComment;
                    $scope.selectStatusForm('view', projectIssue);
                },
                function (err) {
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function (projectIssue) {
            projectIssue.statusReview.currentRecord.baselineDeliveryDate = originalProjectIssue[projectIssue._id].statusReview.currentRecord.baselineDeliveryDate;
            projectIssue.statusReview.currentRecord.estimateDeliveryDate = originalProjectIssue[projectIssue._id].statusReview.currentRecord.estimateDeliveryDate;
            projectIssue.statusReview.currentRecord.actualDeliveryDate = originalProjectIssue[projectIssue._id].statusReview.currentRecord.actualDeliveryDate;
            projectIssue.statusReview.currentRecord.status = originalProjectIssue[projectIssue._id].statusReview.currentRecord.status;
            projectIssue.statusReview.currentRecord.completed = originalProjectIssue[projectIssue._id].statusReview.currentRecord.completed;
            projectIssue.statusReview.currentRecord.statusComment = originalProjectIssue[projectIssue._id].statusReview.currentRecord.statusComment;
            $scope.selectStatusForm('view', projectIssue);
        };



    }

        //function($scope, $stateParams, $location, Authentication, ProjectIssues) {
	//	$scope.authentication = Authentication;
    //
	//	// Create new Project issue
	//	$scope.create = function() {
	//		// Create new Project issue object
	//		var projectIssue = new ProjectIssues ({
	//			name: this.name
	//		});
    //
	//		// Redirect after save
	//		projectIssue.$save(function(response) {
	//			$location.path('project-issues/' + response._id);
    //
	//			// Clear form fields
	//			$scope.name = '';
	//		}, function(errorResponse) {
	//			$scope.error = errorResponse.data.message;
	//		});
	//	};
    //
	//	// Remove existing Project issue
	//	$scope.remove = function(projectIssue) {
	//		if ( projectIssue ) {
	//			projectIssue.$remove();
    //
	//			for (var i in $scope.projectIssues) {
	//				if ($scope.projectIssues [i] === projectIssue) {
	//					$scope.projectIssues.splice(i, 1);
	//				}
	//			}
	//		} else {
	//			$scope.projectIssue.$remove(function() {
	//				$location.path('project-issues');
	//			});
	//		}
	//	};
    //
	//	// Update existing Project issue
	//	$scope.update = function() {
	//		var projectIssue = $scope.projectIssue;
    //
	//		projectIssue.$update(function() {
	//			$location.path('project-issues/' + projectIssue._id);
	//		}, function(errorResponse) {
	//			$scope.error = errorResponse.data.message;
	//		});
	//	};
    //
	//	// Find a list of Project issues
	//	$scope.find = function() {
	//		$scope.projectIssues = ProjectIssues.query();
	//	};
    //
	//	// Find existing Project issue
	//	$scope.findOne = function() {
	//		$scope.projectIssue = ProjectIssues.get({
	//			projectIssueId: $stateParams.projectIssueId
	//		});
	//	};
	//}
]);

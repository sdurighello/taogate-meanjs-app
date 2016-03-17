'use strict';

// Project issues controller
angular.module('project-issues').controller('ProjectIssuesController', ['$scope', '$stateParams', '$location', '$q', '$modal', '$log', '_', 'Authentication',
    'Portfolios', 'Projects', 'ProjectIssues', 'GateProcesses', 'LogReasons', 'IssueStates', 'LogPriorities', 'LogStatusIndicators',
    function($scope, $stateParams, $location, $q, $modal, $log, _, Authentication,
             Portfolios, Projects, ProjectIssues, GateProcesses, LogReasons, IssueStates, LogPriorities, LogStatusIndicators) {

        // ------------- INIT -------------

        $scope.isResolving = false;

        $scope.initError = [];
        var logReasons = [];
        var issueStates = [];
        var logPriorities = [];
        var logStatuses = [];

        $scope.init = function () {

            $scope.user = Authentication.user;

            // For main controller

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function (projects) {
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

            // For modal controller

            LogReasons.query(function (res) {
                logReasons = res;
                $scope.logReasons = res;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            IssueStates.query(function (res) {
                issueStates = res;
                $scope.issueStates = res;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            LogPriorities.query(function (res) {
                logPriorities = res;
                $scope.logPriorities = res;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function (res) {
                logStatuses = res;
                $scope.logStatuses = res;
            }, function (err) {
                $scope.initError.push(err.data.message);
            });

        };

        // ------- ROLES FOR BUTTONS ------

        $scope.userHasAuthorization = true;


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
            $scope.error = {};
            $scope.selectedProject = null;
            $scope.projectIssues = null;
            $scope.selectedProjectIssue = null;

            $scope.selectedProject = project;

            ProjectIssues.query({
                project: project._id
            }, function (res) {
                $scope.projectIssues = res;
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
                gate: allowNull($scope.newProjectIssue.gate),
                raisedOnDate: $scope.newProjectIssue.raisedOnDate,
                title: $scope.newProjectIssue.title
            });
            newProjectIssue.$save(function (res) {
                // Refresh the list of gate reviews after populating project and gate
                res.project = _.cloneDeep(project);
                res.gate = _.cloneDeep($scope.newProjectIssue.gate);
                $scope.projectIssues.push(res);
                // Clear new form
                $scope.newProjectIssue = {};
                // Select in view mode the new review
                $scope.selectProjectIssue(_.find($scope.projectIssues, _.matchesProperty('_id', res._id)), project);
                // Close new review form done directly in the view's html
            }, function (err) {
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewProjectIssue = function () {
            $scope.newProjectIssue = {};
        };



        // ------------- EDIT ISSUE ------------


        var modalUpdateIssue = function (size, issue, project, logReasons, issueStates, logPriorities, logStatuses) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/project-issues/views/edit-project-issue.client.view.html',
                controller: function ($scope, $modalInstance, issue, project, logReasons, issueStates, logPriorities, logStatuses) {

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

        $scope.selectProjectIssue = function(issue, project){
            modalUpdateIssue('lg', issue, project, logReasons, issueStates, logPriorities, logStatuses);
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
            copyProjectIssue.gate = allowNull(copyProjectIssue.gate);
            copyProjectIssue.reason = allowNull(copyProjectIssue.reason);
            copyProjectIssue.priority = allowNull(copyProjectIssue.priority);
            copyProjectIssue.state = allowNull(copyProjectIssue.state);
            copyProjectIssue.statusReview.currentRecord.status = allowNull(copyProjectIssue.statusReview.currentRecord.status);
            // Update server header
            ProjectIssues.updateHeader(
                {
                    projectIssueId: copyProjectIssue._id
                }, copyProjectIssue,
                function (res) {
                    // Update details pane view with new saved details
                    originalProjectIssue.gate = projectIssue.gate;
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
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function (projectIssue, originalProjectIssue) {
            projectIssue.gate = originalProjectIssue.gate;
            projectIssue.raisedOnDate = originalProjectIssue.raisedOnDate;
            projectIssue.title = originalProjectIssue.title;
            projectIssue.description = originalProjectIssue.description;
            projectIssue.state = originalProjectIssue.state;
            projectIssue.reason = originalProjectIssue.reason;
            projectIssue.priority = originalProjectIssue.priority;
            $scope.selectHeaderForm('view');
        };


        $scope.deleteProjectIssue = function (projectIssue) {
            ProjectIssues.remove({projectIssueId: projectIssue._id}, projectIssue, function (res) {
                $scope.projectIssues = _.without($scope.projectIssues, projectIssue);
            }, function (err) {
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
            copyProjectIssue.gate = allowNull(copyProjectIssue.gate);
            copyProjectIssue.reason = allowNull(copyProjectIssue.reason);
            copyProjectIssue.priority = allowNull(copyProjectIssue.priority);
            copyProjectIssue.state = allowNull(copyProjectIssue.state);
            copyProjectIssue.statusReview.currentRecord.status = allowNull(copyProjectIssue.statusReview.currentRecord.status);
            // Update server header
            ProjectIssues.updateStatus({projectIssueId: copyProjectIssue._id}, copyProjectIssue,
                function (res) {
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
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditStatus = function (projectIssue, originalProjectIssue) {
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

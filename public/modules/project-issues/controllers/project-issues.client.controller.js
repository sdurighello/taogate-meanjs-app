'use strict';

// Project issues controller
angular.module('project-issues').controller('ProjectIssuesController', ['$rootScope', '$scope', '$stateParams', '$location', '$q', '$modal', '$log', '_', 'Authentication',
    'Portfolios', 'Projects', 'ProjectIssues', 'GateProcesses', 'LogReasons', 'IssueStates', 'LogPriorities', 'LogStatusIndicators',
    function($rootScope, $scope, $stateParams, $location, $q, $modal, $log, _, Authentication,
             Portfolios, Projects, ProjectIssues, GateProcesses, LogReasons, IssueStates, LogPriorities, LogStatusIndicators) {

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

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function (projects) {
                $scope.projects = _.filter(projects, function (project) {
                    return project.process !== null;
                });
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            Portfolios.query(function (portfolios) {
                $scope.portfolios = portfolios;
            }, function (err) {
                $scope.initErrors.push(err.data.message);
            });

            GateProcesses.query(function (gateProcesses) {
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
                gate: allowNull($scope.newProjectIssue.gate),
                raisedOnDate: $scope.newProjectIssue.raisedOnDate,
                title: $scope.newProjectIssue.title
            });
            $scope.error = null;
            $scope.isResolving = true;
            newProjectIssue.$save(function (res) {
                $scope.isResolving = false;
                // Refresh the list of gate reviews after populating project and gate
                res.project = _.cloneDeep(project);
                res.gate = _.cloneDeep($scope.newProjectIssue.gate);
                $scope.projectIssues.push(res);
                // Clear new form
                $scope.newProjectIssue = {};
                // Select in view mode the new review
                $scope.selectProjectIssue(user, _.find($scope.projectIssues, _.matchesProperty('_id', res._id)), project);
                // Close new review form done directly in the view's html
            }, function (err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        $scope.cancelNewProjectIssue = function () {
            $scope.error = null;
            $scope.newProjectIssue = {};
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
            copyProjectIssue.gate = allowNull(copyProjectIssue.gate);
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
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.cancelEditHeader = function (projectIssue, originalProjectIssue) {
            $scope.error = null;
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
            copyProjectIssue.gate = allowNull(copyProjectIssue.gate);
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

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

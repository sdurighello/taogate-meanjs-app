'use strict';

angular.module('portfolio-status-reports').controller('PortfolioStatusReportsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_', 'GateProcessTemplates', 'LogStatusIndicators', 'PortfolioStatusReports', '$modal',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, LogStatusIndicators, PortfolioStatusReports, $modal) {

        $rootScope.staticMenu = false;

        var vm = this;

        // ------------- INIT -------------

        vm.isResolving = false;

        vm.initError = [];

        vm.init = function(){

            vm.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true, 'process.assignmentConfirmed': true}, function(projects){
                vm.projects = projects;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
                vm.portfolioTrees = createNodeTrees(portfolios);
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcessTemplates.query(function(gateProcesses){
                vm.gateProcesses = gateProcesses;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            LogStatusIndicators.query(function(logStatusIndicators){
                vm.logStatusIndicators = logStatusIndicators;
            }, function(err){
                vm.initError.push(err.data.message);
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

        vm.userHasAuthorization = function(action, user, portfolio){

            return true;

        };

        // ------------------- NG-SWITCH ---------------------

        // Header

        vm.switchHeaderForm = {};
        vm.selectHeaderForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderForm[document._id] = 'edit';}
        };

        // Budget

        vm.switchBudgetForm = {};
        vm.selectBudgetForm = function(string, document){
            if(string === 'view'){ vm.switchBudgetForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchBudgetForm[document._id] = 'edit';}
        };

        // Delivery Status

        vm.switchOverallStatusForm = {};
        vm.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ vm.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchOverallStatusForm[document._id] = 'edit';}
        };

        // Status Areas

        vm.switchStatusAreaForm = {};
        vm.selectStatusAreaForm = function(string, statusAreaReview){
            if(string === 'view'){ vm.switchStatusAreaForm[statusAreaReview._id] = 'view';}
            if(string === 'edit'){vm.switchStatusAreaForm[statusAreaReview._id] = 'edit';}
        };


        // ------------------- UTILITIES ---------------------

        vm.sortChangeRequests = function(doc) {
            return new Date(doc.updateDate);
        };

        vm.sortAppliedChanges = function(record) {
            return new Date(record.created);
        };

        vm.getDaysChange = function(stringDate1, stringDate2){
            var millisecondsPerDay = 1000 * 60 * 60 * 24;
            return - (new Date(stringDate1) - new Date(stringDate2)) / millisecondsPerDay;
        };


        // -------------- OTHER VARIABLES -----------------

        vm.showNewDocumentForm = false;

        vm.documentDetails = 'header';

        vm.activeTab = {};


        // ------------- SELECT PORTFOLIO ------------


        vm.selectPortfolio = function(portfolio) {
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.query({'portfolio._id' : portfolio._id},
                function(res){
                    vm.isResolving = false;
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                    vm.selectedPortfolio = portfolio;
                    vm.portfolioStatusReports = res;
                }, 
                function(err){
                    vm.isResolving = false;
                    vm.error = err;
                }
            );
        };


        // ----------- NEW STATUS UPDATE ------------


        vm.newHeaderDateOpened = {};

        vm.openNewHeaderDate = function(portfolio, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.newHeaderDateOpened[portfolio._id] = true;
        };

        vm.newDocument = {};

        vm.createNewDocument = function(portfolio){

            var newDocument = new PortfolioStatusReports({
                portfolio : {
                    _id : portfolio._id,
                    name : portfolio.name
                },
                date : vm.newDocument.updateDate,
                title : vm.newDocument.title,
                previousReport : {
                    _id : vm.newDocument.previousReport && vm.newDocument.previousReport._id,
                    title : vm.newDocument.previousReport && vm.newDocument.previousReport.title,
                    date : vm.newDocument.previousReport && vm.newDocument.previousReport.date
                }
            });

            vm.error = null;
            vm.isResolving = true;
            newDocument.$save(
                function(res){
                    vm.isResolving = false;
                    vm.portfolioStatusReports.push(res);
                    vm.newDocument = {};
                    vm.showNewDocumentForm = false;
                    vm.selectDocument(res);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelNewDocument = function(){
            vm.error = null;
            vm.showNewDocumentForm = false;
            vm.newDocument = {};
        };


        // ------------- VIEW STATUS REPORT ------------
        
        
        vm.goToDocument = function(document){
            $location.path('portfolio-status-reports/' + document._id);
        };

        vm.initDocumentDetails = function(){
            vm.selectedDocument = PortfolioStatusReports.get({
                portfolioStatusReportId: $stateParams.portfolioStatusReportId
            });

            vm.selectedDocumentExample = _.chunk([
                {name: 'ciao'}, {name: 'ciao'}, {name: 'ciao'}
            ], 2);
        };



        // -------------------------------------------------------- HEADER -------------------------------------------------

        vm.headerDateOpened = {};
        vm.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.headerDateOpened[document._id] = true;
        };

        var originalHeader = {};

        vm.editHeader = function(statusUpdate){
            originalHeader[statusUpdate._id] = {
                updateDate: statusUpdate.updateDate,
                title : statusUpdate.title,
                description : statusUpdate.description
            };
            vm.selectHeaderForm('edit', statusUpdate);
        };

        vm.saveEditHeader = function(portfolio, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Portfolios.updateStatusUpdateHeader(
                {
                    portfolioId : portfolio._id,
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditHeader = function(statusUpdate){
            vm.error = null;
            statusUpdate.updateDate = originalHeader[statusUpdate._id].updateDate;
            statusUpdate.title = originalHeader[statusUpdate._id].title;
            statusUpdate.description = originalHeader[statusUpdate._id].description;
            vm.selectHeaderForm('view', statusUpdate);
        };


        vm.deleteDocument = function(portfolio, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Portfolios.deleteStatusUpdate(
                {
                    portfolioId : portfolio._id,
                    portfolioStatusUpdateId: statusUpdate._id
                }, statusUpdate, function(res){
                    vm.isResolving = false;
                    portfolio.portfolioStatusReports = _.without(portfolio.portfolioStatusReports, statusUpdate);
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                });
        };

        // -------------------------------------------------------- BUDGET -------------------------------------------------

        var originalBudget = {};

        vm.editBudget = function(statusUpdate){
            originalBudget[statusUpdate._id] = {
                newAmount : statusUpdate.budgetReview.newAmount
            };
            vm.selectBudgetForm('edit', statusUpdate);
        };

        vm.saveEditBudget = function(portfolio, statusUpdate){
            vm.error = null;
            vm.isResolving = true;
            Portfolios.updateStatusUpdateBudget(
                {
                    portfolioId : portfolio._id,
                    portfolioStatusUpdateId: statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    originalBudget[statusUpdate._id].newAmount = statusUpdate.budgetReview.newAmount;
                    vm.selectBudgetForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditBudget = function(statusUpdate){
            vm.error = null;
            statusUpdate.budgetReview.newAmount = originalBudget[statusUpdate._id].newAmount;
            vm.selectBudgetForm('view', statusUpdate);
        };


        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status

        var originalOverallStatus = {};

        vm.editOverallStatus = function(statusUpdate){
            originalOverallStatus[statusUpdate._id] = {
                newStatus: statusUpdate.portfolioStatus.overallStatusReview.newStatus,
                newComment : statusUpdate.portfolioStatus.overallStatusReview.newComment
            };
            vm.selectOverallStatusForm('edit', statusUpdate);
        };

        vm.saveEditOverallStatus = function(portfolio, statusUpdate){

            vm.error = null;
            vm.isResolving = true;
            Portfolios.updateOverallDeliveryStatus(
                {
                    portfolioId : portfolio._id,
                    portfolioStatusUpdateId : statusUpdate._id
                }, statusUpdate,
                function(res){
                    vm.isResolving = false;
                    vm.selectOverallStatusForm('view', statusUpdate);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOverallStatus = function(statusUpdate){
            vm.error = null;
            statusUpdate.portfolioStatus.overallStatusReview.newStatus = originalOverallStatus[statusUpdate._id].newStatus;
            statusUpdate.portfolioStatus.overallStatusReview.newComment = originalOverallStatus[statusUpdate._id].newComment;
            vm.selectOverallStatusForm('view', statusUpdate);
        };

        // Project status area reviews

        var originalStatusAreaReview = {};

        vm.editStatusArea = function(statusAreaReview){
            originalStatusAreaReview[statusAreaReview._id] = _.cloneDeep(statusAreaReview);
            vm.selectStatusAreaForm('edit', statusAreaReview);
        };

        vm.saveEditStatusArea = function(portfolio, statusUpdate, statusAreaReview){
            vm.error = null;
            vm.isResolving = true;
            Portfolios.updateStatusAreaReview(
                {
                    portfolioId : portfolio._id,
                    portfolioStatusUpdateId : statusUpdate._id,
                    statusAreaReviewId : statusAreaReview._id
                }, statusAreaReview,
                function(res){
                    vm.isResolving = false;
                    vm.selectStatusAreaForm('view', statusAreaReview);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditStatusArea = function(statusAreaReview){
            vm.error = null;
            statusAreaReview.newStatus = originalStatusAreaReview[statusAreaReview._id].newStatus;
            statusAreaReview.newComment = originalStatusAreaReview[statusAreaReview._id].newComment;
            vm.selectStatusAreaForm('view', statusAreaReview);
        };


    }
]);

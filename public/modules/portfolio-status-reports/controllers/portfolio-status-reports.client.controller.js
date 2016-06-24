'use strict';

angular.module('portfolio-status-reports').controller('PortfolioStatusReportsController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects', 'Portfolios','$q', '_', 'GateProcessTemplates', 'LogStatusIndicators', 'PortfolioStatusReports', '$modal', 'StatusReportTypes',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, $q, _,
             GateProcessTemplates, LogStatusIndicators, PortfolioStatusReports, $modal, StatusReportTypes) {

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
                // If there is a stateParam _id , then select a portfolio
                if($stateParams.portfolioId){
                    var requestedPortfolio = _.find(vm.portfolios, _.matchesProperty('_id', $stateParams.portfolioId));
                    if(requestedPortfolio){
                        vm.selectPortfolio(requestedPortfolio);
                    } else {
                        vm.error = 'Cannot find Portfolio with id: ' + $stateParams.portfolioId;
                    }
                }
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

            StatusReportTypes.query(function(res){
                vm.statusReportTypes = res;
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

        // Title

        vm.switchHeaderTitleForm = {};
        vm.selectHeaderTitleForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderTitleForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderTitleForm[document._id] = 'edit';}
        };

        // Type

        vm.switchHeaderTypeForm = {};
        vm.selectHeaderTypeForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderTypeForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderTypeForm[document._id] = 'edit';}
        };

        // Date

        vm.switchHeaderDateForm = {};
        vm.selectHeaderDateForm = function(string, document){
            if(string === 'view'){ vm.switchHeaderDateForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchHeaderDateForm[document._id] = 'edit';}
        };
        
        // Delivery Status

        vm.switchOverallStatusForm = {};
        vm.selectOverallStatusForm = function(string, document){
            if(string === 'view'){ vm.switchOverallStatusForm[document._id] = 'view';}
            if(string === 'edit'){vm.switchOverallStatusForm[document._id] = 'edit';}
        };

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

        vm.openNewHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.newHeaderDateOpened[document._id] = true;
        };

        vm.newDocument = {};

        vm.createNewDocument = function(portfolio){

            var newDocument = new PortfolioStatusReports({
                portfolio : {
                    _id : portfolio._id,
                    name : portfolio.name
                },
                type : {
                    _id: (vm.newDocument.type && vm.newDocument.type._id) || null,
                    name: (vm.newDocument.type && vm.newDocument.type.name) || null
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
        
        
        vm.goToDocument = function(document, portfolio){
            $location.path('portfolio-status-reports/document/' + document._id + '/list/' + portfolio._id);
        };

        vm.initDocumentDetails = function(){

            vm.selectedPortfolioId = $stateParams.portfolioId;

            PortfolioStatusReports.get({
                portfolioStatusReportId: $stateParams.portfolioStatusReportId
            }, function(res){
                vm.selectedDocument = res;
                vm.selectedDocumentStatusAreas = _.chunk(res.deliveryStatus.portfolioStatusAreas, 2);
                console.log(res);
            }, function(err){
                vm.error = err.data.message;
            });

            StatusReportTypes.query(function(res){
                vm.statusReportTypes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };

        vm.goToList = function(selectedPortfolioId){
            $location.path('portfolio-status-reports/list/' + selectedPortfolioId);
        };



        // -------------------------------------------------------- HEADER -------------------------------------------------

        vm.headerDateOpened = {};
        vm.openHeaderDate = function(document, $event){
            $event.preventDefault();
            $event.stopPropagation();
            vm.headerDateOpened[document._id] = true;
        };

        var originalHeaderTitle = {};
        var originalHeaderType = {};
        var originalHeaderDate = {};

        vm.editHeaderTitle = function(document){
            originalHeaderTitle[document._id] = {
                title : document.title
            };
            vm.selectHeaderTitleForm('edit', document);
        };

        vm.editHeaderType = function(document){
            originalHeaderType[document._id] = {
                type : document.type
            };
            vm.selectHeaderTypeForm('edit', document);
        };

        vm.editHeaderDate = function(document){
            originalHeaderDate[document._id] = {
                date : document.date
            };
            vm.selectHeaderDateForm('edit', document);
        };

        vm.saveEditHeaderTitle = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateHeader(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderTitleForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.saveEditHeaderType = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateHeader(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderTypeForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.saveEditHeaderDate = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateHeader(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    // Close edit header form and back to view
                    vm.selectHeaderDateForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditHeaderTitle = function(document){
            vm.error = null;
            document.title = originalHeaderTitle[document._id].title;
            vm.selectHeaderTitleForm('view', document);
        };

        vm.cancelEditHeaderType = function(document){
            vm.error = null;
            document.type = originalHeaderType[document._id].type;
            vm.selectHeaderTypeForm('view', document);
        };

        vm.cancelEditHeaderDate = function(document){
            vm.error = null;
            document.date = originalHeaderDate[document._id].date;
            vm.selectHeaderDateForm('view', document);
        };


        // ------------- DELETE REPORT ----------------------------
        
        vm.deleteDocument = function(document){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.delete(
                {
                    portfolioStatusReportId: document._id
                }, document, function(res){
                    vm.isResolving = false;
                    vm.portfolioStatusReports = _.without(vm.portfolioStatusReports, document);
                    vm.cancelNewDocument();
                    vm.selectedDocument = null;
                    // Redirect to list
                    $location.path('portfolio-status-reports');
                }, function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                });
        };


        // -------------------------------------------------------- DELIVERY STATUS -------------------------------------------------

        // Overall Status

        var originalOverallStatus = {};

        vm.editOverallStatus = function(document){
            originalOverallStatus[document._id] = {
                comment : document.deliveryStatus.overallStatus.comment
            };
            vm.selectOverallStatusForm('edit', document);
        };

        vm.saveEditOverallStatus = function(document){

            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateOverallStatus(
                {
                    portfolioStatusReportId : document._id
                }, document,
                function(res){
                    vm.isResolving = false;
                    vm.selectOverallStatusForm('view', document);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditOverallStatus = function(document){
            vm.error = null;
            document.deliveryStatus.overallStatus.comment = originalOverallStatus[document._id].comment;
            vm.selectOverallStatusForm('view', document);
        };

        // Status Area

        var originalStatusArea = {};

        vm.editStatusArea = function(statusArea){
            originalStatusArea[statusArea._id] = {
                comment : statusArea.comment
            };
            vm.selectStatusAreaForm('edit', statusArea);
        };

        vm.saveEditStatusArea = function(document, statusArea){
            vm.error = null;
            vm.isResolving = true;
            PortfolioStatusReports.updateStatusArea(
                {
                    portfolioStatusReportId : document._id,
                    portfolioStatusAreaId : statusArea._id
                }, statusArea,
                function(res){
                    vm.isResolving = false;
                    vm.selectStatusAreaForm('view', statusArea);
                },
                function(err){
                    vm.isResolving = false;
                    vm.error = err.data.message;
                }
            );
        };

        vm.cancelEditStatusArea = function(statusArea){
            vm.error = null;
            statusArea.comment = originalStatusArea[statusArea._id].comment;
            vm.selectStatusAreaForm('view', statusArea);
        };


    }
]);

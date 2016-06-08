'use strict';

angular.module('gate-process-assignment').controller('GateProcessAssignmentController', ['$rootScope', '$scope','$stateParams', '$location',
    'Authentication', 'Projects','Portfolios', 'GateProcessTemplates', 'StrategyNodes',
    'CategoryGroups', 'PriorityGroups', 'PriorityValues', '_','$q', '$modal', '$log',
    function($rootScope, $scope, $stateParams, $location, Authentication, Projects, Portfolios, GateProcessTemplates, StrategyNodes,
             CategoryGroups, PriorityGroups, PriorityValues, _ , $q, $modal, $log) {

        $rootScope.staticMenu = false;

        var vm = this;

        vm.isResolving = false;

        // ----------- INIT ---------------

        vm.initError = [];

        vm.init = function(){

            vm.user = Authentication.user;

            Projects.query({'selection.active': true, 'selection.selectedForDelivery': true}, function(projects){
                vm.projects = projects;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            Portfolios.query(function(portfolios){
                vm.portfolios = portfolios;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            GateProcessTemplates.query({'approval.currentRecord.approvalState': 'approved'},function(res){
                vm.gateProcesses = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            StrategyNodes.query(function(res){
                vm.strategyNodes = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            CategoryGroups.query(function(res){
                vm.categoryGroups = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            PriorityGroups.query(function(res){
                vm.priorityGroups = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

            PriorityValues.query(function(res){
                vm.priorityValues = res;
            }, function(err){
                vm.initError.push(err.data.message);
            });

        };


        // -------------- AUTHORIZATION FOR BUTTONS -----------------

        vm.userHasAuthorization = function(action, userData, project){
            var userIsSuperhero, userIsProjectManager, userIsPortfolioManager;
            if(action === 'edit'){
                userIsSuperhero = !!_.some(userData.roles, function(role){
                    return role === 'superAdmin' || role === 'admin' || role === 'pmo';
                });
                userIsProjectManager = (userData._id === project.projectManager) || (userData._id === project.backupProjectManager);
                if(project.portfolio){
                    userIsPortfolioManager = (userData._id === project.portfolio.portfolioManager) || (userData._id === project.portfolio.backupPortfolioManager);
                }
                return userIsSuperhero || userIsProjectManager || userIsPortfolioManager;
            }
        };

        vm.isProcessEditable = function(project){
            if(project){
                return (project.process.assignmentType === 'custom') && (project.process.assignmentConfirmed === false);
            }
        };

        vm.isProcessApprovable = function(project){
            if(project){
                return project.process.assignmentConfirmed === false;
            }
        };


        // ----------- FILTERS ------------

        vm.filterProcess = {};
        vm.filterCategorization = {};
        vm.filterPrioritization = {};

        // ------------- SELECT VIEW PROJECT ------------

        vm.showEditProjectForm = {};
        var originalProject = {};
        vm.selectProject = function(project){
            originalProject[project._id] = _.cloneDeep(project);
            vm.showEditProjectForm[project._id] = true;
        };

        // ------------- EDIT PROJECT ------------

        var allowNull = function(obj){
            if(obj){
                return obj._id;
            }
            return null;
        };
        
        vm.selectedBlueprintProcess = {};

        vm.confirmAssignment = function(project){
            // Save the project to the server
            Projects.confirmAssignment(
                {projectId: project._id},
                project,
                function(res) {
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    console.log(err);
                    vm.error = err.data.message;
                });
        };

        vm.standardAssignment = function(project, blueprintProcess){
            // Save the project to the server
            Projects.standardAssignment(
                {projectId: project._id},
                {processId: blueprintProcess._id, assignmentType: 'standard'},
                function(res) {
                    project.process = res.process;
                    project.process.assignmentType = res.process.assignmentType;
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    vm.error = err.data.message;
                });
        };

        vm.customAssignment = function(project, blueprintProcess){
            // Save the project to the server
            Projects.customAssignment(
                {projectId: project._id},
                {processId: (blueprintProcess && blueprintProcess._id) || null, assignmentType: 'custom'},
                function(res) {
                    // Update project data
                    project.process = res.process;
                    project.process.assignmentType = res.process.assignmentType;
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    // Switch view to read only
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    vm.error = err.data.message;
                });
        };

        vm.removeAssignment = function(project){
            // Save the project to the server
            Projects.removeAssignment(
                {projectId: project._id},
                {processId: (project.process && project.process._id) || null, assignmentType: 'unassigned'},
                function(res) {
                    // Update project data
                    project.process = res.process;
                    project.process.assignmentType = res.process.assignmentType;
                    project.process.assignmentConfirmed = res.process.assignmentConfirmed;
                    // Switch view to read only
                    vm.showEditProjectForm[project._id] = false;
                }, function(err) {
                    vm.error = err.data.message;
                });
        };

        vm.cancelEditProject = function(project){
            vm.error = null;
            project.process = originalProject[project._id].process;
            project.process.assignmentType = originalProject[project._id].process.assignmentType;
            project.process.assignmentConfirmed = originalProject[project._id].process.assignmentConfirmed;
            vm.showEditProjectForm[project._id] = false;
        };


        // ------------- PROJECT PROFILE -------------

        var modalUpdateIssue = function (size, user, project) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/gate-process-assignment/views/project-profile.client.view.html',
                controller: function ($scope, $modalInstance, Projects, user, project) {

                    $scope.user = user;

                    $scope.selectedProject = project;

                    $scope.originalProject = _.cloneDeep(project);

                    var originalProcess, originalGateHeader,  originalGatePosition, originalOutcome;

                    $scope.cancelModal = function () {
                        if($scope.selectedGate && originalGateHeader){
                            $scope.cancelEditGateHeader($scope.selectedGate);
                        }
                        if($scope.selectedGate && originalGatePosition){
                            $scope.cancelEditGatePosition($scope.selectedGate);
                        }
                        if($scope.selectedOutcome && originalOutcome){
                            $scope.cancelEditOutcome($scope.selectedOutcome);
                        }
                        $scope.error = null;
                        $modalInstance.dismiss();
                    };

                    // --- Select process ---

                    $scope.processDetails = 'header';

                    // Edit process

                    $scope.editProcess = function(project){
                        originalProcess = _.cloneDeep(project.process);
                        $scope.switchProcessHeaderForm = 'edit';
                    };

                    $scope.saveEditProcess = function(project){

                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateProcess(
                            { projectId: project._id }, project.process,
                            function(res){
                                $scope.isResolving = false;
                                originalProcess = null;
                                $scope.switchProcessHeaderForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditProcess = function(project){
                        project.process.name = originalProcess.name;
                        project.process.description = originalProcess.description;
                        originalProcess = null;
                        $scope.switchProcessHeaderForm = 'view';
                    };
                    

                    // ------------------------- GATE -----------------

                    $scope.createGate = function(project) {
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.createGate(
                            {projectId: project._id}, {},
                            function(res){
                                $scope.isResolving = false;
                                project.process.gates = res.process.gates;
                                if($scope.selectedGate && originalGateHeader){
                                    $scope.cancelEditGateHeader($scope.selectedGate);
                                }
                                if($scope.selectedGate && originalGatePosition){
                                    $scope.cancelEditGatePosition($scope.selectedGate);
                                }
                                if($scope.selectedOutcome && originalOutcome){
                                    $scope.cancelEditOutcome($scope.selectedOutcome);
                                }
                                $scope.selectedGate = null;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    // --- SELECT GATE HEADER ---

                    $scope.gateDetails = 'header';
                    
                    $scope.selectGate = function(gate){
                        // If a gate was selected and also clicked for edit, cancel header changes and put original to null
                        if($scope.selectedGate && originalGateHeader){
                            $scope.cancelEditGateHeader($scope.selectedGate);
                        }
                        // If a gate was selected and also clicked for edit, cancel header changes and put original to null
                        if($scope.selectedGate && originalGatePosition){
                            $scope.cancelEditGatePosition($scope.selectedGate);
                        }
                        // If an outcome was selected and also clicked for edit, cancel changes, put original to null and flush selectedOutcome
                        if($scope.selectedOutcome && originalOutcome){
                            $scope.cancelEditOutcome($scope.selectedOutcome);
                        }
                        $scope.selectedOutcome = null;
                        $scope.selectedGate = gate;
                        $scope.switchHeaderForm = 'view';
                    };

                    // --- EDIT GATE HEADER ---

                    $scope.editGateHeader = function(gate){
                        originalGateHeader = _.cloneDeep(gate);
                        $scope.switchHeaderForm = 'edit';
                    };

                    $scope.saveEditGateHeader = function(project, gate){
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateGateHeader(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, gate,
                            function(res){
                                $scope.isResolving = false;
                                originalGateHeader = null;
                                $scope.switchHeaderForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditGateHeader = function(gate){
                        gate.name = originalGateHeader.name;
                        gate.description = originalGateHeader.description;
                        originalGateHeader = null;
                        $scope.switchHeaderForm = 'view';
                    };


                    // --- EDIT GATE POSITION ---

                    $scope.getAllowedGatePositions = function(project){
                        var process = project.process;
                        if(process){// Otherwise Angularjs error that it cant interpolate
                            // All positions between 2 and length-1. Requires the length to be at least 3.
                            var retArray = [];
                            if(process.gates.length < 3){
                                return retArray;
                            }
                            if(process.gates.length >= 3){
                                for(var i = 2; i< process.gates.length; i++){
                                    retArray.push(i);
                                }
                                return retArray;
                            }
                        }
                    };

                    $scope.editGatePosition = function(gate){
                        originalGatePosition = _.cloneDeep(gate);
                        $scope.switchPositionForm = 'edit';
                    };

                    $scope.saveEditGatePosition = function(project, gate){

                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateGatePosition(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, gate,
                            function(res){
                                $scope.isResolving = false;
                                // If a gate head was selected and also clicked for edit, cancel header changes and put original to null
                                if($scope.selectedGate && originalGateHeader){
                                    $scope.cancelEditGateHeader($scope.selectedGate);
                                }
                                originalGatePosition = null;
                                $scope.selectedGate = null;
                                project.process.gates = res.process.gates;
                                $scope.switchPositionForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditGatePosition = function(gate){
                        gate.position = originalGatePosition.position;
                        originalGatePosition = null;
                        $scope.switchPositionForm = 'view';
                    };

                    // --- DELETE GATE ---

                    $scope.deleteGate = function(project, gate){
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.deleteGate(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, gate,
                            function(res){
                                $scope.isResolving = false;
                                originalGateHeader = null;
                                originalGatePosition = null;
                                $scope.selectedGate = null;
                                project.process.gates = res.process.gates;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    // --- CREATE OUTCOME ---

                    $scope.createOutcome = function(project, gate) {
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.createOutcome(
                            {
                                projectId: project._id,
                                projectGateId: gate._id
                            }, {},
                            function(res){
                                $scope.isResolving = false;
                                gate.outcomes.push(res);
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    // --- SELECT OUTCOME ---
                    
                    $scope.selectOutcome = function(outcome){
                        // If the outcome was selected and also clicked for edit, cancel changes and put original to null
                        if($scope.selectedOutcome && originalOutcome){
                            $scope.cancelEditOutcome($scope.selectedOutcome);
                        }
                        $scope.selectedOutcome = outcome;
                        $scope.switchOutcomeForm = 'view';
                    };

                    // --- EDIT OUTCOME ---

                    $scope.editOutcome = function(outcome){
                        originalOutcome = _.cloneDeep(outcome);
                        $scope.switchOutcomeForm = 'edit';
                    };

                    $scope.saveEditOutcome = function(project, gate, outcome){

                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.updateOutcome(
                            {
                                projectId: project._id,
                                projectGateId: gate._id,
                                projectOutcomeId: outcome._id
                            }, outcome,
                            function(res){
                                $scope.isResolving = false;
                                originalOutcome = null;
                                $scope.switchOutcomeForm = 'view';
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.cancelEditOutcome = function(outcome){
                        outcome.name = originalOutcome.name;
                        outcome.description = originalOutcome.description;
                        originalOutcome = null;
                        $scope.switchOutcomeForm = 'view';
                    };

                    // --- DELETE OUTCOME ---

                    $scope.deleteOutcome = function(project, gate, outcome){
                        $scope.isResolving = true;
                        $scope.error = null;
                        Projects.deleteOutcome(
                            {
                                projectId: project._id,
                                projectGateId: gate._id,
                                projectOutcomeId: outcome._id
                            }, outcome,
                            function(res){
                                $scope.isResolving = false;
                                originalOutcome = null;
                                $scope.selectedOutcome = null;
                                gate.outcomes = res.outcomes;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };


                    // --- APPROVAL ---

                    $scope.submitProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.submitProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.approveProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.approveProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.rejectProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.rejectProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                    $scope.draftProcess = function(project){
                        $scope.error = null;
                        $scope.isResolving = true;
                        Projects.draftProcess(
                            {
                                projectId : project._id
                            }, project,
                            function(res){
                                $scope.isResolving = false;
                                project.process.approval = res.process.approval;
                            },
                            function(err){
                                $scope.isResolving = false;
                                $scope.error = err.data.message;
                            }
                        );
                    };

                },
                size: size,
                resolve: {
                    project: function () {
                        return project;
                    },
                    user: function () {
                        return user;
                    }
                },
                backdrop: 'static',
                keyboard: false
            });

        };

        vm.selectProjectProfile = function(user, project){
            modalUpdateIssue('lg', user, project);
        };



    }
]);

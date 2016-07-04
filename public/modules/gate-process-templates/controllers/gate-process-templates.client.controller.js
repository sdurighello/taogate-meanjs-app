'use strict';

angular.module('gate-process-templates').controller('GateProcessTemplatesController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication',
    'GateProcessTemplates', '$q', '_',
    function($rootScope, $scope, $stateParams, $location, Authentication, GateProcessTemplates, $q, _) {

        $rootScope.staticMenu = false;

        // ------------- INIT -------------

        $scope.initError = [];

        $scope.init = function(){
            GateProcessTemplates.query(function(processes){
                $scope.gateProcesses = processes;
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

        // ------------------- NG-SWITCH ---------------------

        $scope.switchGateProcessForm = {};

        $scope.selectGateProcessForm = function(process, string){
            if(string === 'view'){ $scope.switchGateProcessForm[process._id] = 'view';}
            if(string === 'edit'){$scope.switchGateProcessForm[process._id] = 'edit';}
        };

        $scope.switchGateHeaderForm = {};

        $scope.selectGateHeaderForm = function(gate, string){
            if(string === 'view'){ $scope.switchGateHeaderForm[gate._id] = 'view';}
            if(string === 'edit'){$scope.switchGateHeaderForm[gate._id] = 'edit';}
        };

        $scope.switchGatePositionForm = {};

        $scope.selectGatePositionForm = function(gate, string){
            if(string === 'view'){ $scope.switchGatePositionForm[gate._id] = 'view';}
            if(string === 'edit'){$scope.switchGatePositionForm[gate._id] = 'edit';}
        };

        $scope.switchGateOutcomeForm = {};

        $scope.selectGateOutcomeForm = function(gateOutcome, string){
            if(string === 'view'){ $scope.switchGateOutcomeForm[gateOutcome._id] = 'view';}
            if(string === 'edit'){$scope.switchGateOutcomeForm[gateOutcome._id] = 'edit';}
        };

        // ---------------- PROCESS ------------------

        // Create process

        $scope.createProcess = function(){

            var newProcess = new GateProcessTemplates({
                name: 'New process'
            });

            $scope.isResolving = true;
            $scope.error = null;
            newProcess.$save(function(res) {
                $scope.isResolving = false;
                $scope.gateProcesses.push(res);
            }, function(err) {
                $scope.isResolving = false;
                $scope.error = err.data.message;
            });
        };

        // Select process

        $scope.processDetails = 'header';

        var originalProcess;

        $scope.selectProcess = function(process){
            // If a process was selected and also clicked for edit, cancel header changes and put original to null
            if($scope.selectedProcess && originalProcess){
                $scope.cancelEditProcess($scope.selectedProcess);
            }
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
            $scope.selectedGate = null;
            $scope.selectedProcess = process;
            $scope.switchProcessHeaderForm = 'view';
        };

        // Edit process

        $scope.editProcess = function(process){
            originalProcess = _.cloneDeep(process);
            $scope.switchProcessHeaderForm = 'edit';
        };

        $scope.saveEditProcess = function(process){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.update(
                { gateProcessTemplateId: process._id }, process,
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

        $scope.cancelEditProcess = function(process){
            process.name = originalProcess.name;
            process.description = originalProcess.description;
            originalProcess = null;
            $scope.switchProcessHeaderForm = 'view';
        };

        // Delete process

        $scope.deleteProcess = function(process){
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.delete(
                { gateProcessTemplateId: process._id }, process,
                function(res){
                    $scope.isResolving = false;
                    // If a process was selected and also clicked for edit, cancel header changes and put original to null
                    if($scope.selectedProcess && originalProcess){
                        $scope.cancelEditProcess($scope.selectedProcess);
                    }
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
                    $scope.selectedGate = null;
                    originalProcess = null;
                    $scope.selectedProcess = null;
                    $scope.gateProcesses = _.without($scope.gateProcesses, process);
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // ------------------------- GATE -----------------

        $scope.createGate = function(process) {
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.createGate(
                {gateProcessTemplateId: process._id}, {},
                function(res){
                    $scope.isResolving = false;
                    process.gates = res.gates;
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

        var originalGateHeader, originalGatePosition;

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

        $scope.saveEditGateHeader = function(process, gate){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.updateGateHeader(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
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

        $scope.getAllowedGatePositions = function(process){
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

        $scope.saveEditGatePosition = function(process, gate){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.updateGatePosition(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
                }, gate,
                function(res){
                    $scope.isResolving = false;
                    // If a gate head was selected and also clicked for edit, cancel header changes and put original to null
                    if($scope.selectedGate && originalGateHeader){
                        $scope.cancelEditGateHeader($scope.selectedGate);
                    }
                    originalGatePosition = null;
                    $scope.selectedGate = null;
                    process.gates = res.gates;
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

        $scope.deleteGate = function(process, gate){
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.deleteGate(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
                }, gate,
                function(res){
                    $scope.isResolving = false;
                    originalGateHeader = null;
                    originalGatePosition = null;
                    $scope.selectedGate = null;
                    process.gates = res.gates;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        // --- CREATE OUTCOME ---

        $scope.createOutcome = function(process, gate) {
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.createOutcome(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id
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

        var originalOutcome;

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

        $scope.saveEditOutcome = function(process, gate, outcome){

            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.updateOutcome(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id,
                    outcomeTemplateId: outcome._id
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

        $scope.deleteOutcome = function(process, gate, outcome){
            $scope.isResolving = true;
            $scope.error = null;
            GateProcessTemplates.deleteOutcome(
                {
                    gateProcessTemplateId: process._id,
                    gateTemplateId: gate._id,
                    outcomeTemplateId: outcome._id
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


        // -------------------------------------------------------- APPROVAL -------------------------------------------------

        $scope.submit = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.submit(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.approve = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.approve(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.reject = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.reject(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };

        $scope.draft = function(process){
            $scope.error = null;
            $scope.isResolving = true;
            GateProcessTemplates.draft(
                {
                    gateProcessTemplateId : process._id
                }, process,
                function(res){
                    $scope.isResolving = false;
                    process.approval = res.approval;
                },
                function(err){
                    $scope.isResolving = false;
                    $scope.error = err.data.message;
                }
            );
        };


    }
]);

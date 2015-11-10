'use strict';

angular.module('gate-management-setup').controller('GateManagementSetupController', ['$scope', '$stateParams', '$location', 'Authentication',
	'GateProcesses','Gates','GateOutcomes','$q','_',
	function($scope, $stateParams, $location, Authentication, GateProcesses, Gates, GateOutcomes, $q, _) {

		// ------------- INIT -------------

		$scope.init = function(){
			GateProcesses.query(function(processes){
				$scope.gateProcesses = processes;
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

		$scope.switchGateForm = {};

		$scope.selectGateForm = function(gate, string){
			if(string === 'view'){ $scope.switchGateForm[gate._id] = 'view';}
			if(string === 'new'){$scope.switchGateForm[gate._id] = 'new';}
			if(string === 'edit'){$scope.switchGateForm[gate._id] = 'edit';}
		};

		$scope.switchGateOutcomeForm = {};

		$scope.selectGateOutcomeForm = function(gateOutcome, string){
			if(string === 'view'){ $scope.switchGateOutcomeForm[gateOutcome._id] = 'view';}
			if(string === 'edit'){$scope.switchGateOutcomeForm[gateOutcome._id] = 'edit';}
		};

		// ----------------- REFRESH GATE PROCESSES LIST ------------

		$scope.gateProcessList = function(){
			GateProcesses.query(function(gateProcesses){
				$scope.gateProcesses = gateProcesses;
			});
		};


		// ------------------ CREATE GATE PROCESS ----------------

		$scope.createGateProcess = function() {
			$scope.error = null;

			var gateProcess = new GateProcesses ({
				name: 'New gate process',
				gates: []
			});

			gateProcess.$save(function(response) {
				$scope.gateProcessList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------ CREATE GATE ----------------

		$scope.createGate = function(process) {
			$scope.error = null;

                var gate = new Gates ({
                    name: 'New gate',
                    position: process.gates.length, // Same as existing closure gate
                    gateOutcomes: []
                });

                gate.$save(function(res) {
                    // Add new gate to the view process (client)
                    process.gates.push(res);
                    // Clean the array from deep populate and get only _ids
                    var copyProcess = _.clone(process);
                    copyProcess.gates = _.map(_.get(copyProcess, 'gates'), function(gate){
                        return gate._id;
                    });
                    // Add the created gate to the Process's gates array (server)
                    GateProcesses.update({
                        _id: copyProcess._id,
                        gates:copyProcess.gates
                    }, function(processResp){
                        // Add +1 to "closure" gate position (server)
                        Gates.update({
                            _id: process.closureGate._id,
                            position: process.closureGate.position + 1
                        }, function(gateRes){
                            // Update the closure gate on the view (client)
                            _.find(process.gates, '_id', process.closureGate._id).position = process.closureGate.position + 1;
                            process.closureGate.position = process.closureGate.position + 1;
                        },function(errorResponse){
                            console.log(errorResponse.data.message);
                            $scope.error = errorResponse.data.message;
                        });
                    },function(errorResponse){
                        $scope.error = errorResponse.data.message;
                    });

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
		};

		// ------------------- EDIT GATE PROCESS (HEADER ONLY) -----------------

		var originalEditGateProcess = {};

		$scope.selectGateProcess = function(gateProcess){
			originalEditGateProcess = _.clone(gateProcess);
			$scope.selectedGateProcess = gateProcess;
		};

		$scope.updateGateProcess = function(process) {
			GateProcesses.update({
				_id: process._id,
				name: process.name,
				description: process.description
			}, function(process){
				$scope.selectGateProcessForm(process, 'view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGateProcess = function(process){
			$scope.error = null;
			$scope.selectedGateProcess.name = originalEditGateProcess.name;
			$scope.selectedGateProcess.description = originalEditGateProcess.description;
			$scope.selectGateProcessForm(process, 'view');
		};

		// ------------------- EDIT GATE (HEADER ONLY) -----------------

		var originalEditGate = {};

		$scope.selectGate = function(gate){
			originalEditGate[gate._id] = _.clone(gate);
			$scope.error = null;
			$scope.selectGateForm(gate, 'edit');
		};

        var adjustGatesPosition = function(process, array, oldGate, newGate){
            // If you remove, omit newGate when calling function
            // EDIT gate position
            if(newGate){
                if(oldGate.position === newGate.position){return;}
                if(oldGate.position < newGate.position){
                    _.map(array, function(element){
                        if(oldGate.position < element.position && element.position <= newGate.position && element !== newGate){
                            element.position = element.position - 1;
                            Gates.update({_id: element._id, position: element.position},function(gateRes){}, function(errRes){
                                $scope.error = errRes.data.message;
                            });
                        }
                    });
                }
                if(oldGate.position > newGate.position){
                    _.map(array, function(element){
                        if(newGate.position <= element.position && element.position < oldGate.position && element !== newGate){
                            element.position = element.position + 1;
                            Gates.update({_id: element._id, position: element.position},function(gateRes){}, function(errRes){
                                $scope.error = errRes.data.message;
                            });
                        }
                    });
                }
            }
            // REMOVE gate
            else {
                _.map(array, function(element){
                    if(element.position > oldGate.position){
                        element.position = element.position - 1;
                        Gates.update({_id: element._id, position: element.position},function(gateRes){}, function(errRes){
                            $scope.error = errRes.data.message;
                        });
                    }
                });
                process.closureGate.position = process.closureGate.position - 1;
            }
        };

		$scope.updateGate = function(process, gate) {
			Gates.update({
				_id: gate._id,
				name: gate.name,
				description: gate.description,
                position: gate.position
			}, function(gateRes){
                adjustGatesPosition(process, process.gates, originalEditGate[gate._id], gate);
				$scope.selectGateForm(gate, 'view');
			},function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGate = function(gate){
			$scope.error = null;
			gate.name = originalEditGate[gate._id].name;
			gate.description = originalEditGate[gate._id].description;
            gate.position = originalEditGate[gate._id].position;
			$scope.selectGateForm(gate, 'view');
		};


		// ------------------- REMOVE GATE PROCESS -----------------

		$scope.removeGateProcess = function(process) {
			$scope.error = null;
			process.$remove(function(response) {
				$scope.selectedGateProcess = null;
				$scope.gateProcessList();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// ------------------- REMOVE GATE -----------------

		$scope.removeGate = function(process, gate) {
			$scope.error = null;

			Gates.remove({},gate, function(res){
				process.gates = _.without(process.gates, gate);
                adjustGatesPosition(process, process.gates, originalEditGate[gate._id]);
            }, function(err){
				$scope.error = err.data.message;
			});
		};


		// ------------------ CREATE GATE OUTCOME ----------------

		$scope.createGateOutcome = function(gate) {
			$scope.error = null;

			var gateOutcome = new GateOutcomes ({
				name: 'New gate outcome',
				description: 'New gate outcome description'
			});

			gateOutcome.$save(function(gateOutcomeRes) {
				// Add outcomes to the view gate
				gate.gateOutcomes.push(gateOutcomeRes);
				// Clean the array from deep populate and get only _ids
				var copyGate = _.clone(gate);
				copyGate.gateOutcomes = _.map(_.get(copyGate, 'gateOutcomes'), function(outcome){
					return outcome._id;
				});
				// Add the created outcome to the gate's gateOutcomes array
				Gates.update({
					_id: copyGate._id,
					gateOutcomes:copyGate.gateOutcomes
				}, function(gate){
					// do something on success response
				},function(errorResponse){
					$scope.error = errorResponse.data.message;
				});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// ------------------- EDIT GATE OUTCOME -----------------

		var originalEditGateOutcome = {};

		$scope.selectEditGateOutcome = function(gate, gateOutcome){
			originalEditGateOutcome[gateOutcome._id] = _.clone(gateOutcome);
			$scope.selectGateOutcomeForm(gateOutcome, 'edit');
		};

		$scope.updateGateOutcome = function(gate, gateOutcome) {
			GateOutcomes.update(gateOutcome, function(response) {
				$scope.selectGateOutcomeForm(gateOutcome, 'view');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancelEditGateOutcome = function(gateOutcome){
			$scope.error = null;
			gateOutcome.name = originalEditGateOutcome[gateOutcome._id].name;
			gateOutcome.description = originalEditGateOutcome[gateOutcome._id].description;
			$scope.selectGateOutcomeForm(gateOutcome, 'view');
		};

		// ------------------- REMOVE GATE OUTCOME -----------------

		$scope.removeGateOutcome = function(gate, gateOutcome) {
			$scope.error = null;
			GateOutcomes.remove({},gateOutcome, function(outcomeRes){
				gate.gateOutcomes = _.without(gate.gateOutcomes, gateOutcome);
			}, function(err){
				$scope.error = err.data.message;
			});
		};
	}
]);

'use strict';

(function() {
	// Gate processes Controller Spec
	describe('Gate processes Controller Tests', function() {
		// Initialize global variables
		var GateProcessesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Gate processes controller.
			GateProcessesController = $controller('GateProcessesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate process object fetched from XHR', inject(function(GateProcesses) {
			// Create sample Gate process using the Gate processes service
			var sampleGateProcess = new GateProcesses({
				name: 'New Gate process'
			});

			// Create a sample Gate processes array that includes the new Gate process
			var sampleGateProcesses = [sampleGateProcess];

			// Set GET response
			$httpBackend.expectGET('gate-processes').respond(sampleGateProcesses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateProcesses).toEqualData(sampleGateProcesses);
		}));

		it('$scope.findOne() should create an array with one Gate process object fetched from XHR using a gateProcessId URL parameter', inject(function(GateProcesses) {
			// Define a sample Gate process object
			var sampleGateProcess = new GateProcesses({
				name: 'New Gate process'
			});

			// Set the URL parameter
			$stateParams.gateProcessId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gate-processes\/([0-9a-fA-F]{24})$/).respond(sampleGateProcess);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateProcess).toEqualData(sampleGateProcess);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GateProcesses) {
			// Create a sample Gate process object
			var sampleGateProcessPostData = new GateProcesses({
				name: 'New Gate process'
			});

			// Create a sample Gate process response
			var sampleGateProcessResponse = new GateProcesses({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate process'
			});

			// Fixture mock form input values
			scope.name = 'New Gate process';

			// Set POST response
			$httpBackend.expectPOST('gate-processes', sampleGateProcessPostData).respond(sampleGateProcessResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate process was created
			expect($location.path()).toBe('/gate-processes/' + sampleGateProcessResponse._id);
		}));

		it('$scope.update() should update a valid Gate process', inject(function(GateProcesses) {
			// Define a sample Gate process put data
			var sampleGateProcessPutData = new GateProcesses({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate process'
			});

			// Mock Gate process in scope
			scope.gateProcess = sampleGateProcessPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gate-processes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gate-processes/' + sampleGateProcessPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateProcessId and remove the Gate process from the scope', inject(function(GateProcesses) {
			// Create new Gate process object
			var sampleGateProcess = new GateProcesses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gate processes array and include the Gate process
			scope.gateProcesses = [sampleGateProcess];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gate-processes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGateProcess);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gateProcesses.length).toBe(0);
		}));
	});
}());
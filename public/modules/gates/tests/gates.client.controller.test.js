'use strict';

(function() {
	// Gates Controller Spec
	describe('Gates Controller Tests', function() {
		// Initialize global variables
		var GatesController,
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

			// Initialize the Gates controller.
			GatesController = $controller('GatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate object fetched from XHR', inject(function(Gates) {
			// Create sample Gate using the Gates service
			var sampleGate = new Gates({
				name: 'New Gate'
			});

			// Create a sample Gates array that includes the new Gate
			var sampleGates = [sampleGate];

			// Set GET response
			$httpBackend.expectGET('gates').respond(sampleGates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gates).toEqualData(sampleGates);
		}));

		it('$scope.findOne() should create an array with one Gate object fetched from XHR using a gateId URL parameter', inject(function(Gates) {
			// Define a sample Gate object
			var sampleGate = new Gates({
				name: 'New Gate'
			});

			// Set the URL parameter
			$stateParams.gateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gates\/([0-9a-fA-F]{24})$/).respond(sampleGate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gate).toEqualData(sampleGate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gates) {
			// Create a sample Gate object
			var sampleGatePostData = new Gates({
				name: 'New Gate'
			});

			// Create a sample Gate response
			var sampleGateResponse = new Gates({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate'
			});

			// Fixture mock form input values
			scope.name = 'New Gate';

			// Set POST response
			$httpBackend.expectPOST('gates', sampleGatePostData).respond(sampleGateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate was created
			expect($location.path()).toBe('/gates/' + sampleGateResponse._id);
		}));

		it('$scope.update() should update a valid Gate', inject(function(Gates) {
			// Define a sample Gate put data
			var sampleGatePutData = new Gates({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate'
			});

			// Mock Gate in scope
			scope.gate = sampleGatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/gates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gates/' + sampleGatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateId and remove the Gate from the scope', inject(function(Gates) {
			// Create new Gate object
			var sampleGate = new Gates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gates array and include the Gate
			scope.gates = [sampleGate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gates.length).toBe(0);
		}));
	});
}());
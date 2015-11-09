'use strict';

(function() {
	// Gate outcomes Controller Spec
	describe('Gate outcomes Controller Tests', function() {
		// Initialize global variables
		var GateOutcomesController,
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

			// Initialize the Gate outcomes controller.
			GateOutcomesController = $controller('GateOutcomesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate outcome object fetched from XHR', inject(function(GateOutcomes) {
			// Create sample Gate outcome using the Gate outcomes service
			var sampleGateOutcome = new GateOutcomes({
				name: 'New Gate outcome'
			});

			// Create a sample Gate outcomes array that includes the new Gate outcome
			var sampleGateOutcomes = [sampleGateOutcome];

			// Set GET response
			$httpBackend.expectGET('gate-outcomes').respond(sampleGateOutcomes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateOutcomes).toEqualData(sampleGateOutcomes);
		}));

		it('$scope.findOne() should create an array with one Gate outcome object fetched from XHR using a gateOutcomeId URL parameter', inject(function(GateOutcomes) {
			// Define a sample Gate outcome object
			var sampleGateOutcome = new GateOutcomes({
				name: 'New Gate outcome'
			});

			// Set the URL parameter
			$stateParams.gateOutcomeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gate-outcomes\/([0-9a-fA-F]{24})$/).respond(sampleGateOutcome);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateOutcome).toEqualData(sampleGateOutcome);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GateOutcomes) {
			// Create a sample Gate outcome object
			var sampleGateOutcomePostData = new GateOutcomes({
				name: 'New Gate outcome'
			});

			// Create a sample Gate outcome response
			var sampleGateOutcomeResponse = new GateOutcomes({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate outcome'
			});

			// Fixture mock form input values
			scope.name = 'New Gate outcome';

			// Set POST response
			$httpBackend.expectPOST('gate-outcomes', sampleGateOutcomePostData).respond(sampleGateOutcomeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate outcome was created
			expect($location.path()).toBe('/gate-outcomes/' + sampleGateOutcomeResponse._id);
		}));

		it('$scope.update() should update a valid Gate outcome', inject(function(GateOutcomes) {
			// Define a sample Gate outcome put data
			var sampleGateOutcomePutData = new GateOutcomes({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate outcome'
			});

			// Mock Gate outcome in scope
			scope.gateOutcome = sampleGateOutcomePutData;

			// Set PUT response
			$httpBackend.expectPUT(/gate-outcomes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gate-outcomes/' + sampleGateOutcomePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateOutcomeId and remove the Gate outcome from the scope', inject(function(GateOutcomes) {
			// Create new Gate outcome object
			var sampleGateOutcome = new GateOutcomes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gate outcomes array and include the Gate outcome
			scope.gateOutcomes = [sampleGateOutcome];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gate-outcomes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGateOutcome);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gateOutcomes.length).toBe(0);
		}));
	});
}());
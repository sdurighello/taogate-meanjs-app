'use strict';

(function() {
	// Gate statuses Controller Spec
	describe('Gate statuses Controller Tests', function() {
		// Initialize global variables
		var GateStatusesController,
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

			// Initialize the Gate statuses controller.
			GateStatusesController = $controller('GateStatusesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate status object fetched from XHR', inject(function(GateStatuses) {
			// Create sample Gate status using the Gate statuses service
			var sampleGateStatus = new GateStatuses({
				name: 'New Gate status'
			});

			// Create a sample Gate statuses array that includes the new Gate status
			var sampleGateStatuses = [sampleGateStatus];

			// Set GET response
			$httpBackend.expectGET('gate-statuses').respond(sampleGateStatuses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateStatuses).toEqualData(sampleGateStatuses);
		}));

		it('$scope.findOne() should create an array with one Gate status object fetched from XHR using a gateStatusId URL parameter', inject(function(GateStatuses) {
			// Define a sample Gate status object
			var sampleGateStatus = new GateStatuses({
				name: 'New Gate status'
			});

			// Set the URL parameter
			$stateParams.gateStatusId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gate-statuses\/([0-9a-fA-F]{24})$/).respond(sampleGateStatus);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateStatus).toEqualData(sampleGateStatus);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GateStatuses) {
			// Create a sample Gate status object
			var sampleGateStatusPostData = new GateStatuses({
				name: 'New Gate status'
			});

			// Create a sample Gate status response
			var sampleGateStatusResponse = new GateStatuses({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate status'
			});

			// Fixture mock form input values
			scope.name = 'New Gate status';

			// Set POST response
			$httpBackend.expectPOST('gate-statuses', sampleGateStatusPostData).respond(sampleGateStatusResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate status was created
			expect($location.path()).toBe('/gate-statuses/' + sampleGateStatusResponse._id);
		}));

		it('$scope.update() should update a valid Gate status', inject(function(GateStatuses) {
			// Define a sample Gate status put data
			var sampleGateStatusPutData = new GateStatuses({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate status'
			});

			// Mock Gate status in scope
			scope.gateStatus = sampleGateStatusPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gate-statuses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gate-statuses/' + sampleGateStatusPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateStatusId and remove the Gate status from the scope', inject(function(GateStatuses) {
			// Create new Gate status object
			var sampleGateStatus = new GateStatuses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gate statuses array and include the Gate status
			scope.gateStatuses = [sampleGateStatus];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gate-statuses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGateStatus);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gateStatuses.length).toBe(0);
		}));
	});
}());
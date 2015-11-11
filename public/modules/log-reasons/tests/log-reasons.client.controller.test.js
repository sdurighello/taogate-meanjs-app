'use strict';

(function() {
	// Log reasons Controller Spec
	describe('Log reasons Controller Tests', function() {
		// Initialize global variables
		var LogReasonsController,
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

			// Initialize the Log reasons controller.
			LogReasonsController = $controller('LogReasonsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Log reason object fetched from XHR', inject(function(LogReasons) {
			// Create sample Log reason using the Log reasons service
			var sampleLogReason = new LogReasons({
				name: 'New Log reason'
			});

			// Create a sample Log reasons array that includes the new Log reason
			var sampleLogReasons = [sampleLogReason];

			// Set GET response
			$httpBackend.expectGET('log-reasons').respond(sampleLogReasons);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logReasons).toEqualData(sampleLogReasons);
		}));

		it('$scope.findOne() should create an array with one Log reason object fetched from XHR using a logReasonId URL parameter', inject(function(LogReasons) {
			// Define a sample Log reason object
			var sampleLogReason = new LogReasons({
				name: 'New Log reason'
			});

			// Set the URL parameter
			$stateParams.logReasonId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/log-reasons\/([0-9a-fA-F]{24})$/).respond(sampleLogReason);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logReason).toEqualData(sampleLogReason);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LogReasons) {
			// Create a sample Log reason object
			var sampleLogReasonPostData = new LogReasons({
				name: 'New Log reason'
			});

			// Create a sample Log reason response
			var sampleLogReasonResponse = new LogReasons({
				_id: '525cf20451979dea2c000001',
				name: 'New Log reason'
			});

			// Fixture mock form input values
			scope.name = 'New Log reason';

			// Set POST response
			$httpBackend.expectPOST('log-reasons', sampleLogReasonPostData).respond(sampleLogReasonResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Log reason was created
			expect($location.path()).toBe('/log-reasons/' + sampleLogReasonResponse._id);
		}));

		it('$scope.update() should update a valid Log reason', inject(function(LogReasons) {
			// Define a sample Log reason put data
			var sampleLogReasonPutData = new LogReasons({
				_id: '525cf20451979dea2c000001',
				name: 'New Log reason'
			});

			// Mock Log reason in scope
			scope.logReason = sampleLogReasonPutData;

			// Set PUT response
			$httpBackend.expectPUT(/log-reasons\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/log-reasons/' + sampleLogReasonPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid logReasonId and remove the Log reason from the scope', inject(function(LogReasons) {
			// Create new Log reason object
			var sampleLogReason = new LogReasons({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Log reasons array and include the Log reason
			scope.logReasons = [sampleLogReason];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/log-reasons\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLogReason);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.logReasons.length).toBe(0);
		}));
	});
}());
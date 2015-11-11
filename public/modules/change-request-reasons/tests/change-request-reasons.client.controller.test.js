'use strict';

(function() {
	// Change request reasons Controller Spec
	describe('Change request reasons Controller Tests', function() {
		// Initialize global variables
		var ChangeRequestReasonsController,
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

			// Initialize the Change request reasons controller.
			ChangeRequestReasonsController = $controller('ChangeRequestReasonsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Change request reason object fetched from XHR', inject(function(ChangeRequestReasons) {
			// Create sample Change request reason using the Change request reasons service
			var sampleChangeRequestReason = new ChangeRequestReasons({
				name: 'New Change request reason'
			});

			// Create a sample Change request reasons array that includes the new Change request reason
			var sampleChangeRequestReasons = [sampleChangeRequestReason];

			// Set GET response
			$httpBackend.expectGET('change-request-reasons').respond(sampleChangeRequestReasons);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.changeRequestReasons).toEqualData(sampleChangeRequestReasons);
		}));

		it('$scope.findOne() should create an array with one Change request reason object fetched from XHR using a changeRequestReasonId URL parameter', inject(function(ChangeRequestReasons) {
			// Define a sample Change request reason object
			var sampleChangeRequestReason = new ChangeRequestReasons({
				name: 'New Change request reason'
			});

			// Set the URL parameter
			$stateParams.changeRequestReasonId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/change-request-reasons\/([0-9a-fA-F]{24})$/).respond(sampleChangeRequestReason);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.changeRequestReason).toEqualData(sampleChangeRequestReason);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ChangeRequestReasons) {
			// Create a sample Change request reason object
			var sampleChangeRequestReasonPostData = new ChangeRequestReasons({
				name: 'New Change request reason'
			});

			// Create a sample Change request reason response
			var sampleChangeRequestReasonResponse = new ChangeRequestReasons({
				_id: '525cf20451979dea2c000001',
				name: 'New Change request reason'
			});

			// Fixture mock form input values
			scope.name = 'New Change request reason';

			// Set POST response
			$httpBackend.expectPOST('change-request-reasons', sampleChangeRequestReasonPostData).respond(sampleChangeRequestReasonResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Change request reason was created
			expect($location.path()).toBe('/change-request-reasons/' + sampleChangeRequestReasonResponse._id);
		}));

		it('$scope.update() should update a valid Change request reason', inject(function(ChangeRequestReasons) {
			// Define a sample Change request reason put data
			var sampleChangeRequestReasonPutData = new ChangeRequestReasons({
				_id: '525cf20451979dea2c000001',
				name: 'New Change request reason'
			});

			// Mock Change request reason in scope
			scope.changeRequestReason = sampleChangeRequestReasonPutData;

			// Set PUT response
			$httpBackend.expectPUT(/change-request-reasons\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/change-request-reasons/' + sampleChangeRequestReasonPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid changeRequestReasonId and remove the Change request reason from the scope', inject(function(ChangeRequestReasons) {
			// Create new Change request reason object
			var sampleChangeRequestReason = new ChangeRequestReasons({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Change request reasons array and include the Change request reason
			scope.changeRequestReasons = [sampleChangeRequestReason];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/change-request-reasons\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChangeRequestReason);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.changeRequestReasons.length).toBe(0);
		}));
	});
}());
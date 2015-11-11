'use strict';

(function() {
	// Change requests Controller Spec
	describe('Change requests Controller Tests', function() {
		// Initialize global variables
		var ChangeRequestsController,
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

			// Initialize the Change requests controller.
			ChangeRequestsController = $controller('ChangeRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Change request object fetched from XHR', inject(function(ChangeRequests) {
			// Create sample Change request using the Change requests service
			var sampleChangeRequest = new ChangeRequests({
				name: 'New Change request'
			});

			// Create a sample Change requests array that includes the new Change request
			var sampleChangeRequests = [sampleChangeRequest];

			// Set GET response
			$httpBackend.expectGET('change-requests').respond(sampleChangeRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.changeRequests).toEqualData(sampleChangeRequests);
		}));

		it('$scope.findOne() should create an array with one Change request object fetched from XHR using a changeRequestId URL parameter', inject(function(ChangeRequests) {
			// Define a sample Change request object
			var sampleChangeRequest = new ChangeRequests({
				name: 'New Change request'
			});

			// Set the URL parameter
			$stateParams.changeRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/change-requests\/([0-9a-fA-F]{24})$/).respond(sampleChangeRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.changeRequest).toEqualData(sampleChangeRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ChangeRequests) {
			// Create a sample Change request object
			var sampleChangeRequestPostData = new ChangeRequests({
				name: 'New Change request'
			});

			// Create a sample Change request response
			var sampleChangeRequestResponse = new ChangeRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Change request'
			});

			// Fixture mock form input values
			scope.name = 'New Change request';

			// Set POST response
			$httpBackend.expectPOST('change-requests', sampleChangeRequestPostData).respond(sampleChangeRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Change request was created
			expect($location.path()).toBe('/change-requests/' + sampleChangeRequestResponse._id);
		}));

		it('$scope.update() should update a valid Change request', inject(function(ChangeRequests) {
			// Define a sample Change request put data
			var sampleChangeRequestPutData = new ChangeRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Change request'
			});

			// Mock Change request in scope
			scope.changeRequest = sampleChangeRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/change-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/change-requests/' + sampleChangeRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid changeRequestId and remove the Change request from the scope', inject(function(ChangeRequests) {
			// Create new Change request object
			var sampleChangeRequest = new ChangeRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Change requests array and include the Change request
			scope.changeRequests = [sampleChangeRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/change-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChangeRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.changeRequests.length).toBe(0);
		}));
	});
}());
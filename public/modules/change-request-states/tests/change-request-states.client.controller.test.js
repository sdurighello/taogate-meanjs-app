'use strict';

(function() {
	// Change request states Controller Spec
	describe('Change request states Controller Tests', function() {
		// Initialize global variables
		var ChangeRequestStatesController,
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

			// Initialize the Change request states controller.
			ChangeRequestStatesController = $controller('ChangeRequestStatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Change request state object fetched from XHR', inject(function(ChangeRequestStates) {
			// Create sample Change request state using the Change request states service
			var sampleChangeRequestState = new ChangeRequestStates({
				name: 'New Change request state'
			});

			// Create a sample Change request states array that includes the new Change request state
			var sampleChangeRequestStates = [sampleChangeRequestState];

			// Set GET response
			$httpBackend.expectGET('change-request-states').respond(sampleChangeRequestStates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.changeRequestStates).toEqualData(sampleChangeRequestStates);
		}));

		it('$scope.findOne() should create an array with one Change request state object fetched from XHR using a changeRequestStateId URL parameter', inject(function(ChangeRequestStates) {
			// Define a sample Change request state object
			var sampleChangeRequestState = new ChangeRequestStates({
				name: 'New Change request state'
			});

			// Set the URL parameter
			$stateParams.changeRequestStateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/change-request-states\/([0-9a-fA-F]{24})$/).respond(sampleChangeRequestState);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.changeRequestState).toEqualData(sampleChangeRequestState);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ChangeRequestStates) {
			// Create a sample Change request state object
			var sampleChangeRequestStatePostData = new ChangeRequestStates({
				name: 'New Change request state'
			});

			// Create a sample Change request state response
			var sampleChangeRequestStateResponse = new ChangeRequestStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Change request state'
			});

			// Fixture mock form input values
			scope.name = 'New Change request state';

			// Set POST response
			$httpBackend.expectPOST('change-request-states', sampleChangeRequestStatePostData).respond(sampleChangeRequestStateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Change request state was created
			expect($location.path()).toBe('/change-request-states/' + sampleChangeRequestStateResponse._id);
		}));

		it('$scope.update() should update a valid Change request state', inject(function(ChangeRequestStates) {
			// Define a sample Change request state put data
			var sampleChangeRequestStatePutData = new ChangeRequestStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Change request state'
			});

			// Mock Change request state in scope
			scope.changeRequestState = sampleChangeRequestStatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/change-request-states\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/change-request-states/' + sampleChangeRequestStatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid changeRequestStateId and remove the Change request state from the scope', inject(function(ChangeRequestStates) {
			// Create new Change request state object
			var sampleChangeRequestState = new ChangeRequestStates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Change request states array and include the Change request state
			scope.changeRequestStates = [sampleChangeRequestState];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/change-request-states\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleChangeRequestState);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.changeRequestStates.length).toBe(0);
		}));
	});
}());
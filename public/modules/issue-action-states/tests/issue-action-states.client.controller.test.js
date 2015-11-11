'use strict';

(function() {
	// Issue action states Controller Spec
	describe('Issue action states Controller Tests', function() {
		// Initialize global variables
		var IssueActionStatesController,
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

			// Initialize the Issue action states controller.
			IssueActionStatesController = $controller('IssueActionStatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Issue action state object fetched from XHR', inject(function(IssueActionStates) {
			// Create sample Issue action state using the Issue action states service
			var sampleIssueActionState = new IssueActionStates({
				name: 'New Issue action state'
			});

			// Create a sample Issue action states array that includes the new Issue action state
			var sampleIssueActionStates = [sampleIssueActionState];

			// Set GET response
			$httpBackend.expectGET('issue-action-states').respond(sampleIssueActionStates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issueActionStates).toEqualData(sampleIssueActionStates);
		}));

		it('$scope.findOne() should create an array with one Issue action state object fetched from XHR using a issueActionStateId URL parameter', inject(function(IssueActionStates) {
			// Define a sample Issue action state object
			var sampleIssueActionState = new IssueActionStates({
				name: 'New Issue action state'
			});

			// Set the URL parameter
			$stateParams.issueActionStateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/issue-action-states\/([0-9a-fA-F]{24})$/).respond(sampleIssueActionState);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issueActionState).toEqualData(sampleIssueActionState);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(IssueActionStates) {
			// Create a sample Issue action state object
			var sampleIssueActionStatePostData = new IssueActionStates({
				name: 'New Issue action state'
			});

			// Create a sample Issue action state response
			var sampleIssueActionStateResponse = new IssueActionStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue action state'
			});

			// Fixture mock form input values
			scope.name = 'New Issue action state';

			// Set POST response
			$httpBackend.expectPOST('issue-action-states', sampleIssueActionStatePostData).respond(sampleIssueActionStateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Issue action state was created
			expect($location.path()).toBe('/issue-action-states/' + sampleIssueActionStateResponse._id);
		}));

		it('$scope.update() should update a valid Issue action state', inject(function(IssueActionStates) {
			// Define a sample Issue action state put data
			var sampleIssueActionStatePutData = new IssueActionStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue action state'
			});

			// Mock Issue action state in scope
			scope.issueActionState = sampleIssueActionStatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/issue-action-states\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/issue-action-states/' + sampleIssueActionStatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid issueActionStateId and remove the Issue action state from the scope', inject(function(IssueActionStates) {
			// Create new Issue action state object
			var sampleIssueActionState = new IssueActionStates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Issue action states array and include the Issue action state
			scope.issueActionStates = [sampleIssueActionState];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/issue-action-states\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIssueActionState);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.issueActionStates.length).toBe(0);
		}));
	});
}());
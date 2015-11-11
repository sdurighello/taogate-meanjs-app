'use strict';

(function() {
	// Issue states Controller Spec
	describe('Issue states Controller Tests', function() {
		// Initialize global variables
		var IssueStatesController,
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

			// Initialize the Issue states controller.
			IssueStatesController = $controller('IssueStatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Issue state object fetched from XHR', inject(function(IssueStates) {
			// Create sample Issue state using the Issue states service
			var sampleIssueState = new IssueStates({
				name: 'New Issue state'
			});

			// Create a sample Issue states array that includes the new Issue state
			var sampleIssueStates = [sampleIssueState];

			// Set GET response
			$httpBackend.expectGET('issue-states').respond(sampleIssueStates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issueStates).toEqualData(sampleIssueStates);
		}));

		it('$scope.findOne() should create an array with one Issue state object fetched from XHR using a issueStateId URL parameter', inject(function(IssueStates) {
			// Define a sample Issue state object
			var sampleIssueState = new IssueStates({
				name: 'New Issue state'
			});

			// Set the URL parameter
			$stateParams.issueStateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/issue-states\/([0-9a-fA-F]{24})$/).respond(sampleIssueState);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issueState).toEqualData(sampleIssueState);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(IssueStates) {
			// Create a sample Issue state object
			var sampleIssueStatePostData = new IssueStates({
				name: 'New Issue state'
			});

			// Create a sample Issue state response
			var sampleIssueStateResponse = new IssueStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue state'
			});

			// Fixture mock form input values
			scope.name = 'New Issue state';

			// Set POST response
			$httpBackend.expectPOST('issue-states', sampleIssueStatePostData).respond(sampleIssueStateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Issue state was created
			expect($location.path()).toBe('/issue-states/' + sampleIssueStateResponse._id);
		}));

		it('$scope.update() should update a valid Issue state', inject(function(IssueStates) {
			// Define a sample Issue state put data
			var sampleIssueStatePutData = new IssueStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue state'
			});

			// Mock Issue state in scope
			scope.issueState = sampleIssueStatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/issue-states\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/issue-states/' + sampleIssueStatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid issueStateId and remove the Issue state from the scope', inject(function(IssueStates) {
			// Create new Issue state object
			var sampleIssueState = new IssueStates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Issue states array and include the Issue state
			scope.issueStates = [sampleIssueState];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/issue-states\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIssueState);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.issueStates.length).toBe(0);
		}));
	});
}());
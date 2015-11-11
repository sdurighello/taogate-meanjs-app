'use strict';

(function() {
	// Issue reasons Controller Spec
	describe('Issue reasons Controller Tests', function() {
		// Initialize global variables
		var IssueReasonsController,
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

			// Initialize the Issue reasons controller.
			IssueReasonsController = $controller('IssueReasonsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Issue reason object fetched from XHR', inject(function(IssueReasons) {
			// Create sample Issue reason using the Issue reasons service
			var sampleIssueReason = new IssueReasons({
				name: 'New Issue reason'
			});

			// Create a sample Issue reasons array that includes the new Issue reason
			var sampleIssueReasons = [sampleIssueReason];

			// Set GET response
			$httpBackend.expectGET('issue-reasons').respond(sampleIssueReasons);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issueReasons).toEqualData(sampleIssueReasons);
		}));

		it('$scope.findOne() should create an array with one Issue reason object fetched from XHR using a issueReasonId URL parameter', inject(function(IssueReasons) {
			// Define a sample Issue reason object
			var sampleIssueReason = new IssueReasons({
				name: 'New Issue reason'
			});

			// Set the URL parameter
			$stateParams.issueReasonId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/issue-reasons\/([0-9a-fA-F]{24})$/).respond(sampleIssueReason);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.issueReason).toEqualData(sampleIssueReason);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(IssueReasons) {
			// Create a sample Issue reason object
			var sampleIssueReasonPostData = new IssueReasons({
				name: 'New Issue reason'
			});

			// Create a sample Issue reason response
			var sampleIssueReasonResponse = new IssueReasons({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue reason'
			});

			// Fixture mock form input values
			scope.name = 'New Issue reason';

			// Set POST response
			$httpBackend.expectPOST('issue-reasons', sampleIssueReasonPostData).respond(sampleIssueReasonResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Issue reason was created
			expect($location.path()).toBe('/issue-reasons/' + sampleIssueReasonResponse._id);
		}));

		it('$scope.update() should update a valid Issue reason', inject(function(IssueReasons) {
			// Define a sample Issue reason put data
			var sampleIssueReasonPutData = new IssueReasons({
				_id: '525cf20451979dea2c000001',
				name: 'New Issue reason'
			});

			// Mock Issue reason in scope
			scope.issueReason = sampleIssueReasonPutData;

			// Set PUT response
			$httpBackend.expectPUT(/issue-reasons\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/issue-reasons/' + sampleIssueReasonPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid issueReasonId and remove the Issue reason from the scope', inject(function(IssueReasons) {
			// Create new Issue reason object
			var sampleIssueReason = new IssueReasons({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Issue reasons array and include the Issue reason
			scope.issueReasons = [sampleIssueReason];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/issue-reasons\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIssueReason);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.issueReasons.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Project issues Controller Spec
	describe('Project issues Controller Tests', function() {
		// Initialize global variables
		var ProjectIssuesController,
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

			// Initialize the Project issues controller.
			ProjectIssuesController = $controller('ProjectIssuesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project issue object fetched from XHR', inject(function(ProjectIssues) {
			// Create sample Project issue using the Project issues service
			var sampleProjectIssue = new ProjectIssues({
				name: 'New Project issue'
			});

			// Create a sample Project issues array that includes the new Project issue
			var sampleProjectIssues = [sampleProjectIssue];

			// Set GET response
			$httpBackend.expectGET('project-issues').respond(sampleProjectIssues);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectIssues).toEqualData(sampleProjectIssues);
		}));

		it('$scope.findOne() should create an array with one Project issue object fetched from XHR using a projectIssueId URL parameter', inject(function(ProjectIssues) {
			// Define a sample Project issue object
			var sampleProjectIssue = new ProjectIssues({
				name: 'New Project issue'
			});

			// Set the URL parameter
			$stateParams.projectIssueId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-issues\/([0-9a-fA-F]{24})$/).respond(sampleProjectIssue);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectIssue).toEqualData(sampleProjectIssue);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectIssues) {
			// Create a sample Project issue object
			var sampleProjectIssuePostData = new ProjectIssues({
				name: 'New Project issue'
			});

			// Create a sample Project issue response
			var sampleProjectIssueResponse = new ProjectIssues({
				_id: '525cf20451979dea2c000001',
				name: 'New Project issue'
			});

			// Fixture mock form input values
			scope.name = 'New Project issue';

			// Set POST response
			$httpBackend.expectPOST('project-issues', sampleProjectIssuePostData).respond(sampleProjectIssueResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project issue was created
			expect($location.path()).toBe('/project-issues/' + sampleProjectIssueResponse._id);
		}));

		it('$scope.update() should update a valid Project issue', inject(function(ProjectIssues) {
			// Define a sample Project issue put data
			var sampleProjectIssuePutData = new ProjectIssues({
				_id: '525cf20451979dea2c000001',
				name: 'New Project issue'
			});

			// Mock Project issue in scope
			scope.projectIssue = sampleProjectIssuePutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-issues\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-issues/' + sampleProjectIssuePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectIssueId and remove the Project issue from the scope', inject(function(ProjectIssues) {
			// Create new Project issue object
			var sampleProjectIssue = new ProjectIssues({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project issues array and include the Project issue
			scope.projectIssues = [sampleProjectIssue];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-issues\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectIssue);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectIssues.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Portfolio issues Controller Spec
	describe('Portfolio issues Controller Tests', function() {
		// Initialize global variables
		var PortfolioIssuesController,
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

			// Initialize the Portfolio issues controller.
			PortfolioIssuesController = $controller('PortfolioIssuesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio issue object fetched from XHR', inject(function(PortfolioIssues) {
			// Create sample Portfolio issue using the Portfolio issues service
			var samplePortfolioIssue = new PortfolioIssues({
				name: 'New Portfolio issue'
			});

			// Create a sample Portfolio issues array that includes the new Portfolio issue
			var samplePortfolioIssues = [samplePortfolioIssue];

			// Set GET response
			$httpBackend.expectGET('portfolio-issues').respond(samplePortfolioIssues);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioIssues).toEqualData(samplePortfolioIssues);
		}));

		it('$scope.findOne() should create an array with one Portfolio issue object fetched from XHR using a portfolioIssueId URL parameter', inject(function(PortfolioIssues) {
			// Define a sample Portfolio issue object
			var samplePortfolioIssue = new PortfolioIssues({
				name: 'New Portfolio issue'
			});

			// Set the URL parameter
			$stateParams.portfolioIssueId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-issues\/([0-9a-fA-F]{24})$/).respond(samplePortfolioIssue);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioIssue).toEqualData(samplePortfolioIssue);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioIssues) {
			// Create a sample Portfolio issue object
			var samplePortfolioIssuePostData = new PortfolioIssues({
				name: 'New Portfolio issue'
			});

			// Create a sample Portfolio issue response
			var samplePortfolioIssueResponse = new PortfolioIssues({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio issue'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio issue';

			// Set POST response
			$httpBackend.expectPOST('portfolio-issues', samplePortfolioIssuePostData).respond(samplePortfolioIssueResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio issue was created
			expect($location.path()).toBe('/portfolio-issues/' + samplePortfolioIssueResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio issue', inject(function(PortfolioIssues) {
			// Define a sample Portfolio issue put data
			var samplePortfolioIssuePutData = new PortfolioIssues({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio issue'
			});

			// Mock Portfolio issue in scope
			scope.portfolioIssue = samplePortfolioIssuePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-issues\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-issues/' + samplePortfolioIssuePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioIssueId and remove the Portfolio issue from the scope', inject(function(PortfolioIssues) {
			// Create new Portfolio issue object
			var samplePortfolioIssue = new PortfolioIssues({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio issues array and include the Portfolio issue
			scope.portfolioIssues = [samplePortfolioIssue];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-issues\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioIssue);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioIssues.length).toBe(0);
		}));
	});
}());
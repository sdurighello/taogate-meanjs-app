'use strict';

(function() {
	// Portfolio change requests Controller Spec
	describe('Portfolio change requests Controller Tests', function() {
		// Initialize global variables
		var PortfolioChangeRequestsController,
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

			// Initialize the Portfolio change requests controller.
			PortfolioChangeRequestsController = $controller('PortfolioChangeRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio change request object fetched from XHR', inject(function(PortfolioChangeRequests) {
			// Create sample Portfolio change request using the Portfolio change requests service
			var samplePortfolioChangeRequest = new PortfolioChangeRequests({
				name: 'New Portfolio change request'
			});

			// Create a sample Portfolio change requests array that includes the new Portfolio change request
			var samplePortfolioChangeRequests = [samplePortfolioChangeRequest];

			// Set GET response
			$httpBackend.expectGET('portfolio-change-requests').respond(samplePortfolioChangeRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioChangeRequests).toEqualData(samplePortfolioChangeRequests);
		}));

		it('$scope.findOne() should create an array with one Portfolio change request object fetched from XHR using a portfolioChangeRequestId URL parameter', inject(function(PortfolioChangeRequests) {
			// Define a sample Portfolio change request object
			var samplePortfolioChangeRequest = new PortfolioChangeRequests({
				name: 'New Portfolio change request'
			});

			// Set the URL parameter
			$stateParams.portfolioChangeRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-change-requests\/([0-9a-fA-F]{24})$/).respond(samplePortfolioChangeRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioChangeRequest).toEqualData(samplePortfolioChangeRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioChangeRequests) {
			// Create a sample Portfolio change request object
			var samplePortfolioChangeRequestPostData = new PortfolioChangeRequests({
				name: 'New Portfolio change request'
			});

			// Create a sample Portfolio change request response
			var samplePortfolioChangeRequestResponse = new PortfolioChangeRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio change request'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio change request';

			// Set POST response
			$httpBackend.expectPOST('portfolio-change-requests', samplePortfolioChangeRequestPostData).respond(samplePortfolioChangeRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio change request was created
			expect($location.path()).toBe('/portfolio-change-requests/' + samplePortfolioChangeRequestResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio change request', inject(function(PortfolioChangeRequests) {
			// Define a sample Portfolio change request put data
			var samplePortfolioChangeRequestPutData = new PortfolioChangeRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio change request'
			});

			// Mock Portfolio change request in scope
			scope.portfolioChangeRequest = samplePortfolioChangeRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-change-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-change-requests/' + samplePortfolioChangeRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioChangeRequestId and remove the Portfolio change request from the scope', inject(function(PortfolioChangeRequests) {
			// Create new Portfolio change request object
			var samplePortfolioChangeRequest = new PortfolioChangeRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio change requests array and include the Portfolio change request
			scope.portfolioChangeRequests = [samplePortfolioChangeRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-change-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioChangeRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioChangeRequests.length).toBe(0);
		}));
	});
}());
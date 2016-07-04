'use strict';

(function() {
	// Portfolio status updates Controller Spec
	describe('Portfolio status updates Controller Tests', function() {
		// Initialize global variables
		var PortfolioStatusUpdatesController,
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

			// Initialize the Portfolio status updates controller.
			PortfolioStatusUpdatesController = $controller('PortfolioStatusUpdatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio status update object fetched from XHR', inject(function(PortfolioStatusUpdates) {
			// Create sample Portfolio status update using the Portfolio status updates service
			var samplePortfolioStatusUpdate = new PortfolioStatusUpdates({
				name: 'New Portfolio status update'
			});

			// Create a sample Portfolio status updates array that includes the new Portfolio status update
			var samplePortfolioStatusUpdates = [samplePortfolioStatusUpdate];

			// Set GET response
			$httpBackend.expectGET('portfolio-status-updates').respond(samplePortfolioStatusUpdates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioStatusUpdates).toEqualData(samplePortfolioStatusUpdates);
		}));

		it('$scope.findOne() should create an array with one Portfolio status update object fetched from XHR using a portfolioStatusUpdateId URL parameter', inject(function(PortfolioStatusUpdates) {
			// Define a sample Portfolio status update object
			var samplePortfolioStatusUpdate = new PortfolioStatusUpdates({
				name: 'New Portfolio status update'
			});

			// Set the URL parameter
			$stateParams.portfolioStatusUpdateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-status-updates\/([0-9a-fA-F]{24})$/).respond(samplePortfolioStatusUpdate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioStatusUpdate).toEqualData(samplePortfolioStatusUpdate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioStatusUpdates) {
			// Create a sample Portfolio status update object
			var samplePortfolioStatusUpdatePostData = new PortfolioStatusUpdates({
				name: 'New Portfolio status update'
			});

			// Create a sample Portfolio status update response
			var samplePortfolioStatusUpdateResponse = new PortfolioStatusUpdates({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio status update'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio status update';

			// Set POST response
			$httpBackend.expectPOST('portfolio-status-updates', samplePortfolioStatusUpdatePostData).respond(samplePortfolioStatusUpdateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio status update was created
			expect($location.path()).toBe('/portfolio-status-updates/' + samplePortfolioStatusUpdateResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio status update', inject(function(PortfolioStatusUpdates) {
			// Define a sample Portfolio status update put data
			var samplePortfolioStatusUpdatePutData = new PortfolioStatusUpdates({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio status update'
			});

			// Mock Portfolio status update in scope
			scope.portfolioStatusUpdate = samplePortfolioStatusUpdatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-status-updates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-status-updates/' + samplePortfolioStatusUpdatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioStatusUpdateId and remove the Portfolio status update from the scope', inject(function(PortfolioStatusUpdates) {
			// Create new Portfolio status update object
			var samplePortfolioStatusUpdate = new PortfolioStatusUpdates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio status updates array and include the Portfolio status update
			scope.portfolioStatusUpdates = [samplePortfolioStatusUpdate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-status-updates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioStatusUpdate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioStatusUpdates.length).toBe(0);
		}));
	});
}());
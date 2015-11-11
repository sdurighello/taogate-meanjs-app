'use strict';

(function() {
	// Portfolio milestone types Controller Spec
	describe('Portfolio milestone types Controller Tests', function() {
		// Initialize global variables
		var PortfolioMilestoneTypesController,
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

			// Initialize the Portfolio milestone types controller.
			PortfolioMilestoneTypesController = $controller('PortfolioMilestoneTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio milestone type object fetched from XHR', inject(function(PortfolioMilestoneTypes) {
			// Create sample Portfolio milestone type using the Portfolio milestone types service
			var samplePortfolioMilestoneType = new PortfolioMilestoneTypes({
				name: 'New Portfolio milestone type'
			});

			// Create a sample Portfolio milestone types array that includes the new Portfolio milestone type
			var samplePortfolioMilestoneTypes = [samplePortfolioMilestoneType];

			// Set GET response
			$httpBackend.expectGET('portfolio-milestone-types').respond(samplePortfolioMilestoneTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioMilestoneTypes).toEqualData(samplePortfolioMilestoneTypes);
		}));

		it('$scope.findOne() should create an array with one Portfolio milestone type object fetched from XHR using a portfolioMilestoneTypeId URL parameter', inject(function(PortfolioMilestoneTypes) {
			// Define a sample Portfolio milestone type object
			var samplePortfolioMilestoneType = new PortfolioMilestoneTypes({
				name: 'New Portfolio milestone type'
			});

			// Set the URL parameter
			$stateParams.portfolioMilestoneTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-milestone-types\/([0-9a-fA-F]{24})$/).respond(samplePortfolioMilestoneType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioMilestoneType).toEqualData(samplePortfolioMilestoneType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioMilestoneTypes) {
			// Create a sample Portfolio milestone type object
			var samplePortfolioMilestoneTypePostData = new PortfolioMilestoneTypes({
				name: 'New Portfolio milestone type'
			});

			// Create a sample Portfolio milestone type response
			var samplePortfolioMilestoneTypeResponse = new PortfolioMilestoneTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio milestone type'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio milestone type';

			// Set POST response
			$httpBackend.expectPOST('portfolio-milestone-types', samplePortfolioMilestoneTypePostData).respond(samplePortfolioMilestoneTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio milestone type was created
			expect($location.path()).toBe('/portfolio-milestone-types/' + samplePortfolioMilestoneTypeResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio milestone type', inject(function(PortfolioMilestoneTypes) {
			// Define a sample Portfolio milestone type put data
			var samplePortfolioMilestoneTypePutData = new PortfolioMilestoneTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio milestone type'
			});

			// Mock Portfolio milestone type in scope
			scope.portfolioMilestoneType = samplePortfolioMilestoneTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-milestone-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-milestone-types/' + samplePortfolioMilestoneTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioMilestoneTypeId and remove the Portfolio milestone type from the scope', inject(function(PortfolioMilestoneTypes) {
			// Create new Portfolio milestone type object
			var samplePortfolioMilestoneType = new PortfolioMilestoneTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio milestone types array and include the Portfolio milestone type
			scope.portfolioMilestoneTypes = [samplePortfolioMilestoneType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-milestone-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioMilestoneType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioMilestoneTypes.length).toBe(0);
		}));
	});
}());
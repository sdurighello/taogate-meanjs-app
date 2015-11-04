'use strict';

(function() {
	// Portfolio types Controller Spec
	describe('Portfolio types Controller Tests', function() {
		// Initialize global variables
		var PortfolioTypesController,
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

			// Initialize the Portfolio types controller.
			PortfolioTypesController = $controller('PortfolioTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio type object fetched from XHR', inject(function(PortfolioTypes) {
			// Create sample Portfolio type using the Portfolio types service
			var samplePortfolioType = new PortfolioTypes({
				name: 'New Portfolio type'
			});

			// Create a sample Portfolio types array that includes the new Portfolio type
			var samplePortfolioTypes = [samplePortfolioType];

			// Set GET response
			$httpBackend.expectGET('portfolio-types').respond(samplePortfolioTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioTypes).toEqualData(samplePortfolioTypes);
		}));

		it('$scope.findOne() should create an array with one Portfolio type object fetched from XHR using a portfolioTypeId URL parameter', inject(function(PortfolioTypes) {
			// Define a sample Portfolio type object
			var samplePortfolioType = new PortfolioTypes({
				name: 'New Portfolio type'
			});

			// Set the URL parameter
			$stateParams.portfolioTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-types\/([0-9a-fA-F]{24})$/).respond(samplePortfolioType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioType).toEqualData(samplePortfolioType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioTypes) {
			// Create a sample Portfolio type object
			var samplePortfolioTypePostData = new PortfolioTypes({
				name: 'New Portfolio type'
			});

			// Create a sample Portfolio type response
			var samplePortfolioTypeResponse = new PortfolioTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio type'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio type';

			// Set POST response
			$httpBackend.expectPOST('portfolio-types', samplePortfolioTypePostData).respond(samplePortfolioTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio type was created
			expect($location.path()).toBe('/portfolio-types/' + samplePortfolioTypeResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio type', inject(function(PortfolioTypes) {
			// Define a sample Portfolio type put data
			var samplePortfolioTypePutData = new PortfolioTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio type'
			});

			// Mock Portfolio type in scope
			scope.portfolioType = samplePortfolioTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-types/' + samplePortfolioTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioTypeId and remove the Portfolio type from the scope', inject(function(PortfolioTypes) {
			// Create new Portfolio type object
			var samplePortfolioType = new PortfolioTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio types array and include the Portfolio type
			scope.portfolioTypes = [samplePortfolioType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioTypes.length).toBe(0);
		}));
	});
}());
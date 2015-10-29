'use strict';

(function() {
	// Portfolios Controller Spec
	describe('Portfolios Controller Tests', function() {
		// Initialize global variables
		var PortfoliosController,
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

			// Initialize the Portfolios controller.
			PortfoliosController = $controller('PortfoliosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio object fetched from XHR', inject(function(Portfolios) {
			// Create sample Portfolio using the Portfolios service
			var samplePortfolio = new Portfolios({
				name: 'New Portfolio'
			});

			// Create a sample Portfolios array that includes the new Portfolio
			var samplePortfolios = [samplePortfolio];

			// Set GET response
			$httpBackend.expectGET('portfolios').respond(samplePortfolios);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolios).toEqualData(samplePortfolios);
		}));

		it('$scope.findOne() should create an array with one Portfolio object fetched from XHR using a portfolioId URL parameter', inject(function(Portfolios) {
			// Define a sample Portfolio object
			var samplePortfolio = new Portfolios({
				name: 'New Portfolio'
			});

			// Set the URL parameter
			$stateParams.portfolioId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolios\/([0-9a-fA-F]{24})$/).respond(samplePortfolio);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolio).toEqualData(samplePortfolio);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Portfolios) {
			// Create a sample Portfolio object
			var samplePortfolioPostData = new Portfolios({
				name: 'New Portfolio'
			});

			// Create a sample Portfolio response
			var samplePortfolioResponse = new Portfolios({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio';

			// Set POST response
			$httpBackend.expectPOST('portfolios', samplePortfolioPostData).respond(samplePortfolioResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio was created
			expect($location.path()).toBe('/portfolios/' + samplePortfolioResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio', inject(function(Portfolios) {
			// Define a sample Portfolio put data
			var samplePortfolioPutData = new Portfolios({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio'
			});

			// Mock Portfolio in scope
			scope.portfolio = samplePortfolioPutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolios\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolios/' + samplePortfolioPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioId and remove the Portfolio from the scope', inject(function(Portfolios) {
			// Create new Portfolio object
			var samplePortfolio = new Portfolios({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolios array and include the Portfolio
			scope.portfolios = [samplePortfolio];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolios\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolio);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolios.length).toBe(0);
		}));
	});
}());
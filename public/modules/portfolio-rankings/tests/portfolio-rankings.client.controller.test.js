'use strict';

(function() {
	// Portfolio rankings Controller Spec
	describe('Portfolio rankings Controller Tests', function() {
		// Initialize global variables
		var PortfolioRankingsController,
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

			// Initialize the Portfolio rankings controller.
			PortfolioRankingsController = $controller('PortfolioRankingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio ranking object fetched from XHR', inject(function(PortfolioRankings) {
			// Create sample Portfolio ranking using the Portfolio rankings service
			var samplePortfolioRanking = new PortfolioRankings({
				name: 'New Portfolio ranking'
			});

			// Create a sample Portfolio rankings array that includes the new Portfolio ranking
			var samplePortfolioRankings = [samplePortfolioRanking];

			// Set GET response
			$httpBackend.expectGET('portfolio-rankings').respond(samplePortfolioRankings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioRankings).toEqualData(samplePortfolioRankings);
		}));

		it('$scope.findOne() should create an array with one Portfolio ranking object fetched from XHR using a portfolioRankingId URL parameter', inject(function(PortfolioRankings) {
			// Define a sample Portfolio ranking object
			var samplePortfolioRanking = new PortfolioRankings({
				name: 'New Portfolio ranking'
			});

			// Set the URL parameter
			$stateParams.portfolioRankingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-rankings\/([0-9a-fA-F]{24})$/).respond(samplePortfolioRanking);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioRanking).toEqualData(samplePortfolioRanking);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioRankings) {
			// Create a sample Portfolio ranking object
			var samplePortfolioRankingPostData = new PortfolioRankings({
				name: 'New Portfolio ranking'
			});

			// Create a sample Portfolio ranking response
			var samplePortfolioRankingResponse = new PortfolioRankings({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio ranking'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio ranking';

			// Set POST response
			$httpBackend.expectPOST('portfolio-rankings', samplePortfolioRankingPostData).respond(samplePortfolioRankingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio ranking was created
			expect($location.path()).toBe('/portfolio-rankings/' + samplePortfolioRankingResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio ranking', inject(function(PortfolioRankings) {
			// Define a sample Portfolio ranking put data
			var samplePortfolioRankingPutData = new PortfolioRankings({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio ranking'
			});

			// Mock Portfolio ranking in scope
			scope.portfolioRanking = samplePortfolioRankingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-rankings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-rankings/' + samplePortfolioRankingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioRankingId and remove the Portfolio ranking from the scope', inject(function(PortfolioRankings) {
			// Create new Portfolio ranking object
			var samplePortfolioRanking = new PortfolioRankings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio rankings array and include the Portfolio ranking
			scope.portfolioRankings = [samplePortfolioRanking];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-rankings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioRanking);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioRankings.length).toBe(0);
		}));
	});
}());
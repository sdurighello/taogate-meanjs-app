'use strict';

(function() {
	// Portfolio reviews Controller Spec
	describe('Portfolio reviews Controller Tests', function() {
		// Initialize global variables
		var PortfolioReviewsController,
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

			// Initialize the Portfolio reviews controller.
			PortfolioReviewsController = $controller('PortfolioReviewsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio review object fetched from XHR', inject(function(PortfolioReviews) {
			// Create sample Portfolio review using the Portfolio reviews service
			var samplePortfolioReview = new PortfolioReviews({
				name: 'New Portfolio review'
			});

			// Create a sample Portfolio reviews array that includes the new Portfolio review
			var samplePortfolioReviews = [samplePortfolioReview];

			// Set GET response
			$httpBackend.expectGET('portfolio-reviews').respond(samplePortfolioReviews);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioReviews).toEqualData(samplePortfolioReviews);
		}));

		it('$scope.findOne() should create an array with one Portfolio review object fetched from XHR using a portfolioReviewId URL parameter', inject(function(PortfolioReviews) {
			// Define a sample Portfolio review object
			var samplePortfolioReview = new PortfolioReviews({
				name: 'New Portfolio review'
			});

			// Set the URL parameter
			$stateParams.portfolioReviewId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-reviews\/([0-9a-fA-F]{24})$/).respond(samplePortfolioReview);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioReview).toEqualData(samplePortfolioReview);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioReviews) {
			// Create a sample Portfolio review object
			var samplePortfolioReviewPostData = new PortfolioReviews({
				name: 'New Portfolio review'
			});

			// Create a sample Portfolio review response
			var samplePortfolioReviewResponse = new PortfolioReviews({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio review'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio review';

			// Set POST response
			$httpBackend.expectPOST('portfolio-reviews', samplePortfolioReviewPostData).respond(samplePortfolioReviewResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio review was created
			expect($location.path()).toBe('/portfolio-reviews/' + samplePortfolioReviewResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio review', inject(function(PortfolioReviews) {
			// Define a sample Portfolio review put data
			var samplePortfolioReviewPutData = new PortfolioReviews({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio review'
			});

			// Mock Portfolio review in scope
			scope.portfolioReview = samplePortfolioReviewPutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-reviews\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-reviews/' + samplePortfolioReviewPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioReviewId and remove the Portfolio review from the scope', inject(function(PortfolioReviews) {
			// Create new Portfolio review object
			var samplePortfolioReview = new PortfolioReviews({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio reviews array and include the Portfolio review
			scope.portfolioReviews = [samplePortfolioReview];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-reviews\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioReview);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioReviews.length).toBe(0);
		}));
	});
}());
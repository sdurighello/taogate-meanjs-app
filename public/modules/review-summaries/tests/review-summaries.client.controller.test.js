'use strict';

(function() {
	// Review summaries Controller Spec
	describe('Review summaries Controller Tests', function() {
		// Initialize global variables
		var ReviewSummariesController,
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

			// Initialize the Review summaries controller.
			ReviewSummariesController = $controller('ReviewSummariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Review summary object fetched from XHR', inject(function(ReviewSummaries) {
			// Create sample Review summary using the Review summaries service
			var sampleReviewSummary = new ReviewSummaries({
				name: 'New Review summary'
			});

			// Create a sample Review summaries array that includes the new Review summary
			var sampleReviewSummaries = [sampleReviewSummary];

			// Set GET response
			$httpBackend.expectGET('review-summaries').respond(sampleReviewSummaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reviewSummaries).toEqualData(sampleReviewSummaries);
		}));

		it('$scope.findOne() should create an array with one Review summary object fetched from XHR using a reviewSummaryId URL parameter', inject(function(ReviewSummaries) {
			// Define a sample Review summary object
			var sampleReviewSummary = new ReviewSummaries({
				name: 'New Review summary'
			});

			// Set the URL parameter
			$stateParams.reviewSummaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/review-summaries\/([0-9a-fA-F]{24})$/).respond(sampleReviewSummary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.reviewSummary).toEqualData(sampleReviewSummary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ReviewSummaries) {
			// Create a sample Review summary object
			var sampleReviewSummaryPostData = new ReviewSummaries({
				name: 'New Review summary'
			});

			// Create a sample Review summary response
			var sampleReviewSummaryResponse = new ReviewSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Review summary'
			});

			// Fixture mock form input values
			scope.name = 'New Review summary';

			// Set POST response
			$httpBackend.expectPOST('review-summaries', sampleReviewSummaryPostData).respond(sampleReviewSummaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Review summary was created
			expect($location.path()).toBe('/review-summaries/' + sampleReviewSummaryResponse._id);
		}));

		it('$scope.update() should update a valid Review summary', inject(function(ReviewSummaries) {
			// Define a sample Review summary put data
			var sampleReviewSummaryPutData = new ReviewSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Review summary'
			});

			// Mock Review summary in scope
			scope.reviewSummary = sampleReviewSummaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/review-summaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/review-summaries/' + sampleReviewSummaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid reviewSummaryId and remove the Review summary from the scope', inject(function(ReviewSummaries) {
			// Create new Review summary object
			var sampleReviewSummary = new ReviewSummaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Review summaries array and include the Review summary
			scope.reviewSummaries = [sampleReviewSummary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/review-summaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleReviewSummary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.reviewSummaries.length).toBe(0);
		}));
	});
}());
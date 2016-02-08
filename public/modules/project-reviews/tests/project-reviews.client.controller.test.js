'use strict';

(function() {
	// Project reviews Controller Spec
	describe('Project reviews Controller Tests', function() {
		// Initialize global variables
		var ProjectReviewsController,
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

			// Initialize the Project reviews controller.
			ProjectReviewsController = $controller('ProjectReviewsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project review object fetched from XHR', inject(function(ProjectReviews) {
			// Create sample Project review using the Project reviews service
			var sampleProjectReview = new ProjectReviews({
				name: 'New Project review'
			});

			// Create a sample Project reviews array that includes the new Project review
			var sampleProjectReviews = [sampleProjectReview];

			// Set GET response
			$httpBackend.expectGET('project-reviews').respond(sampleProjectReviews);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectReviews).toEqualData(sampleProjectReviews);
		}));

		it('$scope.findOne() should create an array with one Project review object fetched from XHR using a projectReviewId URL parameter', inject(function(ProjectReviews) {
			// Define a sample Project review object
			var sampleProjectReview = new ProjectReviews({
				name: 'New Project review'
			});

			// Set the URL parameter
			$stateParams.projectReviewId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-reviews\/([0-9a-fA-F]{24})$/).respond(sampleProjectReview);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectReview).toEqualData(sampleProjectReview);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectReviews) {
			// Create a sample Project review object
			var sampleProjectReviewPostData = new ProjectReviews({
				name: 'New Project review'
			});

			// Create a sample Project review response
			var sampleProjectReviewResponse = new ProjectReviews({
				_id: '525cf20451979dea2c000001',
				name: 'New Project review'
			});

			// Fixture mock form input values
			scope.name = 'New Project review';

			// Set POST response
			$httpBackend.expectPOST('project-reviews', sampleProjectReviewPostData).respond(sampleProjectReviewResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project review was created
			expect($location.path()).toBe('/project-reviews/' + sampleProjectReviewResponse._id);
		}));

		it('$scope.update() should update a valid Project review', inject(function(ProjectReviews) {
			// Define a sample Project review put data
			var sampleProjectReviewPutData = new ProjectReviews({
				_id: '525cf20451979dea2c000001',
				name: 'New Project review'
			});

			// Mock Project review in scope
			scope.projectReview = sampleProjectReviewPutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-reviews\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-reviews/' + sampleProjectReviewPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectReviewId and remove the Project review from the scope', inject(function(ProjectReviews) {
			// Create new Project review object
			var sampleProjectReview = new ProjectReviews({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project reviews array and include the Project review
			scope.projectReviews = [sampleProjectReview];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-reviews\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectReview);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectReviews.length).toBe(0);
		}));
	});
}());
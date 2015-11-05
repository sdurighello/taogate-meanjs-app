'use strict';

(function() {
	// Risk categories Controller Spec
	describe('Risk categories Controller Tests', function() {
		// Initialize global variables
		var RiskCategoriesController,
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

			// Initialize the Risk categories controller.
			RiskCategoriesController = $controller('RiskCategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Risk category object fetched from XHR', inject(function(RiskCategories) {
			// Create sample Risk category using the Risk categories service
			var sampleRiskCategory = new RiskCategories({
				name: 'New Risk category'
			});

			// Create a sample Risk categories array that includes the new Risk category
			var sampleRiskCategories = [sampleRiskCategory];

			// Set GET response
			$httpBackend.expectGET('risk-categories').respond(sampleRiskCategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskCategories).toEqualData(sampleRiskCategories);
		}));

		it('$scope.findOne() should create an array with one Risk category object fetched from XHR using a riskCategoryId URL parameter', inject(function(RiskCategories) {
			// Define a sample Risk category object
			var sampleRiskCategory = new RiskCategories({
				name: 'New Risk category'
			});

			// Set the URL parameter
			$stateParams.riskCategoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/risk-categories\/([0-9a-fA-F]{24})$/).respond(sampleRiskCategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskCategory).toEqualData(sampleRiskCategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RiskCategories) {
			// Create a sample Risk category object
			var sampleRiskCategoryPostData = new RiskCategories({
				name: 'New Risk category'
			});

			// Create a sample Risk category response
			var sampleRiskCategoryResponse = new RiskCategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk category'
			});

			// Fixture mock form input values
			scope.name = 'New Risk category';

			// Set POST response
			$httpBackend.expectPOST('risk-categories', sampleRiskCategoryPostData).respond(sampleRiskCategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Risk category was created
			expect($location.path()).toBe('/risk-categories/' + sampleRiskCategoryResponse._id);
		}));

		it('$scope.update() should update a valid Risk category', inject(function(RiskCategories) {
			// Define a sample Risk category put data
			var sampleRiskCategoryPutData = new RiskCategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk category'
			});

			// Mock Risk category in scope
			scope.riskCategory = sampleRiskCategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/risk-categories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/risk-categories/' + sampleRiskCategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid riskCategoryId and remove the Risk category from the scope', inject(function(RiskCategories) {
			// Create new Risk category object
			var sampleRiskCategory = new RiskCategories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Risk categories array and include the Risk category
			scope.riskCategories = [sampleRiskCategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/risk-categories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRiskCategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.riskCategories.length).toBe(0);
		}));
	});
}());
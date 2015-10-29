'use strict';

(function() {
	// Category values Controller Spec
	describe('Category values Controller Tests', function() {
		// Initialize global variables
		var CategoryValuesController,
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

			// Initialize the Category values controller.
			CategoryValuesController = $controller('CategoryValuesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Category value object fetched from XHR', inject(function(CategoryValues) {
			// Create sample Category value using the Category values service
			var sampleCategoryValue = new CategoryValues({
				name: 'New Category value'
			});

			// Create a sample Category values array that includes the new Category value
			var sampleCategoryValues = [sampleCategoryValue];

			// Set GET response
			$httpBackend.expectGET('category-values').respond(sampleCategoryValues);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categoryValues).toEqualData(sampleCategoryValues);
		}));

		it('$scope.findOne() should create an array with one Category value object fetched from XHR using a categoryValueId URL parameter', inject(function(CategoryValues) {
			// Define a sample Category value object
			var sampleCategoryValue = new CategoryValues({
				name: 'New Category value'
			});

			// Set the URL parameter
			$stateParams.categoryValueId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/category-values\/([0-9a-fA-F]{24})$/).respond(sampleCategoryValue);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categoryValue).toEqualData(sampleCategoryValue);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CategoryValues) {
			// Create a sample Category value object
			var sampleCategoryValuePostData = new CategoryValues({
				name: 'New Category value'
			});

			// Create a sample Category value response
			var sampleCategoryValueResponse = new CategoryValues({
				_id: '525cf20451979dea2c000001',
				name: 'New Category value'
			});

			// Fixture mock form input values
			scope.name = 'New Category value';

			// Set POST response
			$httpBackend.expectPOST('category-values', sampleCategoryValuePostData).respond(sampleCategoryValueResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Category value was created
			expect($location.path()).toBe('/category-values/' + sampleCategoryValueResponse._id);
		}));

		it('$scope.update() should update a valid Category value', inject(function(CategoryValues) {
			// Define a sample Category value put data
			var sampleCategoryValuePutData = new CategoryValues({
				_id: '525cf20451979dea2c000001',
				name: 'New Category value'
			});

			// Mock Category value in scope
			scope.categoryValue = sampleCategoryValuePutData;

			// Set PUT response
			$httpBackend.expectPUT(/category-values\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/category-values/' + sampleCategoryValuePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid categoryValueId and remove the Category value from the scope', inject(function(CategoryValues) {
			// Create new Category value object
			var sampleCategoryValue = new CategoryValues({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Category values array and include the Category value
			scope.categoryValues = [sampleCategoryValue];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/category-values\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCategoryValue);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.categoryValues.length).toBe(0);
		}));
	});
}());
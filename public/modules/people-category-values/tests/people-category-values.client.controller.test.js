'use strict';

(function() {
	// People category values Controller Spec
	describe('People category values Controller Tests', function() {
		// Initialize global variables
		var PeopleCategoryValuesController,
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

			// Initialize the People category values controller.
			PeopleCategoryValuesController = $controller('PeopleCategoryValuesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People category value object fetched from XHR', inject(function(PeopleCategoryValues) {
			// Create sample People category value using the People category values service
			var samplePeopleCategoryValue = new PeopleCategoryValues({
				name: 'New People category value'
			});

			// Create a sample People category values array that includes the new People category value
			var samplePeopleCategoryValues = [samplePeopleCategoryValue];

			// Set GET response
			$httpBackend.expectGET('people-category-values').respond(samplePeopleCategoryValues);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleCategoryValues).toEqualData(samplePeopleCategoryValues);
		}));

		it('$scope.findOne() should create an array with one People category value object fetched from XHR using a peopleCategoryValueId URL parameter', inject(function(PeopleCategoryValues) {
			// Define a sample People category value object
			var samplePeopleCategoryValue = new PeopleCategoryValues({
				name: 'New People category value'
			});

			// Set the URL parameter
			$stateParams.peopleCategoryValueId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-category-values\/([0-9a-fA-F]{24})$/).respond(samplePeopleCategoryValue);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleCategoryValue).toEqualData(samplePeopleCategoryValue);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeopleCategoryValues) {
			// Create a sample People category value object
			var samplePeopleCategoryValuePostData = new PeopleCategoryValues({
				name: 'New People category value'
			});

			// Create a sample People category value response
			var samplePeopleCategoryValueResponse = new PeopleCategoryValues({
				_id: '525cf20451979dea2c000001',
				name: 'New People category value'
			});

			// Fixture mock form input values
			scope.name = 'New People category value';

			// Set POST response
			$httpBackend.expectPOST('people-category-values', samplePeopleCategoryValuePostData).respond(samplePeopleCategoryValueResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People category value was created
			expect($location.path()).toBe('/people-category-values/' + samplePeopleCategoryValueResponse._id);
		}));

		it('$scope.update() should update a valid People category value', inject(function(PeopleCategoryValues) {
			// Define a sample People category value put data
			var samplePeopleCategoryValuePutData = new PeopleCategoryValues({
				_id: '525cf20451979dea2c000001',
				name: 'New People category value'
			});

			// Mock People category value in scope
			scope.peopleCategoryValue = samplePeopleCategoryValuePutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-category-values\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-category-values/' + samplePeopleCategoryValuePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peopleCategoryValueId and remove the People category value from the scope', inject(function(PeopleCategoryValues) {
			// Create new People category value object
			var samplePeopleCategoryValue = new PeopleCategoryValues({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People category values array and include the People category value
			scope.peopleCategoryValues = [samplePeopleCategoryValue];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-category-values\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeopleCategoryValue);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peopleCategoryValues.length).toBe(0);
		}));
	});
}());
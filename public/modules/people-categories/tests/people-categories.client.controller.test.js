'use strict';

(function() {
	// People categories Controller Spec
	describe('People categories Controller Tests', function() {
		// Initialize global variables
		var PeopleCategoriesController,
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

			// Initialize the People categories controller.
			PeopleCategoriesController = $controller('PeopleCategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People category object fetched from XHR', inject(function(PeopleCategories) {
			// Create sample People category using the People categories service
			var samplePeopleCategory = new PeopleCategories({
				name: 'New People category'
			});

			// Create a sample People categories array that includes the new People category
			var samplePeopleCategories = [samplePeopleCategory];

			// Set GET response
			$httpBackend.expectGET('people-categories').respond(samplePeopleCategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleCategories).toEqualData(samplePeopleCategories);
		}));

		it('$scope.findOne() should create an array with one People category object fetched from XHR using a peopleCategoryId URL parameter', inject(function(PeopleCategories) {
			// Define a sample People category object
			var samplePeopleCategory = new PeopleCategories({
				name: 'New People category'
			});

			// Set the URL parameter
			$stateParams.peopleCategoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-categories\/([0-9a-fA-F]{24})$/).respond(samplePeopleCategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleCategory).toEqualData(samplePeopleCategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeopleCategories) {
			// Create a sample People category object
			var samplePeopleCategoryPostData = new PeopleCategories({
				name: 'New People category'
			});

			// Create a sample People category response
			var samplePeopleCategoryResponse = new PeopleCategories({
				_id: '525cf20451979dea2c000001',
				name: 'New People category'
			});

			// Fixture mock form input values
			scope.name = 'New People category';

			// Set POST response
			$httpBackend.expectPOST('people-categories', samplePeopleCategoryPostData).respond(samplePeopleCategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People category was created
			expect($location.path()).toBe('/people-categories/' + samplePeopleCategoryResponse._id);
		}));

		it('$scope.update() should update a valid People category', inject(function(PeopleCategories) {
			// Define a sample People category put data
			var samplePeopleCategoryPutData = new PeopleCategories({
				_id: '525cf20451979dea2c000001',
				name: 'New People category'
			});

			// Mock People category in scope
			scope.peopleCategory = samplePeopleCategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-categories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-categories/' + samplePeopleCategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peopleCategoryId and remove the People category from the scope', inject(function(PeopleCategories) {
			// Create new People category object
			var samplePeopleCategory = new PeopleCategories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People categories array and include the People category
			scope.peopleCategories = [samplePeopleCategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-categories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeopleCategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peopleCategories.length).toBe(0);
		}));
	});
}());
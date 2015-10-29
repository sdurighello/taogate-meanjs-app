'use strict';

(function() {
	// Category groups Controller Spec
	describe('Category groups Controller Tests', function() {
		// Initialize global variables
		var CategoryGroupsController,
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

			// Initialize the Category groups controller.
			CategoryGroupsController = $controller('CategoryGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Category group object fetched from XHR', inject(function(CategoryGroups) {
			// Create sample Category group using the Category groups service
			var sampleCategoryGroup = new CategoryGroups({
				name: 'New Category group'
			});

			// Create a sample Category groups array that includes the new Category group
			var sampleCategoryGroups = [sampleCategoryGroup];

			// Set GET response
			$httpBackend.expectGET('category-groups').respond(sampleCategoryGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categoryGroups).toEqualData(sampleCategoryGroups);
		}));

		it('$scope.findOne() should create an array with one Category group object fetched from XHR using a categoryGroupId URL parameter', inject(function(CategoryGroups) {
			// Define a sample Category group object
			var sampleCategoryGroup = new CategoryGroups({
				name: 'New Category group'
			});

			// Set the URL parameter
			$stateParams.categoryGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/category-groups\/([0-9a-fA-F]{24})$/).respond(sampleCategoryGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categoryGroup).toEqualData(sampleCategoryGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(CategoryGroups) {
			// Create a sample Category group object
			var sampleCategoryGroupPostData = new CategoryGroups({
				name: 'New Category group'
			});

			// Create a sample Category group response
			var sampleCategoryGroupResponse = new CategoryGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Category group'
			});

			// Fixture mock form input values
			scope.name = 'New Category group';

			// Set POST response
			$httpBackend.expectPOST('category-groups', sampleCategoryGroupPostData).respond(sampleCategoryGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Category group was created
			expect($location.path()).toBe('/category-groups/' + sampleCategoryGroupResponse._id);
		}));

		it('$scope.update() should update a valid Category group', inject(function(CategoryGroups) {
			// Define a sample Category group put data
			var sampleCategoryGroupPutData = new CategoryGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Category group'
			});

			// Mock Category group in scope
			scope.categoryGroup = sampleCategoryGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/category-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/category-groups/' + sampleCategoryGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid categoryGroupId and remove the Category group from the scope', inject(function(CategoryGroups) {
			// Create new Category group object
			var sampleCategoryGroup = new CategoryGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Category groups array and include the Category group
			scope.categoryGroups = [sampleCategoryGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/category-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCategoryGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.categoryGroups.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// People groups Controller Spec
	describe('People groups Controller Tests', function() {
		// Initialize global variables
		var PeopleGroupsController,
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

			// Initialize the People groups controller.
			PeopleGroupsController = $controller('PeopleGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People group object fetched from XHR', inject(function(PeopleGroups) {
			// Create sample People group using the People groups service
			var samplePeopleGroup = new PeopleGroups({
				name: 'New People group'
			});

			// Create a sample People groups array that includes the new People group
			var samplePeopleGroups = [samplePeopleGroup];

			// Set GET response
			$httpBackend.expectGET('people-groups').respond(samplePeopleGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleGroups).toEqualData(samplePeopleGroups);
		}));

		it('$scope.findOne() should create an array with one People group object fetched from XHR using a peopleGroupId URL parameter', inject(function(PeopleGroups) {
			// Define a sample People group object
			var samplePeopleGroup = new PeopleGroups({
				name: 'New People group'
			});

			// Set the URL parameter
			$stateParams.peopleGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-groups\/([0-9a-fA-F]{24})$/).respond(samplePeopleGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleGroup).toEqualData(samplePeopleGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeopleGroups) {
			// Create a sample People group object
			var samplePeopleGroupPostData = new PeopleGroups({
				name: 'New People group'
			});

			// Create a sample People group response
			var samplePeopleGroupResponse = new PeopleGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New People group'
			});

			// Fixture mock form input values
			scope.name = 'New People group';

			// Set POST response
			$httpBackend.expectPOST('people-groups', samplePeopleGroupPostData).respond(samplePeopleGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People group was created
			expect($location.path()).toBe('/people-groups/' + samplePeopleGroupResponse._id);
		}));

		it('$scope.update() should update a valid People group', inject(function(PeopleGroups) {
			// Define a sample People group put data
			var samplePeopleGroupPutData = new PeopleGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New People group'
			});

			// Mock People group in scope
			scope.peopleGroup = samplePeopleGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-groups/' + samplePeopleGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peopleGroupId and remove the People group from the scope', inject(function(PeopleGroups) {
			// Create new People group object
			var samplePeopleGroup = new PeopleGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People groups array and include the People group
			scope.peopleGroups = [samplePeopleGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeopleGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peopleGroups.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// People project groups Controller Spec
	describe('People project groups Controller Tests', function() {
		// Initialize global variables
		var PeopleProjectGroupsController,
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

			// Initialize the People project groups controller.
			PeopleProjectGroupsController = $controller('PeopleProjectGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People project group object fetched from XHR', inject(function(PeopleProjectGroups) {
			// Create sample People project group using the People project groups service
			var samplePeopleProjectGroup = new PeopleProjectGroups({
				name: 'New People project group'
			});

			// Create a sample People project groups array that includes the new People project group
			var samplePeopleProjectGroups = [samplePeopleProjectGroup];

			// Set GET response
			$httpBackend.expectGET('people-project-groups').respond(samplePeopleProjectGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleProjectGroups).toEqualData(samplePeopleProjectGroups);
		}));

		it('$scope.findOne() should create an array with one People project group object fetched from XHR using a peopleProjectGroupId URL parameter', inject(function(PeopleProjectGroups) {
			// Define a sample People project group object
			var samplePeopleProjectGroup = new PeopleProjectGroups({
				name: 'New People project group'
			});

			// Set the URL parameter
			$stateParams.peopleProjectGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-project-groups\/([0-9a-fA-F]{24})$/).respond(samplePeopleProjectGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleProjectGroup).toEqualData(samplePeopleProjectGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeopleProjectGroups) {
			// Create a sample People project group object
			var samplePeopleProjectGroupPostData = new PeopleProjectGroups({
				name: 'New People project group'
			});

			// Create a sample People project group response
			var samplePeopleProjectGroupResponse = new PeopleProjectGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New People project group'
			});

			// Fixture mock form input values
			scope.name = 'New People project group';

			// Set POST response
			$httpBackend.expectPOST('people-project-groups', samplePeopleProjectGroupPostData).respond(samplePeopleProjectGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People project group was created
			expect($location.path()).toBe('/people-project-groups/' + samplePeopleProjectGroupResponse._id);
		}));

		it('$scope.update() should update a valid People project group', inject(function(PeopleProjectGroups) {
			// Define a sample People project group put data
			var samplePeopleProjectGroupPutData = new PeopleProjectGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New People project group'
			});

			// Mock People project group in scope
			scope.peopleProjectGroup = samplePeopleProjectGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-project-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-project-groups/' + samplePeopleProjectGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peopleProjectGroupId and remove the People project group from the scope', inject(function(PeopleProjectGroups) {
			// Create new People project group object
			var samplePeopleProjectGroup = new PeopleProjectGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People project groups array and include the People project group
			scope.peopleProjectGroups = [samplePeopleProjectGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-project-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeopleProjectGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peopleProjectGroups.length).toBe(0);
		}));
	});
}());
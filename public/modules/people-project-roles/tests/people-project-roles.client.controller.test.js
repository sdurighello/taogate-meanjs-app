'use strict';

(function() {
	// People project roles Controller Spec
	describe('People project roles Controller Tests', function() {
		// Initialize global variables
		var PeopleProjectRolesController,
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

			// Initialize the People project roles controller.
			PeopleProjectRolesController = $controller('PeopleProjectRolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People project role object fetched from XHR', inject(function(PeopleProjectRoles) {
			// Create sample People project role using the People project roles service
			var samplePeopleProjectRole = new PeopleProjectRoles({
				name: 'New People project role'
			});

			// Create a sample People project roles array that includes the new People project role
			var samplePeopleProjectRoles = [samplePeopleProjectRole];

			// Set GET response
			$httpBackend.expectGET('people-project-roles').respond(samplePeopleProjectRoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleProjectRoles).toEqualData(samplePeopleProjectRoles);
		}));

		it('$scope.findOne() should create an array with one People project role object fetched from XHR using a peopleProjectRoleId URL parameter', inject(function(PeopleProjectRoles) {
			// Define a sample People project role object
			var samplePeopleProjectRole = new PeopleProjectRoles({
				name: 'New People project role'
			});

			// Set the URL parameter
			$stateParams.peopleProjectRoleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-project-roles\/([0-9a-fA-F]{24})$/).respond(samplePeopleProjectRole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleProjectRole).toEqualData(samplePeopleProjectRole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeopleProjectRoles) {
			// Create a sample People project role object
			var samplePeopleProjectRolePostData = new PeopleProjectRoles({
				name: 'New People project role'
			});

			// Create a sample People project role response
			var samplePeopleProjectRoleResponse = new PeopleProjectRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New People project role'
			});

			// Fixture mock form input values
			scope.name = 'New People project role';

			// Set POST response
			$httpBackend.expectPOST('people-project-roles', samplePeopleProjectRolePostData).respond(samplePeopleProjectRoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People project role was created
			expect($location.path()).toBe('/people-project-roles/' + samplePeopleProjectRoleResponse._id);
		}));

		it('$scope.update() should update a valid People project role', inject(function(PeopleProjectRoles) {
			// Define a sample People project role put data
			var samplePeopleProjectRolePutData = new PeopleProjectRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New People project role'
			});

			// Mock People project role in scope
			scope.peopleProjectRole = samplePeopleProjectRolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-project-roles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-project-roles/' + samplePeopleProjectRolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peopleProjectRoleId and remove the People project role from the scope', inject(function(PeopleProjectRoles) {
			// Create new People project role object
			var samplePeopleProjectRole = new PeopleProjectRoles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People project roles array and include the People project role
			scope.peopleProjectRoles = [samplePeopleProjectRole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-project-roles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeopleProjectRole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peopleProjectRoles.length).toBe(0);
		}));
	});
}());
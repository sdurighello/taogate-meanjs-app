'use strict';

(function() {
	// People roles Controller Spec
	describe('People roles Controller Tests', function() {
		// Initialize global variables
		var PeopleRolesController,
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

			// Initialize the People roles controller.
			PeopleRolesController = $controller('PeopleRolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People role object fetched from XHR', inject(function(PeopleRoles) {
			// Create sample People role using the People roles service
			var samplePeopleRole = new PeopleRoles({
				name: 'New People role'
			});

			// Create a sample People roles array that includes the new People role
			var samplePeopleRoles = [samplePeopleRole];

			// Set GET response
			$httpBackend.expectGET('people-roles').respond(samplePeopleRoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleRoles).toEqualData(samplePeopleRoles);
		}));

		it('$scope.findOne() should create an array with one People role object fetched from XHR using a peopleRoleId URL parameter', inject(function(PeopleRoles) {
			// Define a sample People role object
			var samplePeopleRole = new PeopleRoles({
				name: 'New People role'
			});

			// Set the URL parameter
			$stateParams.peopleRoleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-roles\/([0-9a-fA-F]{24})$/).respond(samplePeopleRole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peopleRole).toEqualData(samplePeopleRole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeopleRoles) {
			// Create a sample People role object
			var samplePeopleRolePostData = new PeopleRoles({
				name: 'New People role'
			});

			// Create a sample People role response
			var samplePeopleRoleResponse = new PeopleRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New People role'
			});

			// Fixture mock form input values
			scope.name = 'New People role';

			// Set POST response
			$httpBackend.expectPOST('people-roles', samplePeopleRolePostData).respond(samplePeopleRoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People role was created
			expect($location.path()).toBe('/people-roles/' + samplePeopleRoleResponse._id);
		}));

		it('$scope.update() should update a valid People role', inject(function(PeopleRoles) {
			// Define a sample People role put data
			var samplePeopleRolePutData = new PeopleRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New People role'
			});

			// Mock People role in scope
			scope.peopleRole = samplePeopleRolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-roles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-roles/' + samplePeopleRolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peopleRoleId and remove the People role from the scope', inject(function(PeopleRoles) {
			// Create new People role object
			var samplePeopleRole = new PeopleRoles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People roles array and include the People role
			scope.peopleRoles = [samplePeopleRole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-roles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeopleRole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peopleRoles.length).toBe(0);
		}));
	});
}());
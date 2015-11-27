'use strict';

(function() {
	// People portfolio roles Controller Spec
	describe('People portfolio roles Controller Tests', function() {
		// Initialize global variables
		var PeoplePortfolioRolesController,
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

			// Initialize the People portfolio roles controller.
			PeoplePortfolioRolesController = $controller('PeoplePortfolioRolesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People portfolio role object fetched from XHR', inject(function(PeoplePortfolioRoles) {
			// Create sample People portfolio role using the People portfolio roles service
			var samplePeoplePortfolioRole = new PeoplePortfolioRoles({
				name: 'New People portfolio role'
			});

			// Create a sample People portfolio roles array that includes the new People portfolio role
			var samplePeoplePortfolioRoles = [samplePeoplePortfolioRole];

			// Set GET response
			$httpBackend.expectGET('people-portfolio-roles').respond(samplePeoplePortfolioRoles);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peoplePortfolioRoles).toEqualData(samplePeoplePortfolioRoles);
		}));

		it('$scope.findOne() should create an array with one People portfolio role object fetched from XHR using a peoplePortfolioRoleId URL parameter', inject(function(PeoplePortfolioRoles) {
			// Define a sample People portfolio role object
			var samplePeoplePortfolioRole = new PeoplePortfolioRoles({
				name: 'New People portfolio role'
			});

			// Set the URL parameter
			$stateParams.peoplePortfolioRoleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-portfolio-roles\/([0-9a-fA-F]{24})$/).respond(samplePeoplePortfolioRole);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peoplePortfolioRole).toEqualData(samplePeoplePortfolioRole);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeoplePortfolioRoles) {
			// Create a sample People portfolio role object
			var samplePeoplePortfolioRolePostData = new PeoplePortfolioRoles({
				name: 'New People portfolio role'
			});

			// Create a sample People portfolio role response
			var samplePeoplePortfolioRoleResponse = new PeoplePortfolioRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New People portfolio role'
			});

			// Fixture mock form input values
			scope.name = 'New People portfolio role';

			// Set POST response
			$httpBackend.expectPOST('people-portfolio-roles', samplePeoplePortfolioRolePostData).respond(samplePeoplePortfolioRoleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People portfolio role was created
			expect($location.path()).toBe('/people-portfolio-roles/' + samplePeoplePortfolioRoleResponse._id);
		}));

		it('$scope.update() should update a valid People portfolio role', inject(function(PeoplePortfolioRoles) {
			// Define a sample People portfolio role put data
			var samplePeoplePortfolioRolePutData = new PeoplePortfolioRoles({
				_id: '525cf20451979dea2c000001',
				name: 'New People portfolio role'
			});

			// Mock People portfolio role in scope
			scope.peoplePortfolioRole = samplePeoplePortfolioRolePutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-portfolio-roles\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-portfolio-roles/' + samplePeoplePortfolioRolePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peoplePortfolioRoleId and remove the People portfolio role from the scope', inject(function(PeoplePortfolioRoles) {
			// Create new People portfolio role object
			var samplePeoplePortfolioRole = new PeoplePortfolioRoles({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People portfolio roles array and include the People portfolio role
			scope.peoplePortfolioRoles = [samplePeoplePortfolioRole];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-portfolio-roles\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeoplePortfolioRole);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peoplePortfolioRoles.length).toBe(0);
		}));
	});
}());
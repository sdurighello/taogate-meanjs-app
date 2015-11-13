'use strict';

(function() {
	// People portfolio groups Controller Spec
	describe('People portfolio groups Controller Tests', function() {
		// Initialize global variables
		var PeoplePortfolioGroupsController,
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

			// Initialize the People portfolio groups controller.
			PeoplePortfolioGroupsController = $controller('PeoplePortfolioGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one People portfolio group object fetched from XHR', inject(function(PeoplePortfolioGroups) {
			// Create sample People portfolio group using the People portfolio groups service
			var samplePeoplePortfolioGroup = new PeoplePortfolioGroups({
				name: 'New People portfolio group'
			});

			// Create a sample People portfolio groups array that includes the new People portfolio group
			var samplePeoplePortfolioGroups = [samplePeoplePortfolioGroup];

			// Set GET response
			$httpBackend.expectGET('people-portfolio-groups').respond(samplePeoplePortfolioGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peoplePortfolioGroups).toEqualData(samplePeoplePortfolioGroups);
		}));

		it('$scope.findOne() should create an array with one People portfolio group object fetched from XHR using a peoplePortfolioGroupId URL parameter', inject(function(PeoplePortfolioGroups) {
			// Define a sample People portfolio group object
			var samplePeoplePortfolioGroup = new PeoplePortfolioGroups({
				name: 'New People portfolio group'
			});

			// Set the URL parameter
			$stateParams.peoplePortfolioGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/people-portfolio-groups\/([0-9a-fA-F]{24})$/).respond(samplePeoplePortfolioGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.peoplePortfolioGroup).toEqualData(samplePeoplePortfolioGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PeoplePortfolioGroups) {
			// Create a sample People portfolio group object
			var samplePeoplePortfolioGroupPostData = new PeoplePortfolioGroups({
				name: 'New People portfolio group'
			});

			// Create a sample People portfolio group response
			var samplePeoplePortfolioGroupResponse = new PeoplePortfolioGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New People portfolio group'
			});

			// Fixture mock form input values
			scope.name = 'New People portfolio group';

			// Set POST response
			$httpBackend.expectPOST('people-portfolio-groups', samplePeoplePortfolioGroupPostData).respond(samplePeoplePortfolioGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the People portfolio group was created
			expect($location.path()).toBe('/people-portfolio-groups/' + samplePeoplePortfolioGroupResponse._id);
		}));

		it('$scope.update() should update a valid People portfolio group', inject(function(PeoplePortfolioGroups) {
			// Define a sample People portfolio group put data
			var samplePeoplePortfolioGroupPutData = new PeoplePortfolioGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New People portfolio group'
			});

			// Mock People portfolio group in scope
			scope.peoplePortfolioGroup = samplePeoplePortfolioGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/people-portfolio-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/people-portfolio-groups/' + samplePeoplePortfolioGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid peoplePortfolioGroupId and remove the People portfolio group from the scope', inject(function(PeoplePortfolioGroups) {
			// Create new People portfolio group object
			var samplePeoplePortfolioGroup = new PeoplePortfolioGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new People portfolio groups array and include the People portfolio group
			scope.peoplePortfolioGroups = [samplePeoplePortfolioGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/people-portfolio-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePeoplePortfolioGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.peoplePortfolioGroups.length).toBe(0);
		}));
	});
}());
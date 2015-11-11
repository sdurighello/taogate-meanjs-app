'use strict';

(function() {
	// Project milestone types Controller Spec
	describe('Project milestone types Controller Tests', function() {
		// Initialize global variables
		var ProjectMilestoneTypesController,
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

			// Initialize the Project milestone types controller.
			ProjectMilestoneTypesController = $controller('ProjectMilestoneTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project milestone type object fetched from XHR', inject(function(ProjectMilestoneTypes) {
			// Create sample Project milestone type using the Project milestone types service
			var sampleProjectMilestoneType = new ProjectMilestoneTypes({
				name: 'New Project milestone type'
			});

			// Create a sample Project milestone types array that includes the new Project milestone type
			var sampleProjectMilestoneTypes = [sampleProjectMilestoneType];

			// Set GET response
			$httpBackend.expectGET('project-milestone-types').respond(sampleProjectMilestoneTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectMilestoneTypes).toEqualData(sampleProjectMilestoneTypes);
		}));

		it('$scope.findOne() should create an array with one Project milestone type object fetched from XHR using a projectMilestoneTypeId URL parameter', inject(function(ProjectMilestoneTypes) {
			// Define a sample Project milestone type object
			var sampleProjectMilestoneType = new ProjectMilestoneTypes({
				name: 'New Project milestone type'
			});

			// Set the URL parameter
			$stateParams.projectMilestoneTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-milestone-types\/([0-9a-fA-F]{24})$/).respond(sampleProjectMilestoneType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectMilestoneType).toEqualData(sampleProjectMilestoneType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectMilestoneTypes) {
			// Create a sample Project milestone type object
			var sampleProjectMilestoneTypePostData = new ProjectMilestoneTypes({
				name: 'New Project milestone type'
			});

			// Create a sample Project milestone type response
			var sampleProjectMilestoneTypeResponse = new ProjectMilestoneTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Project milestone type'
			});

			// Fixture mock form input values
			scope.name = 'New Project milestone type';

			// Set POST response
			$httpBackend.expectPOST('project-milestone-types', sampleProjectMilestoneTypePostData).respond(sampleProjectMilestoneTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project milestone type was created
			expect($location.path()).toBe('/project-milestone-types/' + sampleProjectMilestoneTypeResponse._id);
		}));

		it('$scope.update() should update a valid Project milestone type', inject(function(ProjectMilestoneTypes) {
			// Define a sample Project milestone type put data
			var sampleProjectMilestoneTypePutData = new ProjectMilestoneTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Project milestone type'
			});

			// Mock Project milestone type in scope
			scope.projectMilestoneType = sampleProjectMilestoneTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-milestone-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-milestone-types/' + sampleProjectMilestoneTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectMilestoneTypeId and remove the Project milestone type from the scope', inject(function(ProjectMilestoneTypes) {
			// Create new Project milestone type object
			var sampleProjectMilestoneType = new ProjectMilestoneTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project milestone types array and include the Project milestone type
			scope.projectMilestoneTypes = [sampleProjectMilestoneType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-milestone-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectMilestoneType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectMilestoneTypes.length).toBe(0);
		}));
	});
}());
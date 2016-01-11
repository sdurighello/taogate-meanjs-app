'use strict';

(function() {
	// Project milestones Controller Spec
	describe('Project milestones Controller Tests', function() {
		// Initialize global variables
		var ProjectMilestonesController,
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

			// Initialize the Project milestones controller.
			ProjectMilestonesController = $controller('ProjectMilestonesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project milestone object fetched from XHR', inject(function(ProjectMilestones) {
			// Create sample Project milestone using the Project milestones service
			var sampleProjectMilestone = new ProjectMilestones({
				name: 'New Project milestone'
			});

			// Create a sample Project milestones array that includes the new Project milestone
			var sampleProjectMilestones = [sampleProjectMilestone];

			// Set GET response
			$httpBackend.expectGET('project-milestones').respond(sampleProjectMilestones);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectMilestones).toEqualData(sampleProjectMilestones);
		}));

		it('$scope.findOne() should create an array with one Project milestone object fetched from XHR using a projectMilestoneId URL parameter', inject(function(ProjectMilestones) {
			// Define a sample Project milestone object
			var sampleProjectMilestone = new ProjectMilestones({
				name: 'New Project milestone'
			});

			// Set the URL parameter
			$stateParams.projectMilestoneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-milestones\/([0-9a-fA-F]{24})$/).respond(sampleProjectMilestone);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectMilestone).toEqualData(sampleProjectMilestone);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectMilestones) {
			// Create a sample Project milestone object
			var sampleProjectMilestonePostData = new ProjectMilestones({
				name: 'New Project milestone'
			});

			// Create a sample Project milestone response
			var sampleProjectMilestoneResponse = new ProjectMilestones({
				_id: '525cf20451979dea2c000001',
				name: 'New Project milestone'
			});

			// Fixture mock form input values
			scope.name = 'New Project milestone';

			// Set POST response
			$httpBackend.expectPOST('project-milestones', sampleProjectMilestonePostData).respond(sampleProjectMilestoneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project milestone was created
			expect($location.path()).toBe('/project-milestones/' + sampleProjectMilestoneResponse._id);
		}));

		it('$scope.update() should update a valid Project milestone', inject(function(ProjectMilestones) {
			// Define a sample Project milestone put data
			var sampleProjectMilestonePutData = new ProjectMilestones({
				_id: '525cf20451979dea2c000001',
				name: 'New Project milestone'
			});

			// Mock Project milestone in scope
			scope.projectMilestone = sampleProjectMilestonePutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-milestones\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-milestones/' + sampleProjectMilestonePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectMilestoneId and remove the Project milestone from the scope', inject(function(ProjectMilestones) {
			// Create new Project milestone object
			var sampleProjectMilestone = new ProjectMilestones({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project milestones array and include the Project milestone
			scope.projectMilestones = [sampleProjectMilestone];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-milestones\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectMilestone);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectMilestones.length).toBe(0);
		}));
	});
}());
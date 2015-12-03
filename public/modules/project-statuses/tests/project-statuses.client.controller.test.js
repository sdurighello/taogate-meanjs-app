'use strict';

(function() {
	// Project statuses Controller Spec
	describe('Project statuses Controller Tests', function() {
		// Initialize global variables
		var ProjectStatusesController,
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

			// Initialize the Project statuses controller.
			ProjectStatusesController = $controller('ProjectStatusesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project status object fetched from XHR', inject(function(ProjectStatuses) {
			// Create sample Project status using the Project statuses service
			var sampleProjectStatus = new ProjectStatuses({
				name: 'New Project status'
			});

			// Create a sample Project statuses array that includes the new Project status
			var sampleProjectStatuses = [sampleProjectStatus];

			// Set GET response
			$httpBackend.expectGET('project-statuses').respond(sampleProjectStatuses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectStatuses).toEqualData(sampleProjectStatuses);
		}));

		it('$scope.findOne() should create an array with one Project status object fetched from XHR using a projectStatusId URL parameter', inject(function(ProjectStatuses) {
			// Define a sample Project status object
			var sampleProjectStatus = new ProjectStatuses({
				name: 'New Project status'
			});

			// Set the URL parameter
			$stateParams.projectStatusId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-statuses\/([0-9a-fA-F]{24})$/).respond(sampleProjectStatus);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectStatus).toEqualData(sampleProjectStatus);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectStatuses) {
			// Create a sample Project status object
			var sampleProjectStatusPostData = new ProjectStatuses({
				name: 'New Project status'
			});

			// Create a sample Project status response
			var sampleProjectStatusResponse = new ProjectStatuses({
				_id: '525cf20451979dea2c000001',
				name: 'New Project status'
			});

			// Fixture mock form input values
			scope.name = 'New Project status';

			// Set POST response
			$httpBackend.expectPOST('project-statuses', sampleProjectStatusPostData).respond(sampleProjectStatusResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project status was created
			expect($location.path()).toBe('/project-statuses/' + sampleProjectStatusResponse._id);
		}));

		it('$scope.update() should update a valid Project status', inject(function(ProjectStatuses) {
			// Define a sample Project status put data
			var sampleProjectStatusPutData = new ProjectStatuses({
				_id: '525cf20451979dea2c000001',
				name: 'New Project status'
			});

			// Mock Project status in scope
			scope.projectStatus = sampleProjectStatusPutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-statuses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-statuses/' + sampleProjectStatusPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectStatusId and remove the Project status from the scope', inject(function(ProjectStatuses) {
			// Create new Project status object
			var sampleProjectStatus = new ProjectStatuses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project statuses array and include the Project status
			scope.projectStatuses = [sampleProjectStatus];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-statuses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectStatus);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectStatuses.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Project change requests Controller Spec
	describe('Project change requests Controller Tests', function() {
		// Initialize global variables
		var ProjectChangeRequestsController,
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

			// Initialize the Project change requests controller.
			ProjectChangeRequestsController = $controller('ProjectChangeRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project change request object fetched from XHR', inject(function(ProjectChangeRequests) {
			// Create sample Project change request using the Project change requests service
			var sampleProjectChangeRequest = new ProjectChangeRequests({
				name: 'New Project change request'
			});

			// Create a sample Project change requests array that includes the new Project change request
			var sampleProjectChangeRequests = [sampleProjectChangeRequest];

			// Set GET response
			$httpBackend.expectGET('project-change-requests').respond(sampleProjectChangeRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectChangeRequests).toEqualData(sampleProjectChangeRequests);
		}));

		it('$scope.findOne() should create an array with one Project change request object fetched from XHR using a projectChangeRequestId URL parameter', inject(function(ProjectChangeRequests) {
			// Define a sample Project change request object
			var sampleProjectChangeRequest = new ProjectChangeRequests({
				name: 'New Project change request'
			});

			// Set the URL parameter
			$stateParams.projectChangeRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-change-requests\/([0-9a-fA-F]{24})$/).respond(sampleProjectChangeRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectChangeRequest).toEqualData(sampleProjectChangeRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectChangeRequests) {
			// Create a sample Project change request object
			var sampleProjectChangeRequestPostData = new ProjectChangeRequests({
				name: 'New Project change request'
			});

			// Create a sample Project change request response
			var sampleProjectChangeRequestResponse = new ProjectChangeRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Project change request'
			});

			// Fixture mock form input values
			scope.name = 'New Project change request';

			// Set POST response
			$httpBackend.expectPOST('project-change-requests', sampleProjectChangeRequestPostData).respond(sampleProjectChangeRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project change request was created
			expect($location.path()).toBe('/project-change-requests/' + sampleProjectChangeRequestResponse._id);
		}));

		it('$scope.update() should update a valid Project change request', inject(function(ProjectChangeRequests) {
			// Define a sample Project change request put data
			var sampleProjectChangeRequestPutData = new ProjectChangeRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New Project change request'
			});

			// Mock Project change request in scope
			scope.projectChangeRequest = sampleProjectChangeRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-change-requests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-change-requests/' + sampleProjectChangeRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectChangeRequestId and remove the Project change request from the scope', inject(function(ProjectChangeRequests) {
			// Create new Project change request object
			var sampleProjectChangeRequest = new ProjectChangeRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project change requests array and include the Project change request
			scope.projectChangeRequests = [sampleProjectChangeRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-change-requests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectChangeRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectChangeRequests.length).toBe(0);
		}));
	});
}());
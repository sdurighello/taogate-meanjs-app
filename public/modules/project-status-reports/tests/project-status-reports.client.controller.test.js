'use strict';

(function() {
	// Project status reports Controller Spec
	describe('Project status reports Controller Tests', function() {
		// Initialize global variables
		var ProjectStatusReportsController,
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

			// Initialize the Project status reports controller.
			ProjectStatusReportsController = $controller('ProjectStatusReportsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Project status report object fetched from XHR', inject(function(ProjectStatusReports) {
			// Create sample Project status report using the Project status reports service
			var sampleProjectStatusReport = new ProjectStatusReports({
				name: 'New Project status report'
			});

			// Create a sample Project status reports array that includes the new Project status report
			var sampleProjectStatusReports = [sampleProjectStatusReport];

			// Set GET response
			$httpBackend.expectGET('project-status-reports').respond(sampleProjectStatusReports);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectStatusReports).toEqualData(sampleProjectStatusReports);
		}));

		it('$scope.findOne() should create an array with one Project status report object fetched from XHR using a projectStatusReportId URL parameter', inject(function(ProjectStatusReports) {
			// Define a sample Project status report object
			var sampleProjectStatusReport = new ProjectStatusReports({
				name: 'New Project status report'
			});

			// Set the URL parameter
			$stateParams.projectStatusReportId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/project-status-reports\/([0-9a-fA-F]{24})$/).respond(sampleProjectStatusReport);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.projectStatusReport).toEqualData(sampleProjectStatusReport);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ProjectStatusReports) {
			// Create a sample Project status report object
			var sampleProjectStatusReportPostData = new ProjectStatusReports({
				name: 'New Project status report'
			});

			// Create a sample Project status report response
			var sampleProjectStatusReportResponse = new ProjectStatusReports({
				_id: '525cf20451979dea2c000001',
				name: 'New Project status report'
			});

			// Fixture mock form input values
			scope.name = 'New Project status report';

			// Set POST response
			$httpBackend.expectPOST('project-status-reports', sampleProjectStatusReportPostData).respond(sampleProjectStatusReportResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Project status report was created
			expect($location.path()).toBe('/project-status-reports/' + sampleProjectStatusReportResponse._id);
		}));

		it('$scope.update() should update a valid Project status report', inject(function(ProjectStatusReports) {
			// Define a sample Project status report put data
			var sampleProjectStatusReportPutData = new ProjectStatusReports({
				_id: '525cf20451979dea2c000001',
				name: 'New Project status report'
			});

			// Mock Project status report in scope
			scope.projectStatusReport = sampleProjectStatusReportPutData;

			// Set PUT response
			$httpBackend.expectPUT(/project-status-reports\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/project-status-reports/' + sampleProjectStatusReportPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid projectStatusReportId and remove the Project status report from the scope', inject(function(ProjectStatusReports) {
			// Create new Project status report object
			var sampleProjectStatusReport = new ProjectStatusReports({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Project status reports array and include the Project status report
			scope.projectStatusReports = [sampleProjectStatusReport];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/project-status-reports\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleProjectStatusReport);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.projectStatusReports.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Evaluation dashboards Controller Spec
	describe('Evaluation dashboards Controller Tests', function() {
		// Initialize global variables
		var EvaluationDashboardsController,
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

			// Initialize the Evaluation dashboards controller.
			EvaluationDashboardsController = $controller('EvaluationDashboardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Evaluation dashboard object fetched from XHR', inject(function(EvaluationDashboards) {
			// Create sample Evaluation dashboard using the Evaluation dashboards service
			var sampleEvaluationDashboard = new EvaluationDashboards({
				name: 'New Evaluation dashboard'
			});

			// Create a sample Evaluation dashboards array that includes the new Evaluation dashboard
			var sampleEvaluationDashboards = [sampleEvaluationDashboard];

			// Set GET response
			$httpBackend.expectGET('evaluation-dashboards').respond(sampleEvaluationDashboards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evaluationDashboards).toEqualData(sampleEvaluationDashboards);
		}));

		it('$scope.findOne() should create an array with one Evaluation dashboard object fetched from XHR using a evaluationDashboardId URL parameter', inject(function(EvaluationDashboards) {
			// Define a sample Evaluation dashboard object
			var sampleEvaluationDashboard = new EvaluationDashboards({
				name: 'New Evaluation dashboard'
			});

			// Set the URL parameter
			$stateParams.evaluationDashboardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/evaluation-dashboards\/([0-9a-fA-F]{24})$/).respond(sampleEvaluationDashboard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evaluationDashboard).toEqualData(sampleEvaluationDashboard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EvaluationDashboards) {
			// Create a sample Evaluation dashboard object
			var sampleEvaluationDashboardPostData = new EvaluationDashboards({
				name: 'New Evaluation dashboard'
			});

			// Create a sample Evaluation dashboard response
			var sampleEvaluationDashboardResponse = new EvaluationDashboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Evaluation dashboard'
			});

			// Fixture mock form input values
			scope.name = 'New Evaluation dashboard';

			// Set POST response
			$httpBackend.expectPOST('evaluation-dashboards', sampleEvaluationDashboardPostData).respond(sampleEvaluationDashboardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Evaluation dashboard was created
			expect($location.path()).toBe('/evaluation-dashboards/' + sampleEvaluationDashboardResponse._id);
		}));

		it('$scope.update() should update a valid Evaluation dashboard', inject(function(EvaluationDashboards) {
			// Define a sample Evaluation dashboard put data
			var sampleEvaluationDashboardPutData = new EvaluationDashboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Evaluation dashboard'
			});

			// Mock Evaluation dashboard in scope
			scope.evaluationDashboard = sampleEvaluationDashboardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/evaluation-dashboards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/evaluation-dashboards/' + sampleEvaluationDashboardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid evaluationDashboardId and remove the Evaluation dashboard from the scope', inject(function(EvaluationDashboards) {
			// Create new Evaluation dashboard object
			var sampleEvaluationDashboard = new EvaluationDashboards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Evaluation dashboards array and include the Evaluation dashboard
			scope.evaluationDashboards = [sampleEvaluationDashboard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/evaluation-dashboards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEvaluationDashboard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.evaluationDashboards.length).toBe(0);
		}));
	});
}());
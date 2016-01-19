'use strict';

(function() {
	// Definition dashboards Controller Spec
	describe('Definition dashboards Controller Tests', function() {
		// Initialize global variables
		var DefinitionDashboardsController,
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

			// Initialize the Definition dashboards controller.
			DefinitionDashboardsController = $controller('DefinitionDashboardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Definition dashboard object fetched from XHR', inject(function(DefinitionDashboards) {
			// Create sample Definition dashboard using the Definition dashboards service
			var sampleDefinitionDashboard = new DefinitionDashboards({
				name: 'New Definition dashboard'
			});

			// Create a sample Definition dashboards array that includes the new Definition dashboard
			var sampleDefinitionDashboards = [sampleDefinitionDashboard];

			// Set GET response
			$httpBackend.expectGET('definition-dashboards').respond(sampleDefinitionDashboards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.definitionDashboards).toEqualData(sampleDefinitionDashboards);
		}));

		it('$scope.findOne() should create an array with one Definition dashboard object fetched from XHR using a definitionDashboardId URL parameter', inject(function(DefinitionDashboards) {
			// Define a sample Definition dashboard object
			var sampleDefinitionDashboard = new DefinitionDashboards({
				name: 'New Definition dashboard'
			});

			// Set the URL parameter
			$stateParams.definitionDashboardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/definition-dashboards\/([0-9a-fA-F]{24})$/).respond(sampleDefinitionDashboard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.definitionDashboard).toEqualData(sampleDefinitionDashboard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(DefinitionDashboards) {
			// Create a sample Definition dashboard object
			var sampleDefinitionDashboardPostData = new DefinitionDashboards({
				name: 'New Definition dashboard'
			});

			// Create a sample Definition dashboard response
			var sampleDefinitionDashboardResponse = new DefinitionDashboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Definition dashboard'
			});

			// Fixture mock form input values
			scope.name = 'New Definition dashboard';

			// Set POST response
			$httpBackend.expectPOST('definition-dashboards', sampleDefinitionDashboardPostData).respond(sampleDefinitionDashboardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Definition dashboard was created
			expect($location.path()).toBe('/definition-dashboards/' + sampleDefinitionDashboardResponse._id);
		}));

		it('$scope.update() should update a valid Definition dashboard', inject(function(DefinitionDashboards) {
			// Define a sample Definition dashboard put data
			var sampleDefinitionDashboardPutData = new DefinitionDashboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Definition dashboard'
			});

			// Mock Definition dashboard in scope
			scope.definitionDashboard = sampleDefinitionDashboardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/definition-dashboards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/definition-dashboards/' + sampleDefinitionDashboardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid definitionDashboardId and remove the Definition dashboard from the scope', inject(function(DefinitionDashboards) {
			// Create new Definition dashboard object
			var sampleDefinitionDashboard = new DefinitionDashboards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Definition dashboards array and include the Definition dashboard
			scope.definitionDashboards = [sampleDefinitionDashboard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/definition-dashboards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDefinitionDashboard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.definitionDashboards.length).toBe(0);
		}));
	});
}());
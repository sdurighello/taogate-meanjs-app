'use strict';

(function() {
	// Delivery dashboards Controller Spec
	describe('Delivery dashboards Controller Tests', function() {
		// Initialize global variables
		var DeliveryDashboardsController,
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

			// Initialize the Delivery dashboards controller.
			DeliveryDashboardsController = $controller('DeliveryDashboardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Delivery dashboard object fetched from XHR', inject(function(DeliveryDashboards) {
			// Create sample Delivery dashboard using the Delivery dashboards service
			var sampleDeliveryDashboard = new DeliveryDashboards({
				name: 'New Delivery dashboard'
			});

			// Create a sample Delivery dashboards array that includes the new Delivery dashboard
			var sampleDeliveryDashboards = [sampleDeliveryDashboard];

			// Set GET response
			$httpBackend.expectGET('delivery-dashboards').respond(sampleDeliveryDashboards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.deliveryDashboards).toEqualData(sampleDeliveryDashboards);
		}));

		it('$scope.findOne() should create an array with one Delivery dashboard object fetched from XHR using a deliveryDashboardId URL parameter', inject(function(DeliveryDashboards) {
			// Define a sample Delivery dashboard object
			var sampleDeliveryDashboard = new DeliveryDashboards({
				name: 'New Delivery dashboard'
			});

			// Set the URL parameter
			$stateParams.deliveryDashboardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/delivery-dashboards\/([0-9a-fA-F]{24})$/).respond(sampleDeliveryDashboard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.deliveryDashboard).toEqualData(sampleDeliveryDashboard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(DeliveryDashboards) {
			// Create a sample Delivery dashboard object
			var sampleDeliveryDashboardPostData = new DeliveryDashboards({
				name: 'New Delivery dashboard'
			});

			// Create a sample Delivery dashboard response
			var sampleDeliveryDashboardResponse = new DeliveryDashboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Delivery dashboard'
			});

			// Fixture mock form input values
			scope.name = 'New Delivery dashboard';

			// Set POST response
			$httpBackend.expectPOST('delivery-dashboards', sampleDeliveryDashboardPostData).respond(sampleDeliveryDashboardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Delivery dashboard was created
			expect($location.path()).toBe('/delivery-dashboards/' + sampleDeliveryDashboardResponse._id);
		}));

		it('$scope.update() should update a valid Delivery dashboard', inject(function(DeliveryDashboards) {
			// Define a sample Delivery dashboard put data
			var sampleDeliveryDashboardPutData = new DeliveryDashboards({
				_id: '525cf20451979dea2c000001',
				name: 'New Delivery dashboard'
			});

			// Mock Delivery dashboard in scope
			scope.deliveryDashboard = sampleDeliveryDashboardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/delivery-dashboards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/delivery-dashboards/' + sampleDeliveryDashboardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid deliveryDashboardId and remove the Delivery dashboard from the scope', inject(function(DeliveryDashboards) {
			// Create new Delivery dashboard object
			var sampleDeliveryDashboard = new DeliveryDashboards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Delivery dashboards array and include the Delivery dashboard
			scope.deliveryDashboards = [sampleDeliveryDashboard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/delivery-dashboards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDeliveryDashboard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.deliveryDashboards.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Priority values Controller Spec
	describe('Priority values Controller Tests', function() {
		// Initialize global variables
		var PriorityValuesController,
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

			// Initialize the Priority values controller.
			PriorityValuesController = $controller('PriorityValuesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Priority value object fetched from XHR', inject(function(PriorityValues) {
			// Create sample Priority value using the Priority values service
			var samplePriorityValue = new PriorityValues({
				name: 'New Priority value'
			});

			// Create a sample Priority values array that includes the new Priority value
			var samplePriorityValues = [samplePriorityValue];

			// Set GET response
			$httpBackend.expectGET('priority-values').respond(samplePriorityValues);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorityValues).toEqualData(samplePriorityValues);
		}));

		it('$scope.findOne() should create an array with one Priority value object fetched from XHR using a priorityValueId URL parameter', inject(function(PriorityValues) {
			// Define a sample Priority value object
			var samplePriorityValue = new PriorityValues({
				name: 'New Priority value'
			});

			// Set the URL parameter
			$stateParams.priorityValueId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/priority-values\/([0-9a-fA-F]{24})$/).respond(samplePriorityValue);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorityValue).toEqualData(samplePriorityValue);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PriorityValues) {
			// Create a sample Priority value object
			var samplePriorityValuePostData = new PriorityValues({
				name: 'New Priority value'
			});

			// Create a sample Priority value response
			var samplePriorityValueResponse = new PriorityValues({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority value'
			});

			// Fixture mock form input values
			scope.name = 'New Priority value';

			// Set POST response
			$httpBackend.expectPOST('priority-values', samplePriorityValuePostData).respond(samplePriorityValueResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Priority value was created
			expect($location.path()).toBe('/priority-values/' + samplePriorityValueResponse._id);
		}));

		it('$scope.update() should update a valid Priority value', inject(function(PriorityValues) {
			// Define a sample Priority value put data
			var samplePriorityValuePutData = new PriorityValues({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority value'
			});

			// Mock Priority value in scope
			scope.priorityValue = samplePriorityValuePutData;

			// Set PUT response
			$httpBackend.expectPUT(/priority-values\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/priority-values/' + samplePriorityValuePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid priorityValueId and remove the Priority value from the scope', inject(function(PriorityValues) {
			// Create new Priority value object
			var samplePriorityValue = new PriorityValues({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Priority values array and include the Priority value
			scope.priorityValues = [samplePriorityValue];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/priority-values\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePriorityValue);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.priorityValues.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Priority types Controller Spec
	describe('Priority types Controller Tests', function() {
		// Initialize global variables
		var PriorityTypesController,
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

			// Initialize the Priority types controller.
			PriorityTypesController = $controller('PriorityTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Priority type object fetched from XHR', inject(function(PriorityTypes) {
			// Create sample Priority type using the Priority types service
			var samplePriorityType = new PriorityTypes({
				name: 'New Priority type'
			});

			// Create a sample Priority types array that includes the new Priority type
			var samplePriorityTypes = [samplePriorityType];

			// Set GET response
			$httpBackend.expectGET('priority-types').respond(samplePriorityTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorityTypes).toEqualData(samplePriorityTypes);
		}));

		it('$scope.findOne() should create an array with one Priority type object fetched from XHR using a priorityTypeId URL parameter', inject(function(PriorityTypes) {
			// Define a sample Priority type object
			var samplePriorityType = new PriorityTypes({
				name: 'New Priority type'
			});

			// Set the URL parameter
			$stateParams.priorityTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/priority-types\/([0-9a-fA-F]{24})$/).respond(samplePriorityType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorityType).toEqualData(samplePriorityType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PriorityTypes) {
			// Create a sample Priority type object
			var samplePriorityTypePostData = new PriorityTypes({
				name: 'New Priority type'
			});

			// Create a sample Priority type response
			var samplePriorityTypeResponse = new PriorityTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority type'
			});

			// Fixture mock form input values
			scope.name = 'New Priority type';

			// Set POST response
			$httpBackend.expectPOST('priority-types', samplePriorityTypePostData).respond(samplePriorityTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Priority type was created
			expect($location.path()).toBe('/priority-types/' + samplePriorityTypeResponse._id);
		}));

		it('$scope.update() should update a valid Priority type', inject(function(PriorityTypes) {
			// Define a sample Priority type put data
			var samplePriorityTypePutData = new PriorityTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority type'
			});

			// Mock Priority type in scope
			scope.priorityType = samplePriorityTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/priority-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/priority-types/' + samplePriorityTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid priorityTypeId and remove the Priority type from the scope', inject(function(PriorityTypes) {
			// Create new Priority type object
			var samplePriorityType = new PriorityTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Priority types array and include the Priority type
			scope.priorityTypes = [samplePriorityType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/priority-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePriorityType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.priorityTypes.length).toBe(0);
		}));
	});
}());
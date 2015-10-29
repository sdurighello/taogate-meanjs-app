'use strict';

(function() {
	// Priorities Controller Spec
	describe('Priorities Controller Tests', function() {
		// Initialize global variables
		var PrioritiesController,
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

			// Initialize the Priorities controller.
			PrioritiesController = $controller('PrioritiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Priority object fetched from XHR', inject(function(Priorities) {
			// Create sample Priority using the Priorities service
			var samplePriority = new Priorities({
				name: 'New Priority'
			});

			// Create a sample Priorities array that includes the new Priority
			var samplePriorities = [samplePriority];

			// Set GET response
			$httpBackend.expectGET('priorities').respond(samplePriorities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorities).toEqualData(samplePriorities);
		}));

		it('$scope.findOne() should create an array with one Priority object fetched from XHR using a priorityId URL parameter', inject(function(Priorities) {
			// Define a sample Priority object
			var samplePriority = new Priorities({
				name: 'New Priority'
			});

			// Set the URL parameter
			$stateParams.priorityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/priorities\/([0-9a-fA-F]{24})$/).respond(samplePriority);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priority).toEqualData(samplePriority);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Priorities) {
			// Create a sample Priority object
			var samplePriorityPostData = new Priorities({
				name: 'New Priority'
			});

			// Create a sample Priority response
			var samplePriorityResponse = new Priorities({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority'
			});

			// Fixture mock form input values
			scope.name = 'New Priority';

			// Set POST response
			$httpBackend.expectPOST('priorities', samplePriorityPostData).respond(samplePriorityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Priority was created
			expect($location.path()).toBe('/priorities/' + samplePriorityResponse._id);
		}));

		it('$scope.update() should update a valid Priority', inject(function(Priorities) {
			// Define a sample Priority put data
			var samplePriorityPutData = new Priorities({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority'
			});

			// Mock Priority in scope
			scope.priority = samplePriorityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/priorities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/priorities/' + samplePriorityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid priorityId and remove the Priority from the scope', inject(function(Priorities) {
			// Create new Priority object
			var samplePriority = new Priorities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Priorities array and include the Priority
			scope.priorities = [samplePriority];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/priorities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePriority);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.priorities.length).toBe(0);
		}));
	});
}());
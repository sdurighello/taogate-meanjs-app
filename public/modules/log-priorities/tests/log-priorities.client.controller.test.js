'use strict';

(function() {
	// Log priorities Controller Spec
	describe('Log priorities Controller Tests', function() {
		// Initialize global variables
		var LogPrioritiesController,
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

			// Initialize the Log priorities controller.
			LogPrioritiesController = $controller('LogPrioritiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Log priority object fetched from XHR', inject(function(LogPriorities) {
			// Create sample Log priority using the Log priorities service
			var sampleLogPriority = new LogPriorities({
				name: 'New Log priority'
			});

			// Create a sample Log priorities array that includes the new Log priority
			var sampleLogPriorities = [sampleLogPriority];

			// Set GET response
			$httpBackend.expectGET('log-priorities').respond(sampleLogPriorities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logPriorities).toEqualData(sampleLogPriorities);
		}));

		it('$scope.findOne() should create an array with one Log priority object fetched from XHR using a logPriorityId URL parameter', inject(function(LogPriorities) {
			// Define a sample Log priority object
			var sampleLogPriority = new LogPriorities({
				name: 'New Log priority'
			});

			// Set the URL parameter
			$stateParams.logPriorityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/log-priorities\/([0-9a-fA-F]{24})$/).respond(sampleLogPriority);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logPriority).toEqualData(sampleLogPriority);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LogPriorities) {
			// Create a sample Log priority object
			var sampleLogPriorityPostData = new LogPriorities({
				name: 'New Log priority'
			});

			// Create a sample Log priority response
			var sampleLogPriorityResponse = new LogPriorities({
				_id: '525cf20451979dea2c000001',
				name: 'New Log priority'
			});

			// Fixture mock form input values
			scope.name = 'New Log priority';

			// Set POST response
			$httpBackend.expectPOST('log-priorities', sampleLogPriorityPostData).respond(sampleLogPriorityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Log priority was created
			expect($location.path()).toBe('/log-priorities/' + sampleLogPriorityResponse._id);
		}));

		it('$scope.update() should update a valid Log priority', inject(function(LogPriorities) {
			// Define a sample Log priority put data
			var sampleLogPriorityPutData = new LogPriorities({
				_id: '525cf20451979dea2c000001',
				name: 'New Log priority'
			});

			// Mock Log priority in scope
			scope.logPriority = sampleLogPriorityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/log-priorities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/log-priorities/' + sampleLogPriorityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid logPriorityId and remove the Log priority from the scope', inject(function(LogPriorities) {
			// Create new Log priority object
			var sampleLogPriority = new LogPriorities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Log priorities array and include the Log priority
			scope.logPriorities = [sampleLogPriority];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/log-priorities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLogPriority);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.logPriorities.length).toBe(0);
		}));
	});
}());
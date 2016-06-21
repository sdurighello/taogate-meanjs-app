'use strict';

(function() {
	// Log summaries Controller Spec
	describe('Log summaries Controller Tests', function() {
		// Initialize global variables
		var LogSummariesController,
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

			// Initialize the Log summaries controller.
			LogSummariesController = $controller('LogSummariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Log summary object fetched from XHR', inject(function(LogSummaries) {
			// Create sample Log summary using the Log summaries service
			var sampleLogSummary = new LogSummaries({
				name: 'New Log summary'
			});

			// Create a sample Log summaries array that includes the new Log summary
			var sampleLogSummaries = [sampleLogSummary];

			// Set GET response
			$httpBackend.expectGET('log-summaries').respond(sampleLogSummaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logSummaries).toEqualData(sampleLogSummaries);
		}));

		it('$scope.findOne() should create an array with one Log summary object fetched from XHR using a logSummaryId URL parameter', inject(function(LogSummaries) {
			// Define a sample Log summary object
			var sampleLogSummary = new LogSummaries({
				name: 'New Log summary'
			});

			// Set the URL parameter
			$stateParams.logSummaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/log-summaries\/([0-9a-fA-F]{24})$/).respond(sampleLogSummary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.logSummary).toEqualData(sampleLogSummary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LogSummaries) {
			// Create a sample Log summary object
			var sampleLogSummaryPostData = new LogSummaries({
				name: 'New Log summary'
			});

			// Create a sample Log summary response
			var sampleLogSummaryResponse = new LogSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Log summary'
			});

			// Fixture mock form input values
			scope.name = 'New Log summary';

			// Set POST response
			$httpBackend.expectPOST('log-summaries', sampleLogSummaryPostData).respond(sampleLogSummaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Log summary was created
			expect($location.path()).toBe('/log-summaries/' + sampleLogSummaryResponse._id);
		}));

		it('$scope.update() should update a valid Log summary', inject(function(LogSummaries) {
			// Define a sample Log summary put data
			var sampleLogSummaryPutData = new LogSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Log summary'
			});

			// Mock Log summary in scope
			scope.logSummary = sampleLogSummaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/log-summaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/log-summaries/' + sampleLogSummaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid logSummaryId and remove the Log summary from the scope', inject(function(LogSummaries) {
			// Create new Log summary object
			var sampleLogSummary = new LogSummaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Log summaries array and include the Log summary
			scope.logSummaries = [sampleLogSummary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/log-summaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLogSummary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.logSummaries.length).toBe(0);
		}));
	});
}());
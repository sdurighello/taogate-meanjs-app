'use strict';

(function() {
	// Status summaries Controller Spec
	describe('Status summaries Controller Tests', function() {
		// Initialize global variables
		var StatusSummariesController,
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

			// Initialize the Status summaries controller.
			StatusSummariesController = $controller('StatusSummariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Status summary object fetched from XHR', inject(function(StatusSummaries) {
			// Create sample Status summary using the Status summaries service
			var sampleStatusSummary = new StatusSummaries({
				name: 'New Status summary'
			});

			// Create a sample Status summaries array that includes the new Status summary
			var sampleStatusSummaries = [sampleStatusSummary];

			// Set GET response
			$httpBackend.expectGET('status-summaries').respond(sampleStatusSummaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.statusSummaries).toEqualData(sampleStatusSummaries);
		}));

		it('$scope.findOne() should create an array with one Status summary object fetched from XHR using a statusSummaryId URL parameter', inject(function(StatusSummaries) {
			// Define a sample Status summary object
			var sampleStatusSummary = new StatusSummaries({
				name: 'New Status summary'
			});

			// Set the URL parameter
			$stateParams.statusSummaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/status-summaries\/([0-9a-fA-F]{24})$/).respond(sampleStatusSummary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.statusSummary).toEqualData(sampleStatusSummary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(StatusSummaries) {
			// Create a sample Status summary object
			var sampleStatusSummaryPostData = new StatusSummaries({
				name: 'New Status summary'
			});

			// Create a sample Status summary response
			var sampleStatusSummaryResponse = new StatusSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Status summary'
			});

			// Fixture mock form input values
			scope.name = 'New Status summary';

			// Set POST response
			$httpBackend.expectPOST('status-summaries', sampleStatusSummaryPostData).respond(sampleStatusSummaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Status summary was created
			expect($location.path()).toBe('/status-summaries/' + sampleStatusSummaryResponse._id);
		}));

		it('$scope.update() should update a valid Status summary', inject(function(StatusSummaries) {
			// Define a sample Status summary put data
			var sampleStatusSummaryPutData = new StatusSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Status summary'
			});

			// Mock Status summary in scope
			scope.statusSummary = sampleStatusSummaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/status-summaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/status-summaries/' + sampleStatusSummaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid statusSummaryId and remove the Status summary from the scope', inject(function(StatusSummaries) {
			// Create new Status summary object
			var sampleStatusSummary = new StatusSummaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Status summaries array and include the Status summary
			scope.statusSummaries = [sampleStatusSummary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/status-summaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStatusSummary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.statusSummaries.length).toBe(0);
		}));
	});
}());
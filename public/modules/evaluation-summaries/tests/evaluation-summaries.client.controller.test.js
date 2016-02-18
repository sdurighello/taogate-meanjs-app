'use strict';

(function() {
	// Evaluation summaries Controller Spec
	describe('Evaluation summaries Controller Tests', function() {
		// Initialize global variables
		var EvaluationSummariesController,
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

			// Initialize the Evaluation summaries controller.
			EvaluationSummariesController = $controller('EvaluationSummariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Evaluation summary object fetched from XHR', inject(function(EvaluationSummaries) {
			// Create sample Evaluation summary using the Evaluation summaries service
			var sampleEvaluationSummary = new EvaluationSummaries({
				name: 'New Evaluation summary'
			});

			// Create a sample Evaluation summaries array that includes the new Evaluation summary
			var sampleEvaluationSummaries = [sampleEvaluationSummary];

			// Set GET response
			$httpBackend.expectGET('evaluation-summaries').respond(sampleEvaluationSummaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evaluationSummaries).toEqualData(sampleEvaluationSummaries);
		}));

		it('$scope.findOne() should create an array with one Evaluation summary object fetched from XHR using a evaluationSummaryId URL parameter', inject(function(EvaluationSummaries) {
			// Define a sample Evaluation summary object
			var sampleEvaluationSummary = new EvaluationSummaries({
				name: 'New Evaluation summary'
			});

			// Set the URL parameter
			$stateParams.evaluationSummaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/evaluation-summaries\/([0-9a-fA-F]{24})$/).respond(sampleEvaluationSummary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.evaluationSummary).toEqualData(sampleEvaluationSummary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(EvaluationSummaries) {
			// Create a sample Evaluation summary object
			var sampleEvaluationSummaryPostData = new EvaluationSummaries({
				name: 'New Evaluation summary'
			});

			// Create a sample Evaluation summary response
			var sampleEvaluationSummaryResponse = new EvaluationSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Evaluation summary'
			});

			// Fixture mock form input values
			scope.name = 'New Evaluation summary';

			// Set POST response
			$httpBackend.expectPOST('evaluation-summaries', sampleEvaluationSummaryPostData).respond(sampleEvaluationSummaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Evaluation summary was created
			expect($location.path()).toBe('/evaluation-summaries/' + sampleEvaluationSummaryResponse._id);
		}));

		it('$scope.update() should update a valid Evaluation summary', inject(function(EvaluationSummaries) {
			// Define a sample Evaluation summary put data
			var sampleEvaluationSummaryPutData = new EvaluationSummaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Evaluation summary'
			});

			// Mock Evaluation summary in scope
			scope.evaluationSummary = sampleEvaluationSummaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/evaluation-summaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/evaluation-summaries/' + sampleEvaluationSummaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid evaluationSummaryId and remove the Evaluation summary from the scope', inject(function(EvaluationSummaries) {
			// Create new Evaluation summary object
			var sampleEvaluationSummary = new EvaluationSummaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Evaluation summaries array and include the Evaluation summary
			scope.evaluationSummaries = [sampleEvaluationSummary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/evaluation-summaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEvaluationSummary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.evaluationSummaries.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Risk probabilities Controller Spec
	describe('Risk probabilities Controller Tests', function() {
		// Initialize global variables
		var RiskProbabilitiesController,
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

			// Initialize the Risk probabilities controller.
			RiskProbabilitiesController = $controller('RiskProbabilitiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Risk probability object fetched from XHR', inject(function(RiskProbabilities) {
			// Create sample Risk probability using the Risk probabilities service
			var sampleRiskProbability = new RiskProbabilities({
				name: 'New Risk probability'
			});

			// Create a sample Risk probabilities array that includes the new Risk probability
			var sampleRiskProbabilities = [sampleRiskProbability];

			// Set GET response
			$httpBackend.expectGET('risk-probabilities').respond(sampleRiskProbabilities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskProbabilities).toEqualData(sampleRiskProbabilities);
		}));

		it('$scope.findOne() should create an array with one Risk probability object fetched from XHR using a riskProbabilityId URL parameter', inject(function(RiskProbabilities) {
			// Define a sample Risk probability object
			var sampleRiskProbability = new RiskProbabilities({
				name: 'New Risk probability'
			});

			// Set the URL parameter
			$stateParams.riskProbabilityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/risk-probabilities\/([0-9a-fA-F]{24})$/).respond(sampleRiskProbability);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskProbability).toEqualData(sampleRiskProbability);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RiskProbabilities) {
			// Create a sample Risk probability object
			var sampleRiskProbabilityPostData = new RiskProbabilities({
				name: 'New Risk probability'
			});

			// Create a sample Risk probability response
			var sampleRiskProbabilityResponse = new RiskProbabilities({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk probability'
			});

			// Fixture mock form input values
			scope.name = 'New Risk probability';

			// Set POST response
			$httpBackend.expectPOST('risk-probabilities', sampleRiskProbabilityPostData).respond(sampleRiskProbabilityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Risk probability was created
			expect($location.path()).toBe('/risk-probabilities/' + sampleRiskProbabilityResponse._id);
		}));

		it('$scope.update() should update a valid Risk probability', inject(function(RiskProbabilities) {
			// Define a sample Risk probability put data
			var sampleRiskProbabilityPutData = new RiskProbabilities({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk probability'
			});

			// Mock Risk probability in scope
			scope.riskProbability = sampleRiskProbabilityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/risk-probabilities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/risk-probabilities/' + sampleRiskProbabilityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid riskProbabilityId and remove the Risk probability from the scope', inject(function(RiskProbabilities) {
			// Create new Risk probability object
			var sampleRiskProbability = new RiskProbabilities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Risk probabilities array and include the Risk probability
			scope.riskProbabilities = [sampleRiskProbability];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/risk-probabilities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRiskProbability);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.riskProbabilities.length).toBe(0);
		}));
	});
}());
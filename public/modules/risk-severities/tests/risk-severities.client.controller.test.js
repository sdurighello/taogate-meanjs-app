'use strict';

(function() {
	// Risk severities Controller Spec
	describe('Risk severities Controller Tests', function() {
		// Initialize global variables
		var RiskSeveritiesController,
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

			// Initialize the Risk severities controller.
			RiskSeveritiesController = $controller('RiskSeveritiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Risk severity object fetched from XHR', inject(function(RiskSeverities) {
			// Create sample Risk severity using the Risk severities service
			var sampleRiskSeverity = new RiskSeverities({
				name: 'New Risk severity'
			});

			// Create a sample Risk severities array that includes the new Risk severity
			var sampleRiskSeverities = [sampleRiskSeverity];

			// Set GET response
			$httpBackend.expectGET('risk-severities').respond(sampleRiskSeverities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskSeverities).toEqualData(sampleRiskSeverities);
		}));

		it('$scope.findOne() should create an array with one Risk severity object fetched from XHR using a riskSeverityId URL parameter', inject(function(RiskSeverities) {
			// Define a sample Risk severity object
			var sampleRiskSeverity = new RiskSeverities({
				name: 'New Risk severity'
			});

			// Set the URL parameter
			$stateParams.riskSeverityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/risk-severities\/([0-9a-fA-F]{24})$/).respond(sampleRiskSeverity);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskSeverity).toEqualData(sampleRiskSeverity);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RiskSeverities) {
			// Create a sample Risk severity object
			var sampleRiskSeverityPostData = new RiskSeverities({
				name: 'New Risk severity'
			});

			// Create a sample Risk severity response
			var sampleRiskSeverityResponse = new RiskSeverities({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk severity'
			});

			// Fixture mock form input values
			scope.name = 'New Risk severity';

			// Set POST response
			$httpBackend.expectPOST('risk-severities', sampleRiskSeverityPostData).respond(sampleRiskSeverityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Risk severity was created
			expect($location.path()).toBe('/risk-severities/' + sampleRiskSeverityResponse._id);
		}));

		it('$scope.update() should update a valid Risk severity', inject(function(RiskSeverities) {
			// Define a sample Risk severity put data
			var sampleRiskSeverityPutData = new RiskSeverities({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk severity'
			});

			// Mock Risk severity in scope
			scope.riskSeverity = sampleRiskSeverityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/risk-severities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/risk-severities/' + sampleRiskSeverityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid riskSeverityId and remove the Risk severity from the scope', inject(function(RiskSeverities) {
			// Create new Risk severity object
			var sampleRiskSeverity = new RiskSeverities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Risk severities array and include the Risk severity
			scope.riskSeverities = [sampleRiskSeverity];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/risk-severities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRiskSeverity);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.riskSeverities.length).toBe(0);
		}));
	});
}());
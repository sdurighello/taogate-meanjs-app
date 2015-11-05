'use strict';

(function() {
	// Risk impacts Controller Spec
	describe('Risk impacts Controller Tests', function() {
		// Initialize global variables
		var RiskImpactsController,
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

			// Initialize the Risk impacts controller.
			RiskImpactsController = $controller('RiskImpactsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Risk impact object fetched from XHR', inject(function(RiskImpacts) {
			// Create sample Risk impact using the Risk impacts service
			var sampleRiskImpact = new RiskImpacts({
				name: 'New Risk impact'
			});

			// Create a sample Risk impacts array that includes the new Risk impact
			var sampleRiskImpacts = [sampleRiskImpact];

			// Set GET response
			$httpBackend.expectGET('risk-impacts').respond(sampleRiskImpacts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskImpacts).toEqualData(sampleRiskImpacts);
		}));

		it('$scope.findOne() should create an array with one Risk impact object fetched from XHR using a riskImpactId URL parameter', inject(function(RiskImpacts) {
			// Define a sample Risk impact object
			var sampleRiskImpact = new RiskImpacts({
				name: 'New Risk impact'
			});

			// Set the URL parameter
			$stateParams.riskImpactId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/risk-impacts\/([0-9a-fA-F]{24})$/).respond(sampleRiskImpact);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskImpact).toEqualData(sampleRiskImpact);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RiskImpacts) {
			// Create a sample Risk impact object
			var sampleRiskImpactPostData = new RiskImpacts({
				name: 'New Risk impact'
			});

			// Create a sample Risk impact response
			var sampleRiskImpactResponse = new RiskImpacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk impact'
			});

			// Fixture mock form input values
			scope.name = 'New Risk impact';

			// Set POST response
			$httpBackend.expectPOST('risk-impacts', sampleRiskImpactPostData).respond(sampleRiskImpactResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Risk impact was created
			expect($location.path()).toBe('/risk-impacts/' + sampleRiskImpactResponse._id);
		}));

		it('$scope.update() should update a valid Risk impact', inject(function(RiskImpacts) {
			// Define a sample Risk impact put data
			var sampleRiskImpactPutData = new RiskImpacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk impact'
			});

			// Mock Risk impact in scope
			scope.riskImpact = sampleRiskImpactPutData;

			// Set PUT response
			$httpBackend.expectPUT(/risk-impacts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/risk-impacts/' + sampleRiskImpactPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid riskImpactId and remove the Risk impact from the scope', inject(function(RiskImpacts) {
			// Create new Risk impact object
			var sampleRiskImpact = new RiskImpacts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Risk impacts array and include the Risk impact
			scope.riskImpacts = [sampleRiskImpact];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/risk-impacts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRiskImpact);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.riskImpacts.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Risks Controller Spec
	describe('Risks Controller Tests', function() {
		// Initialize global variables
		var RisksController,
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

			// Initialize the Risks controller.
			RisksController = $controller('RisksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Risk object fetched from XHR', inject(function(Risks) {
			// Create sample Risk using the Risks service
			var sampleRisk = new Risks({
				name: 'New Risk'
			});

			// Create a sample Risks array that includes the new Risk
			var sampleRisks = [sampleRisk];

			// Set GET response
			$httpBackend.expectGET('risks').respond(sampleRisks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.risks).toEqualData(sampleRisks);
		}));

		it('$scope.findOne() should create an array with one Risk object fetched from XHR using a riskId URL parameter', inject(function(Risks) {
			// Define a sample Risk object
			var sampleRisk = new Risks({
				name: 'New Risk'
			});

			// Set the URL parameter
			$stateParams.riskId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/risks\/([0-9a-fA-F]{24})$/).respond(sampleRisk);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.risk).toEqualData(sampleRisk);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Risks) {
			// Create a sample Risk object
			var sampleRiskPostData = new Risks({
				name: 'New Risk'
			});

			// Create a sample Risk response
			var sampleRiskResponse = new Risks({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk'
			});

			// Fixture mock form input values
			scope.name = 'New Risk';

			// Set POST response
			$httpBackend.expectPOST('risks', sampleRiskPostData).respond(sampleRiskResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Risk was created
			expect($location.path()).toBe('/risks/' + sampleRiskResponse._id);
		}));

		it('$scope.update() should update a valid Risk', inject(function(Risks) {
			// Define a sample Risk put data
			var sampleRiskPutData = new Risks({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk'
			});

			// Mock Risk in scope
			scope.risk = sampleRiskPutData;

			// Set PUT response
			$httpBackend.expectPUT(/risks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/risks/' + sampleRiskPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid riskId and remove the Risk from the scope', inject(function(Risks) {
			// Create new Risk object
			var sampleRisk = new Risks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Risks array and include the Risk
			scope.risks = [sampleRisk];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/risks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRisk);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.risks.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Financial costs Controller Spec
	describe('Financial costs Controller Tests', function() {
		// Initialize global variables
		var FinancialCostsController,
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

			// Initialize the Financial costs controller.
			FinancialCostsController = $controller('FinancialCostsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Financial cost object fetched from XHR', inject(function(FinancialCosts) {
			// Create sample Financial cost using the Financial costs service
			var sampleFinancialCost = new FinancialCosts({
				name: 'New Financial cost'
			});

			// Create a sample Financial costs array that includes the new Financial cost
			var sampleFinancialCosts = [sampleFinancialCost];

			// Set GET response
			$httpBackend.expectGET('financial-costs').respond(sampleFinancialCosts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialCosts).toEqualData(sampleFinancialCosts);
		}));

		it('$scope.findOne() should create an array with one Financial cost object fetched from XHR using a financialCostId URL parameter', inject(function(FinancialCosts) {
			// Define a sample Financial cost object
			var sampleFinancialCost = new FinancialCosts({
				name: 'New Financial cost'
			});

			// Set the URL parameter
			$stateParams.financialCostId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/financial-costs\/([0-9a-fA-F]{24})$/).respond(sampleFinancialCost);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialCost).toEqualData(sampleFinancialCost);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FinancialCosts) {
			// Create a sample Financial cost object
			var sampleFinancialCostPostData = new FinancialCosts({
				name: 'New Financial cost'
			});

			// Create a sample Financial cost response
			var sampleFinancialCostResponse = new FinancialCosts({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial cost'
			});

			// Fixture mock form input values
			scope.name = 'New Financial cost';

			// Set POST response
			$httpBackend.expectPOST('financial-costs', sampleFinancialCostPostData).respond(sampleFinancialCostResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Financial cost was created
			expect($location.path()).toBe('/financial-costs/' + sampleFinancialCostResponse._id);
		}));

		it('$scope.update() should update a valid Financial cost', inject(function(FinancialCosts) {
			// Define a sample Financial cost put data
			var sampleFinancialCostPutData = new FinancialCosts({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial cost'
			});

			// Mock Financial cost in scope
			scope.financialCost = sampleFinancialCostPutData;

			// Set PUT response
			$httpBackend.expectPUT(/financial-costs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/financial-costs/' + sampleFinancialCostPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financialCostId and remove the Financial cost from the scope', inject(function(FinancialCosts) {
			// Create new Financial cost object
			var sampleFinancialCost = new FinancialCosts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Financial costs array and include the Financial cost
			scope.financialCosts = [sampleFinancialCost];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/financial-costs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinancialCost);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.financialCosts.length).toBe(0);
		}));
	});
}());
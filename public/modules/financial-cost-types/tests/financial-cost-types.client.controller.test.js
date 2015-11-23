'use strict';

(function() {
	// Financial cost types Controller Spec
	describe('Financial cost types Controller Tests', function() {
		// Initialize global variables
		var FinancialCostTypesController,
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

			// Initialize the Financial cost types controller.
			FinancialCostTypesController = $controller('FinancialCostTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Financial cost type object fetched from XHR', inject(function(FinancialCostTypes) {
			// Create sample Financial cost type using the Financial cost types service
			var sampleFinancialCostType = new FinancialCostTypes({
				name: 'New Financial cost type'
			});

			// Create a sample Financial cost types array that includes the new Financial cost type
			var sampleFinancialCostTypes = [sampleFinancialCostType];

			// Set GET response
			$httpBackend.expectGET('financial-cost-types').respond(sampleFinancialCostTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialCostTypes).toEqualData(sampleFinancialCostTypes);
		}));

		it('$scope.findOne() should create an array with one Financial cost type object fetched from XHR using a financialCostTypeId URL parameter', inject(function(FinancialCostTypes) {
			// Define a sample Financial cost type object
			var sampleFinancialCostType = new FinancialCostTypes({
				name: 'New Financial cost type'
			});

			// Set the URL parameter
			$stateParams.financialCostTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/financial-cost-types\/([0-9a-fA-F]{24})$/).respond(sampleFinancialCostType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialCostType).toEqualData(sampleFinancialCostType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FinancialCostTypes) {
			// Create a sample Financial cost type object
			var sampleFinancialCostTypePostData = new FinancialCostTypes({
				name: 'New Financial cost type'
			});

			// Create a sample Financial cost type response
			var sampleFinancialCostTypeResponse = new FinancialCostTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial cost type'
			});

			// Fixture mock form input values
			scope.name = 'New Financial cost type';

			// Set POST response
			$httpBackend.expectPOST('financial-cost-types', sampleFinancialCostTypePostData).respond(sampleFinancialCostTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Financial cost type was created
			expect($location.path()).toBe('/financial-cost-types/' + sampleFinancialCostTypeResponse._id);
		}));

		it('$scope.update() should update a valid Financial cost type', inject(function(FinancialCostTypes) {
			// Define a sample Financial cost type put data
			var sampleFinancialCostTypePutData = new FinancialCostTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial cost type'
			});

			// Mock Financial cost type in scope
			scope.financialCostType = sampleFinancialCostTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/financial-cost-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/financial-cost-types/' + sampleFinancialCostTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financialCostTypeId and remove the Financial cost type from the scope', inject(function(FinancialCostTypes) {
			// Create new Financial cost type object
			var sampleFinancialCostType = new FinancialCostTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Financial cost types array and include the Financial cost type
			scope.financialCostTypes = [sampleFinancialCostType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/financial-cost-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinancialCostType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.financialCostTypes.length).toBe(0);
		}));
	});
}());
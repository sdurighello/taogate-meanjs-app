'use strict';

(function() {
	// Financial benefits Controller Spec
	describe('Financial benefits Controller Tests', function() {
		// Initialize global variables
		var FinancialBenefitsController,
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

			// Initialize the Financial benefits controller.
			FinancialBenefitsController = $controller('FinancialBenefitsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Financial benefit object fetched from XHR', inject(function(FinancialBenefits) {
			// Create sample Financial benefit using the Financial benefits service
			var sampleFinancialBenefit = new FinancialBenefits({
				name: 'New Financial benefit'
			});

			// Create a sample Financial benefits array that includes the new Financial benefit
			var sampleFinancialBenefits = [sampleFinancialBenefit];

			// Set GET response
			$httpBackend.expectGET('financial-benefits').respond(sampleFinancialBenefits);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialBenefits).toEqualData(sampleFinancialBenefits);
		}));

		it('$scope.findOne() should create an array with one Financial benefit object fetched from XHR using a financialBenefitId URL parameter', inject(function(FinancialBenefits) {
			// Define a sample Financial benefit object
			var sampleFinancialBenefit = new FinancialBenefits({
				name: 'New Financial benefit'
			});

			// Set the URL parameter
			$stateParams.financialBenefitId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/financial-benefits\/([0-9a-fA-F]{24})$/).respond(sampleFinancialBenefit);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialBenefit).toEqualData(sampleFinancialBenefit);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FinancialBenefits) {
			// Create a sample Financial benefit object
			var sampleFinancialBenefitPostData = new FinancialBenefits({
				name: 'New Financial benefit'
			});

			// Create a sample Financial benefit response
			var sampleFinancialBenefitResponse = new FinancialBenefits({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial benefit'
			});

			// Fixture mock form input values
			scope.name = 'New Financial benefit';

			// Set POST response
			$httpBackend.expectPOST('financial-benefits', sampleFinancialBenefitPostData).respond(sampleFinancialBenefitResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Financial benefit was created
			expect($location.path()).toBe('/financial-benefits/' + sampleFinancialBenefitResponse._id);
		}));

		it('$scope.update() should update a valid Financial benefit', inject(function(FinancialBenefits) {
			// Define a sample Financial benefit put data
			var sampleFinancialBenefitPutData = new FinancialBenefits({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial benefit'
			});

			// Mock Financial benefit in scope
			scope.financialBenefit = sampleFinancialBenefitPutData;

			// Set PUT response
			$httpBackend.expectPUT(/financial-benefits\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/financial-benefits/' + sampleFinancialBenefitPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financialBenefitId and remove the Financial benefit from the scope', inject(function(FinancialBenefits) {
			// Create new Financial benefit object
			var sampleFinancialBenefit = new FinancialBenefits({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Financial benefits array and include the Financial benefit
			scope.financialBenefits = [sampleFinancialBenefit];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/financial-benefits\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinancialBenefit);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.financialBenefits.length).toBe(0);
		}));
	});
}());
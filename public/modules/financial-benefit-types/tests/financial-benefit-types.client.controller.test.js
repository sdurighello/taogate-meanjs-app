'use strict';

(function() {
	// Financial benefit types Controller Spec
	describe('Financial benefit types Controller Tests', function() {
		// Initialize global variables
		var FinancialBenefitTypesController,
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

			// Initialize the Financial benefit types controller.
			FinancialBenefitTypesController = $controller('FinancialBenefitTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Financial benefit type object fetched from XHR', inject(function(FinancialBenefitTypes) {
			// Create sample Financial benefit type using the Financial benefit types service
			var sampleFinancialBenefitType = new FinancialBenefitTypes({
				name: 'New Financial benefit type'
			});

			// Create a sample Financial benefit types array that includes the new Financial benefit type
			var sampleFinancialBenefitTypes = [sampleFinancialBenefitType];

			// Set GET response
			$httpBackend.expectGET('financial-benefit-types').respond(sampleFinancialBenefitTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialBenefitTypes).toEqualData(sampleFinancialBenefitTypes);
		}));

		it('$scope.findOne() should create an array with one Financial benefit type object fetched from XHR using a financialBenefitTypeId URL parameter', inject(function(FinancialBenefitTypes) {
			// Define a sample Financial benefit type object
			var sampleFinancialBenefitType = new FinancialBenefitTypes({
				name: 'New Financial benefit type'
			});

			// Set the URL parameter
			$stateParams.financialBenefitTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/financial-benefit-types\/([0-9a-fA-F]{24})$/).respond(sampleFinancialBenefitType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialBenefitType).toEqualData(sampleFinancialBenefitType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FinancialBenefitTypes) {
			// Create a sample Financial benefit type object
			var sampleFinancialBenefitTypePostData = new FinancialBenefitTypes({
				name: 'New Financial benefit type'
			});

			// Create a sample Financial benefit type response
			var sampleFinancialBenefitTypeResponse = new FinancialBenefitTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial benefit type'
			});

			// Fixture mock form input values
			scope.name = 'New Financial benefit type';

			// Set POST response
			$httpBackend.expectPOST('financial-benefit-types', sampleFinancialBenefitTypePostData).respond(sampleFinancialBenefitTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Financial benefit type was created
			expect($location.path()).toBe('/financial-benefit-types/' + sampleFinancialBenefitTypeResponse._id);
		}));

		it('$scope.update() should update a valid Financial benefit type', inject(function(FinancialBenefitTypes) {
			// Define a sample Financial benefit type put data
			var sampleFinancialBenefitTypePutData = new FinancialBenefitTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial benefit type'
			});

			// Mock Financial benefit type in scope
			scope.financialBenefitType = sampleFinancialBenefitTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/financial-benefit-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/financial-benefit-types/' + sampleFinancialBenefitTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financialBenefitTypeId and remove the Financial benefit type from the scope', inject(function(FinancialBenefitTypes) {
			// Create new Financial benefit type object
			var sampleFinancialBenefitType = new FinancialBenefitTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Financial benefit types array and include the Financial benefit type
			scope.financialBenefitTypes = [sampleFinancialBenefitType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/financial-benefit-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinancialBenefitType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.financialBenefitTypes.length).toBe(0);
		}));
	});
}());
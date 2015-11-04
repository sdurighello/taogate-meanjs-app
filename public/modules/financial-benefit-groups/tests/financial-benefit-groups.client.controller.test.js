'use strict';

(function() {
	// Financial benefit groups Controller Spec
	describe('Financial benefit groups Controller Tests', function() {
		// Initialize global variables
		var FinancialBenefitGroupsController,
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

			// Initialize the Financial benefit groups controller.
			FinancialBenefitGroupsController = $controller('FinancialBenefitGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Financial benefit group object fetched from XHR', inject(function(FinancialBenefitGroups) {
			// Create sample Financial benefit group using the Financial benefit groups service
			var sampleFinancialBenefitGroup = new FinancialBenefitGroups({
				name: 'New Financial benefit group'
			});

			// Create a sample Financial benefit groups array that includes the new Financial benefit group
			var sampleFinancialBenefitGroups = [sampleFinancialBenefitGroup];

			// Set GET response
			$httpBackend.expectGET('financial-benefit-groups').respond(sampleFinancialBenefitGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialBenefitGroups).toEqualData(sampleFinancialBenefitGroups);
		}));

		it('$scope.findOne() should create an array with one Financial benefit group object fetched from XHR using a financialBenefitGroupId URL parameter', inject(function(FinancialBenefitGroups) {
			// Define a sample Financial benefit group object
			var sampleFinancialBenefitGroup = new FinancialBenefitGroups({
				name: 'New Financial benefit group'
			});

			// Set the URL parameter
			$stateParams.financialBenefitGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/financial-benefit-groups\/([0-9a-fA-F]{24})$/).respond(sampleFinancialBenefitGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialBenefitGroup).toEqualData(sampleFinancialBenefitGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FinancialBenefitGroups) {
			// Create a sample Financial benefit group object
			var sampleFinancialBenefitGroupPostData = new FinancialBenefitGroups({
				name: 'New Financial benefit group'
			});

			// Create a sample Financial benefit group response
			var sampleFinancialBenefitGroupResponse = new FinancialBenefitGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial benefit group'
			});

			// Fixture mock form input values
			scope.name = 'New Financial benefit group';

			// Set POST response
			$httpBackend.expectPOST('financial-benefit-groups', sampleFinancialBenefitGroupPostData).respond(sampleFinancialBenefitGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Financial benefit group was created
			expect($location.path()).toBe('/financial-benefit-groups/' + sampleFinancialBenefitGroupResponse._id);
		}));

		it('$scope.update() should update a valid Financial benefit group', inject(function(FinancialBenefitGroups) {
			// Define a sample Financial benefit group put data
			var sampleFinancialBenefitGroupPutData = new FinancialBenefitGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial benefit group'
			});

			// Mock Financial benefit group in scope
			scope.financialBenefitGroup = sampleFinancialBenefitGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/financial-benefit-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/financial-benefit-groups/' + sampleFinancialBenefitGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financialBenefitGroupId and remove the Financial benefit group from the scope', inject(function(FinancialBenefitGroups) {
			// Create new Financial benefit group object
			var sampleFinancialBenefitGroup = new FinancialBenefitGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Financial benefit groups array and include the Financial benefit group
			scope.financialBenefitGroups = [sampleFinancialBenefitGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/financial-benefit-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinancialBenefitGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.financialBenefitGroups.length).toBe(0);
		}));
	});
}());
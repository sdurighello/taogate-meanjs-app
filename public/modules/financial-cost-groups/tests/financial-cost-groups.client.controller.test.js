'use strict';

(function() {
	// Financial cost groups Controller Spec
	describe('Financial cost groups Controller Tests', function() {
		// Initialize global variables
		var FinancialCostGroupsController,
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

			// Initialize the Financial cost groups controller.
			FinancialCostGroupsController = $controller('FinancialCostGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Financial cost group object fetched from XHR', inject(function(FinancialCostGroups) {
			// Create sample Financial cost group using the Financial cost groups service
			var sampleFinancialCostGroup = new FinancialCostGroups({
				name: 'New Financial cost group'
			});

			// Create a sample Financial cost groups array that includes the new Financial cost group
			var sampleFinancialCostGroups = [sampleFinancialCostGroup];

			// Set GET response
			$httpBackend.expectGET('financial-cost-groups').respond(sampleFinancialCostGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialCostGroups).toEqualData(sampleFinancialCostGroups);
		}));

		it('$scope.findOne() should create an array with one Financial cost group object fetched from XHR using a financialCostGroupId URL parameter', inject(function(FinancialCostGroups) {
			// Define a sample Financial cost group object
			var sampleFinancialCostGroup = new FinancialCostGroups({
				name: 'New Financial cost group'
			});

			// Set the URL parameter
			$stateParams.financialCostGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/financial-cost-groups\/([0-9a-fA-F]{24})$/).respond(sampleFinancialCostGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.financialCostGroup).toEqualData(sampleFinancialCostGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(FinancialCostGroups) {
			// Create a sample Financial cost group object
			var sampleFinancialCostGroupPostData = new FinancialCostGroups({
				name: 'New Financial cost group'
			});

			// Create a sample Financial cost group response
			var sampleFinancialCostGroupResponse = new FinancialCostGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial cost group'
			});

			// Fixture mock form input values
			scope.name = 'New Financial cost group';

			// Set POST response
			$httpBackend.expectPOST('financial-cost-groups', sampleFinancialCostGroupPostData).respond(sampleFinancialCostGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Financial cost group was created
			expect($location.path()).toBe('/financial-cost-groups/' + sampleFinancialCostGroupResponse._id);
		}));

		it('$scope.update() should update a valid Financial cost group', inject(function(FinancialCostGroups) {
			// Define a sample Financial cost group put data
			var sampleFinancialCostGroupPutData = new FinancialCostGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Financial cost group'
			});

			// Mock Financial cost group in scope
			scope.financialCostGroup = sampleFinancialCostGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/financial-cost-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/financial-cost-groups/' + sampleFinancialCostGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid financialCostGroupId and remove the Financial cost group from the scope', inject(function(FinancialCostGroups) {
			// Create new Financial cost group object
			var sampleFinancialCostGroup = new FinancialCostGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Financial cost groups array and include the Financial cost group
			scope.financialCostGroups = [sampleFinancialCostGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/financial-cost-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFinancialCostGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.financialCostGroups.length).toBe(0);
		}));
	});
}());
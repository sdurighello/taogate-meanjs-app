'use strict';

(function() {
	// Milestone types Controller Spec
	describe('Milestone types Controller Tests', function() {
		// Initialize global variables
		var MilestoneTypesController,
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

			// Initialize the Milestone types controller.
			MilestoneTypesController = $controller('MilestoneTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Milestone type object fetched from XHR', inject(function(MilestoneTypes) {
			// Create sample Milestone type using the Milestone types service
			var sampleMilestoneType = new MilestoneTypes({
				name: 'New Milestone type'
			});

			// Create a sample Milestone types array that includes the new Milestone type
			var sampleMilestoneTypes = [sampleMilestoneType];

			// Set GET response
			$httpBackend.expectGET('milestone-types').respond(sampleMilestoneTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.milestoneTypes).toEqualData(sampleMilestoneTypes);
		}));

		it('$scope.findOne() should create an array with one Milestone type object fetched from XHR using a milestoneTypeId URL parameter', inject(function(MilestoneTypes) {
			// Define a sample Milestone type object
			var sampleMilestoneType = new MilestoneTypes({
				name: 'New Milestone type'
			});

			// Set the URL parameter
			$stateParams.milestoneTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/milestone-types\/([0-9a-fA-F]{24})$/).respond(sampleMilestoneType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.milestoneType).toEqualData(sampleMilestoneType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(MilestoneTypes) {
			// Create a sample Milestone type object
			var sampleMilestoneTypePostData = new MilestoneTypes({
				name: 'New Milestone type'
			});

			// Create a sample Milestone type response
			var sampleMilestoneTypeResponse = new MilestoneTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Milestone type'
			});

			// Fixture mock form input values
			scope.name = 'New Milestone type';

			// Set POST response
			$httpBackend.expectPOST('milestone-types', sampleMilestoneTypePostData).respond(sampleMilestoneTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Milestone type was created
			expect($location.path()).toBe('/milestone-types/' + sampleMilestoneTypeResponse._id);
		}));

		it('$scope.update() should update a valid Milestone type', inject(function(MilestoneTypes) {
			// Define a sample Milestone type put data
			var sampleMilestoneTypePutData = new MilestoneTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Milestone type'
			});

			// Mock Milestone type in scope
			scope.milestoneType = sampleMilestoneTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/milestone-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/milestone-types/' + sampleMilestoneTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid milestoneTypeId and remove the Milestone type from the scope', inject(function(MilestoneTypes) {
			// Create new Milestone type object
			var sampleMilestoneType = new MilestoneTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Milestone types array and include the Milestone type
			scope.milestoneTypes = [sampleMilestoneType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/milestone-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMilestoneType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.milestoneTypes.length).toBe(0);
		}));
	});
}());
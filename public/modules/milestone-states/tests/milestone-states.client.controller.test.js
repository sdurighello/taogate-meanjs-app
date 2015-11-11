'use strict';

(function() {
	// Milestone states Controller Spec
	describe('Milestone states Controller Tests', function() {
		// Initialize global variables
		var MilestoneStatesController,
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

			// Initialize the Milestone states controller.
			MilestoneStatesController = $controller('MilestoneStatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Milestone state object fetched from XHR', inject(function(MilestoneStates) {
			// Create sample Milestone state using the Milestone states service
			var sampleMilestoneState = new MilestoneStates({
				name: 'New Milestone state'
			});

			// Create a sample Milestone states array that includes the new Milestone state
			var sampleMilestoneStates = [sampleMilestoneState];

			// Set GET response
			$httpBackend.expectGET('milestone-states').respond(sampleMilestoneStates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.milestoneStates).toEqualData(sampleMilestoneStates);
		}));

		it('$scope.findOne() should create an array with one Milestone state object fetched from XHR using a milestoneStateId URL parameter', inject(function(MilestoneStates) {
			// Define a sample Milestone state object
			var sampleMilestoneState = new MilestoneStates({
				name: 'New Milestone state'
			});

			// Set the URL parameter
			$stateParams.milestoneStateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/milestone-states\/([0-9a-fA-F]{24})$/).respond(sampleMilestoneState);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.milestoneState).toEqualData(sampleMilestoneState);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(MilestoneStates) {
			// Create a sample Milestone state object
			var sampleMilestoneStatePostData = new MilestoneStates({
				name: 'New Milestone state'
			});

			// Create a sample Milestone state response
			var sampleMilestoneStateResponse = new MilestoneStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Milestone state'
			});

			// Fixture mock form input values
			scope.name = 'New Milestone state';

			// Set POST response
			$httpBackend.expectPOST('milestone-states', sampleMilestoneStatePostData).respond(sampleMilestoneStateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Milestone state was created
			expect($location.path()).toBe('/milestone-states/' + sampleMilestoneStateResponse._id);
		}));

		it('$scope.update() should update a valid Milestone state', inject(function(MilestoneStates) {
			// Define a sample Milestone state put data
			var sampleMilestoneStatePutData = new MilestoneStates({
				_id: '525cf20451979dea2c000001',
				name: 'New Milestone state'
			});

			// Mock Milestone state in scope
			scope.milestoneState = sampleMilestoneStatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/milestone-states\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/milestone-states/' + sampleMilestoneStatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid milestoneStateId and remove the Milestone state from the scope', inject(function(MilestoneStates) {
			// Create new Milestone state object
			var sampleMilestoneState = new MilestoneStates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Milestone states array and include the Milestone state
			scope.milestoneStates = [sampleMilestoneState];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/milestone-states\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMilestoneState);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.milestoneStates.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Priority groups Controller Spec
	describe('Priority groups Controller Tests', function() {
		// Initialize global variables
		var PriorityGroupsController,
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

			// Initialize the Priority groups controller.
			PriorityGroupsController = $controller('PriorityGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Priority group object fetched from XHR', inject(function(PriorityGroups) {
			// Create sample Priority group using the Priority groups service
			var samplePriorityGroup = new PriorityGroups({
				name: 'New Priority group'
			});

			// Create a sample Priority groups array that includes the new Priority group
			var samplePriorityGroups = [samplePriorityGroup];

			// Set GET response
			$httpBackend.expectGET('priority-groups').respond(samplePriorityGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorityGroups).toEqualData(samplePriorityGroups);
		}));

		it('$scope.findOne() should create an array with one Priority group object fetched from XHR using a priorityGroupId URL parameter', inject(function(PriorityGroups) {
			// Define a sample Priority group object
			var samplePriorityGroup = new PriorityGroups({
				name: 'New Priority group'
			});

			// Set the URL parameter
			$stateParams.priorityGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/priority-groups\/([0-9a-fA-F]{24})$/).respond(samplePriorityGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.priorityGroup).toEqualData(samplePriorityGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PriorityGroups) {
			// Create a sample Priority group object
			var samplePriorityGroupPostData = new PriorityGroups({
				name: 'New Priority group'
			});

			// Create a sample Priority group response
			var samplePriorityGroupResponse = new PriorityGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority group'
			});

			// Fixture mock form input values
			scope.name = 'New Priority group';

			// Set POST response
			$httpBackend.expectPOST('priority-groups', samplePriorityGroupPostData).respond(samplePriorityGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Priority group was created
			expect($location.path()).toBe('/priority-groups/' + samplePriorityGroupResponse._id);
		}));

		it('$scope.update() should update a valid Priority group', inject(function(PriorityGroups) {
			// Define a sample Priority group put data
			var samplePriorityGroupPutData = new PriorityGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Priority group'
			});

			// Mock Priority group in scope
			scope.priorityGroup = samplePriorityGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/priority-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/priority-groups/' + samplePriorityGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid priorityGroupId and remove the Priority group from the scope', inject(function(PriorityGroups) {
			// Create new Priority group object
			var samplePriorityGroup = new PriorityGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Priority groups array and include the Priority group
			scope.priorityGroups = [samplePriorityGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/priority-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePriorityGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.priorityGroups.length).toBe(0);
		}));
	});
}());
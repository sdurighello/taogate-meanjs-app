'use strict';

(function() {
	// Risk severity assignments Controller Spec
	describe('Risk severity assignments Controller Tests', function() {
		// Initialize global variables
		var RiskSeverityAssignmentsController,
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

			// Initialize the Risk severity assignments controller.
			RiskSeverityAssignmentsController = $controller('RiskSeverityAssignmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Risk severity assignment object fetched from XHR', inject(function(RiskSeverityAssignments) {
			// Create sample Risk severity assignment using the Risk severity assignments service
			var sampleRiskSeverityAssignment = new RiskSeverityAssignments({
				name: 'New Risk severity assignment'
			});

			// Create a sample Risk severity assignments array that includes the new Risk severity assignment
			var sampleRiskSeverityAssignments = [sampleRiskSeverityAssignment];

			// Set GET response
			$httpBackend.expectGET('risk-severity-assignments').respond(sampleRiskSeverityAssignments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskSeverityAssignments).toEqualData(sampleRiskSeverityAssignments);
		}));

		it('$scope.findOne() should create an array with one Risk severity assignment object fetched from XHR using a riskSeverityAssignmentId URL parameter', inject(function(RiskSeverityAssignments) {
			// Define a sample Risk severity assignment object
			var sampleRiskSeverityAssignment = new RiskSeverityAssignments({
				name: 'New Risk severity assignment'
			});

			// Set the URL parameter
			$stateParams.riskSeverityAssignmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/risk-severity-assignments\/([0-9a-fA-F]{24})$/).respond(sampleRiskSeverityAssignment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.riskSeverityAssignment).toEqualData(sampleRiskSeverityAssignment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(RiskSeverityAssignments) {
			// Create a sample Risk severity assignment object
			var sampleRiskSeverityAssignmentPostData = new RiskSeverityAssignments({
				name: 'New Risk severity assignment'
			});

			// Create a sample Risk severity assignment response
			var sampleRiskSeverityAssignmentResponse = new RiskSeverityAssignments({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk severity assignment'
			});

			// Fixture mock form input values
			scope.name = 'New Risk severity assignment';

			// Set POST response
			$httpBackend.expectPOST('risk-severity-assignments', sampleRiskSeverityAssignmentPostData).respond(sampleRiskSeverityAssignmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Risk severity assignment was created
			expect($location.path()).toBe('/risk-severity-assignments/' + sampleRiskSeverityAssignmentResponse._id);
		}));

		it('$scope.update() should update a valid Risk severity assignment', inject(function(RiskSeverityAssignments) {
			// Define a sample Risk severity assignment put data
			var sampleRiskSeverityAssignmentPutData = new RiskSeverityAssignments({
				_id: '525cf20451979dea2c000001',
				name: 'New Risk severity assignment'
			});

			// Mock Risk severity assignment in scope
			scope.riskSeverityAssignment = sampleRiskSeverityAssignmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/risk-severity-assignments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/risk-severity-assignments/' + sampleRiskSeverityAssignmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid riskSeverityAssignmentId and remove the Risk severity assignment from the scope', inject(function(RiskSeverityAssignments) {
			// Create new Risk severity assignment object
			var sampleRiskSeverityAssignment = new RiskSeverityAssignments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Risk severity assignments array and include the Risk severity assignment
			scope.riskSeverityAssignments = [sampleRiskSeverityAssignment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/risk-severity-assignments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRiskSeverityAssignment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.riskSeverityAssignments.length).toBe(0);
		}));
	});
}());
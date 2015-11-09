'use strict';

(function() {
	// Gate outcome scores Controller Spec
	describe('Gate outcome scores Controller Tests', function() {
		// Initialize global variables
		var GateOutcomeScoresController,
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

			// Initialize the Gate outcome scores controller.
			GateOutcomeScoresController = $controller('GateOutcomeScoresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate outcome score object fetched from XHR', inject(function(GateOutcomeScores) {
			// Create sample Gate outcome score using the Gate outcome scores service
			var sampleGateOutcomeScore = new GateOutcomeScores({
				name: 'New Gate outcome score'
			});

			// Create a sample Gate outcome scores array that includes the new Gate outcome score
			var sampleGateOutcomeScores = [sampleGateOutcomeScore];

			// Set GET response
			$httpBackend.expectGET('gate-outcome-scores').respond(sampleGateOutcomeScores);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateOutcomeScores).toEqualData(sampleGateOutcomeScores);
		}));

		it('$scope.findOne() should create an array with one Gate outcome score object fetched from XHR using a gateOutcomeScoreId URL parameter', inject(function(GateOutcomeScores) {
			// Define a sample Gate outcome score object
			var sampleGateOutcomeScore = new GateOutcomeScores({
				name: 'New Gate outcome score'
			});

			// Set the URL parameter
			$stateParams.gateOutcomeScoreId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gate-outcome-scores\/([0-9a-fA-F]{24})$/).respond(sampleGateOutcomeScore);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateOutcomeScore).toEqualData(sampleGateOutcomeScore);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GateOutcomeScores) {
			// Create a sample Gate outcome score object
			var sampleGateOutcomeScorePostData = new GateOutcomeScores({
				name: 'New Gate outcome score'
			});

			// Create a sample Gate outcome score response
			var sampleGateOutcomeScoreResponse = new GateOutcomeScores({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate outcome score'
			});

			// Fixture mock form input values
			scope.name = 'New Gate outcome score';

			// Set POST response
			$httpBackend.expectPOST('gate-outcome-scores', sampleGateOutcomeScorePostData).respond(sampleGateOutcomeScoreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate outcome score was created
			expect($location.path()).toBe('/gate-outcome-scores/' + sampleGateOutcomeScoreResponse._id);
		}));

		it('$scope.update() should update a valid Gate outcome score', inject(function(GateOutcomeScores) {
			// Define a sample Gate outcome score put data
			var sampleGateOutcomeScorePutData = new GateOutcomeScores({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate outcome score'
			});

			// Mock Gate outcome score in scope
			scope.gateOutcomeScore = sampleGateOutcomeScorePutData;

			// Set PUT response
			$httpBackend.expectPUT(/gate-outcome-scores\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gate-outcome-scores/' + sampleGateOutcomeScorePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateOutcomeScoreId and remove the Gate outcome score from the scope', inject(function(GateOutcomeScores) {
			// Create new Gate outcome score object
			var sampleGateOutcomeScore = new GateOutcomeScores({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gate outcome scores array and include the Gate outcome score
			scope.gateOutcomeScores = [sampleGateOutcomeScore];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gate-outcome-scores\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGateOutcomeScore);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gateOutcomeScores.length).toBe(0);
		}));
	});
}());
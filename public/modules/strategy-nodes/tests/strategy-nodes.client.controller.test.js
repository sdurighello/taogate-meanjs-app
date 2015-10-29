'use strict';

(function() {
	// Strategy nodes Controller Spec
	describe('Strategy nodes Controller Tests', function() {
		// Initialize global variables
		var StrategyNodesController,
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

			// Initialize the Strategy nodes controller.
			StrategyNodesController = $controller('StrategyNodesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Strategy node object fetched from XHR', inject(function(StrategyNodes) {
			// Create sample Strategy node using the Strategy nodes service
			var sampleStrategyNode = new StrategyNodes({
				name: 'New Strategy node'
			});

			// Create a sample Strategy nodes array that includes the new Strategy node
			var sampleStrategyNodes = [sampleStrategyNode];

			// Set GET response
			$httpBackend.expectGET('strategy-nodes').respond(sampleStrategyNodes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.strategyNodes).toEqualData(sampleStrategyNodes);
		}));

		it('$scope.findOne() should create an array with one Strategy node object fetched from XHR using a strategyNodeId URL parameter', inject(function(StrategyNodes) {
			// Define a sample Strategy node object
			var sampleStrategyNode = new StrategyNodes({
				name: 'New Strategy node'
			});

			// Set the URL parameter
			$stateParams.strategyNodeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/strategy-nodes\/([0-9a-fA-F]{24})$/).respond(sampleStrategyNode);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.strategyNode).toEqualData(sampleStrategyNode);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(StrategyNodes) {
			// Create a sample Strategy node object
			var sampleStrategyNodePostData = new StrategyNodes({
				name: 'New Strategy node'
			});

			// Create a sample Strategy node response
			var sampleStrategyNodeResponse = new StrategyNodes({
				_id: '525cf20451979dea2c000001',
				name: 'New Strategy node'
			});

			// Fixture mock form input values
			scope.name = 'New Strategy node';

			// Set POST response
			$httpBackend.expectPOST('strategy-nodes', sampleStrategyNodePostData).respond(sampleStrategyNodeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Strategy node was created
			expect($location.path()).toBe('/strategy-nodes/' + sampleStrategyNodeResponse._id);
		}));

		it('$scope.update() should update a valid Strategy node', inject(function(StrategyNodes) {
			// Define a sample Strategy node put data
			var sampleStrategyNodePutData = new StrategyNodes({
				_id: '525cf20451979dea2c000001',
				name: 'New Strategy node'
			});

			// Mock Strategy node in scope
			scope.strategyNode = sampleStrategyNodePutData;

			// Set PUT response
			$httpBackend.expectPUT(/strategy-nodes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/strategy-nodes/' + sampleStrategyNodePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid strategyNodeId and remove the Strategy node from the scope', inject(function(StrategyNodes) {
			// Create new Strategy node object
			var sampleStrategyNode = new StrategyNodes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Strategy nodes array and include the Strategy node
			scope.strategyNodes = [sampleStrategyNode];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/strategy-nodes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStrategyNode);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.strategyNodes.length).toBe(0);
		}));
	});
}());
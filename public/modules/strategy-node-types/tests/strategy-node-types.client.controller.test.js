'use strict';

(function() {
	// Strategy node types Controller Spec
	describe('Strategy node types Controller Tests', function() {
		// Initialize global variables
		var StrategyNodeTypesController,
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

			// Initialize the Strategy node types controller.
			StrategyNodeTypesController = $controller('StrategyNodeTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Strategy node type object fetched from XHR', inject(function(StrategyNodeTypes) {
			// Create sample Strategy node type using the Strategy node types service
			var sampleStrategyNodeType = new StrategyNodeTypes({
				name: 'New Strategy node type'
			});

			// Create a sample Strategy node types array that includes the new Strategy node type
			var sampleStrategyNodeTypes = [sampleStrategyNodeType];

			// Set GET response
			$httpBackend.expectGET('strategy-node-types').respond(sampleStrategyNodeTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.strategyNodeTypes).toEqualData(sampleStrategyNodeTypes);
		}));

		it('$scope.findOne() should create an array with one Strategy node type object fetched from XHR using a strategyNodeTypeId URL parameter', inject(function(StrategyNodeTypes) {
			// Define a sample Strategy node type object
			var sampleStrategyNodeType = new StrategyNodeTypes({
				name: 'New Strategy node type'
			});

			// Set the URL parameter
			$stateParams.strategyNodeTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/strategy-node-types\/([0-9a-fA-F]{24})$/).respond(sampleStrategyNodeType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.strategyNodeType).toEqualData(sampleStrategyNodeType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(StrategyNodeTypes) {
			// Create a sample Strategy node type object
			var sampleStrategyNodeTypePostData = new StrategyNodeTypes({
				name: 'New Strategy node type'
			});

			// Create a sample Strategy node type response
			var sampleStrategyNodeTypeResponse = new StrategyNodeTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Strategy node type'
			});

			// Fixture mock form input values
			scope.name = 'New Strategy node type';

			// Set POST response
			$httpBackend.expectPOST('strategy-node-types', sampleStrategyNodeTypePostData).respond(sampleStrategyNodeTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Strategy node type was created
			expect($location.path()).toBe('/strategy-node-types/' + sampleStrategyNodeTypeResponse._id);
		}));

		it('$scope.update() should update a valid Strategy node type', inject(function(StrategyNodeTypes) {
			// Define a sample Strategy node type put data
			var sampleStrategyNodeTypePutData = new StrategyNodeTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Strategy node type'
			});

			// Mock Strategy node type in scope
			scope.strategyNodeType = sampleStrategyNodeTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/strategy-node-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/strategy-node-types/' + sampleStrategyNodeTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid strategyNodeTypeId and remove the Strategy node type from the scope', inject(function(StrategyNodeTypes) {
			// Create new Strategy node type object
			var sampleStrategyNodeType = new StrategyNodeTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Strategy node types array and include the Strategy node type
			scope.strategyNodeTypes = [sampleStrategyNodeType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/strategy-node-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStrategyNodeType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.strategyNodeTypes.length).toBe(0);
		}));
	});
}());
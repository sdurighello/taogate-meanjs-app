'use strict';

(function() {
	// Dependency impacts Controller Spec
	describe('Dependency impacts Controller Tests', function() {
		// Initialize global variables
		var DependencyImpactsController,
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

			// Initialize the Dependency impacts controller.
			DependencyImpactsController = $controller('DependencyImpactsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dependency impact object fetched from XHR', inject(function(DependencyImpacts) {
			// Create sample Dependency impact using the Dependency impacts service
			var sampleDependencyImpact = new DependencyImpacts({
				name: 'New Dependency impact'
			});

			// Create a sample Dependency impacts array that includes the new Dependency impact
			var sampleDependencyImpacts = [sampleDependencyImpact];

			// Set GET response
			$httpBackend.expectGET('dependency-impacts').respond(sampleDependencyImpacts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependencyImpacts).toEqualData(sampleDependencyImpacts);
		}));

		it('$scope.findOne() should create an array with one Dependency impact object fetched from XHR using a dependencyImpactId URL parameter', inject(function(DependencyImpacts) {
			// Define a sample Dependency impact object
			var sampleDependencyImpact = new DependencyImpacts({
				name: 'New Dependency impact'
			});

			// Set the URL parameter
			$stateParams.dependencyImpactId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dependency-impacts\/([0-9a-fA-F]{24})$/).respond(sampleDependencyImpact);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependencyImpact).toEqualData(sampleDependencyImpact);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(DependencyImpacts) {
			// Create a sample Dependency impact object
			var sampleDependencyImpactPostData = new DependencyImpacts({
				name: 'New Dependency impact'
			});

			// Create a sample Dependency impact response
			var sampleDependencyImpactResponse = new DependencyImpacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependency impact'
			});

			// Fixture mock form input values
			scope.name = 'New Dependency impact';

			// Set POST response
			$httpBackend.expectPOST('dependency-impacts', sampleDependencyImpactPostData).respond(sampleDependencyImpactResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dependency impact was created
			expect($location.path()).toBe('/dependency-impacts/' + sampleDependencyImpactResponse._id);
		}));

		it('$scope.update() should update a valid Dependency impact', inject(function(DependencyImpacts) {
			// Define a sample Dependency impact put data
			var sampleDependencyImpactPutData = new DependencyImpacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependency impact'
			});

			// Mock Dependency impact in scope
			scope.dependencyImpact = sampleDependencyImpactPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dependency-impacts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dependency-impacts/' + sampleDependencyImpactPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dependencyImpactId and remove the Dependency impact from the scope', inject(function(DependencyImpacts) {
			// Create new Dependency impact object
			var sampleDependencyImpact = new DependencyImpacts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dependency impacts array and include the Dependency impact
			scope.dependencyImpacts = [sampleDependencyImpact];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dependency-impacts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDependencyImpact);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dependencyImpacts.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Dependency types Controller Spec
	describe('Dependency types Controller Tests', function() {
		// Initialize global variables
		var DependencyTypesController,
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

			// Initialize the Dependency types controller.
			DependencyTypesController = $controller('DependencyTypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dependency type object fetched from XHR', inject(function(DependencyTypes) {
			// Create sample Dependency type using the Dependency types service
			var sampleDependencyType = new DependencyTypes({
				name: 'New Dependency type'
			});

			// Create a sample Dependency types array that includes the new Dependency type
			var sampleDependencyTypes = [sampleDependencyType];

			// Set GET response
			$httpBackend.expectGET('dependency-types').respond(sampleDependencyTypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependencyTypes).toEqualData(sampleDependencyTypes);
		}));

		it('$scope.findOne() should create an array with one Dependency type object fetched from XHR using a dependencyTypeId URL parameter', inject(function(DependencyTypes) {
			// Define a sample Dependency type object
			var sampleDependencyType = new DependencyTypes({
				name: 'New Dependency type'
			});

			// Set the URL parameter
			$stateParams.dependencyTypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dependency-types\/([0-9a-fA-F]{24})$/).respond(sampleDependencyType);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependencyType).toEqualData(sampleDependencyType);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(DependencyTypes) {
			// Create a sample Dependency type object
			var sampleDependencyTypePostData = new DependencyTypes({
				name: 'New Dependency type'
			});

			// Create a sample Dependency type response
			var sampleDependencyTypeResponse = new DependencyTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependency type'
			});

			// Fixture mock form input values
			scope.name = 'New Dependency type';

			// Set POST response
			$httpBackend.expectPOST('dependency-types', sampleDependencyTypePostData).respond(sampleDependencyTypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dependency type was created
			expect($location.path()).toBe('/dependency-types/' + sampleDependencyTypeResponse._id);
		}));

		it('$scope.update() should update a valid Dependency type', inject(function(DependencyTypes) {
			// Define a sample Dependency type put data
			var sampleDependencyTypePutData = new DependencyTypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependency type'
			});

			// Mock Dependency type in scope
			scope.dependencyType = sampleDependencyTypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/dependency-types\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dependency-types/' + sampleDependencyTypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dependencyTypeId and remove the Dependency type from the scope', inject(function(DependencyTypes) {
			// Create new Dependency type object
			var sampleDependencyType = new DependencyTypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dependency types array and include the Dependency type
			scope.dependencyTypes = [sampleDependencyType];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dependency-types\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDependencyType);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dependencyTypes.length).toBe(0);
		}));
	});
}());
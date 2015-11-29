'use strict';

(function() {
	// Dependencies Controller Spec
	describe('Dependencies Controller Tests', function() {
		// Initialize global variables
		var DependenciesController,
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

			// Initialize the Dependencies controller.
			DependenciesController = $controller('DependenciesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dependency object fetched from XHR', inject(function(Dependencies) {
			// Create sample Dependency using the Dependencies service
			var sampleDependency = new Dependencies({
				name: 'New Dependency'
			});

			// Create a sample Dependencies array that includes the new Dependency
			var sampleDependencies = [sampleDependency];

			// Set GET response
			$httpBackend.expectGET('dependencies').respond(sampleDependencies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependencies).toEqualData(sampleDependencies);
		}));

		it('$scope.findOne() should create an array with one Dependency object fetched from XHR using a dependencyId URL parameter', inject(function(Dependencies) {
			// Define a sample Dependency object
			var sampleDependency = new Dependencies({
				name: 'New Dependency'
			});

			// Set the URL parameter
			$stateParams.dependencyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dependencies\/([0-9a-fA-F]{24})$/).respond(sampleDependency);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dependency).toEqualData(sampleDependency);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dependencies) {
			// Create a sample Dependency object
			var sampleDependencyPostData = new Dependencies({
				name: 'New Dependency'
			});

			// Create a sample Dependency response
			var sampleDependencyResponse = new Dependencies({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependency'
			});

			// Fixture mock form input values
			scope.name = 'New Dependency';

			// Set POST response
			$httpBackend.expectPOST('dependencies', sampleDependencyPostData).respond(sampleDependencyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dependency was created
			expect($location.path()).toBe('/dependencies/' + sampleDependencyResponse._id);
		}));

		it('$scope.update() should update a valid Dependency', inject(function(Dependencies) {
			// Define a sample Dependency put data
			var sampleDependencyPutData = new Dependencies({
				_id: '525cf20451979dea2c000001',
				name: 'New Dependency'
			});

			// Mock Dependency in scope
			scope.dependency = sampleDependencyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dependencies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dependencies/' + sampleDependencyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dependencyId and remove the Dependency from the scope', inject(function(Dependencies) {
			// Create new Dependency object
			var sampleDependency = new Dependencies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dependencies array and include the Dependency
			scope.dependencies = [sampleDependency];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dependencies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDependency);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dependencies.length).toBe(0);
		}));
	});
}());
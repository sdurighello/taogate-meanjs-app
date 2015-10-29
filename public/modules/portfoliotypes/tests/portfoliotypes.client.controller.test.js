'use strict';

(function() {
	// Portfoliotypes Controller Spec
	describe('Portfoliotypes Controller Tests', function() {
		// Initialize global variables
		var PortfoliotypesController,
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

			// Initialize the Portfoliotypes controller.
			PortfoliotypesController = $controller('PortfoliotypesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfoliotype object fetched from XHR', inject(function(Portfoliotypes) {
			// Create sample Portfoliotype using the Portfoliotypes service
			var samplePortfoliotype = new Portfoliotypes({
				name: 'New Portfoliotype'
			});

			// Create a sample Portfoliotypes array that includes the new Portfoliotype
			var samplePortfoliotypes = [samplePortfoliotype];

			// Set GET response
			$httpBackend.expectGET('portfoliotypes').respond(samplePortfoliotypes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfoliotypes).toEqualData(samplePortfoliotypes);
		}));

		it('$scope.findOne() should create an array with one Portfoliotype object fetched from XHR using a portfoliotypeId URL parameter', inject(function(Portfoliotypes) {
			// Define a sample Portfoliotype object
			var samplePortfoliotype = new Portfoliotypes({
				name: 'New Portfoliotype'
			});

			// Set the URL parameter
			$stateParams.portfoliotypeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfoliotypes\/([0-9a-fA-F]{24})$/).respond(samplePortfoliotype);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfoliotype).toEqualData(samplePortfoliotype);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Portfoliotypes) {
			// Create a sample Portfoliotype object
			var samplePortfoliotypePostData = new Portfoliotypes({
				name: 'New Portfoliotype'
			});

			// Create a sample Portfoliotype response
			var samplePortfoliotypeResponse = new Portfoliotypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfoliotype'
			});

			// Fixture mock form input values
			scope.name = 'New Portfoliotype';

			// Set POST response
			$httpBackend.expectPOST('portfoliotypes', samplePortfoliotypePostData).respond(samplePortfoliotypeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfoliotype was created
			expect($location.path()).toBe('/portfoliotypes/' + samplePortfoliotypeResponse._id);
		}));

		it('$scope.update() should update a valid Portfoliotype', inject(function(Portfoliotypes) {
			// Define a sample Portfoliotype put data
			var samplePortfoliotypePutData = new Portfoliotypes({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfoliotype'
			});

			// Mock Portfoliotype in scope
			scope.portfoliotype = samplePortfoliotypePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfoliotypes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfoliotypes/' + samplePortfoliotypePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfoliotypeId and remove the Portfoliotype from the scope', inject(function(Portfoliotypes) {
			// Create new Portfoliotype object
			var samplePortfoliotype = new Portfoliotypes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfoliotypes array and include the Portfoliotype
			scope.portfoliotypes = [samplePortfoliotype];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfoliotypes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfoliotype);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfoliotypes.length).toBe(0);
		}));
	});
}());
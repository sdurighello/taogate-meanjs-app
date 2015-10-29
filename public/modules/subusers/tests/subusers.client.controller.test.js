'use strict';

(function() {
	// Subusers Controller Spec
	describe('Subusers Controller Tests', function() {
		// Initialize global variables
		var SubusersController,
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

			// Initialize the Subusers controller.
			SubusersController = $controller('SubusersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Subuser object fetched from XHR', inject(function(Subusers) {
			// Create sample Subuser using the Subusers service
			var sampleSubuser = new Subusers({
				name: 'New Subuser'
			});

			// Create a sample Subusers array that includes the new Subuser
			var sampleSubusers = [sampleSubuser];

			// Set GET response
			$httpBackend.expectGET('subusers').respond(sampleSubusers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subusers).toEqualData(sampleSubusers);
		}));

		it('$scope.findOne() should create an array with one Subuser object fetched from XHR using a subuserId URL parameter', inject(function(Subusers) {
			// Define a sample Subuser object
			var sampleSubuser = new Subusers({
				name: 'New Subuser'
			});

			// Set the URL parameter
			$stateParams.subuserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/subusers\/([0-9a-fA-F]{24})$/).respond(sampleSubuser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subuser).toEqualData(sampleSubuser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Subusers) {
			// Create a sample Subuser object
			var sampleSubuserPostData = new Subusers({
				name: 'New Subuser'
			});

			// Create a sample Subuser response
			var sampleSubuserResponse = new Subusers({
				_id: '525cf20451979dea2c000001',
				name: 'New Subuser'
			});

			// Fixture mock form input values
			scope.name = 'New Subuser';

			// Set POST response
			$httpBackend.expectPOST('subusers', sampleSubuserPostData).respond(sampleSubuserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Subuser was created
			expect($location.path()).toBe('/subusers/' + sampleSubuserResponse._id);
		}));

		it('$scope.update() should update a valid Subuser', inject(function(Subusers) {
			// Define a sample Subuser put data
			var sampleSubuserPutData = new Subusers({
				_id: '525cf20451979dea2c000001',
				name: 'New Subuser'
			});

			// Mock Subuser in scope
			scope.subuser = sampleSubuserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/subusers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/subusers/' + sampleSubuserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid subuserId and remove the Subuser from the scope', inject(function(Subusers) {
			// Create new Subuser object
			var sampleSubuser = new Subusers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Subusers array and include the Subuser
			scope.subusers = [sampleSubuser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/subusers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSubuser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.subusers.length).toBe(0);
		}));
	});
}());
'use strict';

(function() {
	// Improvement activities Controller Spec
	describe('Improvement activities Controller Tests', function() {
		// Initialize global variables
		var ImprovementActivitiesController,
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

			// Initialize the Improvement activities controller.
			ImprovementActivitiesController = $controller('ImprovementActivitiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Improvement activity object fetched from XHR', inject(function(ImprovementActivities) {
			// Create sample Improvement activity using the Improvement activities service
			var sampleImprovementActivity = new ImprovementActivities({
				name: 'New Improvement activity'
			});

			// Create a sample Improvement activities array that includes the new Improvement activity
			var sampleImprovementActivities = [sampleImprovementActivity];

			// Set GET response
			$httpBackend.expectGET('improvement-activities').respond(sampleImprovementActivities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.improvementActivities).toEqualData(sampleImprovementActivities);
		}));

		it('$scope.findOne() should create an array with one Improvement activity object fetched from XHR using a improvementActivityId URL parameter', inject(function(ImprovementActivities) {
			// Define a sample Improvement activity object
			var sampleImprovementActivity = new ImprovementActivities({
				name: 'New Improvement activity'
			});

			// Set the URL parameter
			$stateParams.improvementActivityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/improvement-activities\/([0-9a-fA-F]{24})$/).respond(sampleImprovementActivity);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.improvementActivity).toEqualData(sampleImprovementActivity);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ImprovementActivities) {
			// Create a sample Improvement activity object
			var sampleImprovementActivityPostData = new ImprovementActivities({
				name: 'New Improvement activity'
			});

			// Create a sample Improvement activity response
			var sampleImprovementActivityResponse = new ImprovementActivities({
				_id: '525cf20451979dea2c000001',
				name: 'New Improvement activity'
			});

			// Fixture mock form input values
			scope.name = 'New Improvement activity';

			// Set POST response
			$httpBackend.expectPOST('improvement-activities', sampleImprovementActivityPostData).respond(sampleImprovementActivityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Improvement activity was created
			expect($location.path()).toBe('/improvement-activities/' + sampleImprovementActivityResponse._id);
		}));

		it('$scope.update() should update a valid Improvement activity', inject(function(ImprovementActivities) {
			// Define a sample Improvement activity put data
			var sampleImprovementActivityPutData = new ImprovementActivities({
				_id: '525cf20451979dea2c000001',
				name: 'New Improvement activity'
			});

			// Mock Improvement activity in scope
			scope.improvementActivity = sampleImprovementActivityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/improvement-activities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/improvement-activities/' + sampleImprovementActivityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid improvementActivityId and remove the Improvement activity from the scope', inject(function(ImprovementActivities) {
			// Create new Improvement activity object
			var sampleImprovementActivity = new ImprovementActivities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Improvement activities array and include the Improvement activity
			scope.improvementActivities = [sampleImprovementActivity];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/improvement-activities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleImprovementActivity);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.improvementActivities.length).toBe(0);
		}));
	});
}());
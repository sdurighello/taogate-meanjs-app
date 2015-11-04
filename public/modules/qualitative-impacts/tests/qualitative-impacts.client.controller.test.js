'use strict';

(function() {
	// Qualitative impacts Controller Spec
	describe('Qualitative impacts Controller Tests', function() {
		// Initialize global variables
		var QualitativeImpactsController,
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

			// Initialize the Qualitative impacts controller.
			QualitativeImpactsController = $controller('QualitativeImpactsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Qualitative impact object fetched from XHR', inject(function(QualitativeImpacts) {
			// Create sample Qualitative impact using the Qualitative impacts service
			var sampleQualitativeImpact = new QualitativeImpacts({
				name: 'New Qualitative impact'
			});

			// Create a sample Qualitative impacts array that includes the new Qualitative impact
			var sampleQualitativeImpacts = [sampleQualitativeImpact];

			// Set GET response
			$httpBackend.expectGET('qualitative-impacts').respond(sampleQualitativeImpacts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qualitativeImpacts).toEqualData(sampleQualitativeImpacts);
		}));

		it('$scope.findOne() should create an array with one Qualitative impact object fetched from XHR using a qualitativeImpactId URL parameter', inject(function(QualitativeImpacts) {
			// Define a sample Qualitative impact object
			var sampleQualitativeImpact = new QualitativeImpacts({
				name: 'New Qualitative impact'
			});

			// Set the URL parameter
			$stateParams.qualitativeImpactId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/qualitative-impacts\/([0-9a-fA-F]{24})$/).respond(sampleQualitativeImpact);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qualitativeImpact).toEqualData(sampleQualitativeImpact);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(QualitativeImpacts) {
			// Create a sample Qualitative impact object
			var sampleQualitativeImpactPostData = new QualitativeImpacts({
				name: 'New Qualitative impact'
			});

			// Create a sample Qualitative impact response
			var sampleQualitativeImpactResponse = new QualitativeImpacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Qualitative impact'
			});

			// Fixture mock form input values
			scope.name = 'New Qualitative impact';

			// Set POST response
			$httpBackend.expectPOST('qualitative-impacts', sampleQualitativeImpactPostData).respond(sampleQualitativeImpactResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Qualitative impact was created
			expect($location.path()).toBe('/qualitative-impacts/' + sampleQualitativeImpactResponse._id);
		}));

		it('$scope.update() should update a valid Qualitative impact', inject(function(QualitativeImpacts) {
			// Define a sample Qualitative impact put data
			var sampleQualitativeImpactPutData = new QualitativeImpacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Qualitative impact'
			});

			// Mock Qualitative impact in scope
			scope.qualitativeImpact = sampleQualitativeImpactPutData;

			// Set PUT response
			$httpBackend.expectPUT(/qualitative-impacts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/qualitative-impacts/' + sampleQualitativeImpactPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid qualitativeImpactId and remove the Qualitative impact from the scope', inject(function(QualitativeImpacts) {
			// Create new Qualitative impact object
			var sampleQualitativeImpact = new QualitativeImpacts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Qualitative impacts array and include the Qualitative impact
			scope.qualitativeImpacts = [sampleQualitativeImpact];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/qualitative-impacts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQualitativeImpact);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.qualitativeImpacts.length).toBe(0);
		}));
	});
}());
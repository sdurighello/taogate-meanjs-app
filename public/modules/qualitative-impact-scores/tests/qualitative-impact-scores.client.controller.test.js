'use strict';

(function() {
	// Qualitative impact scores Controller Spec
	describe('Qualitative impact scores Controller Tests', function() {
		// Initialize global variables
		var QualitativeImpactScoresController,
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

			// Initialize the Qualitative impact scores controller.
			QualitativeImpactScoresController = $controller('QualitativeImpactScoresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Qualitative impact score object fetched from XHR', inject(function(QualitativeImpactScores) {
			// Create sample Qualitative impact score using the Qualitative impact scores service
			var sampleQualitativeImpactScore = new QualitativeImpactScores({
				name: 'New Qualitative impact score'
			});

			// Create a sample Qualitative impact scores array that includes the new Qualitative impact score
			var sampleQualitativeImpactScores = [sampleQualitativeImpactScore];

			// Set GET response
			$httpBackend.expectGET('qualitative-impact-scores').respond(sampleQualitativeImpactScores);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qualitativeImpactScores).toEqualData(sampleQualitativeImpactScores);
		}));

		it('$scope.findOne() should create an array with one Qualitative impact score object fetched from XHR using a qualitativeImpactScoreId URL parameter', inject(function(QualitativeImpactScores) {
			// Define a sample Qualitative impact score object
			var sampleQualitativeImpactScore = new QualitativeImpactScores({
				name: 'New Qualitative impact score'
			});

			// Set the URL parameter
			$stateParams.qualitativeImpactScoreId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/qualitative-impact-scores\/([0-9a-fA-F]{24})$/).respond(sampleQualitativeImpactScore);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qualitativeImpactScore).toEqualData(sampleQualitativeImpactScore);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(QualitativeImpactScores) {
			// Create a sample Qualitative impact score object
			var sampleQualitativeImpactScorePostData = new QualitativeImpactScores({
				name: 'New Qualitative impact score'
			});

			// Create a sample Qualitative impact score response
			var sampleQualitativeImpactScoreResponse = new QualitativeImpactScores({
				_id: '525cf20451979dea2c000001',
				name: 'New Qualitative impact score'
			});

			// Fixture mock form input values
			scope.name = 'New Qualitative impact score';

			// Set POST response
			$httpBackend.expectPOST('qualitative-impact-scores', sampleQualitativeImpactScorePostData).respond(sampleQualitativeImpactScoreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Qualitative impact score was created
			expect($location.path()).toBe('/qualitative-impact-scores/' + sampleQualitativeImpactScoreResponse._id);
		}));

		it('$scope.update() should update a valid Qualitative impact score', inject(function(QualitativeImpactScores) {
			// Define a sample Qualitative impact score put data
			var sampleQualitativeImpactScorePutData = new QualitativeImpactScores({
				_id: '525cf20451979dea2c000001',
				name: 'New Qualitative impact score'
			});

			// Mock Qualitative impact score in scope
			scope.qualitativeImpactScore = sampleQualitativeImpactScorePutData;

			// Set PUT response
			$httpBackend.expectPUT(/qualitative-impact-scores\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/qualitative-impact-scores/' + sampleQualitativeImpactScorePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid qualitativeImpactScoreId and remove the Qualitative impact score from the scope', inject(function(QualitativeImpactScores) {
			// Create new Qualitative impact score object
			var sampleQualitativeImpactScore = new QualitativeImpactScores({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Qualitative impact scores array and include the Qualitative impact score
			scope.qualitativeImpactScores = [sampleQualitativeImpactScore];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/qualitative-impact-scores\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQualitativeImpactScore);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.qualitativeImpactScores.length).toBe(0);
		}));
	});
}());
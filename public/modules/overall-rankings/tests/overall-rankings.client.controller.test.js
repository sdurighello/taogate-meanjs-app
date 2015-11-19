'use strict';

(function() {
	// Overall rankings Controller Spec
	describe('Overall rankings Controller Tests', function() {
		// Initialize global variables
		var OverallRankingsController,
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

			// Initialize the Overall rankings controller.
			OverallRankingsController = $controller('OverallRankingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Overall ranking object fetched from XHR', inject(function(OverallRankings) {
			// Create sample Overall ranking using the Overall rankings service
			var sampleOverallRanking = new OverallRankings({
				name: 'New Overall ranking'
			});

			// Create a sample Overall rankings array that includes the new Overall ranking
			var sampleOverallRankings = [sampleOverallRanking];

			// Set GET response
			$httpBackend.expectGET('overall-rankings').respond(sampleOverallRankings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.overallRankings).toEqualData(sampleOverallRankings);
		}));

		it('$scope.findOne() should create an array with one Overall ranking object fetched from XHR using a overallRankingId URL parameter', inject(function(OverallRankings) {
			// Define a sample Overall ranking object
			var sampleOverallRanking = new OverallRankings({
				name: 'New Overall ranking'
			});

			// Set the URL parameter
			$stateParams.overallRankingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/overall-rankings\/([0-9a-fA-F]{24})$/).respond(sampleOverallRanking);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.overallRanking).toEqualData(sampleOverallRanking);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(OverallRankings) {
			// Create a sample Overall ranking object
			var sampleOverallRankingPostData = new OverallRankings({
				name: 'New Overall ranking'
			});

			// Create a sample Overall ranking response
			var sampleOverallRankingResponse = new OverallRankings({
				_id: '525cf20451979dea2c000001',
				name: 'New Overall ranking'
			});

			// Fixture mock form input values
			scope.name = 'New Overall ranking';

			// Set POST response
			$httpBackend.expectPOST('overall-rankings', sampleOverallRankingPostData).respond(sampleOverallRankingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Overall ranking was created
			expect($location.path()).toBe('/overall-rankings/' + sampleOverallRankingResponse._id);
		}));

		it('$scope.update() should update a valid Overall ranking', inject(function(OverallRankings) {
			// Define a sample Overall ranking put data
			var sampleOverallRankingPutData = new OverallRankings({
				_id: '525cf20451979dea2c000001',
				name: 'New Overall ranking'
			});

			// Mock Overall ranking in scope
			scope.overallRanking = sampleOverallRankingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/overall-rankings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/overall-rankings/' + sampleOverallRankingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid overallRankingId and remove the Overall ranking from the scope', inject(function(OverallRankings) {
			// Create new Overall ranking object
			var sampleOverallRanking = new OverallRankings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Overall rankings array and include the Overall ranking
			scope.overallRankings = [sampleOverallRanking];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/overall-rankings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOverallRanking);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.overallRankings.length).toBe(0);
		}));
	});
}());
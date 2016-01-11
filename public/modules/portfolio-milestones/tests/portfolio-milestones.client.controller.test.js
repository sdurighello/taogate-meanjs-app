'use strict';

(function() {
	// Portfolio milestones Controller Spec
	describe('Portfolio milestones Controller Tests', function() {
		// Initialize global variables
		var PortfolioMilestonesController,
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

			// Initialize the Portfolio milestones controller.
			PortfolioMilestonesController = $controller('PortfolioMilestonesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio milestone object fetched from XHR', inject(function(PortfolioMilestones) {
			// Create sample Portfolio milestone using the Portfolio milestones service
			var samplePortfolioMilestone = new PortfolioMilestones({
				name: 'New Portfolio milestone'
			});

			// Create a sample Portfolio milestones array that includes the new Portfolio milestone
			var samplePortfolioMilestones = [samplePortfolioMilestone];

			// Set GET response
			$httpBackend.expectGET('portfolio-milestones').respond(samplePortfolioMilestones);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioMilestones).toEqualData(samplePortfolioMilestones);
		}));

		it('$scope.findOne() should create an array with one Portfolio milestone object fetched from XHR using a portfolioMilestoneId URL parameter', inject(function(PortfolioMilestones) {
			// Define a sample Portfolio milestone object
			var samplePortfolioMilestone = new PortfolioMilestones({
				name: 'New Portfolio milestone'
			});

			// Set the URL parameter
			$stateParams.portfolioMilestoneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-milestones\/([0-9a-fA-F]{24})$/).respond(samplePortfolioMilestone);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioMilestone).toEqualData(samplePortfolioMilestone);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioMilestones) {
			// Create a sample Portfolio milestone object
			var samplePortfolioMilestonePostData = new PortfolioMilestones({
				name: 'New Portfolio milestone'
			});

			// Create a sample Portfolio milestone response
			var samplePortfolioMilestoneResponse = new PortfolioMilestones({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio milestone'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio milestone';

			// Set POST response
			$httpBackend.expectPOST('portfolio-milestones', samplePortfolioMilestonePostData).respond(samplePortfolioMilestoneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio milestone was created
			expect($location.path()).toBe('/portfolio-milestones/' + samplePortfolioMilestoneResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio milestone', inject(function(PortfolioMilestones) {
			// Define a sample Portfolio milestone put data
			var samplePortfolioMilestonePutData = new PortfolioMilestones({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio milestone'
			});

			// Mock Portfolio milestone in scope
			scope.portfolioMilestone = samplePortfolioMilestonePutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-milestones\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-milestones/' + samplePortfolioMilestonePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioMilestoneId and remove the Portfolio milestone from the scope', inject(function(PortfolioMilestones) {
			// Create new Portfolio milestone object
			var samplePortfolioMilestone = new PortfolioMilestones({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio milestones array and include the Portfolio milestone
			scope.portfolioMilestones = [samplePortfolioMilestone];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-milestones\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioMilestone);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioMilestones.length).toBe(0);
		}));
	});
}());
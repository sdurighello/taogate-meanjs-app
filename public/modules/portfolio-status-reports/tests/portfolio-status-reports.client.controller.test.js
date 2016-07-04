'use strict';

(function() {
	// Portfolio status reports Controller Spec
	describe('Portfolio status reports Controller Tests', function() {
		// Initialize global variables
		var PortfolioStatusReportsController,
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

			// Initialize the Portfolio status reports controller.
			PortfolioStatusReportsController = $controller('PortfolioStatusReportsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Portfolio status report object fetched from XHR', inject(function(PortfolioStatusReports) {
			// Create sample Portfolio status report using the Portfolio status reports service
			var samplePortfolioStatusReport = new PortfolioStatusReports({
				name: 'New Portfolio status report'
			});

			// Create a sample Portfolio status reports array that includes the new Portfolio status report
			var samplePortfolioStatusReports = [samplePortfolioStatusReport];

			// Set GET response
			$httpBackend.expectGET('portfolio-status-reports').respond(samplePortfolioStatusReports);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioStatusReports).toEqualData(samplePortfolioStatusReports);
		}));

		it('$scope.findOne() should create an array with one Portfolio status report object fetched from XHR using a portfolioStatusReportId URL parameter', inject(function(PortfolioStatusReports) {
			// Define a sample Portfolio status report object
			var samplePortfolioStatusReport = new PortfolioStatusReports({
				name: 'New Portfolio status report'
			});

			// Set the URL parameter
			$stateParams.portfolioStatusReportId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/portfolio-status-reports\/([0-9a-fA-F]{24})$/).respond(samplePortfolioStatusReport);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.portfolioStatusReport).toEqualData(samplePortfolioStatusReport);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(PortfolioStatusReports) {
			// Create a sample Portfolio status report object
			var samplePortfolioStatusReportPostData = new PortfolioStatusReports({
				name: 'New Portfolio status report'
			});

			// Create a sample Portfolio status report response
			var samplePortfolioStatusReportResponse = new PortfolioStatusReports({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio status report'
			});

			// Fixture mock form input values
			scope.name = 'New Portfolio status report';

			// Set POST response
			$httpBackend.expectPOST('portfolio-status-reports', samplePortfolioStatusReportPostData).respond(samplePortfolioStatusReportResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Portfolio status report was created
			expect($location.path()).toBe('/portfolio-status-reports/' + samplePortfolioStatusReportResponse._id);
		}));

		it('$scope.update() should update a valid Portfolio status report', inject(function(PortfolioStatusReports) {
			// Define a sample Portfolio status report put data
			var samplePortfolioStatusReportPutData = new PortfolioStatusReports({
				_id: '525cf20451979dea2c000001',
				name: 'New Portfolio status report'
			});

			// Mock Portfolio status report in scope
			scope.portfolioStatusReport = samplePortfolioStatusReportPutData;

			// Set PUT response
			$httpBackend.expectPUT(/portfolio-status-reports\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/portfolio-status-reports/' + samplePortfolioStatusReportPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid portfolioStatusReportId and remove the Portfolio status report from the scope', inject(function(PortfolioStatusReports) {
			// Create new Portfolio status report object
			var samplePortfolioStatusReport = new PortfolioStatusReports({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Portfolio status reports array and include the Portfolio status report
			scope.portfolioStatusReports = [samplePortfolioStatusReport];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/portfolio-status-reports\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePortfolioStatusReport);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.portfolioStatusReports.length).toBe(0);
		}));
	});
}());
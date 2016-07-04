'use strict';

(function() {
	// Gate process templates Controller Spec
	describe('Gate process templates Controller Tests', function() {
		// Initialize global variables
		var GateProcessTemplatesController,
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

			// Initialize the Gate process templates controller.
			GateProcessTemplatesController = $controller('GateProcessTemplatesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gate process template object fetched from XHR', inject(function(GateProcessTemplates) {
			// Create sample Gate process template using the Gate process templates service
			var sampleGateProcessTemplate = new GateProcessTemplates({
				name: 'New Gate process template'
			});

			// Create a sample Gate process templates array that includes the new Gate process template
			var sampleGateProcessTemplates = [sampleGateProcessTemplate];

			// Set GET response
			$httpBackend.expectGET('gate-process-templates').respond(sampleGateProcessTemplates);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateProcessTemplates).toEqualData(sampleGateProcessTemplates);
		}));

		it('$scope.findOne() should create an array with one Gate process template object fetched from XHR using a gateProcessTemplateId URL parameter', inject(function(GateProcessTemplates) {
			// Define a sample Gate process template object
			var sampleGateProcessTemplate = new GateProcessTemplates({
				name: 'New Gate process template'
			});

			// Set the URL parameter
			$stateParams.gateProcessTemplateId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gate-process-templates\/([0-9a-fA-F]{24})$/).respond(sampleGateProcessTemplate);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gateProcessTemplate).toEqualData(sampleGateProcessTemplate);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(GateProcessTemplates) {
			// Create a sample Gate process template object
			var sampleGateProcessTemplatePostData = new GateProcessTemplates({
				name: 'New Gate process template'
			});

			// Create a sample Gate process template response
			var sampleGateProcessTemplateResponse = new GateProcessTemplates({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate process template'
			});

			// Fixture mock form input values
			scope.name = 'New Gate process template';

			// Set POST response
			$httpBackend.expectPOST('gate-process-templates', sampleGateProcessTemplatePostData).respond(sampleGateProcessTemplateResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gate process template was created
			expect($location.path()).toBe('/gate-process-templates/' + sampleGateProcessTemplateResponse._id);
		}));

		it('$scope.update() should update a valid Gate process template', inject(function(GateProcessTemplates) {
			// Define a sample Gate process template put data
			var sampleGateProcessTemplatePutData = new GateProcessTemplates({
				_id: '525cf20451979dea2c000001',
				name: 'New Gate process template'
			});

			// Mock Gate process template in scope
			scope.gateProcessTemplate = sampleGateProcessTemplatePutData;

			// Set PUT response
			$httpBackend.expectPUT(/gate-process-templates\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gate-process-templates/' + sampleGateProcessTemplatePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gateProcessTemplateId and remove the Gate process template from the scope', inject(function(GateProcessTemplates) {
			// Create new Gate process template object
			var sampleGateProcessTemplate = new GateProcessTemplates({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gate process templates array and include the Gate process template
			scope.gateProcessTemplates = [sampleGateProcessTemplate];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gate-process-templates\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGateProcessTemplate);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gateProcessTemplates.length).toBe(0);
		}));
	});
}());
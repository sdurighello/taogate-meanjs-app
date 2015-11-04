'use strict';

(function() {
	// Qualitative impact groups Controller Spec
	describe('Qualitative impact groups Controller Tests', function() {
		// Initialize global variables
		var QualitativeImpactGroupsController,
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

			// Initialize the Qualitative impact groups controller.
			QualitativeImpactGroupsController = $controller('QualitativeImpactGroupsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Qualitative impact group object fetched from XHR', inject(function(QualitativeImpactGroups) {
			// Create sample Qualitative impact group using the Qualitative impact groups service
			var sampleQualitativeImpactGroup = new QualitativeImpactGroups({
				name: 'New Qualitative impact group'
			});

			// Create a sample Qualitative impact groups array that includes the new Qualitative impact group
			var sampleQualitativeImpactGroups = [sampleQualitativeImpactGroup];

			// Set GET response
			$httpBackend.expectGET('qualitative-impact-groups').respond(sampleQualitativeImpactGroups);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qualitativeImpactGroups).toEqualData(sampleQualitativeImpactGroups);
		}));

		it('$scope.findOne() should create an array with one Qualitative impact group object fetched from XHR using a qualitativeImpactGroupId URL parameter', inject(function(QualitativeImpactGroups) {
			// Define a sample Qualitative impact group object
			var sampleQualitativeImpactGroup = new QualitativeImpactGroups({
				name: 'New Qualitative impact group'
			});

			// Set the URL parameter
			$stateParams.qualitativeImpactGroupId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/qualitative-impact-groups\/([0-9a-fA-F]{24})$/).respond(sampleQualitativeImpactGroup);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.qualitativeImpactGroup).toEqualData(sampleQualitativeImpactGroup);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(QualitativeImpactGroups) {
			// Create a sample Qualitative impact group object
			var sampleQualitativeImpactGroupPostData = new QualitativeImpactGroups({
				name: 'New Qualitative impact group'
			});

			// Create a sample Qualitative impact group response
			var sampleQualitativeImpactGroupResponse = new QualitativeImpactGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Qualitative impact group'
			});

			// Fixture mock form input values
			scope.name = 'New Qualitative impact group';

			// Set POST response
			$httpBackend.expectPOST('qualitative-impact-groups', sampleQualitativeImpactGroupPostData).respond(sampleQualitativeImpactGroupResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Qualitative impact group was created
			expect($location.path()).toBe('/qualitative-impact-groups/' + sampleQualitativeImpactGroupResponse._id);
		}));

		it('$scope.update() should update a valid Qualitative impact group', inject(function(QualitativeImpactGroups) {
			// Define a sample Qualitative impact group put data
			var sampleQualitativeImpactGroupPutData = new QualitativeImpactGroups({
				_id: '525cf20451979dea2c000001',
				name: 'New Qualitative impact group'
			});

			// Mock Qualitative impact group in scope
			scope.qualitativeImpactGroup = sampleQualitativeImpactGroupPutData;

			// Set PUT response
			$httpBackend.expectPUT(/qualitative-impact-groups\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/qualitative-impact-groups/' + sampleQualitativeImpactGroupPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid qualitativeImpactGroupId and remove the Qualitative impact group from the scope', inject(function(QualitativeImpactGroups) {
			// Create new Qualitative impact group object
			var sampleQualitativeImpactGroup = new QualitativeImpactGroups({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Qualitative impact groups array and include the Qualitative impact group
			scope.qualitativeImpactGroups = [sampleQualitativeImpactGroup];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/qualitative-impact-groups\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleQualitativeImpactGroup);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.qualitativeImpactGroups.length).toBe(0);
		}));
	});
}());
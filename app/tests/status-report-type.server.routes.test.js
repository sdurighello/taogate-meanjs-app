'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	StatusReportType = mongoose.model('StatusReportType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, statusReportType;

/**
 * Status report type routes tests
 */
describe('Status report type CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Status report type
		user.save(function() {
			statusReportType = {
				name: 'Status report type Name'
			};

			done();
		});
	});

	it('should be able to save Status report type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status report type
				agent.post('/status-report-types')
					.send(statusReportType)
					.expect(200)
					.end(function(statusReportTypeSaveErr, statusReportTypeSaveRes) {
						// Handle Status report type save error
						if (statusReportTypeSaveErr) done(statusReportTypeSaveErr);

						// Get a list of Status report types
						agent.get('/status-report-types')
							.end(function(statusReportTypesGetErr, statusReportTypesGetRes) {
								// Handle Status report type save error
								if (statusReportTypesGetErr) done(statusReportTypesGetErr);

								// Get Status report types list
								var statusReportTypes = statusReportTypesGetRes.body;

								// Set assertions
								(statusReportTypes[0].user._id).should.equal(userId);
								(statusReportTypes[0].name).should.match('Status report type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Status report type instance if not logged in', function(done) {
		agent.post('/status-report-types')
			.send(statusReportType)
			.expect(401)
			.end(function(statusReportTypeSaveErr, statusReportTypeSaveRes) {
				// Call the assertion callback
				done(statusReportTypeSaveErr);
			});
	});

	it('should not be able to save Status report type instance if no name is provided', function(done) {
		// Invalidate name field
		statusReportType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status report type
				agent.post('/status-report-types')
					.send(statusReportType)
					.expect(400)
					.end(function(statusReportTypeSaveErr, statusReportTypeSaveRes) {
						// Set message assertion
						(statusReportTypeSaveRes.body.message).should.match('Please fill Status report type name');
						
						// Handle Status report type save error
						done(statusReportTypeSaveErr);
					});
			});
	});

	it('should be able to update Status report type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status report type
				agent.post('/status-report-types')
					.send(statusReportType)
					.expect(200)
					.end(function(statusReportTypeSaveErr, statusReportTypeSaveRes) {
						// Handle Status report type save error
						if (statusReportTypeSaveErr) done(statusReportTypeSaveErr);

						// Update Status report type name
						statusReportType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Status report type
						agent.put('/status-report-types/' + statusReportTypeSaveRes.body._id)
							.send(statusReportType)
							.expect(200)
							.end(function(statusReportTypeUpdateErr, statusReportTypeUpdateRes) {
								// Handle Status report type update error
								if (statusReportTypeUpdateErr) done(statusReportTypeUpdateErr);

								// Set assertions
								(statusReportTypeUpdateRes.body._id).should.equal(statusReportTypeSaveRes.body._id);
								(statusReportTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Status report types if not signed in', function(done) {
		// Create new Status report type model instance
		var statusReportTypeObj = new StatusReportType(statusReportType);

		// Save the Status report type
		statusReportTypeObj.save(function() {
			// Request Status report types
			request(app).get('/status-report-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Status report type if not signed in', function(done) {
		// Create new Status report type model instance
		var statusReportTypeObj = new StatusReportType(statusReportType);

		// Save the Status report type
		statusReportTypeObj.save(function() {
			request(app).get('/status-report-types/' + statusReportTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', statusReportType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Status report type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Status report type
				agent.post('/status-report-types')
					.send(statusReportType)
					.expect(200)
					.end(function(statusReportTypeSaveErr, statusReportTypeSaveRes) {
						// Handle Status report type save error
						if (statusReportTypeSaveErr) done(statusReportTypeSaveErr);

						// Delete existing Status report type
						agent.delete('/status-report-types/' + statusReportTypeSaveRes.body._id)
							.send(statusReportType)
							.expect(200)
							.end(function(statusReportTypeDeleteErr, statusReportTypeDeleteRes) {
								// Handle Status report type error error
								if (statusReportTypeDeleteErr) done(statusReportTypeDeleteErr);

								// Set assertions
								(statusReportTypeDeleteRes.body._id).should.equal(statusReportTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Status report type instance if not signed in', function(done) {
		// Set Status report type user 
		statusReportType.user = user;

		// Create new Status report type model instance
		var statusReportTypeObj = new StatusReportType(statusReportType);

		// Save the Status report type
		statusReportTypeObj.save(function() {
			// Try deleting Status report type
			request(app).delete('/status-report-types/' + statusReportTypeObj._id)
			.expect(401)
			.end(function(statusReportTypeDeleteErr, statusReportTypeDeleteRes) {
				// Set message assertion
				(statusReportTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Status report type error error
				done(statusReportTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		StatusReportType.remove().exec();
		done();
	});
});
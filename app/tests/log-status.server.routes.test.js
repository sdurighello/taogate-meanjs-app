'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogStatus = mongoose.model('LogStatus'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logStatus;

/**
 * Log status routes tests
 */
describe('Log status CRUD tests', function() {
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

		// Save a user to the test db and create new Log status
		user.save(function() {
			logStatus = {
				name: 'Log status Name'
			};

			done();
		});
	});

	it('should be able to save Log status instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status
				agent.post('/log-statuses')
					.send(logStatus)
					.expect(200)
					.end(function(logStatusSaveErr, logStatusSaveRes) {
						// Handle Log status save error
						if (logStatusSaveErr) done(logStatusSaveErr);

						// Get a list of Log statuses
						agent.get('/log-statuses')
							.end(function(logStatusesGetErr, logStatusesGetRes) {
								// Handle Log status save error
								if (logStatusesGetErr) done(logStatusesGetErr);

								// Get Log statuses list
								var logStatuses = logStatusesGetRes.body;

								// Set assertions
								(logStatuses[0].user._id).should.equal(userId);
								(logStatuses[0].name).should.match('Log status Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Log status instance if not logged in', function(done) {
		agent.post('/log-statuses')
			.send(logStatus)
			.expect(401)
			.end(function(logStatusSaveErr, logStatusSaveRes) {
				// Call the assertion callback
				done(logStatusSaveErr);
			});
	});

	it('should not be able to save Log status instance if no name is provided', function(done) {
		// Invalidate name field
		logStatus.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status
				agent.post('/log-statuses')
					.send(logStatus)
					.expect(400)
					.end(function(logStatusSaveErr, logStatusSaveRes) {
						// Set message assertion
						(logStatusSaveRes.body.message).should.match('Please fill Log status name');
						
						// Handle Log status save error
						done(logStatusSaveErr);
					});
			});
	});

	it('should be able to update Log status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status
				agent.post('/log-statuses')
					.send(logStatus)
					.expect(200)
					.end(function(logStatusSaveErr, logStatusSaveRes) {
						// Handle Log status save error
						if (logStatusSaveErr) done(logStatusSaveErr);

						// Update Log status name
						logStatus.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Log status
						agent.put('/log-statuses/' + logStatusSaveRes.body._id)
							.send(logStatus)
							.expect(200)
							.end(function(logStatusUpdateErr, logStatusUpdateRes) {
								// Handle Log status update error
								if (logStatusUpdateErr) done(logStatusUpdateErr);

								// Set assertions
								(logStatusUpdateRes.body._id).should.equal(logStatusSaveRes.body._id);
								(logStatusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Log statuses if not signed in', function(done) {
		// Create new Log status model instance
		var logStatusObj = new LogStatus(logStatus);

		// Save the Log status
		logStatusObj.save(function() {
			// Request Log statuses
			request(app).get('/log-statuses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Log status if not signed in', function(done) {
		// Create new Log status model instance
		var logStatusObj = new LogStatus(logStatus);

		// Save the Log status
		logStatusObj.save(function() {
			request(app).get('/log-statuses/' + logStatusObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logStatus.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Log status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status
				agent.post('/log-statuses')
					.send(logStatus)
					.expect(200)
					.end(function(logStatusSaveErr, logStatusSaveRes) {
						// Handle Log status save error
						if (logStatusSaveErr) done(logStatusSaveErr);

						// Delete existing Log status
						agent.delete('/log-statuses/' + logStatusSaveRes.body._id)
							.send(logStatus)
							.expect(200)
							.end(function(logStatusDeleteErr, logStatusDeleteRes) {
								// Handle Log status error error
								if (logStatusDeleteErr) done(logStatusDeleteErr);

								// Set assertions
								(logStatusDeleteRes.body._id).should.equal(logStatusSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Log status instance if not signed in', function(done) {
		// Set Log status user 
		logStatus.user = user;

		// Create new Log status model instance
		var logStatusObj = new LogStatus(logStatus);

		// Save the Log status
		logStatusObj.save(function() {
			// Try deleting Log status
			request(app).delete('/log-statuses/' + logStatusObj._id)
			.expect(401)
			.end(function(logStatusDeleteErr, logStatusDeleteRes) {
				// Set message assertion
				(logStatusDeleteRes.body.message).should.match('User is not logged in');

				// Handle Log status error error
				done(logStatusDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LogStatus.remove().exec();
		done();
	});
});
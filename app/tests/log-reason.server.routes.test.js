'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogReason = mongoose.model('LogReason'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logReason;

/**
 * Log reason routes tests
 */
describe('Log reason CRUD tests', function() {
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

		// Save a user to the test db and create new Log reason
		user.save(function() {
			logReason = {
				name: 'Log reason Name'
			};

			done();
		});
	});

	it('should be able to save Log reason instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log reason
				agent.post('/log-reasons')
					.send(logReason)
					.expect(200)
					.end(function(logReasonSaveErr, logReasonSaveRes) {
						// Handle Log reason save error
						if (logReasonSaveErr) done(logReasonSaveErr);

						// Get a list of Log reasons
						agent.get('/log-reasons')
							.end(function(logReasonsGetErr, logReasonsGetRes) {
								// Handle Log reason save error
								if (logReasonsGetErr) done(logReasonsGetErr);

								// Get Log reasons list
								var logReasons = logReasonsGetRes.body;

								// Set assertions
								(logReasons[0].user._id).should.equal(userId);
								(logReasons[0].name).should.match('Log reason Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Log reason instance if not logged in', function(done) {
		agent.post('/log-reasons')
			.send(logReason)
			.expect(401)
			.end(function(logReasonSaveErr, logReasonSaveRes) {
				// Call the assertion callback
				done(logReasonSaveErr);
			});
	});

	it('should not be able to save Log reason instance if no name is provided', function(done) {
		// Invalidate name field
		logReason.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log reason
				agent.post('/log-reasons')
					.send(logReason)
					.expect(400)
					.end(function(logReasonSaveErr, logReasonSaveRes) {
						// Set message assertion
						(logReasonSaveRes.body.message).should.match('Please fill Log reason name');
						
						// Handle Log reason save error
						done(logReasonSaveErr);
					});
			});
	});

	it('should be able to update Log reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log reason
				agent.post('/log-reasons')
					.send(logReason)
					.expect(200)
					.end(function(logReasonSaveErr, logReasonSaveRes) {
						// Handle Log reason save error
						if (logReasonSaveErr) done(logReasonSaveErr);

						// Update Log reason name
						logReason.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Log reason
						agent.put('/log-reasons/' + logReasonSaveRes.body._id)
							.send(logReason)
							.expect(200)
							.end(function(logReasonUpdateErr, logReasonUpdateRes) {
								// Handle Log reason update error
								if (logReasonUpdateErr) done(logReasonUpdateErr);

								// Set assertions
								(logReasonUpdateRes.body._id).should.equal(logReasonSaveRes.body._id);
								(logReasonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Log reasons if not signed in', function(done) {
		// Create new Log reason model instance
		var logReasonObj = new LogReason(logReason);

		// Save the Log reason
		logReasonObj.save(function() {
			// Request Log reasons
			request(app).get('/log-reasons')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Log reason if not signed in', function(done) {
		// Create new Log reason model instance
		var logReasonObj = new LogReason(logReason);

		// Save the Log reason
		logReasonObj.save(function() {
			request(app).get('/log-reasons/' + logReasonObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logReason.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Log reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log reason
				agent.post('/log-reasons')
					.send(logReason)
					.expect(200)
					.end(function(logReasonSaveErr, logReasonSaveRes) {
						// Handle Log reason save error
						if (logReasonSaveErr) done(logReasonSaveErr);

						// Delete existing Log reason
						agent.delete('/log-reasons/' + logReasonSaveRes.body._id)
							.send(logReason)
							.expect(200)
							.end(function(logReasonDeleteErr, logReasonDeleteRes) {
								// Handle Log reason error error
								if (logReasonDeleteErr) done(logReasonDeleteErr);

								// Set assertions
								(logReasonDeleteRes.body._id).should.equal(logReasonSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Log reason instance if not signed in', function(done) {
		// Set Log reason user 
		logReason.user = user;

		// Create new Log reason model instance
		var logReasonObj = new LogReason(logReason);

		// Save the Log reason
		logReasonObj.save(function() {
			// Try deleting Log reason
			request(app).delete('/log-reasons/' + logReasonObj._id)
			.expect(401)
			.end(function(logReasonDeleteErr, logReasonDeleteRes) {
				// Set message assertion
				(logReasonDeleteRes.body.message).should.match('User is not logged in');

				// Handle Log reason error error
				done(logReasonDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LogReason.remove().exec();
		done();
	});
});
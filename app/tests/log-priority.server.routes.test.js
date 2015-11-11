'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogPriority = mongoose.model('LogPriority'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logPriority;

/**
 * Log priority routes tests
 */
describe('Log priority CRUD tests', function() {
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

		// Save a user to the test db and create new Log priority
		user.save(function() {
			logPriority = {
				name: 'Log priority Name'
			};

			done();
		});
	});

	it('should be able to save Log priority instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log priority
				agent.post('/log-priorities')
					.send(logPriority)
					.expect(200)
					.end(function(logPrioritySaveErr, logPrioritySaveRes) {
						// Handle Log priority save error
						if (logPrioritySaveErr) done(logPrioritySaveErr);

						// Get a list of Log priorities
						agent.get('/log-priorities')
							.end(function(logPrioritiesGetErr, logPrioritiesGetRes) {
								// Handle Log priority save error
								if (logPrioritiesGetErr) done(logPrioritiesGetErr);

								// Get Log priorities list
								var logPriorities = logPrioritiesGetRes.body;

								// Set assertions
								(logPriorities[0].user._id).should.equal(userId);
								(logPriorities[0].name).should.match('Log priority Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Log priority instance if not logged in', function(done) {
		agent.post('/log-priorities')
			.send(logPriority)
			.expect(401)
			.end(function(logPrioritySaveErr, logPrioritySaveRes) {
				// Call the assertion callback
				done(logPrioritySaveErr);
			});
	});

	it('should not be able to save Log priority instance if no name is provided', function(done) {
		// Invalidate name field
		logPriority.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log priority
				agent.post('/log-priorities')
					.send(logPriority)
					.expect(400)
					.end(function(logPrioritySaveErr, logPrioritySaveRes) {
						// Set message assertion
						(logPrioritySaveRes.body.message).should.match('Please fill Log priority name');
						
						// Handle Log priority save error
						done(logPrioritySaveErr);
					});
			});
	});

	it('should be able to update Log priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log priority
				agent.post('/log-priorities')
					.send(logPriority)
					.expect(200)
					.end(function(logPrioritySaveErr, logPrioritySaveRes) {
						// Handle Log priority save error
						if (logPrioritySaveErr) done(logPrioritySaveErr);

						// Update Log priority name
						logPriority.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Log priority
						agent.put('/log-priorities/' + logPrioritySaveRes.body._id)
							.send(logPriority)
							.expect(200)
							.end(function(logPriorityUpdateErr, logPriorityUpdateRes) {
								// Handle Log priority update error
								if (logPriorityUpdateErr) done(logPriorityUpdateErr);

								// Set assertions
								(logPriorityUpdateRes.body._id).should.equal(logPrioritySaveRes.body._id);
								(logPriorityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Log priorities if not signed in', function(done) {
		// Create new Log priority model instance
		var logPriorityObj = new LogPriority(logPriority);

		// Save the Log priority
		logPriorityObj.save(function() {
			// Request Log priorities
			request(app).get('/log-priorities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Log priority if not signed in', function(done) {
		// Create new Log priority model instance
		var logPriorityObj = new LogPriority(logPriority);

		// Save the Log priority
		logPriorityObj.save(function() {
			request(app).get('/log-priorities/' + logPriorityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logPriority.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Log priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log priority
				agent.post('/log-priorities')
					.send(logPriority)
					.expect(200)
					.end(function(logPrioritySaveErr, logPrioritySaveRes) {
						// Handle Log priority save error
						if (logPrioritySaveErr) done(logPrioritySaveErr);

						// Delete existing Log priority
						agent.delete('/log-priorities/' + logPrioritySaveRes.body._id)
							.send(logPriority)
							.expect(200)
							.end(function(logPriorityDeleteErr, logPriorityDeleteRes) {
								// Handle Log priority error error
								if (logPriorityDeleteErr) done(logPriorityDeleteErr);

								// Set assertions
								(logPriorityDeleteRes.body._id).should.equal(logPrioritySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Log priority instance if not signed in', function(done) {
		// Set Log priority user 
		logPriority.user = user;

		// Create new Log priority model instance
		var logPriorityObj = new LogPriority(logPriority);

		// Save the Log priority
		logPriorityObj.save(function() {
			// Try deleting Log priority
			request(app).delete('/log-priorities/' + logPriorityObj._id)
			.expect(401)
			.end(function(logPriorityDeleteErr, logPriorityDeleteRes) {
				// Set message assertion
				(logPriorityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Log priority error error
				done(logPriorityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LogPriority.remove().exec();
		done();
	});
});
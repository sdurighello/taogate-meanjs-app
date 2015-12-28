'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LogStatusArea = mongoose.model('LogStatusArea'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logStatusArea;

/**
 * Log status area routes tests
 */
describe('Log status area CRUD tests', function() {
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

		// Save a user to the test db and create new Log status area
		user.save(function() {
			logStatusArea = {
				name: 'Log status area Name'
			};

			done();
		});
	});

	it('should be able to save Log status area instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status area
				agent.post('/log-status-areas')
					.send(logStatusArea)
					.expect(200)
					.end(function(logStatusAreaSaveErr, logStatusAreaSaveRes) {
						// Handle Log status area save error
						if (logStatusAreaSaveErr) done(logStatusAreaSaveErr);

						// Get a list of Log status areas
						agent.get('/log-status-areas')
							.end(function(logStatusAreasGetErr, logStatusAreasGetRes) {
								// Handle Log status area save error
								if (logStatusAreasGetErr) done(logStatusAreasGetErr);

								// Get Log status areas list
								var logStatusAreas = logStatusAreasGetRes.body;

								// Set assertions
								(logStatusAreas[0].user._id).should.equal(userId);
								(logStatusAreas[0].name).should.match('Log status area Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Log status area instance if not logged in', function(done) {
		agent.post('/log-status-areas')
			.send(logStatusArea)
			.expect(401)
			.end(function(logStatusAreaSaveErr, logStatusAreaSaveRes) {
				// Call the assertion callback
				done(logStatusAreaSaveErr);
			});
	});

	it('should not be able to save Log status area instance if no name is provided', function(done) {
		// Invalidate name field
		logStatusArea.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status area
				agent.post('/log-status-areas')
					.send(logStatusArea)
					.expect(400)
					.end(function(logStatusAreaSaveErr, logStatusAreaSaveRes) {
						// Set message assertion
						(logStatusAreaSaveRes.body.message).should.match('Please fill Log status area name');
						
						// Handle Log status area save error
						done(logStatusAreaSaveErr);
					});
			});
	});

	it('should be able to update Log status area instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status area
				agent.post('/log-status-areas')
					.send(logStatusArea)
					.expect(200)
					.end(function(logStatusAreaSaveErr, logStatusAreaSaveRes) {
						// Handle Log status area save error
						if (logStatusAreaSaveErr) done(logStatusAreaSaveErr);

						// Update Log status area name
						logStatusArea.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Log status area
						agent.put('/log-status-areas/' + logStatusAreaSaveRes.body._id)
							.send(logStatusArea)
							.expect(200)
							.end(function(logStatusAreaUpdateErr, logStatusAreaUpdateRes) {
								// Handle Log status area update error
								if (logStatusAreaUpdateErr) done(logStatusAreaUpdateErr);

								// Set assertions
								(logStatusAreaUpdateRes.body._id).should.equal(logStatusAreaSaveRes.body._id);
								(logStatusAreaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Log status areas if not signed in', function(done) {
		// Create new Log status area model instance
		var logStatusAreaObj = new LogStatusArea(logStatusArea);

		// Save the Log status area
		logStatusAreaObj.save(function() {
			// Request Log status areas
			request(app).get('/log-status-areas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Log status area if not signed in', function(done) {
		// Create new Log status area model instance
		var logStatusAreaObj = new LogStatusArea(logStatusArea);

		// Save the Log status area
		logStatusAreaObj.save(function() {
			request(app).get('/log-status-areas/' + logStatusAreaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logStatusArea.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Log status area instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Log status area
				agent.post('/log-status-areas')
					.send(logStatusArea)
					.expect(200)
					.end(function(logStatusAreaSaveErr, logStatusAreaSaveRes) {
						// Handle Log status area save error
						if (logStatusAreaSaveErr) done(logStatusAreaSaveErr);

						// Delete existing Log status area
						agent.delete('/log-status-areas/' + logStatusAreaSaveRes.body._id)
							.send(logStatusArea)
							.expect(200)
							.end(function(logStatusAreaDeleteErr, logStatusAreaDeleteRes) {
								// Handle Log status area error error
								if (logStatusAreaDeleteErr) done(logStatusAreaDeleteErr);

								// Set assertions
								(logStatusAreaDeleteRes.body._id).should.equal(logStatusAreaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Log status area instance if not signed in', function(done) {
		// Set Log status area user 
		logStatusArea.user = user;

		// Create new Log status area model instance
		var logStatusAreaObj = new LogStatusArea(logStatusArea);

		// Save the Log status area
		logStatusAreaObj.save(function() {
			// Try deleting Log status area
			request(app).delete('/log-status-areas/' + logStatusAreaObj._id)
			.expect(401)
			.end(function(logStatusAreaDeleteErr, logStatusAreaDeleteRes) {
				// Set message assertion
				(logStatusAreaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Log status area error error
				done(logStatusAreaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LogStatusArea.remove().exec();
		done();
	});
});
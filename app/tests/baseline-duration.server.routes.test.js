'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	BaselineDuration = mongoose.model('BaselineDuration'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, baselineDuration;

/**
 * Baseline duration routes tests
 */
describe('Baseline duration CRUD tests', function() {
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

		// Save a user to the test db and create new Baseline duration
		user.save(function() {
			baselineDuration = {
				name: 'Baseline duration Name'
			};

			done();
		});
	});

	it('should be able to save Baseline duration instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline duration
				agent.post('/baseline-durations')
					.send(baselineDuration)
					.expect(200)
					.end(function(baselineDurationSaveErr, baselineDurationSaveRes) {
						// Handle Baseline duration save error
						if (baselineDurationSaveErr) done(baselineDurationSaveErr);

						// Get a list of Baseline durations
						agent.get('/baseline-durations')
							.end(function(baselineDurationsGetErr, baselineDurationsGetRes) {
								// Handle Baseline duration save error
								if (baselineDurationsGetErr) done(baselineDurationsGetErr);

								// Get Baseline durations list
								var baselineDurations = baselineDurationsGetRes.body;

								// Set assertions
								(baselineDurations[0].user._id).should.equal(userId);
								(baselineDurations[0].name).should.match('Baseline duration Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Baseline duration instance if not logged in', function(done) {
		agent.post('/baseline-durations')
			.send(baselineDuration)
			.expect(401)
			.end(function(baselineDurationSaveErr, baselineDurationSaveRes) {
				// Call the assertion callback
				done(baselineDurationSaveErr);
			});
	});

	it('should not be able to save Baseline duration instance if no name is provided', function(done) {
		// Invalidate name field
		baselineDuration.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline duration
				agent.post('/baseline-durations')
					.send(baselineDuration)
					.expect(400)
					.end(function(baselineDurationSaveErr, baselineDurationSaveRes) {
						// Set message assertion
						(baselineDurationSaveRes.body.message).should.match('Please fill Baseline duration name');
						
						// Handle Baseline duration save error
						done(baselineDurationSaveErr);
					});
			});
	});

	it('should be able to update Baseline duration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline duration
				agent.post('/baseline-durations')
					.send(baselineDuration)
					.expect(200)
					.end(function(baselineDurationSaveErr, baselineDurationSaveRes) {
						// Handle Baseline duration save error
						if (baselineDurationSaveErr) done(baselineDurationSaveErr);

						// Update Baseline duration name
						baselineDuration.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Baseline duration
						agent.put('/baseline-durations/' + baselineDurationSaveRes.body._id)
							.send(baselineDuration)
							.expect(200)
							.end(function(baselineDurationUpdateErr, baselineDurationUpdateRes) {
								// Handle Baseline duration update error
								if (baselineDurationUpdateErr) done(baselineDurationUpdateErr);

								// Set assertions
								(baselineDurationUpdateRes.body._id).should.equal(baselineDurationSaveRes.body._id);
								(baselineDurationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Baseline durations if not signed in', function(done) {
		// Create new Baseline duration model instance
		var baselineDurationObj = new BaselineDuration(baselineDuration);

		// Save the Baseline duration
		baselineDurationObj.save(function() {
			// Request Baseline durations
			request(app).get('/baseline-durations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Baseline duration if not signed in', function(done) {
		// Create new Baseline duration model instance
		var baselineDurationObj = new BaselineDuration(baselineDuration);

		// Save the Baseline duration
		baselineDurationObj.save(function() {
			request(app).get('/baseline-durations/' + baselineDurationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', baselineDuration.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Baseline duration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline duration
				agent.post('/baseline-durations')
					.send(baselineDuration)
					.expect(200)
					.end(function(baselineDurationSaveErr, baselineDurationSaveRes) {
						// Handle Baseline duration save error
						if (baselineDurationSaveErr) done(baselineDurationSaveErr);

						// Delete existing Baseline duration
						agent.delete('/baseline-durations/' + baselineDurationSaveRes.body._id)
							.send(baselineDuration)
							.expect(200)
							.end(function(baselineDurationDeleteErr, baselineDurationDeleteRes) {
								// Handle Baseline duration error error
								if (baselineDurationDeleteErr) done(baselineDurationDeleteErr);

								// Set assertions
								(baselineDurationDeleteRes.body._id).should.equal(baselineDurationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Baseline duration instance if not signed in', function(done) {
		// Set Baseline duration user 
		baselineDuration.user = user;

		// Create new Baseline duration model instance
		var baselineDurationObj = new BaselineDuration(baselineDuration);

		// Save the Baseline duration
		baselineDurationObj.save(function() {
			// Try deleting Baseline duration
			request(app).delete('/baseline-durations/' + baselineDurationObj._id)
			.expect(401)
			.end(function(baselineDurationDeleteErr, baselineDurationDeleteRes) {
				// Set message assertion
				(baselineDurationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Baseline duration error error
				done(baselineDurationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		BaselineDuration.remove().exec();
		done();
	});
});
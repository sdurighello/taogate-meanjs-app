'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EstimateDuration = mongoose.model('EstimateDuration'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, estimateDuration;

/**
 * Estimate duration routes tests
 */
describe('Estimate duration CRUD tests', function() {
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

		// Save a user to the test db and create new Estimate duration
		user.save(function() {
			estimateDuration = {
				name: 'Estimate duration Name'
			};

			done();
		});
	});

	it('should be able to save Estimate duration instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate duration
				agent.post('/estimate-durations')
					.send(estimateDuration)
					.expect(200)
					.end(function(estimateDurationSaveErr, estimateDurationSaveRes) {
						// Handle Estimate duration save error
						if (estimateDurationSaveErr) done(estimateDurationSaveErr);

						// Get a list of Estimate durations
						agent.get('/estimate-durations')
							.end(function(estimateDurationsGetErr, estimateDurationsGetRes) {
								// Handle Estimate duration save error
								if (estimateDurationsGetErr) done(estimateDurationsGetErr);

								// Get Estimate durations list
								var estimateDurations = estimateDurationsGetRes.body;

								// Set assertions
								(estimateDurations[0].user._id).should.equal(userId);
								(estimateDurations[0].name).should.match('Estimate duration Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Estimate duration instance if not logged in', function(done) {
		agent.post('/estimate-durations')
			.send(estimateDuration)
			.expect(401)
			.end(function(estimateDurationSaveErr, estimateDurationSaveRes) {
				// Call the assertion callback
				done(estimateDurationSaveErr);
			});
	});

	it('should not be able to save Estimate duration instance if no name is provided', function(done) {
		// Invalidate name field
		estimateDuration.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate duration
				agent.post('/estimate-durations')
					.send(estimateDuration)
					.expect(400)
					.end(function(estimateDurationSaveErr, estimateDurationSaveRes) {
						// Set message assertion
						(estimateDurationSaveRes.body.message).should.match('Please fill Estimate duration name');
						
						// Handle Estimate duration save error
						done(estimateDurationSaveErr);
					});
			});
	});

	it('should be able to update Estimate duration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate duration
				agent.post('/estimate-durations')
					.send(estimateDuration)
					.expect(200)
					.end(function(estimateDurationSaveErr, estimateDurationSaveRes) {
						// Handle Estimate duration save error
						if (estimateDurationSaveErr) done(estimateDurationSaveErr);

						// Update Estimate duration name
						estimateDuration.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Estimate duration
						agent.put('/estimate-durations/' + estimateDurationSaveRes.body._id)
							.send(estimateDuration)
							.expect(200)
							.end(function(estimateDurationUpdateErr, estimateDurationUpdateRes) {
								// Handle Estimate duration update error
								if (estimateDurationUpdateErr) done(estimateDurationUpdateErr);

								// Set assertions
								(estimateDurationUpdateRes.body._id).should.equal(estimateDurationSaveRes.body._id);
								(estimateDurationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Estimate durations if not signed in', function(done) {
		// Create new Estimate duration model instance
		var estimateDurationObj = new EstimateDuration(estimateDuration);

		// Save the Estimate duration
		estimateDurationObj.save(function() {
			// Request Estimate durations
			request(app).get('/estimate-durations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Estimate duration if not signed in', function(done) {
		// Create new Estimate duration model instance
		var estimateDurationObj = new EstimateDuration(estimateDuration);

		// Save the Estimate duration
		estimateDurationObj.save(function() {
			request(app).get('/estimate-durations/' + estimateDurationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', estimateDuration.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Estimate duration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate duration
				agent.post('/estimate-durations')
					.send(estimateDuration)
					.expect(200)
					.end(function(estimateDurationSaveErr, estimateDurationSaveRes) {
						// Handle Estimate duration save error
						if (estimateDurationSaveErr) done(estimateDurationSaveErr);

						// Delete existing Estimate duration
						agent.delete('/estimate-durations/' + estimateDurationSaveRes.body._id)
							.send(estimateDuration)
							.expect(200)
							.end(function(estimateDurationDeleteErr, estimateDurationDeleteRes) {
								// Handle Estimate duration error error
								if (estimateDurationDeleteErr) done(estimateDurationDeleteErr);

								// Set assertions
								(estimateDurationDeleteRes.body._id).should.equal(estimateDurationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Estimate duration instance if not signed in', function(done) {
		// Set Estimate duration user 
		estimateDuration.user = user;

		// Create new Estimate duration model instance
		var estimateDurationObj = new EstimateDuration(estimateDuration);

		// Save the Estimate duration
		estimateDurationObj.save(function() {
			// Try deleting Estimate duration
			request(app).delete('/estimate-durations/' + estimateDurationObj._id)
			.expect(401)
			.end(function(estimateDurationDeleteErr, estimateDurationDeleteRes) {
				// Set message assertion
				(estimateDurationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Estimate duration error error
				done(estimateDurationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EstimateDuration.remove().exec();
		done();
	});
});
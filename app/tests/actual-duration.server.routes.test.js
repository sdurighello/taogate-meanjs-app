'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ActualDuration = mongoose.model('ActualDuration'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, actualDuration;

/**
 * Actual duration routes tests
 */
describe('Actual duration CRUD tests', function() {
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

		// Save a user to the test db and create new Actual duration
		user.save(function() {
			actualDuration = {
				name: 'Actual duration Name'
			};

			done();
		});
	});

	it('should be able to save Actual duration instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual duration
				agent.post('/actual-durations')
					.send(actualDuration)
					.expect(200)
					.end(function(actualDurationSaveErr, actualDurationSaveRes) {
						// Handle Actual duration save error
						if (actualDurationSaveErr) done(actualDurationSaveErr);

						// Get a list of Actual durations
						agent.get('/actual-durations')
							.end(function(actualDurationsGetErr, actualDurationsGetRes) {
								// Handle Actual duration save error
								if (actualDurationsGetErr) done(actualDurationsGetErr);

								// Get Actual durations list
								var actualDurations = actualDurationsGetRes.body;

								// Set assertions
								(actualDurations[0].user._id).should.equal(userId);
								(actualDurations[0].name).should.match('Actual duration Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Actual duration instance if not logged in', function(done) {
		agent.post('/actual-durations')
			.send(actualDuration)
			.expect(401)
			.end(function(actualDurationSaveErr, actualDurationSaveRes) {
				// Call the assertion callback
				done(actualDurationSaveErr);
			});
	});

	it('should not be able to save Actual duration instance if no name is provided', function(done) {
		// Invalidate name field
		actualDuration.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual duration
				agent.post('/actual-durations')
					.send(actualDuration)
					.expect(400)
					.end(function(actualDurationSaveErr, actualDurationSaveRes) {
						// Set message assertion
						(actualDurationSaveRes.body.message).should.match('Please fill Actual duration name');
						
						// Handle Actual duration save error
						done(actualDurationSaveErr);
					});
			});
	});

	it('should be able to update Actual duration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual duration
				agent.post('/actual-durations')
					.send(actualDuration)
					.expect(200)
					.end(function(actualDurationSaveErr, actualDurationSaveRes) {
						// Handle Actual duration save error
						if (actualDurationSaveErr) done(actualDurationSaveErr);

						// Update Actual duration name
						actualDuration.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Actual duration
						agent.put('/actual-durations/' + actualDurationSaveRes.body._id)
							.send(actualDuration)
							.expect(200)
							.end(function(actualDurationUpdateErr, actualDurationUpdateRes) {
								// Handle Actual duration update error
								if (actualDurationUpdateErr) done(actualDurationUpdateErr);

								// Set assertions
								(actualDurationUpdateRes.body._id).should.equal(actualDurationSaveRes.body._id);
								(actualDurationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Actual durations if not signed in', function(done) {
		// Create new Actual duration model instance
		var actualDurationObj = new ActualDuration(actualDuration);

		// Save the Actual duration
		actualDurationObj.save(function() {
			// Request Actual durations
			request(app).get('/actual-durations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Actual duration if not signed in', function(done) {
		// Create new Actual duration model instance
		var actualDurationObj = new ActualDuration(actualDuration);

		// Save the Actual duration
		actualDurationObj.save(function() {
			request(app).get('/actual-durations/' + actualDurationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', actualDuration.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Actual duration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual duration
				agent.post('/actual-durations')
					.send(actualDuration)
					.expect(200)
					.end(function(actualDurationSaveErr, actualDurationSaveRes) {
						// Handle Actual duration save error
						if (actualDurationSaveErr) done(actualDurationSaveErr);

						// Delete existing Actual duration
						agent.delete('/actual-durations/' + actualDurationSaveRes.body._id)
							.send(actualDuration)
							.expect(200)
							.end(function(actualDurationDeleteErr, actualDurationDeleteRes) {
								// Handle Actual duration error error
								if (actualDurationDeleteErr) done(actualDurationDeleteErr);

								// Set assertions
								(actualDurationDeleteRes.body._id).should.equal(actualDurationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Actual duration instance if not signed in', function(done) {
		// Set Actual duration user 
		actualDuration.user = user;

		// Create new Actual duration model instance
		var actualDurationObj = new ActualDuration(actualDuration);

		// Save the Actual duration
		actualDurationObj.save(function() {
			// Try deleting Actual duration
			request(app).delete('/actual-durations/' + actualDurationObj._id)
			.expect(401)
			.end(function(actualDurationDeleteErr, actualDurationDeleteRes) {
				// Set message assertion
				(actualDurationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Actual duration error error
				done(actualDurationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ActualDuration.remove().exec();
		done();
	});
});
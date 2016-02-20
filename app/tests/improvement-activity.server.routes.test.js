'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ImprovementActivity = mongoose.model('ImprovementActivity'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, improvementActivity;

/**
 * Improvement activity routes tests
 */
describe('Improvement activity CRUD tests', function() {
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

		// Save a user to the test db and create new Improvement activity
		user.save(function() {
			improvementActivity = {
				name: 'Improvement activity Name'
			};

			done();
		});
	});

	it('should be able to save Improvement activity instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement activity
				agent.post('/improvement-activities')
					.send(improvementActivity)
					.expect(200)
					.end(function(improvementActivitySaveErr, improvementActivitySaveRes) {
						// Handle Improvement activity save error
						if (improvementActivitySaveErr) done(improvementActivitySaveErr);

						// Get a list of Improvement activities
						agent.get('/improvement-activities')
							.end(function(improvementActivitiesGetErr, improvementActivitiesGetRes) {
								// Handle Improvement activity save error
								if (improvementActivitiesGetErr) done(improvementActivitiesGetErr);

								// Get Improvement activities list
								var improvementActivities = improvementActivitiesGetRes.body;

								// Set assertions
								(improvementActivities[0].user._id).should.equal(userId);
								(improvementActivities[0].name).should.match('Improvement activity Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Improvement activity instance if not logged in', function(done) {
		agent.post('/improvement-activities')
			.send(improvementActivity)
			.expect(401)
			.end(function(improvementActivitySaveErr, improvementActivitySaveRes) {
				// Call the assertion callback
				done(improvementActivitySaveErr);
			});
	});

	it('should not be able to save Improvement activity instance if no name is provided', function(done) {
		// Invalidate name field
		improvementActivity.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement activity
				agent.post('/improvement-activities')
					.send(improvementActivity)
					.expect(400)
					.end(function(improvementActivitySaveErr, improvementActivitySaveRes) {
						// Set message assertion
						(improvementActivitySaveRes.body.message).should.match('Please fill Improvement activity name');
						
						// Handle Improvement activity save error
						done(improvementActivitySaveErr);
					});
			});
	});

	it('should be able to update Improvement activity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement activity
				agent.post('/improvement-activities')
					.send(improvementActivity)
					.expect(200)
					.end(function(improvementActivitySaveErr, improvementActivitySaveRes) {
						// Handle Improvement activity save error
						if (improvementActivitySaveErr) done(improvementActivitySaveErr);

						// Update Improvement activity name
						improvementActivity.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Improvement activity
						agent.put('/improvement-activities/' + improvementActivitySaveRes.body._id)
							.send(improvementActivity)
							.expect(200)
							.end(function(improvementActivityUpdateErr, improvementActivityUpdateRes) {
								// Handle Improvement activity update error
								if (improvementActivityUpdateErr) done(improvementActivityUpdateErr);

								// Set assertions
								(improvementActivityUpdateRes.body._id).should.equal(improvementActivitySaveRes.body._id);
								(improvementActivityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Improvement activities if not signed in', function(done) {
		// Create new Improvement activity model instance
		var improvementActivityObj = new ImprovementActivity(improvementActivity);

		// Save the Improvement activity
		improvementActivityObj.save(function() {
			// Request Improvement activities
			request(app).get('/improvement-activities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Improvement activity if not signed in', function(done) {
		// Create new Improvement activity model instance
		var improvementActivityObj = new ImprovementActivity(improvementActivity);

		// Save the Improvement activity
		improvementActivityObj.save(function() {
			request(app).get('/improvement-activities/' + improvementActivityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', improvementActivity.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Improvement activity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement activity
				agent.post('/improvement-activities')
					.send(improvementActivity)
					.expect(200)
					.end(function(improvementActivitySaveErr, improvementActivitySaveRes) {
						// Handle Improvement activity save error
						if (improvementActivitySaveErr) done(improvementActivitySaveErr);

						// Delete existing Improvement activity
						agent.delete('/improvement-activities/' + improvementActivitySaveRes.body._id)
							.send(improvementActivity)
							.expect(200)
							.end(function(improvementActivityDeleteErr, improvementActivityDeleteRes) {
								// Handle Improvement activity error error
								if (improvementActivityDeleteErr) done(improvementActivityDeleteErr);

								// Set assertions
								(improvementActivityDeleteRes.body._id).should.equal(improvementActivitySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Improvement activity instance if not signed in', function(done) {
		// Set Improvement activity user 
		improvementActivity.user = user;

		// Create new Improvement activity model instance
		var improvementActivityObj = new ImprovementActivity(improvementActivity);

		// Save the Improvement activity
		improvementActivityObj.save(function() {
			// Try deleting Improvement activity
			request(app).delete('/improvement-activities/' + improvementActivityObj._id)
			.expect(401)
			.end(function(improvementActivityDeleteErr, improvementActivityDeleteRes) {
				// Set message assertion
				(improvementActivityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Improvement activity error error
				done(improvementActivityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ImprovementActivity.remove().exec();
		done();
	});
});
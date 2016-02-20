'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ImprovementState = mongoose.model('ImprovementState'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, improvementState;

/**
 * Improvement state routes tests
 */
describe('Improvement state CRUD tests', function() {
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

		// Save a user to the test db and create new Improvement state
		user.save(function() {
			improvementState = {
				name: 'Improvement state Name'
			};

			done();
		});
	});

	it('should be able to save Improvement state instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement state
				agent.post('/improvement-states')
					.send(improvementState)
					.expect(200)
					.end(function(improvementStateSaveErr, improvementStateSaveRes) {
						// Handle Improvement state save error
						if (improvementStateSaveErr) done(improvementStateSaveErr);

						// Get a list of Improvement states
						agent.get('/improvement-states')
							.end(function(improvementStatesGetErr, improvementStatesGetRes) {
								// Handle Improvement state save error
								if (improvementStatesGetErr) done(improvementStatesGetErr);

								// Get Improvement states list
								var improvementStates = improvementStatesGetRes.body;

								// Set assertions
								(improvementStates[0].user._id).should.equal(userId);
								(improvementStates[0].name).should.match('Improvement state Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Improvement state instance if not logged in', function(done) {
		agent.post('/improvement-states')
			.send(improvementState)
			.expect(401)
			.end(function(improvementStateSaveErr, improvementStateSaveRes) {
				// Call the assertion callback
				done(improvementStateSaveErr);
			});
	});

	it('should not be able to save Improvement state instance if no name is provided', function(done) {
		// Invalidate name field
		improvementState.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement state
				agent.post('/improvement-states')
					.send(improvementState)
					.expect(400)
					.end(function(improvementStateSaveErr, improvementStateSaveRes) {
						// Set message assertion
						(improvementStateSaveRes.body.message).should.match('Please fill Improvement state name');
						
						// Handle Improvement state save error
						done(improvementStateSaveErr);
					});
			});
	});

	it('should be able to update Improvement state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement state
				agent.post('/improvement-states')
					.send(improvementState)
					.expect(200)
					.end(function(improvementStateSaveErr, improvementStateSaveRes) {
						// Handle Improvement state save error
						if (improvementStateSaveErr) done(improvementStateSaveErr);

						// Update Improvement state name
						improvementState.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Improvement state
						agent.put('/improvement-states/' + improvementStateSaveRes.body._id)
							.send(improvementState)
							.expect(200)
							.end(function(improvementStateUpdateErr, improvementStateUpdateRes) {
								// Handle Improvement state update error
								if (improvementStateUpdateErr) done(improvementStateUpdateErr);

								// Set assertions
								(improvementStateUpdateRes.body._id).should.equal(improvementStateSaveRes.body._id);
								(improvementStateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Improvement states if not signed in', function(done) {
		// Create new Improvement state model instance
		var improvementStateObj = new ImprovementState(improvementState);

		// Save the Improvement state
		improvementStateObj.save(function() {
			// Request Improvement states
			request(app).get('/improvement-states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Improvement state if not signed in', function(done) {
		// Create new Improvement state model instance
		var improvementStateObj = new ImprovementState(improvementState);

		// Save the Improvement state
		improvementStateObj.save(function() {
			request(app).get('/improvement-states/' + improvementStateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', improvementState.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Improvement state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement state
				agent.post('/improvement-states')
					.send(improvementState)
					.expect(200)
					.end(function(improvementStateSaveErr, improvementStateSaveRes) {
						// Handle Improvement state save error
						if (improvementStateSaveErr) done(improvementStateSaveErr);

						// Delete existing Improvement state
						agent.delete('/improvement-states/' + improvementStateSaveRes.body._id)
							.send(improvementState)
							.expect(200)
							.end(function(improvementStateDeleteErr, improvementStateDeleteRes) {
								// Handle Improvement state error error
								if (improvementStateDeleteErr) done(improvementStateDeleteErr);

								// Set assertions
								(improvementStateDeleteRes.body._id).should.equal(improvementStateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Improvement state instance if not signed in', function(done) {
		// Set Improvement state user 
		improvementState.user = user;

		// Create new Improvement state model instance
		var improvementStateObj = new ImprovementState(improvementState);

		// Save the Improvement state
		improvementStateObj.save(function() {
			// Try deleting Improvement state
			request(app).delete('/improvement-states/' + improvementStateObj._id)
			.expect(401)
			.end(function(improvementStateDeleteErr, improvementStateDeleteRes) {
				// Set message assertion
				(improvementStateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Improvement state error error
				done(improvementStateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ImprovementState.remove().exec();
		done();
	});
});
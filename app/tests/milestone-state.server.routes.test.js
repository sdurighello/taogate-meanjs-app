'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MilestoneState = mongoose.model('MilestoneState'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, milestoneState;

/**
 * Milestone state routes tests
 */
describe('Milestone state CRUD tests', function() {
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

		// Save a user to the test db and create new Milestone state
		user.save(function() {
			milestoneState = {
				name: 'Milestone state Name'
			};

			done();
		});
	});

	it('should be able to save Milestone state instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone state
				agent.post('/milestone-states')
					.send(milestoneState)
					.expect(200)
					.end(function(milestoneStateSaveErr, milestoneStateSaveRes) {
						// Handle Milestone state save error
						if (milestoneStateSaveErr) done(milestoneStateSaveErr);

						// Get a list of Milestone states
						agent.get('/milestone-states')
							.end(function(milestoneStatesGetErr, milestoneStatesGetRes) {
								// Handle Milestone state save error
								if (milestoneStatesGetErr) done(milestoneStatesGetErr);

								// Get Milestone states list
								var milestoneStates = milestoneStatesGetRes.body;

								// Set assertions
								(milestoneStates[0].user._id).should.equal(userId);
								(milestoneStates[0].name).should.match('Milestone state Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Milestone state instance if not logged in', function(done) {
		agent.post('/milestone-states')
			.send(milestoneState)
			.expect(401)
			.end(function(milestoneStateSaveErr, milestoneStateSaveRes) {
				// Call the assertion callback
				done(milestoneStateSaveErr);
			});
	});

	it('should not be able to save Milestone state instance if no name is provided', function(done) {
		// Invalidate name field
		milestoneState.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone state
				agent.post('/milestone-states')
					.send(milestoneState)
					.expect(400)
					.end(function(milestoneStateSaveErr, milestoneStateSaveRes) {
						// Set message assertion
						(milestoneStateSaveRes.body.message).should.match('Please fill Milestone state name');
						
						// Handle Milestone state save error
						done(milestoneStateSaveErr);
					});
			});
	});

	it('should be able to update Milestone state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone state
				agent.post('/milestone-states')
					.send(milestoneState)
					.expect(200)
					.end(function(milestoneStateSaveErr, milestoneStateSaveRes) {
						// Handle Milestone state save error
						if (milestoneStateSaveErr) done(milestoneStateSaveErr);

						// Update Milestone state name
						milestoneState.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Milestone state
						agent.put('/milestone-states/' + milestoneStateSaveRes.body._id)
							.send(milestoneState)
							.expect(200)
							.end(function(milestoneStateUpdateErr, milestoneStateUpdateRes) {
								// Handle Milestone state update error
								if (milestoneStateUpdateErr) done(milestoneStateUpdateErr);

								// Set assertions
								(milestoneStateUpdateRes.body._id).should.equal(milestoneStateSaveRes.body._id);
								(milestoneStateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Milestone states if not signed in', function(done) {
		// Create new Milestone state model instance
		var milestoneStateObj = new MilestoneState(milestoneState);

		// Save the Milestone state
		milestoneStateObj.save(function() {
			// Request Milestone states
			request(app).get('/milestone-states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Milestone state if not signed in', function(done) {
		// Create new Milestone state model instance
		var milestoneStateObj = new MilestoneState(milestoneState);

		// Save the Milestone state
		milestoneStateObj.save(function() {
			request(app).get('/milestone-states/' + milestoneStateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', milestoneState.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Milestone state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Milestone state
				agent.post('/milestone-states')
					.send(milestoneState)
					.expect(200)
					.end(function(milestoneStateSaveErr, milestoneStateSaveRes) {
						// Handle Milestone state save error
						if (milestoneStateSaveErr) done(milestoneStateSaveErr);

						// Delete existing Milestone state
						agent.delete('/milestone-states/' + milestoneStateSaveRes.body._id)
							.send(milestoneState)
							.expect(200)
							.end(function(milestoneStateDeleteErr, milestoneStateDeleteRes) {
								// Handle Milestone state error error
								if (milestoneStateDeleteErr) done(milestoneStateDeleteErr);

								// Set assertions
								(milestoneStateDeleteRes.body._id).should.equal(milestoneStateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Milestone state instance if not signed in', function(done) {
		// Set Milestone state user 
		milestoneState.user = user;

		// Create new Milestone state model instance
		var milestoneStateObj = new MilestoneState(milestoneState);

		// Save the Milestone state
		milestoneStateObj.save(function() {
			// Try deleting Milestone state
			request(app).delete('/milestone-states/' + milestoneStateObj._id)
			.expect(401)
			.end(function(milestoneStateDeleteErr, milestoneStateDeleteRes) {
				// Set message assertion
				(milestoneStateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Milestone state error error
				done(milestoneStateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		MilestoneState.remove().exec();
		done();
	});
});
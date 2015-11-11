'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChangeRequestState = mongoose.model('ChangeRequestState'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, changeRequestState;

/**
 * Change request state routes tests
 */
describe('Change request state CRUD tests', function() {
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

		// Save a user to the test db and create new Change request state
		user.save(function() {
			changeRequestState = {
				name: 'Change request state Name'
			};

			done();
		});
	});

	it('should be able to save Change request state instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request state
				agent.post('/change-request-states')
					.send(changeRequestState)
					.expect(200)
					.end(function(changeRequestStateSaveErr, changeRequestStateSaveRes) {
						// Handle Change request state save error
						if (changeRequestStateSaveErr) done(changeRequestStateSaveErr);

						// Get a list of Change request states
						agent.get('/change-request-states')
							.end(function(changeRequestStatesGetErr, changeRequestStatesGetRes) {
								// Handle Change request state save error
								if (changeRequestStatesGetErr) done(changeRequestStatesGetErr);

								// Get Change request states list
								var changeRequestStates = changeRequestStatesGetRes.body;

								// Set assertions
								(changeRequestStates[0].user._id).should.equal(userId);
								(changeRequestStates[0].name).should.match('Change request state Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Change request state instance if not logged in', function(done) {
		agent.post('/change-request-states')
			.send(changeRequestState)
			.expect(401)
			.end(function(changeRequestStateSaveErr, changeRequestStateSaveRes) {
				// Call the assertion callback
				done(changeRequestStateSaveErr);
			});
	});

	it('should not be able to save Change request state instance if no name is provided', function(done) {
		// Invalidate name field
		changeRequestState.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request state
				agent.post('/change-request-states')
					.send(changeRequestState)
					.expect(400)
					.end(function(changeRequestStateSaveErr, changeRequestStateSaveRes) {
						// Set message assertion
						(changeRequestStateSaveRes.body.message).should.match('Please fill Change request state name');
						
						// Handle Change request state save error
						done(changeRequestStateSaveErr);
					});
			});
	});

	it('should be able to update Change request state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request state
				agent.post('/change-request-states')
					.send(changeRequestState)
					.expect(200)
					.end(function(changeRequestStateSaveErr, changeRequestStateSaveRes) {
						// Handle Change request state save error
						if (changeRequestStateSaveErr) done(changeRequestStateSaveErr);

						// Update Change request state name
						changeRequestState.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Change request state
						agent.put('/change-request-states/' + changeRequestStateSaveRes.body._id)
							.send(changeRequestState)
							.expect(200)
							.end(function(changeRequestStateUpdateErr, changeRequestStateUpdateRes) {
								// Handle Change request state update error
								if (changeRequestStateUpdateErr) done(changeRequestStateUpdateErr);

								// Set assertions
								(changeRequestStateUpdateRes.body._id).should.equal(changeRequestStateSaveRes.body._id);
								(changeRequestStateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Change request states if not signed in', function(done) {
		// Create new Change request state model instance
		var changeRequestStateObj = new ChangeRequestState(changeRequestState);

		// Save the Change request state
		changeRequestStateObj.save(function() {
			// Request Change request states
			request(app).get('/change-request-states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Change request state if not signed in', function(done) {
		// Create new Change request state model instance
		var changeRequestStateObj = new ChangeRequestState(changeRequestState);

		// Save the Change request state
		changeRequestStateObj.save(function() {
			request(app).get('/change-request-states/' + changeRequestStateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', changeRequestState.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Change request state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request state
				agent.post('/change-request-states')
					.send(changeRequestState)
					.expect(200)
					.end(function(changeRequestStateSaveErr, changeRequestStateSaveRes) {
						// Handle Change request state save error
						if (changeRequestStateSaveErr) done(changeRequestStateSaveErr);

						// Delete existing Change request state
						agent.delete('/change-request-states/' + changeRequestStateSaveRes.body._id)
							.send(changeRequestState)
							.expect(200)
							.end(function(changeRequestStateDeleteErr, changeRequestStateDeleteRes) {
								// Handle Change request state error error
								if (changeRequestStateDeleteErr) done(changeRequestStateDeleteErr);

								// Set assertions
								(changeRequestStateDeleteRes.body._id).should.equal(changeRequestStateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Change request state instance if not signed in', function(done) {
		// Set Change request state user 
		changeRequestState.user = user;

		// Create new Change request state model instance
		var changeRequestStateObj = new ChangeRequestState(changeRequestState);

		// Save the Change request state
		changeRequestStateObj.save(function() {
			// Try deleting Change request state
			request(app).delete('/change-request-states/' + changeRequestStateObj._id)
			.expect(401)
			.end(function(changeRequestStateDeleteErr, changeRequestStateDeleteRes) {
				// Set message assertion
				(changeRequestStateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Change request state error error
				done(changeRequestStateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ChangeRequestState.remove().exec();
		done();
	});
});
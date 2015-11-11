'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssueActionState = mongoose.model('IssueActionState'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, issueActionState;

/**
 * Issue action state routes tests
 */
describe('Issue action state CRUD tests', function() {
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

		// Save a user to the test db and create new Issue action state
		user.save(function() {
			issueActionState = {
				name: 'Issue action state Name'
			};

			done();
		});
	});

	it('should be able to save Issue action state instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue action state
				agent.post('/issue-action-states')
					.send(issueActionState)
					.expect(200)
					.end(function(issueActionStateSaveErr, issueActionStateSaveRes) {
						// Handle Issue action state save error
						if (issueActionStateSaveErr) done(issueActionStateSaveErr);

						// Get a list of Issue action states
						agent.get('/issue-action-states')
							.end(function(issueActionStatesGetErr, issueActionStatesGetRes) {
								// Handle Issue action state save error
								if (issueActionStatesGetErr) done(issueActionStatesGetErr);

								// Get Issue action states list
								var issueActionStates = issueActionStatesGetRes.body;

								// Set assertions
								(issueActionStates[0].user._id).should.equal(userId);
								(issueActionStates[0].name).should.match('Issue action state Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Issue action state instance if not logged in', function(done) {
		agent.post('/issue-action-states')
			.send(issueActionState)
			.expect(401)
			.end(function(issueActionStateSaveErr, issueActionStateSaveRes) {
				// Call the assertion callback
				done(issueActionStateSaveErr);
			});
	});

	it('should not be able to save Issue action state instance if no name is provided', function(done) {
		// Invalidate name field
		issueActionState.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue action state
				agent.post('/issue-action-states')
					.send(issueActionState)
					.expect(400)
					.end(function(issueActionStateSaveErr, issueActionStateSaveRes) {
						// Set message assertion
						(issueActionStateSaveRes.body.message).should.match('Please fill Issue action state name');
						
						// Handle Issue action state save error
						done(issueActionStateSaveErr);
					});
			});
	});

	it('should be able to update Issue action state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue action state
				agent.post('/issue-action-states')
					.send(issueActionState)
					.expect(200)
					.end(function(issueActionStateSaveErr, issueActionStateSaveRes) {
						// Handle Issue action state save error
						if (issueActionStateSaveErr) done(issueActionStateSaveErr);

						// Update Issue action state name
						issueActionState.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Issue action state
						agent.put('/issue-action-states/' + issueActionStateSaveRes.body._id)
							.send(issueActionState)
							.expect(200)
							.end(function(issueActionStateUpdateErr, issueActionStateUpdateRes) {
								// Handle Issue action state update error
								if (issueActionStateUpdateErr) done(issueActionStateUpdateErr);

								// Set assertions
								(issueActionStateUpdateRes.body._id).should.equal(issueActionStateSaveRes.body._id);
								(issueActionStateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Issue action states if not signed in', function(done) {
		// Create new Issue action state model instance
		var issueActionStateObj = new IssueActionState(issueActionState);

		// Save the Issue action state
		issueActionStateObj.save(function() {
			// Request Issue action states
			request(app).get('/issue-action-states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Issue action state if not signed in', function(done) {
		// Create new Issue action state model instance
		var issueActionStateObj = new IssueActionState(issueActionState);

		// Save the Issue action state
		issueActionStateObj.save(function() {
			request(app).get('/issue-action-states/' + issueActionStateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', issueActionState.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Issue action state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue action state
				agent.post('/issue-action-states')
					.send(issueActionState)
					.expect(200)
					.end(function(issueActionStateSaveErr, issueActionStateSaveRes) {
						// Handle Issue action state save error
						if (issueActionStateSaveErr) done(issueActionStateSaveErr);

						// Delete existing Issue action state
						agent.delete('/issue-action-states/' + issueActionStateSaveRes.body._id)
							.send(issueActionState)
							.expect(200)
							.end(function(issueActionStateDeleteErr, issueActionStateDeleteRes) {
								// Handle Issue action state error error
								if (issueActionStateDeleteErr) done(issueActionStateDeleteErr);

								// Set assertions
								(issueActionStateDeleteRes.body._id).should.equal(issueActionStateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Issue action state instance if not signed in', function(done) {
		// Set Issue action state user 
		issueActionState.user = user;

		// Create new Issue action state model instance
		var issueActionStateObj = new IssueActionState(issueActionState);

		// Save the Issue action state
		issueActionStateObj.save(function() {
			// Try deleting Issue action state
			request(app).delete('/issue-action-states/' + issueActionStateObj._id)
			.expect(401)
			.end(function(issueActionStateDeleteErr, issueActionStateDeleteRes) {
				// Set message assertion
				(issueActionStateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Issue action state error error
				done(issueActionStateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		IssueActionState.remove().exec();
		done();
	});
});
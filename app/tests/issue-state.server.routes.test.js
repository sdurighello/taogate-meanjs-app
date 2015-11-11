'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssueState = mongoose.model('IssueState'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, issueState;

/**
 * Issue state routes tests
 */
describe('Issue state CRUD tests', function() {
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

		// Save a user to the test db and create new Issue state
		user.save(function() {
			issueState = {
				name: 'Issue state Name'
			};

			done();
		});
	});

	it('should be able to save Issue state instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue state
				agent.post('/issue-states')
					.send(issueState)
					.expect(200)
					.end(function(issueStateSaveErr, issueStateSaveRes) {
						// Handle Issue state save error
						if (issueStateSaveErr) done(issueStateSaveErr);

						// Get a list of Issue states
						agent.get('/issue-states')
							.end(function(issueStatesGetErr, issueStatesGetRes) {
								// Handle Issue state save error
								if (issueStatesGetErr) done(issueStatesGetErr);

								// Get Issue states list
								var issueStates = issueStatesGetRes.body;

								// Set assertions
								(issueStates[0].user._id).should.equal(userId);
								(issueStates[0].name).should.match('Issue state Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Issue state instance if not logged in', function(done) {
		agent.post('/issue-states')
			.send(issueState)
			.expect(401)
			.end(function(issueStateSaveErr, issueStateSaveRes) {
				// Call the assertion callback
				done(issueStateSaveErr);
			});
	});

	it('should not be able to save Issue state instance if no name is provided', function(done) {
		// Invalidate name field
		issueState.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue state
				agent.post('/issue-states')
					.send(issueState)
					.expect(400)
					.end(function(issueStateSaveErr, issueStateSaveRes) {
						// Set message assertion
						(issueStateSaveRes.body.message).should.match('Please fill Issue state name');
						
						// Handle Issue state save error
						done(issueStateSaveErr);
					});
			});
	});

	it('should be able to update Issue state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue state
				agent.post('/issue-states')
					.send(issueState)
					.expect(200)
					.end(function(issueStateSaveErr, issueStateSaveRes) {
						// Handle Issue state save error
						if (issueStateSaveErr) done(issueStateSaveErr);

						// Update Issue state name
						issueState.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Issue state
						agent.put('/issue-states/' + issueStateSaveRes.body._id)
							.send(issueState)
							.expect(200)
							.end(function(issueStateUpdateErr, issueStateUpdateRes) {
								// Handle Issue state update error
								if (issueStateUpdateErr) done(issueStateUpdateErr);

								// Set assertions
								(issueStateUpdateRes.body._id).should.equal(issueStateSaveRes.body._id);
								(issueStateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Issue states if not signed in', function(done) {
		// Create new Issue state model instance
		var issueStateObj = new IssueState(issueState);

		// Save the Issue state
		issueStateObj.save(function() {
			// Request Issue states
			request(app).get('/issue-states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Issue state if not signed in', function(done) {
		// Create new Issue state model instance
		var issueStateObj = new IssueState(issueState);

		// Save the Issue state
		issueStateObj.save(function() {
			request(app).get('/issue-states/' + issueStateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', issueState.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Issue state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue state
				agent.post('/issue-states')
					.send(issueState)
					.expect(200)
					.end(function(issueStateSaveErr, issueStateSaveRes) {
						// Handle Issue state save error
						if (issueStateSaveErr) done(issueStateSaveErr);

						// Delete existing Issue state
						agent.delete('/issue-states/' + issueStateSaveRes.body._id)
							.send(issueState)
							.expect(200)
							.end(function(issueStateDeleteErr, issueStateDeleteRes) {
								// Handle Issue state error error
								if (issueStateDeleteErr) done(issueStateDeleteErr);

								// Set assertions
								(issueStateDeleteRes.body._id).should.equal(issueStateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Issue state instance if not signed in', function(done) {
		// Set Issue state user 
		issueState.user = user;

		// Create new Issue state model instance
		var issueStateObj = new IssueState(issueState);

		// Save the Issue state
		issueStateObj.save(function() {
			// Try deleting Issue state
			request(app).delete('/issue-states/' + issueStateObj._id)
			.expect(401)
			.end(function(issueStateDeleteErr, issueStateDeleteRes) {
				// Set message assertion
				(issueStateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Issue state error error
				done(issueStateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		IssueState.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssueReason = mongoose.model('IssueReason'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, issueReason;

/**
 * Issue reason routes tests
 */
describe('Issue reason CRUD tests', function() {
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

		// Save a user to the test db and create new Issue reason
		user.save(function() {
			issueReason = {
				name: 'Issue reason Name'
			};

			done();
		});
	});

	it('should be able to save Issue reason instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue reason
				agent.post('/issue-reasons')
					.send(issueReason)
					.expect(200)
					.end(function(issueReasonSaveErr, issueReasonSaveRes) {
						// Handle Issue reason save error
						if (issueReasonSaveErr) done(issueReasonSaveErr);

						// Get a list of Issue reasons
						agent.get('/issue-reasons')
							.end(function(issueReasonsGetErr, issueReasonsGetRes) {
								// Handle Issue reason save error
								if (issueReasonsGetErr) done(issueReasonsGetErr);

								// Get Issue reasons list
								var issueReasons = issueReasonsGetRes.body;

								// Set assertions
								(issueReasons[0].user._id).should.equal(userId);
								(issueReasons[0].name).should.match('Issue reason Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Issue reason instance if not logged in', function(done) {
		agent.post('/issue-reasons')
			.send(issueReason)
			.expect(401)
			.end(function(issueReasonSaveErr, issueReasonSaveRes) {
				// Call the assertion callback
				done(issueReasonSaveErr);
			});
	});

	it('should not be able to save Issue reason instance if no name is provided', function(done) {
		// Invalidate name field
		issueReason.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue reason
				agent.post('/issue-reasons')
					.send(issueReason)
					.expect(400)
					.end(function(issueReasonSaveErr, issueReasonSaveRes) {
						// Set message assertion
						(issueReasonSaveRes.body.message).should.match('Please fill Issue reason name');
						
						// Handle Issue reason save error
						done(issueReasonSaveErr);
					});
			});
	});

	it('should be able to update Issue reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue reason
				agent.post('/issue-reasons')
					.send(issueReason)
					.expect(200)
					.end(function(issueReasonSaveErr, issueReasonSaveRes) {
						// Handle Issue reason save error
						if (issueReasonSaveErr) done(issueReasonSaveErr);

						// Update Issue reason name
						issueReason.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Issue reason
						agent.put('/issue-reasons/' + issueReasonSaveRes.body._id)
							.send(issueReason)
							.expect(200)
							.end(function(issueReasonUpdateErr, issueReasonUpdateRes) {
								// Handle Issue reason update error
								if (issueReasonUpdateErr) done(issueReasonUpdateErr);

								// Set assertions
								(issueReasonUpdateRes.body._id).should.equal(issueReasonSaveRes.body._id);
								(issueReasonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Issue reasons if not signed in', function(done) {
		// Create new Issue reason model instance
		var issueReasonObj = new IssueReason(issueReason);

		// Save the Issue reason
		issueReasonObj.save(function() {
			// Request Issue reasons
			request(app).get('/issue-reasons')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Issue reason if not signed in', function(done) {
		// Create new Issue reason model instance
		var issueReasonObj = new IssueReason(issueReason);

		// Save the Issue reason
		issueReasonObj.save(function() {
			request(app).get('/issue-reasons/' + issueReasonObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', issueReason.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Issue reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue reason
				agent.post('/issue-reasons')
					.send(issueReason)
					.expect(200)
					.end(function(issueReasonSaveErr, issueReasonSaveRes) {
						// Handle Issue reason save error
						if (issueReasonSaveErr) done(issueReasonSaveErr);

						// Delete existing Issue reason
						agent.delete('/issue-reasons/' + issueReasonSaveRes.body._id)
							.send(issueReason)
							.expect(200)
							.end(function(issueReasonDeleteErr, issueReasonDeleteRes) {
								// Handle Issue reason error error
								if (issueReasonDeleteErr) done(issueReasonDeleteErr);

								// Set assertions
								(issueReasonDeleteRes.body._id).should.equal(issueReasonSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Issue reason instance if not signed in', function(done) {
		// Set Issue reason user 
		issueReason.user = user;

		// Create new Issue reason model instance
		var issueReasonObj = new IssueReason(issueReason);

		// Save the Issue reason
		issueReasonObj.save(function() {
			// Try deleting Issue reason
			request(app).delete('/issue-reasons/' + issueReasonObj._id)
			.expect(401)
			.end(function(issueReasonDeleteErr, issueReasonDeleteRes) {
				// Set message assertion
				(issueReasonDeleteRes.body.message).should.match('User is not logged in');

				// Handle Issue reason error error
				done(issueReasonDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		IssueReason.remove().exec();
		done();
	});
});
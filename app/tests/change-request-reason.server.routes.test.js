'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ChangeRequestReason = mongoose.model('ChangeRequestReason'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, changeRequestReason;

/**
 * Change request reason routes tests
 */
describe('Change request reason CRUD tests', function() {
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

		// Save a user to the test db and create new Change request reason
		user.save(function() {
			changeRequestReason = {
				name: 'Change request reason Name'
			};

			done();
		});
	});

	it('should be able to save Change request reason instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request reason
				agent.post('/change-request-reasons')
					.send(changeRequestReason)
					.expect(200)
					.end(function(changeRequestReasonSaveErr, changeRequestReasonSaveRes) {
						// Handle Change request reason save error
						if (changeRequestReasonSaveErr) done(changeRequestReasonSaveErr);

						// Get a list of Change request reasons
						agent.get('/change-request-reasons')
							.end(function(changeRequestReasonsGetErr, changeRequestReasonsGetRes) {
								// Handle Change request reason save error
								if (changeRequestReasonsGetErr) done(changeRequestReasonsGetErr);

								// Get Change request reasons list
								var changeRequestReasons = changeRequestReasonsGetRes.body;

								// Set assertions
								(changeRequestReasons[0].user._id).should.equal(userId);
								(changeRequestReasons[0].name).should.match('Change request reason Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Change request reason instance if not logged in', function(done) {
		agent.post('/change-request-reasons')
			.send(changeRequestReason)
			.expect(401)
			.end(function(changeRequestReasonSaveErr, changeRequestReasonSaveRes) {
				// Call the assertion callback
				done(changeRequestReasonSaveErr);
			});
	});

	it('should not be able to save Change request reason instance if no name is provided', function(done) {
		// Invalidate name field
		changeRequestReason.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request reason
				agent.post('/change-request-reasons')
					.send(changeRequestReason)
					.expect(400)
					.end(function(changeRequestReasonSaveErr, changeRequestReasonSaveRes) {
						// Set message assertion
						(changeRequestReasonSaveRes.body.message).should.match('Please fill Change request reason name');
						
						// Handle Change request reason save error
						done(changeRequestReasonSaveErr);
					});
			});
	});

	it('should be able to update Change request reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request reason
				agent.post('/change-request-reasons')
					.send(changeRequestReason)
					.expect(200)
					.end(function(changeRequestReasonSaveErr, changeRequestReasonSaveRes) {
						// Handle Change request reason save error
						if (changeRequestReasonSaveErr) done(changeRequestReasonSaveErr);

						// Update Change request reason name
						changeRequestReason.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Change request reason
						agent.put('/change-request-reasons/' + changeRequestReasonSaveRes.body._id)
							.send(changeRequestReason)
							.expect(200)
							.end(function(changeRequestReasonUpdateErr, changeRequestReasonUpdateRes) {
								// Handle Change request reason update error
								if (changeRequestReasonUpdateErr) done(changeRequestReasonUpdateErr);

								// Set assertions
								(changeRequestReasonUpdateRes.body._id).should.equal(changeRequestReasonSaveRes.body._id);
								(changeRequestReasonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Change request reasons if not signed in', function(done) {
		// Create new Change request reason model instance
		var changeRequestReasonObj = new ChangeRequestReason(changeRequestReason);

		// Save the Change request reason
		changeRequestReasonObj.save(function() {
			// Request Change request reasons
			request(app).get('/change-request-reasons')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Change request reason if not signed in', function(done) {
		// Create new Change request reason model instance
		var changeRequestReasonObj = new ChangeRequestReason(changeRequestReason);

		// Save the Change request reason
		changeRequestReasonObj.save(function() {
			request(app).get('/change-request-reasons/' + changeRequestReasonObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', changeRequestReason.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Change request reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Change request reason
				agent.post('/change-request-reasons')
					.send(changeRequestReason)
					.expect(200)
					.end(function(changeRequestReasonSaveErr, changeRequestReasonSaveRes) {
						// Handle Change request reason save error
						if (changeRequestReasonSaveErr) done(changeRequestReasonSaveErr);

						// Delete existing Change request reason
						agent.delete('/change-request-reasons/' + changeRequestReasonSaveRes.body._id)
							.send(changeRequestReason)
							.expect(200)
							.end(function(changeRequestReasonDeleteErr, changeRequestReasonDeleteRes) {
								// Handle Change request reason error error
								if (changeRequestReasonDeleteErr) done(changeRequestReasonDeleteErr);

								// Set assertions
								(changeRequestReasonDeleteRes.body._id).should.equal(changeRequestReasonSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Change request reason instance if not signed in', function(done) {
		// Set Change request reason user 
		changeRequestReason.user = user;

		// Create new Change request reason model instance
		var changeRequestReasonObj = new ChangeRequestReason(changeRequestReason);

		// Save the Change request reason
		changeRequestReasonObj.save(function() {
			// Try deleting Change request reason
			request(app).delete('/change-request-reasons/' + changeRequestReasonObj._id)
			.expect(401)
			.end(function(changeRequestReasonDeleteErr, changeRequestReasonDeleteRes) {
				// Set message assertion
				(changeRequestReasonDeleteRes.body.message).should.match('User is not logged in');

				// Handle Change request reason error error
				done(changeRequestReasonDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ChangeRequestReason.remove().exec();
		done();
	});
});
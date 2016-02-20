'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ImprovementReason = mongoose.model('ImprovementReason'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, improvementReason;

/**
 * Improvement reason routes tests
 */
describe('Improvement reason CRUD tests', function() {
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

		// Save a user to the test db and create new Improvement reason
		user.save(function() {
			improvementReason = {
				name: 'Improvement reason Name'
			};

			done();
		});
	});

	it('should be able to save Improvement reason instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement reason
				agent.post('/improvement-reasons')
					.send(improvementReason)
					.expect(200)
					.end(function(improvementReasonSaveErr, improvementReasonSaveRes) {
						// Handle Improvement reason save error
						if (improvementReasonSaveErr) done(improvementReasonSaveErr);

						// Get a list of Improvement reasons
						agent.get('/improvement-reasons')
							.end(function(improvementReasonsGetErr, improvementReasonsGetRes) {
								// Handle Improvement reason save error
								if (improvementReasonsGetErr) done(improvementReasonsGetErr);

								// Get Improvement reasons list
								var improvementReasons = improvementReasonsGetRes.body;

								// Set assertions
								(improvementReasons[0].user._id).should.equal(userId);
								(improvementReasons[0].name).should.match('Improvement reason Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Improvement reason instance if not logged in', function(done) {
		agent.post('/improvement-reasons')
			.send(improvementReason)
			.expect(401)
			.end(function(improvementReasonSaveErr, improvementReasonSaveRes) {
				// Call the assertion callback
				done(improvementReasonSaveErr);
			});
	});

	it('should not be able to save Improvement reason instance if no name is provided', function(done) {
		// Invalidate name field
		improvementReason.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement reason
				agent.post('/improvement-reasons')
					.send(improvementReason)
					.expect(400)
					.end(function(improvementReasonSaveErr, improvementReasonSaveRes) {
						// Set message assertion
						(improvementReasonSaveRes.body.message).should.match('Please fill Improvement reason name');
						
						// Handle Improvement reason save error
						done(improvementReasonSaveErr);
					});
			});
	});

	it('should be able to update Improvement reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement reason
				agent.post('/improvement-reasons')
					.send(improvementReason)
					.expect(200)
					.end(function(improvementReasonSaveErr, improvementReasonSaveRes) {
						// Handle Improvement reason save error
						if (improvementReasonSaveErr) done(improvementReasonSaveErr);

						// Update Improvement reason name
						improvementReason.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Improvement reason
						agent.put('/improvement-reasons/' + improvementReasonSaveRes.body._id)
							.send(improvementReason)
							.expect(200)
							.end(function(improvementReasonUpdateErr, improvementReasonUpdateRes) {
								// Handle Improvement reason update error
								if (improvementReasonUpdateErr) done(improvementReasonUpdateErr);

								// Set assertions
								(improvementReasonUpdateRes.body._id).should.equal(improvementReasonSaveRes.body._id);
								(improvementReasonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Improvement reasons if not signed in', function(done) {
		// Create new Improvement reason model instance
		var improvementReasonObj = new ImprovementReason(improvementReason);

		// Save the Improvement reason
		improvementReasonObj.save(function() {
			// Request Improvement reasons
			request(app).get('/improvement-reasons')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Improvement reason if not signed in', function(done) {
		// Create new Improvement reason model instance
		var improvementReasonObj = new ImprovementReason(improvementReason);

		// Save the Improvement reason
		improvementReasonObj.save(function() {
			request(app).get('/improvement-reasons/' + improvementReasonObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', improvementReason.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Improvement reason instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement reason
				agent.post('/improvement-reasons')
					.send(improvementReason)
					.expect(200)
					.end(function(improvementReasonSaveErr, improvementReasonSaveRes) {
						// Handle Improvement reason save error
						if (improvementReasonSaveErr) done(improvementReasonSaveErr);

						// Delete existing Improvement reason
						agent.delete('/improvement-reasons/' + improvementReasonSaveRes.body._id)
							.send(improvementReason)
							.expect(200)
							.end(function(improvementReasonDeleteErr, improvementReasonDeleteRes) {
								// Handle Improvement reason error error
								if (improvementReasonDeleteErr) done(improvementReasonDeleteErr);

								// Set assertions
								(improvementReasonDeleteRes.body._id).should.equal(improvementReasonSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Improvement reason instance if not signed in', function(done) {
		// Set Improvement reason user 
		improvementReason.user = user;

		// Create new Improvement reason model instance
		var improvementReasonObj = new ImprovementReason(improvementReason);

		// Save the Improvement reason
		improvementReasonObj.save(function() {
			// Try deleting Improvement reason
			request(app).delete('/improvement-reasons/' + improvementReasonObj._id)
			.expect(401)
			.end(function(improvementReasonDeleteErr, improvementReasonDeleteRes) {
				// Set message assertion
				(improvementReasonDeleteRes.body.message).should.match('User is not logged in');

				// Handle Improvement reason error error
				done(improvementReasonDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ImprovementReason.remove().exec();
		done();
	});
});
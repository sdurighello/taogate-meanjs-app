'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EstimateCompletion = mongoose.model('EstimateCompletion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, estimateCompletion;

/**
 * Estimate completion routes tests
 */
describe('Estimate completion CRUD tests', function() {
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

		// Save a user to the test db and create new Estimate completion
		user.save(function() {
			estimateCompletion = {
				name: 'Estimate completion Name'
			};

			done();
		});
	});

	it('should be able to save Estimate completion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate completion
				agent.post('/estimate-completions')
					.send(estimateCompletion)
					.expect(200)
					.end(function(estimateCompletionSaveErr, estimateCompletionSaveRes) {
						// Handle Estimate completion save error
						if (estimateCompletionSaveErr) done(estimateCompletionSaveErr);

						// Get a list of Estimate completions
						agent.get('/estimate-completions')
							.end(function(estimateCompletionsGetErr, estimateCompletionsGetRes) {
								// Handle Estimate completion save error
								if (estimateCompletionsGetErr) done(estimateCompletionsGetErr);

								// Get Estimate completions list
								var estimateCompletions = estimateCompletionsGetRes.body;

								// Set assertions
								(estimateCompletions[0].user._id).should.equal(userId);
								(estimateCompletions[0].name).should.match('Estimate completion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Estimate completion instance if not logged in', function(done) {
		agent.post('/estimate-completions')
			.send(estimateCompletion)
			.expect(401)
			.end(function(estimateCompletionSaveErr, estimateCompletionSaveRes) {
				// Call the assertion callback
				done(estimateCompletionSaveErr);
			});
	});

	it('should not be able to save Estimate completion instance if no name is provided', function(done) {
		// Invalidate name field
		estimateCompletion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate completion
				agent.post('/estimate-completions')
					.send(estimateCompletion)
					.expect(400)
					.end(function(estimateCompletionSaveErr, estimateCompletionSaveRes) {
						// Set message assertion
						(estimateCompletionSaveRes.body.message).should.match('Please fill Estimate completion name');
						
						// Handle Estimate completion save error
						done(estimateCompletionSaveErr);
					});
			});
	});

	it('should be able to update Estimate completion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate completion
				agent.post('/estimate-completions')
					.send(estimateCompletion)
					.expect(200)
					.end(function(estimateCompletionSaveErr, estimateCompletionSaveRes) {
						// Handle Estimate completion save error
						if (estimateCompletionSaveErr) done(estimateCompletionSaveErr);

						// Update Estimate completion name
						estimateCompletion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Estimate completion
						agent.put('/estimate-completions/' + estimateCompletionSaveRes.body._id)
							.send(estimateCompletion)
							.expect(200)
							.end(function(estimateCompletionUpdateErr, estimateCompletionUpdateRes) {
								// Handle Estimate completion update error
								if (estimateCompletionUpdateErr) done(estimateCompletionUpdateErr);

								// Set assertions
								(estimateCompletionUpdateRes.body._id).should.equal(estimateCompletionSaveRes.body._id);
								(estimateCompletionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Estimate completions if not signed in', function(done) {
		// Create new Estimate completion model instance
		var estimateCompletionObj = new EstimateCompletion(estimateCompletion);

		// Save the Estimate completion
		estimateCompletionObj.save(function() {
			// Request Estimate completions
			request(app).get('/estimate-completions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Estimate completion if not signed in', function(done) {
		// Create new Estimate completion model instance
		var estimateCompletionObj = new EstimateCompletion(estimateCompletion);

		// Save the Estimate completion
		estimateCompletionObj.save(function() {
			request(app).get('/estimate-completions/' + estimateCompletionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', estimateCompletion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Estimate completion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate completion
				agent.post('/estimate-completions')
					.send(estimateCompletion)
					.expect(200)
					.end(function(estimateCompletionSaveErr, estimateCompletionSaveRes) {
						// Handle Estimate completion save error
						if (estimateCompletionSaveErr) done(estimateCompletionSaveErr);

						// Delete existing Estimate completion
						agent.delete('/estimate-completions/' + estimateCompletionSaveRes.body._id)
							.send(estimateCompletion)
							.expect(200)
							.end(function(estimateCompletionDeleteErr, estimateCompletionDeleteRes) {
								// Handle Estimate completion error error
								if (estimateCompletionDeleteErr) done(estimateCompletionDeleteErr);

								// Set assertions
								(estimateCompletionDeleteRes.body._id).should.equal(estimateCompletionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Estimate completion instance if not signed in', function(done) {
		// Set Estimate completion user 
		estimateCompletion.user = user;

		// Create new Estimate completion model instance
		var estimateCompletionObj = new EstimateCompletion(estimateCompletion);

		// Save the Estimate completion
		estimateCompletionObj.save(function() {
			// Try deleting Estimate completion
			request(app).delete('/estimate-completions/' + estimateCompletionObj._id)
			.expect(401)
			.end(function(estimateCompletionDeleteErr, estimateCompletionDeleteRes) {
				// Set message assertion
				(estimateCompletionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Estimate completion error error
				done(estimateCompletionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EstimateCompletion.remove().exec();
		done();
	});
});
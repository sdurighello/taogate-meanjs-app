'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ActualCompletion = mongoose.model('ActualCompletion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, actualCompletion;

/**
 * Actual completion routes tests
 */
describe('Actual completion CRUD tests', function() {
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

		// Save a user to the test db and create new Actual completion
		user.save(function() {
			actualCompletion = {
				name: 'Actual completion Name'
			};

			done();
		});
	});

	it('should be able to save Actual completion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual completion
				agent.post('/actual-completions')
					.send(actualCompletion)
					.expect(200)
					.end(function(actualCompletionSaveErr, actualCompletionSaveRes) {
						// Handle Actual completion save error
						if (actualCompletionSaveErr) done(actualCompletionSaveErr);

						// Get a list of Actual completions
						agent.get('/actual-completions')
							.end(function(actualCompletionsGetErr, actualCompletionsGetRes) {
								// Handle Actual completion save error
								if (actualCompletionsGetErr) done(actualCompletionsGetErr);

								// Get Actual completions list
								var actualCompletions = actualCompletionsGetRes.body;

								// Set assertions
								(actualCompletions[0].user._id).should.equal(userId);
								(actualCompletions[0].name).should.match('Actual completion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Actual completion instance if not logged in', function(done) {
		agent.post('/actual-completions')
			.send(actualCompletion)
			.expect(401)
			.end(function(actualCompletionSaveErr, actualCompletionSaveRes) {
				// Call the assertion callback
				done(actualCompletionSaveErr);
			});
	});

	it('should not be able to save Actual completion instance if no name is provided', function(done) {
		// Invalidate name field
		actualCompletion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual completion
				agent.post('/actual-completions')
					.send(actualCompletion)
					.expect(400)
					.end(function(actualCompletionSaveErr, actualCompletionSaveRes) {
						// Set message assertion
						(actualCompletionSaveRes.body.message).should.match('Please fill Actual completion name');
						
						// Handle Actual completion save error
						done(actualCompletionSaveErr);
					});
			});
	});

	it('should be able to update Actual completion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual completion
				agent.post('/actual-completions')
					.send(actualCompletion)
					.expect(200)
					.end(function(actualCompletionSaveErr, actualCompletionSaveRes) {
						// Handle Actual completion save error
						if (actualCompletionSaveErr) done(actualCompletionSaveErr);

						// Update Actual completion name
						actualCompletion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Actual completion
						agent.put('/actual-completions/' + actualCompletionSaveRes.body._id)
							.send(actualCompletion)
							.expect(200)
							.end(function(actualCompletionUpdateErr, actualCompletionUpdateRes) {
								// Handle Actual completion update error
								if (actualCompletionUpdateErr) done(actualCompletionUpdateErr);

								// Set assertions
								(actualCompletionUpdateRes.body._id).should.equal(actualCompletionSaveRes.body._id);
								(actualCompletionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Actual completions if not signed in', function(done) {
		// Create new Actual completion model instance
		var actualCompletionObj = new ActualCompletion(actualCompletion);

		// Save the Actual completion
		actualCompletionObj.save(function() {
			// Request Actual completions
			request(app).get('/actual-completions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Actual completion if not signed in', function(done) {
		// Create new Actual completion model instance
		var actualCompletionObj = new ActualCompletion(actualCompletion);

		// Save the Actual completion
		actualCompletionObj.save(function() {
			request(app).get('/actual-completions/' + actualCompletionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', actualCompletion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Actual completion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual completion
				agent.post('/actual-completions')
					.send(actualCompletion)
					.expect(200)
					.end(function(actualCompletionSaveErr, actualCompletionSaveRes) {
						// Handle Actual completion save error
						if (actualCompletionSaveErr) done(actualCompletionSaveErr);

						// Delete existing Actual completion
						agent.delete('/actual-completions/' + actualCompletionSaveRes.body._id)
							.send(actualCompletion)
							.expect(200)
							.end(function(actualCompletionDeleteErr, actualCompletionDeleteRes) {
								// Handle Actual completion error error
								if (actualCompletionDeleteErr) done(actualCompletionDeleteErr);

								// Set assertions
								(actualCompletionDeleteRes.body._id).should.equal(actualCompletionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Actual completion instance if not signed in', function(done) {
		// Set Actual completion user 
		actualCompletion.user = user;

		// Create new Actual completion model instance
		var actualCompletionObj = new ActualCompletion(actualCompletion);

		// Save the Actual completion
		actualCompletionObj.save(function() {
			// Try deleting Actual completion
			request(app).delete('/actual-completions/' + actualCompletionObj._id)
			.expect(401)
			.end(function(actualCompletionDeleteErr, actualCompletionDeleteRes) {
				// Set message assertion
				(actualCompletionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Actual completion error error
				done(actualCompletionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ActualCompletion.remove().exec();
		done();
	});
});
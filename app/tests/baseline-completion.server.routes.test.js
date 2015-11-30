'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	BaselineCompletion = mongoose.model('BaselineCompletion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, baselineCompletion;

/**
 * Baseline completion routes tests
 */
describe('Baseline completion CRUD tests', function() {
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

		// Save a user to the test db and create new Baseline completion
		user.save(function() {
			baselineCompletion = {
				name: 'Baseline completion Name'
			};

			done();
		});
	});

	it('should be able to save Baseline completion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline completion
				agent.post('/baseline-completions')
					.send(baselineCompletion)
					.expect(200)
					.end(function(baselineCompletionSaveErr, baselineCompletionSaveRes) {
						// Handle Baseline completion save error
						if (baselineCompletionSaveErr) done(baselineCompletionSaveErr);

						// Get a list of Baseline completions
						agent.get('/baseline-completions')
							.end(function(baselineCompletionsGetErr, baselineCompletionsGetRes) {
								// Handle Baseline completion save error
								if (baselineCompletionsGetErr) done(baselineCompletionsGetErr);

								// Get Baseline completions list
								var baselineCompletions = baselineCompletionsGetRes.body;

								// Set assertions
								(baselineCompletions[0].user._id).should.equal(userId);
								(baselineCompletions[0].name).should.match('Baseline completion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Baseline completion instance if not logged in', function(done) {
		agent.post('/baseline-completions')
			.send(baselineCompletion)
			.expect(401)
			.end(function(baselineCompletionSaveErr, baselineCompletionSaveRes) {
				// Call the assertion callback
				done(baselineCompletionSaveErr);
			});
	});

	it('should not be able to save Baseline completion instance if no name is provided', function(done) {
		// Invalidate name field
		baselineCompletion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline completion
				agent.post('/baseline-completions')
					.send(baselineCompletion)
					.expect(400)
					.end(function(baselineCompletionSaveErr, baselineCompletionSaveRes) {
						// Set message assertion
						(baselineCompletionSaveRes.body.message).should.match('Please fill Baseline completion name');
						
						// Handle Baseline completion save error
						done(baselineCompletionSaveErr);
					});
			});
	});

	it('should be able to update Baseline completion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline completion
				agent.post('/baseline-completions')
					.send(baselineCompletion)
					.expect(200)
					.end(function(baselineCompletionSaveErr, baselineCompletionSaveRes) {
						// Handle Baseline completion save error
						if (baselineCompletionSaveErr) done(baselineCompletionSaveErr);

						// Update Baseline completion name
						baselineCompletion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Baseline completion
						agent.put('/baseline-completions/' + baselineCompletionSaveRes.body._id)
							.send(baselineCompletion)
							.expect(200)
							.end(function(baselineCompletionUpdateErr, baselineCompletionUpdateRes) {
								// Handle Baseline completion update error
								if (baselineCompletionUpdateErr) done(baselineCompletionUpdateErr);

								// Set assertions
								(baselineCompletionUpdateRes.body._id).should.equal(baselineCompletionSaveRes.body._id);
								(baselineCompletionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Baseline completions if not signed in', function(done) {
		// Create new Baseline completion model instance
		var baselineCompletionObj = new BaselineCompletion(baselineCompletion);

		// Save the Baseline completion
		baselineCompletionObj.save(function() {
			// Request Baseline completions
			request(app).get('/baseline-completions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Baseline completion if not signed in', function(done) {
		// Create new Baseline completion model instance
		var baselineCompletionObj = new BaselineCompletion(baselineCompletion);

		// Save the Baseline completion
		baselineCompletionObj.save(function() {
			request(app).get('/baseline-completions/' + baselineCompletionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', baselineCompletion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Baseline completion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline completion
				agent.post('/baseline-completions')
					.send(baselineCompletion)
					.expect(200)
					.end(function(baselineCompletionSaveErr, baselineCompletionSaveRes) {
						// Handle Baseline completion save error
						if (baselineCompletionSaveErr) done(baselineCompletionSaveErr);

						// Delete existing Baseline completion
						agent.delete('/baseline-completions/' + baselineCompletionSaveRes.body._id)
							.send(baselineCompletion)
							.expect(200)
							.end(function(baselineCompletionDeleteErr, baselineCompletionDeleteRes) {
								// Handle Baseline completion error error
								if (baselineCompletionDeleteErr) done(baselineCompletionDeleteErr);

								// Set assertions
								(baselineCompletionDeleteRes.body._id).should.equal(baselineCompletionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Baseline completion instance if not signed in', function(done) {
		// Set Baseline completion user 
		baselineCompletion.user = user;

		// Create new Baseline completion model instance
		var baselineCompletionObj = new BaselineCompletion(baselineCompletion);

		// Save the Baseline completion
		baselineCompletionObj.save(function() {
			// Try deleting Baseline completion
			request(app).delete('/baseline-completions/' + baselineCompletionObj._id)
			.expect(401)
			.end(function(baselineCompletionDeleteErr, baselineCompletionDeleteRes) {
				// Set message assertion
				(baselineCompletionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Baseline completion error error
				done(baselineCompletionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		BaselineCompletion.remove().exec();
		done();
	});
});
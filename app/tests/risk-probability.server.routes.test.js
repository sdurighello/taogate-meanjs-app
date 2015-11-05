'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskProbability = mongoose.model('RiskProbability'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, riskProbability;

/**
 * Risk probability routes tests
 */
describe('Risk probability CRUD tests', function() {
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

		// Save a user to the test db and create new Risk probability
		user.save(function() {
			riskProbability = {
				name: 'Risk probability Name'
			};

			done();
		});
	});

	it('should be able to save Risk probability instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk probability
				agent.post('/risk-probabilities')
					.send(riskProbability)
					.expect(200)
					.end(function(riskProbabilitySaveErr, riskProbabilitySaveRes) {
						// Handle Risk probability save error
						if (riskProbabilitySaveErr) done(riskProbabilitySaveErr);

						// Get a list of Risk probabilities
						agent.get('/risk-probabilities')
							.end(function(riskProbabilitiesGetErr, riskProbabilitiesGetRes) {
								// Handle Risk probability save error
								if (riskProbabilitiesGetErr) done(riskProbabilitiesGetErr);

								// Get Risk probabilities list
								var riskProbabilities = riskProbabilitiesGetRes.body;

								// Set assertions
								(riskProbabilities[0].user._id).should.equal(userId);
								(riskProbabilities[0].name).should.match('Risk probability Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Risk probability instance if not logged in', function(done) {
		agent.post('/risk-probabilities')
			.send(riskProbability)
			.expect(401)
			.end(function(riskProbabilitySaveErr, riskProbabilitySaveRes) {
				// Call the assertion callback
				done(riskProbabilitySaveErr);
			});
	});

	it('should not be able to save Risk probability instance if no name is provided', function(done) {
		// Invalidate name field
		riskProbability.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk probability
				agent.post('/risk-probabilities')
					.send(riskProbability)
					.expect(400)
					.end(function(riskProbabilitySaveErr, riskProbabilitySaveRes) {
						// Set message assertion
						(riskProbabilitySaveRes.body.message).should.match('Please fill Risk probability name');
						
						// Handle Risk probability save error
						done(riskProbabilitySaveErr);
					});
			});
	});

	it('should be able to update Risk probability instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk probability
				agent.post('/risk-probabilities')
					.send(riskProbability)
					.expect(200)
					.end(function(riskProbabilitySaveErr, riskProbabilitySaveRes) {
						// Handle Risk probability save error
						if (riskProbabilitySaveErr) done(riskProbabilitySaveErr);

						// Update Risk probability name
						riskProbability.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Risk probability
						agent.put('/risk-probabilities/' + riskProbabilitySaveRes.body._id)
							.send(riskProbability)
							.expect(200)
							.end(function(riskProbabilityUpdateErr, riskProbabilityUpdateRes) {
								// Handle Risk probability update error
								if (riskProbabilityUpdateErr) done(riskProbabilityUpdateErr);

								// Set assertions
								(riskProbabilityUpdateRes.body._id).should.equal(riskProbabilitySaveRes.body._id);
								(riskProbabilityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Risk probabilities if not signed in', function(done) {
		// Create new Risk probability model instance
		var riskProbabilityObj = new RiskProbability(riskProbability);

		// Save the Risk probability
		riskProbabilityObj.save(function() {
			// Request Risk probabilities
			request(app).get('/risk-probabilities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Risk probability if not signed in', function(done) {
		// Create new Risk probability model instance
		var riskProbabilityObj = new RiskProbability(riskProbability);

		// Save the Risk probability
		riskProbabilityObj.save(function() {
			request(app).get('/risk-probabilities/' + riskProbabilityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', riskProbability.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Risk probability instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk probability
				agent.post('/risk-probabilities')
					.send(riskProbability)
					.expect(200)
					.end(function(riskProbabilitySaveErr, riskProbabilitySaveRes) {
						// Handle Risk probability save error
						if (riskProbabilitySaveErr) done(riskProbabilitySaveErr);

						// Delete existing Risk probability
						agent.delete('/risk-probabilities/' + riskProbabilitySaveRes.body._id)
							.send(riskProbability)
							.expect(200)
							.end(function(riskProbabilityDeleteErr, riskProbabilityDeleteRes) {
								// Handle Risk probability error error
								if (riskProbabilityDeleteErr) done(riskProbabilityDeleteErr);

								// Set assertions
								(riskProbabilityDeleteRes.body._id).should.equal(riskProbabilitySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Risk probability instance if not signed in', function(done) {
		// Set Risk probability user 
		riskProbability.user = user;

		// Create new Risk probability model instance
		var riskProbabilityObj = new RiskProbability(riskProbability);

		// Save the Risk probability
		riskProbabilityObj.save(function() {
			// Try deleting Risk probability
			request(app).delete('/risk-probabilities/' + riskProbabilityObj._id)
			.expect(401)
			.end(function(riskProbabilityDeleteErr, riskProbabilityDeleteRes) {
				// Set message assertion
				(riskProbabilityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Risk probability error error
				done(riskProbabilityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RiskProbability.remove().exec();
		done();
	});
});
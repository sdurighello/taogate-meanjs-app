'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskSeverity = mongoose.model('RiskSeverity'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, riskSeverity;

/**
 * Risk severity routes tests
 */
describe('Risk severity CRUD tests', function() {
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

		// Save a user to the test db and create new Risk severity
		user.save(function() {
			riskSeverity = {
				name: 'Risk severity Name'
			};

			done();
		});
	});

	it('should be able to save Risk severity instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity
				agent.post('/risk-severities')
					.send(riskSeverity)
					.expect(200)
					.end(function(riskSeveritySaveErr, riskSeveritySaveRes) {
						// Handle Risk severity save error
						if (riskSeveritySaveErr) done(riskSeveritySaveErr);

						// Get a list of Risk severities
						agent.get('/risk-severities')
							.end(function(riskSeveritiesGetErr, riskSeveritiesGetRes) {
								// Handle Risk severity save error
								if (riskSeveritiesGetErr) done(riskSeveritiesGetErr);

								// Get Risk severities list
								var riskSeverities = riskSeveritiesGetRes.body;

								// Set assertions
								(riskSeverities[0].user._id).should.equal(userId);
								(riskSeverities[0].name).should.match('Risk severity Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Risk severity instance if not logged in', function(done) {
		agent.post('/risk-severities')
			.send(riskSeverity)
			.expect(401)
			.end(function(riskSeveritySaveErr, riskSeveritySaveRes) {
				// Call the assertion callback
				done(riskSeveritySaveErr);
			});
	});

	it('should not be able to save Risk severity instance if no name is provided', function(done) {
		// Invalidate name field
		riskSeverity.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity
				agent.post('/risk-severities')
					.send(riskSeverity)
					.expect(400)
					.end(function(riskSeveritySaveErr, riskSeveritySaveRes) {
						// Set message assertion
						(riskSeveritySaveRes.body.message).should.match('Please fill Risk severity name');
						
						// Handle Risk severity save error
						done(riskSeveritySaveErr);
					});
			});
	});

	it('should be able to update Risk severity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity
				agent.post('/risk-severities')
					.send(riskSeverity)
					.expect(200)
					.end(function(riskSeveritySaveErr, riskSeveritySaveRes) {
						// Handle Risk severity save error
						if (riskSeveritySaveErr) done(riskSeveritySaveErr);

						// Update Risk severity name
						riskSeverity.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Risk severity
						agent.put('/risk-severities/' + riskSeveritySaveRes.body._id)
							.send(riskSeverity)
							.expect(200)
							.end(function(riskSeverityUpdateErr, riskSeverityUpdateRes) {
								// Handle Risk severity update error
								if (riskSeverityUpdateErr) done(riskSeverityUpdateErr);

								// Set assertions
								(riskSeverityUpdateRes.body._id).should.equal(riskSeveritySaveRes.body._id);
								(riskSeverityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Risk severities if not signed in', function(done) {
		// Create new Risk severity model instance
		var riskSeverityObj = new RiskSeverity(riskSeverity);

		// Save the Risk severity
		riskSeverityObj.save(function() {
			// Request Risk severities
			request(app).get('/risk-severities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Risk severity if not signed in', function(done) {
		// Create new Risk severity model instance
		var riskSeverityObj = new RiskSeverity(riskSeverity);

		// Save the Risk severity
		riskSeverityObj.save(function() {
			request(app).get('/risk-severities/' + riskSeverityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', riskSeverity.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Risk severity instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity
				agent.post('/risk-severities')
					.send(riskSeverity)
					.expect(200)
					.end(function(riskSeveritySaveErr, riskSeveritySaveRes) {
						// Handle Risk severity save error
						if (riskSeveritySaveErr) done(riskSeveritySaveErr);

						// Delete existing Risk severity
						agent.delete('/risk-severities/' + riskSeveritySaveRes.body._id)
							.send(riskSeverity)
							.expect(200)
							.end(function(riskSeverityDeleteErr, riskSeverityDeleteRes) {
								// Handle Risk severity error error
								if (riskSeverityDeleteErr) done(riskSeverityDeleteErr);

								// Set assertions
								(riskSeverityDeleteRes.body._id).should.equal(riskSeveritySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Risk severity instance if not signed in', function(done) {
		// Set Risk severity user 
		riskSeverity.user = user;

		// Create new Risk severity model instance
		var riskSeverityObj = new RiskSeverity(riskSeverity);

		// Save the Risk severity
		riskSeverityObj.save(function() {
			// Try deleting Risk severity
			request(app).delete('/risk-severities/' + riskSeverityObj._id)
			.expect(401)
			.end(function(riskSeverityDeleteErr, riskSeverityDeleteRes) {
				// Set message assertion
				(riskSeverityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Risk severity error error
				done(riskSeverityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RiskSeverity.remove().exec();
		done();
	});
});
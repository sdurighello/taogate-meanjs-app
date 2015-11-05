'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Risk = mongoose.model('Risk'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, risk;

/**
 * Risk routes tests
 */
describe('Risk CRUD tests', function() {
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

		// Save a user to the test db and create new Risk
		user.save(function() {
			risk = {
				name: 'Risk Name'
			};

			done();
		});
	});

	it('should be able to save Risk instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk
				agent.post('/risks')
					.send(risk)
					.expect(200)
					.end(function(riskSaveErr, riskSaveRes) {
						// Handle Risk save error
						if (riskSaveErr) done(riskSaveErr);

						// Get a list of Risks
						agent.get('/risks')
							.end(function(risksGetErr, risksGetRes) {
								// Handle Risk save error
								if (risksGetErr) done(risksGetErr);

								// Get Risks list
								var risks = risksGetRes.body;

								// Set assertions
								(risks[0].user._id).should.equal(userId);
								(risks[0].name).should.match('Risk Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Risk instance if not logged in', function(done) {
		agent.post('/risks')
			.send(risk)
			.expect(401)
			.end(function(riskSaveErr, riskSaveRes) {
				// Call the assertion callback
				done(riskSaveErr);
			});
	});

	it('should not be able to save Risk instance if no name is provided', function(done) {
		// Invalidate name field
		risk.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk
				agent.post('/risks')
					.send(risk)
					.expect(400)
					.end(function(riskSaveErr, riskSaveRes) {
						// Set message assertion
						(riskSaveRes.body.message).should.match('Please fill Risk name');
						
						// Handle Risk save error
						done(riskSaveErr);
					});
			});
	});

	it('should be able to update Risk instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk
				agent.post('/risks')
					.send(risk)
					.expect(200)
					.end(function(riskSaveErr, riskSaveRes) {
						// Handle Risk save error
						if (riskSaveErr) done(riskSaveErr);

						// Update Risk name
						risk.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Risk
						agent.put('/risks/' + riskSaveRes.body._id)
							.send(risk)
							.expect(200)
							.end(function(riskUpdateErr, riskUpdateRes) {
								// Handle Risk update error
								if (riskUpdateErr) done(riskUpdateErr);

								// Set assertions
								(riskUpdateRes.body._id).should.equal(riskSaveRes.body._id);
								(riskUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Risks if not signed in', function(done) {
		// Create new Risk model instance
		var riskObj = new Risk(risk);

		// Save the Risk
		riskObj.save(function() {
			// Request Risks
			request(app).get('/risks')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Risk if not signed in', function(done) {
		// Create new Risk model instance
		var riskObj = new Risk(risk);

		// Save the Risk
		riskObj.save(function() {
			request(app).get('/risks/' + riskObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', risk.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Risk instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk
				agent.post('/risks')
					.send(risk)
					.expect(200)
					.end(function(riskSaveErr, riskSaveRes) {
						// Handle Risk save error
						if (riskSaveErr) done(riskSaveErr);

						// Delete existing Risk
						agent.delete('/risks/' + riskSaveRes.body._id)
							.send(risk)
							.expect(200)
							.end(function(riskDeleteErr, riskDeleteRes) {
								// Handle Risk error error
								if (riskDeleteErr) done(riskDeleteErr);

								// Set assertions
								(riskDeleteRes.body._id).should.equal(riskSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Risk instance if not signed in', function(done) {
		// Set Risk user 
		risk.user = user;

		// Create new Risk model instance
		var riskObj = new Risk(risk);

		// Save the Risk
		riskObj.save(function() {
			// Try deleting Risk
			request(app).delete('/risks/' + riskObj._id)
			.expect(401)
			.end(function(riskDeleteErr, riskDeleteRes) {
				// Set message assertion
				(riskDeleteRes.body.message).should.match('User is not logged in');

				// Handle Risk error error
				done(riskDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Risk.remove().exec();
		done();
	});
});
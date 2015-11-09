'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateOutcome = mongoose.model('GateOutcome'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateOutcome;

/**
 * Gate outcome routes tests
 */
describe('Gate outcome CRUD tests', function() {
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

		// Save a user to the test db and create new Gate outcome
		user.save(function() {
			gateOutcome = {
				name: 'Gate outcome Name'
			};

			done();
		});
	});

	it('should be able to save Gate outcome instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome
				agent.post('/gate-outcomes')
					.send(gateOutcome)
					.expect(200)
					.end(function(gateOutcomeSaveErr, gateOutcomeSaveRes) {
						// Handle Gate outcome save error
						if (gateOutcomeSaveErr) done(gateOutcomeSaveErr);

						// Get a list of Gate outcomes
						agent.get('/gate-outcomes')
							.end(function(gateOutcomesGetErr, gateOutcomesGetRes) {
								// Handle Gate outcome save error
								if (gateOutcomesGetErr) done(gateOutcomesGetErr);

								// Get Gate outcomes list
								var gateOutcomes = gateOutcomesGetRes.body;

								// Set assertions
								(gateOutcomes[0].user._id).should.equal(userId);
								(gateOutcomes[0].name).should.match('Gate outcome Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate outcome instance if not logged in', function(done) {
		agent.post('/gate-outcomes')
			.send(gateOutcome)
			.expect(401)
			.end(function(gateOutcomeSaveErr, gateOutcomeSaveRes) {
				// Call the assertion callback
				done(gateOutcomeSaveErr);
			});
	});

	it('should not be able to save Gate outcome instance if no name is provided', function(done) {
		// Invalidate name field
		gateOutcome.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome
				agent.post('/gate-outcomes')
					.send(gateOutcome)
					.expect(400)
					.end(function(gateOutcomeSaveErr, gateOutcomeSaveRes) {
						// Set message assertion
						(gateOutcomeSaveRes.body.message).should.match('Please fill Gate outcome name');
						
						// Handle Gate outcome save error
						done(gateOutcomeSaveErr);
					});
			});
	});

	it('should be able to update Gate outcome instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome
				agent.post('/gate-outcomes')
					.send(gateOutcome)
					.expect(200)
					.end(function(gateOutcomeSaveErr, gateOutcomeSaveRes) {
						// Handle Gate outcome save error
						if (gateOutcomeSaveErr) done(gateOutcomeSaveErr);

						// Update Gate outcome name
						gateOutcome.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate outcome
						agent.put('/gate-outcomes/' + gateOutcomeSaveRes.body._id)
							.send(gateOutcome)
							.expect(200)
							.end(function(gateOutcomeUpdateErr, gateOutcomeUpdateRes) {
								// Handle Gate outcome update error
								if (gateOutcomeUpdateErr) done(gateOutcomeUpdateErr);

								// Set assertions
								(gateOutcomeUpdateRes.body._id).should.equal(gateOutcomeSaveRes.body._id);
								(gateOutcomeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate outcomes if not signed in', function(done) {
		// Create new Gate outcome model instance
		var gateOutcomeObj = new GateOutcome(gateOutcome);

		// Save the Gate outcome
		gateOutcomeObj.save(function() {
			// Request Gate outcomes
			request(app).get('/gate-outcomes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate outcome if not signed in', function(done) {
		// Create new Gate outcome model instance
		var gateOutcomeObj = new GateOutcome(gateOutcome);

		// Save the Gate outcome
		gateOutcomeObj.save(function() {
			request(app).get('/gate-outcomes/' + gateOutcomeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateOutcome.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate outcome instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome
				agent.post('/gate-outcomes')
					.send(gateOutcome)
					.expect(200)
					.end(function(gateOutcomeSaveErr, gateOutcomeSaveRes) {
						// Handle Gate outcome save error
						if (gateOutcomeSaveErr) done(gateOutcomeSaveErr);

						// Delete existing Gate outcome
						agent.delete('/gate-outcomes/' + gateOutcomeSaveRes.body._id)
							.send(gateOutcome)
							.expect(200)
							.end(function(gateOutcomeDeleteErr, gateOutcomeDeleteRes) {
								// Handle Gate outcome error error
								if (gateOutcomeDeleteErr) done(gateOutcomeDeleteErr);

								// Set assertions
								(gateOutcomeDeleteRes.body._id).should.equal(gateOutcomeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate outcome instance if not signed in', function(done) {
		// Set Gate outcome user 
		gateOutcome.user = user;

		// Create new Gate outcome model instance
		var gateOutcomeObj = new GateOutcome(gateOutcome);

		// Save the Gate outcome
		gateOutcomeObj.save(function() {
			// Try deleting Gate outcome
			request(app).delete('/gate-outcomes/' + gateOutcomeObj._id)
			.expect(401)
			.end(function(gateOutcomeDeleteErr, gateOutcomeDeleteRes) {
				// Set message assertion
				(gateOutcomeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate outcome error error
				done(gateOutcomeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateOutcome.remove().exec();
		done();
	});
});
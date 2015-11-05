'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskImpact = mongoose.model('RiskImpact'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, riskImpact;

/**
 * Risk impact routes tests
 */
describe('Risk impact CRUD tests', function() {
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

		// Save a user to the test db and create new Risk impact
		user.save(function() {
			riskImpact = {
				name: 'Risk impact Name'
			};

			done();
		});
	});

	it('should be able to save Risk impact instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk impact
				agent.post('/risk-impacts')
					.send(riskImpact)
					.expect(200)
					.end(function(riskImpactSaveErr, riskImpactSaveRes) {
						// Handle Risk impact save error
						if (riskImpactSaveErr) done(riskImpactSaveErr);

						// Get a list of Risk impacts
						agent.get('/risk-impacts')
							.end(function(riskImpactsGetErr, riskImpactsGetRes) {
								// Handle Risk impact save error
								if (riskImpactsGetErr) done(riskImpactsGetErr);

								// Get Risk impacts list
								var riskImpacts = riskImpactsGetRes.body;

								// Set assertions
								(riskImpacts[0].user._id).should.equal(userId);
								(riskImpacts[0].name).should.match('Risk impact Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Risk impact instance if not logged in', function(done) {
		agent.post('/risk-impacts')
			.send(riskImpact)
			.expect(401)
			.end(function(riskImpactSaveErr, riskImpactSaveRes) {
				// Call the assertion callback
				done(riskImpactSaveErr);
			});
	});

	it('should not be able to save Risk impact instance if no name is provided', function(done) {
		// Invalidate name field
		riskImpact.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk impact
				agent.post('/risk-impacts')
					.send(riskImpact)
					.expect(400)
					.end(function(riskImpactSaveErr, riskImpactSaveRes) {
						// Set message assertion
						(riskImpactSaveRes.body.message).should.match('Please fill Risk impact name');
						
						// Handle Risk impact save error
						done(riskImpactSaveErr);
					});
			});
	});

	it('should be able to update Risk impact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk impact
				agent.post('/risk-impacts')
					.send(riskImpact)
					.expect(200)
					.end(function(riskImpactSaveErr, riskImpactSaveRes) {
						// Handle Risk impact save error
						if (riskImpactSaveErr) done(riskImpactSaveErr);

						// Update Risk impact name
						riskImpact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Risk impact
						agent.put('/risk-impacts/' + riskImpactSaveRes.body._id)
							.send(riskImpact)
							.expect(200)
							.end(function(riskImpactUpdateErr, riskImpactUpdateRes) {
								// Handle Risk impact update error
								if (riskImpactUpdateErr) done(riskImpactUpdateErr);

								// Set assertions
								(riskImpactUpdateRes.body._id).should.equal(riskImpactSaveRes.body._id);
								(riskImpactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Risk impacts if not signed in', function(done) {
		// Create new Risk impact model instance
		var riskImpactObj = new RiskImpact(riskImpact);

		// Save the Risk impact
		riskImpactObj.save(function() {
			// Request Risk impacts
			request(app).get('/risk-impacts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Risk impact if not signed in', function(done) {
		// Create new Risk impact model instance
		var riskImpactObj = new RiskImpact(riskImpact);

		// Save the Risk impact
		riskImpactObj.save(function() {
			request(app).get('/risk-impacts/' + riskImpactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', riskImpact.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Risk impact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk impact
				agent.post('/risk-impacts')
					.send(riskImpact)
					.expect(200)
					.end(function(riskImpactSaveErr, riskImpactSaveRes) {
						// Handle Risk impact save error
						if (riskImpactSaveErr) done(riskImpactSaveErr);

						// Delete existing Risk impact
						agent.delete('/risk-impacts/' + riskImpactSaveRes.body._id)
							.send(riskImpact)
							.expect(200)
							.end(function(riskImpactDeleteErr, riskImpactDeleteRes) {
								// Handle Risk impact error error
								if (riskImpactDeleteErr) done(riskImpactDeleteErr);

								// Set assertions
								(riskImpactDeleteRes.body._id).should.equal(riskImpactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Risk impact instance if not signed in', function(done) {
		// Set Risk impact user 
		riskImpact.user = user;

		// Create new Risk impact model instance
		var riskImpactObj = new RiskImpact(riskImpact);

		// Save the Risk impact
		riskImpactObj.save(function() {
			// Try deleting Risk impact
			request(app).delete('/risk-impacts/' + riskImpactObj._id)
			.expect(401)
			.end(function(riskImpactDeleteErr, riskImpactDeleteRes) {
				// Set message assertion
				(riskImpactDeleteRes.body.message).should.match('User is not logged in');

				// Handle Risk impact error error
				done(riskImpactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RiskImpact.remove().exec();
		done();
	});
});
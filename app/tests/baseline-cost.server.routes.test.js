'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	BaselineCost = mongoose.model('BaselineCost'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, baselineCost;

/**
 * Baseline cost routes tests
 */
describe('Baseline cost CRUD tests', function() {
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

		// Save a user to the test db and create new Baseline cost
		user.save(function() {
			baselineCost = {
				name: 'Baseline cost Name'
			};

			done();
		});
	});

	it('should be able to save Baseline cost instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline cost
				agent.post('/baseline-costs')
					.send(baselineCost)
					.expect(200)
					.end(function(baselineCostSaveErr, baselineCostSaveRes) {
						// Handle Baseline cost save error
						if (baselineCostSaveErr) done(baselineCostSaveErr);

						// Get a list of Baseline costs
						agent.get('/baseline-costs')
							.end(function(baselineCostsGetErr, baselineCostsGetRes) {
								// Handle Baseline cost save error
								if (baselineCostsGetErr) done(baselineCostsGetErr);

								// Get Baseline costs list
								var baselineCosts = baselineCostsGetRes.body;

								// Set assertions
								(baselineCosts[0].user._id).should.equal(userId);
								(baselineCosts[0].name).should.match('Baseline cost Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Baseline cost instance if not logged in', function(done) {
		agent.post('/baseline-costs')
			.send(baselineCost)
			.expect(401)
			.end(function(baselineCostSaveErr, baselineCostSaveRes) {
				// Call the assertion callback
				done(baselineCostSaveErr);
			});
	});

	it('should not be able to save Baseline cost instance if no name is provided', function(done) {
		// Invalidate name field
		baselineCost.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline cost
				agent.post('/baseline-costs')
					.send(baselineCost)
					.expect(400)
					.end(function(baselineCostSaveErr, baselineCostSaveRes) {
						// Set message assertion
						(baselineCostSaveRes.body.message).should.match('Please fill Baseline cost name');
						
						// Handle Baseline cost save error
						done(baselineCostSaveErr);
					});
			});
	});

	it('should be able to update Baseline cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline cost
				agent.post('/baseline-costs')
					.send(baselineCost)
					.expect(200)
					.end(function(baselineCostSaveErr, baselineCostSaveRes) {
						// Handle Baseline cost save error
						if (baselineCostSaveErr) done(baselineCostSaveErr);

						// Update Baseline cost name
						baselineCost.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Baseline cost
						agent.put('/baseline-costs/' + baselineCostSaveRes.body._id)
							.send(baselineCost)
							.expect(200)
							.end(function(baselineCostUpdateErr, baselineCostUpdateRes) {
								// Handle Baseline cost update error
								if (baselineCostUpdateErr) done(baselineCostUpdateErr);

								// Set assertions
								(baselineCostUpdateRes.body._id).should.equal(baselineCostSaveRes.body._id);
								(baselineCostUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Baseline costs if not signed in', function(done) {
		// Create new Baseline cost model instance
		var baselineCostObj = new BaselineCost(baselineCost);

		// Save the Baseline cost
		baselineCostObj.save(function() {
			// Request Baseline costs
			request(app).get('/baseline-costs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Baseline cost if not signed in', function(done) {
		// Create new Baseline cost model instance
		var baselineCostObj = new BaselineCost(baselineCost);

		// Save the Baseline cost
		baselineCostObj.save(function() {
			request(app).get('/baseline-costs/' + baselineCostObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', baselineCost.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Baseline cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Baseline cost
				agent.post('/baseline-costs')
					.send(baselineCost)
					.expect(200)
					.end(function(baselineCostSaveErr, baselineCostSaveRes) {
						// Handle Baseline cost save error
						if (baselineCostSaveErr) done(baselineCostSaveErr);

						// Delete existing Baseline cost
						agent.delete('/baseline-costs/' + baselineCostSaveRes.body._id)
							.send(baselineCost)
							.expect(200)
							.end(function(baselineCostDeleteErr, baselineCostDeleteRes) {
								// Handle Baseline cost error error
								if (baselineCostDeleteErr) done(baselineCostDeleteErr);

								// Set assertions
								(baselineCostDeleteRes.body._id).should.equal(baselineCostSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Baseline cost instance if not signed in', function(done) {
		// Set Baseline cost user 
		baselineCost.user = user;

		// Create new Baseline cost model instance
		var baselineCostObj = new BaselineCost(baselineCost);

		// Save the Baseline cost
		baselineCostObj.save(function() {
			// Try deleting Baseline cost
			request(app).delete('/baseline-costs/' + baselineCostObj._id)
			.expect(401)
			.end(function(baselineCostDeleteErr, baselineCostDeleteRes) {
				// Set message assertion
				(baselineCostDeleteRes.body.message).should.match('User is not logged in');

				// Handle Baseline cost error error
				done(baselineCostDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		BaselineCost.remove().exec();
		done();
	});
});
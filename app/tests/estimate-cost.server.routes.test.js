'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	EstimateCost = mongoose.model('EstimateCost'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, estimateCost;

/**
 * Estimate cost routes tests
 */
describe('Estimate cost CRUD tests', function() {
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

		// Save a user to the test db and create new Estimate cost
		user.save(function() {
			estimateCost = {
				name: 'Estimate cost Name'
			};

			done();
		});
	});

	it('should be able to save Estimate cost instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate cost
				agent.post('/estimate-costs')
					.send(estimateCost)
					.expect(200)
					.end(function(estimateCostSaveErr, estimateCostSaveRes) {
						// Handle Estimate cost save error
						if (estimateCostSaveErr) done(estimateCostSaveErr);

						// Get a list of Estimate costs
						agent.get('/estimate-costs')
							.end(function(estimateCostsGetErr, estimateCostsGetRes) {
								// Handle Estimate cost save error
								if (estimateCostsGetErr) done(estimateCostsGetErr);

								// Get Estimate costs list
								var estimateCosts = estimateCostsGetRes.body;

								// Set assertions
								(estimateCosts[0].user._id).should.equal(userId);
								(estimateCosts[0].name).should.match('Estimate cost Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Estimate cost instance if not logged in', function(done) {
		agent.post('/estimate-costs')
			.send(estimateCost)
			.expect(401)
			.end(function(estimateCostSaveErr, estimateCostSaveRes) {
				// Call the assertion callback
				done(estimateCostSaveErr);
			});
	});

	it('should not be able to save Estimate cost instance if no name is provided', function(done) {
		// Invalidate name field
		estimateCost.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate cost
				agent.post('/estimate-costs')
					.send(estimateCost)
					.expect(400)
					.end(function(estimateCostSaveErr, estimateCostSaveRes) {
						// Set message assertion
						(estimateCostSaveRes.body.message).should.match('Please fill Estimate cost name');
						
						// Handle Estimate cost save error
						done(estimateCostSaveErr);
					});
			});
	});

	it('should be able to update Estimate cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate cost
				agent.post('/estimate-costs')
					.send(estimateCost)
					.expect(200)
					.end(function(estimateCostSaveErr, estimateCostSaveRes) {
						// Handle Estimate cost save error
						if (estimateCostSaveErr) done(estimateCostSaveErr);

						// Update Estimate cost name
						estimateCost.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Estimate cost
						agent.put('/estimate-costs/' + estimateCostSaveRes.body._id)
							.send(estimateCost)
							.expect(200)
							.end(function(estimateCostUpdateErr, estimateCostUpdateRes) {
								// Handle Estimate cost update error
								if (estimateCostUpdateErr) done(estimateCostUpdateErr);

								// Set assertions
								(estimateCostUpdateRes.body._id).should.equal(estimateCostSaveRes.body._id);
								(estimateCostUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Estimate costs if not signed in', function(done) {
		// Create new Estimate cost model instance
		var estimateCostObj = new EstimateCost(estimateCost);

		// Save the Estimate cost
		estimateCostObj.save(function() {
			// Request Estimate costs
			request(app).get('/estimate-costs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Estimate cost if not signed in', function(done) {
		// Create new Estimate cost model instance
		var estimateCostObj = new EstimateCost(estimateCost);

		// Save the Estimate cost
		estimateCostObj.save(function() {
			request(app).get('/estimate-costs/' + estimateCostObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', estimateCost.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Estimate cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Estimate cost
				agent.post('/estimate-costs')
					.send(estimateCost)
					.expect(200)
					.end(function(estimateCostSaveErr, estimateCostSaveRes) {
						// Handle Estimate cost save error
						if (estimateCostSaveErr) done(estimateCostSaveErr);

						// Delete existing Estimate cost
						agent.delete('/estimate-costs/' + estimateCostSaveRes.body._id)
							.send(estimateCost)
							.expect(200)
							.end(function(estimateCostDeleteErr, estimateCostDeleteRes) {
								// Handle Estimate cost error error
								if (estimateCostDeleteErr) done(estimateCostDeleteErr);

								// Set assertions
								(estimateCostDeleteRes.body._id).should.equal(estimateCostSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Estimate cost instance if not signed in', function(done) {
		// Set Estimate cost user 
		estimateCost.user = user;

		// Create new Estimate cost model instance
		var estimateCostObj = new EstimateCost(estimateCost);

		// Save the Estimate cost
		estimateCostObj.save(function() {
			// Try deleting Estimate cost
			request(app).delete('/estimate-costs/' + estimateCostObj._id)
			.expect(401)
			.end(function(estimateCostDeleteErr, estimateCostDeleteRes) {
				// Set message assertion
				(estimateCostDeleteRes.body.message).should.match('User is not logged in');

				// Handle Estimate cost error error
				done(estimateCostDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		EstimateCost.remove().exec();
		done();
	});
});
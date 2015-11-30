'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ActualCost = mongoose.model('ActualCost'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, actualCost;

/**
 * Actual cost routes tests
 */
describe('Actual cost CRUD tests', function() {
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

		// Save a user to the test db and create new Actual cost
		user.save(function() {
			actualCost = {
				name: 'Actual cost Name'
			};

			done();
		});
	});

	it('should be able to save Actual cost instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual cost
				agent.post('/actual-costs')
					.send(actualCost)
					.expect(200)
					.end(function(actualCostSaveErr, actualCostSaveRes) {
						// Handle Actual cost save error
						if (actualCostSaveErr) done(actualCostSaveErr);

						// Get a list of Actual costs
						agent.get('/actual-costs')
							.end(function(actualCostsGetErr, actualCostsGetRes) {
								// Handle Actual cost save error
								if (actualCostsGetErr) done(actualCostsGetErr);

								// Get Actual costs list
								var actualCosts = actualCostsGetRes.body;

								// Set assertions
								(actualCosts[0].user._id).should.equal(userId);
								(actualCosts[0].name).should.match('Actual cost Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Actual cost instance if not logged in', function(done) {
		agent.post('/actual-costs')
			.send(actualCost)
			.expect(401)
			.end(function(actualCostSaveErr, actualCostSaveRes) {
				// Call the assertion callback
				done(actualCostSaveErr);
			});
	});

	it('should not be able to save Actual cost instance if no name is provided', function(done) {
		// Invalidate name field
		actualCost.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual cost
				agent.post('/actual-costs')
					.send(actualCost)
					.expect(400)
					.end(function(actualCostSaveErr, actualCostSaveRes) {
						// Set message assertion
						(actualCostSaveRes.body.message).should.match('Please fill Actual cost name');
						
						// Handle Actual cost save error
						done(actualCostSaveErr);
					});
			});
	});

	it('should be able to update Actual cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual cost
				agent.post('/actual-costs')
					.send(actualCost)
					.expect(200)
					.end(function(actualCostSaveErr, actualCostSaveRes) {
						// Handle Actual cost save error
						if (actualCostSaveErr) done(actualCostSaveErr);

						// Update Actual cost name
						actualCost.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Actual cost
						agent.put('/actual-costs/' + actualCostSaveRes.body._id)
							.send(actualCost)
							.expect(200)
							.end(function(actualCostUpdateErr, actualCostUpdateRes) {
								// Handle Actual cost update error
								if (actualCostUpdateErr) done(actualCostUpdateErr);

								// Set assertions
								(actualCostUpdateRes.body._id).should.equal(actualCostSaveRes.body._id);
								(actualCostUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Actual costs if not signed in', function(done) {
		// Create new Actual cost model instance
		var actualCostObj = new ActualCost(actualCost);

		// Save the Actual cost
		actualCostObj.save(function() {
			// Request Actual costs
			request(app).get('/actual-costs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Actual cost if not signed in', function(done) {
		// Create new Actual cost model instance
		var actualCostObj = new ActualCost(actualCost);

		// Save the Actual cost
		actualCostObj.save(function() {
			request(app).get('/actual-costs/' + actualCostObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', actualCost.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Actual cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Actual cost
				agent.post('/actual-costs')
					.send(actualCost)
					.expect(200)
					.end(function(actualCostSaveErr, actualCostSaveRes) {
						// Handle Actual cost save error
						if (actualCostSaveErr) done(actualCostSaveErr);

						// Delete existing Actual cost
						agent.delete('/actual-costs/' + actualCostSaveRes.body._id)
							.send(actualCost)
							.expect(200)
							.end(function(actualCostDeleteErr, actualCostDeleteRes) {
								// Handle Actual cost error error
								if (actualCostDeleteErr) done(actualCostDeleteErr);

								// Set assertions
								(actualCostDeleteRes.body._id).should.equal(actualCostSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Actual cost instance if not signed in', function(done) {
		// Set Actual cost user 
		actualCost.user = user;

		// Create new Actual cost model instance
		var actualCostObj = new ActualCost(actualCost);

		// Save the Actual cost
		actualCostObj.save(function() {
			// Try deleting Actual cost
			request(app).delete('/actual-costs/' + actualCostObj._id)
			.expect(401)
			.end(function(actualCostDeleteErr, actualCostDeleteRes) {
				// Set message assertion
				(actualCostDeleteRes.body.message).should.match('User is not logged in');

				// Handle Actual cost error error
				done(actualCostDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ActualCost.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialCost = mongoose.model('FinancialCost'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, financialCost;

/**
 * Financial cost routes tests
 */
describe('Financial cost CRUD tests', function() {
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

		// Save a user to the test db and create new Financial cost
		user.save(function() {
			financialCost = {
				name: 'Financial cost Name'
			};

			done();
		});
	});

	it('should be able to save Financial cost instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost
				agent.post('/financial-costs')
					.send(financialCost)
					.expect(200)
					.end(function(financialCostSaveErr, financialCostSaveRes) {
						// Handle Financial cost save error
						if (financialCostSaveErr) done(financialCostSaveErr);

						// Get a list of Financial costs
						agent.get('/financial-costs')
							.end(function(financialCostsGetErr, financialCostsGetRes) {
								// Handle Financial cost save error
								if (financialCostsGetErr) done(financialCostsGetErr);

								// Get Financial costs list
								var financialCosts = financialCostsGetRes.body;

								// Set assertions
								(financialCosts[0].user._id).should.equal(userId);
								(financialCosts[0].name).should.match('Financial cost Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Financial cost instance if not logged in', function(done) {
		agent.post('/financial-costs')
			.send(financialCost)
			.expect(401)
			.end(function(financialCostSaveErr, financialCostSaveRes) {
				// Call the assertion callback
				done(financialCostSaveErr);
			});
	});

	it('should not be able to save Financial cost instance if no name is provided', function(done) {
		// Invalidate name field
		financialCost.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost
				agent.post('/financial-costs')
					.send(financialCost)
					.expect(400)
					.end(function(financialCostSaveErr, financialCostSaveRes) {
						// Set message assertion
						(financialCostSaveRes.body.message).should.match('Please fill Financial cost name');
						
						// Handle Financial cost save error
						done(financialCostSaveErr);
					});
			});
	});

	it('should be able to update Financial cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost
				agent.post('/financial-costs')
					.send(financialCost)
					.expect(200)
					.end(function(financialCostSaveErr, financialCostSaveRes) {
						// Handle Financial cost save error
						if (financialCostSaveErr) done(financialCostSaveErr);

						// Update Financial cost name
						financialCost.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Financial cost
						agent.put('/financial-costs/' + financialCostSaveRes.body._id)
							.send(financialCost)
							.expect(200)
							.end(function(financialCostUpdateErr, financialCostUpdateRes) {
								// Handle Financial cost update error
								if (financialCostUpdateErr) done(financialCostUpdateErr);

								// Set assertions
								(financialCostUpdateRes.body._id).should.equal(financialCostSaveRes.body._id);
								(financialCostUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Financial costs if not signed in', function(done) {
		// Create new Financial cost model instance
		var financialCostObj = new FinancialCost(financialCost);

		// Save the Financial cost
		financialCostObj.save(function() {
			// Request Financial costs
			request(app).get('/financial-costs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Financial cost if not signed in', function(done) {
		// Create new Financial cost model instance
		var financialCostObj = new FinancialCost(financialCost);

		// Save the Financial cost
		financialCostObj.save(function() {
			request(app).get('/financial-costs/' + financialCostObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', financialCost.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Financial cost instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost
				agent.post('/financial-costs')
					.send(financialCost)
					.expect(200)
					.end(function(financialCostSaveErr, financialCostSaveRes) {
						// Handle Financial cost save error
						if (financialCostSaveErr) done(financialCostSaveErr);

						// Delete existing Financial cost
						agent.delete('/financial-costs/' + financialCostSaveRes.body._id)
							.send(financialCost)
							.expect(200)
							.end(function(financialCostDeleteErr, financialCostDeleteRes) {
								// Handle Financial cost error error
								if (financialCostDeleteErr) done(financialCostDeleteErr);

								// Set assertions
								(financialCostDeleteRes.body._id).should.equal(financialCostSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Financial cost instance if not signed in', function(done) {
		// Set Financial cost user 
		financialCost.user = user;

		// Create new Financial cost model instance
		var financialCostObj = new FinancialCost(financialCost);

		// Save the Financial cost
		financialCostObj.save(function() {
			// Try deleting Financial cost
			request(app).delete('/financial-costs/' + financialCostObj._id)
			.expect(401)
			.end(function(financialCostDeleteErr, financialCostDeleteRes) {
				// Set message assertion
				(financialCostDeleteRes.body.message).should.match('User is not logged in');

				// Handle Financial cost error error
				done(financialCostDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FinancialCost.remove().exec();
		done();
	});
});
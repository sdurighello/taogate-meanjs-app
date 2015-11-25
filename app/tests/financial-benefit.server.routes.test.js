'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialBenefit = mongoose.model('FinancialBenefit'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, financialBenefit;

/**
 * Financial benefit routes tests
 */
describe('Financial benefit CRUD tests', function() {
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

		// Save a user to the test db and create new Financial benefit
		user.save(function() {
			financialBenefit = {
				name: 'Financial benefit Name'
			};

			done();
		});
	});

	it('should be able to save Financial benefit instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit
				agent.post('/financial-benefits')
					.send(financialBenefit)
					.expect(200)
					.end(function(financialBenefitSaveErr, financialBenefitSaveRes) {
						// Handle Financial benefit save error
						if (financialBenefitSaveErr) done(financialBenefitSaveErr);

						// Get a list of Financial benefits
						agent.get('/financial-benefits')
							.end(function(financialBenefitsGetErr, financialBenefitsGetRes) {
								// Handle Financial benefit save error
								if (financialBenefitsGetErr) done(financialBenefitsGetErr);

								// Get Financial benefits list
								var financialBenefits = financialBenefitsGetRes.body;

								// Set assertions
								(financialBenefits[0].user._id).should.equal(userId);
								(financialBenefits[0].name).should.match('Financial benefit Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Financial benefit instance if not logged in', function(done) {
		agent.post('/financial-benefits')
			.send(financialBenefit)
			.expect(401)
			.end(function(financialBenefitSaveErr, financialBenefitSaveRes) {
				// Call the assertion callback
				done(financialBenefitSaveErr);
			});
	});

	it('should not be able to save Financial benefit instance if no name is provided', function(done) {
		// Invalidate name field
		financialBenefit.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit
				agent.post('/financial-benefits')
					.send(financialBenefit)
					.expect(400)
					.end(function(financialBenefitSaveErr, financialBenefitSaveRes) {
						// Set message assertion
						(financialBenefitSaveRes.body.message).should.match('Please fill Financial benefit name');
						
						// Handle Financial benefit save error
						done(financialBenefitSaveErr);
					});
			});
	});

	it('should be able to update Financial benefit instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit
				agent.post('/financial-benefits')
					.send(financialBenefit)
					.expect(200)
					.end(function(financialBenefitSaveErr, financialBenefitSaveRes) {
						// Handle Financial benefit save error
						if (financialBenefitSaveErr) done(financialBenefitSaveErr);

						// Update Financial benefit name
						financialBenefit.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Financial benefit
						agent.put('/financial-benefits/' + financialBenefitSaveRes.body._id)
							.send(financialBenefit)
							.expect(200)
							.end(function(financialBenefitUpdateErr, financialBenefitUpdateRes) {
								// Handle Financial benefit update error
								if (financialBenefitUpdateErr) done(financialBenefitUpdateErr);

								// Set assertions
								(financialBenefitUpdateRes.body._id).should.equal(financialBenefitSaveRes.body._id);
								(financialBenefitUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Financial benefits if not signed in', function(done) {
		// Create new Financial benefit model instance
		var financialBenefitObj = new FinancialBenefit(financialBenefit);

		// Save the Financial benefit
		financialBenefitObj.save(function() {
			// Request Financial benefits
			request(app).get('/financial-benefits')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Financial benefit if not signed in', function(done) {
		// Create new Financial benefit model instance
		var financialBenefitObj = new FinancialBenefit(financialBenefit);

		// Save the Financial benefit
		financialBenefitObj.save(function() {
			request(app).get('/financial-benefits/' + financialBenefitObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', financialBenefit.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Financial benefit instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit
				agent.post('/financial-benefits')
					.send(financialBenefit)
					.expect(200)
					.end(function(financialBenefitSaveErr, financialBenefitSaveRes) {
						// Handle Financial benefit save error
						if (financialBenefitSaveErr) done(financialBenefitSaveErr);

						// Delete existing Financial benefit
						agent.delete('/financial-benefits/' + financialBenefitSaveRes.body._id)
							.send(financialBenefit)
							.expect(200)
							.end(function(financialBenefitDeleteErr, financialBenefitDeleteRes) {
								// Handle Financial benefit error error
								if (financialBenefitDeleteErr) done(financialBenefitDeleteErr);

								// Set assertions
								(financialBenefitDeleteRes.body._id).should.equal(financialBenefitSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Financial benefit instance if not signed in', function(done) {
		// Set Financial benefit user 
		financialBenefit.user = user;

		// Create new Financial benefit model instance
		var financialBenefitObj = new FinancialBenefit(financialBenefit);

		// Save the Financial benefit
		financialBenefitObj.save(function() {
			// Try deleting Financial benefit
			request(app).delete('/financial-benefits/' + financialBenefitObj._id)
			.expect(401)
			.end(function(financialBenefitDeleteErr, financialBenefitDeleteRes) {
				// Set message assertion
				(financialBenefitDeleteRes.body.message).should.match('User is not logged in');

				// Handle Financial benefit error error
				done(financialBenefitDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FinancialBenefit.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialBenefitType = mongoose.model('FinancialBenefitType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, financialBenefitType;

/**
 * Financial benefit type routes tests
 */
describe('Financial benefit type CRUD tests', function() {
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

		// Save a user to the test db and create new Financial benefit type
		user.save(function() {
			financialBenefitType = {
				name: 'Financial benefit type Name'
			};

			done();
		});
	});

	it('should be able to save Financial benefit type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit type
				agent.post('/financial-benefit-types')
					.send(financialBenefitType)
					.expect(200)
					.end(function(financialBenefitTypeSaveErr, financialBenefitTypeSaveRes) {
						// Handle Financial benefit type save error
						if (financialBenefitTypeSaveErr) done(financialBenefitTypeSaveErr);

						// Get a list of Financial benefit types
						agent.get('/financial-benefit-types')
							.end(function(financialBenefitTypesGetErr, financialBenefitTypesGetRes) {
								// Handle Financial benefit type save error
								if (financialBenefitTypesGetErr) done(financialBenefitTypesGetErr);

								// Get Financial benefit types list
								var financialBenefitTypes = financialBenefitTypesGetRes.body;

								// Set assertions
								(financialBenefitTypes[0].user._id).should.equal(userId);
								(financialBenefitTypes[0].name).should.match('Financial benefit type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Financial benefit type instance if not logged in', function(done) {
		agent.post('/financial-benefit-types')
			.send(financialBenefitType)
			.expect(401)
			.end(function(financialBenefitTypeSaveErr, financialBenefitTypeSaveRes) {
				// Call the assertion callback
				done(financialBenefitTypeSaveErr);
			});
	});

	it('should not be able to save Financial benefit type instance if no name is provided', function(done) {
		// Invalidate name field
		financialBenefitType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit type
				agent.post('/financial-benefit-types')
					.send(financialBenefitType)
					.expect(400)
					.end(function(financialBenefitTypeSaveErr, financialBenefitTypeSaveRes) {
						// Set message assertion
						(financialBenefitTypeSaveRes.body.message).should.match('Please fill Financial benefit type name');
						
						// Handle Financial benefit type save error
						done(financialBenefitTypeSaveErr);
					});
			});
	});

	it('should be able to update Financial benefit type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit type
				agent.post('/financial-benefit-types')
					.send(financialBenefitType)
					.expect(200)
					.end(function(financialBenefitTypeSaveErr, financialBenefitTypeSaveRes) {
						// Handle Financial benefit type save error
						if (financialBenefitTypeSaveErr) done(financialBenefitTypeSaveErr);

						// Update Financial benefit type name
						financialBenefitType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Financial benefit type
						agent.put('/financial-benefit-types/' + financialBenefitTypeSaveRes.body._id)
							.send(financialBenefitType)
							.expect(200)
							.end(function(financialBenefitTypeUpdateErr, financialBenefitTypeUpdateRes) {
								// Handle Financial benefit type update error
								if (financialBenefitTypeUpdateErr) done(financialBenefitTypeUpdateErr);

								// Set assertions
								(financialBenefitTypeUpdateRes.body._id).should.equal(financialBenefitTypeSaveRes.body._id);
								(financialBenefitTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Financial benefit types if not signed in', function(done) {
		// Create new Financial benefit type model instance
		var financialBenefitTypeObj = new FinancialBenefitType(financialBenefitType);

		// Save the Financial benefit type
		financialBenefitTypeObj.save(function() {
			// Request Financial benefit types
			request(app).get('/financial-benefit-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Financial benefit type if not signed in', function(done) {
		// Create new Financial benefit type model instance
		var financialBenefitTypeObj = new FinancialBenefitType(financialBenefitType);

		// Save the Financial benefit type
		financialBenefitTypeObj.save(function() {
			request(app).get('/financial-benefit-types/' + financialBenefitTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', financialBenefitType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Financial benefit type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit type
				agent.post('/financial-benefit-types')
					.send(financialBenefitType)
					.expect(200)
					.end(function(financialBenefitTypeSaveErr, financialBenefitTypeSaveRes) {
						// Handle Financial benefit type save error
						if (financialBenefitTypeSaveErr) done(financialBenefitTypeSaveErr);

						// Delete existing Financial benefit type
						agent.delete('/financial-benefit-types/' + financialBenefitTypeSaveRes.body._id)
							.send(financialBenefitType)
							.expect(200)
							.end(function(financialBenefitTypeDeleteErr, financialBenefitTypeDeleteRes) {
								// Handle Financial benefit type error error
								if (financialBenefitTypeDeleteErr) done(financialBenefitTypeDeleteErr);

								// Set assertions
								(financialBenefitTypeDeleteRes.body._id).should.equal(financialBenefitTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Financial benefit type instance if not signed in', function(done) {
		// Set Financial benefit type user 
		financialBenefitType.user = user;

		// Create new Financial benefit type model instance
		var financialBenefitTypeObj = new FinancialBenefitType(financialBenefitType);

		// Save the Financial benefit type
		financialBenefitTypeObj.save(function() {
			// Try deleting Financial benefit type
			request(app).delete('/financial-benefit-types/' + financialBenefitTypeObj._id)
			.expect(401)
			.end(function(financialBenefitTypeDeleteErr, financialBenefitTypeDeleteRes) {
				// Set message assertion
				(financialBenefitTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Financial benefit type error error
				done(financialBenefitTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FinancialBenefitType.remove().exec();
		done();
	});
});
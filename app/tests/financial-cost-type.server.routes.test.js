'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialCostType = mongoose.model('FinancialCostType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, financialCostType;

/**
 * Financial cost type routes tests
 */
describe('Financial cost type CRUD tests', function() {
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

		// Save a user to the test db and create new Financial cost type
		user.save(function() {
			financialCostType = {
				name: 'Financial cost type Name'
			};

			done();
		});
	});

	it('should be able to save Financial cost type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost type
				agent.post('/financial-cost-types')
					.send(financialCostType)
					.expect(200)
					.end(function(financialCostTypeSaveErr, financialCostTypeSaveRes) {
						// Handle Financial cost type save error
						if (financialCostTypeSaveErr) done(financialCostTypeSaveErr);

						// Get a list of Financial cost types
						agent.get('/financial-cost-types')
							.end(function(financialCostTypesGetErr, financialCostTypesGetRes) {
								// Handle Financial cost type save error
								if (financialCostTypesGetErr) done(financialCostTypesGetErr);

								// Get Financial cost types list
								var financialCostTypes = financialCostTypesGetRes.body;

								// Set assertions
								(financialCostTypes[0].user._id).should.equal(userId);
								(financialCostTypes[0].name).should.match('Financial cost type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Financial cost type instance if not logged in', function(done) {
		agent.post('/financial-cost-types')
			.send(financialCostType)
			.expect(401)
			.end(function(financialCostTypeSaveErr, financialCostTypeSaveRes) {
				// Call the assertion callback
				done(financialCostTypeSaveErr);
			});
	});

	it('should not be able to save Financial cost type instance if no name is provided', function(done) {
		// Invalidate name field
		financialCostType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost type
				agent.post('/financial-cost-types')
					.send(financialCostType)
					.expect(400)
					.end(function(financialCostTypeSaveErr, financialCostTypeSaveRes) {
						// Set message assertion
						(financialCostTypeSaveRes.body.message).should.match('Please fill Financial cost type name');
						
						// Handle Financial cost type save error
						done(financialCostTypeSaveErr);
					});
			});
	});

	it('should be able to update Financial cost type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost type
				agent.post('/financial-cost-types')
					.send(financialCostType)
					.expect(200)
					.end(function(financialCostTypeSaveErr, financialCostTypeSaveRes) {
						// Handle Financial cost type save error
						if (financialCostTypeSaveErr) done(financialCostTypeSaveErr);

						// Update Financial cost type name
						financialCostType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Financial cost type
						agent.put('/financial-cost-types/' + financialCostTypeSaveRes.body._id)
							.send(financialCostType)
							.expect(200)
							.end(function(financialCostTypeUpdateErr, financialCostTypeUpdateRes) {
								// Handle Financial cost type update error
								if (financialCostTypeUpdateErr) done(financialCostTypeUpdateErr);

								// Set assertions
								(financialCostTypeUpdateRes.body._id).should.equal(financialCostTypeSaveRes.body._id);
								(financialCostTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Financial cost types if not signed in', function(done) {
		// Create new Financial cost type model instance
		var financialCostTypeObj = new FinancialCostType(financialCostType);

		// Save the Financial cost type
		financialCostTypeObj.save(function() {
			// Request Financial cost types
			request(app).get('/financial-cost-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Financial cost type if not signed in', function(done) {
		// Create new Financial cost type model instance
		var financialCostTypeObj = new FinancialCostType(financialCostType);

		// Save the Financial cost type
		financialCostTypeObj.save(function() {
			request(app).get('/financial-cost-types/' + financialCostTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', financialCostType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Financial cost type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost type
				agent.post('/financial-cost-types')
					.send(financialCostType)
					.expect(200)
					.end(function(financialCostTypeSaveErr, financialCostTypeSaveRes) {
						// Handle Financial cost type save error
						if (financialCostTypeSaveErr) done(financialCostTypeSaveErr);

						// Delete existing Financial cost type
						agent.delete('/financial-cost-types/' + financialCostTypeSaveRes.body._id)
							.send(financialCostType)
							.expect(200)
							.end(function(financialCostTypeDeleteErr, financialCostTypeDeleteRes) {
								// Handle Financial cost type error error
								if (financialCostTypeDeleteErr) done(financialCostTypeDeleteErr);

								// Set assertions
								(financialCostTypeDeleteRes.body._id).should.equal(financialCostTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Financial cost type instance if not signed in', function(done) {
		// Set Financial cost type user 
		financialCostType.user = user;

		// Create new Financial cost type model instance
		var financialCostTypeObj = new FinancialCostType(financialCostType);

		// Save the Financial cost type
		financialCostTypeObj.save(function() {
			// Try deleting Financial cost type
			request(app).delete('/financial-cost-types/' + financialCostTypeObj._id)
			.expect(401)
			.end(function(financialCostTypeDeleteErr, financialCostTypeDeleteRes) {
				// Set message assertion
				(financialCostTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Financial cost type error error
				done(financialCostTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FinancialCostType.remove().exec();
		done();
	});
});
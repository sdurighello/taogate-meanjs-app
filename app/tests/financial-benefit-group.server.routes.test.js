'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialBenefitGroup = mongoose.model('FinancialBenefitGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, financialBenefitGroup;

/**
 * Financial benefit group routes tests
 */
describe('Financial benefit group CRUD tests', function() {
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

		// Save a user to the test db and create new Financial benefit group
		user.save(function() {
			financialBenefitGroup = {
				name: 'Financial benefit group Name'
			};

			done();
		});
	});

	it('should be able to save Financial benefit group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit group
				agent.post('/financial-benefit-groups')
					.send(financialBenefitGroup)
					.expect(200)
					.end(function(financialBenefitGroupSaveErr, financialBenefitGroupSaveRes) {
						// Handle Financial benefit group save error
						if (financialBenefitGroupSaveErr) done(financialBenefitGroupSaveErr);

						// Get a list of Financial benefit groups
						agent.get('/financial-benefit-groups')
							.end(function(financialBenefitGroupsGetErr, financialBenefitGroupsGetRes) {
								// Handle Financial benefit group save error
								if (financialBenefitGroupsGetErr) done(financialBenefitGroupsGetErr);

								// Get Financial benefit groups list
								var financialBenefitGroups = financialBenefitGroupsGetRes.body;

								// Set assertions
								(financialBenefitGroups[0].user._id).should.equal(userId);
								(financialBenefitGroups[0].name).should.match('Financial benefit group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Financial benefit group instance if not logged in', function(done) {
		agent.post('/financial-benefit-groups')
			.send(financialBenefitGroup)
			.expect(401)
			.end(function(financialBenefitGroupSaveErr, financialBenefitGroupSaveRes) {
				// Call the assertion callback
				done(financialBenefitGroupSaveErr);
			});
	});

	it('should not be able to save Financial benefit group instance if no name is provided', function(done) {
		// Invalidate name field
		financialBenefitGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit group
				agent.post('/financial-benefit-groups')
					.send(financialBenefitGroup)
					.expect(400)
					.end(function(financialBenefitGroupSaveErr, financialBenefitGroupSaveRes) {
						// Set message assertion
						(financialBenefitGroupSaveRes.body.message).should.match('Please fill Financial benefit group name');
						
						// Handle Financial benefit group save error
						done(financialBenefitGroupSaveErr);
					});
			});
	});

	it('should be able to update Financial benefit group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit group
				agent.post('/financial-benefit-groups')
					.send(financialBenefitGroup)
					.expect(200)
					.end(function(financialBenefitGroupSaveErr, financialBenefitGroupSaveRes) {
						// Handle Financial benefit group save error
						if (financialBenefitGroupSaveErr) done(financialBenefitGroupSaveErr);

						// Update Financial benefit group name
						financialBenefitGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Financial benefit group
						agent.put('/financial-benefit-groups/' + financialBenefitGroupSaveRes.body._id)
							.send(financialBenefitGroup)
							.expect(200)
							.end(function(financialBenefitGroupUpdateErr, financialBenefitGroupUpdateRes) {
								// Handle Financial benefit group update error
								if (financialBenefitGroupUpdateErr) done(financialBenefitGroupUpdateErr);

								// Set assertions
								(financialBenefitGroupUpdateRes.body._id).should.equal(financialBenefitGroupSaveRes.body._id);
								(financialBenefitGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Financial benefit groups if not signed in', function(done) {
		// Create new Financial benefit group model instance
		var financialBenefitGroupObj = new FinancialBenefitGroup(financialBenefitGroup);

		// Save the Financial benefit group
		financialBenefitGroupObj.save(function() {
			// Request Financial benefit groups
			request(app).get('/financial-benefit-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Financial benefit group if not signed in', function(done) {
		// Create new Financial benefit group model instance
		var financialBenefitGroupObj = new FinancialBenefitGroup(financialBenefitGroup);

		// Save the Financial benefit group
		financialBenefitGroupObj.save(function() {
			request(app).get('/financial-benefit-groups/' + financialBenefitGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', financialBenefitGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Financial benefit group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial benefit group
				agent.post('/financial-benefit-groups')
					.send(financialBenefitGroup)
					.expect(200)
					.end(function(financialBenefitGroupSaveErr, financialBenefitGroupSaveRes) {
						// Handle Financial benefit group save error
						if (financialBenefitGroupSaveErr) done(financialBenefitGroupSaveErr);

						// Delete existing Financial benefit group
						agent.delete('/financial-benefit-groups/' + financialBenefitGroupSaveRes.body._id)
							.send(financialBenefitGroup)
							.expect(200)
							.end(function(financialBenefitGroupDeleteErr, financialBenefitGroupDeleteRes) {
								// Handle Financial benefit group error error
								if (financialBenefitGroupDeleteErr) done(financialBenefitGroupDeleteErr);

								// Set assertions
								(financialBenefitGroupDeleteRes.body._id).should.equal(financialBenefitGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Financial benefit group instance if not signed in', function(done) {
		// Set Financial benefit group user 
		financialBenefitGroup.user = user;

		// Create new Financial benefit group model instance
		var financialBenefitGroupObj = new FinancialBenefitGroup(financialBenefitGroup);

		// Save the Financial benefit group
		financialBenefitGroupObj.save(function() {
			// Try deleting Financial benefit group
			request(app).delete('/financial-benefit-groups/' + financialBenefitGroupObj._id)
			.expect(401)
			.end(function(financialBenefitGroupDeleteErr, financialBenefitGroupDeleteRes) {
				// Set message assertion
				(financialBenefitGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Financial benefit group error error
				done(financialBenefitGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FinancialBenefitGroup.remove().exec();
		done();
	});
});
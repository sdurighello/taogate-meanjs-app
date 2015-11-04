'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	FinancialCostGroup = mongoose.model('FinancialCostGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, financialCostGroup;

/**
 * Financial cost group routes tests
 */
describe('Financial cost group CRUD tests', function() {
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

		// Save a user to the test db and create new Financial cost group
		user.save(function() {
			financialCostGroup = {
				name: 'Financial cost group Name'
			};

			done();
		});
	});

	it('should be able to save Financial cost group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost group
				agent.post('/financial-cost-groups')
					.send(financialCostGroup)
					.expect(200)
					.end(function(financialCostGroupSaveErr, financialCostGroupSaveRes) {
						// Handle Financial cost group save error
						if (financialCostGroupSaveErr) done(financialCostGroupSaveErr);

						// Get a list of Financial cost groups
						agent.get('/financial-cost-groups')
							.end(function(financialCostGroupsGetErr, financialCostGroupsGetRes) {
								// Handle Financial cost group save error
								if (financialCostGroupsGetErr) done(financialCostGroupsGetErr);

								// Get Financial cost groups list
								var financialCostGroups = financialCostGroupsGetRes.body;

								// Set assertions
								(financialCostGroups[0].user._id).should.equal(userId);
								(financialCostGroups[0].name).should.match('Financial cost group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Financial cost group instance if not logged in', function(done) {
		agent.post('/financial-cost-groups')
			.send(financialCostGroup)
			.expect(401)
			.end(function(financialCostGroupSaveErr, financialCostGroupSaveRes) {
				// Call the assertion callback
				done(financialCostGroupSaveErr);
			});
	});

	it('should not be able to save Financial cost group instance if no name is provided', function(done) {
		// Invalidate name field
		financialCostGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost group
				agent.post('/financial-cost-groups')
					.send(financialCostGroup)
					.expect(400)
					.end(function(financialCostGroupSaveErr, financialCostGroupSaveRes) {
						// Set message assertion
						(financialCostGroupSaveRes.body.message).should.match('Please fill Financial cost group name');
						
						// Handle Financial cost group save error
						done(financialCostGroupSaveErr);
					});
			});
	});

	it('should be able to update Financial cost group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost group
				agent.post('/financial-cost-groups')
					.send(financialCostGroup)
					.expect(200)
					.end(function(financialCostGroupSaveErr, financialCostGroupSaveRes) {
						// Handle Financial cost group save error
						if (financialCostGroupSaveErr) done(financialCostGroupSaveErr);

						// Update Financial cost group name
						financialCostGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Financial cost group
						agent.put('/financial-cost-groups/' + financialCostGroupSaveRes.body._id)
							.send(financialCostGroup)
							.expect(200)
							.end(function(financialCostGroupUpdateErr, financialCostGroupUpdateRes) {
								// Handle Financial cost group update error
								if (financialCostGroupUpdateErr) done(financialCostGroupUpdateErr);

								// Set assertions
								(financialCostGroupUpdateRes.body._id).should.equal(financialCostGroupSaveRes.body._id);
								(financialCostGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Financial cost groups if not signed in', function(done) {
		// Create new Financial cost group model instance
		var financialCostGroupObj = new FinancialCostGroup(financialCostGroup);

		// Save the Financial cost group
		financialCostGroupObj.save(function() {
			// Request Financial cost groups
			request(app).get('/financial-cost-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Financial cost group if not signed in', function(done) {
		// Create new Financial cost group model instance
		var financialCostGroupObj = new FinancialCostGroup(financialCostGroup);

		// Save the Financial cost group
		financialCostGroupObj.save(function() {
			request(app).get('/financial-cost-groups/' + financialCostGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', financialCostGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Financial cost group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Financial cost group
				agent.post('/financial-cost-groups')
					.send(financialCostGroup)
					.expect(200)
					.end(function(financialCostGroupSaveErr, financialCostGroupSaveRes) {
						// Handle Financial cost group save error
						if (financialCostGroupSaveErr) done(financialCostGroupSaveErr);

						// Delete existing Financial cost group
						agent.delete('/financial-cost-groups/' + financialCostGroupSaveRes.body._id)
							.send(financialCostGroup)
							.expect(200)
							.end(function(financialCostGroupDeleteErr, financialCostGroupDeleteRes) {
								// Handle Financial cost group error error
								if (financialCostGroupDeleteErr) done(financialCostGroupDeleteErr);

								// Set assertions
								(financialCostGroupDeleteRes.body._id).should.equal(financialCostGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Financial cost group instance if not signed in', function(done) {
		// Set Financial cost group user 
		financialCostGroup.user = user;

		// Create new Financial cost group model instance
		var financialCostGroupObj = new FinancialCostGroup(financialCostGroup);

		// Save the Financial cost group
		financialCostGroupObj.save(function() {
			// Try deleting Financial cost group
			request(app).delete('/financial-cost-groups/' + financialCostGroupObj._id)
			.expect(401)
			.end(function(financialCostGroupDeleteErr, financialCostGroupDeleteRes) {
				// Set message assertion
				(financialCostGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Financial cost group error error
				done(financialCostGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		FinancialCostGroup.remove().exec();
		done();
	});
});
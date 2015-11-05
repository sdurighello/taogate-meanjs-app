'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskCategory = mongoose.model('RiskCategory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, riskCategory;

/**
 * Risk category routes tests
 */
describe('Risk category CRUD tests', function() {
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

		// Save a user to the test db and create new Risk category
		user.save(function() {
			riskCategory = {
				name: 'Risk category Name'
			};

			done();
		});
	});

	it('should be able to save Risk category instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk category
				agent.post('/risk-categories')
					.send(riskCategory)
					.expect(200)
					.end(function(riskCategorySaveErr, riskCategorySaveRes) {
						// Handle Risk category save error
						if (riskCategorySaveErr) done(riskCategorySaveErr);

						// Get a list of Risk categories
						agent.get('/risk-categories')
							.end(function(riskCategoriesGetErr, riskCategoriesGetRes) {
								// Handle Risk category save error
								if (riskCategoriesGetErr) done(riskCategoriesGetErr);

								// Get Risk categories list
								var riskCategories = riskCategoriesGetRes.body;

								// Set assertions
								(riskCategories[0].user._id).should.equal(userId);
								(riskCategories[0].name).should.match('Risk category Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Risk category instance if not logged in', function(done) {
		agent.post('/risk-categories')
			.send(riskCategory)
			.expect(401)
			.end(function(riskCategorySaveErr, riskCategorySaveRes) {
				// Call the assertion callback
				done(riskCategorySaveErr);
			});
	});

	it('should not be able to save Risk category instance if no name is provided', function(done) {
		// Invalidate name field
		riskCategory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk category
				agent.post('/risk-categories')
					.send(riskCategory)
					.expect(400)
					.end(function(riskCategorySaveErr, riskCategorySaveRes) {
						// Set message assertion
						(riskCategorySaveRes.body.message).should.match('Please fill Risk category name');
						
						// Handle Risk category save error
						done(riskCategorySaveErr);
					});
			});
	});

	it('should be able to update Risk category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk category
				agent.post('/risk-categories')
					.send(riskCategory)
					.expect(200)
					.end(function(riskCategorySaveErr, riskCategorySaveRes) {
						// Handle Risk category save error
						if (riskCategorySaveErr) done(riskCategorySaveErr);

						// Update Risk category name
						riskCategory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Risk category
						agent.put('/risk-categories/' + riskCategorySaveRes.body._id)
							.send(riskCategory)
							.expect(200)
							.end(function(riskCategoryUpdateErr, riskCategoryUpdateRes) {
								// Handle Risk category update error
								if (riskCategoryUpdateErr) done(riskCategoryUpdateErr);

								// Set assertions
								(riskCategoryUpdateRes.body._id).should.equal(riskCategorySaveRes.body._id);
								(riskCategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Risk categories if not signed in', function(done) {
		// Create new Risk category model instance
		var riskCategoryObj = new RiskCategory(riskCategory);

		// Save the Risk category
		riskCategoryObj.save(function() {
			// Request Risk categories
			request(app).get('/risk-categories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Risk category if not signed in', function(done) {
		// Create new Risk category model instance
		var riskCategoryObj = new RiskCategory(riskCategory);

		// Save the Risk category
		riskCategoryObj.save(function() {
			request(app).get('/risk-categories/' + riskCategoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', riskCategory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Risk category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk category
				agent.post('/risk-categories')
					.send(riskCategory)
					.expect(200)
					.end(function(riskCategorySaveErr, riskCategorySaveRes) {
						// Handle Risk category save error
						if (riskCategorySaveErr) done(riskCategorySaveErr);

						// Delete existing Risk category
						agent.delete('/risk-categories/' + riskCategorySaveRes.body._id)
							.send(riskCategory)
							.expect(200)
							.end(function(riskCategoryDeleteErr, riskCategoryDeleteRes) {
								// Handle Risk category error error
								if (riskCategoryDeleteErr) done(riskCategoryDeleteErr);

								// Set assertions
								(riskCategoryDeleteRes.body._id).should.equal(riskCategorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Risk category instance if not signed in', function(done) {
		// Set Risk category user 
		riskCategory.user = user;

		// Create new Risk category model instance
		var riskCategoryObj = new RiskCategory(riskCategory);

		// Save the Risk category
		riskCategoryObj.save(function() {
			// Try deleting Risk category
			request(app).delete('/risk-categories/' + riskCategoryObj._id)
			.expect(401)
			.end(function(riskCategoryDeleteErr, riskCategoryDeleteRes) {
				// Set message assertion
				(riskCategoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Risk category error error
				done(riskCategoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RiskCategory.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioReviewType = mongoose.model('PortfolioReviewType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioReviewType;

/**
 * Portfolio review type routes tests
 */
describe('Portfolio review type CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio review type
		user.save(function() {
			portfolioReviewType = {
				name: 'Portfolio review type Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio review type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review type
				agent.post('/portfolio-review-types')
					.send(portfolioReviewType)
					.expect(200)
					.end(function(portfolioReviewTypeSaveErr, portfolioReviewTypeSaveRes) {
						// Handle Portfolio review type save error
						if (portfolioReviewTypeSaveErr) done(portfolioReviewTypeSaveErr);

						// Get a list of Portfolio review types
						agent.get('/portfolio-review-types')
							.end(function(portfolioReviewTypesGetErr, portfolioReviewTypesGetRes) {
								// Handle Portfolio review type save error
								if (portfolioReviewTypesGetErr) done(portfolioReviewTypesGetErr);

								// Get Portfolio review types list
								var portfolioReviewTypes = portfolioReviewTypesGetRes.body;

								// Set assertions
								(portfolioReviewTypes[0].user._id).should.equal(userId);
								(portfolioReviewTypes[0].name).should.match('Portfolio review type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio review type instance if not logged in', function(done) {
		agent.post('/portfolio-review-types')
			.send(portfolioReviewType)
			.expect(401)
			.end(function(portfolioReviewTypeSaveErr, portfolioReviewTypeSaveRes) {
				// Call the assertion callback
				done(portfolioReviewTypeSaveErr);
			});
	});

	it('should not be able to save Portfolio review type instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioReviewType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review type
				agent.post('/portfolio-review-types')
					.send(portfolioReviewType)
					.expect(400)
					.end(function(portfolioReviewTypeSaveErr, portfolioReviewTypeSaveRes) {
						// Set message assertion
						(portfolioReviewTypeSaveRes.body.message).should.match('Please fill Portfolio review type name');
						
						// Handle Portfolio review type save error
						done(portfolioReviewTypeSaveErr);
					});
			});
	});

	it('should be able to update Portfolio review type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review type
				agent.post('/portfolio-review-types')
					.send(portfolioReviewType)
					.expect(200)
					.end(function(portfolioReviewTypeSaveErr, portfolioReviewTypeSaveRes) {
						// Handle Portfolio review type save error
						if (portfolioReviewTypeSaveErr) done(portfolioReviewTypeSaveErr);

						// Update Portfolio review type name
						portfolioReviewType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio review type
						agent.put('/portfolio-review-types/' + portfolioReviewTypeSaveRes.body._id)
							.send(portfolioReviewType)
							.expect(200)
							.end(function(portfolioReviewTypeUpdateErr, portfolioReviewTypeUpdateRes) {
								// Handle Portfolio review type update error
								if (portfolioReviewTypeUpdateErr) done(portfolioReviewTypeUpdateErr);

								// Set assertions
								(portfolioReviewTypeUpdateRes.body._id).should.equal(portfolioReviewTypeSaveRes.body._id);
								(portfolioReviewTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio review types if not signed in', function(done) {
		// Create new Portfolio review type model instance
		var portfolioReviewTypeObj = new PortfolioReviewType(portfolioReviewType);

		// Save the Portfolio review type
		portfolioReviewTypeObj.save(function() {
			// Request Portfolio review types
			request(app).get('/portfolio-review-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio review type if not signed in', function(done) {
		// Create new Portfolio review type model instance
		var portfolioReviewTypeObj = new PortfolioReviewType(portfolioReviewType);

		// Save the Portfolio review type
		portfolioReviewTypeObj.save(function() {
			request(app).get('/portfolio-review-types/' + portfolioReviewTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioReviewType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio review type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review type
				agent.post('/portfolio-review-types')
					.send(portfolioReviewType)
					.expect(200)
					.end(function(portfolioReviewTypeSaveErr, portfolioReviewTypeSaveRes) {
						// Handle Portfolio review type save error
						if (portfolioReviewTypeSaveErr) done(portfolioReviewTypeSaveErr);

						// Delete existing Portfolio review type
						agent.delete('/portfolio-review-types/' + portfolioReviewTypeSaveRes.body._id)
							.send(portfolioReviewType)
							.expect(200)
							.end(function(portfolioReviewTypeDeleteErr, portfolioReviewTypeDeleteRes) {
								// Handle Portfolio review type error error
								if (portfolioReviewTypeDeleteErr) done(portfolioReviewTypeDeleteErr);

								// Set assertions
								(portfolioReviewTypeDeleteRes.body._id).should.equal(portfolioReviewTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio review type instance if not signed in', function(done) {
		// Set Portfolio review type user 
		portfolioReviewType.user = user;

		// Create new Portfolio review type model instance
		var portfolioReviewTypeObj = new PortfolioReviewType(portfolioReviewType);

		// Save the Portfolio review type
		portfolioReviewTypeObj.save(function() {
			// Try deleting Portfolio review type
			request(app).delete('/portfolio-review-types/' + portfolioReviewTypeObj._id)
			.expect(401)
			.end(function(portfolioReviewTypeDeleteErr, portfolioReviewTypeDeleteRes) {
				// Set message assertion
				(portfolioReviewTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio review type error error
				done(portfolioReviewTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioReviewType.remove().exec();
		done();
	});
});
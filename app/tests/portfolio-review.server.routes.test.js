'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioReview = mongoose.model('PortfolioReview'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioReview;

/**
 * Portfolio review routes tests
 */
describe('Portfolio review CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio review
		user.save(function() {
			portfolioReview = {
				name: 'Portfolio review Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio review instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review
				agent.post('/portfolio-reviews')
					.send(portfolioReview)
					.expect(200)
					.end(function(portfolioReviewSaveErr, portfolioReviewSaveRes) {
						// Handle Portfolio review save error
						if (portfolioReviewSaveErr) done(portfolioReviewSaveErr);

						// Get a list of Portfolio reviews
						agent.get('/portfolio-reviews')
							.end(function(portfolioReviewsGetErr, portfolioReviewsGetRes) {
								// Handle Portfolio review save error
								if (portfolioReviewsGetErr) done(portfolioReviewsGetErr);

								// Get Portfolio reviews list
								var portfolioReviews = portfolioReviewsGetRes.body;

								// Set assertions
								(portfolioReviews[0].user._id).should.equal(userId);
								(portfolioReviews[0].name).should.match('Portfolio review Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio review instance if not logged in', function(done) {
		agent.post('/portfolio-reviews')
			.send(portfolioReview)
			.expect(401)
			.end(function(portfolioReviewSaveErr, portfolioReviewSaveRes) {
				// Call the assertion callback
				done(portfolioReviewSaveErr);
			});
	});

	it('should not be able to save Portfolio review instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioReview.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review
				agent.post('/portfolio-reviews')
					.send(portfolioReview)
					.expect(400)
					.end(function(portfolioReviewSaveErr, portfolioReviewSaveRes) {
						// Set message assertion
						(portfolioReviewSaveRes.body.message).should.match('Please fill Portfolio review name');
						
						// Handle Portfolio review save error
						done(portfolioReviewSaveErr);
					});
			});
	});

	it('should be able to update Portfolio review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review
				agent.post('/portfolio-reviews')
					.send(portfolioReview)
					.expect(200)
					.end(function(portfolioReviewSaveErr, portfolioReviewSaveRes) {
						// Handle Portfolio review save error
						if (portfolioReviewSaveErr) done(portfolioReviewSaveErr);

						// Update Portfolio review name
						portfolioReview.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio review
						agent.put('/portfolio-reviews/' + portfolioReviewSaveRes.body._id)
							.send(portfolioReview)
							.expect(200)
							.end(function(portfolioReviewUpdateErr, portfolioReviewUpdateRes) {
								// Handle Portfolio review update error
								if (portfolioReviewUpdateErr) done(portfolioReviewUpdateErr);

								// Set assertions
								(portfolioReviewUpdateRes.body._id).should.equal(portfolioReviewSaveRes.body._id);
								(portfolioReviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio reviews if not signed in', function(done) {
		// Create new Portfolio review model instance
		var portfolioReviewObj = new PortfolioReview(portfolioReview);

		// Save the Portfolio review
		portfolioReviewObj.save(function() {
			// Request Portfolio reviews
			request(app).get('/portfolio-reviews')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio review if not signed in', function(done) {
		// Create new Portfolio review model instance
		var portfolioReviewObj = new PortfolioReview(portfolioReview);

		// Save the Portfolio review
		portfolioReviewObj.save(function() {
			request(app).get('/portfolio-reviews/' + portfolioReviewObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioReview.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review
				agent.post('/portfolio-reviews')
					.send(portfolioReview)
					.expect(200)
					.end(function(portfolioReviewSaveErr, portfolioReviewSaveRes) {
						// Handle Portfolio review save error
						if (portfolioReviewSaveErr) done(portfolioReviewSaveErr);

						// Delete existing Portfolio review
						agent.delete('/portfolio-reviews/' + portfolioReviewSaveRes.body._id)
							.send(portfolioReview)
							.expect(200)
							.end(function(portfolioReviewDeleteErr, portfolioReviewDeleteRes) {
								// Handle Portfolio review error error
								if (portfolioReviewDeleteErr) done(portfolioReviewDeleteErr);

								// Set assertions
								(portfolioReviewDeleteRes.body._id).should.equal(portfolioReviewSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio review instance if not signed in', function(done) {
		// Set Portfolio review user 
		portfolioReview.user = user;

		// Create new Portfolio review model instance
		var portfolioReviewObj = new PortfolioReview(portfolioReview);

		// Save the Portfolio review
		portfolioReviewObj.save(function() {
			// Try deleting Portfolio review
			request(app).delete('/portfolio-reviews/' + portfolioReviewObj._id)
			.expect(401)
			.end(function(portfolioReviewDeleteErr, portfolioReviewDeleteRes) {
				// Set message assertion
				(portfolioReviewDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio review error error
				done(portfolioReviewDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioReview.remove().exec();
		done();
	});
});
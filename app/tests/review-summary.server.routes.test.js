'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ReviewSummary = mongoose.model('ReviewSummary'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, reviewSummary;

/**
 * Review summary routes tests
 */
describe('Review summary CRUD tests', function() {
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

		// Save a user to the test db and create new Review summary
		user.save(function() {
			reviewSummary = {
				name: 'Review summary Name'
			};

			done();
		});
	});

	it('should be able to save Review summary instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Review summary
				agent.post('/review-summaries')
					.send(reviewSummary)
					.expect(200)
					.end(function(reviewSummarySaveErr, reviewSummarySaveRes) {
						// Handle Review summary save error
						if (reviewSummarySaveErr) done(reviewSummarySaveErr);

						// Get a list of Review summaries
						agent.get('/review-summaries')
							.end(function(reviewSummariesGetErr, reviewSummariesGetRes) {
								// Handle Review summary save error
								if (reviewSummariesGetErr) done(reviewSummariesGetErr);

								// Get Review summaries list
								var reviewSummaries = reviewSummariesGetRes.body;

								// Set assertions
								(reviewSummaries[0].user._id).should.equal(userId);
								(reviewSummaries[0].name).should.match('Review summary Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Review summary instance if not logged in', function(done) {
		agent.post('/review-summaries')
			.send(reviewSummary)
			.expect(401)
			.end(function(reviewSummarySaveErr, reviewSummarySaveRes) {
				// Call the assertion callback
				done(reviewSummarySaveErr);
			});
	});

	it('should not be able to save Review summary instance if no name is provided', function(done) {
		// Invalidate name field
		reviewSummary.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Review summary
				agent.post('/review-summaries')
					.send(reviewSummary)
					.expect(400)
					.end(function(reviewSummarySaveErr, reviewSummarySaveRes) {
						// Set message assertion
						(reviewSummarySaveRes.body.message).should.match('Please fill Review summary name');
						
						// Handle Review summary save error
						done(reviewSummarySaveErr);
					});
			});
	});

	it('should be able to update Review summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Review summary
				agent.post('/review-summaries')
					.send(reviewSummary)
					.expect(200)
					.end(function(reviewSummarySaveErr, reviewSummarySaveRes) {
						// Handle Review summary save error
						if (reviewSummarySaveErr) done(reviewSummarySaveErr);

						// Update Review summary name
						reviewSummary.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Review summary
						agent.put('/review-summaries/' + reviewSummarySaveRes.body._id)
							.send(reviewSummary)
							.expect(200)
							.end(function(reviewSummaryUpdateErr, reviewSummaryUpdateRes) {
								// Handle Review summary update error
								if (reviewSummaryUpdateErr) done(reviewSummaryUpdateErr);

								// Set assertions
								(reviewSummaryUpdateRes.body._id).should.equal(reviewSummarySaveRes.body._id);
								(reviewSummaryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Review summaries if not signed in', function(done) {
		// Create new Review summary model instance
		var reviewSummaryObj = new ReviewSummary(reviewSummary);

		// Save the Review summary
		reviewSummaryObj.save(function() {
			// Request Review summaries
			request(app).get('/review-summaries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Review summary if not signed in', function(done) {
		// Create new Review summary model instance
		var reviewSummaryObj = new ReviewSummary(reviewSummary);

		// Save the Review summary
		reviewSummaryObj.save(function() {
			request(app).get('/review-summaries/' + reviewSummaryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', reviewSummary.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Review summary instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Review summary
				agent.post('/review-summaries')
					.send(reviewSummary)
					.expect(200)
					.end(function(reviewSummarySaveErr, reviewSummarySaveRes) {
						// Handle Review summary save error
						if (reviewSummarySaveErr) done(reviewSummarySaveErr);

						// Delete existing Review summary
						agent.delete('/review-summaries/' + reviewSummarySaveRes.body._id)
							.send(reviewSummary)
							.expect(200)
							.end(function(reviewSummaryDeleteErr, reviewSummaryDeleteRes) {
								// Handle Review summary error error
								if (reviewSummaryDeleteErr) done(reviewSummaryDeleteErr);

								// Set assertions
								(reviewSummaryDeleteRes.body._id).should.equal(reviewSummarySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Review summary instance if not signed in', function(done) {
		// Set Review summary user 
		reviewSummary.user = user;

		// Create new Review summary model instance
		var reviewSummaryObj = new ReviewSummary(reviewSummary);

		// Save the Review summary
		reviewSummaryObj.save(function() {
			// Try deleting Review summary
			request(app).delete('/review-summaries/' + reviewSummaryObj._id)
			.expect(401)
			.end(function(reviewSummaryDeleteErr, reviewSummaryDeleteRes) {
				// Set message assertion
				(reviewSummaryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Review summary error error
				done(reviewSummaryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ReviewSummary.remove().exec();
		done();
	});
});
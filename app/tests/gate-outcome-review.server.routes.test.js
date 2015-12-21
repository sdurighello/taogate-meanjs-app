'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateOutcomeReview = mongoose.model('GateOutcomeReview'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateOutcomeReview;

/**
 * Gate outcome review routes tests
 */
describe('Gate outcome review CRUD tests', function() {
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

		// Save a user to the test db and create new Gate outcome review
		user.save(function() {
			gateOutcomeReview = {
				name: 'Gate outcome review Name'
			};

			done();
		});
	});

	it('should be able to save Gate outcome review instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome review
				agent.post('/gate-outcome-reviews')
					.send(gateOutcomeReview)
					.expect(200)
					.end(function(gateOutcomeReviewSaveErr, gateOutcomeReviewSaveRes) {
						// Handle Gate outcome review save error
						if (gateOutcomeReviewSaveErr) done(gateOutcomeReviewSaveErr);

						// Get a list of Gate outcome reviews
						agent.get('/gate-outcome-reviews')
							.end(function(gateOutcomeReviewsGetErr, gateOutcomeReviewsGetRes) {
								// Handle Gate outcome review save error
								if (gateOutcomeReviewsGetErr) done(gateOutcomeReviewsGetErr);

								// Get Gate outcome reviews list
								var gateOutcomeReviews = gateOutcomeReviewsGetRes.body;

								// Set assertions
								(gateOutcomeReviews[0].user._id).should.equal(userId);
								(gateOutcomeReviews[0].name).should.match('Gate outcome review Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate outcome review instance if not logged in', function(done) {
		agent.post('/gate-outcome-reviews')
			.send(gateOutcomeReview)
			.expect(401)
			.end(function(gateOutcomeReviewSaveErr, gateOutcomeReviewSaveRes) {
				// Call the assertion callback
				done(gateOutcomeReviewSaveErr);
			});
	});

	it('should not be able to save Gate outcome review instance if no name is provided', function(done) {
		// Invalidate name field
		gateOutcomeReview.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome review
				agent.post('/gate-outcome-reviews')
					.send(gateOutcomeReview)
					.expect(400)
					.end(function(gateOutcomeReviewSaveErr, gateOutcomeReviewSaveRes) {
						// Set message assertion
						(gateOutcomeReviewSaveRes.body.message).should.match('Please fill Gate outcome review name');
						
						// Handle Gate outcome review save error
						done(gateOutcomeReviewSaveErr);
					});
			});
	});

	it('should be able to update Gate outcome review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome review
				agent.post('/gate-outcome-reviews')
					.send(gateOutcomeReview)
					.expect(200)
					.end(function(gateOutcomeReviewSaveErr, gateOutcomeReviewSaveRes) {
						// Handle Gate outcome review save error
						if (gateOutcomeReviewSaveErr) done(gateOutcomeReviewSaveErr);

						// Update Gate outcome review name
						gateOutcomeReview.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate outcome review
						agent.put('/gate-outcome-reviews/' + gateOutcomeReviewSaveRes.body._id)
							.send(gateOutcomeReview)
							.expect(200)
							.end(function(gateOutcomeReviewUpdateErr, gateOutcomeReviewUpdateRes) {
								// Handle Gate outcome review update error
								if (gateOutcomeReviewUpdateErr) done(gateOutcomeReviewUpdateErr);

								// Set assertions
								(gateOutcomeReviewUpdateRes.body._id).should.equal(gateOutcomeReviewSaveRes.body._id);
								(gateOutcomeReviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate outcome reviews if not signed in', function(done) {
		// Create new Gate outcome review model instance
		var gateOutcomeReviewObj = new GateOutcomeReview(gateOutcomeReview);

		// Save the Gate outcome review
		gateOutcomeReviewObj.save(function() {
			// Request Gate outcome reviews
			request(app).get('/gate-outcome-reviews')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate outcome review if not signed in', function(done) {
		// Create new Gate outcome review model instance
		var gateOutcomeReviewObj = new GateOutcomeReview(gateOutcomeReview);

		// Save the Gate outcome review
		gateOutcomeReviewObj.save(function() {
			request(app).get('/gate-outcome-reviews/' + gateOutcomeReviewObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateOutcomeReview.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate outcome review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate outcome review
				agent.post('/gate-outcome-reviews')
					.send(gateOutcomeReview)
					.expect(200)
					.end(function(gateOutcomeReviewSaveErr, gateOutcomeReviewSaveRes) {
						// Handle Gate outcome review save error
						if (gateOutcomeReviewSaveErr) done(gateOutcomeReviewSaveErr);

						// Delete existing Gate outcome review
						agent.delete('/gate-outcome-reviews/' + gateOutcomeReviewSaveRes.body._id)
							.send(gateOutcomeReview)
							.expect(200)
							.end(function(gateOutcomeReviewDeleteErr, gateOutcomeReviewDeleteRes) {
								// Handle Gate outcome review error error
								if (gateOutcomeReviewDeleteErr) done(gateOutcomeReviewDeleteErr);

								// Set assertions
								(gateOutcomeReviewDeleteRes.body._id).should.equal(gateOutcomeReviewSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate outcome review instance if not signed in', function(done) {
		// Set Gate outcome review user 
		gateOutcomeReview.user = user;

		// Create new Gate outcome review model instance
		var gateOutcomeReviewObj = new GateOutcomeReview(gateOutcomeReview);

		// Save the Gate outcome review
		gateOutcomeReviewObj.save(function() {
			// Try deleting Gate outcome review
			request(app).delete('/gate-outcome-reviews/' + gateOutcomeReviewObj._id)
			.expect(401)
			.end(function(gateOutcomeReviewDeleteErr, gateOutcomeReviewDeleteRes) {
				// Set message assertion
				(gateOutcomeReviewDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate outcome review error error
				done(gateOutcomeReviewDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateOutcomeReview.remove().exec();
		done();
	});
});
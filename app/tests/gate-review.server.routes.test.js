'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateReview = mongoose.model('GateReview'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateReview;

/**
 * Gate review routes tests
 */
describe('Gate review CRUD tests', function() {
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

		// Save a user to the test db and create new Gate review
		user.save(function() {
			gateReview = {
				name: 'Gate review Name'
			};

			done();
		});
	});

	it('should be able to save Gate review instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate review
				agent.post('/gate-reviews')
					.send(gateReview)
					.expect(200)
					.end(function(gateReviewSaveErr, gateReviewSaveRes) {
						// Handle Gate review save error
						if (gateReviewSaveErr) done(gateReviewSaveErr);

						// Get a list of Gate reviews
						agent.get('/gate-reviews')
							.end(function(gateReviewsGetErr, gateReviewsGetRes) {
								// Handle Gate review save error
								if (gateReviewsGetErr) done(gateReviewsGetErr);

								// Get Gate reviews list
								var gateReviews = gateReviewsGetRes.body;

								// Set assertions
								(gateReviews[0].user._id).should.equal(userId);
								(gateReviews[0].name).should.match('Gate review Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate review instance if not logged in', function(done) {
		agent.post('/gate-reviews')
			.send(gateReview)
			.expect(401)
			.end(function(gateReviewSaveErr, gateReviewSaveRes) {
				// Call the assertion callback
				done(gateReviewSaveErr);
			});
	});

	it('should not be able to save Gate review instance if no name is provided', function(done) {
		// Invalidate name field
		gateReview.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate review
				agent.post('/gate-reviews')
					.send(gateReview)
					.expect(400)
					.end(function(gateReviewSaveErr, gateReviewSaveRes) {
						// Set message assertion
						(gateReviewSaveRes.body.message).should.match('Please fill Gate review name');
						
						// Handle Gate review save error
						done(gateReviewSaveErr);
					});
			});
	});

	it('should be able to update Gate review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate review
				agent.post('/gate-reviews')
					.send(gateReview)
					.expect(200)
					.end(function(gateReviewSaveErr, gateReviewSaveRes) {
						// Handle Gate review save error
						if (gateReviewSaveErr) done(gateReviewSaveErr);

						// Update Gate review name
						gateReview.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate review
						agent.put('/gate-reviews/' + gateReviewSaveRes.body._id)
							.send(gateReview)
							.expect(200)
							.end(function(gateReviewUpdateErr, gateReviewUpdateRes) {
								// Handle Gate review update error
								if (gateReviewUpdateErr) done(gateReviewUpdateErr);

								// Set assertions
								(gateReviewUpdateRes.body._id).should.equal(gateReviewSaveRes.body._id);
								(gateReviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate reviews if not signed in', function(done) {
		// Create new Gate review model instance
		var gateReviewObj = new GateReview(gateReview);

		// Save the Gate review
		gateReviewObj.save(function() {
			// Request Gate reviews
			request(app).get('/gate-reviews')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate review if not signed in', function(done) {
		// Create new Gate review model instance
		var gateReviewObj = new GateReview(gateReview);

		// Save the Gate review
		gateReviewObj.save(function() {
			request(app).get('/gate-reviews/' + gateReviewObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateReview.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate review
				agent.post('/gate-reviews')
					.send(gateReview)
					.expect(200)
					.end(function(gateReviewSaveErr, gateReviewSaveRes) {
						// Handle Gate review save error
						if (gateReviewSaveErr) done(gateReviewSaveErr);

						// Delete existing Gate review
						agent.delete('/gate-reviews/' + gateReviewSaveRes.body._id)
							.send(gateReview)
							.expect(200)
							.end(function(gateReviewDeleteErr, gateReviewDeleteRes) {
								// Handle Gate review error error
								if (gateReviewDeleteErr) done(gateReviewDeleteErr);

								// Set assertions
								(gateReviewDeleteRes.body._id).should.equal(gateReviewSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate review instance if not signed in', function(done) {
		// Set Gate review user 
		gateReview.user = user;

		// Create new Gate review model instance
		var gateReviewObj = new GateReview(gateReview);

		// Save the Gate review
		gateReviewObj.save(function() {
			// Try deleting Gate review
			request(app).delete('/gate-reviews/' + gateReviewObj._id)
			.expect(401)
			.end(function(gateReviewDeleteErr, gateReviewDeleteRes) {
				// Set message assertion
				(gateReviewDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate review error error
				done(gateReviewDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateReview.remove().exec();
		done();
	});
});
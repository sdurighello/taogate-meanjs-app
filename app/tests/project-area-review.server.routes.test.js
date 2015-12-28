'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectAreaReview = mongoose.model('ProjectAreaReview'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectAreaReview;

/**
 * Project area review routes tests
 */
describe('Project area review CRUD tests', function() {
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

		// Save a user to the test db and create new Project area review
		user.save(function() {
			projectAreaReview = {
				name: 'Project area review Name'
			};

			done();
		});
	});

	it('should be able to save Project area review instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project area review
				agent.post('/project-area-reviews')
					.send(projectAreaReview)
					.expect(200)
					.end(function(projectAreaReviewSaveErr, projectAreaReviewSaveRes) {
						// Handle Project area review save error
						if (projectAreaReviewSaveErr) done(projectAreaReviewSaveErr);

						// Get a list of Project area reviews
						agent.get('/project-area-reviews')
							.end(function(projectAreaReviewsGetErr, projectAreaReviewsGetRes) {
								// Handle Project area review save error
								if (projectAreaReviewsGetErr) done(projectAreaReviewsGetErr);

								// Get Project area reviews list
								var projectAreaReviews = projectAreaReviewsGetRes.body;

								// Set assertions
								(projectAreaReviews[0].user._id).should.equal(userId);
								(projectAreaReviews[0].name).should.match('Project area review Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project area review instance if not logged in', function(done) {
		agent.post('/project-area-reviews')
			.send(projectAreaReview)
			.expect(401)
			.end(function(projectAreaReviewSaveErr, projectAreaReviewSaveRes) {
				// Call the assertion callback
				done(projectAreaReviewSaveErr);
			});
	});

	it('should not be able to save Project area review instance if no name is provided', function(done) {
		// Invalidate name field
		projectAreaReview.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project area review
				agent.post('/project-area-reviews')
					.send(projectAreaReview)
					.expect(400)
					.end(function(projectAreaReviewSaveErr, projectAreaReviewSaveRes) {
						// Set message assertion
						(projectAreaReviewSaveRes.body.message).should.match('Please fill Project area review name');
						
						// Handle Project area review save error
						done(projectAreaReviewSaveErr);
					});
			});
	});

	it('should be able to update Project area review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project area review
				agent.post('/project-area-reviews')
					.send(projectAreaReview)
					.expect(200)
					.end(function(projectAreaReviewSaveErr, projectAreaReviewSaveRes) {
						// Handle Project area review save error
						if (projectAreaReviewSaveErr) done(projectAreaReviewSaveErr);

						// Update Project area review name
						projectAreaReview.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project area review
						agent.put('/project-area-reviews/' + projectAreaReviewSaveRes.body._id)
							.send(projectAreaReview)
							.expect(200)
							.end(function(projectAreaReviewUpdateErr, projectAreaReviewUpdateRes) {
								// Handle Project area review update error
								if (projectAreaReviewUpdateErr) done(projectAreaReviewUpdateErr);

								// Set assertions
								(projectAreaReviewUpdateRes.body._id).should.equal(projectAreaReviewSaveRes.body._id);
								(projectAreaReviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project area reviews if not signed in', function(done) {
		// Create new Project area review model instance
		var projectAreaReviewObj = new ProjectAreaReview(projectAreaReview);

		// Save the Project area review
		projectAreaReviewObj.save(function() {
			// Request Project area reviews
			request(app).get('/project-area-reviews')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project area review if not signed in', function(done) {
		// Create new Project area review model instance
		var projectAreaReviewObj = new ProjectAreaReview(projectAreaReview);

		// Save the Project area review
		projectAreaReviewObj.save(function() {
			request(app).get('/project-area-reviews/' + projectAreaReviewObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectAreaReview.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project area review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project area review
				agent.post('/project-area-reviews')
					.send(projectAreaReview)
					.expect(200)
					.end(function(projectAreaReviewSaveErr, projectAreaReviewSaveRes) {
						// Handle Project area review save error
						if (projectAreaReviewSaveErr) done(projectAreaReviewSaveErr);

						// Delete existing Project area review
						agent.delete('/project-area-reviews/' + projectAreaReviewSaveRes.body._id)
							.send(projectAreaReview)
							.expect(200)
							.end(function(projectAreaReviewDeleteErr, projectAreaReviewDeleteRes) {
								// Handle Project area review error error
								if (projectAreaReviewDeleteErr) done(projectAreaReviewDeleteErr);

								// Set assertions
								(projectAreaReviewDeleteRes.body._id).should.equal(projectAreaReviewSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project area review instance if not signed in', function(done) {
		// Set Project area review user 
		projectAreaReview.user = user;

		// Create new Project area review model instance
		var projectAreaReviewObj = new ProjectAreaReview(projectAreaReview);

		// Save the Project area review
		projectAreaReviewObj.save(function() {
			// Try deleting Project area review
			request(app).delete('/project-area-reviews/' + projectAreaReviewObj._id)
			.expect(401)
			.end(function(projectAreaReviewDeleteErr, projectAreaReviewDeleteRes) {
				// Set message assertion
				(projectAreaReviewDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project area review error error
				done(projectAreaReviewDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectAreaReview.remove().exec();
		done();
	});
});
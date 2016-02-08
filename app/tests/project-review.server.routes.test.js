'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectReview = mongoose.model('ProjectReview'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectReview;

/**
 * Project review routes tests
 */
describe('Project review CRUD tests', function() {
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

		// Save a user to the test db and create new Project review
		user.save(function() {
			projectReview = {
				name: 'Project review Name'
			};

			done();
		});
	});

	it('should be able to save Project review instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review
				agent.post('/project-reviews')
					.send(projectReview)
					.expect(200)
					.end(function(projectReviewSaveErr, projectReviewSaveRes) {
						// Handle Project review save error
						if (projectReviewSaveErr) done(projectReviewSaveErr);

						// Get a list of Project reviews
						agent.get('/project-reviews')
							.end(function(projectReviewsGetErr, projectReviewsGetRes) {
								// Handle Project review save error
								if (projectReviewsGetErr) done(projectReviewsGetErr);

								// Get Project reviews list
								var projectReviews = projectReviewsGetRes.body;

								// Set assertions
								(projectReviews[0].user._id).should.equal(userId);
								(projectReviews[0].name).should.match('Project review Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project review instance if not logged in', function(done) {
		agent.post('/project-reviews')
			.send(projectReview)
			.expect(401)
			.end(function(projectReviewSaveErr, projectReviewSaveRes) {
				// Call the assertion callback
				done(projectReviewSaveErr);
			});
	});

	it('should not be able to save Project review instance if no name is provided', function(done) {
		// Invalidate name field
		projectReview.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review
				agent.post('/project-reviews')
					.send(projectReview)
					.expect(400)
					.end(function(projectReviewSaveErr, projectReviewSaveRes) {
						// Set message assertion
						(projectReviewSaveRes.body.message).should.match('Please fill Project review name');
						
						// Handle Project review save error
						done(projectReviewSaveErr);
					});
			});
	});

	it('should be able to update Project review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review
				agent.post('/project-reviews')
					.send(projectReview)
					.expect(200)
					.end(function(projectReviewSaveErr, projectReviewSaveRes) {
						// Handle Project review save error
						if (projectReviewSaveErr) done(projectReviewSaveErr);

						// Update Project review name
						projectReview.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project review
						agent.put('/project-reviews/' + projectReviewSaveRes.body._id)
							.send(projectReview)
							.expect(200)
							.end(function(projectReviewUpdateErr, projectReviewUpdateRes) {
								// Handle Project review update error
								if (projectReviewUpdateErr) done(projectReviewUpdateErr);

								// Set assertions
								(projectReviewUpdateRes.body._id).should.equal(projectReviewSaveRes.body._id);
								(projectReviewUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project reviews if not signed in', function(done) {
		// Create new Project review model instance
		var projectReviewObj = new ProjectReview(projectReview);

		// Save the Project review
		projectReviewObj.save(function() {
			// Request Project reviews
			request(app).get('/project-reviews')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project review if not signed in', function(done) {
		// Create new Project review model instance
		var projectReviewObj = new ProjectReview(projectReview);

		// Save the Project review
		projectReviewObj.save(function() {
			request(app).get('/project-reviews/' + projectReviewObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectReview.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project review instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review
				agent.post('/project-reviews')
					.send(projectReview)
					.expect(200)
					.end(function(projectReviewSaveErr, projectReviewSaveRes) {
						// Handle Project review save error
						if (projectReviewSaveErr) done(projectReviewSaveErr);

						// Delete existing Project review
						agent.delete('/project-reviews/' + projectReviewSaveRes.body._id)
							.send(projectReview)
							.expect(200)
							.end(function(projectReviewDeleteErr, projectReviewDeleteRes) {
								// Handle Project review error error
								if (projectReviewDeleteErr) done(projectReviewDeleteErr);

								// Set assertions
								(projectReviewDeleteRes.body._id).should.equal(projectReviewSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project review instance if not signed in', function(done) {
		// Set Project review user 
		projectReview.user = user;

		// Create new Project review model instance
		var projectReviewObj = new ProjectReview(projectReview);

		// Save the Project review
		projectReviewObj.save(function() {
			// Try deleting Project review
			request(app).delete('/project-reviews/' + projectReviewObj._id)
			.expect(401)
			.end(function(projectReviewDeleteErr, projectReviewDeleteRes) {
				// Set message assertion
				(projectReviewDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project review error error
				done(projectReviewDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectReview.remove().exec();
		done();
	});
});
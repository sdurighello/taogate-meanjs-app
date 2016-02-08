'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectReviewScore = mongoose.model('ProjectReviewScore'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectReviewScore;

/**
 * Project review score routes tests
 */
describe('Project review score CRUD tests', function() {
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

		// Save a user to the test db and create new Project review score
		user.save(function() {
			projectReviewScore = {
				name: 'Project review score Name'
			};

			done();
		});
	});

	it('should be able to save Project review score instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review score
				agent.post('/project-review-scores')
					.send(projectReviewScore)
					.expect(200)
					.end(function(projectReviewScoreSaveErr, projectReviewScoreSaveRes) {
						// Handle Project review score save error
						if (projectReviewScoreSaveErr) done(projectReviewScoreSaveErr);

						// Get a list of Project review scores
						agent.get('/project-review-scores')
							.end(function(projectReviewScoresGetErr, projectReviewScoresGetRes) {
								// Handle Project review score save error
								if (projectReviewScoresGetErr) done(projectReviewScoresGetErr);

								// Get Project review scores list
								var projectReviewScores = projectReviewScoresGetRes.body;

								// Set assertions
								(projectReviewScores[0].user._id).should.equal(userId);
								(projectReviewScores[0].name).should.match('Project review score Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project review score instance if not logged in', function(done) {
		agent.post('/project-review-scores')
			.send(projectReviewScore)
			.expect(401)
			.end(function(projectReviewScoreSaveErr, projectReviewScoreSaveRes) {
				// Call the assertion callback
				done(projectReviewScoreSaveErr);
			});
	});

	it('should not be able to save Project review score instance if no name is provided', function(done) {
		// Invalidate name field
		projectReviewScore.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review score
				agent.post('/project-review-scores')
					.send(projectReviewScore)
					.expect(400)
					.end(function(projectReviewScoreSaveErr, projectReviewScoreSaveRes) {
						// Set message assertion
						(projectReviewScoreSaveRes.body.message).should.match('Please fill Project review score name');
						
						// Handle Project review score save error
						done(projectReviewScoreSaveErr);
					});
			});
	});

	it('should be able to update Project review score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review score
				agent.post('/project-review-scores')
					.send(projectReviewScore)
					.expect(200)
					.end(function(projectReviewScoreSaveErr, projectReviewScoreSaveRes) {
						// Handle Project review score save error
						if (projectReviewScoreSaveErr) done(projectReviewScoreSaveErr);

						// Update Project review score name
						projectReviewScore.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project review score
						agent.put('/project-review-scores/' + projectReviewScoreSaveRes.body._id)
							.send(projectReviewScore)
							.expect(200)
							.end(function(projectReviewScoreUpdateErr, projectReviewScoreUpdateRes) {
								// Handle Project review score update error
								if (projectReviewScoreUpdateErr) done(projectReviewScoreUpdateErr);

								// Set assertions
								(projectReviewScoreUpdateRes.body._id).should.equal(projectReviewScoreSaveRes.body._id);
								(projectReviewScoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project review scores if not signed in', function(done) {
		// Create new Project review score model instance
		var projectReviewScoreObj = new ProjectReviewScore(projectReviewScore);

		// Save the Project review score
		projectReviewScoreObj.save(function() {
			// Request Project review scores
			request(app).get('/project-review-scores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project review score if not signed in', function(done) {
		// Create new Project review score model instance
		var projectReviewScoreObj = new ProjectReviewScore(projectReviewScore);

		// Save the Project review score
		projectReviewScoreObj.save(function() {
			request(app).get('/project-review-scores/' + projectReviewScoreObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectReviewScore.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project review score instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review score
				agent.post('/project-review-scores')
					.send(projectReviewScore)
					.expect(200)
					.end(function(projectReviewScoreSaveErr, projectReviewScoreSaveRes) {
						// Handle Project review score save error
						if (projectReviewScoreSaveErr) done(projectReviewScoreSaveErr);

						// Delete existing Project review score
						agent.delete('/project-review-scores/' + projectReviewScoreSaveRes.body._id)
							.send(projectReviewScore)
							.expect(200)
							.end(function(projectReviewScoreDeleteErr, projectReviewScoreDeleteRes) {
								// Handle Project review score error error
								if (projectReviewScoreDeleteErr) done(projectReviewScoreDeleteErr);

								// Set assertions
								(projectReviewScoreDeleteRes.body._id).should.equal(projectReviewScoreSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project review score instance if not signed in', function(done) {
		// Set Project review score user 
		projectReviewScore.user = user;

		// Create new Project review score model instance
		var projectReviewScoreObj = new ProjectReviewScore(projectReviewScore);

		// Save the Project review score
		projectReviewScoreObj.save(function() {
			// Try deleting Project review score
			request(app).delete('/project-review-scores/' + projectReviewScoreObj._id)
			.expect(401)
			.end(function(projectReviewScoreDeleteErr, projectReviewScoreDeleteRes) {
				// Set message assertion
				(projectReviewScoreDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project review score error error
				done(projectReviewScoreDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectReviewScore.remove().exec();
		done();
	});
});
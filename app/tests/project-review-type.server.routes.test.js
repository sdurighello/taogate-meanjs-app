'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectReviewType = mongoose.model('ProjectReviewType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectReviewType;

/**
 * Project review type routes tests
 */
describe('Project review type CRUD tests', function() {
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

		// Save a user to the test db and create new Project review type
		user.save(function() {
			projectReviewType = {
				name: 'Project review type Name'
			};

			done();
		});
	});

	it('should be able to save Project review type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review type
				agent.post('/project-review-types')
					.send(projectReviewType)
					.expect(200)
					.end(function(projectReviewTypeSaveErr, projectReviewTypeSaveRes) {
						// Handle Project review type save error
						if (projectReviewTypeSaveErr) done(projectReviewTypeSaveErr);

						// Get a list of Project review types
						agent.get('/project-review-types')
							.end(function(projectReviewTypesGetErr, projectReviewTypesGetRes) {
								// Handle Project review type save error
								if (projectReviewTypesGetErr) done(projectReviewTypesGetErr);

								// Get Project review types list
								var projectReviewTypes = projectReviewTypesGetRes.body;

								// Set assertions
								(projectReviewTypes[0].user._id).should.equal(userId);
								(projectReviewTypes[0].name).should.match('Project review type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project review type instance if not logged in', function(done) {
		agent.post('/project-review-types')
			.send(projectReviewType)
			.expect(401)
			.end(function(projectReviewTypeSaveErr, projectReviewTypeSaveRes) {
				// Call the assertion callback
				done(projectReviewTypeSaveErr);
			});
	});

	it('should not be able to save Project review type instance if no name is provided', function(done) {
		// Invalidate name field
		projectReviewType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review type
				agent.post('/project-review-types')
					.send(projectReviewType)
					.expect(400)
					.end(function(projectReviewTypeSaveErr, projectReviewTypeSaveRes) {
						// Set message assertion
						(projectReviewTypeSaveRes.body.message).should.match('Please fill Project review type name');
						
						// Handle Project review type save error
						done(projectReviewTypeSaveErr);
					});
			});
	});

	it('should be able to update Project review type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review type
				agent.post('/project-review-types')
					.send(projectReviewType)
					.expect(200)
					.end(function(projectReviewTypeSaveErr, projectReviewTypeSaveRes) {
						// Handle Project review type save error
						if (projectReviewTypeSaveErr) done(projectReviewTypeSaveErr);

						// Update Project review type name
						projectReviewType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project review type
						agent.put('/project-review-types/' + projectReviewTypeSaveRes.body._id)
							.send(projectReviewType)
							.expect(200)
							.end(function(projectReviewTypeUpdateErr, projectReviewTypeUpdateRes) {
								// Handle Project review type update error
								if (projectReviewTypeUpdateErr) done(projectReviewTypeUpdateErr);

								// Set assertions
								(projectReviewTypeUpdateRes.body._id).should.equal(projectReviewTypeSaveRes.body._id);
								(projectReviewTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project review types if not signed in', function(done) {
		// Create new Project review type model instance
		var projectReviewTypeObj = new ProjectReviewType(projectReviewType);

		// Save the Project review type
		projectReviewTypeObj.save(function() {
			// Request Project review types
			request(app).get('/project-review-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project review type if not signed in', function(done) {
		// Create new Project review type model instance
		var projectReviewTypeObj = new ProjectReviewType(projectReviewType);

		// Save the Project review type
		projectReviewTypeObj.save(function() {
			request(app).get('/project-review-types/' + projectReviewTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectReviewType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project review type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review type
				agent.post('/project-review-types')
					.send(projectReviewType)
					.expect(200)
					.end(function(projectReviewTypeSaveErr, projectReviewTypeSaveRes) {
						// Handle Project review type save error
						if (projectReviewTypeSaveErr) done(projectReviewTypeSaveErr);

						// Delete existing Project review type
						agent.delete('/project-review-types/' + projectReviewTypeSaveRes.body._id)
							.send(projectReviewType)
							.expect(200)
							.end(function(projectReviewTypeDeleteErr, projectReviewTypeDeleteRes) {
								// Handle Project review type error error
								if (projectReviewTypeDeleteErr) done(projectReviewTypeDeleteErr);

								// Set assertions
								(projectReviewTypeDeleteRes.body._id).should.equal(projectReviewTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project review type instance if not signed in', function(done) {
		// Set Project review type user 
		projectReviewType.user = user;

		// Create new Project review type model instance
		var projectReviewTypeObj = new ProjectReviewType(projectReviewType);

		// Save the Project review type
		projectReviewTypeObj.save(function() {
			// Try deleting Project review type
			request(app).delete('/project-review-types/' + projectReviewTypeObj._id)
			.expect(401)
			.end(function(projectReviewTypeDeleteErr, projectReviewTypeDeleteRes) {
				// Set message assertion
				(projectReviewTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project review type error error
				done(projectReviewTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectReviewType.remove().exec();
		done();
	});
});
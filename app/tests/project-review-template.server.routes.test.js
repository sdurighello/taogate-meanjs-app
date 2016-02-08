'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectReviewTemplate = mongoose.model('ProjectReviewTemplate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectReviewTemplate;

/**
 * Project review template routes tests
 */
describe('Project review template CRUD tests', function() {
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

		// Save a user to the test db and create new Project review template
		user.save(function() {
			projectReviewTemplate = {
				name: 'Project review template Name'
			};

			done();
		});
	});

	it('should be able to save Project review template instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review template
				agent.post('/project-review-templates')
					.send(projectReviewTemplate)
					.expect(200)
					.end(function(projectReviewTemplateSaveErr, projectReviewTemplateSaveRes) {
						// Handle Project review template save error
						if (projectReviewTemplateSaveErr) done(projectReviewTemplateSaveErr);

						// Get a list of Project review templates
						agent.get('/project-review-templates')
							.end(function(projectReviewTemplatesGetErr, projectReviewTemplatesGetRes) {
								// Handle Project review template save error
								if (projectReviewTemplatesGetErr) done(projectReviewTemplatesGetErr);

								// Get Project review templates list
								var projectReviewTemplates = projectReviewTemplatesGetRes.body;

								// Set assertions
								(projectReviewTemplates[0].user._id).should.equal(userId);
								(projectReviewTemplates[0].name).should.match('Project review template Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project review template instance if not logged in', function(done) {
		agent.post('/project-review-templates')
			.send(projectReviewTemplate)
			.expect(401)
			.end(function(projectReviewTemplateSaveErr, projectReviewTemplateSaveRes) {
				// Call the assertion callback
				done(projectReviewTemplateSaveErr);
			});
	});

	it('should not be able to save Project review template instance if no name is provided', function(done) {
		// Invalidate name field
		projectReviewTemplate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review template
				agent.post('/project-review-templates')
					.send(projectReviewTemplate)
					.expect(400)
					.end(function(projectReviewTemplateSaveErr, projectReviewTemplateSaveRes) {
						// Set message assertion
						(projectReviewTemplateSaveRes.body.message).should.match('Please fill Project review template name');
						
						// Handle Project review template save error
						done(projectReviewTemplateSaveErr);
					});
			});
	});

	it('should be able to update Project review template instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review template
				agent.post('/project-review-templates')
					.send(projectReviewTemplate)
					.expect(200)
					.end(function(projectReviewTemplateSaveErr, projectReviewTemplateSaveRes) {
						// Handle Project review template save error
						if (projectReviewTemplateSaveErr) done(projectReviewTemplateSaveErr);

						// Update Project review template name
						projectReviewTemplate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project review template
						agent.put('/project-review-templates/' + projectReviewTemplateSaveRes.body._id)
							.send(projectReviewTemplate)
							.expect(200)
							.end(function(projectReviewTemplateUpdateErr, projectReviewTemplateUpdateRes) {
								// Handle Project review template update error
								if (projectReviewTemplateUpdateErr) done(projectReviewTemplateUpdateErr);

								// Set assertions
								(projectReviewTemplateUpdateRes.body._id).should.equal(projectReviewTemplateSaveRes.body._id);
								(projectReviewTemplateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project review templates if not signed in', function(done) {
		// Create new Project review template model instance
		var projectReviewTemplateObj = new ProjectReviewTemplate(projectReviewTemplate);

		// Save the Project review template
		projectReviewTemplateObj.save(function() {
			// Request Project review templates
			request(app).get('/project-review-templates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project review template if not signed in', function(done) {
		// Create new Project review template model instance
		var projectReviewTemplateObj = new ProjectReviewTemplate(projectReviewTemplate);

		// Save the Project review template
		projectReviewTemplateObj.save(function() {
			request(app).get('/project-review-templates/' + projectReviewTemplateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectReviewTemplate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project review template instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project review template
				agent.post('/project-review-templates')
					.send(projectReviewTemplate)
					.expect(200)
					.end(function(projectReviewTemplateSaveErr, projectReviewTemplateSaveRes) {
						// Handle Project review template save error
						if (projectReviewTemplateSaveErr) done(projectReviewTemplateSaveErr);

						// Delete existing Project review template
						agent.delete('/project-review-templates/' + projectReviewTemplateSaveRes.body._id)
							.send(projectReviewTemplate)
							.expect(200)
							.end(function(projectReviewTemplateDeleteErr, projectReviewTemplateDeleteRes) {
								// Handle Project review template error error
								if (projectReviewTemplateDeleteErr) done(projectReviewTemplateDeleteErr);

								// Set assertions
								(projectReviewTemplateDeleteRes.body._id).should.equal(projectReviewTemplateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project review template instance if not signed in', function(done) {
		// Set Project review template user 
		projectReviewTemplate.user = user;

		// Create new Project review template model instance
		var projectReviewTemplateObj = new ProjectReviewTemplate(projectReviewTemplate);

		// Save the Project review template
		projectReviewTemplateObj.save(function() {
			// Try deleting Project review template
			request(app).delete('/project-review-templates/' + projectReviewTemplateObj._id)
			.expect(401)
			.end(function(projectReviewTemplateDeleteErr, projectReviewTemplateDeleteRes) {
				// Set message assertion
				(projectReviewTemplateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project review template error error
				done(projectReviewTemplateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectReviewTemplate.remove().exec();
		done();
	});
});
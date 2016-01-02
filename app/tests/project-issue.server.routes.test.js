'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectIssue = mongoose.model('ProjectIssue'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectIssue;

/**
 * Project issue routes tests
 */
describe('Project issue CRUD tests', function() {
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

		// Save a user to the test db and create new Project issue
		user.save(function() {
			projectIssue = {
				name: 'Project issue Name'
			};

			done();
		});
	});

	it('should be able to save Project issue instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project issue
				agent.post('/project-issues')
					.send(projectIssue)
					.expect(200)
					.end(function(projectIssueSaveErr, projectIssueSaveRes) {
						// Handle Project issue save error
						if (projectIssueSaveErr) done(projectIssueSaveErr);

						// Get a list of Project issues
						agent.get('/project-issues')
							.end(function(projectIssuesGetErr, projectIssuesGetRes) {
								// Handle Project issue save error
								if (projectIssuesGetErr) done(projectIssuesGetErr);

								// Get Project issues list
								var projectIssues = projectIssuesGetRes.body;

								// Set assertions
								(projectIssues[0].user._id).should.equal(userId);
								(projectIssues[0].name).should.match('Project issue Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project issue instance if not logged in', function(done) {
		agent.post('/project-issues')
			.send(projectIssue)
			.expect(401)
			.end(function(projectIssueSaveErr, projectIssueSaveRes) {
				// Call the assertion callback
				done(projectIssueSaveErr);
			});
	});

	it('should not be able to save Project issue instance if no name is provided', function(done) {
		// Invalidate name field
		projectIssue.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project issue
				agent.post('/project-issues')
					.send(projectIssue)
					.expect(400)
					.end(function(projectIssueSaveErr, projectIssueSaveRes) {
						// Set message assertion
						(projectIssueSaveRes.body.message).should.match('Please fill Project issue name');
						
						// Handle Project issue save error
						done(projectIssueSaveErr);
					});
			});
	});

	it('should be able to update Project issue instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project issue
				agent.post('/project-issues')
					.send(projectIssue)
					.expect(200)
					.end(function(projectIssueSaveErr, projectIssueSaveRes) {
						// Handle Project issue save error
						if (projectIssueSaveErr) done(projectIssueSaveErr);

						// Update Project issue name
						projectIssue.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project issue
						agent.put('/project-issues/' + projectIssueSaveRes.body._id)
							.send(projectIssue)
							.expect(200)
							.end(function(projectIssueUpdateErr, projectIssueUpdateRes) {
								// Handle Project issue update error
								if (projectIssueUpdateErr) done(projectIssueUpdateErr);

								// Set assertions
								(projectIssueUpdateRes.body._id).should.equal(projectIssueSaveRes.body._id);
								(projectIssueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project issues if not signed in', function(done) {
		// Create new Project issue model instance
		var projectIssueObj = new ProjectIssue(projectIssue);

		// Save the Project issue
		projectIssueObj.save(function() {
			// Request Project issues
			request(app).get('/project-issues')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project issue if not signed in', function(done) {
		// Create new Project issue model instance
		var projectIssueObj = new ProjectIssue(projectIssue);

		// Save the Project issue
		projectIssueObj.save(function() {
			request(app).get('/project-issues/' + projectIssueObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectIssue.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project issue instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project issue
				agent.post('/project-issues')
					.send(projectIssue)
					.expect(200)
					.end(function(projectIssueSaveErr, projectIssueSaveRes) {
						// Handle Project issue save error
						if (projectIssueSaveErr) done(projectIssueSaveErr);

						// Delete existing Project issue
						agent.delete('/project-issues/' + projectIssueSaveRes.body._id)
							.send(projectIssue)
							.expect(200)
							.end(function(projectIssueDeleteErr, projectIssueDeleteRes) {
								// Handle Project issue error error
								if (projectIssueDeleteErr) done(projectIssueDeleteErr);

								// Set assertions
								(projectIssueDeleteRes.body._id).should.equal(projectIssueSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project issue instance if not signed in', function(done) {
		// Set Project issue user 
		projectIssue.user = user;

		// Create new Project issue model instance
		var projectIssueObj = new ProjectIssue(projectIssue);

		// Save the Project issue
		projectIssueObj.save(function() {
			// Try deleting Project issue
			request(app).delete('/project-issues/' + projectIssueObj._id)
			.expect(401)
			.end(function(projectIssueDeleteErr, projectIssueDeleteRes) {
				// Set message assertion
				(projectIssueDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project issue error error
				done(projectIssueDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectIssue.remove().exec();
		done();
	});
});
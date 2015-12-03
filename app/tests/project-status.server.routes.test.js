'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectStatus = mongoose.model('ProjectStatus'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectStatus;

/**
 * Project status routes tests
 */
describe('Project status CRUD tests', function() {
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

		// Save a user to the test db and create new Project status
		user.save(function() {
			projectStatus = {
				name: 'Project status Name'
			};

			done();
		});
	});

	it('should be able to save Project status instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status
				agent.post('/project-statuses')
					.send(projectStatus)
					.expect(200)
					.end(function(projectStatusSaveErr, projectStatusSaveRes) {
						// Handle Project status save error
						if (projectStatusSaveErr) done(projectStatusSaveErr);

						// Get a list of Project statuses
						agent.get('/project-statuses')
							.end(function(projectStatusesGetErr, projectStatusesGetRes) {
								// Handle Project status save error
								if (projectStatusesGetErr) done(projectStatusesGetErr);

								// Get Project statuses list
								var projectStatuses = projectStatusesGetRes.body;

								// Set assertions
								(projectStatuses[0].user._id).should.equal(userId);
								(projectStatuses[0].name).should.match('Project status Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project status instance if not logged in', function(done) {
		agent.post('/project-statuses')
			.send(projectStatus)
			.expect(401)
			.end(function(projectStatusSaveErr, projectStatusSaveRes) {
				// Call the assertion callback
				done(projectStatusSaveErr);
			});
	});

	it('should not be able to save Project status instance if no name is provided', function(done) {
		// Invalidate name field
		projectStatus.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status
				agent.post('/project-statuses')
					.send(projectStatus)
					.expect(400)
					.end(function(projectStatusSaveErr, projectStatusSaveRes) {
						// Set message assertion
						(projectStatusSaveRes.body.message).should.match('Please fill Project status name');
						
						// Handle Project status save error
						done(projectStatusSaveErr);
					});
			});
	});

	it('should be able to update Project status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status
				agent.post('/project-statuses')
					.send(projectStatus)
					.expect(200)
					.end(function(projectStatusSaveErr, projectStatusSaveRes) {
						// Handle Project status save error
						if (projectStatusSaveErr) done(projectStatusSaveErr);

						// Update Project status name
						projectStatus.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project status
						agent.put('/project-statuses/' + projectStatusSaveRes.body._id)
							.send(projectStatus)
							.expect(200)
							.end(function(projectStatusUpdateErr, projectStatusUpdateRes) {
								// Handle Project status update error
								if (projectStatusUpdateErr) done(projectStatusUpdateErr);

								// Set assertions
								(projectStatusUpdateRes.body._id).should.equal(projectStatusSaveRes.body._id);
								(projectStatusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project statuses if not signed in', function(done) {
		// Create new Project status model instance
		var projectStatusObj = new ProjectStatus(projectStatus);

		// Save the Project status
		projectStatusObj.save(function() {
			// Request Project statuses
			request(app).get('/project-statuses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project status if not signed in', function(done) {
		// Create new Project status model instance
		var projectStatusObj = new ProjectStatus(projectStatus);

		// Save the Project status
		projectStatusObj.save(function() {
			request(app).get('/project-statuses/' + projectStatusObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectStatus.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status
				agent.post('/project-statuses')
					.send(projectStatus)
					.expect(200)
					.end(function(projectStatusSaveErr, projectStatusSaveRes) {
						// Handle Project status save error
						if (projectStatusSaveErr) done(projectStatusSaveErr);

						// Delete existing Project status
						agent.delete('/project-statuses/' + projectStatusSaveRes.body._id)
							.send(projectStatus)
							.expect(200)
							.end(function(projectStatusDeleteErr, projectStatusDeleteRes) {
								// Handle Project status error error
								if (projectStatusDeleteErr) done(projectStatusDeleteErr);

								// Set assertions
								(projectStatusDeleteRes.body._id).should.equal(projectStatusSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project status instance if not signed in', function(done) {
		// Set Project status user 
		projectStatus.user = user;

		// Create new Project status model instance
		var projectStatusObj = new ProjectStatus(projectStatus);

		// Save the Project status
		projectStatusObj.save(function() {
			// Try deleting Project status
			request(app).delete('/project-statuses/' + projectStatusObj._id)
			.expect(401)
			.end(function(projectStatusDeleteErr, projectStatusDeleteRes) {
				// Set message assertion
				(projectStatusDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project status error error
				done(projectStatusDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectStatus.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectGateStatus = mongoose.model('ProjectGateStatus'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectGateStatus;

/**
 * Project gate status routes tests
 */
describe('Project gate status CRUD tests', function() {
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

		// Save a user to the test db and create new Project gate status
		user.save(function() {
			projectGateStatus = {
				name: 'Project gate status Name'
			};

			done();
		});
	});

	it('should be able to save Project gate status instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project gate status
				agent.post('/project-gate-statuses')
					.send(projectGateStatus)
					.expect(200)
					.end(function(projectGateStatusSaveErr, projectGateStatusSaveRes) {
						// Handle Project gate status save error
						if (projectGateStatusSaveErr) done(projectGateStatusSaveErr);

						// Get a list of Project gate statuses
						agent.get('/project-gate-statuses')
							.end(function(projectGateStatusesGetErr, projectGateStatusesGetRes) {
								// Handle Project gate status save error
								if (projectGateStatusesGetErr) done(projectGateStatusesGetErr);

								// Get Project gate statuses list
								var projectGateStatuses = projectGateStatusesGetRes.body;

								// Set assertions
								(projectGateStatuses[0].user._id).should.equal(userId);
								(projectGateStatuses[0].name).should.match('Project gate status Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project gate status instance if not logged in', function(done) {
		agent.post('/project-gate-statuses')
			.send(projectGateStatus)
			.expect(401)
			.end(function(projectGateStatusSaveErr, projectGateStatusSaveRes) {
				// Call the assertion callback
				done(projectGateStatusSaveErr);
			});
	});

	it('should not be able to save Project gate status instance if no name is provided', function(done) {
		// Invalidate name field
		projectGateStatus.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project gate status
				agent.post('/project-gate-statuses')
					.send(projectGateStatus)
					.expect(400)
					.end(function(projectGateStatusSaveErr, projectGateStatusSaveRes) {
						// Set message assertion
						(projectGateStatusSaveRes.body.message).should.match('Please fill Project gate status name');
						
						// Handle Project gate status save error
						done(projectGateStatusSaveErr);
					});
			});
	});

	it('should be able to update Project gate status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project gate status
				agent.post('/project-gate-statuses')
					.send(projectGateStatus)
					.expect(200)
					.end(function(projectGateStatusSaveErr, projectGateStatusSaveRes) {
						// Handle Project gate status save error
						if (projectGateStatusSaveErr) done(projectGateStatusSaveErr);

						// Update Project gate status name
						projectGateStatus.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project gate status
						agent.put('/project-gate-statuses/' + projectGateStatusSaveRes.body._id)
							.send(projectGateStatus)
							.expect(200)
							.end(function(projectGateStatusUpdateErr, projectGateStatusUpdateRes) {
								// Handle Project gate status update error
								if (projectGateStatusUpdateErr) done(projectGateStatusUpdateErr);

								// Set assertions
								(projectGateStatusUpdateRes.body._id).should.equal(projectGateStatusSaveRes.body._id);
								(projectGateStatusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project gate statuses if not signed in', function(done) {
		// Create new Project gate status model instance
		var projectGateStatusObj = new ProjectGateStatus(projectGateStatus);

		// Save the Project gate status
		projectGateStatusObj.save(function() {
			// Request Project gate statuses
			request(app).get('/project-gate-statuses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project gate status if not signed in', function(done) {
		// Create new Project gate status model instance
		var projectGateStatusObj = new ProjectGateStatus(projectGateStatus);

		// Save the Project gate status
		projectGateStatusObj.save(function() {
			request(app).get('/project-gate-statuses/' + projectGateStatusObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectGateStatus.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project gate status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project gate status
				agent.post('/project-gate-statuses')
					.send(projectGateStatus)
					.expect(200)
					.end(function(projectGateStatusSaveErr, projectGateStatusSaveRes) {
						// Handle Project gate status save error
						if (projectGateStatusSaveErr) done(projectGateStatusSaveErr);

						// Delete existing Project gate status
						agent.delete('/project-gate-statuses/' + projectGateStatusSaveRes.body._id)
							.send(projectGateStatus)
							.expect(200)
							.end(function(projectGateStatusDeleteErr, projectGateStatusDeleteRes) {
								// Handle Project gate status error error
								if (projectGateStatusDeleteErr) done(projectGateStatusDeleteErr);

								// Set assertions
								(projectGateStatusDeleteRes.body._id).should.equal(projectGateStatusSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project gate status instance if not signed in', function(done) {
		// Set Project gate status user 
		projectGateStatus.user = user;

		// Create new Project gate status model instance
		var projectGateStatusObj = new ProjectGateStatus(projectGateStatus);

		// Save the Project gate status
		projectGateStatusObj.save(function() {
			// Try deleting Project gate status
			request(app).delete('/project-gate-statuses/' + projectGateStatusObj._id)
			.expect(401)
			.end(function(projectGateStatusDeleteErr, projectGateStatusDeleteRes) {
				// Set message assertion
				(projectGateStatusDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project gate status error error
				done(projectGateStatusDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectGateStatus.remove().exec();
		done();
	});
});
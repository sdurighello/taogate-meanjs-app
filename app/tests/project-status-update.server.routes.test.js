'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectStatusUpdate = mongoose.model('ProjectStatusUpdate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectStatusUpdate;

/**
 * Project status update routes tests
 */
describe('Project status update CRUD tests', function() {
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

		// Save a user to the test db and create new Project status update
		user.save(function() {
			projectStatusUpdate = {
				name: 'Project status update Name'
			};

			done();
		});
	});

	it('should be able to save Project status update instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status update
				agent.post('/project-status-updates')
					.send(projectStatusUpdate)
					.expect(200)
					.end(function(projectStatusUpdateSaveErr, projectStatusUpdateSaveRes) {
						// Handle Project status update save error
						if (projectStatusUpdateSaveErr) done(projectStatusUpdateSaveErr);

						// Get a list of Project status updates
						agent.get('/project-status-updates')
							.end(function(projectStatusUpdatesGetErr, projectStatusUpdatesGetRes) {
								// Handle Project status update save error
								if (projectStatusUpdatesGetErr) done(projectStatusUpdatesGetErr);

								// Get Project status updates list
								var projectStatusUpdates = projectStatusUpdatesGetRes.body;

								// Set assertions
								(projectStatusUpdates[0].user._id).should.equal(userId);
								(projectStatusUpdates[0].name).should.match('Project status update Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project status update instance if not logged in', function(done) {
		agent.post('/project-status-updates')
			.send(projectStatusUpdate)
			.expect(401)
			.end(function(projectStatusUpdateSaveErr, projectStatusUpdateSaveRes) {
				// Call the assertion callback
				done(projectStatusUpdateSaveErr);
			});
	});

	it('should not be able to save Project status update instance if no name is provided', function(done) {
		// Invalidate name field
		projectStatusUpdate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status update
				agent.post('/project-status-updates')
					.send(projectStatusUpdate)
					.expect(400)
					.end(function(projectStatusUpdateSaveErr, projectStatusUpdateSaveRes) {
						// Set message assertion
						(projectStatusUpdateSaveRes.body.message).should.match('Please fill Project status update name');
						
						// Handle Project status update save error
						done(projectStatusUpdateSaveErr);
					});
			});
	});

	it('should be able to update Project status update instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status update
				agent.post('/project-status-updates')
					.send(projectStatusUpdate)
					.expect(200)
					.end(function(projectStatusUpdateSaveErr, projectStatusUpdateSaveRes) {
						// Handle Project status update save error
						if (projectStatusUpdateSaveErr) done(projectStatusUpdateSaveErr);

						// Update Project status update name
						projectStatusUpdate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project status update
						agent.put('/project-status-updates/' + projectStatusUpdateSaveRes.body._id)
							.send(projectStatusUpdate)
							.expect(200)
							.end(function(projectStatusUpdateUpdateErr, projectStatusUpdateUpdateRes) {
								// Handle Project status update update error
								if (projectStatusUpdateUpdateErr) done(projectStatusUpdateUpdateErr);

								// Set assertions
								(projectStatusUpdateUpdateRes.body._id).should.equal(projectStatusUpdateSaveRes.body._id);
								(projectStatusUpdateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project status updates if not signed in', function(done) {
		// Create new Project status update model instance
		var projectStatusUpdateObj = new ProjectStatusUpdate(projectStatusUpdate);

		// Save the Project status update
		projectStatusUpdateObj.save(function() {
			// Request Project status updates
			request(app).get('/project-status-updates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project status update if not signed in', function(done) {
		// Create new Project status update model instance
		var projectStatusUpdateObj = new ProjectStatusUpdate(projectStatusUpdate);

		// Save the Project status update
		projectStatusUpdateObj.save(function() {
			request(app).get('/project-status-updates/' + projectStatusUpdateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectStatusUpdate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project status update instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status update
				agent.post('/project-status-updates')
					.send(projectStatusUpdate)
					.expect(200)
					.end(function(projectStatusUpdateSaveErr, projectStatusUpdateSaveRes) {
						// Handle Project status update save error
						if (projectStatusUpdateSaveErr) done(projectStatusUpdateSaveErr);

						// Delete existing Project status update
						agent.delete('/project-status-updates/' + projectStatusUpdateSaveRes.body._id)
							.send(projectStatusUpdate)
							.expect(200)
							.end(function(projectStatusUpdateDeleteErr, projectStatusUpdateDeleteRes) {
								// Handle Project status update error error
								if (projectStatusUpdateDeleteErr) done(projectStatusUpdateDeleteErr);

								// Set assertions
								(projectStatusUpdateDeleteRes.body._id).should.equal(projectStatusUpdateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project status update instance if not signed in', function(done) {
		// Set Project status update user 
		projectStatusUpdate.user = user;

		// Create new Project status update model instance
		var projectStatusUpdateObj = new ProjectStatusUpdate(projectStatusUpdate);

		// Save the Project status update
		projectStatusUpdateObj.save(function() {
			// Try deleting Project status update
			request(app).delete('/project-status-updates/' + projectStatusUpdateObj._id)
			.expect(401)
			.end(function(projectStatusUpdateDeleteErr, projectStatusUpdateDeleteRes) {
				// Set message assertion
				(projectStatusUpdateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project status update error error
				done(projectStatusUpdateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectStatusUpdate.remove().exec();
		done();
	});
});
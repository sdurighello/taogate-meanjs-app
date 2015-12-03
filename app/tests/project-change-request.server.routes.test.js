'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectChangeRequest = mongoose.model('ProjectChangeRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectChangeRequest;

/**
 * Project change request routes tests
 */
describe('Project change request CRUD tests', function() {
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

		// Save a user to the test db and create new Project change request
		user.save(function() {
			projectChangeRequest = {
				name: 'Project change request Name'
			};

			done();
		});
	});

	it('should be able to save Project change request instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project change request
				agent.post('/project-change-requests')
					.send(projectChangeRequest)
					.expect(200)
					.end(function(projectChangeRequestSaveErr, projectChangeRequestSaveRes) {
						// Handle Project change request save error
						if (projectChangeRequestSaveErr) done(projectChangeRequestSaveErr);

						// Get a list of Project change requests
						agent.get('/project-change-requests')
							.end(function(projectChangeRequestsGetErr, projectChangeRequestsGetRes) {
								// Handle Project change request save error
								if (projectChangeRequestsGetErr) done(projectChangeRequestsGetErr);

								// Get Project change requests list
								var projectChangeRequests = projectChangeRequestsGetRes.body;

								// Set assertions
								(projectChangeRequests[0].user._id).should.equal(userId);
								(projectChangeRequests[0].name).should.match('Project change request Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project change request instance if not logged in', function(done) {
		agent.post('/project-change-requests')
			.send(projectChangeRequest)
			.expect(401)
			.end(function(projectChangeRequestSaveErr, projectChangeRequestSaveRes) {
				// Call the assertion callback
				done(projectChangeRequestSaveErr);
			});
	});

	it('should not be able to save Project change request instance if no name is provided', function(done) {
		// Invalidate name field
		projectChangeRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project change request
				agent.post('/project-change-requests')
					.send(projectChangeRequest)
					.expect(400)
					.end(function(projectChangeRequestSaveErr, projectChangeRequestSaveRes) {
						// Set message assertion
						(projectChangeRequestSaveRes.body.message).should.match('Please fill Project change request name');
						
						// Handle Project change request save error
						done(projectChangeRequestSaveErr);
					});
			});
	});

	it('should be able to update Project change request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project change request
				agent.post('/project-change-requests')
					.send(projectChangeRequest)
					.expect(200)
					.end(function(projectChangeRequestSaveErr, projectChangeRequestSaveRes) {
						// Handle Project change request save error
						if (projectChangeRequestSaveErr) done(projectChangeRequestSaveErr);

						// Update Project change request name
						projectChangeRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project change request
						agent.put('/project-change-requests/' + projectChangeRequestSaveRes.body._id)
							.send(projectChangeRequest)
							.expect(200)
							.end(function(projectChangeRequestUpdateErr, projectChangeRequestUpdateRes) {
								// Handle Project change request update error
								if (projectChangeRequestUpdateErr) done(projectChangeRequestUpdateErr);

								// Set assertions
								(projectChangeRequestUpdateRes.body._id).should.equal(projectChangeRequestSaveRes.body._id);
								(projectChangeRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project change requests if not signed in', function(done) {
		// Create new Project change request model instance
		var projectChangeRequestObj = new ProjectChangeRequest(projectChangeRequest);

		// Save the Project change request
		projectChangeRequestObj.save(function() {
			// Request Project change requests
			request(app).get('/project-change-requests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project change request if not signed in', function(done) {
		// Create new Project change request model instance
		var projectChangeRequestObj = new ProjectChangeRequest(projectChangeRequest);

		// Save the Project change request
		projectChangeRequestObj.save(function() {
			request(app).get('/project-change-requests/' + projectChangeRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectChangeRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project change request instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project change request
				agent.post('/project-change-requests')
					.send(projectChangeRequest)
					.expect(200)
					.end(function(projectChangeRequestSaveErr, projectChangeRequestSaveRes) {
						// Handle Project change request save error
						if (projectChangeRequestSaveErr) done(projectChangeRequestSaveErr);

						// Delete existing Project change request
						agent.delete('/project-change-requests/' + projectChangeRequestSaveRes.body._id)
							.send(projectChangeRequest)
							.expect(200)
							.end(function(projectChangeRequestDeleteErr, projectChangeRequestDeleteRes) {
								// Handle Project change request error error
								if (projectChangeRequestDeleteErr) done(projectChangeRequestDeleteErr);

								// Set assertions
								(projectChangeRequestDeleteRes.body._id).should.equal(projectChangeRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project change request instance if not signed in', function(done) {
		// Set Project change request user 
		projectChangeRequest.user = user;

		// Create new Project change request model instance
		var projectChangeRequestObj = new ProjectChangeRequest(projectChangeRequest);

		// Save the Project change request
		projectChangeRequestObj.save(function() {
			// Try deleting Project change request
			request(app).delete('/project-change-requests/' + projectChangeRequestObj._id)
			.expect(401)
			.end(function(projectChangeRequestDeleteErr, projectChangeRequestDeleteRes) {
				// Set message assertion
				(projectChangeRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project change request error error
				done(projectChangeRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectChangeRequest.remove().exec();
		done();
	});
});
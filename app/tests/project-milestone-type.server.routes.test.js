'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectMilestoneType = mongoose.model('ProjectMilestoneType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectMilestoneType;

/**
 * Project milestone type routes tests
 */
describe('Project milestone type CRUD tests', function() {
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

		// Save a user to the test db and create new Project milestone type
		user.save(function() {
			projectMilestoneType = {
				name: 'Project milestone type Name'
			};

			done();
		});
	});

	it('should be able to save Project milestone type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone type
				agent.post('/project-milestone-types')
					.send(projectMilestoneType)
					.expect(200)
					.end(function(projectMilestoneTypeSaveErr, projectMilestoneTypeSaveRes) {
						// Handle Project milestone type save error
						if (projectMilestoneTypeSaveErr) done(projectMilestoneTypeSaveErr);

						// Get a list of Project milestone types
						agent.get('/project-milestone-types')
							.end(function(projectMilestoneTypesGetErr, projectMilestoneTypesGetRes) {
								// Handle Project milestone type save error
								if (projectMilestoneTypesGetErr) done(projectMilestoneTypesGetErr);

								// Get Project milestone types list
								var projectMilestoneTypes = projectMilestoneTypesGetRes.body;

								// Set assertions
								(projectMilestoneTypes[0].user._id).should.equal(userId);
								(projectMilestoneTypes[0].name).should.match('Project milestone type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project milestone type instance if not logged in', function(done) {
		agent.post('/project-milestone-types')
			.send(projectMilestoneType)
			.expect(401)
			.end(function(projectMilestoneTypeSaveErr, projectMilestoneTypeSaveRes) {
				// Call the assertion callback
				done(projectMilestoneTypeSaveErr);
			});
	});

	it('should not be able to save Project milestone type instance if no name is provided', function(done) {
		// Invalidate name field
		projectMilestoneType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone type
				agent.post('/project-milestone-types')
					.send(projectMilestoneType)
					.expect(400)
					.end(function(projectMilestoneTypeSaveErr, projectMilestoneTypeSaveRes) {
						// Set message assertion
						(projectMilestoneTypeSaveRes.body.message).should.match('Please fill Project milestone type name');
						
						// Handle Project milestone type save error
						done(projectMilestoneTypeSaveErr);
					});
			});
	});

	it('should be able to update Project milestone type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone type
				agent.post('/project-milestone-types')
					.send(projectMilestoneType)
					.expect(200)
					.end(function(projectMilestoneTypeSaveErr, projectMilestoneTypeSaveRes) {
						// Handle Project milestone type save error
						if (projectMilestoneTypeSaveErr) done(projectMilestoneTypeSaveErr);

						// Update Project milestone type name
						projectMilestoneType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project milestone type
						agent.put('/project-milestone-types/' + projectMilestoneTypeSaveRes.body._id)
							.send(projectMilestoneType)
							.expect(200)
							.end(function(projectMilestoneTypeUpdateErr, projectMilestoneTypeUpdateRes) {
								// Handle Project milestone type update error
								if (projectMilestoneTypeUpdateErr) done(projectMilestoneTypeUpdateErr);

								// Set assertions
								(projectMilestoneTypeUpdateRes.body._id).should.equal(projectMilestoneTypeSaveRes.body._id);
								(projectMilestoneTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project milestone types if not signed in', function(done) {
		// Create new Project milestone type model instance
		var projectMilestoneTypeObj = new ProjectMilestoneType(projectMilestoneType);

		// Save the Project milestone type
		projectMilestoneTypeObj.save(function() {
			// Request Project milestone types
			request(app).get('/project-milestone-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project milestone type if not signed in', function(done) {
		// Create new Project milestone type model instance
		var projectMilestoneTypeObj = new ProjectMilestoneType(projectMilestoneType);

		// Save the Project milestone type
		projectMilestoneTypeObj.save(function() {
			request(app).get('/project-milestone-types/' + projectMilestoneTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectMilestoneType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project milestone type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone type
				agent.post('/project-milestone-types')
					.send(projectMilestoneType)
					.expect(200)
					.end(function(projectMilestoneTypeSaveErr, projectMilestoneTypeSaveRes) {
						// Handle Project milestone type save error
						if (projectMilestoneTypeSaveErr) done(projectMilestoneTypeSaveErr);

						// Delete existing Project milestone type
						agent.delete('/project-milestone-types/' + projectMilestoneTypeSaveRes.body._id)
							.send(projectMilestoneType)
							.expect(200)
							.end(function(projectMilestoneTypeDeleteErr, projectMilestoneTypeDeleteRes) {
								// Handle Project milestone type error error
								if (projectMilestoneTypeDeleteErr) done(projectMilestoneTypeDeleteErr);

								// Set assertions
								(projectMilestoneTypeDeleteRes.body._id).should.equal(projectMilestoneTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project milestone type instance if not signed in', function(done) {
		// Set Project milestone type user 
		projectMilestoneType.user = user;

		// Create new Project milestone type model instance
		var projectMilestoneTypeObj = new ProjectMilestoneType(projectMilestoneType);

		// Save the Project milestone type
		projectMilestoneTypeObj.save(function() {
			// Try deleting Project milestone type
			request(app).delete('/project-milestone-types/' + projectMilestoneTypeObj._id)
			.expect(401)
			.end(function(projectMilestoneTypeDeleteErr, projectMilestoneTypeDeleteRes) {
				// Set message assertion
				(projectMilestoneTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project milestone type error error
				done(projectMilestoneTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectMilestoneType.remove().exec();
		done();
	});
});
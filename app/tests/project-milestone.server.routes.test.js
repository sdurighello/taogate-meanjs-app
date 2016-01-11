'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectMilestone = mongoose.model('ProjectMilestone'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectMilestone;

/**
 * Project milestone routes tests
 */
describe('Project milestone CRUD tests', function() {
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

		// Save a user to the test db and create new Project milestone
		user.save(function() {
			projectMilestone = {
				name: 'Project milestone Name'
			};

			done();
		});
	});

	it('should be able to save Project milestone instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone
				agent.post('/project-milestones')
					.send(projectMilestone)
					.expect(200)
					.end(function(projectMilestoneSaveErr, projectMilestoneSaveRes) {
						// Handle Project milestone save error
						if (projectMilestoneSaveErr) done(projectMilestoneSaveErr);

						// Get a list of Project milestones
						agent.get('/project-milestones')
							.end(function(projectMilestonesGetErr, projectMilestonesGetRes) {
								// Handle Project milestone save error
								if (projectMilestonesGetErr) done(projectMilestonesGetErr);

								// Get Project milestones list
								var projectMilestones = projectMilestonesGetRes.body;

								// Set assertions
								(projectMilestones[0].user._id).should.equal(userId);
								(projectMilestones[0].name).should.match('Project milestone Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project milestone instance if not logged in', function(done) {
		agent.post('/project-milestones')
			.send(projectMilestone)
			.expect(401)
			.end(function(projectMilestoneSaveErr, projectMilestoneSaveRes) {
				// Call the assertion callback
				done(projectMilestoneSaveErr);
			});
	});

	it('should not be able to save Project milestone instance if no name is provided', function(done) {
		// Invalidate name field
		projectMilestone.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone
				agent.post('/project-milestones')
					.send(projectMilestone)
					.expect(400)
					.end(function(projectMilestoneSaveErr, projectMilestoneSaveRes) {
						// Set message assertion
						(projectMilestoneSaveRes.body.message).should.match('Please fill Project milestone name');
						
						// Handle Project milestone save error
						done(projectMilestoneSaveErr);
					});
			});
	});

	it('should be able to update Project milestone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone
				agent.post('/project-milestones')
					.send(projectMilestone)
					.expect(200)
					.end(function(projectMilestoneSaveErr, projectMilestoneSaveRes) {
						// Handle Project milestone save error
						if (projectMilestoneSaveErr) done(projectMilestoneSaveErr);

						// Update Project milestone name
						projectMilestone.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project milestone
						agent.put('/project-milestones/' + projectMilestoneSaveRes.body._id)
							.send(projectMilestone)
							.expect(200)
							.end(function(projectMilestoneUpdateErr, projectMilestoneUpdateRes) {
								// Handle Project milestone update error
								if (projectMilestoneUpdateErr) done(projectMilestoneUpdateErr);

								// Set assertions
								(projectMilestoneUpdateRes.body._id).should.equal(projectMilestoneSaveRes.body._id);
								(projectMilestoneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project milestones if not signed in', function(done) {
		// Create new Project milestone model instance
		var projectMilestoneObj = new ProjectMilestone(projectMilestone);

		// Save the Project milestone
		projectMilestoneObj.save(function() {
			// Request Project milestones
			request(app).get('/project-milestones')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project milestone if not signed in', function(done) {
		// Create new Project milestone model instance
		var projectMilestoneObj = new ProjectMilestone(projectMilestone);

		// Save the Project milestone
		projectMilestoneObj.save(function() {
			request(app).get('/project-milestones/' + projectMilestoneObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectMilestone.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project milestone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project milestone
				agent.post('/project-milestones')
					.send(projectMilestone)
					.expect(200)
					.end(function(projectMilestoneSaveErr, projectMilestoneSaveRes) {
						// Handle Project milestone save error
						if (projectMilestoneSaveErr) done(projectMilestoneSaveErr);

						// Delete existing Project milestone
						agent.delete('/project-milestones/' + projectMilestoneSaveRes.body._id)
							.send(projectMilestone)
							.expect(200)
							.end(function(projectMilestoneDeleteErr, projectMilestoneDeleteRes) {
								// Handle Project milestone error error
								if (projectMilestoneDeleteErr) done(projectMilestoneDeleteErr);

								// Set assertions
								(projectMilestoneDeleteRes.body._id).should.equal(projectMilestoneSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project milestone instance if not signed in', function(done) {
		// Set Project milestone user 
		projectMilestone.user = user;

		// Create new Project milestone model instance
		var projectMilestoneObj = new ProjectMilestone(projectMilestone);

		// Save the Project milestone
		projectMilestoneObj.save(function() {
			// Try deleting Project milestone
			request(app).delete('/project-milestones/' + projectMilestoneObj._id)
			.expect(401)
			.end(function(projectMilestoneDeleteErr, projectMilestoneDeleteRes) {
				// Set message assertion
				(projectMilestoneDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project milestone error error
				done(projectMilestoneDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectMilestone.remove().exec();
		done();
	});
});
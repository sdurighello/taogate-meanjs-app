'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProcessAssignment = mongoose.model('ProcessAssignment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, processAssignment;

/**
 * Process assignment routes tests
 */
describe('Process assignment CRUD tests', function() {
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

		// Save a user to the test db and create new Process assignment
		user.save(function() {
			processAssignment = {
				name: 'Process assignment Name'
			};

			done();
		});
	});

	it('should be able to save Process assignment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process assignment
				agent.post('/process-assignments')
					.send(processAssignment)
					.expect(200)
					.end(function(processAssignmentSaveErr, processAssignmentSaveRes) {
						// Handle Process assignment save error
						if (processAssignmentSaveErr) done(processAssignmentSaveErr);

						// Get a list of Process assignments
						agent.get('/process-assignments')
							.end(function(processAssignmentsGetErr, processAssignmentsGetRes) {
								// Handle Process assignment save error
								if (processAssignmentsGetErr) done(processAssignmentsGetErr);

								// Get Process assignments list
								var processAssignments = processAssignmentsGetRes.body;

								// Set assertions
								(processAssignments[0].user._id).should.equal(userId);
								(processAssignments[0].name).should.match('Process assignment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Process assignment instance if not logged in', function(done) {
		agent.post('/process-assignments')
			.send(processAssignment)
			.expect(401)
			.end(function(processAssignmentSaveErr, processAssignmentSaveRes) {
				// Call the assertion callback
				done(processAssignmentSaveErr);
			});
	});

	it('should not be able to save Process assignment instance if no name is provided', function(done) {
		// Invalidate name field
		processAssignment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process assignment
				agent.post('/process-assignments')
					.send(processAssignment)
					.expect(400)
					.end(function(processAssignmentSaveErr, processAssignmentSaveRes) {
						// Set message assertion
						(processAssignmentSaveRes.body.message).should.match('Please fill Process assignment name');
						
						// Handle Process assignment save error
						done(processAssignmentSaveErr);
					});
			});
	});

	it('should be able to update Process assignment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process assignment
				agent.post('/process-assignments')
					.send(processAssignment)
					.expect(200)
					.end(function(processAssignmentSaveErr, processAssignmentSaveRes) {
						// Handle Process assignment save error
						if (processAssignmentSaveErr) done(processAssignmentSaveErr);

						// Update Process assignment name
						processAssignment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Process assignment
						agent.put('/process-assignments/' + processAssignmentSaveRes.body._id)
							.send(processAssignment)
							.expect(200)
							.end(function(processAssignmentUpdateErr, processAssignmentUpdateRes) {
								// Handle Process assignment update error
								if (processAssignmentUpdateErr) done(processAssignmentUpdateErr);

								// Set assertions
								(processAssignmentUpdateRes.body._id).should.equal(processAssignmentSaveRes.body._id);
								(processAssignmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Process assignments if not signed in', function(done) {
		// Create new Process assignment model instance
		var processAssignmentObj = new ProcessAssignment(processAssignment);

		// Save the Process assignment
		processAssignmentObj.save(function() {
			// Request Process assignments
			request(app).get('/process-assignments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Process assignment if not signed in', function(done) {
		// Create new Process assignment model instance
		var processAssignmentObj = new ProcessAssignment(processAssignment);

		// Save the Process assignment
		processAssignmentObj.save(function() {
			request(app).get('/process-assignments/' + processAssignmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', processAssignment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Process assignment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Process assignment
				agent.post('/process-assignments')
					.send(processAssignment)
					.expect(200)
					.end(function(processAssignmentSaveErr, processAssignmentSaveRes) {
						// Handle Process assignment save error
						if (processAssignmentSaveErr) done(processAssignmentSaveErr);

						// Delete existing Process assignment
						agent.delete('/process-assignments/' + processAssignmentSaveRes.body._id)
							.send(processAssignment)
							.expect(200)
							.end(function(processAssignmentDeleteErr, processAssignmentDeleteRes) {
								// Handle Process assignment error error
								if (processAssignmentDeleteErr) done(processAssignmentDeleteErr);

								// Set assertions
								(processAssignmentDeleteRes.body._id).should.equal(processAssignmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Process assignment instance if not signed in', function(done) {
		// Set Process assignment user 
		processAssignment.user = user;

		// Create new Process assignment model instance
		var processAssignmentObj = new ProcessAssignment(processAssignment);

		// Save the Process assignment
		processAssignmentObj.save(function() {
			// Try deleting Process assignment
			request(app).delete('/process-assignments/' + processAssignmentObj._id)
			.expect(401)
			.end(function(processAssignmentDeleteErr, processAssignmentDeleteRes) {
				// Set message assertion
				(processAssignmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Process assignment error error
				done(processAssignmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProcessAssignment.remove().exec();
		done();
	});
});
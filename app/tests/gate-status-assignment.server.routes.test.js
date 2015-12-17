'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateStatusAssignment = mongoose.model('GateStatusAssignment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateStatusAssignment;

/**
 * Gate status assignment routes tests
 */
describe('Gate status assignment CRUD tests', function() {
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

		// Save a user to the test db and create new Gate status assignment
		user.save(function() {
			gateStatusAssignment = {
				name: 'Gate status assignment Name'
			};

			done();
		});
	});

	it('should be able to save Gate status assignment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status assignment
				agent.post('/gate-status-assignments')
					.send(gateStatusAssignment)
					.expect(200)
					.end(function(gateStatusAssignmentSaveErr, gateStatusAssignmentSaveRes) {
						// Handle Gate status assignment save error
						if (gateStatusAssignmentSaveErr) done(gateStatusAssignmentSaveErr);

						// Get a list of Gate status assignments
						agent.get('/gate-status-assignments')
							.end(function(gateStatusAssignmentsGetErr, gateStatusAssignmentsGetRes) {
								// Handle Gate status assignment save error
								if (gateStatusAssignmentsGetErr) done(gateStatusAssignmentsGetErr);

								// Get Gate status assignments list
								var gateStatusAssignments = gateStatusAssignmentsGetRes.body;

								// Set assertions
								(gateStatusAssignments[0].user._id).should.equal(userId);
								(gateStatusAssignments[0].name).should.match('Gate status assignment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate status assignment instance if not logged in', function(done) {
		agent.post('/gate-status-assignments')
			.send(gateStatusAssignment)
			.expect(401)
			.end(function(gateStatusAssignmentSaveErr, gateStatusAssignmentSaveRes) {
				// Call the assertion callback
				done(gateStatusAssignmentSaveErr);
			});
	});

	it('should not be able to save Gate status assignment instance if no name is provided', function(done) {
		// Invalidate name field
		gateStatusAssignment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status assignment
				agent.post('/gate-status-assignments')
					.send(gateStatusAssignment)
					.expect(400)
					.end(function(gateStatusAssignmentSaveErr, gateStatusAssignmentSaveRes) {
						// Set message assertion
						(gateStatusAssignmentSaveRes.body.message).should.match('Please fill Gate status assignment name');
						
						// Handle Gate status assignment save error
						done(gateStatusAssignmentSaveErr);
					});
			});
	});

	it('should be able to update Gate status assignment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status assignment
				agent.post('/gate-status-assignments')
					.send(gateStatusAssignment)
					.expect(200)
					.end(function(gateStatusAssignmentSaveErr, gateStatusAssignmentSaveRes) {
						// Handle Gate status assignment save error
						if (gateStatusAssignmentSaveErr) done(gateStatusAssignmentSaveErr);

						// Update Gate status assignment name
						gateStatusAssignment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate status assignment
						agent.put('/gate-status-assignments/' + gateStatusAssignmentSaveRes.body._id)
							.send(gateStatusAssignment)
							.expect(200)
							.end(function(gateStatusAssignmentUpdateErr, gateStatusAssignmentUpdateRes) {
								// Handle Gate status assignment update error
								if (gateStatusAssignmentUpdateErr) done(gateStatusAssignmentUpdateErr);

								// Set assertions
								(gateStatusAssignmentUpdateRes.body._id).should.equal(gateStatusAssignmentSaveRes.body._id);
								(gateStatusAssignmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate status assignments if not signed in', function(done) {
		// Create new Gate status assignment model instance
		var gateStatusAssignmentObj = new GateStatusAssignment(gateStatusAssignment);

		// Save the Gate status assignment
		gateStatusAssignmentObj.save(function() {
			// Request Gate status assignments
			request(app).get('/gate-status-assignments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate status assignment if not signed in', function(done) {
		// Create new Gate status assignment model instance
		var gateStatusAssignmentObj = new GateStatusAssignment(gateStatusAssignment);

		// Save the Gate status assignment
		gateStatusAssignmentObj.save(function() {
			request(app).get('/gate-status-assignments/' + gateStatusAssignmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateStatusAssignment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate status assignment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status assignment
				agent.post('/gate-status-assignments')
					.send(gateStatusAssignment)
					.expect(200)
					.end(function(gateStatusAssignmentSaveErr, gateStatusAssignmentSaveRes) {
						// Handle Gate status assignment save error
						if (gateStatusAssignmentSaveErr) done(gateStatusAssignmentSaveErr);

						// Delete existing Gate status assignment
						agent.delete('/gate-status-assignments/' + gateStatusAssignmentSaveRes.body._id)
							.send(gateStatusAssignment)
							.expect(200)
							.end(function(gateStatusAssignmentDeleteErr, gateStatusAssignmentDeleteRes) {
								// Handle Gate status assignment error error
								if (gateStatusAssignmentDeleteErr) done(gateStatusAssignmentDeleteErr);

								// Set assertions
								(gateStatusAssignmentDeleteRes.body._id).should.equal(gateStatusAssignmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate status assignment instance if not signed in', function(done) {
		// Set Gate status assignment user 
		gateStatusAssignment.user = user;

		// Create new Gate status assignment model instance
		var gateStatusAssignmentObj = new GateStatusAssignment(gateStatusAssignment);

		// Save the Gate status assignment
		gateStatusAssignmentObj.save(function() {
			// Try deleting Gate status assignment
			request(app).delete('/gate-status-assignments/' + gateStatusAssignmentObj._id)
			.expect(401)
			.end(function(gateStatusAssignmentDeleteErr, gateStatusAssignmentDeleteRes) {
				// Set message assertion
				(gateStatusAssignmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate status assignment error error
				done(gateStatusAssignmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateStatusAssignment.remove().exec();
		done();
	});
});
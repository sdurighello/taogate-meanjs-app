'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	RiskSeverityAssignment = mongoose.model('RiskSeverityAssignment'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, riskSeverityAssignment;

/**
 * Risk severity assignment routes tests
 */
describe('Risk severity assignment CRUD tests', function() {
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

		// Save a user to the test db and create new Risk severity assignment
		user.save(function() {
			riskSeverityAssignment = {
				name: 'Risk severity assignment Name'
			};

			done();
		});
	});

	it('should be able to save Risk severity assignment instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity assignment
				agent.post('/risk-severity-assignments')
					.send(riskSeverityAssignment)
					.expect(200)
					.end(function(riskSeverityAssignmentSaveErr, riskSeverityAssignmentSaveRes) {
						// Handle Risk severity assignment save error
						if (riskSeverityAssignmentSaveErr) done(riskSeverityAssignmentSaveErr);

						// Get a list of Risk severity assignments
						agent.get('/risk-severity-assignments')
							.end(function(riskSeverityAssignmentsGetErr, riskSeverityAssignmentsGetRes) {
								// Handle Risk severity assignment save error
								if (riskSeverityAssignmentsGetErr) done(riskSeverityAssignmentsGetErr);

								// Get Risk severity assignments list
								var riskSeverityAssignments = riskSeverityAssignmentsGetRes.body;

								// Set assertions
								(riskSeverityAssignments[0].user._id).should.equal(userId);
								(riskSeverityAssignments[0].name).should.match('Risk severity assignment Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Risk severity assignment instance if not logged in', function(done) {
		agent.post('/risk-severity-assignments')
			.send(riskSeverityAssignment)
			.expect(401)
			.end(function(riskSeverityAssignmentSaveErr, riskSeverityAssignmentSaveRes) {
				// Call the assertion callback
				done(riskSeverityAssignmentSaveErr);
			});
	});

	it('should not be able to save Risk severity assignment instance if no name is provided', function(done) {
		// Invalidate name field
		riskSeverityAssignment.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity assignment
				agent.post('/risk-severity-assignments')
					.send(riskSeverityAssignment)
					.expect(400)
					.end(function(riskSeverityAssignmentSaveErr, riskSeverityAssignmentSaveRes) {
						// Set message assertion
						(riskSeverityAssignmentSaveRes.body.message).should.match('Please fill Risk severity assignment name');
						
						// Handle Risk severity assignment save error
						done(riskSeverityAssignmentSaveErr);
					});
			});
	});

	it('should be able to update Risk severity assignment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity assignment
				agent.post('/risk-severity-assignments')
					.send(riskSeverityAssignment)
					.expect(200)
					.end(function(riskSeverityAssignmentSaveErr, riskSeverityAssignmentSaveRes) {
						// Handle Risk severity assignment save error
						if (riskSeverityAssignmentSaveErr) done(riskSeverityAssignmentSaveErr);

						// Update Risk severity assignment name
						riskSeverityAssignment.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Risk severity assignment
						agent.put('/risk-severity-assignments/' + riskSeverityAssignmentSaveRes.body._id)
							.send(riskSeverityAssignment)
							.expect(200)
							.end(function(riskSeverityAssignmentUpdateErr, riskSeverityAssignmentUpdateRes) {
								// Handle Risk severity assignment update error
								if (riskSeverityAssignmentUpdateErr) done(riskSeverityAssignmentUpdateErr);

								// Set assertions
								(riskSeverityAssignmentUpdateRes.body._id).should.equal(riskSeverityAssignmentSaveRes.body._id);
								(riskSeverityAssignmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Risk severity assignments if not signed in', function(done) {
		// Create new Risk severity assignment model instance
		var riskSeverityAssignmentObj = new RiskSeverityAssignment(riskSeverityAssignment);

		// Save the Risk severity assignment
		riskSeverityAssignmentObj.save(function() {
			// Request Risk severity assignments
			request(app).get('/risk-severity-assignments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Risk severity assignment if not signed in', function(done) {
		// Create new Risk severity assignment model instance
		var riskSeverityAssignmentObj = new RiskSeverityAssignment(riskSeverityAssignment);

		// Save the Risk severity assignment
		riskSeverityAssignmentObj.save(function() {
			request(app).get('/risk-severity-assignments/' + riskSeverityAssignmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', riskSeverityAssignment.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Risk severity assignment instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Risk severity assignment
				agent.post('/risk-severity-assignments')
					.send(riskSeverityAssignment)
					.expect(200)
					.end(function(riskSeverityAssignmentSaveErr, riskSeverityAssignmentSaveRes) {
						// Handle Risk severity assignment save error
						if (riskSeverityAssignmentSaveErr) done(riskSeverityAssignmentSaveErr);

						// Delete existing Risk severity assignment
						agent.delete('/risk-severity-assignments/' + riskSeverityAssignmentSaveRes.body._id)
							.send(riskSeverityAssignment)
							.expect(200)
							.end(function(riskSeverityAssignmentDeleteErr, riskSeverityAssignmentDeleteRes) {
								// Handle Risk severity assignment error error
								if (riskSeverityAssignmentDeleteErr) done(riskSeverityAssignmentDeleteErr);

								// Set assertions
								(riskSeverityAssignmentDeleteRes.body._id).should.equal(riskSeverityAssignmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Risk severity assignment instance if not signed in', function(done) {
		// Set Risk severity assignment user 
		riskSeverityAssignment.user = user;

		// Create new Risk severity assignment model instance
		var riskSeverityAssignmentObj = new RiskSeverityAssignment(riskSeverityAssignment);

		// Save the Risk severity assignment
		riskSeverityAssignmentObj.save(function() {
			// Try deleting Risk severity assignment
			request(app).delete('/risk-severity-assignments/' + riskSeverityAssignmentObj._id)
			.expect(401)
			.end(function(riskSeverityAssignmentDeleteErr, riskSeverityAssignmentDeleteRes) {
				// Set message assertion
				(riskSeverityAssignmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Risk severity assignment error error
				done(riskSeverityAssignmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		RiskSeverityAssignment.remove().exec();
		done();
	});
});
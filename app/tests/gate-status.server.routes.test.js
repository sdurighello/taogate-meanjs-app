'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateStatus = mongoose.model('GateStatus'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateStatus;

/**
 * Gate status routes tests
 */
describe('Gate status CRUD tests', function() {
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

		// Save a user to the test db and create new Gate status
		user.save(function() {
			gateStatus = {
				name: 'Gate status Name'
			};

			done();
		});
	});

	it('should be able to save Gate status instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status
				agent.post('/gate-statuses')
					.send(gateStatus)
					.expect(200)
					.end(function(gateStatusSaveErr, gateStatusSaveRes) {
						// Handle Gate status save error
						if (gateStatusSaveErr) done(gateStatusSaveErr);

						// Get a list of Gate statuses
						agent.get('/gate-statuses')
							.end(function(gateStatusesGetErr, gateStatusesGetRes) {
								// Handle Gate status save error
								if (gateStatusesGetErr) done(gateStatusesGetErr);

								// Get Gate statuses list
								var gateStatuses = gateStatusesGetRes.body;

								// Set assertions
								(gateStatuses[0].user._id).should.equal(userId);
								(gateStatuses[0].name).should.match('Gate status Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate status instance if not logged in', function(done) {
		agent.post('/gate-statuses')
			.send(gateStatus)
			.expect(401)
			.end(function(gateStatusSaveErr, gateStatusSaveRes) {
				// Call the assertion callback
				done(gateStatusSaveErr);
			});
	});

	it('should not be able to save Gate status instance if no name is provided', function(done) {
		// Invalidate name field
		gateStatus.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status
				agent.post('/gate-statuses')
					.send(gateStatus)
					.expect(400)
					.end(function(gateStatusSaveErr, gateStatusSaveRes) {
						// Set message assertion
						(gateStatusSaveRes.body.message).should.match('Please fill Gate status name');
						
						// Handle Gate status save error
						done(gateStatusSaveErr);
					});
			});
	});

	it('should be able to update Gate status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status
				agent.post('/gate-statuses')
					.send(gateStatus)
					.expect(200)
					.end(function(gateStatusSaveErr, gateStatusSaveRes) {
						// Handle Gate status save error
						if (gateStatusSaveErr) done(gateStatusSaveErr);

						// Update Gate status name
						gateStatus.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate status
						agent.put('/gate-statuses/' + gateStatusSaveRes.body._id)
							.send(gateStatus)
							.expect(200)
							.end(function(gateStatusUpdateErr, gateStatusUpdateRes) {
								// Handle Gate status update error
								if (gateStatusUpdateErr) done(gateStatusUpdateErr);

								// Set assertions
								(gateStatusUpdateRes.body._id).should.equal(gateStatusSaveRes.body._id);
								(gateStatusUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate statuses if not signed in', function(done) {
		// Create new Gate status model instance
		var gateStatusObj = new GateStatus(gateStatus);

		// Save the Gate status
		gateStatusObj.save(function() {
			// Request Gate statuses
			request(app).get('/gate-statuses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate status if not signed in', function(done) {
		// Create new Gate status model instance
		var gateStatusObj = new GateStatus(gateStatus);

		// Save the Gate status
		gateStatusObj.save(function() {
			request(app).get('/gate-statuses/' + gateStatusObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateStatus.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate status instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate status
				agent.post('/gate-statuses')
					.send(gateStatus)
					.expect(200)
					.end(function(gateStatusSaveErr, gateStatusSaveRes) {
						// Handle Gate status save error
						if (gateStatusSaveErr) done(gateStatusSaveErr);

						// Delete existing Gate status
						agent.delete('/gate-statuses/' + gateStatusSaveRes.body._id)
							.send(gateStatus)
							.expect(200)
							.end(function(gateStatusDeleteErr, gateStatusDeleteRes) {
								// Handle Gate status error error
								if (gateStatusDeleteErr) done(gateStatusDeleteErr);

								// Set assertions
								(gateStatusDeleteRes.body._id).should.equal(gateStatusSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate status instance if not signed in', function(done) {
		// Set Gate status user 
		gateStatus.user = user;

		// Create new Gate status model instance
		var gateStatusObj = new GateStatus(gateStatus);

		// Save the Gate status
		gateStatusObj.save(function() {
			// Try deleting Gate status
			request(app).delete('/gate-statuses/' + gateStatusObj._id)
			.expect(401)
			.end(function(gateStatusDeleteErr, gateStatusDeleteRes) {
				// Set message assertion
				(gateStatusDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate status error error
				done(gateStatusDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateStatus.remove().exec();
		done();
	});
});
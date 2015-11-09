'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	GateProcess = mongoose.model('GateProcess'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gateProcess;

/**
 * Gate process routes tests
 */
describe('Gate process CRUD tests', function() {
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

		// Save a user to the test db and create new Gate process
		user.save(function() {
			gateProcess = {
				name: 'Gate process Name'
			};

			done();
		});
	});

	it('should be able to save Gate process instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process
				agent.post('/gate-processes')
					.send(gateProcess)
					.expect(200)
					.end(function(gateProcessSaveErr, gateProcessSaveRes) {
						// Handle Gate process save error
						if (gateProcessSaveErr) done(gateProcessSaveErr);

						// Get a list of Gate processes
						agent.get('/gate-processes')
							.end(function(gateProcessesGetErr, gateProcessesGetRes) {
								// Handle Gate process save error
								if (gateProcessesGetErr) done(gateProcessesGetErr);

								// Get Gate processes list
								var gateProcesses = gateProcessesGetRes.body;

								// Set assertions
								(gateProcesses[0].user._id).should.equal(userId);
								(gateProcesses[0].name).should.match('Gate process Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate process instance if not logged in', function(done) {
		agent.post('/gate-processes')
			.send(gateProcess)
			.expect(401)
			.end(function(gateProcessSaveErr, gateProcessSaveRes) {
				// Call the assertion callback
				done(gateProcessSaveErr);
			});
	});

	it('should not be able to save Gate process instance if no name is provided', function(done) {
		// Invalidate name field
		gateProcess.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process
				agent.post('/gate-processes')
					.send(gateProcess)
					.expect(400)
					.end(function(gateProcessSaveErr, gateProcessSaveRes) {
						// Set message assertion
						(gateProcessSaveRes.body.message).should.match('Please fill Gate process name');
						
						// Handle Gate process save error
						done(gateProcessSaveErr);
					});
			});
	});

	it('should be able to update Gate process instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process
				agent.post('/gate-processes')
					.send(gateProcess)
					.expect(200)
					.end(function(gateProcessSaveErr, gateProcessSaveRes) {
						// Handle Gate process save error
						if (gateProcessSaveErr) done(gateProcessSaveErr);

						// Update Gate process name
						gateProcess.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate process
						agent.put('/gate-processes/' + gateProcessSaveRes.body._id)
							.send(gateProcess)
							.expect(200)
							.end(function(gateProcessUpdateErr, gateProcessUpdateRes) {
								// Handle Gate process update error
								if (gateProcessUpdateErr) done(gateProcessUpdateErr);

								// Set assertions
								(gateProcessUpdateRes.body._id).should.equal(gateProcessSaveRes.body._id);
								(gateProcessUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gate processes if not signed in', function(done) {
		// Create new Gate process model instance
		var gateProcessObj = new GateProcess(gateProcess);

		// Save the Gate process
		gateProcessObj.save(function() {
			// Request Gate processes
			request(app).get('/gate-processes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate process if not signed in', function(done) {
		// Create new Gate process model instance
		var gateProcessObj = new GateProcess(gateProcess);

		// Save the Gate process
		gateProcessObj.save(function() {
			request(app).get('/gate-processes/' + gateProcessObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gateProcess.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate process instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate process
				agent.post('/gate-processes')
					.send(gateProcess)
					.expect(200)
					.end(function(gateProcessSaveErr, gateProcessSaveRes) {
						// Handle Gate process save error
						if (gateProcessSaveErr) done(gateProcessSaveErr);

						// Delete existing Gate process
						agent.delete('/gate-processes/' + gateProcessSaveRes.body._id)
							.send(gateProcess)
							.expect(200)
							.end(function(gateProcessDeleteErr, gateProcessDeleteRes) {
								// Handle Gate process error error
								if (gateProcessDeleteErr) done(gateProcessDeleteErr);

								// Set assertions
								(gateProcessDeleteRes.body._id).should.equal(gateProcessSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate process instance if not signed in', function(done) {
		// Set Gate process user 
		gateProcess.user = user;

		// Create new Gate process model instance
		var gateProcessObj = new GateProcess(gateProcess);

		// Save the Gate process
		gateProcessObj.save(function() {
			// Try deleting Gate process
			request(app).delete('/gate-processes/' + gateProcessObj._id)
			.expect(401)
			.end(function(gateProcessDeleteErr, gateProcessDeleteRes) {
				// Set message assertion
				(gateProcessDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate process error error
				done(gateProcessDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		GateProcess.remove().exec();
		done();
	});
});
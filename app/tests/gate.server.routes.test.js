'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Gate = mongoose.model('Gate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gate;

/**
 * Gate routes tests
 */
describe('Gate CRUD tests', function() {
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

		// Save a user to the test db and create new Gate
		user.save(function() {
			gate = {
				name: 'Gate Name'
			};

			done();
		});
	});

	it('should be able to save Gate instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate
				agent.post('/gates')
					.send(gate)
					.expect(200)
					.end(function(gateSaveErr, gateSaveRes) {
						// Handle Gate save error
						if (gateSaveErr) done(gateSaveErr);

						// Get a list of Gates
						agent.get('/gates')
							.end(function(gatesGetErr, gatesGetRes) {
								// Handle Gate save error
								if (gatesGetErr) done(gatesGetErr);

								// Get Gates list
								var gates = gatesGetRes.body;

								// Set assertions
								(gates[0].user._id).should.equal(userId);
								(gates[0].name).should.match('Gate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gate instance if not logged in', function(done) {
		agent.post('/gates')
			.send(gate)
			.expect(401)
			.end(function(gateSaveErr, gateSaveRes) {
				// Call the assertion callback
				done(gateSaveErr);
			});
	});

	it('should not be able to save Gate instance if no name is provided', function(done) {
		// Invalidate name field
		gate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate
				agent.post('/gates')
					.send(gate)
					.expect(400)
					.end(function(gateSaveErr, gateSaveRes) {
						// Set message assertion
						(gateSaveRes.body.message).should.match('Please fill Gate name');
						
						// Handle Gate save error
						done(gateSaveErr);
					});
			});
	});

	it('should be able to update Gate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate
				agent.post('/gates')
					.send(gate)
					.expect(200)
					.end(function(gateSaveErr, gateSaveRes) {
						// Handle Gate save error
						if (gateSaveErr) done(gateSaveErr);

						// Update Gate name
						gate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gate
						agent.put('/gates/' + gateSaveRes.body._id)
							.send(gate)
							.expect(200)
							.end(function(gateUpdateErr, gateUpdateRes) {
								// Handle Gate update error
								if (gateUpdateErr) done(gateUpdateErr);

								// Set assertions
								(gateUpdateRes.body._id).should.equal(gateSaveRes.body._id);
								(gateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gates if not signed in', function(done) {
		// Create new Gate model instance
		var gateObj = new Gate(gate);

		// Save the Gate
		gateObj.save(function() {
			// Request Gates
			request(app).get('/gates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gate if not signed in', function(done) {
		// Create new Gate model instance
		var gateObj = new Gate(gate);

		// Save the Gate
		gateObj.save(function() {
			request(app).get('/gates/' + gateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gate instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gate
				agent.post('/gates')
					.send(gate)
					.expect(200)
					.end(function(gateSaveErr, gateSaveRes) {
						// Handle Gate save error
						if (gateSaveErr) done(gateSaveErr);

						// Delete existing Gate
						agent.delete('/gates/' + gateSaveRes.body._id)
							.send(gate)
							.expect(200)
							.end(function(gateDeleteErr, gateDeleteRes) {
								// Handle Gate error error
								if (gateDeleteErr) done(gateDeleteErr);

								// Set assertions
								(gateDeleteRes.body._id).should.equal(gateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gate instance if not signed in', function(done) {
		// Set Gate user 
		gate.user = user;

		// Create new Gate model instance
		var gateObj = new Gate(gate);

		// Save the Gate
		gateObj.save(function() {
			// Try deleting Gate
			request(app).delete('/gates/' + gateObj._id)
			.expect(401)
			.end(function(gateDeleteErr, gateDeleteRes) {
				// Set message assertion
				(gateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gate error error
				done(gateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Gate.remove().exec();
		done();
	});
});
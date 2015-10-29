'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PriorityType = mongoose.model('PriorityType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, priorityType;

/**
 * Priority type routes tests
 */
describe('Priority type CRUD tests', function() {
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

		// Save a user to the test db and create new Priority type
		user.save(function() {
			priorityType = {
				name: 'Priority type Name'
			};

			done();
		});
	});

	it('should be able to save Priority type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority type
				agent.post('/priority-types')
					.send(priorityType)
					.expect(200)
					.end(function(priorityTypeSaveErr, priorityTypeSaveRes) {
						// Handle Priority type save error
						if (priorityTypeSaveErr) done(priorityTypeSaveErr);

						// Get a list of Priority types
						agent.get('/priority-types')
							.end(function(priorityTypesGetErr, priorityTypesGetRes) {
								// Handle Priority type save error
								if (priorityTypesGetErr) done(priorityTypesGetErr);

								// Get Priority types list
								var priorityTypes = priorityTypesGetRes.body;

								// Set assertions
								(priorityTypes[0].user._id).should.equal(userId);
								(priorityTypes[0].name).should.match('Priority type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Priority type instance if not logged in', function(done) {
		agent.post('/priority-types')
			.send(priorityType)
			.expect(401)
			.end(function(priorityTypeSaveErr, priorityTypeSaveRes) {
				// Call the assertion callback
				done(priorityTypeSaveErr);
			});
	});

	it('should not be able to save Priority type instance if no name is provided', function(done) {
		// Invalidate name field
		priorityType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority type
				agent.post('/priority-types')
					.send(priorityType)
					.expect(400)
					.end(function(priorityTypeSaveErr, priorityTypeSaveRes) {
						// Set message assertion
						(priorityTypeSaveRes.body.message).should.match('Please fill Priority type name');
						
						// Handle Priority type save error
						done(priorityTypeSaveErr);
					});
			});
	});

	it('should be able to update Priority type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority type
				agent.post('/priority-types')
					.send(priorityType)
					.expect(200)
					.end(function(priorityTypeSaveErr, priorityTypeSaveRes) {
						// Handle Priority type save error
						if (priorityTypeSaveErr) done(priorityTypeSaveErr);

						// Update Priority type name
						priorityType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Priority type
						agent.put('/priority-types/' + priorityTypeSaveRes.body._id)
							.send(priorityType)
							.expect(200)
							.end(function(priorityTypeUpdateErr, priorityTypeUpdateRes) {
								// Handle Priority type update error
								if (priorityTypeUpdateErr) done(priorityTypeUpdateErr);

								// Set assertions
								(priorityTypeUpdateRes.body._id).should.equal(priorityTypeSaveRes.body._id);
								(priorityTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Priority types if not signed in', function(done) {
		// Create new Priority type model instance
		var priorityTypeObj = new PriorityType(priorityType);

		// Save the Priority type
		priorityTypeObj.save(function() {
			// Request Priority types
			request(app).get('/priority-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Priority type if not signed in', function(done) {
		// Create new Priority type model instance
		var priorityTypeObj = new PriorityType(priorityType);

		// Save the Priority type
		priorityTypeObj.save(function() {
			request(app).get('/priority-types/' + priorityTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', priorityType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Priority type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Priority type
				agent.post('/priority-types')
					.send(priorityType)
					.expect(200)
					.end(function(priorityTypeSaveErr, priorityTypeSaveRes) {
						// Handle Priority type save error
						if (priorityTypeSaveErr) done(priorityTypeSaveErr);

						// Delete existing Priority type
						agent.delete('/priority-types/' + priorityTypeSaveRes.body._id)
							.send(priorityType)
							.expect(200)
							.end(function(priorityTypeDeleteErr, priorityTypeDeleteRes) {
								// Handle Priority type error error
								if (priorityTypeDeleteErr) done(priorityTypeDeleteErr);

								// Set assertions
								(priorityTypeDeleteRes.body._id).should.equal(priorityTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Priority type instance if not signed in', function(done) {
		// Set Priority type user 
		priorityType.user = user;

		// Create new Priority type model instance
		var priorityTypeObj = new PriorityType(priorityType);

		// Save the Priority type
		priorityTypeObj.save(function() {
			// Try deleting Priority type
			request(app).delete('/priority-types/' + priorityTypeObj._id)
			.expect(401)
			.end(function(priorityTypeDeleteErr, priorityTypeDeleteRes) {
				// Set message assertion
				(priorityTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Priority type error error
				done(priorityTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PriorityType.remove().exec();
		done();
	});
});
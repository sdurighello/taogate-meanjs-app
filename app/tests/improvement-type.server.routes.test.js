'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ImprovementType = mongoose.model('ImprovementType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, improvementType;

/**
 * Improvement type routes tests
 */
describe('Improvement type CRUD tests', function() {
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

		// Save a user to the test db and create new Improvement type
		user.save(function() {
			improvementType = {
				name: 'Improvement type Name'
			};

			done();
		});
	});

	it('should be able to save Improvement type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement type
				agent.post('/improvement-types')
					.send(improvementType)
					.expect(200)
					.end(function(improvementTypeSaveErr, improvementTypeSaveRes) {
						// Handle Improvement type save error
						if (improvementTypeSaveErr) done(improvementTypeSaveErr);

						// Get a list of Improvement types
						agent.get('/improvement-types')
							.end(function(improvementTypesGetErr, improvementTypesGetRes) {
								// Handle Improvement type save error
								if (improvementTypesGetErr) done(improvementTypesGetErr);

								// Get Improvement types list
								var improvementTypes = improvementTypesGetRes.body;

								// Set assertions
								(improvementTypes[0].user._id).should.equal(userId);
								(improvementTypes[0].name).should.match('Improvement type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Improvement type instance if not logged in', function(done) {
		agent.post('/improvement-types')
			.send(improvementType)
			.expect(401)
			.end(function(improvementTypeSaveErr, improvementTypeSaveRes) {
				// Call the assertion callback
				done(improvementTypeSaveErr);
			});
	});

	it('should not be able to save Improvement type instance if no name is provided', function(done) {
		// Invalidate name field
		improvementType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement type
				agent.post('/improvement-types')
					.send(improvementType)
					.expect(400)
					.end(function(improvementTypeSaveErr, improvementTypeSaveRes) {
						// Set message assertion
						(improvementTypeSaveRes.body.message).should.match('Please fill Improvement type name');
						
						// Handle Improvement type save error
						done(improvementTypeSaveErr);
					});
			});
	});

	it('should be able to update Improvement type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement type
				agent.post('/improvement-types')
					.send(improvementType)
					.expect(200)
					.end(function(improvementTypeSaveErr, improvementTypeSaveRes) {
						// Handle Improvement type save error
						if (improvementTypeSaveErr) done(improvementTypeSaveErr);

						// Update Improvement type name
						improvementType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Improvement type
						agent.put('/improvement-types/' + improvementTypeSaveRes.body._id)
							.send(improvementType)
							.expect(200)
							.end(function(improvementTypeUpdateErr, improvementTypeUpdateRes) {
								// Handle Improvement type update error
								if (improvementTypeUpdateErr) done(improvementTypeUpdateErr);

								// Set assertions
								(improvementTypeUpdateRes.body._id).should.equal(improvementTypeSaveRes.body._id);
								(improvementTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Improvement types if not signed in', function(done) {
		// Create new Improvement type model instance
		var improvementTypeObj = new ImprovementType(improvementType);

		// Save the Improvement type
		improvementTypeObj.save(function() {
			// Request Improvement types
			request(app).get('/improvement-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Improvement type if not signed in', function(done) {
		// Create new Improvement type model instance
		var improvementTypeObj = new ImprovementType(improvementType);

		// Save the Improvement type
		improvementTypeObj.save(function() {
			request(app).get('/improvement-types/' + improvementTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', improvementType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Improvement type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Improvement type
				agent.post('/improvement-types')
					.send(improvementType)
					.expect(200)
					.end(function(improvementTypeSaveErr, improvementTypeSaveRes) {
						// Handle Improvement type save error
						if (improvementTypeSaveErr) done(improvementTypeSaveErr);

						// Delete existing Improvement type
						agent.delete('/improvement-types/' + improvementTypeSaveRes.body._id)
							.send(improvementType)
							.expect(200)
							.end(function(improvementTypeDeleteErr, improvementTypeDeleteRes) {
								// Handle Improvement type error error
								if (improvementTypeDeleteErr) done(improvementTypeDeleteErr);

								// Set assertions
								(improvementTypeDeleteRes.body._id).should.equal(improvementTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Improvement type instance if not signed in', function(done) {
		// Set Improvement type user 
		improvementType.user = user;

		// Create new Improvement type model instance
		var improvementTypeObj = new ImprovementType(improvementType);

		// Save the Improvement type
		improvementTypeObj.save(function() {
			// Try deleting Improvement type
			request(app).delete('/improvement-types/' + improvementTypeObj._id)
			.expect(401)
			.end(function(improvementTypeDeleteErr, improvementTypeDeleteRes) {
				// Set message assertion
				(improvementTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Improvement type error error
				done(improvementTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ImprovementType.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DependencyState = mongoose.model('DependencyState'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dependencyState;

/**
 * Dependency state routes tests
 */
describe('Dependency state CRUD tests', function() {
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

		// Save a user to the test db and create new Dependency state
		user.save(function() {
			dependencyState = {
				name: 'Dependency state Name'
			};

			done();
		});
	});

	it('should be able to save Dependency state instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency state
				agent.post('/dependency-states')
					.send(dependencyState)
					.expect(200)
					.end(function(dependencyStateSaveErr, dependencyStateSaveRes) {
						// Handle Dependency state save error
						if (dependencyStateSaveErr) done(dependencyStateSaveErr);

						// Get a list of Dependency states
						agent.get('/dependency-states')
							.end(function(dependencyStatesGetErr, dependencyStatesGetRes) {
								// Handle Dependency state save error
								if (dependencyStatesGetErr) done(dependencyStatesGetErr);

								// Get Dependency states list
								var dependencyStates = dependencyStatesGetRes.body;

								// Set assertions
								(dependencyStates[0].user._id).should.equal(userId);
								(dependencyStates[0].name).should.match('Dependency state Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dependency state instance if not logged in', function(done) {
		agent.post('/dependency-states')
			.send(dependencyState)
			.expect(401)
			.end(function(dependencyStateSaveErr, dependencyStateSaveRes) {
				// Call the assertion callback
				done(dependencyStateSaveErr);
			});
	});

	it('should not be able to save Dependency state instance if no name is provided', function(done) {
		// Invalidate name field
		dependencyState.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency state
				agent.post('/dependency-states')
					.send(dependencyState)
					.expect(400)
					.end(function(dependencyStateSaveErr, dependencyStateSaveRes) {
						// Set message assertion
						(dependencyStateSaveRes.body.message).should.match('Please fill Dependency state name');
						
						// Handle Dependency state save error
						done(dependencyStateSaveErr);
					});
			});
	});

	it('should be able to update Dependency state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency state
				agent.post('/dependency-states')
					.send(dependencyState)
					.expect(200)
					.end(function(dependencyStateSaveErr, dependencyStateSaveRes) {
						// Handle Dependency state save error
						if (dependencyStateSaveErr) done(dependencyStateSaveErr);

						// Update Dependency state name
						dependencyState.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dependency state
						agent.put('/dependency-states/' + dependencyStateSaveRes.body._id)
							.send(dependencyState)
							.expect(200)
							.end(function(dependencyStateUpdateErr, dependencyStateUpdateRes) {
								// Handle Dependency state update error
								if (dependencyStateUpdateErr) done(dependencyStateUpdateErr);

								// Set assertions
								(dependencyStateUpdateRes.body._id).should.equal(dependencyStateSaveRes.body._id);
								(dependencyStateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dependency states if not signed in', function(done) {
		// Create new Dependency state model instance
		var dependencyStateObj = new DependencyState(dependencyState);

		// Save the Dependency state
		dependencyStateObj.save(function() {
			// Request Dependency states
			request(app).get('/dependency-states')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dependency state if not signed in', function(done) {
		// Create new Dependency state model instance
		var dependencyStateObj = new DependencyState(dependencyState);

		// Save the Dependency state
		dependencyStateObj.save(function() {
			request(app).get('/dependency-states/' + dependencyStateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dependencyState.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dependency state instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency state
				agent.post('/dependency-states')
					.send(dependencyState)
					.expect(200)
					.end(function(dependencyStateSaveErr, dependencyStateSaveRes) {
						// Handle Dependency state save error
						if (dependencyStateSaveErr) done(dependencyStateSaveErr);

						// Delete existing Dependency state
						agent.delete('/dependency-states/' + dependencyStateSaveRes.body._id)
							.send(dependencyState)
							.expect(200)
							.end(function(dependencyStateDeleteErr, dependencyStateDeleteRes) {
								// Handle Dependency state error error
								if (dependencyStateDeleteErr) done(dependencyStateDeleteErr);

								// Set assertions
								(dependencyStateDeleteRes.body._id).should.equal(dependencyStateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dependency state instance if not signed in', function(done) {
		// Set Dependency state user 
		dependencyState.user = user;

		// Create new Dependency state model instance
		var dependencyStateObj = new DependencyState(dependencyState);

		// Save the Dependency state
		dependencyStateObj.save(function() {
			// Try deleting Dependency state
			request(app).delete('/dependency-states/' + dependencyStateObj._id)
			.expect(401)
			.end(function(dependencyStateDeleteErr, dependencyStateDeleteRes) {
				// Set message assertion
				(dependencyStateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dependency state error error
				done(dependencyStateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		DependencyState.remove().exec();
		done();
	});
});
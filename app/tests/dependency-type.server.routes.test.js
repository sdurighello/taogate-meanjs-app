'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DependencyType = mongoose.model('DependencyType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dependencyType;

/**
 * Dependency type routes tests
 */
describe('Dependency type CRUD tests', function() {
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

		// Save a user to the test db and create new Dependency type
		user.save(function() {
			dependencyType = {
				name: 'Dependency type Name'
			};

			done();
		});
	});

	it('should be able to save Dependency type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency type
				agent.post('/dependency-types')
					.send(dependencyType)
					.expect(200)
					.end(function(dependencyTypeSaveErr, dependencyTypeSaveRes) {
						// Handle Dependency type save error
						if (dependencyTypeSaveErr) done(dependencyTypeSaveErr);

						// Get a list of Dependency types
						agent.get('/dependency-types')
							.end(function(dependencyTypesGetErr, dependencyTypesGetRes) {
								// Handle Dependency type save error
								if (dependencyTypesGetErr) done(dependencyTypesGetErr);

								// Get Dependency types list
								var dependencyTypes = dependencyTypesGetRes.body;

								// Set assertions
								(dependencyTypes[0].user._id).should.equal(userId);
								(dependencyTypes[0].name).should.match('Dependency type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dependency type instance if not logged in', function(done) {
		agent.post('/dependency-types')
			.send(dependencyType)
			.expect(401)
			.end(function(dependencyTypeSaveErr, dependencyTypeSaveRes) {
				// Call the assertion callback
				done(dependencyTypeSaveErr);
			});
	});

	it('should not be able to save Dependency type instance if no name is provided', function(done) {
		// Invalidate name field
		dependencyType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency type
				agent.post('/dependency-types')
					.send(dependencyType)
					.expect(400)
					.end(function(dependencyTypeSaveErr, dependencyTypeSaveRes) {
						// Set message assertion
						(dependencyTypeSaveRes.body.message).should.match('Please fill Dependency type name');
						
						// Handle Dependency type save error
						done(dependencyTypeSaveErr);
					});
			});
	});

	it('should be able to update Dependency type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency type
				agent.post('/dependency-types')
					.send(dependencyType)
					.expect(200)
					.end(function(dependencyTypeSaveErr, dependencyTypeSaveRes) {
						// Handle Dependency type save error
						if (dependencyTypeSaveErr) done(dependencyTypeSaveErr);

						// Update Dependency type name
						dependencyType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dependency type
						agent.put('/dependency-types/' + dependencyTypeSaveRes.body._id)
							.send(dependencyType)
							.expect(200)
							.end(function(dependencyTypeUpdateErr, dependencyTypeUpdateRes) {
								// Handle Dependency type update error
								if (dependencyTypeUpdateErr) done(dependencyTypeUpdateErr);

								// Set assertions
								(dependencyTypeUpdateRes.body._id).should.equal(dependencyTypeSaveRes.body._id);
								(dependencyTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dependency types if not signed in', function(done) {
		// Create new Dependency type model instance
		var dependencyTypeObj = new DependencyType(dependencyType);

		// Save the Dependency type
		dependencyTypeObj.save(function() {
			// Request Dependency types
			request(app).get('/dependency-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dependency type if not signed in', function(done) {
		// Create new Dependency type model instance
		var dependencyTypeObj = new DependencyType(dependencyType);

		// Save the Dependency type
		dependencyTypeObj.save(function() {
			request(app).get('/dependency-types/' + dependencyTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dependencyType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dependency type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency type
				agent.post('/dependency-types')
					.send(dependencyType)
					.expect(200)
					.end(function(dependencyTypeSaveErr, dependencyTypeSaveRes) {
						// Handle Dependency type save error
						if (dependencyTypeSaveErr) done(dependencyTypeSaveErr);

						// Delete existing Dependency type
						agent.delete('/dependency-types/' + dependencyTypeSaveRes.body._id)
							.send(dependencyType)
							.expect(200)
							.end(function(dependencyTypeDeleteErr, dependencyTypeDeleteRes) {
								// Handle Dependency type error error
								if (dependencyTypeDeleteErr) done(dependencyTypeDeleteErr);

								// Set assertions
								(dependencyTypeDeleteRes.body._id).should.equal(dependencyTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dependency type instance if not signed in', function(done) {
		// Set Dependency type user 
		dependencyType.user = user;

		// Create new Dependency type model instance
		var dependencyTypeObj = new DependencyType(dependencyType);

		// Save the Dependency type
		dependencyTypeObj.save(function() {
			// Try deleting Dependency type
			request(app).delete('/dependency-types/' + dependencyTypeObj._id)
			.expect(401)
			.end(function(dependencyTypeDeleteErr, dependencyTypeDeleteRes) {
				// Set message assertion
				(dependencyTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dependency type error error
				done(dependencyTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		DependencyType.remove().exec();
		done();
	});
});
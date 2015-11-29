'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dependency = mongoose.model('Dependency'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dependency;

/**
 * Dependency routes tests
 */
describe('Dependency CRUD tests', function() {
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

		// Save a user to the test db and create new Dependency
		user.save(function() {
			dependency = {
				name: 'Dependency Name'
			};

			done();
		});
	});

	it('should be able to save Dependency instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency
				agent.post('/dependencies')
					.send(dependency)
					.expect(200)
					.end(function(dependencySaveErr, dependencySaveRes) {
						// Handle Dependency save error
						if (dependencySaveErr) done(dependencySaveErr);

						// Get a list of Dependencies
						agent.get('/dependencies')
							.end(function(dependenciesGetErr, dependenciesGetRes) {
								// Handle Dependency save error
								if (dependenciesGetErr) done(dependenciesGetErr);

								// Get Dependencies list
								var dependencies = dependenciesGetRes.body;

								// Set assertions
								(dependencies[0].user._id).should.equal(userId);
								(dependencies[0].name).should.match('Dependency Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dependency instance if not logged in', function(done) {
		agent.post('/dependencies')
			.send(dependency)
			.expect(401)
			.end(function(dependencySaveErr, dependencySaveRes) {
				// Call the assertion callback
				done(dependencySaveErr);
			});
	});

	it('should not be able to save Dependency instance if no name is provided', function(done) {
		// Invalidate name field
		dependency.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency
				agent.post('/dependencies')
					.send(dependency)
					.expect(400)
					.end(function(dependencySaveErr, dependencySaveRes) {
						// Set message assertion
						(dependencySaveRes.body.message).should.match('Please fill Dependency name');
						
						// Handle Dependency save error
						done(dependencySaveErr);
					});
			});
	});

	it('should be able to update Dependency instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency
				agent.post('/dependencies')
					.send(dependency)
					.expect(200)
					.end(function(dependencySaveErr, dependencySaveRes) {
						// Handle Dependency save error
						if (dependencySaveErr) done(dependencySaveErr);

						// Update Dependency name
						dependency.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dependency
						agent.put('/dependencies/' + dependencySaveRes.body._id)
							.send(dependency)
							.expect(200)
							.end(function(dependencyUpdateErr, dependencyUpdateRes) {
								// Handle Dependency update error
								if (dependencyUpdateErr) done(dependencyUpdateErr);

								// Set assertions
								(dependencyUpdateRes.body._id).should.equal(dependencySaveRes.body._id);
								(dependencyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dependencies if not signed in', function(done) {
		// Create new Dependency model instance
		var dependencyObj = new Dependency(dependency);

		// Save the Dependency
		dependencyObj.save(function() {
			// Request Dependencies
			request(app).get('/dependencies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dependency if not signed in', function(done) {
		// Create new Dependency model instance
		var dependencyObj = new Dependency(dependency);

		// Save the Dependency
		dependencyObj.save(function() {
			request(app).get('/dependencies/' + dependencyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dependency.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dependency instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency
				agent.post('/dependencies')
					.send(dependency)
					.expect(200)
					.end(function(dependencySaveErr, dependencySaveRes) {
						// Handle Dependency save error
						if (dependencySaveErr) done(dependencySaveErr);

						// Delete existing Dependency
						agent.delete('/dependencies/' + dependencySaveRes.body._id)
							.send(dependency)
							.expect(200)
							.end(function(dependencyDeleteErr, dependencyDeleteRes) {
								// Handle Dependency error error
								if (dependencyDeleteErr) done(dependencyDeleteErr);

								// Set assertions
								(dependencyDeleteRes.body._id).should.equal(dependencySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dependency instance if not signed in', function(done) {
		// Set Dependency user 
		dependency.user = user;

		// Create new Dependency model instance
		var dependencyObj = new Dependency(dependency);

		// Save the Dependency
		dependencyObj.save(function() {
			// Try deleting Dependency
			request(app).delete('/dependencies/' + dependencyObj._id)
			.expect(401)
			.end(function(dependencyDeleteErr, dependencyDeleteRes) {
				// Set message assertion
				(dependencyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dependency error error
				done(dependencyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dependency.remove().exec();
		done();
	});
});
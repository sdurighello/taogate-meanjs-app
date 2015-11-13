'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	DependencyImpact = mongoose.model('DependencyImpact'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dependencyImpact;

/**
 * Dependency impact routes tests
 */
describe('Dependency impact CRUD tests', function() {
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

		// Save a user to the test db and create new Dependency impact
		user.save(function() {
			dependencyImpact = {
				name: 'Dependency impact Name'
			};

			done();
		});
	});

	it('should be able to save Dependency impact instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency impact
				agent.post('/dependency-impacts')
					.send(dependencyImpact)
					.expect(200)
					.end(function(dependencyImpactSaveErr, dependencyImpactSaveRes) {
						// Handle Dependency impact save error
						if (dependencyImpactSaveErr) done(dependencyImpactSaveErr);

						// Get a list of Dependency impacts
						agent.get('/dependency-impacts')
							.end(function(dependencyImpactsGetErr, dependencyImpactsGetRes) {
								// Handle Dependency impact save error
								if (dependencyImpactsGetErr) done(dependencyImpactsGetErr);

								// Get Dependency impacts list
								var dependencyImpacts = dependencyImpactsGetRes.body;

								// Set assertions
								(dependencyImpacts[0].user._id).should.equal(userId);
								(dependencyImpacts[0].name).should.match('Dependency impact Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dependency impact instance if not logged in', function(done) {
		agent.post('/dependency-impacts')
			.send(dependencyImpact)
			.expect(401)
			.end(function(dependencyImpactSaveErr, dependencyImpactSaveRes) {
				// Call the assertion callback
				done(dependencyImpactSaveErr);
			});
	});

	it('should not be able to save Dependency impact instance if no name is provided', function(done) {
		// Invalidate name field
		dependencyImpact.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency impact
				agent.post('/dependency-impacts')
					.send(dependencyImpact)
					.expect(400)
					.end(function(dependencyImpactSaveErr, dependencyImpactSaveRes) {
						// Set message assertion
						(dependencyImpactSaveRes.body.message).should.match('Please fill Dependency impact name');
						
						// Handle Dependency impact save error
						done(dependencyImpactSaveErr);
					});
			});
	});

	it('should be able to update Dependency impact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency impact
				agent.post('/dependency-impacts')
					.send(dependencyImpact)
					.expect(200)
					.end(function(dependencyImpactSaveErr, dependencyImpactSaveRes) {
						// Handle Dependency impact save error
						if (dependencyImpactSaveErr) done(dependencyImpactSaveErr);

						// Update Dependency impact name
						dependencyImpact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dependency impact
						agent.put('/dependency-impacts/' + dependencyImpactSaveRes.body._id)
							.send(dependencyImpact)
							.expect(200)
							.end(function(dependencyImpactUpdateErr, dependencyImpactUpdateRes) {
								// Handle Dependency impact update error
								if (dependencyImpactUpdateErr) done(dependencyImpactUpdateErr);

								// Set assertions
								(dependencyImpactUpdateRes.body._id).should.equal(dependencyImpactSaveRes.body._id);
								(dependencyImpactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Dependency impacts if not signed in', function(done) {
		// Create new Dependency impact model instance
		var dependencyImpactObj = new DependencyImpact(dependencyImpact);

		// Save the Dependency impact
		dependencyImpactObj.save(function() {
			// Request Dependency impacts
			request(app).get('/dependency-impacts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dependency impact if not signed in', function(done) {
		// Create new Dependency impact model instance
		var dependencyImpactObj = new DependencyImpact(dependencyImpact);

		// Save the Dependency impact
		dependencyImpactObj.save(function() {
			request(app).get('/dependency-impacts/' + dependencyImpactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dependencyImpact.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dependency impact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dependency impact
				agent.post('/dependency-impacts')
					.send(dependencyImpact)
					.expect(200)
					.end(function(dependencyImpactSaveErr, dependencyImpactSaveRes) {
						// Handle Dependency impact save error
						if (dependencyImpactSaveErr) done(dependencyImpactSaveErr);

						// Delete existing Dependency impact
						agent.delete('/dependency-impacts/' + dependencyImpactSaveRes.body._id)
							.send(dependencyImpact)
							.expect(200)
							.end(function(dependencyImpactDeleteErr, dependencyImpactDeleteRes) {
								// Handle Dependency impact error error
								if (dependencyImpactDeleteErr) done(dependencyImpactDeleteErr);

								// Set assertions
								(dependencyImpactDeleteRes.body._id).should.equal(dependencyImpactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dependency impact instance if not signed in', function(done) {
		// Set Dependency impact user 
		dependencyImpact.user = user;

		// Create new Dependency impact model instance
		var dependencyImpactObj = new DependencyImpact(dependencyImpact);

		// Save the Dependency impact
		dependencyImpactObj.save(function() {
			// Try deleting Dependency impact
			request(app).delete('/dependency-impacts/' + dependencyImpactObj._id)
			.expect(401)
			.end(function(dependencyImpactDeleteErr, dependencyImpactDeleteRes) {
				// Set message assertion
				(dependencyImpactDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dependency impact error error
				done(dependencyImpactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		DependencyImpact.remove().exec();
		done();
	});
});
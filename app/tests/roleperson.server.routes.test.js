'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Roleperson = mongoose.model('Roleperson'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, roleperson;

/**
 * Roleperson routes tests
 */
describe('Roleperson CRUD tests', function() {
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

		// Save a user to the test db and create new Roleperson
		user.save(function() {
			roleperson = {
				name: 'Roleperson Name'
			};

			done();
		});
	});

	it('should be able to save Roleperson instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roleperson
				agent.post('/rolepeople')
					.send(roleperson)
					.expect(200)
					.end(function(rolepersonSaveErr, rolepersonSaveRes) {
						// Handle Roleperson save error
						if (rolepersonSaveErr) done(rolepersonSaveErr);

						// Get a list of Rolepeople
						agent.get('/rolepeople')
							.end(function(rolepeopleGetErr, rolepeopleGetRes) {
								// Handle Roleperson save error
								if (rolepeopleGetErr) done(rolepeopleGetErr);

								// Get Rolepeople list
								var rolepeople = rolepeopleGetRes.body;

								// Set assertions
								(rolepeople[0].user._id).should.equal(userId);
								(rolepeople[0].name).should.match('Roleperson Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Roleperson instance if not logged in', function(done) {
		agent.post('/rolepeople')
			.send(roleperson)
			.expect(401)
			.end(function(rolepersonSaveErr, rolepersonSaveRes) {
				// Call the assertion callback
				done(rolepersonSaveErr);
			});
	});

	it('should not be able to save Roleperson instance if no name is provided', function(done) {
		// Invalidate name field
		roleperson.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roleperson
				agent.post('/rolepeople')
					.send(roleperson)
					.expect(400)
					.end(function(rolepersonSaveErr, rolepersonSaveRes) {
						// Set message assertion
						(rolepersonSaveRes.body.message).should.match('Please fill Roleperson name');
						
						// Handle Roleperson save error
						done(rolepersonSaveErr);
					});
			});
	});

	it('should be able to update Roleperson instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roleperson
				agent.post('/rolepeople')
					.send(roleperson)
					.expect(200)
					.end(function(rolepersonSaveErr, rolepersonSaveRes) {
						// Handle Roleperson save error
						if (rolepersonSaveErr) done(rolepersonSaveErr);

						// Update Roleperson name
						roleperson.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Roleperson
						agent.put('/rolepeople/' + rolepersonSaveRes.body._id)
							.send(roleperson)
							.expect(200)
							.end(function(rolepersonUpdateErr, rolepersonUpdateRes) {
								// Handle Roleperson update error
								if (rolepersonUpdateErr) done(rolepersonUpdateErr);

								// Set assertions
								(rolepersonUpdateRes.body._id).should.equal(rolepersonSaveRes.body._id);
								(rolepersonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rolepeople if not signed in', function(done) {
		// Create new Roleperson model instance
		var rolepersonObj = new Roleperson(roleperson);

		// Save the Roleperson
		rolepersonObj.save(function() {
			// Request Rolepeople
			request(app).get('/rolepeople')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Roleperson if not signed in', function(done) {
		// Create new Roleperson model instance
		var rolepersonObj = new Roleperson(roleperson);

		// Save the Roleperson
		rolepersonObj.save(function() {
			request(app).get('/rolepeople/' + rolepersonObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', roleperson.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Roleperson instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Roleperson
				agent.post('/rolepeople')
					.send(roleperson)
					.expect(200)
					.end(function(rolepersonSaveErr, rolepersonSaveRes) {
						// Handle Roleperson save error
						if (rolepersonSaveErr) done(rolepersonSaveErr);

						// Delete existing Roleperson
						agent.delete('/rolepeople/' + rolepersonSaveRes.body._id)
							.send(roleperson)
							.expect(200)
							.end(function(rolepersonDeleteErr, rolepersonDeleteRes) {
								// Handle Roleperson error error
								if (rolepersonDeleteErr) done(rolepersonDeleteErr);

								// Set assertions
								(rolepersonDeleteRes.body._id).should.equal(rolepersonSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Roleperson instance if not signed in', function(done) {
		// Set Roleperson user 
		roleperson.user = user;

		// Create new Roleperson model instance
		var rolepersonObj = new Roleperson(roleperson);

		// Save the Roleperson
		rolepersonObj.save(function() {
			// Try deleting Roleperson
			request(app).delete('/rolepeople/' + rolepersonObj._id)
			.expect(401)
			.end(function(rolepersonDeleteErr, rolepersonDeleteRes) {
				// Set message assertion
				(rolepersonDeleteRes.body.message).should.match('User is not logged in');

				// Handle Roleperson error error
				done(rolepersonDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Roleperson.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Peoplerole = mongoose.model('Peoplerole'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peoplerole;

/**
 * Peoplerole routes tests
 */
describe('Peoplerole CRUD tests', function() {
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

		// Save a user to the test db and create new Peoplerole
		user.save(function() {
			peoplerole = {
				name: 'Peoplerole Name'
			};

			done();
		});
	});

	it('should be able to save Peoplerole instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Peoplerole
				agent.post('/peopleroles')
					.send(peoplerole)
					.expect(200)
					.end(function(peopleroleSaveErr, peopleroleSaveRes) {
						// Handle Peoplerole save error
						if (peopleroleSaveErr) done(peopleroleSaveErr);

						// Get a list of Peopleroles
						agent.get('/peopleroles')
							.end(function(peoplerolesGetErr, peoplerolesGetRes) {
								// Handle Peoplerole save error
								if (peoplerolesGetErr) done(peoplerolesGetErr);

								// Get Peopleroles list
								var peopleroles = peoplerolesGetRes.body;

								// Set assertions
								(peopleroles[0].user._id).should.equal(userId);
								(peopleroles[0].name).should.match('Peoplerole Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Peoplerole instance if not logged in', function(done) {
		agent.post('/peopleroles')
			.send(peoplerole)
			.expect(401)
			.end(function(peopleroleSaveErr, peopleroleSaveRes) {
				// Call the assertion callback
				done(peopleroleSaveErr);
			});
	});

	it('should not be able to save Peoplerole instance if no name is provided', function(done) {
		// Invalidate name field
		peoplerole.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Peoplerole
				agent.post('/peopleroles')
					.send(peoplerole)
					.expect(400)
					.end(function(peopleroleSaveErr, peopleroleSaveRes) {
						// Set message assertion
						(peopleroleSaveRes.body.message).should.match('Please fill Peoplerole name');
						
						// Handle Peoplerole save error
						done(peopleroleSaveErr);
					});
			});
	});

	it('should be able to update Peoplerole instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Peoplerole
				agent.post('/peopleroles')
					.send(peoplerole)
					.expect(200)
					.end(function(peopleroleSaveErr, peopleroleSaveRes) {
						// Handle Peoplerole save error
						if (peopleroleSaveErr) done(peopleroleSaveErr);

						// Update Peoplerole name
						peoplerole.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Peoplerole
						agent.put('/peopleroles/' + peopleroleSaveRes.body._id)
							.send(peoplerole)
							.expect(200)
							.end(function(peopleroleUpdateErr, peopleroleUpdateRes) {
								// Handle Peoplerole update error
								if (peopleroleUpdateErr) done(peopleroleUpdateErr);

								// Set assertions
								(peopleroleUpdateRes.body._id).should.equal(peopleroleSaveRes.body._id);
								(peopleroleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Peopleroles if not signed in', function(done) {
		// Create new Peoplerole model instance
		var peopleroleObj = new Peoplerole(peoplerole);

		// Save the Peoplerole
		peopleroleObj.save(function() {
			// Request Peopleroles
			request(app).get('/peopleroles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Peoplerole if not signed in', function(done) {
		// Create new Peoplerole model instance
		var peopleroleObj = new Peoplerole(peoplerole);

		// Save the Peoplerole
		peopleroleObj.save(function() {
			request(app).get('/peopleroles/' + peopleroleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peoplerole.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Peoplerole instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Peoplerole
				agent.post('/peopleroles')
					.send(peoplerole)
					.expect(200)
					.end(function(peopleroleSaveErr, peopleroleSaveRes) {
						// Handle Peoplerole save error
						if (peopleroleSaveErr) done(peopleroleSaveErr);

						// Delete existing Peoplerole
						agent.delete('/peopleroles/' + peopleroleSaveRes.body._id)
							.send(peoplerole)
							.expect(200)
							.end(function(peopleroleDeleteErr, peopleroleDeleteRes) {
								// Handle Peoplerole error error
								if (peopleroleDeleteErr) done(peopleroleDeleteErr);

								// Set assertions
								(peopleroleDeleteRes.body._id).should.equal(peopleroleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Peoplerole instance if not signed in', function(done) {
		// Set Peoplerole user 
		peoplerole.user = user;

		// Create new Peoplerole model instance
		var peopleroleObj = new Peoplerole(peoplerole);

		// Save the Peoplerole
		peopleroleObj.save(function() {
			// Try deleting Peoplerole
			request(app).delete('/peopleroles/' + peopleroleObj._id)
			.expect(401)
			.end(function(peopleroleDeleteErr, peopleroleDeleteRes) {
				// Set message assertion
				(peopleroleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Peoplerole error error
				done(peopleroleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Peoplerole.remove().exec();
		done();
	});
});
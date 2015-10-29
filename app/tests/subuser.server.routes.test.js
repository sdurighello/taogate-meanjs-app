'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Subuser = mongoose.model('Subuser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, subuser;

/**
 * Subuser routes tests
 */
describe('Subuser CRUD tests', function() {
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

		// Save a user to the test db and create new Subuser
		user.save(function() {
			subuser = {
				name: 'Subuser Name'
			};

			done();
		});
	});

	it('should be able to save Subuser instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subuser
				agent.post('/subusers')
					.send(subuser)
					.expect(200)
					.end(function(subuserSaveErr, subuserSaveRes) {
						// Handle Subuser save error
						if (subuserSaveErr) done(subuserSaveErr);

						// Get a list of Subusers
						agent.get('/subusers')
							.end(function(subusersGetErr, subusersGetRes) {
								// Handle Subuser save error
								if (subusersGetErr) done(subusersGetErr);

								// Get Subusers list
								var subusers = subusersGetRes.body;

								// Set assertions
								(subusers[0].user._id).should.equal(userId);
								(subusers[0].name).should.match('Subuser Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Subuser instance if not logged in', function(done) {
		agent.post('/subusers')
			.send(subuser)
			.expect(401)
			.end(function(subuserSaveErr, subuserSaveRes) {
				// Call the assertion callback
				done(subuserSaveErr);
			});
	});

	it('should not be able to save Subuser instance if no name is provided', function(done) {
		// Invalidate name field
		subuser.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subuser
				agent.post('/subusers')
					.send(subuser)
					.expect(400)
					.end(function(subuserSaveErr, subuserSaveRes) {
						// Set message assertion
						(subuserSaveRes.body.message).should.match('Please fill Subuser name');
						
						// Handle Subuser save error
						done(subuserSaveErr);
					});
			});
	});

	it('should be able to update Subuser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subuser
				agent.post('/subusers')
					.send(subuser)
					.expect(200)
					.end(function(subuserSaveErr, subuserSaveRes) {
						// Handle Subuser save error
						if (subuserSaveErr) done(subuserSaveErr);

						// Update Subuser name
						subuser.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Subuser
						agent.put('/subusers/' + subuserSaveRes.body._id)
							.send(subuser)
							.expect(200)
							.end(function(subuserUpdateErr, subuserUpdateRes) {
								// Handle Subuser update error
								if (subuserUpdateErr) done(subuserUpdateErr);

								// Set assertions
								(subuserUpdateRes.body._id).should.equal(subuserSaveRes.body._id);
								(subuserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Subusers if not signed in', function(done) {
		// Create new Subuser model instance
		var subuserObj = new Subuser(subuser);

		// Save the Subuser
		subuserObj.save(function() {
			// Request Subusers
			request(app).get('/subusers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Subuser if not signed in', function(done) {
		// Create new Subuser model instance
		var subuserObj = new Subuser(subuser);

		// Save the Subuser
		subuserObj.save(function() {
			request(app).get('/subusers/' + subuserObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', subuser.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Subuser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Subuser
				agent.post('/subusers')
					.send(subuser)
					.expect(200)
					.end(function(subuserSaveErr, subuserSaveRes) {
						// Handle Subuser save error
						if (subuserSaveErr) done(subuserSaveErr);

						// Delete existing Subuser
						agent.delete('/subusers/' + subuserSaveRes.body._id)
							.send(subuser)
							.expect(200)
							.end(function(subuserDeleteErr, subuserDeleteRes) {
								// Handle Subuser error error
								if (subuserDeleteErr) done(subuserDeleteErr);

								// Set assertions
								(subuserDeleteRes.body._id).should.equal(subuserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Subuser instance if not signed in', function(done) {
		// Set Subuser user 
		subuser.user = user;

		// Create new Subuser model instance
		var subuserObj = new Subuser(subuser);

		// Save the Subuser
		subuserObj.save(function() {
			// Try deleting Subuser
			request(app).delete('/subusers/' + subuserObj._id)
			.expect(401)
			.end(function(subuserDeleteErr, subuserDeleteRes) {
				// Set message assertion
				(subuserDeleteRes.body.message).should.match('User is not logged in');

				// Handle Subuser error error
				done(subuserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Subuser.remove().exec();
		done();
	});
});
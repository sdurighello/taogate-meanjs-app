'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Portfoliotype = mongoose.model('Portfoliotype'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfoliotype;

/**
 * Portfoliotype routes tests
 */
describe('Portfoliotype CRUD tests', function() {
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

		// Save a user to the test db and create new Portfoliotype
		user.save(function() {
			portfoliotype = {
				name: 'Portfoliotype Name'
			};

			done();
		});
	});

	it('should be able to save Portfoliotype instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfoliotype
				agent.post('/portfoliotypes')
					.send(portfoliotype)
					.expect(200)
					.end(function(portfoliotypeSaveErr, portfoliotypeSaveRes) {
						// Handle Portfoliotype save error
						if (portfoliotypeSaveErr) done(portfoliotypeSaveErr);

						// Get a list of Portfoliotypes
						agent.get('/portfoliotypes')
							.end(function(portfoliotypesGetErr, portfoliotypesGetRes) {
								// Handle Portfoliotype save error
								if (portfoliotypesGetErr) done(portfoliotypesGetErr);

								// Get Portfoliotypes list
								var portfoliotypes = portfoliotypesGetRes.body;

								// Set assertions
								(portfoliotypes[0].user._id).should.equal(userId);
								(portfoliotypes[0].name).should.match('Portfoliotype Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfoliotype instance if not logged in', function(done) {
		agent.post('/portfoliotypes')
			.send(portfoliotype)
			.expect(401)
			.end(function(portfoliotypeSaveErr, portfoliotypeSaveRes) {
				// Call the assertion callback
				done(portfoliotypeSaveErr);
			});
	});

	it('should not be able to save Portfoliotype instance if no name is provided', function(done) {
		// Invalidate name field
		portfoliotype.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfoliotype
				agent.post('/portfoliotypes')
					.send(portfoliotype)
					.expect(400)
					.end(function(portfoliotypeSaveErr, portfoliotypeSaveRes) {
						// Set message assertion
						(portfoliotypeSaveRes.body.message).should.match('Please fill Portfoliotype name');
						
						// Handle Portfoliotype save error
						done(portfoliotypeSaveErr);
					});
			});
	});

	it('should be able to update Portfoliotype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfoliotype
				agent.post('/portfoliotypes')
					.send(portfoliotype)
					.expect(200)
					.end(function(portfoliotypeSaveErr, portfoliotypeSaveRes) {
						// Handle Portfoliotype save error
						if (portfoliotypeSaveErr) done(portfoliotypeSaveErr);

						// Update Portfoliotype name
						portfoliotype.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfoliotype
						agent.put('/portfoliotypes/' + portfoliotypeSaveRes.body._id)
							.send(portfoliotype)
							.expect(200)
							.end(function(portfoliotypeUpdateErr, portfoliotypeUpdateRes) {
								// Handle Portfoliotype update error
								if (portfoliotypeUpdateErr) done(portfoliotypeUpdateErr);

								// Set assertions
								(portfoliotypeUpdateRes.body._id).should.equal(portfoliotypeSaveRes.body._id);
								(portfoliotypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfoliotypes if not signed in', function(done) {
		// Create new Portfoliotype model instance
		var portfoliotypeObj = new Portfoliotype(portfoliotype);

		// Save the Portfoliotype
		portfoliotypeObj.save(function() {
			// Request Portfoliotypes
			request(app).get('/portfoliotypes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfoliotype if not signed in', function(done) {
		// Create new Portfoliotype model instance
		var portfoliotypeObj = new Portfoliotype(portfoliotype);

		// Save the Portfoliotype
		portfoliotypeObj.save(function() {
			request(app).get('/portfoliotypes/' + portfoliotypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfoliotype.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfoliotype instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfoliotype
				agent.post('/portfoliotypes')
					.send(portfoliotype)
					.expect(200)
					.end(function(portfoliotypeSaveErr, portfoliotypeSaveRes) {
						// Handle Portfoliotype save error
						if (portfoliotypeSaveErr) done(portfoliotypeSaveErr);

						// Delete existing Portfoliotype
						agent.delete('/portfoliotypes/' + portfoliotypeSaveRes.body._id)
							.send(portfoliotype)
							.expect(200)
							.end(function(portfoliotypeDeleteErr, portfoliotypeDeleteRes) {
								// Handle Portfoliotype error error
								if (portfoliotypeDeleteErr) done(portfoliotypeDeleteErr);

								// Set assertions
								(portfoliotypeDeleteRes.body._id).should.equal(portfoliotypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfoliotype instance if not signed in', function(done) {
		// Set Portfoliotype user 
		portfoliotype.user = user;

		// Create new Portfoliotype model instance
		var portfoliotypeObj = new Portfoliotype(portfoliotype);

		// Save the Portfoliotype
		portfoliotypeObj.save(function() {
			// Try deleting Portfoliotype
			request(app).delete('/portfoliotypes/' + portfoliotypeObj._id)
			.expect(401)
			.end(function(portfoliotypeDeleteErr, portfoliotypeDeleteRes) {
				// Set message assertion
				(portfoliotypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfoliotype error error
				done(portfoliotypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Portfoliotype.remove().exec();
		done();
	});
});
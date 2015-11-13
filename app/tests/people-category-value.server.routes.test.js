'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleCategoryValue = mongoose.model('PeopleCategoryValue'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleCategoryValue;

/**
 * People category value routes tests
 */
describe('People category value CRUD tests', function() {
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

		// Save a user to the test db and create new People category value
		user.save(function() {
			peopleCategoryValue = {
				name: 'People category value Name'
			};

			done();
		});
	});

	it('should be able to save People category value instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category value
				agent.post('/people-category-values')
					.send(peopleCategoryValue)
					.expect(200)
					.end(function(peopleCategoryValueSaveErr, peopleCategoryValueSaveRes) {
						// Handle People category value save error
						if (peopleCategoryValueSaveErr) done(peopleCategoryValueSaveErr);

						// Get a list of People category values
						agent.get('/people-category-values')
							.end(function(peopleCategoryValuesGetErr, peopleCategoryValuesGetRes) {
								// Handle People category value save error
								if (peopleCategoryValuesGetErr) done(peopleCategoryValuesGetErr);

								// Get People category values list
								var peopleCategoryValues = peopleCategoryValuesGetRes.body;

								// Set assertions
								(peopleCategoryValues[0].user._id).should.equal(userId);
								(peopleCategoryValues[0].name).should.match('People category value Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People category value instance if not logged in', function(done) {
		agent.post('/people-category-values')
			.send(peopleCategoryValue)
			.expect(401)
			.end(function(peopleCategoryValueSaveErr, peopleCategoryValueSaveRes) {
				// Call the assertion callback
				done(peopleCategoryValueSaveErr);
			});
	});

	it('should not be able to save People category value instance if no name is provided', function(done) {
		// Invalidate name field
		peopleCategoryValue.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category value
				agent.post('/people-category-values')
					.send(peopleCategoryValue)
					.expect(400)
					.end(function(peopleCategoryValueSaveErr, peopleCategoryValueSaveRes) {
						// Set message assertion
						(peopleCategoryValueSaveRes.body.message).should.match('Please fill People category value name');
						
						// Handle People category value save error
						done(peopleCategoryValueSaveErr);
					});
			});
	});

	it('should be able to update People category value instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category value
				agent.post('/people-category-values')
					.send(peopleCategoryValue)
					.expect(200)
					.end(function(peopleCategoryValueSaveErr, peopleCategoryValueSaveRes) {
						// Handle People category value save error
						if (peopleCategoryValueSaveErr) done(peopleCategoryValueSaveErr);

						// Update People category value name
						peopleCategoryValue.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People category value
						agent.put('/people-category-values/' + peopleCategoryValueSaveRes.body._id)
							.send(peopleCategoryValue)
							.expect(200)
							.end(function(peopleCategoryValueUpdateErr, peopleCategoryValueUpdateRes) {
								// Handle People category value update error
								if (peopleCategoryValueUpdateErr) done(peopleCategoryValueUpdateErr);

								// Set assertions
								(peopleCategoryValueUpdateRes.body._id).should.equal(peopleCategoryValueSaveRes.body._id);
								(peopleCategoryValueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People category values if not signed in', function(done) {
		// Create new People category value model instance
		var peopleCategoryValueObj = new PeopleCategoryValue(peopleCategoryValue);

		// Save the People category value
		peopleCategoryValueObj.save(function() {
			// Request People category values
			request(app).get('/people-category-values')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People category value if not signed in', function(done) {
		// Create new People category value model instance
		var peopleCategoryValueObj = new PeopleCategoryValue(peopleCategoryValue);

		// Save the People category value
		peopleCategoryValueObj.save(function() {
			request(app).get('/people-category-values/' + peopleCategoryValueObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleCategoryValue.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People category value instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category value
				agent.post('/people-category-values')
					.send(peopleCategoryValue)
					.expect(200)
					.end(function(peopleCategoryValueSaveErr, peopleCategoryValueSaveRes) {
						// Handle People category value save error
						if (peopleCategoryValueSaveErr) done(peopleCategoryValueSaveErr);

						// Delete existing People category value
						agent.delete('/people-category-values/' + peopleCategoryValueSaveRes.body._id)
							.send(peopleCategoryValue)
							.expect(200)
							.end(function(peopleCategoryValueDeleteErr, peopleCategoryValueDeleteRes) {
								// Handle People category value error error
								if (peopleCategoryValueDeleteErr) done(peopleCategoryValueDeleteErr);

								// Set assertions
								(peopleCategoryValueDeleteRes.body._id).should.equal(peopleCategoryValueSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People category value instance if not signed in', function(done) {
		// Set People category value user 
		peopleCategoryValue.user = user;

		// Create new People category value model instance
		var peopleCategoryValueObj = new PeopleCategoryValue(peopleCategoryValue);

		// Save the People category value
		peopleCategoryValueObj.save(function() {
			// Try deleting People category value
			request(app).delete('/people-category-values/' + peopleCategoryValueObj._id)
			.expect(401)
			.end(function(peopleCategoryValueDeleteErr, peopleCategoryValueDeleteRes) {
				// Set message assertion
				(peopleCategoryValueDeleteRes.body.message).should.match('User is not logged in');

				// Handle People category value error error
				done(peopleCategoryValueDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleCategoryValue.remove().exec();
		done();
	});
});
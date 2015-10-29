'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CategoryValue = mongoose.model('CategoryValue'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, categoryValue;

/**
 * Category value routes tests
 */
describe('Category value CRUD tests', function() {
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

		// Save a user to the test db and create new Category value
		user.save(function() {
			categoryValue = {
				name: 'Category value Name'
			};

			done();
		});
	});

	it('should be able to save Category value instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category value
				agent.post('/category-values')
					.send(categoryValue)
					.expect(200)
					.end(function(categoryValueSaveErr, categoryValueSaveRes) {
						// Handle Category value save error
						if (categoryValueSaveErr) done(categoryValueSaveErr);

						// Get a list of Category values
						agent.get('/category-values')
							.end(function(categoryValuesGetErr, categoryValuesGetRes) {
								// Handle Category value save error
								if (categoryValuesGetErr) done(categoryValuesGetErr);

								// Get Category values list
								var categoryValues = categoryValuesGetRes.body;

								// Set assertions
								(categoryValues[0].user._id).should.equal(userId);
								(categoryValues[0].name).should.match('Category value Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Category value instance if not logged in', function(done) {
		agent.post('/category-values')
			.send(categoryValue)
			.expect(401)
			.end(function(categoryValueSaveErr, categoryValueSaveRes) {
				// Call the assertion callback
				done(categoryValueSaveErr);
			});
	});

	it('should not be able to save Category value instance if no name is provided', function(done) {
		// Invalidate name field
		categoryValue.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category value
				agent.post('/category-values')
					.send(categoryValue)
					.expect(400)
					.end(function(categoryValueSaveErr, categoryValueSaveRes) {
						// Set message assertion
						(categoryValueSaveRes.body.message).should.match('Please fill Category value name');
						
						// Handle Category value save error
						done(categoryValueSaveErr);
					});
			});
	});

	it('should be able to update Category value instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category value
				agent.post('/category-values')
					.send(categoryValue)
					.expect(200)
					.end(function(categoryValueSaveErr, categoryValueSaveRes) {
						// Handle Category value save error
						if (categoryValueSaveErr) done(categoryValueSaveErr);

						// Update Category value name
						categoryValue.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Category value
						agent.put('/category-values/' + categoryValueSaveRes.body._id)
							.send(categoryValue)
							.expect(200)
							.end(function(categoryValueUpdateErr, categoryValueUpdateRes) {
								// Handle Category value update error
								if (categoryValueUpdateErr) done(categoryValueUpdateErr);

								// Set assertions
								(categoryValueUpdateRes.body._id).should.equal(categoryValueSaveRes.body._id);
								(categoryValueUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Category values if not signed in', function(done) {
		// Create new Category value model instance
		var categoryValueObj = new CategoryValue(categoryValue);

		// Save the Category value
		categoryValueObj.save(function() {
			// Request Category values
			request(app).get('/category-values')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Category value if not signed in', function(done) {
		// Create new Category value model instance
		var categoryValueObj = new CategoryValue(categoryValue);

		// Save the Category value
		categoryValueObj.save(function() {
			request(app).get('/category-values/' + categoryValueObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', categoryValue.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Category value instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category value
				agent.post('/category-values')
					.send(categoryValue)
					.expect(200)
					.end(function(categoryValueSaveErr, categoryValueSaveRes) {
						// Handle Category value save error
						if (categoryValueSaveErr) done(categoryValueSaveErr);

						// Delete existing Category value
						agent.delete('/category-values/' + categoryValueSaveRes.body._id)
							.send(categoryValue)
							.expect(200)
							.end(function(categoryValueDeleteErr, categoryValueDeleteRes) {
								// Handle Category value error error
								if (categoryValueDeleteErr) done(categoryValueDeleteErr);

								// Set assertions
								(categoryValueDeleteRes.body._id).should.equal(categoryValueSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Category value instance if not signed in', function(done) {
		// Set Category value user 
		categoryValue.user = user;

		// Create new Category value model instance
		var categoryValueObj = new CategoryValue(categoryValue);

		// Save the Category value
		categoryValueObj.save(function() {
			// Try deleting Category value
			request(app).delete('/category-values/' + categoryValueObj._id)
			.expect(401)
			.end(function(categoryValueDeleteErr, categoryValueDeleteRes) {
				// Set message assertion
				(categoryValueDeleteRes.body.message).should.match('User is not logged in');

				// Handle Category value error error
				done(categoryValueDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		CategoryValue.remove().exec();
		done();
	});
});
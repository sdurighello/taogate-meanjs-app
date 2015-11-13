'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeopleCategory = mongoose.model('PeopleCategory'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peopleCategory;

/**
 * People category routes tests
 */
describe('People category CRUD tests', function() {
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

		// Save a user to the test db and create new People category
		user.save(function() {
			peopleCategory = {
				name: 'People category Name'
			};

			done();
		});
	});

	it('should be able to save People category instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category
				agent.post('/people-categories')
					.send(peopleCategory)
					.expect(200)
					.end(function(peopleCategorySaveErr, peopleCategorySaveRes) {
						// Handle People category save error
						if (peopleCategorySaveErr) done(peopleCategorySaveErr);

						// Get a list of People categories
						agent.get('/people-categories')
							.end(function(peopleCategoriesGetErr, peopleCategoriesGetRes) {
								// Handle People category save error
								if (peopleCategoriesGetErr) done(peopleCategoriesGetErr);

								// Get People categories list
								var peopleCategories = peopleCategoriesGetRes.body;

								// Set assertions
								(peopleCategories[0].user._id).should.equal(userId);
								(peopleCategories[0].name).should.match('People category Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People category instance if not logged in', function(done) {
		agent.post('/people-categories')
			.send(peopleCategory)
			.expect(401)
			.end(function(peopleCategorySaveErr, peopleCategorySaveRes) {
				// Call the assertion callback
				done(peopleCategorySaveErr);
			});
	});

	it('should not be able to save People category instance if no name is provided', function(done) {
		// Invalidate name field
		peopleCategory.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category
				agent.post('/people-categories')
					.send(peopleCategory)
					.expect(400)
					.end(function(peopleCategorySaveErr, peopleCategorySaveRes) {
						// Set message assertion
						(peopleCategorySaveRes.body.message).should.match('Please fill People category name');
						
						// Handle People category save error
						done(peopleCategorySaveErr);
					});
			});
	});

	it('should be able to update People category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category
				agent.post('/people-categories')
					.send(peopleCategory)
					.expect(200)
					.end(function(peopleCategorySaveErr, peopleCategorySaveRes) {
						// Handle People category save error
						if (peopleCategorySaveErr) done(peopleCategorySaveErr);

						// Update People category name
						peopleCategory.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People category
						agent.put('/people-categories/' + peopleCategorySaveRes.body._id)
							.send(peopleCategory)
							.expect(200)
							.end(function(peopleCategoryUpdateErr, peopleCategoryUpdateRes) {
								// Handle People category update error
								if (peopleCategoryUpdateErr) done(peopleCategoryUpdateErr);

								// Set assertions
								(peopleCategoryUpdateRes.body._id).should.equal(peopleCategorySaveRes.body._id);
								(peopleCategoryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People categories if not signed in', function(done) {
		// Create new People category model instance
		var peopleCategoryObj = new PeopleCategory(peopleCategory);

		// Save the People category
		peopleCategoryObj.save(function() {
			// Request People categories
			request(app).get('/people-categories')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People category if not signed in', function(done) {
		// Create new People category model instance
		var peopleCategoryObj = new PeopleCategory(peopleCategory);

		// Save the People category
		peopleCategoryObj.save(function() {
			request(app).get('/people-categories/' + peopleCategoryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peopleCategory.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People category instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People category
				agent.post('/people-categories')
					.send(peopleCategory)
					.expect(200)
					.end(function(peopleCategorySaveErr, peopleCategorySaveRes) {
						// Handle People category save error
						if (peopleCategorySaveErr) done(peopleCategorySaveErr);

						// Delete existing People category
						agent.delete('/people-categories/' + peopleCategorySaveRes.body._id)
							.send(peopleCategory)
							.expect(200)
							.end(function(peopleCategoryDeleteErr, peopleCategoryDeleteRes) {
								// Handle People category error error
								if (peopleCategoryDeleteErr) done(peopleCategoryDeleteErr);

								// Set assertions
								(peopleCategoryDeleteRes.body._id).should.equal(peopleCategorySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People category instance if not signed in', function(done) {
		// Set People category user 
		peopleCategory.user = user;

		// Create new People category model instance
		var peopleCategoryObj = new PeopleCategory(peopleCategory);

		// Save the People category
		peopleCategoryObj.save(function() {
			// Try deleting People category
			request(app).delete('/people-categories/' + peopleCategoryObj._id)
			.expect(401)
			.end(function(peopleCategoryDeleteErr, peopleCategoryDeleteRes) {
				// Set message assertion
				(peopleCategoryDeleteRes.body.message).should.match('User is not logged in');

				// Handle People category error error
				done(peopleCategoryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeopleCategory.remove().exec();
		done();
	});
});
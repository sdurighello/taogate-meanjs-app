'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	CategoryGroup = mongoose.model('CategoryGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, categoryGroup;

/**
 * Category group routes tests
 */
describe('Category group CRUD tests', function() {
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

		// Save a user to the test db and create new Category group
		user.save(function() {
			categoryGroup = {
				name: 'Category group Name'
			};

			done();
		});
	});

	it('should be able to save Category group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category group
				agent.post('/category-groups')
					.send(categoryGroup)
					.expect(200)
					.end(function(categoryGroupSaveErr, categoryGroupSaveRes) {
						// Handle Category group save error
						if (categoryGroupSaveErr) done(categoryGroupSaveErr);

						// Get a list of Category groups
						agent.get('/category-groups')
							.end(function(categoryGroupsGetErr, categoryGroupsGetRes) {
								// Handle Category group save error
								if (categoryGroupsGetErr) done(categoryGroupsGetErr);

								// Get Category groups list
								var categoryGroups = categoryGroupsGetRes.body;

								// Set assertions
								(categoryGroups[0].user._id).should.equal(userId);
								(categoryGroups[0].name).should.match('Category group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Category group instance if not logged in', function(done) {
		agent.post('/category-groups')
			.send(categoryGroup)
			.expect(401)
			.end(function(categoryGroupSaveErr, categoryGroupSaveRes) {
				// Call the assertion callback
				done(categoryGroupSaveErr);
			});
	});

	it('should not be able to save Category group instance if no name is provided', function(done) {
		// Invalidate name field
		categoryGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category group
				agent.post('/category-groups')
					.send(categoryGroup)
					.expect(400)
					.end(function(categoryGroupSaveErr, categoryGroupSaveRes) {
						// Set message assertion
						(categoryGroupSaveRes.body.message).should.match('Please fill Category group name');
						
						// Handle Category group save error
						done(categoryGroupSaveErr);
					});
			});
	});

	it('should be able to update Category group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category group
				agent.post('/category-groups')
					.send(categoryGroup)
					.expect(200)
					.end(function(categoryGroupSaveErr, categoryGroupSaveRes) {
						// Handle Category group save error
						if (categoryGroupSaveErr) done(categoryGroupSaveErr);

						// Update Category group name
						categoryGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Category group
						agent.put('/category-groups/' + categoryGroupSaveRes.body._id)
							.send(categoryGroup)
							.expect(200)
							.end(function(categoryGroupUpdateErr, categoryGroupUpdateRes) {
								// Handle Category group update error
								if (categoryGroupUpdateErr) done(categoryGroupUpdateErr);

								// Set assertions
								(categoryGroupUpdateRes.body._id).should.equal(categoryGroupSaveRes.body._id);
								(categoryGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Category groups if not signed in', function(done) {
		// Create new Category group model instance
		var categoryGroupObj = new CategoryGroup(categoryGroup);

		// Save the Category group
		categoryGroupObj.save(function() {
			// Request Category groups
			request(app).get('/category-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Category group if not signed in', function(done) {
		// Create new Category group model instance
		var categoryGroupObj = new CategoryGroup(categoryGroup);

		// Save the Category group
		categoryGroupObj.save(function() {
			request(app).get('/category-groups/' + categoryGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', categoryGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Category group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Category group
				agent.post('/category-groups')
					.send(categoryGroup)
					.expect(200)
					.end(function(categoryGroupSaveErr, categoryGroupSaveRes) {
						// Handle Category group save error
						if (categoryGroupSaveErr) done(categoryGroupSaveErr);

						// Delete existing Category group
						agent.delete('/category-groups/' + categoryGroupSaveRes.body._id)
							.send(categoryGroup)
							.expect(200)
							.end(function(categoryGroupDeleteErr, categoryGroupDeleteRes) {
								// Handle Category group error error
								if (categoryGroupDeleteErr) done(categoryGroupDeleteErr);

								// Set assertions
								(categoryGroupDeleteRes.body._id).should.equal(categoryGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Category group instance if not signed in', function(done) {
		// Set Category group user 
		categoryGroup.user = user;

		// Create new Category group model instance
		var categoryGroupObj = new CategoryGroup(categoryGroup);

		// Save the Category group
		categoryGroupObj.save(function() {
			// Try deleting Category group
			request(app).delete('/category-groups/' + categoryGroupObj._id)
			.expect(401)
			.end(function(categoryGroupDeleteErr, categoryGroupDeleteRes) {
				// Set message assertion
				(categoryGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle Category group error error
				done(categoryGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		CategoryGroup.remove().exec();
		done();
	});
});
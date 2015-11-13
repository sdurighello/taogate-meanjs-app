'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeoplePortfolioGroup = mongoose.model('PeoplePortfolioGroup'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peoplePortfolioGroup;

/**
 * People portfolio group routes tests
 */
describe('People portfolio group CRUD tests', function() {
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

		// Save a user to the test db and create new People portfolio group
		user.save(function() {
			peoplePortfolioGroup = {
				name: 'People portfolio group Name'
			};

			done();
		});
	});

	it('should be able to save People portfolio group instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio group
				agent.post('/people-portfolio-groups')
					.send(peoplePortfolioGroup)
					.expect(200)
					.end(function(peoplePortfolioGroupSaveErr, peoplePortfolioGroupSaveRes) {
						// Handle People portfolio group save error
						if (peoplePortfolioGroupSaveErr) done(peoplePortfolioGroupSaveErr);

						// Get a list of People portfolio groups
						agent.get('/people-portfolio-groups')
							.end(function(peoplePortfolioGroupsGetErr, peoplePortfolioGroupsGetRes) {
								// Handle People portfolio group save error
								if (peoplePortfolioGroupsGetErr) done(peoplePortfolioGroupsGetErr);

								// Get People portfolio groups list
								var peoplePortfolioGroups = peoplePortfolioGroupsGetRes.body;

								// Set assertions
								(peoplePortfolioGroups[0].user._id).should.equal(userId);
								(peoplePortfolioGroups[0].name).should.match('People portfolio group Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People portfolio group instance if not logged in', function(done) {
		agent.post('/people-portfolio-groups')
			.send(peoplePortfolioGroup)
			.expect(401)
			.end(function(peoplePortfolioGroupSaveErr, peoplePortfolioGroupSaveRes) {
				// Call the assertion callback
				done(peoplePortfolioGroupSaveErr);
			});
	});

	it('should not be able to save People portfolio group instance if no name is provided', function(done) {
		// Invalidate name field
		peoplePortfolioGroup.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio group
				agent.post('/people-portfolio-groups')
					.send(peoplePortfolioGroup)
					.expect(400)
					.end(function(peoplePortfolioGroupSaveErr, peoplePortfolioGroupSaveRes) {
						// Set message assertion
						(peoplePortfolioGroupSaveRes.body.message).should.match('Please fill People portfolio group name');
						
						// Handle People portfolio group save error
						done(peoplePortfolioGroupSaveErr);
					});
			});
	});

	it('should be able to update People portfolio group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio group
				agent.post('/people-portfolio-groups')
					.send(peoplePortfolioGroup)
					.expect(200)
					.end(function(peoplePortfolioGroupSaveErr, peoplePortfolioGroupSaveRes) {
						// Handle People portfolio group save error
						if (peoplePortfolioGroupSaveErr) done(peoplePortfolioGroupSaveErr);

						// Update People portfolio group name
						peoplePortfolioGroup.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People portfolio group
						agent.put('/people-portfolio-groups/' + peoplePortfolioGroupSaveRes.body._id)
							.send(peoplePortfolioGroup)
							.expect(200)
							.end(function(peoplePortfolioGroupUpdateErr, peoplePortfolioGroupUpdateRes) {
								// Handle People portfolio group update error
								if (peoplePortfolioGroupUpdateErr) done(peoplePortfolioGroupUpdateErr);

								// Set assertions
								(peoplePortfolioGroupUpdateRes.body._id).should.equal(peoplePortfolioGroupSaveRes.body._id);
								(peoplePortfolioGroupUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People portfolio groups if not signed in', function(done) {
		// Create new People portfolio group model instance
		var peoplePortfolioGroupObj = new PeoplePortfolioGroup(peoplePortfolioGroup);

		// Save the People portfolio group
		peoplePortfolioGroupObj.save(function() {
			// Request People portfolio groups
			request(app).get('/people-portfolio-groups')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People portfolio group if not signed in', function(done) {
		// Create new People portfolio group model instance
		var peoplePortfolioGroupObj = new PeoplePortfolioGroup(peoplePortfolioGroup);

		// Save the People portfolio group
		peoplePortfolioGroupObj.save(function() {
			request(app).get('/people-portfolio-groups/' + peoplePortfolioGroupObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peoplePortfolioGroup.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People portfolio group instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio group
				agent.post('/people-portfolio-groups')
					.send(peoplePortfolioGroup)
					.expect(200)
					.end(function(peoplePortfolioGroupSaveErr, peoplePortfolioGroupSaveRes) {
						// Handle People portfolio group save error
						if (peoplePortfolioGroupSaveErr) done(peoplePortfolioGroupSaveErr);

						// Delete existing People portfolio group
						agent.delete('/people-portfolio-groups/' + peoplePortfolioGroupSaveRes.body._id)
							.send(peoplePortfolioGroup)
							.expect(200)
							.end(function(peoplePortfolioGroupDeleteErr, peoplePortfolioGroupDeleteRes) {
								// Handle People portfolio group error error
								if (peoplePortfolioGroupDeleteErr) done(peoplePortfolioGroupDeleteErr);

								// Set assertions
								(peoplePortfolioGroupDeleteRes.body._id).should.equal(peoplePortfolioGroupSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People portfolio group instance if not signed in', function(done) {
		// Set People portfolio group user 
		peoplePortfolioGroup.user = user;

		// Create new People portfolio group model instance
		var peoplePortfolioGroupObj = new PeoplePortfolioGroup(peoplePortfolioGroup);

		// Save the People portfolio group
		peoplePortfolioGroupObj.save(function() {
			// Try deleting People portfolio group
			request(app).delete('/people-portfolio-groups/' + peoplePortfolioGroupObj._id)
			.expect(401)
			.end(function(peoplePortfolioGroupDeleteErr, peoplePortfolioGroupDeleteRes) {
				// Set message assertion
				(peoplePortfolioGroupDeleteRes.body.message).should.match('User is not logged in');

				// Handle People portfolio group error error
				done(peoplePortfolioGroupDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeoplePortfolioGroup.remove().exec();
		done();
	});
});
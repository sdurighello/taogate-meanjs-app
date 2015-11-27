'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PeoplePortfolioRole = mongoose.model('PeoplePortfolioRole'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, peoplePortfolioRole;

/**
 * People portfolio role routes tests
 */
describe('People portfolio role CRUD tests', function() {
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

		// Save a user to the test db and create new People portfolio role
		user.save(function() {
			peoplePortfolioRole = {
				name: 'People portfolio role Name'
			};

			done();
		});
	});

	it('should be able to save People portfolio role instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio role
				agent.post('/people-portfolio-roles')
					.send(peoplePortfolioRole)
					.expect(200)
					.end(function(peoplePortfolioRoleSaveErr, peoplePortfolioRoleSaveRes) {
						// Handle People portfolio role save error
						if (peoplePortfolioRoleSaveErr) done(peoplePortfolioRoleSaveErr);

						// Get a list of People portfolio roles
						agent.get('/people-portfolio-roles')
							.end(function(peoplePortfolioRolesGetErr, peoplePortfolioRolesGetRes) {
								// Handle People portfolio role save error
								if (peoplePortfolioRolesGetErr) done(peoplePortfolioRolesGetErr);

								// Get People portfolio roles list
								var peoplePortfolioRoles = peoplePortfolioRolesGetRes.body;

								// Set assertions
								(peoplePortfolioRoles[0].user._id).should.equal(userId);
								(peoplePortfolioRoles[0].name).should.match('People portfolio role Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save People portfolio role instance if not logged in', function(done) {
		agent.post('/people-portfolio-roles')
			.send(peoplePortfolioRole)
			.expect(401)
			.end(function(peoplePortfolioRoleSaveErr, peoplePortfolioRoleSaveRes) {
				// Call the assertion callback
				done(peoplePortfolioRoleSaveErr);
			});
	});

	it('should not be able to save People portfolio role instance if no name is provided', function(done) {
		// Invalidate name field
		peoplePortfolioRole.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio role
				agent.post('/people-portfolio-roles')
					.send(peoplePortfolioRole)
					.expect(400)
					.end(function(peoplePortfolioRoleSaveErr, peoplePortfolioRoleSaveRes) {
						// Set message assertion
						(peoplePortfolioRoleSaveRes.body.message).should.match('Please fill People portfolio role name');
						
						// Handle People portfolio role save error
						done(peoplePortfolioRoleSaveErr);
					});
			});
	});

	it('should be able to update People portfolio role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio role
				agent.post('/people-portfolio-roles')
					.send(peoplePortfolioRole)
					.expect(200)
					.end(function(peoplePortfolioRoleSaveErr, peoplePortfolioRoleSaveRes) {
						// Handle People portfolio role save error
						if (peoplePortfolioRoleSaveErr) done(peoplePortfolioRoleSaveErr);

						// Update People portfolio role name
						peoplePortfolioRole.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing People portfolio role
						agent.put('/people-portfolio-roles/' + peoplePortfolioRoleSaveRes.body._id)
							.send(peoplePortfolioRole)
							.expect(200)
							.end(function(peoplePortfolioRoleUpdateErr, peoplePortfolioRoleUpdateRes) {
								// Handle People portfolio role update error
								if (peoplePortfolioRoleUpdateErr) done(peoplePortfolioRoleUpdateErr);

								// Set assertions
								(peoplePortfolioRoleUpdateRes.body._id).should.equal(peoplePortfolioRoleSaveRes.body._id);
								(peoplePortfolioRoleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of People portfolio roles if not signed in', function(done) {
		// Create new People portfolio role model instance
		var peoplePortfolioRoleObj = new PeoplePortfolioRole(peoplePortfolioRole);

		// Save the People portfolio role
		peoplePortfolioRoleObj.save(function() {
			// Request People portfolio roles
			request(app).get('/people-portfolio-roles')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single People portfolio role if not signed in', function(done) {
		// Create new People portfolio role model instance
		var peoplePortfolioRoleObj = new PeoplePortfolioRole(peoplePortfolioRole);

		// Save the People portfolio role
		peoplePortfolioRoleObj.save(function() {
			request(app).get('/people-portfolio-roles/' + peoplePortfolioRoleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', peoplePortfolioRole.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete People portfolio role instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new People portfolio role
				agent.post('/people-portfolio-roles')
					.send(peoplePortfolioRole)
					.expect(200)
					.end(function(peoplePortfolioRoleSaveErr, peoplePortfolioRoleSaveRes) {
						// Handle People portfolio role save error
						if (peoplePortfolioRoleSaveErr) done(peoplePortfolioRoleSaveErr);

						// Delete existing People portfolio role
						agent.delete('/people-portfolio-roles/' + peoplePortfolioRoleSaveRes.body._id)
							.send(peoplePortfolioRole)
							.expect(200)
							.end(function(peoplePortfolioRoleDeleteErr, peoplePortfolioRoleDeleteRes) {
								// Handle People portfolio role error error
								if (peoplePortfolioRoleDeleteErr) done(peoplePortfolioRoleDeleteErr);

								// Set assertions
								(peoplePortfolioRoleDeleteRes.body._id).should.equal(peoplePortfolioRoleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete People portfolio role instance if not signed in', function(done) {
		// Set People portfolio role user 
		peoplePortfolioRole.user = user;

		// Create new People portfolio role model instance
		var peoplePortfolioRoleObj = new PeoplePortfolioRole(peoplePortfolioRole);

		// Save the People portfolio role
		peoplePortfolioRoleObj.save(function() {
			// Try deleting People portfolio role
			request(app).delete('/people-portfolio-roles/' + peoplePortfolioRoleObj._id)
			.expect(401)
			.end(function(peoplePortfolioRoleDeleteErr, peoplePortfolioRoleDeleteRes) {
				// Set message assertion
				(peoplePortfolioRoleDeleteRes.body.message).should.match('User is not logged in');

				// Handle People portfolio role error error
				done(peoplePortfolioRoleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PeoplePortfolioRole.remove().exec();
		done();
	});
});
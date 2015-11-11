'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	IssuePriority = mongoose.model('IssuePriority'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, issuePriority;

/**
 * Issue priority routes tests
 */
describe('Issue priority CRUD tests', function() {
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

		// Save a user to the test db and create new Issue priority
		user.save(function() {
			issuePriority = {
				name: 'Issue priority Name'
			};

			done();
		});
	});

	it('should be able to save Issue priority instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue priority
				agent.post('/issue-priorities')
					.send(issuePriority)
					.expect(200)
					.end(function(issuePrioritySaveErr, issuePrioritySaveRes) {
						// Handle Issue priority save error
						if (issuePrioritySaveErr) done(issuePrioritySaveErr);

						// Get a list of Issue priorities
						agent.get('/issue-priorities')
							.end(function(issuePrioritiesGetErr, issuePrioritiesGetRes) {
								// Handle Issue priority save error
								if (issuePrioritiesGetErr) done(issuePrioritiesGetErr);

								// Get Issue priorities list
								var issuePriorities = issuePrioritiesGetRes.body;

								// Set assertions
								(issuePriorities[0].user._id).should.equal(userId);
								(issuePriorities[0].name).should.match('Issue priority Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Issue priority instance if not logged in', function(done) {
		agent.post('/issue-priorities')
			.send(issuePriority)
			.expect(401)
			.end(function(issuePrioritySaveErr, issuePrioritySaveRes) {
				// Call the assertion callback
				done(issuePrioritySaveErr);
			});
	});

	it('should not be able to save Issue priority instance if no name is provided', function(done) {
		// Invalidate name field
		issuePriority.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue priority
				agent.post('/issue-priorities')
					.send(issuePriority)
					.expect(400)
					.end(function(issuePrioritySaveErr, issuePrioritySaveRes) {
						// Set message assertion
						(issuePrioritySaveRes.body.message).should.match('Please fill Issue priority name');
						
						// Handle Issue priority save error
						done(issuePrioritySaveErr);
					});
			});
	});

	it('should be able to update Issue priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue priority
				agent.post('/issue-priorities')
					.send(issuePriority)
					.expect(200)
					.end(function(issuePrioritySaveErr, issuePrioritySaveRes) {
						// Handle Issue priority save error
						if (issuePrioritySaveErr) done(issuePrioritySaveErr);

						// Update Issue priority name
						issuePriority.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Issue priority
						agent.put('/issue-priorities/' + issuePrioritySaveRes.body._id)
							.send(issuePriority)
							.expect(200)
							.end(function(issuePriorityUpdateErr, issuePriorityUpdateRes) {
								// Handle Issue priority update error
								if (issuePriorityUpdateErr) done(issuePriorityUpdateErr);

								// Set assertions
								(issuePriorityUpdateRes.body._id).should.equal(issuePrioritySaveRes.body._id);
								(issuePriorityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Issue priorities if not signed in', function(done) {
		// Create new Issue priority model instance
		var issuePriorityObj = new IssuePriority(issuePriority);

		// Save the Issue priority
		issuePriorityObj.save(function() {
			// Request Issue priorities
			request(app).get('/issue-priorities')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Issue priority if not signed in', function(done) {
		// Create new Issue priority model instance
		var issuePriorityObj = new IssuePriority(issuePriority);

		// Save the Issue priority
		issuePriorityObj.save(function() {
			request(app).get('/issue-priorities/' + issuePriorityObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', issuePriority.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Issue priority instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Issue priority
				agent.post('/issue-priorities')
					.send(issuePriority)
					.expect(200)
					.end(function(issuePrioritySaveErr, issuePrioritySaveRes) {
						// Handle Issue priority save error
						if (issuePrioritySaveErr) done(issuePrioritySaveErr);

						// Delete existing Issue priority
						agent.delete('/issue-priorities/' + issuePrioritySaveRes.body._id)
							.send(issuePriority)
							.expect(200)
							.end(function(issuePriorityDeleteErr, issuePriorityDeleteRes) {
								// Handle Issue priority error error
								if (issuePriorityDeleteErr) done(issuePriorityDeleteErr);

								// Set assertions
								(issuePriorityDeleteRes.body._id).should.equal(issuePrioritySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Issue priority instance if not signed in', function(done) {
		// Set Issue priority user 
		issuePriority.user = user;

		// Create new Issue priority model instance
		var issuePriorityObj = new IssuePriority(issuePriority);

		// Save the Issue priority
		issuePriorityObj.save(function() {
			// Try deleting Issue priority
			request(app).delete('/issue-priorities/' + issuePriorityObj._id)
			.expect(401)
			.end(function(issuePriorityDeleteErr, issuePriorityDeleteRes) {
				// Set message assertion
				(issuePriorityDeleteRes.body.message).should.match('User is not logged in');

				// Handle Issue priority error error
				done(issuePriorityDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		IssuePriority.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SelectionCombination = mongoose.model('SelectionCombination'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, selectionCombination;

/**
 * Selection combination routes tests
 */
describe('Selection combination CRUD tests', function() {
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

		// Save a user to the test db and create new Selection combination
		user.save(function() {
			selectionCombination = {
				name: 'Selection combination Name'
			};

			done();
		});
	});

	it('should be able to save Selection combination instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection combination
				agent.post('/selection-combinations')
					.send(selectionCombination)
					.expect(200)
					.end(function(selectionCombinationSaveErr, selectionCombinationSaveRes) {
						// Handle Selection combination save error
						if (selectionCombinationSaveErr) done(selectionCombinationSaveErr);

						// Get a list of Selection combinations
						agent.get('/selection-combinations')
							.end(function(selectionCombinationsGetErr, selectionCombinationsGetRes) {
								// Handle Selection combination save error
								if (selectionCombinationsGetErr) done(selectionCombinationsGetErr);

								// Get Selection combinations list
								var selectionCombinations = selectionCombinationsGetRes.body;

								// Set assertions
								(selectionCombinations[0].user._id).should.equal(userId);
								(selectionCombinations[0].name).should.match('Selection combination Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Selection combination instance if not logged in', function(done) {
		agent.post('/selection-combinations')
			.send(selectionCombination)
			.expect(401)
			.end(function(selectionCombinationSaveErr, selectionCombinationSaveRes) {
				// Call the assertion callback
				done(selectionCombinationSaveErr);
			});
	});

	it('should not be able to save Selection combination instance if no name is provided', function(done) {
		// Invalidate name field
		selectionCombination.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection combination
				agent.post('/selection-combinations')
					.send(selectionCombination)
					.expect(400)
					.end(function(selectionCombinationSaveErr, selectionCombinationSaveRes) {
						// Set message assertion
						(selectionCombinationSaveRes.body.message).should.match('Please fill Selection combination name');
						
						// Handle Selection combination save error
						done(selectionCombinationSaveErr);
					});
			});
	});

	it('should be able to update Selection combination instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection combination
				agent.post('/selection-combinations')
					.send(selectionCombination)
					.expect(200)
					.end(function(selectionCombinationSaveErr, selectionCombinationSaveRes) {
						// Handle Selection combination save error
						if (selectionCombinationSaveErr) done(selectionCombinationSaveErr);

						// Update Selection combination name
						selectionCombination.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Selection combination
						agent.put('/selection-combinations/' + selectionCombinationSaveRes.body._id)
							.send(selectionCombination)
							.expect(200)
							.end(function(selectionCombinationUpdateErr, selectionCombinationUpdateRes) {
								// Handle Selection combination update error
								if (selectionCombinationUpdateErr) done(selectionCombinationUpdateErr);

								// Set assertions
								(selectionCombinationUpdateRes.body._id).should.equal(selectionCombinationSaveRes.body._id);
								(selectionCombinationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Selection combinations if not signed in', function(done) {
		// Create new Selection combination model instance
		var selectionCombinationObj = new SelectionCombination(selectionCombination);

		// Save the Selection combination
		selectionCombinationObj.save(function() {
			// Request Selection combinations
			request(app).get('/selection-combinations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Selection combination if not signed in', function(done) {
		// Create new Selection combination model instance
		var selectionCombinationObj = new SelectionCombination(selectionCombination);

		// Save the Selection combination
		selectionCombinationObj.save(function() {
			request(app).get('/selection-combinations/' + selectionCombinationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', selectionCombination.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Selection combination instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection combination
				agent.post('/selection-combinations')
					.send(selectionCombination)
					.expect(200)
					.end(function(selectionCombinationSaveErr, selectionCombinationSaveRes) {
						// Handle Selection combination save error
						if (selectionCombinationSaveErr) done(selectionCombinationSaveErr);

						// Delete existing Selection combination
						agent.delete('/selection-combinations/' + selectionCombinationSaveRes.body._id)
							.send(selectionCombination)
							.expect(200)
							.end(function(selectionCombinationDeleteErr, selectionCombinationDeleteRes) {
								// Handle Selection combination error error
								if (selectionCombinationDeleteErr) done(selectionCombinationDeleteErr);

								// Set assertions
								(selectionCombinationDeleteRes.body._id).should.equal(selectionCombinationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Selection combination instance if not signed in', function(done) {
		// Set Selection combination user 
		selectionCombination.user = user;

		// Create new Selection combination model instance
		var selectionCombinationObj = new SelectionCombination(selectionCombination);

		// Save the Selection combination
		selectionCombinationObj.save(function() {
			// Try deleting Selection combination
			request(app).delete('/selection-combinations/' + selectionCombinationObj._id)
			.expect(401)
			.end(function(selectionCombinationDeleteErr, selectionCombinationDeleteRes) {
				// Set message assertion
				(selectionCombinationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Selection combination error error
				done(selectionCombinationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		SelectionCombination.remove().exec();
		done();
	});
});
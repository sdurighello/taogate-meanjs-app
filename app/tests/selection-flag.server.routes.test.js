'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	SelectionFlag = mongoose.model('SelectionFlag'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, selectionFlag;

/**
 * Selection flag routes tests
 */
describe('Selection flag CRUD tests', function() {
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

		// Save a user to the test db and create new Selection flag
		user.save(function() {
			selectionFlag = {
				name: 'Selection flag Name'
			};

			done();
		});
	});

	it('should be able to save Selection flag instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection flag
				agent.post('/selection-flags')
					.send(selectionFlag)
					.expect(200)
					.end(function(selectionFlagSaveErr, selectionFlagSaveRes) {
						// Handle Selection flag save error
						if (selectionFlagSaveErr) done(selectionFlagSaveErr);

						// Get a list of Selection flags
						agent.get('/selection-flags')
							.end(function(selectionFlagsGetErr, selectionFlagsGetRes) {
								// Handle Selection flag save error
								if (selectionFlagsGetErr) done(selectionFlagsGetErr);

								// Get Selection flags list
								var selectionFlags = selectionFlagsGetRes.body;

								// Set assertions
								(selectionFlags[0].user._id).should.equal(userId);
								(selectionFlags[0].name).should.match('Selection flag Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Selection flag instance if not logged in', function(done) {
		agent.post('/selection-flags')
			.send(selectionFlag)
			.expect(401)
			.end(function(selectionFlagSaveErr, selectionFlagSaveRes) {
				// Call the assertion callback
				done(selectionFlagSaveErr);
			});
	});

	it('should not be able to save Selection flag instance if no name is provided', function(done) {
		// Invalidate name field
		selectionFlag.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection flag
				agent.post('/selection-flags')
					.send(selectionFlag)
					.expect(400)
					.end(function(selectionFlagSaveErr, selectionFlagSaveRes) {
						// Set message assertion
						(selectionFlagSaveRes.body.message).should.match('Please fill Selection flag name');
						
						// Handle Selection flag save error
						done(selectionFlagSaveErr);
					});
			});
	});

	it('should be able to update Selection flag instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection flag
				agent.post('/selection-flags')
					.send(selectionFlag)
					.expect(200)
					.end(function(selectionFlagSaveErr, selectionFlagSaveRes) {
						// Handle Selection flag save error
						if (selectionFlagSaveErr) done(selectionFlagSaveErr);

						// Update Selection flag name
						selectionFlag.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Selection flag
						agent.put('/selection-flags/' + selectionFlagSaveRes.body._id)
							.send(selectionFlag)
							.expect(200)
							.end(function(selectionFlagUpdateErr, selectionFlagUpdateRes) {
								// Handle Selection flag update error
								if (selectionFlagUpdateErr) done(selectionFlagUpdateErr);

								// Set assertions
								(selectionFlagUpdateRes.body._id).should.equal(selectionFlagSaveRes.body._id);
								(selectionFlagUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Selection flags if not signed in', function(done) {
		// Create new Selection flag model instance
		var selectionFlagObj = new SelectionFlag(selectionFlag);

		// Save the Selection flag
		selectionFlagObj.save(function() {
			// Request Selection flags
			request(app).get('/selection-flags')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Selection flag if not signed in', function(done) {
		// Create new Selection flag model instance
		var selectionFlagObj = new SelectionFlag(selectionFlag);

		// Save the Selection flag
		selectionFlagObj.save(function() {
			request(app).get('/selection-flags/' + selectionFlagObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', selectionFlag.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Selection flag instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Selection flag
				agent.post('/selection-flags')
					.send(selectionFlag)
					.expect(200)
					.end(function(selectionFlagSaveErr, selectionFlagSaveRes) {
						// Handle Selection flag save error
						if (selectionFlagSaveErr) done(selectionFlagSaveErr);

						// Delete existing Selection flag
						agent.delete('/selection-flags/' + selectionFlagSaveRes.body._id)
							.send(selectionFlag)
							.expect(200)
							.end(function(selectionFlagDeleteErr, selectionFlagDeleteRes) {
								// Handle Selection flag error error
								if (selectionFlagDeleteErr) done(selectionFlagDeleteErr);

								// Set assertions
								(selectionFlagDeleteRes.body._id).should.equal(selectionFlagSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Selection flag instance if not signed in', function(done) {
		// Set Selection flag user 
		selectionFlag.user = user;

		// Create new Selection flag model instance
		var selectionFlagObj = new SelectionFlag(selectionFlag);

		// Save the Selection flag
		selectionFlagObj.save(function() {
			// Try deleting Selection flag
			request(app).delete('/selection-flags/' + selectionFlagObj._id)
			.expect(401)
			.end(function(selectionFlagDeleteErr, selectionFlagDeleteRes) {
				// Set message assertion
				(selectionFlagDeleteRes.body.message).should.match('User is not logged in');

				// Handle Selection flag error error
				done(selectionFlagDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		SelectionFlag.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MaturityModel = mongoose.model('MaturityModel'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, maturityModel;

/**
 * Maturity model routes tests
 */
describe('Maturity model CRUD tests', function() {
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

		// Save a user to the test db and create new Maturity model
		user.save(function() {
			maturityModel = {
				name: 'Maturity model Name'
			};

			done();
		});
	});

	it('should be able to save Maturity model instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maturity model
				agent.post('/maturity-models')
					.send(maturityModel)
					.expect(200)
					.end(function(maturityModelSaveErr, maturityModelSaveRes) {
						// Handle Maturity model save error
						if (maturityModelSaveErr) done(maturityModelSaveErr);

						// Get a list of Maturity models
						agent.get('/maturity-models')
							.end(function(maturityModelsGetErr, maturityModelsGetRes) {
								// Handle Maturity model save error
								if (maturityModelsGetErr) done(maturityModelsGetErr);

								// Get Maturity models list
								var maturityModels = maturityModelsGetRes.body;

								// Set assertions
								(maturityModels[0].user._id).should.equal(userId);
								(maturityModels[0].name).should.match('Maturity model Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Maturity model instance if not logged in', function(done) {
		agent.post('/maturity-models')
			.send(maturityModel)
			.expect(401)
			.end(function(maturityModelSaveErr, maturityModelSaveRes) {
				// Call the assertion callback
				done(maturityModelSaveErr);
			});
	});

	it('should not be able to save Maturity model instance if no name is provided', function(done) {
		// Invalidate name field
		maturityModel.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maturity model
				agent.post('/maturity-models')
					.send(maturityModel)
					.expect(400)
					.end(function(maturityModelSaveErr, maturityModelSaveRes) {
						// Set message assertion
						(maturityModelSaveRes.body.message).should.match('Please fill Maturity model name');
						
						// Handle Maturity model save error
						done(maturityModelSaveErr);
					});
			});
	});

	it('should be able to update Maturity model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maturity model
				agent.post('/maturity-models')
					.send(maturityModel)
					.expect(200)
					.end(function(maturityModelSaveErr, maturityModelSaveRes) {
						// Handle Maturity model save error
						if (maturityModelSaveErr) done(maturityModelSaveErr);

						// Update Maturity model name
						maturityModel.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Maturity model
						agent.put('/maturity-models/' + maturityModelSaveRes.body._id)
							.send(maturityModel)
							.expect(200)
							.end(function(maturityModelUpdateErr, maturityModelUpdateRes) {
								// Handle Maturity model update error
								if (maturityModelUpdateErr) done(maturityModelUpdateErr);

								// Set assertions
								(maturityModelUpdateRes.body._id).should.equal(maturityModelSaveRes.body._id);
								(maturityModelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Maturity models if not signed in', function(done) {
		// Create new Maturity model model instance
		var maturityModelObj = new MaturityModel(maturityModel);

		// Save the Maturity model
		maturityModelObj.save(function() {
			// Request Maturity models
			request(app).get('/maturity-models')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Maturity model if not signed in', function(done) {
		// Create new Maturity model model instance
		var maturityModelObj = new MaturityModel(maturityModel);

		// Save the Maturity model
		maturityModelObj.save(function() {
			request(app).get('/maturity-models/' + maturityModelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', maturityModel.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Maturity model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Maturity model
				agent.post('/maturity-models')
					.send(maturityModel)
					.expect(200)
					.end(function(maturityModelSaveErr, maturityModelSaveRes) {
						// Handle Maturity model save error
						if (maturityModelSaveErr) done(maturityModelSaveErr);

						// Delete existing Maturity model
						agent.delete('/maturity-models/' + maturityModelSaveRes.body._id)
							.send(maturityModel)
							.expect(200)
							.end(function(maturityModelDeleteErr, maturityModelDeleteRes) {
								// Handle Maturity model error error
								if (maturityModelDeleteErr) done(maturityModelDeleteErr);

								// Set assertions
								(maturityModelDeleteRes.body._id).should.equal(maturityModelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Maturity model instance if not signed in', function(done) {
		// Set Maturity model user 
		maturityModel.user = user;

		// Create new Maturity model model instance
		var maturityModelObj = new MaturityModel(maturityModel);

		// Save the Maturity model
		maturityModelObj.save(function() {
			// Try deleting Maturity model
			request(app).delete('/maturity-models/' + maturityModelObj._id)
			.expect(401)
			.end(function(maturityModelDeleteErr, maturityModelDeleteRes) {
				// Set message assertion
				(maturityModelDeleteRes.body.message).should.match('User is not logged in');

				// Handle Maturity model error error
				done(maturityModelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		MaturityModel.remove().exec();
		done();
	});
});
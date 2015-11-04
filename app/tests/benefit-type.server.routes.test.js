'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	BenefitType = mongoose.model('BenefitType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, benefitType;

/**
 * Benefit type routes tests
 */
describe('Benefit type CRUD tests', function() {
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

		// Save a user to the test db and create new Benefit type
		user.save(function() {
			benefitType = {
				name: 'Benefit type Name'
			};

			done();
		});
	});

	it('should be able to save Benefit type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Benefit type
				agent.post('/benefit-types')
					.send(benefitType)
					.expect(200)
					.end(function(benefitTypeSaveErr, benefitTypeSaveRes) {
						// Handle Benefit type save error
						if (benefitTypeSaveErr) done(benefitTypeSaveErr);

						// Get a list of Benefit types
						agent.get('/benefit-types')
							.end(function(benefitTypesGetErr, benefitTypesGetRes) {
								// Handle Benefit type save error
								if (benefitTypesGetErr) done(benefitTypesGetErr);

								// Get Benefit types list
								var benefitTypes = benefitTypesGetRes.body;

								// Set assertions
								(benefitTypes[0].user._id).should.equal(userId);
								(benefitTypes[0].name).should.match('Benefit type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Benefit type instance if not logged in', function(done) {
		agent.post('/benefit-types')
			.send(benefitType)
			.expect(401)
			.end(function(benefitTypeSaveErr, benefitTypeSaveRes) {
				// Call the assertion callback
				done(benefitTypeSaveErr);
			});
	});

	it('should not be able to save Benefit type instance if no name is provided', function(done) {
		// Invalidate name field
		benefitType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Benefit type
				agent.post('/benefit-types')
					.send(benefitType)
					.expect(400)
					.end(function(benefitTypeSaveErr, benefitTypeSaveRes) {
						// Set message assertion
						(benefitTypeSaveRes.body.message).should.match('Please fill Benefit type name');
						
						// Handle Benefit type save error
						done(benefitTypeSaveErr);
					});
			});
	});

	it('should be able to update Benefit type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Benefit type
				agent.post('/benefit-types')
					.send(benefitType)
					.expect(200)
					.end(function(benefitTypeSaveErr, benefitTypeSaveRes) {
						// Handle Benefit type save error
						if (benefitTypeSaveErr) done(benefitTypeSaveErr);

						// Update Benefit type name
						benefitType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Benefit type
						agent.put('/benefit-types/' + benefitTypeSaveRes.body._id)
							.send(benefitType)
							.expect(200)
							.end(function(benefitTypeUpdateErr, benefitTypeUpdateRes) {
								// Handle Benefit type update error
								if (benefitTypeUpdateErr) done(benefitTypeUpdateErr);

								// Set assertions
								(benefitTypeUpdateRes.body._id).should.equal(benefitTypeSaveRes.body._id);
								(benefitTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Benefit types if not signed in', function(done) {
		// Create new Benefit type model instance
		var benefitTypeObj = new BenefitType(benefitType);

		// Save the Benefit type
		benefitTypeObj.save(function() {
			// Request Benefit types
			request(app).get('/benefit-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Benefit type if not signed in', function(done) {
		// Create new Benefit type model instance
		var benefitTypeObj = new BenefitType(benefitType);

		// Save the Benefit type
		benefitTypeObj.save(function() {
			request(app).get('/benefit-types/' + benefitTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', benefitType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Benefit type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Benefit type
				agent.post('/benefit-types')
					.send(benefitType)
					.expect(200)
					.end(function(benefitTypeSaveErr, benefitTypeSaveRes) {
						// Handle Benefit type save error
						if (benefitTypeSaveErr) done(benefitTypeSaveErr);

						// Delete existing Benefit type
						agent.delete('/benefit-types/' + benefitTypeSaveRes.body._id)
							.send(benefitType)
							.expect(200)
							.end(function(benefitTypeDeleteErr, benefitTypeDeleteRes) {
								// Handle Benefit type error error
								if (benefitTypeDeleteErr) done(benefitTypeDeleteErr);

								// Set assertions
								(benefitTypeDeleteRes.body._id).should.equal(benefitTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Benefit type instance if not signed in', function(done) {
		// Set Benefit type user 
		benefitType.user = user;

		// Create new Benefit type model instance
		var benefitTypeObj = new BenefitType(benefitType);

		// Save the Benefit type
		benefitTypeObj.save(function() {
			// Try deleting Benefit type
			request(app).delete('/benefit-types/' + benefitTypeObj._id)
			.expect(401)
			.end(function(benefitTypeDeleteErr, benefitTypeDeleteRes) {
				// Set message assertion
				(benefitTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Benefit type error error
				done(benefitTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		BenefitType.remove().exec();
		done();
	});
});
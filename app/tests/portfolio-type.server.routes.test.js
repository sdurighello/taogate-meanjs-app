'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioType = mongoose.model('PortfolioType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioType;

/**
 * Portfolio type routes tests
 */
describe('Portfolio type CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio type
		user.save(function() {
			portfolioType = {
				name: 'Portfolio type Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio type
				agent.post('/portfolio-types')
					.send(portfolioType)
					.expect(200)
					.end(function(portfolioTypeSaveErr, portfolioTypeSaveRes) {
						// Handle Portfolio type save error
						if (portfolioTypeSaveErr) done(portfolioTypeSaveErr);

						// Get a list of Portfolio types
						agent.get('/portfolio-types')
							.end(function(portfolioTypesGetErr, portfolioTypesGetRes) {
								// Handle Portfolio type save error
								if (portfolioTypesGetErr) done(portfolioTypesGetErr);

								// Get Portfolio types list
								var portfolioTypes = portfolioTypesGetRes.body;

								// Set assertions
								(portfolioTypes[0].user._id).should.equal(userId);
								(portfolioTypes[0].name).should.match('Portfolio type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio type instance if not logged in', function(done) {
		agent.post('/portfolio-types')
			.send(portfolioType)
			.expect(401)
			.end(function(portfolioTypeSaveErr, portfolioTypeSaveRes) {
				// Call the assertion callback
				done(portfolioTypeSaveErr);
			});
	});

	it('should not be able to save Portfolio type instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio type
				agent.post('/portfolio-types')
					.send(portfolioType)
					.expect(400)
					.end(function(portfolioTypeSaveErr, portfolioTypeSaveRes) {
						// Set message assertion
						(portfolioTypeSaveRes.body.message).should.match('Please fill Portfolio type name');
						
						// Handle Portfolio type save error
						done(portfolioTypeSaveErr);
					});
			});
	});

	it('should be able to update Portfolio type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio type
				agent.post('/portfolio-types')
					.send(portfolioType)
					.expect(200)
					.end(function(portfolioTypeSaveErr, portfolioTypeSaveRes) {
						// Handle Portfolio type save error
						if (portfolioTypeSaveErr) done(portfolioTypeSaveErr);

						// Update Portfolio type name
						portfolioType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio type
						agent.put('/portfolio-types/' + portfolioTypeSaveRes.body._id)
							.send(portfolioType)
							.expect(200)
							.end(function(portfolioTypeUpdateErr, portfolioTypeUpdateRes) {
								// Handle Portfolio type update error
								if (portfolioTypeUpdateErr) done(portfolioTypeUpdateErr);

								// Set assertions
								(portfolioTypeUpdateRes.body._id).should.equal(portfolioTypeSaveRes.body._id);
								(portfolioTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio types if not signed in', function(done) {
		// Create new Portfolio type model instance
		var portfolioTypeObj = new PortfolioType(portfolioType);

		// Save the Portfolio type
		portfolioTypeObj.save(function() {
			// Request Portfolio types
			request(app).get('/portfolio-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio type if not signed in', function(done) {
		// Create new Portfolio type model instance
		var portfolioTypeObj = new PortfolioType(portfolioType);

		// Save the Portfolio type
		portfolioTypeObj.save(function() {
			request(app).get('/portfolio-types/' + portfolioTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio type
				agent.post('/portfolio-types')
					.send(portfolioType)
					.expect(200)
					.end(function(portfolioTypeSaveErr, portfolioTypeSaveRes) {
						// Handle Portfolio type save error
						if (portfolioTypeSaveErr) done(portfolioTypeSaveErr);

						// Delete existing Portfolio type
						agent.delete('/portfolio-types/' + portfolioTypeSaveRes.body._id)
							.send(portfolioType)
							.expect(200)
							.end(function(portfolioTypeDeleteErr, portfolioTypeDeleteRes) {
								// Handle Portfolio type error error
								if (portfolioTypeDeleteErr) done(portfolioTypeDeleteErr);

								// Set assertions
								(portfolioTypeDeleteRes.body._id).should.equal(portfolioTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio type instance if not signed in', function(done) {
		// Set Portfolio type user 
		portfolioType.user = user;

		// Create new Portfolio type model instance
		var portfolioTypeObj = new PortfolioType(portfolioType);

		// Save the Portfolio type
		portfolioTypeObj.save(function() {
			// Try deleting Portfolio type
			request(app).delete('/portfolio-types/' + portfolioTypeObj._id)
			.expect(401)
			.end(function(portfolioTypeDeleteErr, portfolioTypeDeleteRes) {
				// Set message assertion
				(portfolioTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio type error error
				done(portfolioTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioType.remove().exec();
		done();
	});
});
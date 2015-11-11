'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioMilestoneType = mongoose.model('PortfolioMilestoneType'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioMilestoneType;

/**
 * Portfolio milestone type routes tests
 */
describe('Portfolio milestone type CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio milestone type
		user.save(function() {
			portfolioMilestoneType = {
				name: 'Portfolio milestone type Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio milestone type instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone type
				agent.post('/portfolio-milestone-types')
					.send(portfolioMilestoneType)
					.expect(200)
					.end(function(portfolioMilestoneTypeSaveErr, portfolioMilestoneTypeSaveRes) {
						// Handle Portfolio milestone type save error
						if (portfolioMilestoneTypeSaveErr) done(portfolioMilestoneTypeSaveErr);

						// Get a list of Portfolio milestone types
						agent.get('/portfolio-milestone-types')
							.end(function(portfolioMilestoneTypesGetErr, portfolioMilestoneTypesGetRes) {
								// Handle Portfolio milestone type save error
								if (portfolioMilestoneTypesGetErr) done(portfolioMilestoneTypesGetErr);

								// Get Portfolio milestone types list
								var portfolioMilestoneTypes = portfolioMilestoneTypesGetRes.body;

								// Set assertions
								(portfolioMilestoneTypes[0].user._id).should.equal(userId);
								(portfolioMilestoneTypes[0].name).should.match('Portfolio milestone type Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio milestone type instance if not logged in', function(done) {
		agent.post('/portfolio-milestone-types')
			.send(portfolioMilestoneType)
			.expect(401)
			.end(function(portfolioMilestoneTypeSaveErr, portfolioMilestoneTypeSaveRes) {
				// Call the assertion callback
				done(portfolioMilestoneTypeSaveErr);
			});
	});

	it('should not be able to save Portfolio milestone type instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioMilestoneType.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone type
				agent.post('/portfolio-milestone-types')
					.send(portfolioMilestoneType)
					.expect(400)
					.end(function(portfolioMilestoneTypeSaveErr, portfolioMilestoneTypeSaveRes) {
						// Set message assertion
						(portfolioMilestoneTypeSaveRes.body.message).should.match('Please fill Portfolio milestone type name');
						
						// Handle Portfolio milestone type save error
						done(portfolioMilestoneTypeSaveErr);
					});
			});
	});

	it('should be able to update Portfolio milestone type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone type
				agent.post('/portfolio-milestone-types')
					.send(portfolioMilestoneType)
					.expect(200)
					.end(function(portfolioMilestoneTypeSaveErr, portfolioMilestoneTypeSaveRes) {
						// Handle Portfolio milestone type save error
						if (portfolioMilestoneTypeSaveErr) done(portfolioMilestoneTypeSaveErr);

						// Update Portfolio milestone type name
						portfolioMilestoneType.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio milestone type
						agent.put('/portfolio-milestone-types/' + portfolioMilestoneTypeSaveRes.body._id)
							.send(portfolioMilestoneType)
							.expect(200)
							.end(function(portfolioMilestoneTypeUpdateErr, portfolioMilestoneTypeUpdateRes) {
								// Handle Portfolio milestone type update error
								if (portfolioMilestoneTypeUpdateErr) done(portfolioMilestoneTypeUpdateErr);

								// Set assertions
								(portfolioMilestoneTypeUpdateRes.body._id).should.equal(portfolioMilestoneTypeSaveRes.body._id);
								(portfolioMilestoneTypeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio milestone types if not signed in', function(done) {
		// Create new Portfolio milestone type model instance
		var portfolioMilestoneTypeObj = new PortfolioMilestoneType(portfolioMilestoneType);

		// Save the Portfolio milestone type
		portfolioMilestoneTypeObj.save(function() {
			// Request Portfolio milestone types
			request(app).get('/portfolio-milestone-types')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio milestone type if not signed in', function(done) {
		// Create new Portfolio milestone type model instance
		var portfolioMilestoneTypeObj = new PortfolioMilestoneType(portfolioMilestoneType);

		// Save the Portfolio milestone type
		portfolioMilestoneTypeObj.save(function() {
			request(app).get('/portfolio-milestone-types/' + portfolioMilestoneTypeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioMilestoneType.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio milestone type instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone type
				agent.post('/portfolio-milestone-types')
					.send(portfolioMilestoneType)
					.expect(200)
					.end(function(portfolioMilestoneTypeSaveErr, portfolioMilestoneTypeSaveRes) {
						// Handle Portfolio milestone type save error
						if (portfolioMilestoneTypeSaveErr) done(portfolioMilestoneTypeSaveErr);

						// Delete existing Portfolio milestone type
						agent.delete('/portfolio-milestone-types/' + portfolioMilestoneTypeSaveRes.body._id)
							.send(portfolioMilestoneType)
							.expect(200)
							.end(function(portfolioMilestoneTypeDeleteErr, portfolioMilestoneTypeDeleteRes) {
								// Handle Portfolio milestone type error error
								if (portfolioMilestoneTypeDeleteErr) done(portfolioMilestoneTypeDeleteErr);

								// Set assertions
								(portfolioMilestoneTypeDeleteRes.body._id).should.equal(portfolioMilestoneTypeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio milestone type instance if not signed in', function(done) {
		// Set Portfolio milestone type user 
		portfolioMilestoneType.user = user;

		// Create new Portfolio milestone type model instance
		var portfolioMilestoneTypeObj = new PortfolioMilestoneType(portfolioMilestoneType);

		// Save the Portfolio milestone type
		portfolioMilestoneTypeObj.save(function() {
			// Try deleting Portfolio milestone type
			request(app).delete('/portfolio-milestone-types/' + portfolioMilestoneTypeObj._id)
			.expect(401)
			.end(function(portfolioMilestoneTypeDeleteErr, portfolioMilestoneTypeDeleteRes) {
				// Set message assertion
				(portfolioMilestoneTypeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio milestone type error error
				done(portfolioMilestoneTypeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioMilestoneType.remove().exec();
		done();
	});
});
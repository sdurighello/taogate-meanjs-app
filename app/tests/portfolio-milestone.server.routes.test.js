'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioMilestone = mongoose.model('PortfolioMilestone'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioMilestone;

/**
 * Portfolio milestone routes tests
 */
describe('Portfolio milestone CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio milestone
		user.save(function() {
			portfolioMilestone = {
				name: 'Portfolio milestone Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio milestone instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone
				agent.post('/portfolio-milestones')
					.send(portfolioMilestone)
					.expect(200)
					.end(function(portfolioMilestoneSaveErr, portfolioMilestoneSaveRes) {
						// Handle Portfolio milestone save error
						if (portfolioMilestoneSaveErr) done(portfolioMilestoneSaveErr);

						// Get a list of Portfolio milestones
						agent.get('/portfolio-milestones')
							.end(function(portfolioMilestonesGetErr, portfolioMilestonesGetRes) {
								// Handle Portfolio milestone save error
								if (portfolioMilestonesGetErr) done(portfolioMilestonesGetErr);

								// Get Portfolio milestones list
								var portfolioMilestones = portfolioMilestonesGetRes.body;

								// Set assertions
								(portfolioMilestones[0].user._id).should.equal(userId);
								(portfolioMilestones[0].name).should.match('Portfolio milestone Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio milestone instance if not logged in', function(done) {
		agent.post('/portfolio-milestones')
			.send(portfolioMilestone)
			.expect(401)
			.end(function(portfolioMilestoneSaveErr, portfolioMilestoneSaveRes) {
				// Call the assertion callback
				done(portfolioMilestoneSaveErr);
			});
	});

	it('should not be able to save Portfolio milestone instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioMilestone.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone
				agent.post('/portfolio-milestones')
					.send(portfolioMilestone)
					.expect(400)
					.end(function(portfolioMilestoneSaveErr, portfolioMilestoneSaveRes) {
						// Set message assertion
						(portfolioMilestoneSaveRes.body.message).should.match('Please fill Portfolio milestone name');
						
						// Handle Portfolio milestone save error
						done(portfolioMilestoneSaveErr);
					});
			});
	});

	it('should be able to update Portfolio milestone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone
				agent.post('/portfolio-milestones')
					.send(portfolioMilestone)
					.expect(200)
					.end(function(portfolioMilestoneSaveErr, portfolioMilestoneSaveRes) {
						// Handle Portfolio milestone save error
						if (portfolioMilestoneSaveErr) done(portfolioMilestoneSaveErr);

						// Update Portfolio milestone name
						portfolioMilestone.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio milestone
						agent.put('/portfolio-milestones/' + portfolioMilestoneSaveRes.body._id)
							.send(portfolioMilestone)
							.expect(200)
							.end(function(portfolioMilestoneUpdateErr, portfolioMilestoneUpdateRes) {
								// Handle Portfolio milestone update error
								if (portfolioMilestoneUpdateErr) done(portfolioMilestoneUpdateErr);

								// Set assertions
								(portfolioMilestoneUpdateRes.body._id).should.equal(portfolioMilestoneSaveRes.body._id);
								(portfolioMilestoneUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio milestones if not signed in', function(done) {
		// Create new Portfolio milestone model instance
		var portfolioMilestoneObj = new PortfolioMilestone(portfolioMilestone);

		// Save the Portfolio milestone
		portfolioMilestoneObj.save(function() {
			// Request Portfolio milestones
			request(app).get('/portfolio-milestones')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio milestone if not signed in', function(done) {
		// Create new Portfolio milestone model instance
		var portfolioMilestoneObj = new PortfolioMilestone(portfolioMilestone);

		// Save the Portfolio milestone
		portfolioMilestoneObj.save(function() {
			request(app).get('/portfolio-milestones/' + portfolioMilestoneObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioMilestone.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio milestone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio milestone
				agent.post('/portfolio-milestones')
					.send(portfolioMilestone)
					.expect(200)
					.end(function(portfolioMilestoneSaveErr, portfolioMilestoneSaveRes) {
						// Handle Portfolio milestone save error
						if (portfolioMilestoneSaveErr) done(portfolioMilestoneSaveErr);

						// Delete existing Portfolio milestone
						agent.delete('/portfolio-milestones/' + portfolioMilestoneSaveRes.body._id)
							.send(portfolioMilestone)
							.expect(200)
							.end(function(portfolioMilestoneDeleteErr, portfolioMilestoneDeleteRes) {
								// Handle Portfolio milestone error error
								if (portfolioMilestoneDeleteErr) done(portfolioMilestoneDeleteErr);

								// Set assertions
								(portfolioMilestoneDeleteRes.body._id).should.equal(portfolioMilestoneSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio milestone instance if not signed in', function(done) {
		// Set Portfolio milestone user 
		portfolioMilestone.user = user;

		// Create new Portfolio milestone model instance
		var portfolioMilestoneObj = new PortfolioMilestone(portfolioMilestone);

		// Save the Portfolio milestone
		portfolioMilestoneObj.save(function() {
			// Try deleting Portfolio milestone
			request(app).delete('/portfolio-milestones/' + portfolioMilestoneObj._id)
			.expect(401)
			.end(function(portfolioMilestoneDeleteErr, portfolioMilestoneDeleteRes) {
				// Set message assertion
				(portfolioMilestoneDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio milestone error error
				done(portfolioMilestoneDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioMilestone.remove().exec();
		done();
	});
});
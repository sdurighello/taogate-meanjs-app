'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioReviewTemplate = mongoose.model('PortfolioReviewTemplate'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioReviewTemplate;

/**
 * Portfolio review template routes tests
 */
describe('Portfolio review template CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio review template
		user.save(function() {
			portfolioReviewTemplate = {
				name: 'Portfolio review template Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio review template instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review template
				agent.post('/portfolio-review-templates')
					.send(portfolioReviewTemplate)
					.expect(200)
					.end(function(portfolioReviewTemplateSaveErr, portfolioReviewTemplateSaveRes) {
						// Handle Portfolio review template save error
						if (portfolioReviewTemplateSaveErr) done(portfolioReviewTemplateSaveErr);

						// Get a list of Portfolio review templates
						agent.get('/portfolio-review-templates')
							.end(function(portfolioReviewTemplatesGetErr, portfolioReviewTemplatesGetRes) {
								// Handle Portfolio review template save error
								if (portfolioReviewTemplatesGetErr) done(portfolioReviewTemplatesGetErr);

								// Get Portfolio review templates list
								var portfolioReviewTemplates = portfolioReviewTemplatesGetRes.body;

								// Set assertions
								(portfolioReviewTemplates[0].user._id).should.equal(userId);
								(portfolioReviewTemplates[0].name).should.match('Portfolio review template Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio review template instance if not logged in', function(done) {
		agent.post('/portfolio-review-templates')
			.send(portfolioReviewTemplate)
			.expect(401)
			.end(function(portfolioReviewTemplateSaveErr, portfolioReviewTemplateSaveRes) {
				// Call the assertion callback
				done(portfolioReviewTemplateSaveErr);
			});
	});

	it('should not be able to save Portfolio review template instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioReviewTemplate.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review template
				agent.post('/portfolio-review-templates')
					.send(portfolioReviewTemplate)
					.expect(400)
					.end(function(portfolioReviewTemplateSaveErr, portfolioReviewTemplateSaveRes) {
						// Set message assertion
						(portfolioReviewTemplateSaveRes.body.message).should.match('Please fill Portfolio review template name');
						
						// Handle Portfolio review template save error
						done(portfolioReviewTemplateSaveErr);
					});
			});
	});

	it('should be able to update Portfolio review template instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review template
				agent.post('/portfolio-review-templates')
					.send(portfolioReviewTemplate)
					.expect(200)
					.end(function(portfolioReviewTemplateSaveErr, portfolioReviewTemplateSaveRes) {
						// Handle Portfolio review template save error
						if (portfolioReviewTemplateSaveErr) done(portfolioReviewTemplateSaveErr);

						// Update Portfolio review template name
						portfolioReviewTemplate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio review template
						agent.put('/portfolio-review-templates/' + portfolioReviewTemplateSaveRes.body._id)
							.send(portfolioReviewTemplate)
							.expect(200)
							.end(function(portfolioReviewTemplateUpdateErr, portfolioReviewTemplateUpdateRes) {
								// Handle Portfolio review template update error
								if (portfolioReviewTemplateUpdateErr) done(portfolioReviewTemplateUpdateErr);

								// Set assertions
								(portfolioReviewTemplateUpdateRes.body._id).should.equal(portfolioReviewTemplateSaveRes.body._id);
								(portfolioReviewTemplateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio review templates if not signed in', function(done) {
		// Create new Portfolio review template model instance
		var portfolioReviewTemplateObj = new PortfolioReviewTemplate(portfolioReviewTemplate);

		// Save the Portfolio review template
		portfolioReviewTemplateObj.save(function() {
			// Request Portfolio review templates
			request(app).get('/portfolio-review-templates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio review template if not signed in', function(done) {
		// Create new Portfolio review template model instance
		var portfolioReviewTemplateObj = new PortfolioReviewTemplate(portfolioReviewTemplate);

		// Save the Portfolio review template
		portfolioReviewTemplateObj.save(function() {
			request(app).get('/portfolio-review-templates/' + portfolioReviewTemplateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioReviewTemplate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio review template instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio review template
				agent.post('/portfolio-review-templates')
					.send(portfolioReviewTemplate)
					.expect(200)
					.end(function(portfolioReviewTemplateSaveErr, portfolioReviewTemplateSaveRes) {
						// Handle Portfolio review template save error
						if (portfolioReviewTemplateSaveErr) done(portfolioReviewTemplateSaveErr);

						// Delete existing Portfolio review template
						agent.delete('/portfolio-review-templates/' + portfolioReviewTemplateSaveRes.body._id)
							.send(portfolioReviewTemplate)
							.expect(200)
							.end(function(portfolioReviewTemplateDeleteErr, portfolioReviewTemplateDeleteRes) {
								// Handle Portfolio review template error error
								if (portfolioReviewTemplateDeleteErr) done(portfolioReviewTemplateDeleteErr);

								// Set assertions
								(portfolioReviewTemplateDeleteRes.body._id).should.equal(portfolioReviewTemplateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio review template instance if not signed in', function(done) {
		// Set Portfolio review template user 
		portfolioReviewTemplate.user = user;

		// Create new Portfolio review template model instance
		var portfolioReviewTemplateObj = new PortfolioReviewTemplate(portfolioReviewTemplate);

		// Save the Portfolio review template
		portfolioReviewTemplateObj.save(function() {
			// Try deleting Portfolio review template
			request(app).delete('/portfolio-review-templates/' + portfolioReviewTemplateObj._id)
			.expect(401)
			.end(function(portfolioReviewTemplateDeleteErr, portfolioReviewTemplateDeleteRes) {
				// Set message assertion
				(portfolioReviewTemplateDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio review template error error
				done(portfolioReviewTemplateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioReviewTemplate.remove().exec();
		done();
	});
});
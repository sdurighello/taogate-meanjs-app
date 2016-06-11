'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	PortfolioStatusReport = mongoose.model('PortfolioStatusReport'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, portfolioStatusReport;

/**
 * Portfolio status report routes tests
 */
describe('Portfolio status report CRUD tests', function() {
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

		// Save a user to the test db and create new Portfolio status report
		user.save(function() {
			portfolioStatusReport = {
				name: 'Portfolio status report Name'
			};

			done();
		});
	});

	it('should be able to save Portfolio status report instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status report
				agent.post('/portfolio-status-reports')
					.send(portfolioStatusReport)
					.expect(200)
					.end(function(portfolioStatusReportSaveErr, portfolioStatusReportSaveRes) {
						// Handle Portfolio status report save error
						if (portfolioStatusReportSaveErr) done(portfolioStatusReportSaveErr);

						// Get a list of Portfolio status reports
						agent.get('/portfolio-status-reports')
							.end(function(portfolioStatusReportsGetErr, portfolioStatusReportsGetRes) {
								// Handle Portfolio status report save error
								if (portfolioStatusReportsGetErr) done(portfolioStatusReportsGetErr);

								// Get Portfolio status reports list
								var portfolioStatusReports = portfolioStatusReportsGetRes.body;

								// Set assertions
								(portfolioStatusReports[0].user._id).should.equal(userId);
								(portfolioStatusReports[0].name).should.match('Portfolio status report Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Portfolio status report instance if not logged in', function(done) {
		agent.post('/portfolio-status-reports')
			.send(portfolioStatusReport)
			.expect(401)
			.end(function(portfolioStatusReportSaveErr, portfolioStatusReportSaveRes) {
				// Call the assertion callback
				done(portfolioStatusReportSaveErr);
			});
	});

	it('should not be able to save Portfolio status report instance if no name is provided', function(done) {
		// Invalidate name field
		portfolioStatusReport.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status report
				agent.post('/portfolio-status-reports')
					.send(portfolioStatusReport)
					.expect(400)
					.end(function(portfolioStatusReportSaveErr, portfolioStatusReportSaveRes) {
						// Set message assertion
						(portfolioStatusReportSaveRes.body.message).should.match('Please fill Portfolio status report name');
						
						// Handle Portfolio status report save error
						done(portfolioStatusReportSaveErr);
					});
			});
	});

	it('should be able to update Portfolio status report instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status report
				agent.post('/portfolio-status-reports')
					.send(portfolioStatusReport)
					.expect(200)
					.end(function(portfolioStatusReportSaveErr, portfolioStatusReportSaveRes) {
						// Handle Portfolio status report save error
						if (portfolioStatusReportSaveErr) done(portfolioStatusReportSaveErr);

						// Update Portfolio status report name
						portfolioStatusReport.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Portfolio status report
						agent.put('/portfolio-status-reports/' + portfolioStatusReportSaveRes.body._id)
							.send(portfolioStatusReport)
							.expect(200)
							.end(function(portfolioStatusReportUpdateErr, portfolioStatusReportUpdateRes) {
								// Handle Portfolio status report update error
								if (portfolioStatusReportUpdateErr) done(portfolioStatusReportUpdateErr);

								// Set assertions
								(portfolioStatusReportUpdateRes.body._id).should.equal(portfolioStatusReportSaveRes.body._id);
								(portfolioStatusReportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Portfolio status reports if not signed in', function(done) {
		// Create new Portfolio status report model instance
		var portfolioStatusReportObj = new PortfolioStatusReport(portfolioStatusReport);

		// Save the Portfolio status report
		portfolioStatusReportObj.save(function() {
			// Request Portfolio status reports
			request(app).get('/portfolio-status-reports')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Portfolio status report if not signed in', function(done) {
		// Create new Portfolio status report model instance
		var portfolioStatusReportObj = new PortfolioStatusReport(portfolioStatusReport);

		// Save the Portfolio status report
		portfolioStatusReportObj.save(function() {
			request(app).get('/portfolio-status-reports/' + portfolioStatusReportObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', portfolioStatusReport.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Portfolio status report instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Portfolio status report
				agent.post('/portfolio-status-reports')
					.send(portfolioStatusReport)
					.expect(200)
					.end(function(portfolioStatusReportSaveErr, portfolioStatusReportSaveRes) {
						// Handle Portfolio status report save error
						if (portfolioStatusReportSaveErr) done(portfolioStatusReportSaveErr);

						// Delete existing Portfolio status report
						agent.delete('/portfolio-status-reports/' + portfolioStatusReportSaveRes.body._id)
							.send(portfolioStatusReport)
							.expect(200)
							.end(function(portfolioStatusReportDeleteErr, portfolioStatusReportDeleteRes) {
								// Handle Portfolio status report error error
								if (portfolioStatusReportDeleteErr) done(portfolioStatusReportDeleteErr);

								// Set assertions
								(portfolioStatusReportDeleteRes.body._id).should.equal(portfolioStatusReportSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Portfolio status report instance if not signed in', function(done) {
		// Set Portfolio status report user 
		portfolioStatusReport.user = user;

		// Create new Portfolio status report model instance
		var portfolioStatusReportObj = new PortfolioStatusReport(portfolioStatusReport);

		// Save the Portfolio status report
		portfolioStatusReportObj.save(function() {
			// Try deleting Portfolio status report
			request(app).delete('/portfolio-status-reports/' + portfolioStatusReportObj._id)
			.expect(401)
			.end(function(portfolioStatusReportDeleteErr, portfolioStatusReportDeleteRes) {
				// Set message assertion
				(portfolioStatusReportDeleteRes.body.message).should.match('User is not logged in');

				// Handle Portfolio status report error error
				done(portfolioStatusReportDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		PortfolioStatusReport.remove().exec();
		done();
	});
});
'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ProjectStatusReport = mongoose.model('ProjectStatusReport'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, projectStatusReport;

/**
 * Project status report routes tests
 */
describe('Project status report CRUD tests', function() {
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

		// Save a user to the test db and create new Project status report
		user.save(function() {
			projectStatusReport = {
				name: 'Project status report Name'
			};

			done();
		});
	});

	it('should be able to save Project status report instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status report
				agent.post('/project-status-reports')
					.send(projectStatusReport)
					.expect(200)
					.end(function(projectStatusReportSaveErr, projectStatusReportSaveRes) {
						// Handle Project status report save error
						if (projectStatusReportSaveErr) done(projectStatusReportSaveErr);

						// Get a list of Project status reports
						agent.get('/project-status-reports')
							.end(function(projectStatusReportsGetErr, projectStatusReportsGetRes) {
								// Handle Project status report save error
								if (projectStatusReportsGetErr) done(projectStatusReportsGetErr);

								// Get Project status reports list
								var projectStatusReports = projectStatusReportsGetRes.body;

								// Set assertions
								(projectStatusReports[0].user._id).should.equal(userId);
								(projectStatusReports[0].name).should.match('Project status report Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Project status report instance if not logged in', function(done) {
		agent.post('/project-status-reports')
			.send(projectStatusReport)
			.expect(401)
			.end(function(projectStatusReportSaveErr, projectStatusReportSaveRes) {
				// Call the assertion callback
				done(projectStatusReportSaveErr);
			});
	});

	it('should not be able to save Project status report instance if no name is provided', function(done) {
		// Invalidate name field
		projectStatusReport.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status report
				agent.post('/project-status-reports')
					.send(projectStatusReport)
					.expect(400)
					.end(function(projectStatusReportSaveErr, projectStatusReportSaveRes) {
						// Set message assertion
						(projectStatusReportSaveRes.body.message).should.match('Please fill Project status report name');
						
						// Handle Project status report save error
						done(projectStatusReportSaveErr);
					});
			});
	});

	it('should be able to update Project status report instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status report
				agent.post('/project-status-reports')
					.send(projectStatusReport)
					.expect(200)
					.end(function(projectStatusReportSaveErr, projectStatusReportSaveRes) {
						// Handle Project status report save error
						if (projectStatusReportSaveErr) done(projectStatusReportSaveErr);

						// Update Project status report name
						projectStatusReport.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Project status report
						agent.put('/project-status-reports/' + projectStatusReportSaveRes.body._id)
							.send(projectStatusReport)
							.expect(200)
							.end(function(projectStatusReportUpdateErr, projectStatusReportUpdateRes) {
								// Handle Project status report update error
								if (projectStatusReportUpdateErr) done(projectStatusReportUpdateErr);

								// Set assertions
								(projectStatusReportUpdateRes.body._id).should.equal(projectStatusReportSaveRes.body._id);
								(projectStatusReportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Project status reports if not signed in', function(done) {
		// Create new Project status report model instance
		var projectStatusReportObj = new ProjectStatusReport(projectStatusReport);

		// Save the Project status report
		projectStatusReportObj.save(function() {
			// Request Project status reports
			request(app).get('/project-status-reports')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Project status report if not signed in', function(done) {
		// Create new Project status report model instance
		var projectStatusReportObj = new ProjectStatusReport(projectStatusReport);

		// Save the Project status report
		projectStatusReportObj.save(function() {
			request(app).get('/project-status-reports/' + projectStatusReportObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', projectStatusReport.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Project status report instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Project status report
				agent.post('/project-status-reports')
					.send(projectStatusReport)
					.expect(200)
					.end(function(projectStatusReportSaveErr, projectStatusReportSaveRes) {
						// Handle Project status report save error
						if (projectStatusReportSaveErr) done(projectStatusReportSaveErr);

						// Delete existing Project status report
						agent.delete('/project-status-reports/' + projectStatusReportSaveRes.body._id)
							.send(projectStatusReport)
							.expect(200)
							.end(function(projectStatusReportDeleteErr, projectStatusReportDeleteRes) {
								// Handle Project status report error error
								if (projectStatusReportDeleteErr) done(projectStatusReportDeleteErr);

								// Set assertions
								(projectStatusReportDeleteRes.body._id).should.equal(projectStatusReportSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Project status report instance if not signed in', function(done) {
		// Set Project status report user 
		projectStatusReport.user = user;

		// Create new Project status report model instance
		var projectStatusReportObj = new ProjectStatusReport(projectStatusReport);

		// Save the Project status report
		projectStatusReportObj.save(function() {
			// Try deleting Project status report
			request(app).delete('/project-status-reports/' + projectStatusReportObj._id)
			.expect(401)
			.end(function(projectStatusReportDeleteErr, projectStatusReportDeleteRes) {
				// Set message assertion
				(projectStatusReportDeleteRes.body.message).should.match('User is not logged in');

				// Handle Project status report error error
				done(projectStatusReportDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ProjectStatusReport.remove().exec();
		done();
	});
});
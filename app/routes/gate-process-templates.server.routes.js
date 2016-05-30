'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateProcessTemplates = require('../../app/controllers/gate-process-templates.server.controller');

	// --- PROCESS ---
	app.route('/gate-process-templates')
		.get(users.requiresLogin, gateProcessTemplates.list)
		.post(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.create);

	app.route('/gate-process-templates/:gateProcessTemplateId')
		.get(users.requiresLogin, gateProcessTemplates.read)
		.put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.update)
		.delete(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.delete);

    // --- GATE ---
    app.route('/gate-process-templates/:gateProcessTemplateId/createGate')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.createGate);

    app.route('/gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/updateHeader')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.updateGateHeader);

    app.route('/gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/updatePosition')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.updateGatePosition);

    app.route('/gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/delete')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.deleteGate);

    // --- OUTCOME ---
    app.route('/gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/createOutcome')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.createOutcome);

    app.route('/gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/outcome-templates/:outcomeTemplateId/update')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.updateOutcome);

    app.route('/gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/outcome-templates/:outcomeTemplateId/delete')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.deleteOutcome);

    // --- APPROVAL ---

    app.route('/gate-process-templates/:gateProcessTemplateId/submit')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.submit);

    app.route('/gate-process-templates/:gateProcessTemplateId/approve')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.approve);

    app.route('/gate-process-templates/:gateProcessTemplateId/reject')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.reject);

    app.route('/gate-process-templates/:gateProcessTemplateId/draft')
        .put(users.requiresLogin, gateProcessTemplates.hasAuthorization, gateProcessTemplates.draft);

	// Finish by binding the Gate process template middleware
	app.param('gateProcessTemplateId', gateProcessTemplates.gateProcessTemplateByID);
};

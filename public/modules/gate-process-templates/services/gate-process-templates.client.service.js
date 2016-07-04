'use strict';

//Gate process templates service used to communicate Gate process templates REST endpoints
angular.module('gate-process-templates').factory('GateProcessTemplates', ['$resource',
	function($resource) {
		return $resource('gate-process-templates/:gateProcessTemplateId', { gateProcessTemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            
            // --- Gate ---
            
            createGate: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/createGate'
            },
            updateGateHeader: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/updateHeader'
            },
            updateGatePosition: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/updatePosition'
            },
            deleteGate: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/delete'
            },
            
            // --- Outcome ---
            
            createOutcome: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/createOutcome'
            },
            updateOutcome: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/outcome-templates/:outcomeTemplateId/update'
            },
            deleteOutcome: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/gate-templates/:gateTemplateId/outcome-templates/:outcomeTemplateId/delete'
            },
            
            // --- Approval --

            submit: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/submit'
                // req.body: {whole gate review object}
            },
            approve: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/approve'
                // req.body: {whole gate review object}
            },
            reject: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/reject'
                // req.body: {whole gate review object}
            },
            draft: {
                method: 'PUT',
                url: 'gate-process-templates/:gateProcessTemplateId/draft'
                // req.body: {whole gate review object}
            }
		});
	}
]);

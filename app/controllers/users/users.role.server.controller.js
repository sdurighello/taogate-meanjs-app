'use strict';

/**
 * User roles.
 */

exports.getRoles = function() {
    return [
        {roleString:'admin', roleTitle: 'Administrator'},
        {roleString:'pmo', roleTitle: 'PMO'},
        {roleString: 'projectManager', roleTitle: 'Project Manager'},
        {roleString: 'portfolioManager', roleTitle: 'Portfolio Manager'},
        {roleString: 'executive', roleTitle: 'Executive'}
    ];
};

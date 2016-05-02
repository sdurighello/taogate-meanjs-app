'use strict';

//Roadmaps service used to communicate Roadmaps REST endpoints
angular.module('roadmaps').factory('Roadmaps', ['$resource',
	function($resource) {
        return $resource('roadmaps', {
        }, {
            getDefinitionRoadmap: {
                method: 'GET',
                isArray: true,
                url: 'roadmaps/definition'
            }
        });
	}
]);

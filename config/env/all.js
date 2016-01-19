'use strict';

module.exports = {
	app: {
		title: 'taoApp',
		description: 'Project Portfolio Management',
		keywords: 'Project, Portfolio, Management'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/ng-sortable/dist/ng-sortable.css',
				'public/lib/ng-sortable/dist/ng-sortable.style.css',
				'public/lib/angular-loading-bar/build/loading-bar.css'
			],
			js: [
				'public/lib/lodash/lodash.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/checklist-model/checklist-model.js',
				'public/lib/ng-sortable/dist/ng-sortable.js',
				'public/lib/angular-loading-bar/build/loading-bar.js',
                'public/lib/highcharts/adapters/standalone-frameworks.js',
                'public/lib/highcharts/highcharts.js',
				'public/lib/highcharts-ng/dist/highcharts-ng.js'
            ]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};

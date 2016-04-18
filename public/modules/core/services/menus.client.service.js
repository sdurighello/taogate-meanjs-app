'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');

		// taoPortfolio.com additions for menu
		this.addMenuItem('topbar','My taoPortfolio','mytao','item','mytao',false,['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
		this.addMenuItem('topbar','Admin','admin','dropdown','admin',false,['superAdmin','admin'],1);

		// SETUP
		this.addMenuItem('topbar','Setup','setup','dropdown','setup',false,['superAdmin','admin','pmo'],2);

			// Portfolio Definition
		this.addSubMenuItem('topbar', 'setup', 'Portfolio definition', 'menuTitle','menuTitle',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Strategy nodes
        this.addSubMenuItem('topbar', 'setup', 'Strategy nodes', 'strategy-node-setup','strategy-node-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
        		// Portfolios
		this.addSubMenuItem('topbar', 'setup', 'Portfolios', 'portfolio-setup','portfolio-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
				// Priorities
		this.addSubMenuItem('topbar', 'setup', 'Priorities', 'priority-setup','priority-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
				// Categories
		this.addSubMenuItem('topbar', 'setup', 'Categories', 'category-setup','category-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);

			// Portfolio Evaluation
		this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
		this.addSubMenuItem('topbar', 'setup', 'Portfolio evaluation', 'menuTitle','menuTitle',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
                // Financial analysis
        this.addSubMenuItem('topbar', 'setup', 'Financial analysis', 'financial-analysis-setup','financial-analysis-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
                // Qualitative analysis
        this.addSubMenuItem('topbar', 'setup', 'Qualitative analysis', 'qualitative-analysis-setup','qualitative-analysis-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
                // Risk analysis
        this.addSubMenuItem('topbar', 'setup', 'Risk analysis', 'risk-analysis-setup','risk-analysis-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
				// Dependencies
		this.addSubMenuItem('topbar', 'setup', 'Dependencies', 'dependency-setup','dependency-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Stakeholders
        this.addSubMenuItem('topbar', 'setup', 'Stakeholders', 'people-setup','people-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);

            // Review and Improvement
        this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
        this.addSubMenuItem('topbar', 'setup', 'Review and Improvement', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
                // Review setup
        this.addSubMenuItem('topbar', 'setup', 'Review setup', 'project-review-setup','project-review-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
                // Project Review
        this.addSubMenuItem('topbar', 'setup', 'Project review', 'project-review-templates','project-review-templates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
                // Portfolio Review
        this.addSubMenuItem('topbar', 'setup', 'Portfolio review', 'portfolio-review-templates','portfolio-review-templates',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);
                // Maturity model
        this.addSubMenuItem('topbar', 'setup', 'Maturity model', 'maturity-setup','maturity-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],17);
                // Improvement activities
        this.addSubMenuItem('topbar', 'setup', 'Improvement activity', 'improvement-setup','improvement-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],18);

            // Portfolio Delivery
        this.addSubMenuItem('topbar', 'setup', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],19);
        this.addSubMenuItem('topbar', 'setup', 'Portfolio delivery', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],20);
                // Gate Process
        this.addSubMenuItem('topbar', 'setup', 'Gate process', 'gate-management-setup','gate-management-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],21);
                // Gate Review
        this.addSubMenuItem('topbar', 'setup', 'Gate review', 'gate-review-setup','gate-review-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],22);
                // Issues & Changes
        this.addSubMenuItem('topbar', 'setup', 'Issues & Changes', 'log-delivery-setup','log-delivery-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],23);
                // Milestone log
        this.addSubMenuItem('topbar', 'setup', 'Milestones', 'log-milestone-setup','log-milestone-setup',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],24);
			    // Status Report
		this.addSubMenuItem('topbar', 'setup', 'Status report', 'status-report-setup','status-report-setup',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],25);


        // DEFINITION
		this.addMenuItem('topbar','Definition','definition','dropdown','definition',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
            // Identification
        this.addSubMenuItem('topbar', 'definition', 'Identification', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Projects identification
        this.addSubMenuItem('topbar', 'definition', 'Projects identification', 'project-identification','project-identification',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
                // Strategy alignment
        this.addSubMenuItem('topbar', 'definition', 'Strategy alignment', 'strategy-alignment','strategy-alignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
                // Portfolio assignment
        this.addSubMenuItem('topbar', 'definition', 'Portfolio assignment', 'portfolio-assignment','portfolio-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
            // Categorization
        this.addSubMenuItem('topbar', 'definition', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
        this.addSubMenuItem('topbar', 'definition', 'Categorization', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
                // Category assignment
        this.addSubMenuItem('topbar', 'definition', 'Category assignment', 'category-assignment','category-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
				// Categorization overview
		this.addSubMenuItem('topbar', 'definition', 'Categorization overview', 'categorization-overview','categorization-overview',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
            // Selection
        this.addSubMenuItem('topbar', 'definition', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
        this.addSubMenuItem('topbar', 'definition', 'Selection', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
                // Projects selection
        this.addSubMenuItem('topbar', 'definition', 'Projects selection', 'project-selection','project-selection',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
            // Prioritization
        this.addSubMenuItem('topbar', 'definition', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);
        this.addSubMenuItem('topbar', 'definition', 'Prioritization', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
                // Priorities assignment
        this.addSubMenuItem('topbar', 'definition', 'Priority assignment', 'priority-assignment','priority-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
				// Prioritization overview
		this.addSubMenuItem('topbar', 'definition', 'Prioritization overview', 'prioritization-overview','prioritization-overview',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
                // Portfolio rankings
        this.addSubMenuItem('topbar', 'definition', 'Portfolio rankings', 'portfolio-ranking-assignment','portfolio-ranking-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);



        // EVALUATION
		this.addMenuItem('topbar','Evaluation','evaluation','dropdown','evaluation',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
            // Evaluation profiles
        this.addSubMenuItem('topbar', 'evaluation', 'Evaluation profiles', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Financial
        this.addSubMenuItem('topbar', 'evaluation', 'Financial analysis', 'financial-analysis','financial-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
                // Qualitative
        this.addSubMenuItem('topbar', 'evaluation', 'Qualitative analysis', 'qualitative-analysis','qualitative-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
                // Risk
        this.addSubMenuItem('topbar', 'evaluation', 'Risk analysis', 'risk-analysis','risk-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
                // Evaluation summary
        this.addSubMenuItem('topbar', 'evaluation', 'Evaluation summary', 'portfolio-evaluation-summary','portfolio-evaluation-summary',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
            // Stakeholders
        this.addSubMenuItem('topbar', 'evaluation', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
        this.addSubMenuItem('topbar', 'evaluation', 'Stakeholders', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
                // Project Stakeholders analysis
        this.addSubMenuItem('topbar', 'evaluation', 'Project stakeholders analysis', 'people-project-analysis','people-project-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
                // Portfolio Stakeholders analysis
        this.addSubMenuItem('topbar', 'evaluation', 'Portfolio stakeholders analysis', 'people-portfolio-analysis','people-portfolio-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
            // Review and Improvement
        this.addSubMenuItem('topbar', 'evaluation', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
        this.addSubMenuItem('topbar', 'evaluation', 'Review and Improvement', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Project Reviews
        this.addSubMenuItem('topbar', 'evaluation', 'Project reviews', 'project-reviews','project-reviews',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);
                // Portfolio Reviews
        this.addSubMenuItem('topbar', 'evaluation', 'Portfolio reviews', 'portfolio-reviews','portfolio-reviews',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
                // Maturity Assessments
        this.addSubMenuItem('topbar', 'evaluation', 'Maturity assessments', 'maturity-management','maturity-management',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
                // Reviews summary
        this.addSubMenuItem('topbar', 'evaluation', 'Reviews summary', 'review-summaries','review-summaries',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
                // Improvement activities
        this.addSubMenuItem('topbar', 'evaluation', 'Improvement activities', 'improvement-activities','improvement-activities',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
            // Dependencies
        this.addSubMenuItem('topbar', 'evaluation', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);
        this.addSubMenuItem('topbar', 'evaluation', 'Dependencies', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],17);
                // Project dependencies
        this.addSubMenuItem('topbar', 'evaluation', 'Project dependencies', 'dependency-analysis','dependency-analysis',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],18);



        // DELIVERY
		this.addMenuItem('topbar','Delivery','delivery','dropdown','delivery',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
            // Gate management
        this.addSubMenuItem('topbar', 'delivery', 'Gate management', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],0);
                // Gate process assignment
        this.addSubMenuItem('topbar', 'delivery', 'Gate process assignment', 'gate-management-assignment','gate-management-assignment',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],1);
                // Gate reviews
        this.addSubMenuItem('topbar', 'delivery', 'Gate reviews', 'gate-management-review','gate-management-review',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],2);
                // Delivery Performances
        this.addSubMenuItem('topbar', 'delivery', 'Delivery performances', 'gate-performances-portfolio','gate-performances-portfolio',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],3);
            // Change requests
        this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],4);
        this.addSubMenuItem('topbar', 'delivery', 'Change requests', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],5);
                // Project change requests
        this.addSubMenuItem('topbar', 'delivery', 'Project changes', 'project-change-requests','project-change-requests',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],6);
				// Portfolio change requests
		this.addSubMenuItem('topbar', 'delivery', 'Portfolio changes', 'portfolio-change-requests','portfolio-change-requests',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],7);
            // Issues
        this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],8);
        this.addSubMenuItem('topbar', 'delivery', 'Issues', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],9);
				// Project issues
		this.addSubMenuItem('topbar', 'delivery', 'Project issues', 'project-issues', 'project-issues',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],10);
                // Portfolio issues
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio issues', 'portfolio-issues','portfolio-issues',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],11);
			// Milestones
		this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],12);
		this.addSubMenuItem('topbar', 'delivery', 'Milestones', 'menuTitle','menuTitle',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],13);
				// Project milestones
		this.addSubMenuItem('topbar', 'delivery', 'Project milestones', 'project-milestones','project-milestones',false,
			['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],14);
                // Portfolio milestones
        this.addSubMenuItem('topbar', 'delivery', 'Portfolio milestones', 'portfolio-milestones','portfolio-milestones',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],15);
            // Status reports
        this.addSubMenuItem('topbar', 'delivery', '', 'divider','divider',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],16);
        this.addSubMenuItem('topbar', 'delivery', 'Status', 'menuTitle','menuTitle',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],17);
                // Project status
        this.addSubMenuItem('topbar', 'delivery', 'Project status', 'project-status-management','project-status-management',false,
            ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],18);
                // Portfolio status
        //this.addSubMenuItem('topbar', 'delivery', 'Portfolio status', 'portfolio-status-management','portfolio-status-management',false,
        //    ['superAdmin','admin','pmo','projectManager','portfolioManager','executive'],19);


	}
]);

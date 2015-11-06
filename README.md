			# **taoPortfolio.com - Project Portfolio Management**

MEAN.JS application: 
* MongoDB - [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/)
* Express - [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js).


## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:


			# *PRODUCT FUNCTIONALITY*


## PORTFOLIO DEFINITION

	### Identification
The identification of the required projects is based on a business strategy decomposition process. The system will allow the user to identify as many levels of hierarchical decomposition as required called strategy nodes. Strategy nodes can be of different strategy type.
At any node of the hierarchy, projects that map directly to that node are identified. Key identification data for each project includes: start/end date, earmarked funds, company’s identification number, project name and description.
If the strategy decomposition structure identifies the business strategy area that owns a project, the portfolio decomposition structure identifies its delivery accountability. Each project identi- fied during the strategy decomposition exercise should be assigned to a portfolio. Portfolio can be categorized by portfolio type.

	### Stakeholders & project organization
Projects are managed within a matrix organization where project organization’s reporting lines are superimposed to the business as usual functional lines. Project stakeholders play roles in the organizational units, generalized in stakeholder groups, which make up the project organi- zation. Minimum information required for a stakeholder is name, title and email/phone.

	### Dependencies
This process entails the management of dependencies among projects. When a project requires a deliverable/milestone to be achieved or provided by another project, this constraint should be captured as a dependency. A dependency should identify the source project expected to pro- duce the deliverable, the target project that requires that deliverable in order to properly progress with its own delivery. The deliverable will be expected on a certain date and, if not delivered on time or as expected, it will have a dependency impact on the target project.

	### Categorization
Categorization is the process of classifying projects based on categories that represent, for example, different project characteristics or any meaningful grouping of projects. These cate- gories are then used as the basis for decision-making, comparison or management.
Within each category, project will have different category values. Multiple categories can be grouped in category types.

	### Prioritization
Prioritization of projects can be based on qualitative priorities or rankings.
A priority is the level of delivery importance or precedence a project has compared to other projects, as judged by a relevant stakeholder.
Stakeholders can base their judgement on a number of factors, including categorization values assigned to the project or outcomes of the project evaluation process.
Projects with higher priority will be preferred to projects of lower priority when either fi- nite resources are not sufficient for all projects or temporal precedence has to be given to specific projects since not all projects can be delivered at the same time.
A qualitative priority assigns a non-exclusive priority value to a project based on how it fares in a specific priority compared to other projects. Valid priority values for this category are any text. Value indicated with numbers will treated as text and won't be available for math- ematical calculations.
A ranking assigns a priority value based on an ordinal scale that, once assigned, is exclu- sive to the assigned project. The ranking level represents a unique position in the ordinal scale.
Priorities and rankings can be grouped in priority and ranking types.
A project can have multiple priorities and rankings at the same time.
Stakeholders will follow a process of successive prioritization refinement, identified as pri- oritization steps, where the results of the previous prioritization are further negotiated and adjusted till arriving to a final prioritization decision.
To ensure comparability between projects, qualitative prioritization will use the same quali- tative scale across all different priorities.	

## PORTFOLIO EVALUATION

	### Financial analysis
This sub-process comprises the financial analysis of projects through definition of cost and benefit components and calculation of financial indicators.
Cost and benefits can be grouped in cost and benefit types.
To ensure comparability between projects, cost and benefits item headers are the same for all projects. However, each project will identify a specified amount and year for each item header (with value 0 if not applicable). If relevant, it should be possible to assign a cost or a benefit to a specific delivery process gate.
It is assumed that all cost and benefit items are already discounted.
The payback period calculates the length of time required to recover the entire cash out- flows of the proposed investment. The “modified” payback algorithm adopted by this project takes in consideration cash outflows also after the starting period (Accounting Simplified 2015).
The net present value (NPV) is the difference between the total discounted benefits and the total discounted costs. The higher the NPV, the more value the project creates.
The benefit cost ratio (BCR) is the ratio between the total benefits and the total costs. A higher ratio indicates a higher return.

	### Qualitative analysis

This analysis is used to evaluate different impacts the projects may have on the business that are non-monetary and qualitative in nature, such as qualitative business indicators that are specific to the industry or the type of project. Additionally, this analysis can be used to per- form a qualitative evaluation of financial costs and benefits if a full numerical financial analysis is not required (for example during the initial phase of a business planning cycle).
Qualitative impacts can be grouped in impact types.
An impact score is assigned to each impact. This is expected to be a numerical positive scale (1 to 10 or 1 to 5 are commonly used). The numerical nature of the scoring will allow calculation of averages and comparisons between projects. To this end, the scoring scale is the same for all impact types and projects.
	
	### Risk analysis
The risk analysis is used to evaluate how individual projects contribute to different risks.
Risks can be grouped in risk categories (business, delivery, technology, commercial etc.).
Each risk for each project is evaluated by assigning a risk impact and risk likelihood. Different combination of impact and likelihood will be summarized in risk severity values. These scales will be qualitative but a numerical amount should be assigned to allow numerical com- parisons between projects.
The risks and their likelihoods, impacts and severity scales are the same across all risk categories and projects to ensure comparability.

	### Selection status
The outcome of the evaluation process is a selection decision regarding the project’s suitability to be delivered and in general on its value as an investment for the company. This decision is recorded for each project with a selection status.
Projects that are not taken forward should not be available in the portfolio delivery module. Although this functionality is not fully implemented, the selection status and the skeleton of the view/edit rights should be in place for discussion with the users.


## PORTFOLIO DELIVERY

	### Gate management process
The gate process entails the definition of standard stage/gate management processes com- prising predefined sequential management gates with expected project outcomes and gate performance data at each gate.
This process should not be confused with the project method or technical delivery method (such as Agile, RUP, Prince2, or any other proprietary project management method) that usu- ally defines the project or product lifecycle phases with the specialist or technical deliverables expected at each phase. This technical method is considered part of project management and out of scope from the portfolio management process in this application.
There is a trade-off between variety of gate processes adopted and level of delivery control of the portfolio since different processes will challenge the comparability between project per- formances at gate reviews.
Additionally, the higher the number of gates the tighter is the control on the projects but al- so the overhead for both the controllers and the projects.
A gate represents a point in time, while a stage represent a time interval delimited by two gates.
The startup gate identifies the start of the project and the closure gate identifies the end of the project. Both gates should always be present for any project.
The characteristics of the typical portfolio of projects a company faces should be used to identify the most appropriate number and type of gate processes. The main stage/gate process in the users experience is the traditional “waterfall”.

	### Gate reviews
A gate management process is assigned to each project and the gate review data is recorded at each gate review.
Baseline, estimate and actual performances are recorded for the duration, cost and com- pletion dimensions. Baseline and estimate should be provided for the current gate and all the successive gates at each gate. Actual data should be provided only for the current gate at each gate. Changes to baseline or actual data should only be made through a formal gate review or an approved change requests. Changes to estimates can only be made when communicated as part of a project status or at a gate review.
Gate outcomes are evaluated by assigning outcome scores at each gate review for the cur- rent gate.
The history of all changes to performances and outcomes should be recorded in time and accessible for auditing and trending analysis.

	### Delivery logs
Project change requests are formal documents raised by a project to record a change in the project performances. Each change should report a reason for change from a standardized list. As the request is discussed and evaluated, it should be possible to capture the different request states.
Request priority should be captured for each request to indicate its importance and usually its precedence above others because of its criticality.
Each change should have an internal identification number, a title and a set of raised on / delivery dates.
Portfolio change requests are similar to project change request but refer to a whole portfolio rather than a project.
Project managers create project change requests for a specific project whenever needed and present them to the portfolio manager. Often these requests are accompanied by requests for extra funds. However, portfolio managers in turn are usually able to present all the project changes in their portfolio, and the accompanying net fund changes, to management only at set times (e.g. monthly). Therefore, portfolio change requests should be able to bundle different project change requests in one document and provide any separate summary data.
Project issues indicate any problems impacting the success of the project. Each issue should report its state, priority and cause in a standardized manner. Additional, each issue should have an internal identifier number, a title and a set of raised on / resolution dates.
Portfolio issues are similar to project issues but refer to a whole portfolio rather than a specific project. A portfolio issue should be able to bundle different project issues. Portfolio managers need the ability to escalate the issue on behalf of the projects and record any escala- tion actions requested to any senior stakeholders to support the issue resolution.
Project milestones identify key deliverables in the project lifecycle. For each project and gate, milestones should be recorded. The different points in the life of a milestone should be recorded with standardized milestone states along with its delivery date. Although the mile- stones are project-specific, they should be categorized in milestone types that are standardized across all projects for comparability.
Portfolio milestones refer to major delivery points at portfolio level. For this reason, port- folio milestone types should be separate from the project milestone type and be standardized across all portfolios. Portfolio milestones should be capable of referring to a bundle of project milestones that are required for their achievement.
The history of all changes to milestones’ delivery dates and issues’ resolution dates should be recorded in time and accessible for auditing and trending analysis.
	
	### Delivery status
This process allows the periodic reporting of the delivery status of each project at each gate.
Each project status document should report the period it refers to and a standardized status indicator (e.g. red/amber/green) with a status comment.
Detailed status information should include:
o Standardized status areas, with status indicator and status comment, to provide a higher level of granularity to the report
o Status about the current achievement of the expected gate outcomes
o New estimate values for any gate performance as applicable
Similarly to the project status, portfolio status documents should be used to report the sta-
tus at portfolio level.

## USER MANAGEMENT

First user subscribes as "Super Admin" and it is responsible for the entire account.
It can create #subusers# for its organization and attach the following roles:
o Admin
o PMO
o Portfolio Manager
o Project Manager
o Executive
	

All rights reserved - taoPortfolio

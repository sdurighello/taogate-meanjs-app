'use strict';

/**
 * SEED - IDs
 */
var _ = require('lodash'),
    errorHandler = require('../errors.server.controller'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');



var idObject = {

    // Counters
    Counter:{
      projectSequence : 'projectSequence'
    },
    
    // -----------------------------------------  DEFINITION  ----------------------------------------------

    // Strategy & Portfolio trees
    StrategyNodeType:{
        nt1 : mongoose.Types.ObjectId(),
        nt2 : mongoose.Types.ObjectId(),
        nt3 : mongoose.Types.ObjectId()
    },
    StrategyNode:{
        sn1:mongoose.Types.ObjectId(),
        sn11:mongoose.Types.ObjectId(), sn111:mongoose.Types.ObjectId(), sn112:mongoose.Types.ObjectId(),
        sn12:mongoose.Types.ObjectId(), sn121:mongoose.Types.ObjectId(), sn122:mongoose.Types.ObjectId(),
        sn2:mongoose.Types.ObjectId(),
        sn21:mongoose.Types.ObjectId(), sn211:mongoose.Types.ObjectId(), sn212:mongoose.Types.ObjectId(),
        sn22:mongoose.Types.ObjectId(), sn221:mongoose.Types.ObjectId(), sn222:mongoose.Types.ObjectId(),
        sn3:mongoose.Types.ObjectId(),
        sn31:mongoose.Types.ObjectId(), sn311:mongoose.Types.ObjectId(), sn312:mongoose.Types.ObjectId(),
        sn32:mongoose.Types.ObjectId(), sn321:mongoose.Types.ObjectId(), sn322:mongoose.Types.ObjectId()
    },
    PortfolioType:{
        pnt1 : mongoose.Types.ObjectId(),
        pnt2 : mongoose.Types.ObjectId(),
        pnt3 : mongoose.Types.ObjectId()
    },
    Portfolio:{
        pn1:mongoose.Types.ObjectId(),
        pn11:mongoose.Types.ObjectId(), pn111:mongoose.Types.ObjectId(), pn112:mongoose.Types.ObjectId(),
        pn12:mongoose.Types.ObjectId(), pn121:mongoose.Types.ObjectId(), pn122:mongoose.Types.ObjectId(),
        pn2:mongoose.Types.ObjectId(),
        pn21:mongoose.Types.ObjectId(), pn211:mongoose.Types.ObjectId(), pn212:mongoose.Types.ObjectId(),
        pn22:mongoose.Types.ObjectId(), pn221:mongoose.Types.ObjectId(), pn222:mongoose.Types.ObjectId(),
        pn3:mongoose.Types.ObjectId(),
        pn31:mongoose.Types.ObjectId(), pn311:mongoose.Types.ObjectId(), pn312:mongoose.Types.ObjectId(),
        pn32:mongoose.Types.ObjectId(), pn321:mongoose.Types.ObjectId(), pn322:mongoose.Types.ObjectId()
    },

    // Categorization
    CategoryGroup:{
        cat1 : mongoose.Types.ObjectId(),
        cat2 : mongoose.Types.ObjectId(),
        cat3 : mongoose.Types.ObjectId(),
        cat4 : mongoose.Types.ObjectId()
    },
    Category:{
        cat11 : mongoose.Types.ObjectId(), cat12 : mongoose.Types.ObjectId(), cat13 : mongoose.Types.ObjectId(), cat14 : mongoose.Types.ObjectId(),
        cat21 : mongoose.Types.ObjectId(), cat22 : mongoose.Types.ObjectId(), cat23 : mongoose.Types.ObjectId(),
        cat31 : mongoose.Types.ObjectId(), cat32 : mongoose.Types.ObjectId(),
        cat41 : mongoose.Types.ObjectId(), cat42 : mongoose.Types.ObjectId(), cat43 : mongoose.Types.ObjectId()
    },
    CategoryValue:{
        // Strategic Business Unit
        cat111 : mongoose.Types.ObjectId(), cat112 : mongoose.Types.ObjectId(), cat113 : mongoose.Types.ObjectId(),
        // Product
        cat121 : mongoose.Types.ObjectId(), cat122 : mongoose.Types.ObjectId(), cat123 : mongoose.Types.ObjectId(),
        // Market
        cat131 : mongoose.Types.ObjectId(), cat132 : mongoose.Types.ObjectId(), cat133 : mongoose.Types.ObjectId(),
        // Geography
        cat141 : mongoose.Types.ObjectId(), cat142 : mongoose.Types.ObjectId(), cat143 : mongoose.Types.ObjectId(),

        // Business Novelty
        cat211 : mongoose.Types.ObjectId(), cat212 : mongoose.Types.ObjectId(), cat213 : mongoose.Types.ObjectId(),
        // Technology novelty
        cat221 : mongoose.Types.ObjectId(), cat222 : mongoose.Types.ObjectId(), cat223 : mongoose.Types.ObjectId(),
        // Ease of implementation
        cat231 : mongoose.Types.ObjectId(), cat232 : mongoose.Types.ObjectId(), cat233 : mongoose.Types.ObjectId(),

        // Technology change
        cat311 : mongoose.Types.ObjectId(), cat312 : mongoose.Types.ObjectId(), cat313 : mongoose.Types.ObjectId(),
        // Business change
        cat321 : mongoose.Types.ObjectId(), cat322 : mongoose.Types.ObjectId(), cat323 : mongoose.Types.ObjectId(), cat324 : mongoose.Types.ObjectId(),

        // Delivery process
        cat411 : mongoose.Types.ObjectId(), cat412 : mongoose.Types.ObjectId(), cat413 : mongoose.Types.ObjectId(),
        // Effort size
        cat421 : mongoose.Types.ObjectId(), cat422 : mongoose.Types.ObjectId(), cat423 : mongoose.Types.ObjectId(),
        // Technology type
        cat431 : mongoose.Types.ObjectId(), cat432 : mongoose.Types.ObjectId(), cat433 : mongoose.Types.ObjectId(), cat434 : mongoose.Types.ObjectId()
    },
    
    //Prioritization
    PriorityGroup: {
        prio1 : mongoose.Types.ObjectId(), prio2 : mongoose.Types.ObjectId(), prio3 : mongoose.Types.ObjectId()
    },
    Priority: {
        prio11 : mongoose.Types.ObjectId(), prio12 : mongoose.Types.ObjectId(), prio13 : mongoose.Types.ObjectId(),
        prio21 : mongoose.Types.ObjectId(), prio22 : mongoose.Types.ObjectId(),
        prio31 : mongoose.Types.ObjectId(), prio32 : mongoose.Types.ObjectId()
    },
    PriorityValue: {
        prioValue1 : mongoose.Types.ObjectId(), // Low
        prioValue2 : mongoose.Types.ObjectId(), // medium
        prioValue3 : mongoose.Types.ObjectId() // high
    },

    // -----------------------------------------  EVALUATION  ----------------------------------------------

    // Financial Analysis
    FinancialCostGroup: {
        cost1 : mongoose.Types.ObjectId(), cost2 : mongoose.Types.ObjectId()
    },
    FinancialCostType: {
        cost11 : mongoose.Types.ObjectId(), cost12 : mongoose.Types.ObjectId(), cost13 : mongoose.Types.ObjectId(),
        cost21 : mongoose.Types.ObjectId(), cost22 : mongoose.Types.ObjectId(), cost23 : mongoose.Types.ObjectId(), cost24 : mongoose.Types.ObjectId(), cost25 : mongoose.Types.ObjectId()
    },
    FinancialBenefitGroup: {
        benefit1 : mongoose.Types.ObjectId(), benefit2 : mongoose.Types.ObjectId(), benefit3 : mongoose.Types.ObjectId()
    },
    FinancialBenefitType: {
        benefit11 : mongoose.Types.ObjectId(), benefit12 : mongoose.Types.ObjectId(), benefit13 : mongoose.Types.ObjectId(),
        benefit21 : mongoose.Types.ObjectId(), benefit22 : mongoose.Types.ObjectId(), benefit23 : mongoose.Types.ObjectId(),
        benefit31 : mongoose.Types.ObjectId(), benefit32 : mongoose.Types.ObjectId()
    },
    
    // Qualitative Analysis
    QualitativeImpactGroup: {
        q1 : mongoose.Types.ObjectId(), q2 : mongoose.Types.ObjectId(), q3 : mongoose.Types.ObjectId(), q4 : mongoose.Types.ObjectId()
    },
    QualitativeImpact: {
        q11 : mongoose.Types.ObjectId(), q12 : mongoose.Types.ObjectId(),
        q21 : mongoose.Types.ObjectId(), q22 : mongoose.Types.ObjectId(), q23 : mongoose.Types.ObjectId(), q24 : mongoose.Types.ObjectId(),
        q31 : mongoose.Types.ObjectId(), q32 : mongoose.Types.ObjectId(), q33 : mongoose.Types.ObjectId(), q34 : mongoose.Types.ObjectId(),
        q41 : mongoose.Types.ObjectId(), q42 : mongoose.Types.ObjectId(), q43 : mongoose.Types.ObjectId(), q44 : mongoose.Types.ObjectId()
    },
    QualitativeImpactScore: {
        impactScore1: mongoose.Types.ObjectId(), impactScore2: mongoose.Types.ObjectId(), impactScore3: mongoose.Types.ObjectId(),
        impactScore4: mongoose.Types.ObjectId(), impactScore5: mongoose.Types.ObjectId(), impactScore6: mongoose.Types.ObjectId()
    },
    
    // Risk Analysis
    RiskCategory: {
        r1 : mongoose.Types.ObjectId(), r2 : mongoose.Types.ObjectId(), r3 : mongoose.Types.ObjectId(), 
        r4 : mongoose.Types.ObjectId(), r5 : mongoose.Types.ObjectId(), r6 : mongoose.Types.ObjectId()
    },
    Risk: {
        r11 : mongoose.Types.ObjectId(), r12 : mongoose.Types.ObjectId(), r13 : mongoose.Types.ObjectId(),
        r21 : mongoose.Types.ObjectId(), r22 : mongoose.Types.ObjectId(), r23 : mongoose.Types.ObjectId(),
        r31 : mongoose.Types.ObjectId(), r32 : mongoose.Types.ObjectId(), r33 : mongoose.Types.ObjectId(),
        r41 : mongoose.Types.ObjectId(), r42 : mongoose.Types.ObjectId(), r43 : mongoose.Types.ObjectId(),
        r51 : mongoose.Types.ObjectId(), r52 : mongoose.Types.ObjectId(), r53 : mongoose.Types.ObjectId(),
        r61 : mongoose.Types.ObjectId(), r62 : mongoose.Types.ObjectId()
    },
    RiskImpact: {
        riskImpact1 : mongoose.Types.ObjectId(), riskImpact2 : mongoose.Types.ObjectId(), riskImpact3 : mongoose.Types.ObjectId(),
        riskImpact4 : mongoose.Types.ObjectId(), riskImpact5 : mongoose.Types.ObjectId()
    },
    RiskProbability: {
        riskProb1 : mongoose.Types.ObjectId(), riskProb2 : mongoose.Types.ObjectId(), riskProb3 : mongoose.Types.ObjectId(),
        riskProb4 : mongoose.Types.ObjectId(), riskProb5 : mongoose.Types.ObjectId()
    },
    RiskSeverity: {
        riskSev1 : mongoose.Types.ObjectId(), riskSev2 : mongoose.Types.ObjectId(), riskSev3 : mongoose.Types.ObjectId()
    },
    RiskSeverityAssignment: {
        ri1Rp5 : mongoose.Types.ObjectId(), ri1Rp4 : mongoose.Types.ObjectId(), ri1Rp3 : mongoose.Types.ObjectId(),
        ri1Rp2 : mongoose.Types.ObjectId(), ri1Rp1 : mongoose.Types.ObjectId(),

        ri2Rp5 : mongoose.Types.ObjectId(), ri2Rp4 : mongoose.Types.ObjectId(), ri2Rp3 : mongoose.Types.ObjectId(),
        ri2Rp2 : mongoose.Types.ObjectId(), ri2Rp1 : mongoose.Types.ObjectId(),

        ri3Rp5 : mongoose.Types.ObjectId(), ri3Rp4 : mongoose.Types.ObjectId(), ri3Rp3 : mongoose.Types.ObjectId(),
        ri3Rp2 : mongoose.Types.ObjectId(), ri3Rp1 : mongoose.Types.ObjectId(),

        ri4Rp5 : mongoose.Types.ObjectId(), ri4Rp4 : mongoose.Types.ObjectId(), ri4Rp3 : mongoose.Types.ObjectId(),
        ri4Rp2 : mongoose.Types.ObjectId(), ri4Rp1 : mongoose.Types.ObjectId(),

        ri5Rp5 : mongoose.Types.ObjectId(), ri5Rp4 : mongoose.Types.ObjectId(), ri5Rp3 : mongoose.Types.ObjectId(),
        ri5Rp2 : mongoose.Types.ObjectId(), ri5Rp1 : mongoose.Types.ObjectId()
    },

    // Stakeholder Analysis
    PeopleCategory: {
        id1 : mongoose.Types.ObjectId(), id2 : mongoose.Types.ObjectId(), id3 : mongoose.Types.ObjectId(),
        id4 : mongoose.Types.ObjectId(), id5 : mongoose.Types.ObjectId(), id6 : mongoose.Types.ObjectId(),
        id7 : mongoose.Types.ObjectId()
    },
    PeopleCategoryValue: {
        id11 : mongoose.Types.ObjectId(), id12 : mongoose.Types.ObjectId(),

        id21 : mongoose.Types.ObjectId(), id22 : mongoose.Types.ObjectId(), id23 : mongoose.Types.ObjectId(),
        id24 : mongoose.Types.ObjectId(),

        id31 : mongoose.Types.ObjectId(), id32 : mongoose.Types.ObjectId(), id33 : mongoose.Types.ObjectId(),
        id34 : mongoose.Types.ObjectId(), id35 : mongoose.Types.ObjectId(), id36 : mongoose.Types.ObjectId(),
        id37 : mongoose.Types.ObjectId(), id38 : mongoose.Types.ObjectId(),

        id41 : mongoose.Types.ObjectId(), id42 : mongoose.Types.ObjectId(), id43 : mongoose.Types.ObjectId(),
        id44 : mongoose.Types.ObjectId(),

        id51 : mongoose.Types.ObjectId(), id52 : mongoose.Types.ObjectId(), id53 : mongoose.Types.ObjectId(),
        id54 : mongoose.Types.ObjectId(), id55 : mongoose.Types.ObjectId(),

        id61 : mongoose.Types.ObjectId(), id62 : mongoose.Types.ObjectId(), id63 : mongoose.Types.ObjectId(),
        id64 : mongoose.Types.ObjectId(),

        id71 : mongoose.Types.ObjectId(), id72 : mongoose.Types.ObjectId(), id73 : mongoose.Types.ObjectId(),
        id74 : mongoose.Types.ObjectId(), id75 : mongoose.Types.ObjectId()
    },

    // People Portfolio
    PeoplePortfolioGroup: {
        group1 : mongoose.Types.ObjectId()
    },
    PeoplePortfolioRole: {
        role1 : mongoose.Types.ObjectId(), role2 : mongoose.Types.ObjectId(), role3 : mongoose.Types.ObjectId()
    },

    // People Project
    PeopleProjectGroup: {
        group1 : mongoose.Types.ObjectId(), group2 : mongoose.Types.ObjectId()
    },
    PeopleProjectRole: {
        role11 : mongoose.Types.ObjectId(), role12 : mongoose.Types.ObjectId(), role13 : mongoose.Types.ObjectId(), role14 : mongoose.Types.ObjectId(),
        role21 : mongoose.Types.ObjectId(), role22 : mongoose.Types.ObjectId(), role23 : mongoose.Types.ObjectId(), role24 : mongoose.Types.ObjectId()
    },

    // Dependency
    DependencyType: {
        dt1 : mongoose.Types.ObjectId(), dt2 : mongoose.Types.ObjectId(), dt3 : mongoose.Types.ObjectId(),
        dt4 : mongoose.Types.ObjectId(), dt5 : mongoose.Types.ObjectId(), dt6 : mongoose.Types.ObjectId(),
        dt7 : mongoose.Types.ObjectId(), dt8 : mongoose.Types.ObjectId(), dt9 : mongoose.Types.ObjectId(),
        dt10 : mongoose.Types.ObjectId(), dt11 : mongoose.Types.ObjectId(), dt12 : mongoose.Types.ObjectId()
    },
    DependencyImpact: {
        di1 : mongoose.Types.ObjectId(), di2 : mongoose.Types.ObjectId(), di3 : mongoose.Types.ObjectId(),
        di4 : mongoose.Types.ObjectId(), di5 : mongoose.Types.ObjectId()
    },
    DependencyState: {
        ds1 : mongoose.Types.ObjectId(), ds2 : mongoose.Types.ObjectId(), ds3 : mongoose.Types.ObjectId(),
        ds4 : mongoose.Types.ObjectId()
    },

    // Maturity model
    MaturityModel : {
        model1 : mongoose.Types.ObjectId()
    },
    MaturityModelLevel : {
        level1: mongoose.Types.ObjectId(), level2 : mongoose.Types.ObjectId(), level3 : mongoose.Types.ObjectId(), level4 : mongoose.Types.ObjectId(), level5 : mongoose.Types.ObjectId()
    },
    MaturityModelArea : {
        area1 : mongoose.Types.ObjectId(), area2 : mongoose.Types.ObjectId(), area3 : mongoose.Types.ObjectId(), area4 : mongoose.Types.ObjectId(), area5 : mongoose.Types.ObjectId(), area6 : mongoose.Types.ObjectId(),
        area7 : mongoose.Types.ObjectId(), area8 : mongoose.Types.ObjectId(), area9 : mongoose.Types.ObjectId(), area10 : mongoose.Types.ObjectId(), area11 : mongoose.Types.ObjectId(), area12 : mongoose.Types.ObjectId(),
        area13 : mongoose.Types.ObjectId(), area14 : mongoose.Types.ObjectId(), area15 : mongoose.Types.ObjectId(), area16 : mongoose.Types.ObjectId(), area17 : mongoose.Types.ObjectId(), area18 : mongoose.Types.ObjectId(),
        area19 : mongoose.Types.ObjectId(), area20 : mongoose.Types.ObjectId(), area21 : mongoose.Types.ObjectId(), area22 : mongoose.Types.ObjectId()
    },
    MaturityModelDimension : {
        l1a1_1 : mongoose.Types.ObjectId(), l1a2_1 : mongoose.Types.ObjectId(), l1a3_1 : mongoose.Types.ObjectId(),
        l1a4_1 : mongoose.Types.ObjectId(), l1a5_1 : mongoose.Types.ObjectId(),

        l2a1_1 : mongoose.Types.ObjectId(), l2a2_1 : mongoose.Types.ObjectId(), l2a2_2 : mongoose.Types.ObjectId(),
        l2a2_3 : mongoose.Types.ObjectId(), l2a3_1 : mongoose.Types.ObjectId(), l2a3_2 : mongoose.Types.ObjectId(),
        l2a4_1 : mongoose.Types.ObjectId(), l2a4_2 : mongoose.Types.ObjectId(), l2a5_1 : mongoose.Types.ObjectId(),
        l2a6_1 : mongoose.Types.ObjectId(), l2a6_2 : mongoose.Types.ObjectId(), l2a7_1 : mongoose.Types.ObjectId(),
        l2a7_2 : mongoose.Types.ObjectId(), l2a7_3 : mongoose.Types.ObjectId(),

        l3a8_1 : mongoose.Types.ObjectId(), l3a8_2 : mongoose.Types.ObjectId(), l3a8_3 : mongoose.Types.ObjectId(),
        l3a9_1 : mongoose.Types.ObjectId(), l3a9_2 : mongoose.Types.ObjectId(), l3a9_3 : mongoose.Types.ObjectId(),
        l3a10_1 : mongoose.Types.ObjectId(), l3a10_2 : mongoose.Types.ObjectId(), l3a10_3 : mongoose.Types.ObjectId(),
        l3a11_1 : mongoose.Types.ObjectId(), l3a11_2 : mongoose.Types.ObjectId(), l3a11_3 : mongoose.Types.ObjectId(),
        l3a12_1 : mongoose.Types.ObjectId(), l3a12_2 : mongoose.Types.ObjectId(), l3a13_1 : mongoose.Types.ObjectId(),
        l3a13_2 : mongoose.Types.ObjectId(), l3a13_3 : mongoose.Types.ObjectId(), l3a14_1 : mongoose.Types.ObjectId(),
        l3a14_2 : mongoose.Types.ObjectId(), l3a15_1 : mongoose.Types.ObjectId(), l3a15_2 : mongoose.Types.ObjectId(),
        l3a16_1 : mongoose.Types.ObjectId(), l3a16_2 : mongoose.Types.ObjectId(), l3a16_3 : mongoose.Types.ObjectId(),
        l3a17_1 : mongoose.Types.ObjectId(), l3a17_2 : mongoose.Types.ObjectId(), l3a17_3 : mongoose.Types.ObjectId(),
        l3a18_1 : mongoose.Types.ObjectId(),

        l4a19_1 : mongoose.Types.ObjectId(), l4a20_1 : mongoose.Types.ObjectId(), l4a20_2 : mongoose.Types.ObjectId(),

        l5a21_1 : mongoose.Types.ObjectId(), l5a21_2 : mongoose.Types.ObjectId(), l5a22_1 : mongoose.Types.ObjectId(),
        l5a22_2 : mongoose.Types.ObjectId()
    },

    // Review
    PortfolioReviewType: {
        pReviewType1 : mongoose.Types.ObjectId(), pReviewType2 : mongoose.Types.ObjectId()
    },
    PortfolioReviewTemplate: {
        pReviewTemp1 : mongoose.Types.ObjectId(), pReviewTemp2 : mongoose.Types.ObjectId()
    },

    ProjectReviewType: {
        pReviewType1 : mongoose.Types.ObjectId(), pReviewType2 : mongoose.Types.ObjectId()
    },
    ProjectReviewTemplate: {
        pReviewTemp1 : mongoose.Types.ObjectId(), pReviewTemp2 : mongoose.Types.ObjectId()
    },

    ProjectReviewScore: {
        reviewScore1 : mongoose.Types.ObjectId(), reviewScore2 : mongoose.Types.ObjectId(), reviewScore3 : mongoose.Types.ObjectId(),
        reviewScore4 : mongoose.Types.ObjectId(), reviewScore5 : mongoose.Types.ObjectId()
    },

    // Improvement
    ImprovementReason: {
        reason1 : mongoose.Types.ObjectId(), reason2 : mongoose.Types.ObjectId(), reason3 : mongoose.Types.ObjectId()
    },
    ImprovementState: {
        state1 : mongoose.Types.ObjectId(), state2 : mongoose.Types.ObjectId(), state3 : mongoose.Types.ObjectId(), state4 : mongoose.Types.ObjectId()
    },
    ImprovementType: {
        type1 : mongoose.Types.ObjectId(), type2 : mongoose.Types.ObjectId(), type3 : mongoose.Types.ObjectId(), type4 : mongoose.Types.ObjectId()
    },


    // -----------------------------------------  DELIVERY  ----------------------------------------------

    // Milestone
    MilestoneState: {
        state1 : mongoose.Types.ObjectId(), state2 : mongoose.Types.ObjectId(), state3 : mongoose.Types.ObjectId(), state4 : mongoose.Types.ObjectId(),
        state5 : mongoose.Types.ObjectId(), state6 : mongoose.Types.ObjectId(), state7 : mongoose.Types.ObjectId()
    },
    ProjectMilestoneType: {
        projectMilType1 : mongoose.Types.ObjectId(), projectMilType2 : mongoose.Types.ObjectId(), projectMilType3 : mongoose.Types.ObjectId(),
        projectMilType4 : mongoose.Types.ObjectId(), projectMilType5 : mongoose.Types.ObjectId(), projectMilType6 : mongoose.Types.ObjectId()
    },
    PortfolioMilestoneType: {
        portfolioMilType1 : mongoose.Types.ObjectId(), portfolioMilType2 : mongoose.Types.ObjectId(), portfolioMilType3 : mongoose.Types.ObjectId()
    },
    
    // Gate Process
    GateProcess: {
        w1 : mongoose.Types.ObjectId()
    },
    Gate: {
        w11 : mongoose.Types.ObjectId(), // Startup
        w12 : mongoose.Types.ObjectId(), // Initiation
        w13 : mongoose.Types.ObjectId(), // Planning
        w14 : mongoose.Types.ObjectId(), // Execution
        w15 : mongoose.Types.ObjectId(), // Warranty
        w16 : mongoose.Types.ObjectId() // Closure
    },
    GateOutcome: {
        w111 : mongoose.Types.ObjectId(), // Initiative aligned to approved strategic theme
        w112 : mongoose.Types.ObjectId(), // Formal support by a named Sponsor identified
        w113 : mongoose.Types.ObjectId(), // Expected delivery identified in approved roadmap
        w114 : mongoose.Types.ObjectId(), // A Project Manager has been assigned
        
        w121 : mongoose.Types.ObjectId(), // Business justification agreed between stakeholders
        w122 : mongoose.Types.ObjectId(), // Funding available and committed
        w123 : mongoose.Types.ObjectId(), // Strategic intent clear and aligned with other initiatives
        
        w131 : mongoose.Types.ObjectId(), // Cost/Benefits ownership agreed
        w132 : mongoose.Types.ObjectId(), // Clear requirements
        w133 : mongoose.Types.ObjectId(), // Impacts on other systems and interfaces identified
        w134 : mongoose.Types.ObjectId(), // Impacts on business processes, organization and people identified
        w135 : mongoose.Types.ObjectId(), // Delivery and operations risks mitigated
        
        w141 : mongoose.Types.ObjectId(), // Business change validated
        w142 : mongoose.Types.ObjectId(), // Functional behaviour detailed
        w143 : mongoose.Types.ObjectId(), // Business case approved
        w144 : mongoose.Types.ObjectId(), // Testing strategy agreed
        
        w151 : mongoose.Types.ObjectId(), // Solution built as per design with variance to design documented and agreed
        w152 : mongoose.Types.ObjectId(), // Changes have been placed into production based on formal approval
        w153 : mongoose.Types.ObjectId(), // Users understand how changes to systems and processes will impact them, and where to go for support
        w154 : mongoose.Types.ObjectId(), // Maintenance of new systems, processes or required updates in place
        
        w161 : mongoose.Types.ObjectId(), // Post implementation review completed
        w162 : mongoose.Types.ObjectId(), // Lessons learned captured and embedded
        w163 : mongoose.Types.ObjectId(), // Business benefits realization tracking initiated
        w164 : mongoose.Types.ObjectId() // Project formally closed in management systems
    },
    GateOutcomeScore: {
        goScore1 : mongoose.Types.ObjectId(),
        goScore2 : mongoose.Types.ObjectId(),
        goScore3 : mongoose.Types.ObjectId()
    },
    GateStatus: {
        gStatus1 : mongoose.Types.ObjectId(), 
        gStatus2 : mongoose.Types.ObjectId(), 
        gStatus3 : mongoose.Types.ObjectId(), 
        gStatus4 : mongoose.Types.ObjectId(), 
        gStatus5 : mongoose.Types.ObjectId(), 
        gStatus6 : mongoose.Types.ObjectId()
    },
    
    // Log
    LogPriority : {
        logPriority1 : mongoose.Types.ObjectId(),
        logPriority2 : mongoose.Types.ObjectId(),
        logPriority3 : mongoose.Types.ObjectId()
    },
    LogReason: {
        logReason1 : mongoose.Types.ObjectId(),
        logReason2 : mongoose.Types.ObjectId(),
        logReason3 : mongoose.Types.ObjectId()
    },
    IssueState : {
        issueState1 : mongoose.Types.ObjectId(),
        issueState2 : mongoose.Types.ObjectId(),
        issueState3 : mongoose.Types.ObjectId(),
        issueState4 : mongoose.Types.ObjectId(),
        issueState5 : mongoose.Types.ObjectId()
    },
    IssueActionState : {
        actionState1 : mongoose.Types.ObjectId(),
        actionState2 : mongoose.Types.ObjectId(),
        actionState3 : mongoose.Types.ObjectId(),
        actionState4 : mongoose.Types.ObjectId()
    },
    ChangeRequestState : {
        changeState1 : mongoose.Types.ObjectId(),
        changeState2 : mongoose.Types.ObjectId(),
        changeState3 : mongoose.Types.ObjectId(),
        changeState4 : mongoose.Types.ObjectId(),
        changeState5 : mongoose.Types.ObjectId(),
        changeState6 : mongoose.Types.ObjectId()
    },
    
    // Status
    LogStatusIndicator: {
        indicator1 : mongoose.Types.ObjectId(), indicator2 : mongoose.Types.ObjectId(), indicator3 : mongoose.Types.ObjectId()
    },
    LogStatusArea: {
        area1 : mongoose.Types.ObjectId(), area2 : mongoose.Types.ObjectId(), area3 : mongoose.Types.ObjectId()
    }
};

exports.getIDs = function(){
    return idObject;
};

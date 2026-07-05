const { StateGraph, START, END } = require('@langchain/langgraph');

// Import Agent Nodes
const financialAgent = require('../agents/financialAgent');
const validationAgent = require('../agents/validationAgent');
const newsAgent = require('../agents/newsAgent');
const competitionAgent = require('../agents/competitionAgent');
const riskAgent = require('../agents/riskAgent');
const marketIntelAgent = require('../agents/marketIntelAgent');
const bullAgent = require('../agents/bullAgent');
const bearAgent = require('../agents/bearAgent');
const judgeAgent = require('../agents/judgeAgent');

// Define Reducer Helpers for Object Merging
const mergeReducer = (x, y) => {
  return { ...x, ...y };
};

// Define state channels configuration
const graphStateChannels = {
  companyName: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  ticker: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  persona: {
    value: (x, y) => y ?? x,
    default: () => 'GROWTH'
  },
  financials: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  financialAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  validationNotes: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  news: {
    value: (x, y) => y ?? x,
    default: () => []
  },
  newsAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  newsSentiment: {
    value: (x, y) => y ?? x,
    default: () => 'Neutral'
  },
  competitionAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  riskAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  marketIntelAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  bullAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  bearAnalysis: {
    value: (x, y) => y ?? x,
    default: () => ''
  },
  judgeDecision: {
    value: (x, y) => y ?? x,
    default: () => null
  },
  executionTimes: {
    value: mergeReducer,
    default: () => ({})
  },
  confidenceScores: {
    value: mergeReducer,
    default: () => ({})
  }
};

// Initialize State Graph
const workflow = new StateGraph({
  channels: graphStateChannels
});

// Add all nodes
workflow.addNode('financialAgent', financialAgent);
workflow.addNode('validationAgent', validationAgent);
workflow.addNode('newsAgent', newsAgent);
workflow.addNode('competitionAgent', competitionAgent);
workflow.addNode('riskAgent', riskAgent);
workflow.addNode('marketIntelAgent', marketIntelAgent);
workflow.addNode('bullAgent', bullAgent);
workflow.addNode('bearAgent', bearAgent);
workflow.addNode('judgeAgent', judgeAgent);

// Setup sequential flow matching our finalized execution plan
workflow.addEdge(START, 'financialAgent');
workflow.addEdge('financialAgent', 'validationAgent');
workflow.addEdge('validationAgent', 'newsAgent');
workflow.addEdge('newsAgent', 'competitionAgent');
workflow.addEdge('competitionAgent', 'riskAgent');
workflow.addEdge('riskAgent', 'marketIntelAgent');
workflow.addEdge('marketIntelAgent', 'bullAgent');
workflow.addEdge('bullAgent', 'bearAgent');
workflow.addEdge('bearAgent', 'judgeAgent');
workflow.addEdge('judgeAgent', END);

// Compile workflow
const compiledGraph = workflow.compile();

module.exports = compiledGraph;

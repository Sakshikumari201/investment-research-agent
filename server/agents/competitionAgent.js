const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Competition Agent Node
 * Benchmarks the company against competitors (margins, growth, moat, and market share).
 */
async function competitionAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  const companyName = state.companyName;

  console.log(`[CompetitionAgent] Benchmarking competitors for ${ticker}...`);

  const prompt = `Ticker: ${ticker}
Company: ${companyName}
Financial Context:
Gross Margin: ${state.financials?.grossMargin ? (state.financials.grossMargin * 100).toFixed(1) + '%' : 'N/A'}
Operating Margin: ${state.financials?.operatingMargin ? (state.financials.operatingMargin * 100).toFixed(1) + '%' : 'N/A'}
Revenue Growth (YoY): ${state.financials?.revenueGrowth ? (state.financials.revenueGrowth * 100).toFixed(1) + '%' : 'N/A'}
Market Cap: ${state.financials?.marketCap ? '$' + (state.financials.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}`;

  let competitionAnalysis = '';
  try {
    competitionAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.competitionAgent);
  } catch (error) {
    console.error(`[CompetitionAgent] LLM generation failed:`, error.message);
    competitionAnalysis = 'Competitive benchmarking analysis unavailable due to API errors.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

  return {
    competitionAnalysis,
    executionTimes: {
      ...state.executionTimes,
      competitionAgent: executionTime
    },
    confidenceScores: {
      ...state.confidenceScores,
      competitionAgent: 88 // baseline expert benchmarking confidence
    }
  };
}

module.exports = competitionAgent;

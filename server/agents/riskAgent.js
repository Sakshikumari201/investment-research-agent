const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Risk Agent Node
 * Analyzes financial, competitive, regulatory, valuation, and macro risk factors.
 */
async function riskAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  const companyName = state.companyName;

  console.log(`[RiskAgent] Assessing risks for ${ticker}...`);

  const prompt = `Ticker: ${ticker}
Company: ${companyName}
Financial Context:
Debt-to-Equity Ratio: ${state.financials?.debtToEquity ? state.financials.debtToEquity.toFixed(2) : 'N/A'}
Total Debt: ${state.financials?.totalDebt ? '$' + (state.financials.totalDebt / 1e9).toFixed(2) + 'B' : 'N/A'}
Current Ratio: ${state.financials?.currentRatio ? state.financials.currentRatio.toFixed(2) : 'N/A'}
P/E Ratio: ${state.financials?.peRatio ? state.financials.peRatio.toFixed(2) : 'N/A'}
Free Cash Flow: ${state.financials?.freeCashFlow ? '$' + (state.financials.freeCashFlow / 1e9).toFixed(2) + 'B' : 'N/A'}

Recent News Sentiment: ${state.newsSentiment || 'Neutral'}`;

  let riskAnalysis = '';
  try {
    riskAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.riskAgent);
  } catch (error) {
    console.error(`[RiskAgent] LLM generation failed:`, error.message);
    riskAnalysis = 'Risk assessment analysis unavailable due to API errors.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

  return {
    riskAnalysis,
    executionTimes: {
      ...state.executionTimes,
      riskAgent: executionTime
    },
    confidenceScores: {
      ...state.confidenceScores,
      riskAgent: 85 // baseline risk modeling confidence
    }
  };
}

module.exports = riskAgent;

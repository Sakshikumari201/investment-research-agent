const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Market Intelligence Agent Node
 * Assesses industry trends, sector dynamics, and macro market-moving drivers.
 */
async function marketIntelAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  const companyName = state.companyName;

  console.log(`[MarketIntelAgent] Evaluating market dynamics for ${ticker}...`);

  const prompt = `Ticker: ${ticker}
Company: ${companyName}
Industry Sector Context:
We are assessing the sector tailwinds/headwinds for ${companyName} (${ticker}).
Recent headlines summary:
${state.newsAnalysis ? state.newsAnalysis.substring(0, 1000) : 'No news content analyzed yet.'}`;

  let marketIntelAnalysis = '';
  try {
    marketIntelAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.marketIntelAgent);
  } catch (error) {
    console.error(`[MarketIntelAgent] LLM generation failed:`, error.message);
    marketIntelAnalysis = 'Sector dynamics analysis unavailable due to API errors.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

  return {
    marketIntelAnalysis,
    executionTimes: {
      ...state.executionTimes,
      marketIntelAgent: executionTime
    },
    confidenceScores: {
      ...state.confidenceScores,
      marketIntelAgent: 80 // baseline sector intelligence confidence
    }
  };
}

module.exports = marketIntelAgent;

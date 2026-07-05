const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Bull Analyst Agent Node
 * Formulates the strongest possible long thesis.
 */
async function bullAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  const companyName = state.companyName;

  console.log(`[BullAgent] Compiling bullish thesis for ${ticker}...`);

  const prompt = `Ticker: ${ticker}
Company: ${companyName}

Financial Analysis:
${state.financialAnalysis}

Competitive Analysis:
${state.competitionAnalysis}

News Sentiment:
${state.newsAnalysis}

Market Intelligence:
${state.marketIntelAnalysis}`;

  let bullAnalysis = '';
  try {
    bullAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.bullAgent);
  } catch (error) {
    console.error(`[BullAgent] LLM generation failed:`, error.message);
    bullAnalysis = 'Bull thesis generation failed due to API errors.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

  return {
    bullAnalysis,
    executionTimes: {
      ...state.executionTimes,
      bullAgent: executionTime
    }
  };
}

module.exports = bullAgent;

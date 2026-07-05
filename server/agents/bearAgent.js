const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Bear Analyst Agent Node
 * Formulates the strongest possible short/downside thesis.
 */
async function bearAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  const companyName = state.companyName;

  console.log(`[BearAgent] Compiling bearish thesis for ${ticker}...`);

  const prompt = `Ticker: ${ticker}
Company: ${companyName}

Financial Analysis:
${state.financialAnalysis}

Competitive Analysis:
${state.competitionAnalysis}

Risk Analysis:
${state.riskAnalysis}

News Sentiment:
${state.newsAnalysis}

Market Intelligence:
${state.marketIntelAnalysis}`;

  let bearAnalysis = '';
  try {
    bearAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.bearAgent);
  } catch (error) {
    console.error(`[BearAgent] LLM generation failed:`, error.message);
    bearAnalysis = 'Bear thesis generation failed due to API errors.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

  return {
    bearAnalysis,
    executionTimes: {
      ...state.executionTimes,
      bearAgent: executionTime
    }
  };
}

module.exports = bearAgent;

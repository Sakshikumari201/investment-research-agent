const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Data Validation Agent Node
 * Audits the incoming financial data for completeness and sanity.
 */
async function validationAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  
  console.log(`[ValidationAgent] Auditing financial data for ${ticker}...`);

  const prompt = `Ticker: ${ticker}
Raw Financial Data:
${JSON.stringify(state.financials, null, 2)}

Financial Analysis Summary:
${state.financialAnalysis}`;

  let validationResult;
  try {
    validationResult = await geminiService.generateJson(prompt, SYSTEM_PROMPTS.validationAgent);
  } catch (error) {
    console.error(`[ValidationAgent] LLM generation failed:`, error.message);
    validationResult = {
      missingFields: [],
      contradictions: ['Failed to run automated data validation checks'],
      validationNotes: 'Data quality verification failed due to system errors.',
      confidenceAdjustment: -15,
      dataStatus: 'PARTIAL'
    };
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
  
  // Dynamically adjust financial agent confidence
  const originalFinConfidence = state.confidenceScores?.financialAgent || 95;
  const adjustedConfidence = Math.max(10, Math.min(100, originalFinConfidence + (validationResult.confidenceAdjustment || 0)));

  return {
    validationNotes: validationResult,
    executionTimes: {
      ...state.executionTimes,
      validationAgent: executionTime
    },
    confidenceScores: {
      ...state.confidenceScores,
      financialAgent: adjustedConfidence,
      validationAgent: 100 // Validation process itself ran successfully
    }
  };
}

module.exports = validationAgent;

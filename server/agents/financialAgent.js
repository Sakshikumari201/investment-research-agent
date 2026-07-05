const yahooFinanceService = require('../services/yahooFinanceService');
const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * Financial Agent Node
 * Fetches company fundamentals and analyzes valuation/financial health.
 */
async function financialAgent(state) {
  const startTime = Date.now();
  const ticker = state.ticker;
  
  console.log(`[FinancialAgent] Running analysis for ${ticker}...`);
  
  let financials;
  try {
    financials = await yahooFinanceService.getFinancialData(ticker);
  } catch (error) {
    console.error(`[FinancialAgent] Data fetch failed for ${ticker}:`, error.message);
    financials = { ticker, error: error.message, success: false };
  }

  // Generate prompts
  const prompt = `Ticker: ${ticker}
Company: ${state.companyName}
Financial Metrics:
${JSON.stringify(financials, null, 2)}`;

  let financialAnalysis = '';
  try {
    financialAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.financialAgent);
  } catch (error) {
    console.error(`[FinancialAgent] LLM generation failed:`, error.message);
    financialAnalysis = 'Financial data analysis unavailable due to API errors.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
  
  // Calculate confidence base
  let baseConfidence = 95;
  if (!financials || financials.success === false) {
    baseConfidence = 30; // Highly degraded if data fetch failed
  } else {
    // Check if key metrics are missing
    const criticalFields = ['peRatio', 'revenueGrowth', 'debtToEquity', 'freeCashFlow'];
    const missing = criticalFields.filter(field => financials[field] === null || financials[field] === undefined);
    baseConfidence -= missing.length * 10;
  }

  return {
    financials,
    financialAnalysis,
    executionTimes: {
      ...state.executionTimes,
      financialAgent: executionTime
    },
    confidenceScores: {
      ...state.confidenceScores,
      financialAgent: Math.max(10, baseConfidence)
    }
  };
}

module.exports = financialAgent;

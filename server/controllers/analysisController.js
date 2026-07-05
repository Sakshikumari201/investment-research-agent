const analysisCache = require('../cache/analysisCache');
const yahooFinanceService = require('../services/yahooFinanceService');
const compiledGraph = require('../graph/investmentGraph');

/**
 * Executes a full multi-agent investment research analysis
 * GET /api/analyze?company=Tesla&persona=growth
 */
async function analyzeCompany(req, res, next) {
  const { company, persona = 'GROWTH' } = req.query;
  const cleanPersona = persona.toUpperCase();

  if (!company) {
    return res.status(400).json({ error: 'Company name or ticker query parameter is required' });
  }

  // 1. Check Cache (using clean query and persona key)
  const cacheKey = `${company}_${cleanPersona}`;
  const cachedData = analysisCache.get(cacheKey);

  if (cachedData) {
    console.log(`[Cache] Serving cached analysis for "${cacheKey}"...`);
    return res.json({
      ...cachedData.data,
      isCached: true,
      cachedTimeAgo: `${cachedData.ageMinutes} min ago`,
      cachedTimestamp: cachedData.timestamp
    });
  }

  try {
    const startTime = Date.now();
    console.log(`[Server] Starting new pipeline execution for "${company}" with persona "${cleanPersona}"...`);

    // 2. Resolve Ticker (e.g. "Tesla" -> "TSLA")
    const resolved = await yahooFinanceService.resolveTicker(company);
    console.log(`[Server] Resolved ticker symbol: "${resolved.ticker}" (${resolved.name})`);

    // 3. Invoke LangGraph
    const initialState = {
      companyName: resolved.name,
      ticker: resolved.ticker,
      persona: cleanPersona,
      executionTimes: {},
      confidenceScores: {}
    };

    const finalState = await compiledGraph.invoke(initialState);
    const totalDurationSec = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

    // Combine everything into a clean final response payload
    const responsePayload = {
      companyName: resolved.name,
      ticker: resolved.ticker,
      persona: cleanPersona,
      financials: finalState.financials,
      financialAnalysis: finalState.financialAnalysis,
      validationNotes: finalState.validationNotes,
      newsSentiment: finalState.newsSentiment,
      newsAnalysis: finalState.newsAnalysis,
      competitionAnalysis: finalState.competitionAnalysis,
      riskAnalysis: finalState.riskAnalysis,
      marketIntelAnalysis: finalState.marketIntelAnalysis,
      bullAnalysis: finalState.bullAnalysis,
      bearAnalysis: finalState.bearAnalysis,
      decision: finalState.judgeDecision,
      executionTimes: {
        ...finalState.executionTimes,
        totalPipeline: totalDurationSec
      },
      confidenceScores: finalState.confidenceScores,
      isCached: false,
      timestamp: Date.now()
    };

    // 4. Save to Cache
    analysisCache.set(cacheKey, responsePayload);

    return res.json(responsePayload);
  } catch (error) {
    console.error(`[Server] Pipeline failure for "${company}":`, error.message);
    return res.status(500).json({
      error: 'Analysis Pipeline failed',
      details: error.message
    });
  }
}

/**
 * Simple status endpoint to clear the cache during development
 * POST /api/cache/clear
 */
function clearCache(req, res) {
  analysisCache.clear();
  return res.json({ success: true, message: 'Analysis cache cleared successfully' });
}

module.exports = {
  analyzeCompany,
  clearCache
};

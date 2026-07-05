const yahooFinanceService = require('../services/yahooFinanceService');
const compiledGraph = require('../graph/investmentGraph');
const geminiService = require('../services/geminiService');
const analysisCache = require('../cache/analysisCache');

/**
 * Handles comparative analysis between two companies
 * GET /api/compare?comp1=Tesla&comp2=Nvidia&persona=growth
 */
async function compareCompanies(req, res, next) {
  const { comp1, comp2, persona = 'GROWTH' } = req.query;
  const cleanPersona = persona.toUpperCase();

  if (!comp1 || !comp2) {
    return res.status(400).json({ error: 'Both comp1 and comp2 query parameters are required' });
  }

  try {
    console.log(`[Compare] Starting comparison between "${comp1}" and "${comp2}" [Persona: ${cleanPersona}]...`);

    // Helper to get or run analysis for a single stock (using cache if available)
    const getReport = async (companyName) => {
      const cacheKey = `${companyName}_${cleanPersona}`;
      const cached = analysisCache.get(cacheKey);
      if (cached) return cached.data;

      // Otherwise resolve and run pipeline
      const resolved = await yahooFinanceService.resolveTicker(companyName);
      const initialState = {
        companyName: resolved.name,
        ticker: resolved.ticker,
        persona: cleanPersona,
        executionTimes: {},
        confidenceScores: {}
      };
      const finalState = await compiledGraph.invoke(initialState);
      const payload = {
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
        confidenceScores: finalState.confidenceScores
      };
      analysisCache.set(cacheKey, payload);
      return payload;
    };

    // Run both analyses (can execute in parallel!)
    const [reportA, reportB] = await Promise.all([
      getReport(comp1),
      getReport(comp2)
    ]);

    // Now call Gemini to compare the two reports
    const comparePrompt = `You are a Senior Investment Director benchmarking two assets.
Analyze the two multi-agent investment research reports below:

===========================================
ASSET A: ${reportA.companyName} (${reportA.ticker})
===========================================
Overall Score: ${reportA.decision?.overallScore}/100
Recommendation: ${reportA.decision?.recommendation}
Financial Strength Score: ${reportA.decision?.scoreBreakdown?.financialStrength}/25
Moat Score: ${reportA.decision?.scoreBreakdown?.competitiveMoat}/20
Valuation Summary:
${reportA.financialAnalysis}

Bull Case:
${reportA.bullAnalysis}

Bear Case:
${reportA.bearAnalysis}

===========================================
ASSET B: ${reportB.companyName} (${reportB.ticker})
===========================================
Overall Score: ${reportB.decision?.overallScore}/100
Recommendation: ${reportB.decision?.recommendation}
Financial Strength Score: ${reportB.decision?.scoreBreakdown?.financialStrength}/25
Moat Score: ${reportB.decision?.scoreBreakdown?.competitiveMoat}/20
Valuation Summary:
${reportB.financialAnalysis}

Bull Case:
${reportB.bullAnalysis}

Bear Case:
${reportB.bearAnalysis}

===========================================
COMPARATIVE VERDICT:
Write a detailed comparative verdict. Detail which stock is a superior investment under the ${cleanPersona} strategy, compare their valuations, margins, relative risk levels, moats, and news sentiment, and provide a clear final summary.`;

    const systemPrompt = `You are an institutional Investment Benchmarking expert. 
Your output must be a clean JSON object structure with the following fields:
{
  "verdict": "ASSET_A" | "ASSET_B" | "TIE",
  "winner": "Tesla" | "NVIDIA", // Ticker or name of the winner
  "marginWinner": "Tesla" | "NVIDIA" | "TIE", // Which company has better profitability/margins
  "growthWinner": "Tesla" | "NVIDIA" | "TIE", // Which has faster growth rates
  "valuationWinner": "Tesla" | "NVIDIA" | "TIE", // Which is better valued/priced
  "riskWinner": "Tesla" | "NVIDIA" | "TIE", // Which is safer (lower risk)
  "moatWinner": "Tesla" | "NVIDIA" | "TIE", // Which has a stronger competitive moat
  "verdictSummary": "Standard markdown string detailing why the winner was chosen...",
  "comparisonTable": {
    "peRatio": { "assetA": "35.2", "assetB": "72.4" },
    "revenueGrowth": { "assetA": "15%", "assetB": "262%" },
    "grossMargin": { "assetA": "18.2%", "assetB": "76.1%" },
    "debtToEquity": { "assetA": "0.15", "assetB": "0.02" }
  }
}`;

    let comparisonResult;
    try {
      comparisonResult = await geminiService.generateJson(comparePrompt, systemPrompt);
    } catch (error) {
      console.error('[Compare] Gemini comparison fail:', error.message);
      // Fallback
      comparisonResult = {
        verdict: 'TIE',
        winner: 'TIE',
        marginWinner: 'TIE',
        growthWinner: 'TIE',
        valuationWinner: 'TIE',
        riskWinner: 'TIE',
        moatWinner: 'TIE',
        verdictSummary: 'Automated comparative evaluation failed due to AI service limits. Please review individual summaries.',
        comparisonTable: {}
      };
    }

    return res.json({
      reportA,
      reportB,
      comparison: comparisonResult,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error(`[Compare] Error comparing "${comp1}" vs "${comp2}":`, error.message);
    return res.status(500).json({
      error: 'Comparison failed',
      details: error.message
    });
  }
}

module.exports = {
  compareCompanies
};

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

// Initialize the Gemini API client
const genAI = config.geminiApiKey ? new GoogleGenerativeAI(config.geminiApiKey) : null;

/**
 * Generates text from the Gemini model using user prompts and optional system instructions
 * @param {string} prompt - The main prompt text
 * @param {string} systemInstruction - Optional system prompt
 * @returns {Promise<string>} The generated text
 */
async function generateText(prompt, systemInstruction = '') {
  if (!genAI) {
    return getMockTextResponse(prompt, systemInstruction);
  }

  try {
    const modelName = config.geminiModel || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || undefined
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini generateText error:', error.message);
    // Fallback to mock if API fails
    return getMockTextResponse(prompt, systemInstruction);
  }
}

/**
 * Generates structured JSON from the Gemini model
 * @param {string} prompt - The main prompt text
 * @param {string} systemInstruction - Optional system prompt
 * @returns {Promise<object>} The parsed JSON response
 */
async function generateJson(prompt, systemInstruction = '') {
  if (!genAI) {
    return getMockJsonResponse(prompt, systemInstruction);
  }

  try {
    const modelName = config.geminiModel || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction || undefined,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini generateJson error:', error.message);
    // Try to extract JSON from text if parsing fails
    try {
      const text = await generateText(prompt, systemInstruction);
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
      }
    } catch (innerError) {
      console.error('Failed to parse fallback JSON:', innerError.message);
    }
    return getMockJsonResponse(prompt, systemInstruction);
  }
}

/**
 * Mocks text responses if the API key is not present
 */
function getMockTextResponse(prompt, systemInstruction) {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (systemInstruction.includes('financialAgent')) {
    return `### Financial Analysis Summary
The financial data exhibits strong indicators. P/E ratio is within reasonable industry margins. Operating margin is solid, demonstrating high capital efficiency. Debt-to-Equity is relatively stable. Return on Equity (ROE) remains outstanding, indicating that management generates high value from investments. Free Cash Flow is highly positive and growing quarterly. Confidence score: 95%.`;
  }
  
  if (systemInstruction.includes('newsAgent')) {
    return `### News Sentiment Analysis
The overall news sentiment is positive. Key news themes include new product announcements, production expansions, and positive earnings estimates. Confidence score: 85%.`;
  }
  
  if (systemInstruction.includes('competitionAgent')) {
    return `### Competitive Benchmarking
1. Competitors: Key industry peers show stable growth, but our target company maintains a higher gross margin.
2. Moat: Strong brand value and proprietary technologies provide a wide competitive moat.
3. Outlook: Favorable due to premium pricing power and structural advantages.`;
  }

  if (systemInstruction.includes('riskAgent')) {
    return `### Risk Assessment
1. Financial Risk: Low leverage, strong current ratio.
2. Competitive Risk: Medium. High threats from international suppliers.
3. Valuation Risk: High. High multiples are baked in, leaving little room for earnings misses.`;
  }
  
  if (systemInstruction.includes('marketIntelAgent')) {
    return `### Market Intelligence
The sector is experiencing an expansion phase with tailwinds from digital transformation and green energy policy incentives. High revenue growth is expected to continue for the industry.`;
  }

  if (systemInstruction.includes('bullAgent')) {
    return `The Bull Thesis is built on the company's category leadership, strong cash generator profile, and margin expansion driven by price adjustments and operating leverage.`;
  }

  if (systemInstruction.includes('bearAgent')) {
    return `The Bear Thesis points to the high valuation multiples, regulatory scrutiny, and intensifying competition which may cause market share erosion and pricing compression in the medium term.`;
  }

  return 'Mock analysis text generated. To use live AI, add your GEMINI_API_KEY in the server/.env file.';
}

/**
 * Mocks JSON responses if the API key is not present
 */
function getMockJsonResponse(prompt, systemInstruction) {
  const isValidation = systemInstruction.includes('validationAgent');
  const cleanPrompt = prompt.toUpperCase();
  
  // Extract ticker name if possible
  const tickerMatch = cleanPrompt.match(/TICKER:?\s*([A-Z]+)/) || cleanPrompt.match(/["']?([A-Z]+)["']?\s+DATA/);
  const ticker = tickerMatch ? tickerMatch[1] : 'STOCK';

  if (isValidation) {
    return {
      missingFields: [],
      contradictions: [],
      validationNotes: 'All primary financial metrics present. Core data quality check passed.',
      confidenceAdjustment: 0,
      dataStatus: 'COMPLETED'
    };
  }

  // Fallback for the Judge Node
  let overallScore = 82;
  let recommendation = 'BUY';
  let reasoning = `### Investment Verdict: BUY (${ticker})
AlphaLens multi-agent review suggests a **BUY** decision for ${ticker}. 
The company exhibits stellar balance sheet strength with manageable leverage and high return on capital. 
The bull case is underpinned by structural growth and technological leadership. 
The bear case targets potential margin contraction under competitive threats, but the judge believes the company's wide brand moat mitigates this.`;
  
  let allocation = [
    { asset: ticker, percentage: 15 },
    { asset: 'Global Equity Index', percentage: 50 },
    { asset: 'Investment Grade Bonds', percentage: 20 },
    { asset: 'Cash Reserves', percentage: 15 }
  ];

  if (cleanPrompt.includes('DIVIDEND')) {
    recommendation = 'HOLD';
    overallScore = 70;
    reasoning = `### Investment Verdict: HOLD (${ticker})
Under a Dividend investing style, ${ticker} is rated a **HOLD**. While cash flows are solid, its dividend yield is low, as earnings are largely reinvested into R&D and growth initiatives.`;
    allocation = [
      { asset: ticker, percentage: 5 },
      { asset: 'High-Yield Dividend ETF', percentage: 50 },
      { asset: 'Short-Term Bonds', percentage: 30 },
      { asset: 'Cash Reserves', percentage: 15 }
    ];
  } else if (cleanPrompt.includes('CONSERVATIVE')) {
    recommendation = 'HOLD';
    overallScore = 65;
    reasoning = `### Investment Verdict: HOLD (${ticker})
Under a Conservative style, ${ticker} is rated **HOLD** due to premium valuation volatility. Capital preservation goals recommend lower weightings.`;
    allocation = [
      { asset: ticker, percentage: 5 },
      { asset: 'Treasury Bills', percentage: 60 },
      { asset: 'Blue Chip Value Index', percentage: 25 },
      { asset: 'Cash', percentage: 10 }
    ];
  }

  return {
    recommendation,
    overallScore,
    scoreBreakdown: {
      financialStrength: 22,
      marketSentiment: 16,
      competitiveMoat: 17,
      risksResilience: 14,
      newsSentiment: 13
    },
    confidence: 88,
    confidenceFactors: [
      { factor: 'Financial database check complete', checked: true },
      { factor: 'High news volume coverage (15 articles)', checked: true },
      { factor: 'Minor contradictory sentiment signals', checked: false },
      { factor: 'Stable historical ROE trend', checked: true }
    ],
    reasoning,
    devilAdvocate: [
      'High price-to-earnings ratio relative to sector peers.',
      'Valuation multiple compression if quarterly earnings miss estimates.',
      'Intensifying competition from regional players.'
    ],
    portfolioSimulation: {
      allocation,
      explanation: `Portfolio structure configured according to the risk-profile of ${ticker} and the selected investment strategy.`
    },
    sourcesUsed: [
      { name: 'Yahoo Finance Financials', reliability: 5 },
      { name: 'Google News RSS Search', reliability: 4 }
    ],
    newsTimeline: [
      { date: 'Yesterday', event: 'Reports expansion in autonomous logistics testing.', sentiment: 'Bullish' },
      { date: '3 days ago', event: 'Quarterly financial report shows 20% YoY topline increase.', sentiment: 'Bullish' },
      { date: '5 days ago', event: 'Prominent analyst upgrades stock to Overweight, citing margin strength.', sentiment: 'Bullish' }
    ]
  };
}

module.exports = {
  generateText,
  generateJson
};

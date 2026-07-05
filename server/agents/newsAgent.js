const rssNewsService = require('../services/rssNewsService');
const geminiService = require('../services/geminiService');
const { SYSTEM_PROMPTS } = require('../prompts/agentPrompts');

/**
 * News Agent Node
 * Analyzes market news headlines, feeds them to the LLM, and resolves sentiment.
 */
async function newsAgent(state) {
  const startTime = Date.now();
  const query = state.companyName || state.ticker;
  
  console.log(`[NewsAgent] Fetching news for "${query}"...`);
  
  let news = [];
  try {
    news = await rssNewsService.fetchNews(query, 12);
  } catch (error) {
    console.error(`[NewsAgent] Failed to fetch news for "${query}":`, error.message);
  }

  // Format articles for the prompt
  const articlesContext = news.map((art, idx) => {
    return `[Article ${idx + 1}]
Title: ${art.title}
Source: ${art.source} (Reliability: ${art.reliability}/5)
Date: ${art.pubDate}
Snippet: ${art.snippet}
---`;
  }).join('\n');

  const prompt = `Ticker: ${state.ticker}
Company: ${state.companyName}
News Feed:
${articlesContext || 'No news articles found.'}`;

  let newsAnalysis = '';
  let sentiment = 'Neutral';
  
  if (news.length > 0) {
    try {
      newsAnalysis = await geminiService.generateText(prompt, SYSTEM_PROMPTS.newsAgent);
      
      // Determine overall sentiment from analysis
      const lowerAnalysis = newsAnalysis.toLowerCase();
      if (lowerAnalysis.includes('overall sentiment: positive') || lowerAnalysis.includes('sentiment: positive') || lowerAnalysis.includes('positive sentiment')) {
        sentiment = 'Positive';
      } else if (lowerAnalysis.includes('overall sentiment: negative') || lowerAnalysis.includes('sentiment: negative') || lowerAnalysis.includes('negative sentiment')) {
        sentiment = 'Negative';
      }
    } catch (error) {
      console.error(`[NewsAgent] LLM generation failed:`, error.message);
      newsAnalysis = 'News sentiment analysis unavailable due to API errors.';
    }
  } else {
    newsAnalysis = 'No recent news articles found for this company.';
  }

  const executionTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
  
  // Calculate confidence based on article quantity and source reliability
  let newsConfidence = 50; // default with no news
  if (news.length > 0) {
    const avgReliability = news.reduce((sum, art) => sum + art.reliability, 0) / news.length;
    newsConfidence = Math.min(100, Math.round(50 + (news.length * 2) + (avgReliability * 5)));
  }

  return {
    news,
    newsAnalysis,
    newsSentiment: sentiment,
    executionTimes: {
      ...state.executionTimes,
      newsAgent: executionTime
    },
    confidenceScores: {
      ...state.confidenceScores,
      newsAgent: newsConfidence
    }
  };
}

module.exports = newsAgent;

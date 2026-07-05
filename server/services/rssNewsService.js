const Parser = require('rss-parser');
const parser = new Parser();

/**
 * Fetches recent news articles for a given company name or ticker
 * @param {string} query - The search query (e.g. "TSLA" or "Tesla")
 * @param {number} limit - Maximum number of articles to return (default: 15)
 * @returns {Promise<Array>} List of articles
 */
async function fetchNews(query, limit = 15) {
  if (!query) return [];

  // Search for the stock specifically to get market news
  const searchQuery = `${query} stock`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const feed = await parser.parseURL(url);
    const articles = [];

    const items = feed.items || [];
    const count = Math.min(items.length, limit);

    for (let i = 0; i < count; i++) {
      const item = items[i];
      let title = item.title || '';
      let source = 'Google News';

      // Parse the source from the title (e.g. "Tesla stock hits record high - CNBC")
      const sourceMatch = title.match(/(.*) - ([^-]+)$/);
      if (sourceMatch) {
        title = sourceMatch[1].trim();
        source = sourceMatch[2].trim();
      }

      // Assign a reliability rating for standard news sources
      let reliability = 4; // Default: 4 stars
      const lowCaseSource = source.toLowerCase();
      
      if (lowCaseSource.includes('sec') || lowCaseSource.includes('filing') || lowCaseSource.includes('report')) {
        reliability = 5;
      } else if (
        lowCaseSource.includes('bloomberg') || 
        lowCaseSource.includes('reuters') || 
        lowCaseSource.includes('wsj') || 
        lowCaseSource.includes('wall street journal') ||
        lowCaseSource.includes('ft') || 
        lowCaseSource.includes('financial times') ||
        lowCaseSource.includes('cnbc') ||
        lowCaseSource.includes('yahoo finance')
      ) {
        reliability = 5;
      } else if (
        lowCaseSource.includes('motley fool') || 
        lowCaseSource.includes('seeking alpha') || 
        lowCaseSource.includes('investing.com') ||
        lowCaseSource.includes('marketwatch') ||
        lowCaseSource.includes('barrons')
      ) {
        reliability = 4;
      } else if (
        lowCaseSource.includes('blog') || 
        lowCaseSource.includes('wordpress') || 
        lowCaseSource.includes('reddit') || 
        lowCaseSource.includes('forum')
      ) {
        reliability = 2;
      }

      articles.push({
        title,
        link: item.link,
        pubDate: item.pubDate,
        isoDate: item.isoDate,
        source,
        reliability,
        snippet: item.contentSnippet || item.content || ''
      });
    }

    return articles;
  } catch (error) {
    console.error(`Error fetching news RSS for "${query}":`, error.message);
    return [];
  }
}

module.exports = {
  fetchNews
};

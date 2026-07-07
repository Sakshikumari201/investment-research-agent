import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60 seconds (LangGraph pipeline can take some time if LLM calls are sequential)
});

/**
 * Trigger investment research analysis
 * @param {string} company - Company name or ticker
 * @param {string} persona - Investment persona style (e.g. value, growth)
 */
export const analyzeCompany = async (company, persona) => {
  try {
    const response = await api.get('/analyze', {
      params: { company, persona },
    });
    return response.data;
  } catch (error) {
    console.error('API Error in analyzeCompany:', error);
    throw error.response?.data || new Error('Network or Server error in Analysis Pipeline');
  }
};

/**
 * Compare two companies side-by-side
 * @param {string} comp1 - First company symbol/name
 * @param {string} comp2 - Second company symbol/name
 * @param {string} persona - Investment persona style
 */
export const compareCompanies = async (comp1, comp2, persona) => {
  try {
    const response = await api.get('/compare', {
      params: { comp1, comp2, persona },
    });
    return response.data;
  } catch (error) {
    console.error('API Error in compareCompanies:', error);
    throw error.response?.data || new Error('Network or Server error in Comparison Pipeline');
  }
};

/**
 * Flush cache entries (dev utility)
 */
export const clearAnalysisCache = async () => {
  try {
    const response = await api.post('/cache/clear');
    return response.data;
  } catch (error) {
    console.error('API Error in clearAnalysisCache:', error);
    throw error.response?.data || new Error('Failed to clear cache');
  }
};

export default {
  analyzeCompany,
  compareCompanies,
  clearAnalysisCache,
};

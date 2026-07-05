import React, { useState, useEffect } from 'react';
import { Search, Star, Copy, Download, RefreshCw, AlertTriangle, Briefcase, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import { analyzeCompany } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import MetricCard from '../components/MetricCard';
import Stepper from '../components/Stepper';

export function Dashboard({
  onAddWatchlist = () => {},
  onAddHistory = () => {},
  watchlist = [],
  selectedTicker = null,
  clearSelectedTicker = () => {}
}) {
  // Input fields
  const [searchQuery, setSearchQuery] = useState('');
  const [persona, setPersona] = useState('GROWTH');
  
  // Loading & Progress states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // 0 to 9 index for stepper simulation
  const [error, setError] = useState(null);

  // Analysis result
  const [result, setResult] = useState(null);

  // Feature Toggles
  const [eli15Mode, setEli15Mode] = useState(false);
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [selectedHorizon, setSelectedHorizon] = useState('MEDIUM'); // SHORT, MEDIUM, LONG

  // Load selected ticker from sidebar if click event fires
  useEffect(() => {
    if (selectedTicker) {
      setSearchQuery(selectedTicker);
      handleAnalyze(null, selectedTicker);
      clearSelectedTicker();
    }
  }, [selectedTicker]);

  // Stepper text descriptions during loading simulation
  const loadingStepsText = [
    'Supervisor: Directing ticker symbol resolver...',
    'Financial Agent: Fetching raw balance sheets & metrics...',
    'Validation Agent: Auditing data files for contradictions...',
    'News Agent: Scraping RSS headlines & calculating sentiment...',
    'Competition Agent: Mapping competitive moats & benchmarking peers...',
    'Risk Agent: Categorizing leverage & regulatory headwinds...',
    'Market Intelligence Agent: Querying sector growth forecasts...',
    'Bull Analyst: Compiling the growth optimization thesis...',
    'Bear Analyst: Documenting contrarian risk vectors...',
    'Judge Node: Weighing debate arguments & printing report...'
  ];

  // Simulated stepper counts during loading
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < 9) return prev + 1;
          return prev;
        });
      }, 2500); // Progress through steps every 2.5s
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e, directTicker = null) => {
    if (e) e.preventDefault();
    const query = directTicker || searchQuery;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCompany(query, persona);
      setResult(data);
      onAddHistory(data);
    } catch (err) {
      setError(err.message || 'The multi-agent pipeline experienced a connection timeout. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const summaryText = `
ALPHA LENS AI INVESTMENT REPORT - ${result.companyName} (${result.ticker})
Recommendation: ${result.decision.recommendation} | Overall Score: ${result.decision.overallScore}/100 | Confidence: ${result.decision.confidence}%
Investing Persona: ${result.persona}

VERDICT REASONING:
${result.decision.reasoning}

PORTFOLIO ALLOCATION:
${result.decision.portfolioSimulation.explanation}
    `;
    navigator.clipboard.writeText(summaryText);
    alert('Markdown Investment Report copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  const isPinned = result && watchlist.includes(result.ticker);

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto px-8 py-6">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            AlphaLens Investment Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Institutional multi-agent stock scanner and risk validation analyzer.
          </p>
        </div>

        {/* Feature Switches */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInterviewMode(!isInterviewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isInterviewMode
                ? 'bg-gradient-to-r from-accent-600 to-indigo-600 text-white border-transparent glow-accent'
                : 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HelpCircle size={14} />
            Interview Q&A Mode
          </button>

          {result && (
            <>
              <button
                onClick={handleCopyReport}
                className="p-2 text-slate-400 border border-slate-800 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
                title="Copy markdown report"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-slate-400 border border-slate-800 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
                title="Download printable report"
              >
                <Download size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Search Controller Bar */}
      <form onSubmit={(e) => handleAnalyze(e)} className="flex flex-wrap gap-4 items-center bg-slate-950/80 p-5 rounded-2xl border border-slate-900/60 mb-8">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Company or Stock Ticker (e.g. Tesla, Apple, NVDA)..."
            className="w-full bg-[#0d121f] text-white border border-slate-800/80 focus:border-accent-500 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none transition-colors"
            disabled={loading}
          />
        </div>

        {/* Persona Select */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Persona:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-[#0d121f] text-white border border-slate-800/80 focus:border-accent-500 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none transition-colors"
            disabled={loading}
          >
            <option value="GROWTH">Growth Investor</option>
            <option value="VALUE">Value Investor</option>
            <option value="DIVIDEND">Dividend Investor</option>
            <option value="AGGRESSIVE">Aggressive Strategist</option>
            <option value="CONSERVATIVE">Conservative preservation</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !searchQuery.trim()}
          className="bg-accent-600 hover:bg-accent-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Executing Pipeline...' : 'Run Agents Scan'}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/40 text-rose-300 rounded-2xl p-5 mb-8 flex gap-3 items-start">
          <AlertTriangle className="text-rose-500 shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-sm">Pipeline Compilation Error</h4>
            <p className="text-xs text-rose-400/90 mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Steps Stepper Section */}
      {loading && (
        <div className="glass-card rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-center justify-between border-accent-500/20 animate-pulse-subtle">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
              <h3 className="text-lg font-bold text-white">AI Agents Assembling...</h3>
            </div>
            <p className="text-sm font-medium text-slate-300 bg-slate-900/60 border border-slate-800/80 px-4 py-3 rounded-xl italic">
              "{loadingStepsText[loadingStep]}"
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-accent-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(loadingStep + 1) * 10}%` }}
              />
            </div>
          </div>
          <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
            <Stepper 
              executionTimes={{}} 
              confidenceScores={{}} 
              activeStepIndex={loadingStep} 
            />
          </div>
        </div>
      )}

      {/* Result Report Body */}
      {result && !loading && (
        <div className="flex flex-col gap-8">
          {/* Served from Cache Alert banner */}
          {result.isCached && (
            <div className="bg-amber-950/20 border border-amber-900/40 text-amber-300 rounded-xl px-4 py-2.5 flex justify-between items-center text-xs">
              <span className="font-semibold">⚡ Served from Cache (Analyses are cached for 10 minutes to save API cost).</span>
              <span>Last updated: {result.cachedTimeAgo || 'just now'}</span>
            </div>
          )}

          {/* Header Verdict Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden border-slate-800/80">
            {/* Glowing background badge */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl" />

            <div className="flex-1 flex flex-col gap-3 z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{result.companyName}</h3>
                <span className="text-sm font-bold text-accent-400 bg-accent-950 border border-accent-900 px-2 py-0.5 rounded tracking-wider">{result.ticker}</span>
                <button
                  onClick={() => onAddWatchlist(result.ticker)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isPinned 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                      : 'text-slate-500 border-slate-800 hover:text-white hover:bg-slate-900'
                  }`}
                  title={isPinned ? "Remove from watchlist" : "Add to watchlist"}
                >
                  <Star size={16} className={isPinned ? "fill-amber-500" : ""} />
                </button>
              </div>

              {/* Recommendation and summary badges */}
              <div className="flex flex-wrap items-center gap-6 mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recommendation</span>
                  <span className={`text-xl font-black mt-0.5 flex items-center gap-1.5 ${
                    result.decision.recommendation === 'BUY' 
                      ? 'text-emerald-400' 
                      : result.decision.recommendation === 'SELL' 
                        ? 'text-rose-400' 
                        : 'text-amber-400'
                  }`}>
                    {result.decision.recommendation === 'BUY' ? '✅ INVEST (BUY)' : result.decision.recommendation === 'SELL' ? '🚨 PASS (SELL)' : '⚠️ HOLD'}
                  </span>
                </div>

                <div className="flex flex-col border-l border-slate-800 pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Stock Price</span>
                  <span className="text-xl font-bold mt-0.5 text-slate-200">
                    {result.financials.price ? `${result.financials.currency === 'INR' ? '₹' : '$'}${result.financials.price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>

                <div className="flex flex-col border-l border-slate-800 pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Investing Persona</span>
                  <span className="text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded-full mt-1">
                    {result.persona} Style
                  </span>
                </div>
              </div>
            </div>

            {/* Score Gauges */}
            <div className="flex items-center gap-8 z-10">
              <ScoreGauge 
                value={result.decision.overallScore} 
                subtitle="Overall Score" 
                size={110} 
              />
              <ScoreGauge 
                value={result.decision.confidence} 
                subtitle="Confidence" 
                size={110}
                colorClass="text-indigo-400"
              />
            </div>
          </div>

          {/* Granular Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Revenue Growth"
              value={result.financials.revenueGrowth ? `${(result.financials.revenueGrowth * 100).toFixed(1)}%` : 'N/A'}
              trend="YoY"
              source="Yahoo Finance"
              reliability={5}
              explanation="Calculated as year-over-year revenue growth from the latest quarterly filings. High percentages show strong expansion power."
              benchmark="15-20% sector baseline"
              isInterviewMode={isInterviewMode}
            />
            <MetricCard
              title="Profit Margin"
              value={result.financials.netMargin ? `${(result.financials.netMargin * 100).toFixed(1)}%` : 'N/A'}
              trend="Net"
              source="Yahoo Finance"
              reliability={5}
              explanation="Net income divided by revenue. Indicates how many cents of profit a business retains for each dollar of sale."
              benchmark="10% average margins"
              isInterviewMode={isInterviewMode}
            />
            <MetricCard
              title="P/E Ratio"
              value={result.financials.peRatio ? result.financials.peRatio.toFixed(1) : 'N/A'}
              trend="Trailing"
              source="Yahoo Finance"
              reliability={5}
              explanation="Price-to-Earnings ratio. Compares the current stock price with earnings per share. High PE indicates investors expect massive future growth."
              benchmark="25-30 industry median"
              isInterviewMode={isInterviewMode}
            />
            <MetricCard
              title="Debt-to-Equity"
              value={result.financials.debtToEquity ? result.financials.debtToEquity.toFixed(2) : '0.00'}
              trend="Leverage"
              source="Yahoo Finance"
              reliability={5}
              explanation="Measures how highly leveraged a company is. Lower D/E values indicate that the company operates mostly using equity rather than borrow capital."
              benchmark="D/E < 1.5 is safe"
              isInterviewMode={isInterviewMode}
            />
            <MetricCard
              title="News Sentiment"
              value={result.newsSentiment}
              trend=""
              source="Google News RSS"
              reliability={4}
              explanation="Compiled using news headlines sentiment mapping. Measures public sentiment momentum surrounding current operations."
              benchmark="Neutral is average baseline"
              isInterviewMode={isInterviewMode}
            />
          </div>

          {/* Explainability Tree & Confidence breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Explainability Tree Card */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Explainability Decision Tree
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm font-bold text-white bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="flex items-center gap-2">🌲 Overall Decision Score</span>
                  <span className="text-accent-400">{result.decision.overallScore} / 100</span>
                </div>

                {/* Score breakdown tree branches */}
                <div className="pl-4 flex flex-col gap-2.5 border-l border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">├─ 📊 Financial Strength</span>
                    <span className="font-semibold text-slate-200">{result.decision.scoreBreakdown.financialStrength} / 25</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">├─ 📢 Market Sentiment</span>
                    <span className="font-semibold text-slate-200">{result.decision.scoreBreakdown.marketSentiment} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">├─ 🛡️ Competitive Moat</span>
                    <span className="font-semibold text-slate-200">{result.decision.scoreBreakdown.competitiveMoat} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">├─ ⚠️ Risk Resilience</span>
                    <span className="font-semibold text-slate-200">{result.decision.scoreBreakdown.risksResilience} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 flex items-center gap-1">└─ 📰 News Sentiment</span>
                    <span className="font-semibold text-slate-200">{result.decision.scoreBreakdown.newsSentiment} / 15</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Explanation Card */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Confidence Explanation
              </h3>
              <div className="flex flex-col gap-3">
                {result.decision.confidenceFactors.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-slate-900/40 rounded-lg border border-slate-900/60">
                    <span className="text-slate-300 font-medium">{item.factor}</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      item.checked 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                        : 'bg-rose-950 text-rose-400 border border-rose-900'
                    }`}>
                      {item.checked ? 'VALID' : 'CONFLICT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Investment Horizon & Bull vs Bear cases */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bull vs Bear Thesis */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  AI Debate: Bull Case vs Bear Case
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bull Thesis card */}
                <div className="bg-emerald-950/5 border border-emerald-900/20 p-4 rounded-xl">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950 border border-emerald-900 px-2 py-0.5 rounded">
                    📈 Bull Case (Long)
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line mt-3">
                    {result.bullAnalysis}
                  </div>
                </div>

                {/* Bear Thesis card */}
                <div className="bg-rose-950/5 border border-rose-900/20 p-4 rounded-xl">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider bg-rose-950 border border-rose-900 px-2 py-0.5 rounded">
                    📉 Bear Case (Short)
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line mt-3">
                    {result.bearAnalysis}
                  </div>
                </div>
              </div>
            </div>

            {/* Devil's Advocate Risk Box */}
            <div className="glass-card rounded-2xl p-6 border-rose-900/20">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-1.5">
                <AlertTriangle size={16} /> AI Devil's Advocate
              </h3>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                "If this recommendation goes wrong, what will be the primary drivers of failure?"
              </p>
              <div className="flex flex-col gap-2.5">
                {result.decision.devilAdvocate.map((pt, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs bg-rose-950/5 border border-rose-900/10 p-3 rounded-lg">
                    <span className="text-rose-500 font-bold shrink-0">{idx + 1}.</span>
                    <span className="text-slate-300 leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reasoning Panel & Interactive Stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reasoning text report */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Investment Rationale & Reasoning
                </h3>
                <button
                  onClick={() => setEli15Mode(!eli15Mode)}
                  className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${
                    eli15Mode 
                      ? 'bg-accent-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {eli15Mode ? 'Show Raw' : "Explain like I'm 15"}
                </button>
              </div>

              {eli15Mode ? (
                <div className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                  <p className="font-semibold text-accent-400 mb-2">Simulating ELI15 breakdown...</p>
                  <p className="italic">
                    "Think of {result.companyName} like a popular lemonade stand at school. Right now, they are selling lots of lemonade and expanding to new blocks (growth is fast). They have secret recipes that other kids don't have (competitor moat). However, the cups they buy are expensive, and they borrowed some money from their parents to build the stand (debt). The judge believes that since people love lemonade, the stand will make enough allowance to pay back their parents and buy cheaper cups in the future, so it is a good idea to partner with them."
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line max-h-[400px] overflow-y-auto bg-slate-900/20 p-4 rounded-xl border border-slate-900">
                  {result.decision.reasoning}
                </div>
              )}
            </div>

            {/* Interactive Stepper in Dashboard */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Interactive Pipeline Report
              </h3>
              <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
                Click on any completed step to inspect the direct context analyzed by that specific agent.
              </p>
              <Stepper
                executionTimes={result.executionTimes}
                confidenceScores={result.confidenceScores}
                agentOutputs={result}
                activeStepIndex={-1}
              />
            </div>
          </div>

          {/* Portfolio Allocator Simulator & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Simulator Card */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Briefcase size={16} /> Asset Allocation Simulator
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Recommended portfolio allocation of a hypothetical ₹100,000 portfolio:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Mock Circular Pie chart representation */}
                <div className="w-40 h-40 rounded-full border border-slate-800 flex items-center justify-center relative shrink-0">
                  <div className="w-28 h-28 rounded-full bg-slate-950 flex flex-col items-center justify-center border border-slate-900 text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Target asset</span>
                    <span className="text-sm font-black text-accent-400">{result.decision.portfolioSimulation.allocation[0]?.percentage || 0}%</span>
                  </div>
                  {/* Allocation ticks */}
                  <div className="absolute inset-0 border-4 border-dashed border-accent-600/30 rounded-full animate-spin-slow" />
                </div>

                <div className="flex-1 flex flex-col gap-2.5 w-full">
                  {result.decision.portfolioSimulation.allocation.map((alloc, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 bg-[#0d121f] rounded-lg border border-slate-900">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          idx === 0 ? 'bg-accent-500' : idx === 1 ? 'bg-indigo-500' : idx === 2 ? 'bg-emerald-500' : 'bg-slate-500'
                        }`} />
                        {alloc.asset}
                      </span>
                      <span className="font-black text-white">{alloc.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 italic bg-slate-900/40 p-3 rounded-lg border border-slate-900 leading-relaxed">
                "{result.decision.portfolioSimulation.explanation}"
              </p>
            </div>

            {/* Timeline & News List Card */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Sentiment News Timeline
              </h3>
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {result.decision.newsTimeline && result.decision.newsTimeline.length > 0 ? (
                  result.decision.newsTimeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-xs border-b border-slate-900/60 pb-3 last:border-b-0">
                      <div className="shrink-0 flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{item.date}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase mt-1 ${
                          item.sentiment === 'Bullish' || item.sentiment === 'Positive'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-rose-400'
                        }`}>
                          {item.sentiment}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{item.event}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No historical sentiment events logged.</p>
                )}
              </div>
            </div>
          </div>

          {/* Hidden Interview Mode Cards */}
          {isInterviewMode && (
            <div className="glass-card rounded-2xl p-6 border-indigo-500/20 bg-indigo-950/5 animate-slide-down">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
                💼 Interview Defense Assistant
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Anticipated questions recruiters or investment committees might ask regarding this recommendation, complete with data-backed defense arguments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-white">Q1: Why is this recommendation justified despite high PE multiples?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Defense: "Our Financial Agent reports a PE of {result.financials.peRatio ? result.financials.peRatio.toFixed(1) : 'N/A'}. However, this is justified by the {result.financials.revenueGrowth ? (result.financials.revenueGrowth * 100).toFixed(1) + '%' : 'N/A'} revenue growth and positive cash flows. The Competitive Agent highlights a wide brand/switching-cost moat, ensuring high gross margins of {result.financials.grossMargin ? (result.financials.grossMargin * 100).toFixed(1) + '%' : 'N/A'} are defended against competitors."
                  </p>
                </div>

                <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-white">Q2: How does the agent account for news sentiment volatility?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Defense: "The News Agent parsed {result.news?.length || 0} articles using Google News RSS, logging a reliability rating of {result.decision?.sourcesUsed[1]?.reliability || '4'}/5 stars. The overall news sentiment is evaluated as {result.newsSentiment}, which filters short-term noise by cross-validating headlines against underlying financial growth trends."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

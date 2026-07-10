import React, { useState, useEffect } from 'react';
import { Search, Star, Copy, Download, AlertTriangle, Briefcase, HelpCircle, ShieldAlert, Cpu, Terminal, Sparkles, HelpCircle as HelpIcon } from 'lucide-react';
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

  // Custom debate balance ratio calculations
  const debateRatio = result ? result.decision.overallScore : 50;

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto px-8 py-6 relative">
      {/* Dynamic Energy Orbs */}
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="orb-3" />
      
      {/* Cyber Grid background layout */}
      <div className="cyber-grid" />

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-[#0e1627] pb-5 gap-4 relative z-10 font-tech">
        <div>
          <h2 className="text-xl font-black tracking-widest text-white flex items-center gap-2">
            <Cpu className="text-accent-500 animate-pulse" size={20} />
            <span>QUANT_ANALYSIS_TERMINAL</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
            // Institutional multi-agent stock scanner and risk validation engine
          </p>
        </div>

        {/* Feature Switches */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsInterviewMode(!isInterviewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 border transition-all duration-300 ${
              isInterviewMode
                ? 'bg-indigo-950/60 text-indigo-400 border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                : 'text-slate-400 border-slate-900 hover:text-white hover:bg-slate-950/40'
            }`}
          >
            <ShieldAlert size={12} className="text-indigo-400" />
            Interview Defense Mode
          </button>

          {result && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="p-2 text-slate-400 border border-slate-900 bg-slate-950/60 rounded-lg hover:text-white hover:border-slate-800 transition-colors"
                title="Copy markdown report"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-slate-400 border border-slate-900 bg-slate-950/60 rounded-lg hover:text-white hover:border-slate-800 transition-colors"
                title="Print telemetry dossier"
              >
                <Download size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Search Console Board */}
      <form 
        onSubmit={(e) => handleAnalyze(e)} 
        className="hud-panel rounded-2xl p-5 mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center relative z-10 font-tech"
      >
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 text-slate-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ENTER TICKER / COMPANY IDENTIFIER (e.g. NVDA, APPLE, TSLA)..."
            className="w-full bg-slate-950/80 text-white font-mono border border-slate-900 focus:border-accent-500/60 focus:shadow-[0_0_10px_rgba(14,165,233,0.1)] rounded-xl py-3 pl-12 pr-4 text-xs font-semibold focus:outline-none transition-all uppercase placeholder-slate-700"
            disabled={loading}
          />
        </div>

        {/* Persona Selector HUD */}
        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-900">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">PERSONA_SYS:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            disabled={loading}
          >
            <option value="GROWTH" className="bg-slate-900 text-slate-200">Growth Aggregator</option>
            <option value="VALUE" className="bg-slate-900 text-slate-200">Value Audit</option>
            <option value="DIVIDEND" className="bg-slate-900 text-slate-200">Dividend Yield Audit</option>
            <option value="AGGRESSIVE" className="bg-slate-900 text-slate-200">Aggressive Alpha</option>
            <option value="CONSERVATIVE" className="bg-slate-900 text-slate-200">Conservative Shield</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !searchQuery.trim()}
          className="bg-accent-600 hover:bg-accent-500 disabled:bg-slate-950 disabled:text-slate-700 disabled:border-slate-900 border border-accent-500/20 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] shrink-0"
        >
          {loading ? 'RUNNING_DAG_FLOW...' : 'EXECUTE_PIPELINE'}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="hud-panel hud-panel-rose rounded-2xl p-5 mb-8 flex gap-3.5 items-start relative z-10 animate-pulse-subtle">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
          <div className="font-tech">
            <h4 className="font-black text-xs uppercase tracking-widest text-rose-400">Pipeline Compilation Failure</h4>
            <p className="text-xs text-rose-200 font-mono mt-1.5 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-rose-900/10">{error}</p>
          </div>
        </div>
      )}

      {/* Live Telemetry Loader Screen */}
      {loading && (
        <div className="hud-panel rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-center justify-between border-accent-500/20 relative overflow-hidden z-10">
          {/* Scanning laser line */}
          <div className="laser-sweep">
            <div className="laser-line" />
          </div>

          <div className="flex-1 flex flex-col gap-4 font-tech w-full">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-accent-400 border-t-transparent animate-spin" />
              <h3 className="text-sm font-black tracking-widest text-white">AI_AGENTS_DAG_ASSEMBLING...</h3>
            </div>
            
            {/* Telemetry Logger Stream */}
            <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl font-mono text-xs text-accent-300 leading-relaxed shadow-inner">
              <span className="text-slate-500 block font-semibold">// STREAMING LIVE PIPELINE DIAGNOSTICS...</span>
              <span className="text-slate-400 block mt-1 leading-relaxed">
                &gt; SYSTEM_TICK: {Date.now()}<br />
                &gt; NODE_STATUS: RUNNING<br />
                &gt; THREAD_PROCESSOR: OK
              </span>
              <p className="text-emerald-400 font-bold mt-2 border-t border-slate-900/60 pt-2 flex items-center gap-1.5">
                <Terminal size={12} />
                <span>"{loadingStepsText[loadingStep]}"</span>
              </p>
            </div>

            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900 p-0.5">
              <div 
                className="bg-gradient-to-r from-accent-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_#0ea5e9]" 
                style={{ width: `${(loadingStep + 1) * 10}%` }}
              />
            </div>
          </div>
          <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-slate-900 pt-6 md:pt-0 md:pl-8">
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
        <div className="flex flex-col gap-8 relative z-10">
          
          {/* Served from Cache Alert banner */}
          {result.isCached && (
            <div className="hud-panel hud-panel-amber rounded-xl px-4.5 py-3 flex flex-wrap justify-between items-center text-xs font-mono font-bold tracking-wider gap-2">
              <span className="text-amber-400 flex items-center gap-1.5 animate-pulse">
                ⚡ SYSTEM_CACHE_HIT: Served from cache (TTL: 10m) to optimize LLM credits.
              </span>
              <span className="text-slate-400">TIMESTAMP: {result.cachedTimeAgo || 'just now'}</span>
            </div>
          )}

          {/* Verdict Header Panel */}
          <div className="hud-panel rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
            {/* Glowing background badge */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl" />

            <div className="flex-1 flex flex-col gap-3.5 z-10 font-tech">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-white tracking-wide">{result.companyName}</h3>
                <span className="text-xs font-bold font-mono text-accent-400 bg-accent-950 border border-accent-900/60 px-2 py-0.5 rounded tracking-widest">{result.ticker}</span>
                <button
                  onClick={() => onAddWatchlist(result.ticker)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isPinned 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                      : 'text-slate-600 border-slate-900 hover:text-white hover:bg-slate-950'
                  }`}
                  title={isPinned ? "Remove from watchlist" : "Add to watchlist"}
                >
                  <Star size={14} className={isPinned ? "fill-amber-500" : ""} />
                </button>
              </div>

              {/* Recommendation and summary badges */}
              <div className="flex flex-wrap items-center gap-8 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">DECISION_RECOMMENDATION</span>
                  <span className={`text-lg font-black mt-0.5 flex items-center gap-1.5 ${
                    result.decision.recommendation === 'BUY' 
                      ? 'text-emerald-400' 
                      : result.decision.recommendation === 'SELL' 
                        ? 'text-rose-400' 
                        : 'text-amber-400'
                  }`}>
                    {result.decision.recommendation === 'BUY' ? 'INVEST (BUY)' : result.decision.recommendation === 'SELL' ? 'PASS (SELL)' : 'HOLD'}
                  </span>
                </div>

                <div className="flex flex-col border-l border-slate-900 pl-8">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">STOCK_UNIT_VAL</span>
                  <span className="text-lg font-black mt-0.5 text-slate-200 font-mono">
                    {result.financials.price ? `${result.financials.currency === 'INR' ? '₹' : '$'}${result.financials.price.toFixed(2)}` : 'N/A'}
                  </span>
                </div>

                <div className="flex flex-col border-l border-slate-900 pl-8">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">AUDIT_STYLE</span>
                  <span className="text-xs font-bold bg-indigo-950/40 text-indigo-300 border border-indigo-900/60 px-2.5 py-0.5 rounded-full mt-1.5 tracking-wider">
                    {result.persona} STYLE
                  </span>
                </div>
              </div>
            </div>

            {/* Score Gauges */}
            <div className="flex items-center gap-6 z-10">
              <ScoreGauge 
                value={result.decision.overallScore} 
                subtitle="Decision Rating" 
                size={105} 
              />
              <ScoreGauge 
                value={result.decision.confidence} 
                subtitle="Confidence Index" 
                size={105}
                colorClass="text-indigo-400"
              />
            </div>
          </div>

          {/* Granular Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              trend="Google News RSS"
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
            <div className="hud-panel rounded-2xl p-6 lg:col-span-2 relative overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-tech">
                Decision Attribution Tree
              </h3>
              <div className="flex flex-col gap-3 font-mono">
                <div className="flex justify-between items-center text-xs font-bold text-white bg-slate-950/80 p-3 rounded-lg border border-slate-900 shadow-inner">
                  <span className="flex items-center gap-2 text-accent-400">
                    <Terminal size={14} /> DECISION_SCORE_RATING
                  </span>
                  <span className="text-accent-400 font-mono font-black">{result.decision.overallScore} / 100</span>
                </div>

                {/* Score breakdown tree branches */}
                <div className="pl-5 flex flex-col gap-2.5 border-l border-slate-900/60 mt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">├─ FINANCIAL_STRENGTH</span>
                    <span className="font-bold text-slate-200 font-mono">{result.decision.scoreBreakdown.financialStrength} / 25</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">├─ MARKET_SENTIMENT</span>
                    <span className="font-bold text-slate-200 font-mono">{result.decision.scoreBreakdown.marketSentiment} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">├─ COMPETITIVE_MOAT</span>
                    <span className="font-bold text-slate-200 font-mono">{result.decision.scoreBreakdown.competitiveMoat} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">├─ RISK_RESILIENCE</span>
                    <span className="font-bold text-slate-200 font-mono">{result.decision.scoreBreakdown.risksResilience} / 20</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">└─ NEWS_SENTIMENT_WEIGHT</span>
                    <span className="font-bold text-slate-200 font-mono">{result.decision.scoreBreakdown.newsSentiment} / 15</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Explanation Card */}
            <div className="hud-panel rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-tech">
                Verification Matrix
              </h3>
              <div className="flex flex-col gap-2.5 font-mono">
                {result.decision.confidenceFactors.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-slate-950/40 rounded-lg border border-slate-900">
                    <span className="text-slate-300 truncate max-w-[170px]">{item.factor}</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      item.checked 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                        : 'bg-rose-950/40 text-rose-400 border border-rose-900/30 animate-pulse'
                    }`}>
                      {item.checked ? 'VALID' : 'CONFLICT'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Debate Arena & Devil's Advocate */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Debate Arena HUD */}
            <div className="hud-panel rounded-2xl p-6 lg:col-span-2 relative">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-5 font-tech">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <Terminal size={14} className="text-accent-500" /> AI Debate Arena: Bull vs Bear
                </h3>
              </div>

              {/* Dynamic debate balance progress bar */}
              <div className="mb-6 font-mono text-xs">
                <div className="flex justify-between text-slate-400 mb-1.5 uppercase font-bold tracking-widest">
                  <span className="text-emerald-400">Bull Analyst Weight ({debateRatio}%)</span>
                  <span className="text-rose-400">Bear Analyst Weight ({100 - debateRatio}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-900 flex">
                  <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: `${debateRatio}%` }} />
                  <div className="bg-rose-500 h-full rounded-r-full" style={{ width: `${100 - debateRatio}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bull Thesis card */}
                <div className="hud-panel hud-panel-emerald rounded-xl p-4 bg-emerald-950/5 flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-emerald-400 text-xs border border-emerald-900 font-mono shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      B
                  </div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest font-tech">
                      BULL_THESIS_OPTIMIZATION
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line mt-3 bg-slate-950/40 p-3.5 rounded-lg border border-slate-900/60 overflow-y-auto max-h-52 scrollbar-thin">
                    {result.bullAnalysis}
                  </div>
                </div>

                {/* Bear Thesis card */}
                <div className="hud-panel hud-panel-rose rounded-xl p-4 bg-rose-950/5 flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-rose-950 flex items-center justify-center font-bold text-rose-400 text-xs border border-rose-900 font-mono shadow-[0_0_8px_rgba(239,68,68,0.3)]">
                      A
                    </div>
                    <span className="text-xs font-black text-rose-400 uppercase tracking-widest font-tech">
                      BEAR_THESIS_CONTRARIAN
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line mt-3 bg-slate-950/40 p-3.5 rounded-lg border border-slate-900/60 overflow-y-auto max-h-52 scrollbar-thin">
                    {result.bearAnalysis}
                  </div>
                </div>
              </div>
            </div>

            {/* Devil's Advocate Risk Box */}
            <div className="hud-panel rounded-2xl p-6 border-rose-900/10 flex flex-col justify-between">
              <div className="font-tech">
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-4 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> AI Devil's Advocate
                </h3>
                
                {/* Warning Hazard Stripe Header */}
                <div className="hazard-stripe-rose border border-rose-900/20 py-2.5 px-3 rounded-lg text-[9px] text-rose-300 font-mono leading-normal mb-4">
                  <span className="font-bold text-rose-500">// RISK ASSESSMENT SHIELD:</span> "If this asset fails, what triggers the breakdown?"
                </div>

                <div className="flex flex-col gap-2.5 font-sans">
                  {result.decision.devilAdvocate.map((pt, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-[11px] p-3 rounded-lg bg-slate-950/60 border border-slate-900">
                      <span className="text-rose-500 font-bold font-mono">{idx + 1}.</span>
                      <span className="text-slate-400 leading-relaxed font-normal">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning Panel & Interactive Stepper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reasoning text report */}
            <div className="hud-panel rounded-2xl p-6 lg:col-span-2 relative">
              <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-3 font-tech">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  DECISION_RATIONALE_DOSSIER
                </h3>
                <button
                  onClick={() => setEli15Mode(!eli15Mode)}
                  className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md transition-all duration-200 border ${
                    eli15Mode 
                      ? 'bg-accent-950/40 text-accent-400 border-accent-900' 
                      : 'bg-slate-900/60 text-slate-500 border-slate-800 hover:text-white'
                  }`}
                >
                  {eli15Mode ? 'Show Raw' : "ELI15 Breakdown"}
                </button>
              </div>

              {eli15Mode ? (
                <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                  <div className="flex items-center gap-1.5 font-tech text-[10px] text-accent-400 font-bold uppercase tracking-widest mb-2 border-b border-slate-900 pb-1.5">
                    <Sparkles size={13} className="animate-pulse" />
                    <span>Explain Like I'm 15</span>
                  </div>
                  <p className="italic text-slate-300 leading-relaxed">
                    "Think of {result.companyName} like a popular lemonade stand at school. Right now, they are selling lots of lemonade and expanding to new blocks (growth is fast). They have secret recipes that other kids don't have (competitor moat). However, the cups they buy are expensive, and they borrowed some money from their parents to build the stand (debt). The judge believes that since people love lemonade, the stand will make enough allowance to pay back their parents and buy cheaper cups in the future, so it is a good idea to partner with them."
                  </p>
                </div>
              ) : (
                <div className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-line max-h-80 overflow-y-auto bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                  {result.decision.reasoning}
                </div>
              )}
            </div>

            {/* Interactive Stepper in Dashboard */}
            <div className="hud-panel rounded-2xl p-6">
              <div className="font-tech mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Pipeline Inspector
                </h3>
                <p className="text-[9px] text-slate-500 mt-1 uppercase leading-normal">
                  // Inspect raw debugger contexts analyzed by separate research nodes
                </p>
              </div>
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
            <div className="hud-panel rounded-2xl p-6 relative">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 font-tech">
                <Briefcase size={15} /> Asset Allocation Matrix
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-tech uppercase tracking-wider">
                Recommended target distribution of a hypothetical ₹100,000 portfolio:
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 font-tech">
                {/* Rotating holographic target compass */}
                <div className="w-40 h-40 rounded-full border border-slate-900 flex items-center justify-center relative shrink-0">
                  
                  {/* Holographic dotted compass ring */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-accent-600/20 animate-rotate-slow" />
                  
                  {/* Holographic crosshair grid */}
                  <div className="absolute inset-4 rounded-full border border-slate-900/60 flex items-center justify-center animate-rotate-reverse-slow">
                    <div className="w-0.5 h-full bg-slate-900/40 absolute" />
                    <div className="h-0.5 w-full bg-slate-900/40 absolute" />
                  </div>

                  <div className="w-28 h-28 rounded-full bg-[#0b1325] flex flex-col items-center justify-center border border-slate-900 text-center relative z-10 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Target allocation</span>
                    <span className="text-base font-black text-accent-400 font-mono mt-1.5">{result.decision.portfolioSimulation.allocation[0]?.percentage || 0}%</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2.5 w-full font-mono text-xs">
                  {result.decision.portfolioSimulation.allocation.map((alloc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-950/80 rounded-lg border border-slate-900">
                      <span className="font-semibold text-slate-300 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          idx === 0 ? 'bg-accent-500 shadow-[0_0_6px_#0ea5e9]' : idx === 1 ? 'bg-indigo-500 shadow-[0_0_6px_#6366f1]' : idx === 2 ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-slate-700'
                        }`} />
                        {alloc.asset}
                      </span>
                      <span className="font-black text-white">{alloc.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-5 italic bg-slate-950/60 p-3.5 rounded-lg border border-slate-900 leading-relaxed font-mono">
                &gt; "{result.decision.portfolioSimulation.explanation}"
              </p>
            </div>

            {/* Timeline & News List Card */}
            <div className="hud-panel rounded-2xl p-6 relative">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 font-tech">
                Sentiment News Stream
              </h3>
              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {result.decision.newsTimeline && result.decision.newsTimeline.length > 0 ? (
                  result.decision.newsTimeline.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-xs border-b border-slate-900/60 pb-3 last:border-b-0 font-mono">
                      <div className="shrink-0 flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase mt-1 ${
                          item.sentiment === 'Bullish' || item.sentiment === 'Positive'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/20'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-900/20'
                        }`}>
                          {item.sentiment}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{item.event}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic font-mono">// No news timeline events logged.</p>
                )}
              </div>
            </div>
          </div>

          {/* Hidden Interview Mode Cards */}
          {isInterviewMode && (
            <div className="hud-panel rounded-2xl p-6 border-indigo-500/20 bg-indigo-950/5 animate-slide-down font-tech">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-1.5">
                💼 Recruiting Defence Intel
              </h3>
              <p className="text-xs text-slate-400 mb-5 uppercase tracking-wide">
                // Defense reasoning matrices designed for recruiters or selection committees:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
                <div className="bg-[#03060c] border border-slate-900 p-4 rounded-xl flex flex-col gap-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-1.5 text-[10px]">// QUESTION 01: Why justify recommendation despite high valuation multiples?</h4>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    Defense argument: "Financial Agent outputs PE ratio of {result.financials.peRatio ? result.financials.peRatio.toFixed(1) : 'N/A'}. This is justified by a {result.financials.revenueGrowth ? (result.financials.revenueGrowth * 100).toFixed(1) + '%' : 'N/A'} year-over-year revenue expansion. Competitive Agent metrics map a wide switching-cost moat, ensuring high gross margins of {result.financials.grossMargin ? (result.financials.grossMargin * 100).toFixed(1) + '%' : 'N/A'} are structurally defended against peers."
                  </p>
                </div>

                <div className="bg-[#03060c] border border-slate-900 p-4 rounded-xl flex flex-col gap-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-slate-300 border-b border-slate-900 pb-1.5 text-[10px]">// QUESTION 02: How does the pipeline discount sentiment volatility?</h4>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    Defense argument: "News Agent audited {result.news?.length || 0} feeds, assigning a news source reliability score of {result.decision?.sourcesUsed[1]?.reliability || '4'}/5 stars. Raw news sentiment maps as {result.newsSentiment}, which scales short-term sentiment spikes by cross-validating indicators directly against long-term fundamental indicators."
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

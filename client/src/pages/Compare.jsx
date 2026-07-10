import React, { useState } from 'react';
import { ArrowRightLeft, Search, AlertTriangle, ShieldCheck, Trophy, Sparkles, Terminal } from 'lucide-react';
import { compareCompanies } from '../services/api';

export function Compare({
  onAddHistory = () => {}
}) {
  const [comp1, setComp1] = useState('');
  const [comp2, setComp2] = useState('');
  const [persona, setPersona] = useState('GROWTH');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [result, setResult] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!comp1.trim() || !comp2.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await compareCompanies(comp1, comp2, persona);
      setResult(data);
      // Add both to history
      if (data.reportA) onAddHistory(data.reportA);
      if (data.reportB) onAddHistory(data.reportB);
    } catch (err) {
      setError(err.message || 'Comparison failed. The backend API failed to respond.');
    } finally {
      setLoading(false);
    }
  };

  const getWinnerBadge = (winnerKey, reportA, reportB) => {
    if (winnerKey === 'TIE') return <span className="text-xs font-mono bg-slate-900 text-slate-400 font-bold px-2.5 py-0.5 rounded border border-slate-800">TIE</span>;
    
    const ticker = winnerKey === 'ASSET_A' ? reportA.ticker : reportB.ticker;
    const isA = winnerKey === 'ASSET_A';

    return (
      <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${
        isA 
          ? 'bg-accent-950/40 text-accent-400 border-accent-900/40 shadow-[0_0_6px_rgba(14,165,233,0.15)]' 
          : 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40 shadow-[0_0_6px_rgba(99,102,241,0.15)]'
      }`}>
        🏆 {ticker}
      </span>
    );
  };

  const formatComparisonMetric = (val) => {
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'number') {
      if (val > 1e9) return `$${(val / 1e9).toFixed(1)}B`;
      return val.toFixed(2);
    }
    return val;
  };

  // Helper to calculate delta progress splits between A and B
  const computeDeltaPercentage = (valA, valB, lowerIsBetter = false) => {
    const numA = parseFloat(valA);
    const numB = parseFloat(valB);

    if (isNaN(numA) || isNaN(numB) || numA === null || numB === null) return 50;
    if (numA === 0 && numB === 0) return 50;

    let scoreA = numA;
    let scoreB = numB;

    if (lowerIsBetter) {
      // Avoid division by zero
      const safeA = numA === 0 ? 0.0001 : numA;
      const safeB = numB === 0 ? 0.0001 : numB;
      scoreA = 1 / Math.abs(safeA);
      scoreB = 1 / Math.abs(safeB);
    } else {
      scoreA = Math.max(0, scoreA);
      scoreB = Math.max(0, scoreB);
    }

    if (scoreA === 0 && scoreB === 0) return 50;

    const total = scoreA + scoreB;
    return Math.round((scoreA / total) * 100);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto px-8 py-6 relative">
      
      {/* Background elements */}
      <div className="orb-1" />
      <div className="orb-2" />
      <div className="orb-3" />
      <div className="cyber-grid" />

      {/* Top Header Control */}
      <div className="flex justify-between items-center mb-8 border-b border-[#0e1627] pb-5 relative z-10 font-tech">
        <div>
          <h2 className="text-xl font-black tracking-widest text-white flex items-center gap-2">
            <ArrowRightLeft className="text-accent-500 animate-pulse" size={20} />
            <span>ASSET_BENCHMARK_ENGINE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">
            // Side-by-side multi-agent delta analysis and benchmark synthesis
          </p>
        </div>
      </div>

      {/* Comparison query input */}
      <form 
        onSubmit={handleCompare} 
        className="hud-panel rounded-2xl p-5 mb-8 flex flex-col lg:flex-row gap-4 items-center relative z-10 font-tech"
      >
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
          {/* Ticker 1 input */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 text-slate-500" size={14} />
            <input
              type="text"
              value={comp1}
              onChange={(e) => setComp1(e.target.value)}
              placeholder="FIRST TICKER (e.g. TSLA)"
              className="w-full bg-slate-950/80 text-white font-mono border border-slate-900 focus:border-accent-500/60 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none transition-all uppercase placeholder-slate-700"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center justify-center text-slate-600 font-black text-xs shrink-0 self-center py-2 sm:py-0 font-mono">
            VS
          </div>

          {/* Ticker 2 input */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 text-slate-500" size={14} />
            <input
              type="text"
              value={comp2}
              onChange={(e) => setComp2(e.target.value)}
              placeholder="SECOND TICKER (e.g. NVDA)"
              className="w-full bg-slate-950/80 text-white font-mono border border-slate-900 focus:border-accent-500/60 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none transition-all uppercase placeholder-slate-700"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Strategy select */}
        <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-900 shrink-0 w-full lg:w-auto">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">STRATEGY_SET:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer w-full lg:w-auto"
            disabled={loading}
          >
            <option value="GROWTH" className="bg-slate-900 text-slate-200">Growth Scanner</option>
            <option value="VALUE" className="bg-slate-900 text-slate-200">Value Audit</option>
            <option value="DIVIDEND" className="bg-slate-900 text-slate-200">Dividend Yield</option>
            <option value="AGGRESSIVE" className="bg-slate-900 text-slate-200">Aggressive Alpha</option>
            <option value="CONSERVATIVE" className="bg-slate-900 text-slate-200">Conservative Shield</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !comp1.trim() || !comp2.trim()}
          className="bg-accent-600 hover:bg-accent-500 disabled:bg-slate-950 disabled:text-slate-700 disabled:border-slate-900 border border-accent-500/20 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] shrink-0 w-full lg:w-auto text-center"
        >
          {loading ? 'COMPILING_METRICS...' : 'BENCHMARK_ASSETS'}
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="hud-panel rounded-2xl p-12 mb-8 flex flex-col items-center justify-center gap-4 border-accent-500/10 relative overflow-hidden z-10">
          <div className="laser-sweep">
            <div className="laser-line" />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
          <h3 className="text-sm font-black tracking-widest text-white font-tech">RUNNING_BENCHMARK_DAG...</h3>
          <p className="text-xs text-slate-400 font-mono text-center max-w-sm uppercase">
            // Aligning data matrix points for side-by-side delta resolution...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="hud-panel hud-panel-rose rounded-2xl p-5 mb-8 flex gap-3.5 items-start relative z-10">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18} />
          <div className="font-tech">
            <h4 className="font-black text-xs uppercase tracking-widest text-rose-400">Benchmark Pipeline Failure</h4>
            <p className="text-xs text-rose-200 font-mono mt-1.5 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-rose-900/10">{error}</p>
          </div>
        </div>
      )}

      {/* Comparison Verdict */}
      {result && !loading && (
        <div className="flex flex-col gap-6 relative z-10">
          
          {/* Main Verdict Card */}
          <div className="hud-panel rounded-2xl p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-900 z-10 font-tech">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 rounded-lg shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  <Trophy size={18} />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">BENCHMARKING_WINNER</span>
                  <h3 className="text-lg font-black text-white tracking-wide mt-0.5">
                    {result.comparison.winner === 'TIE' 
                      ? 'Decision Tie (Hold Both Assets)' 
                      : `${result.comparison.winner === 'ASSET_A' ? result.reportA.ticker : result.reportB.ticker} wins head-to-head`
                    }
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-900 px-4 py-2.5 rounded-xl font-mono text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">FINAL_VERDICT:</span>
                <span className={`font-black px-2 py-0.5 rounded border ${
                  result.comparison.verdict === 'ASSET_A' 
                    ? 'bg-accent-950/40 text-accent-400 border-accent-900/40 shadow-[0_0_6px_#0ea5e9]' 
                    : result.comparison.verdict === 'ASSET_B' 
                      ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40 shadow-[0_0_6px_#6366f1]' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {result.comparison.verdict === 'ASSET_A' ? result.reportA.ticker : result.comparison.verdict === 'ASSET_B' ? reportB.ticker : 'TIE'}
                </span>
              </div>
            </div>

            {/* Verdict summary Monospace Box */}
            <div className="z-10 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-900">
              <span className="text-emerald-500 font-bold block mb-1.5">// SYNTHESIZED_JUDGMENT_MATRIX</span>
              {result.comparison.verdictSummary}
            </div>
          </div>

          {/* Interactive Delta Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quantitative Delta Comparison Panel */}
            <div className="hud-panel rounded-2xl p-6 lg:col-span-2 relative">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 font-tech">
                Quantitative Delta Resolution
              </h3>

              <div className="flex flex-col gap-6 font-mono text-xs">
                {/* Metric Delta Item: Market Cap */}
                <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-slate-400 mb-2 font-bold uppercase">
                    <span className="text-accent-400">{result.reportA.ticker}: {formatComparisonMetric(result.reportA.financials.marketCap)}</span>
                    <span className="text-[11px] tracking-widest text-slate-500">MARKET_CAPITALS</span>
                    <span className="text-indigo-400">{result.reportB.ticker}: {formatComparisonMetric(result.reportB.financials.marketCap)}</span>
                  </div>
                  {/* Delta Bar */}
                  <div className="h-1.5 bg-slate-950 rounded-full border border-slate-900 relative overflow-hidden flex p-0.5">
                    <div className="bg-accent-500 h-full rounded-l-full shadow-[0_0_6px_#0ea5e9]" style={{ width: `${computeDeltaPercentage(result.reportA.financials.marketCap, result.reportB.financials.marketCap)}%` }} />
                    <div className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_6px_#6366f1]" style={{ width: `${100 - computeDeltaPercentage(result.reportA.financials.marketCap, result.reportB.financials.marketCap)}%` }} />
                  </div>
                </div>

                {/* Metric Delta Item: PE Ratio */}
                <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-slate-400 mb-2 font-bold uppercase">
                    <span className="text-accent-400">{result.reportA.ticker}: {formatComparisonMetric(result.reportA.financials.peRatio)}</span>
                    <span className="text-[11px] tracking-widest text-slate-500">P/E_RATIO_VAL (Lower is Better)</span>
                    <span className="text-indigo-400">{result.reportB.ticker}: {formatComparisonMetric(result.reportB.financials.peRatio)}</span>
                  </div>
                  {/* Delta Bar */}
                  <div className="h-1.5 bg-slate-950 rounded-full border border-slate-900 relative overflow-hidden flex p-0.5">
                    <div className="bg-accent-500 h-full rounded-l-full shadow-[0_0_6px_#0ea5e9]" style={{ width: `${computeDeltaPercentage(result.reportA.financials.peRatio, result.reportB.financials.peRatio, true)}%` }} />
                    <div className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_6px_#6366f1]" style={{ width: `${100 - computeDeltaPercentage(result.reportA.financials.peRatio, result.reportB.financials.peRatio, true)}%` }} />
                  </div>
                </div>

                {/* Metric Delta Item: Revenue Growth */}
                <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-slate-400 mb-2 font-bold uppercase">
                    <span className="text-accent-400">{result.reportA.ticker}: {result.reportA.financials.revenueGrowth ? `${(result.reportA.financials.revenueGrowth * 100).toFixed(1)}%` : 'N/A'}</span>
                    <span className="text-[11px] tracking-widest text-slate-500">REVENUE_GROWTH (YoY)</span>
                    <span className="text-indigo-400">{result.reportB.ticker}: {result.reportB.financials.revenueGrowth ? `${(result.reportB.financials.revenueGrowth * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  {/* Delta Bar */}
                  <div className="h-1.5 bg-slate-950 rounded-full border border-slate-900 relative overflow-hidden flex p-0.5">
                    <div className="bg-accent-500 h-full rounded-l-full shadow-[0_0_6px_#0ea5e9]" style={{ width: `${computeDeltaPercentage(result.reportA.financials.revenueGrowth, result.reportB.financials.revenueGrowth)}%` }} />
                    <div className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_6px_#6366f1]" style={{ width: `${100 - computeDeltaPercentage(result.reportA.financials.revenueGrowth, result.reportB.financials.revenueGrowth)}%` }} />
                  </div>
                </div>

                {/* Metric Delta Item: Profit Margin */}
                <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-slate-400 mb-2 font-bold uppercase">
                    <span className="text-accent-400">{result.reportA.ticker}: {result.reportA.financials.netMargin ? `${(result.reportA.financials.netMargin * 100).toFixed(1)}%` : 'N/A'}</span>
                    <span className="text-[11px] tracking-widest text-slate-500">NET_PROFIT_MARGINS</span>
                    <span className="text-indigo-400">{result.reportB.ticker}: {result.reportB.financials.netMargin ? `${(result.reportB.financials.netMargin * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  {/* Delta Bar */}
                  <div className="h-1.5 bg-slate-950 rounded-full border border-slate-900 relative overflow-hidden flex p-0.5">
                    <div className="bg-accent-500 h-full rounded-l-full shadow-[0_0_6px_#0ea5e9]" style={{ width: `${computeDeltaPercentage(result.reportA.financials.netMargin, result.reportB.financials.netMargin)}%` }} />
                    <div className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_6px_#6366f1]" style={{ width: `${100 - computeDeltaPercentage(result.reportA.financials.netMargin, result.reportB.financials.netMargin)}%` }} />
                  </div>
                </div>

                {/* Metric Delta Item: Debt-to-Equity */}
                <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-slate-400 mb-2 font-bold uppercase">
                    <span className="text-accent-400">{result.reportA.ticker}: {result.reportA.financials.debtToEquity ? result.reportA.financials.debtToEquity.toFixed(2) : '0.00'}</span>
                    <span className="text-[11px] tracking-widest text-slate-500">DEBT_TO_EQUITY (Lower is Better)</span>
                    <span className="text-indigo-400">{result.reportB.ticker}: {result.reportB.financials.debtToEquity ? result.reportB.financials.debtToEquity.toFixed(2) : '0.00'}</span>
                  </div>
                  {/* Delta Bar */}
                  <div className="h-1.5 bg-slate-950 rounded-full border border-slate-900 relative overflow-hidden flex p-0.5">
                    <div className="bg-accent-500 h-full rounded-l-full shadow-[0_0_6px_#0ea5e9]" style={{ width: `${computeDeltaPercentage(result.reportA.financials.debtToEquity, result.reportB.financials.debtToEquity, true)}%` }} />
                    <div className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_6px_#6366f1]" style={{ width: `${100 - computeDeltaPercentage(result.reportA.financials.debtToEquity, result.reportB.financials.debtToEquity, true)}%` }} />
                  </div>
                </div>

                {/* Metric Delta Item: Overall score */}
                <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-slate-400 mb-2 font-bold uppercase">
                    <span className="text-accent-400">{result.reportA.ticker}: {result.reportA.decision?.overallScore || 0}/100</span>
                    <span className="text-[11px] tracking-widest text-slate-500">OVERALL_AGENT_SCORE</span>
                    <span className="text-indigo-400">{result.reportB.ticker}: {result.reportB.decision?.overallScore || 0}/100</span>
                  </div>
                  {/* Delta Bar */}
                  <div className="h-1.5 bg-slate-950 rounded-full border border-slate-900 relative overflow-hidden flex p-0.5">
                    <div className="bg-accent-500 h-full rounded-l-full shadow-[0_0_6px_#0ea5e9]" style={{ width: `${computeDeltaPercentage(result.reportA.decision?.overallScore || 0, result.reportB.decision?.overallScore || 0)}%` }} />
                    <div className="bg-indigo-500 h-full rounded-r-full shadow-[0_0_6px_#6366f1]" style={{ width: `${100 - computeDeltaPercentage(result.reportA.decision?.overallScore || 0, result.reportB.decision?.overallScore || 0)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Winners Card */}
            <div className="hud-panel rounded-2xl p-6 relative flex flex-col">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5 font-tech">
                <Sparkles size={14} className="text-accent-500" /> Category Outliers
              </h3>

              <div className="flex flex-col gap-3 font-mono text-xs mt-2">
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                  <span className="text-slate-400 font-semibold">Growth Momentum</span>
                  {getWinnerBadge(result.comparison.growthWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                  <span className="text-slate-400 font-semibold">Profit Margins</span>
                  {getWinnerBadge(result.comparison.marginWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                  <span className="text-slate-400 font-semibold">Valuation Pricing</span>
                  {getWinnerBadge(result.comparison.valuationWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                  <span className="text-slate-400 font-semibold">Safety & Leverage</span>
                  {getWinnerBadge(result.comparison.riskWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-lg border border-slate-900">
                  <span className="text-slate-400 font-semibold">Competitive Moat</span>
                  {getWinnerBadge(result.comparison.moatWinner, result.reportA, result.reportB)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compare;

import React, { useState } from 'react';
import { ArrowRightLeft, Search, HelpCircle, AlertTriangle, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
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
    if (winnerKey === 'TIE') return <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded">TIE</span>;
    
    const ticker = winnerKey === 'ASSET_A' ? reportA.ticker : reportB.ticker;
    const name = winnerKey === 'ASSET_A' ? reportA.companyName : reportB.companyName;

    return (
      <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-900 font-bold px-2.5 py-0.5 rounded flex items-center gap-1 shrink-0">
        🏆 {ticker}
      </span>
    );
  };

  const formatComparisonMetric = (val) => {
    if (val === null || val === undefined) return 'N/A';
    if (typeof val === 'number') {
      // If it is a large number (like market cap)
      if (val > 1e9) return `$${(val / 1e9).toFixed(1)}B`;
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-y-auto px-8 py-6">
      {/* Top Header Control */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <ArrowRightLeft className="text-accent-500" /> Stock Benchmarking Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare two assets side-by-side using unified multi-agent summaries and comparative verdicts.
          </p>
        </div>
      </div>

      {/* Comparison query input */}
      <form onSubmit={handleCompare} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-900/60 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
          {/* Ticker 1 input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={comp1}
              onChange={(e) => setComp1(e.target.value)}
              placeholder="First Company (e.g. TSLA)"
              className="w-full bg-[#0d121f] text-white border border-slate-800/80 focus:border-accent-500 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div className="flex items-center justify-center text-slate-500 font-black text-xs shrink-0 self-center py-2 sm:py-0">
            VS
          </div>

          {/* Ticker 2 input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={comp2}
              onChange={(e) => setComp2(e.target.value)}
              placeholder="Second Company (e.g. NVDA)"
              className="w-full bg-[#0d121f] text-white border border-slate-800/80 focus:border-accent-500 rounded-xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none transition-colors"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Strategy select */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Strategy:</label>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="bg-[#0d121f] text-white border border-slate-800/80 focus:border-accent-500 rounded-xl py-3 px-3 text-xs font-semibold focus:outline-none transition-colors"
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
          disabled={loading || !comp1.trim() || !comp2.trim()}
          className="bg-accent-600 hover:bg-accent-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-6 rounded-xl text-xs transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Benchmarking...' : 'Run Comparative Scan'}
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="glass-card rounded-2xl p-12 mb-8 flex flex-col items-center justify-center gap-4 border-accent-500/10">
          <div className="w-10 h-10 rounded-full border-4 border-accent-500 border-t-transparent animate-spin" />
          <h3 className="text-lg font-bold text-white">Comparing Assets...</h3>
          <p className="text-xs text-slate-400">
            Running research nodes for both companies and synthesizing head-to-head verdicts.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-950/20 border border-rose-900/40 text-rose-300 rounded-2xl p-5 mb-8 flex gap-3 items-start">
          <AlertTriangle className="text-rose-500 shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-sm">Comparison Error</h4>
            <p className="text-xs text-rose-400/90 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Comparison Verdict */}
      {result && !loading && (
        <div className="flex flex-col gap-6">
          {/* Main Verdict Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5 border-emerald-500/15 relative overflow-hidden">
            {/* Background design */}
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-900 z-10">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-lg">
                  <Trophy size={20} />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Benchmarking Winner</span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
                    {result.comparison.winner === 'TIE' 
                      ? 'Decision Tie (Hold Both)' 
                      : `${result.comparison.winner} wins head-to-head`
                    }
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-900 px-4 py-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Final Verdict</span>
                <span className={`text-sm font-extrabold ${
                  result.comparison.verdict === 'ASSET_A' ? 'text-accent-400' : result.comparison.verdict === 'ASSET_B' ? 'text-indigo-400' : 'text-slate-400'
                }`}>
                  {result.comparison.verdict === 'ASSET_A' ? result.reportA.ticker : result.comparison.verdict === 'ASSET_B' ? result.reportB.ticker : 'TIE'}
                </span>
              </div>
            </div>

            {/* Verdict summary Markdown */}
            <div className="z-10 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line bg-slate-900/10 p-4 rounded-xl border border-slate-900">
              {result.comparison.verdictSummary}
            </div>
          </div>

          {/* Comparative Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics Benchmarking Table */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                Quantitative Comparison
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      <th className="py-3 px-2">Metric Indicators</th>
                      <th className="py-3 px-2 text-accent-400">{result.reportA.companyName} ({result.reportA.ticker})</th>
                      <th className="py-3 px-2 text-indigo-400">{result.reportB.companyName} ({result.reportB.ticker})</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-400">Market Cap</td>
                      <td className="py-3 px-2 font-semibold text-white">{formatComparisonMetric(result.reportA.financials.marketCap)}</td>
                      <td className="py-3 px-2 font-semibold text-white">{formatComparisonMetric(result.reportB.financials.marketCap)}</td>
                    </tr>
                    <tr className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-400">P/E Ratio</td>
                      <td className="py-3 px-2 font-semibold text-white">{formatComparisonMetric(result.reportA.financials.peRatio)}</td>
                      <td className="py-3 px-2 font-semibold text-white">{formatComparisonMetric(result.reportB.financials.peRatio)}</td>
                    </tr>
                    <tr className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-400">Revenue Growth (YoY)</td>
                      <td className="py-3 px-2 font-semibold text-white">
                        {result.reportA.financials.revenueGrowth ? `${(result.reportA.financials.revenueGrowth * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="py-3 px-2 font-semibold text-white">
                        {result.reportB.financials.revenueGrowth ? `${(result.reportB.financials.revenueGrowth * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-400">Net Profit Margin</td>
                      <td className="py-3 px-2 font-semibold text-white">
                        {result.reportA.financials.netMargin ? `${(result.reportA.financials.netMargin * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                      <td className="py-3 px-2 font-semibold text-white">
                        {result.reportB.financials.netMargin ? `${(result.reportB.financials.netMargin * 100).toFixed(1)}%` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-400">Debt-to-Equity Ratio</td>
                      <td className="py-3 px-2 font-semibold text-white">
                        {result.reportA.financials.debtToEquity ? result.reportA.financials.debtToEquity.toFixed(2) : '0.00'}
                      </td>
                      <td className="py-3 px-2 font-semibold text-white">
                        {result.reportB.financials.debtToEquity ? result.reportB.financials.debtToEquity.toFixed(2) : '0.00'}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 font-medium text-slate-400">Overall Agent Score</td>
                      <td className="py-3 px-2 font-black text-emerald-400">{result.reportA.decision?.overallScore || 0}/100</td>
                      <td className="py-3 px-2 font-black text-indigo-400">{result.reportB.decision?.overallScore || 0}/100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Category Winners Card */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <Sparkles size={16} /> Category Winners
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-2.5 bg-slate-900/40 rounded-lg border border-slate-900/60 text-xs">
                  <span className="text-slate-400 font-semibold">Growth Momentum</span>
                  {getWinnerBadge(result.comparison.growthWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-900/40 rounded-lg border border-slate-900/60 text-xs">
                  <span className="text-slate-400 font-semibold">Profit Margins</span>
                  {getWinnerBadge(result.comparison.marginWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-900/40 rounded-lg border border-slate-900/60 text-xs">
                  <span className="text-slate-400 font-semibold">Valuation Pricing</span>
                  {getWinnerBadge(result.comparison.valuationWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-900/40 rounded-lg border border-slate-900/60 text-xs">
                  <span className="text-slate-400 font-semibold">Safety & Risk Resilience</span>
                  {getWinnerBadge(result.comparison.riskWinner, result.reportA, result.reportB)}
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-900/40 rounded-lg border border-slate-900/60 text-xs">
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

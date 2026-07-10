import React, { useState } from 'react';
import { Star, HelpCircle } from 'lucide-react';

/**
 * MetricCard Component
 * Displays a single financial metric in a notched HUD panel with hover scan lines
 * and an interactive click-to-explain console details screen.
 */
export function MetricCard({
  title = '',
  value = 'N/A',
  trend = '',
  source = '',
  reliability = 5,
  explanation = '',
  benchmark = '',
  isInterviewMode = false,
  interviewTip = ''
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Render Stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={9} 
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-700"} 
          />
        ))}
      </div>
    );
  };

  const hasTrend = trend && trend !== '';
  const isPositive = trend.includes('+') || trend.includes('▲') || parseFloat(trend) > 0;
  
  // Decide panel theme color based on metric character
  let panelTheme = "hud-panel border-slate-900";
  let trendColor = "text-slate-400";
  
  if (hasTrend) {
    if (isPositive) {
      panelTheme = "hud-panel hud-panel-emerald hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      trendColor = "text-emerald-400";
    } else {
      panelTheme = "hud-panel hud-panel-rose hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]";
      trendColor = "text-rose-400";
    }
  } else {
    panelTheme = "hud-panel hover:border-accent-500/30 hover:shadow-[0_0_15px_rgba(14,165,233,0.1)]";
  }

  return (
    <div 
      className={`${panelTheme} rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group transition-all duration-300`}
      id={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Background Cyber Grid lines for card */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events:none opacity-70" />

      {/* Laser Sweep Scanline on Hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute left-0 right-0 h-[2px] ${isPositive && hasTrend ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : !isPositive && hasTrend ? 'bg-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-accent-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]'} animation-scan-vertical`} style={{ animation: 'scan-vertical 3s linear infinite' }} />
      </div>

      <div className="flex justify-between items-start z-10 relative">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-tech">
          {title}
        </span>
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-slate-500 hover:text-accent-400 transition-colors p-0.5 rounded-full"
          title="Explain this metric"
        >
          <HelpCircle size={13} />
        </button>
      </div>

      <div className="my-2 flex items-baseline gap-2 z-10 relative">
        <span className="text-2xl font-black tracking-wider text-white font-mono">
          {value}
        </span>
        {hasTrend && (
          <span className={`text-[11px] font-black font-mono px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-900 ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Source metadata with stars */}
      <div className="flex justify-between items-center border-t border-slate-900/60 pt-2 mt-1 text-[11px] text-slate-400 font-mono z-10 relative">
        <span>{source || 'Data Feed'}</span>
        {renderStars(reliability)}
      </div>

      {/* Interactive Explanation Panel */}
      {showExplanation && (
        <div className="absolute inset-0 bg-[#0b1325] rounded-xl p-3.5 z-20 border border-accent-500/30 flex flex-col justify-between animate-fade-in text-xs font-sans">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center pb-1 border-b border-slate-900">
              <span className="font-bold text-accent-400 uppercase tracking-widest text-[10px] font-tech">
                Console Diagnostic
              </span>
              <button 
                onClick={() => setShowExplanation(false)} 
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-200 leading-relaxed font-normal">
              {explanation || `Fundamental indicator retrieved from audit node.`}
            </p>
            {benchmark && (
              <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                <span className="text-accent-400 font-bold">// BENCHMARK:</span> {benchmark}
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowExplanation(false)}
            className="w-full text-center py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 rounded font-mono text-[10px] transition-colors mt-2"
          >
            DISMISS_CONSOLE
          </button>
        </div>
      )}

      {/* Hidden Interview Mode overlay */}
      {isInterviewMode && interviewTip && (
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-accent-600 to-indigo-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
          💡 Interview Pro Tip
        </div>
      )}
    </div>
  );
}

export default MetricCard;

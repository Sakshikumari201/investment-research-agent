import React, { useState } from 'react';
import { Star, Info, HelpCircle } from 'lucide-react';

/**
 * MetricCard Component
 * Displays a single financial metric with source reliability and click-to-explain details.
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
            size={10} 
            className={i < rating ? "fill-amber-400 text-amber-400" : "text-slate-600"} 
          />
        ))}
      </div>
    );
  };

  const hasTrend = trend && trend !== '';
  const isPositive = trend.includes('+') || trend.includes('▲') || parseFloat(trend) > 0;

  return (
    <div 
      className="glass-card rounded-xl p-4 flex flex-col justify-between relative group hover:border-slate-700 transition-all duration-300"
      id={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-slate-400 hover:text-accent-400 transition-colors p-0.5 rounded-full"
          title="Explain this metric"
        >
          <HelpCircle size={14} />
        </button>
      </div>

      <div className="my-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">
          {value}
        </span>
        {hasTrend && (
          <span className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>

      {/* Source metadata with stars */}
      <div className="flex justify-between items-center border-t border-slate-800/60 pt-2 mt-1 text-[10px] text-slate-500">
        <span>{source || 'Data Feed'}</span>
        {renderStars(reliability)}
      </div>

      {/* Interactive Explanation Panel */}
      {showExplanation && (
        <div className="absolute inset-0 bg-[#0d121f] rounded-xl p-3 z-10 border border-accent-500/30 flex flex-col justify-between animate-fade-in text-xs">
          <div>
            <div className="flex justify-between items-center mb-1 pb-1 border-b border-slate-800">
              <span className="font-bold text-accent-400 uppercase tracking-wider text-[10px]">
                Metric Explanation
              </span>
              <button 
                onClick={() => setShowExplanation(false)} 
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px] mb-1">
              {explanation || `Calculated based on live fundamental indicators for this ticker.`}
            </p>
            {benchmark && (
              <p className="text-[10px] text-slate-400 italic">
                <span className="font-semibold text-slate-300">Industry Avg:</span> {benchmark}
              </p>
            )}
          </div>
          <button 
            onClick={() => setShowExplanation(false)}
            className="w-full text-center py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden Interview Mode overlay */}
      {isInterviewMode && interviewTip && (
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-accent-600 to-indigo-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
          💡 Interview Pro Tip
        </div>
      )}
    </div>
  );
}

export default MetricCard;

import React from 'react';

/**
 * ScoreGauge Component
 * Renders a glowing concentric holographic progress gauge for scores and percentages.
 */
export function ScoreGauge({ 
  value = 0, 
  max = 100, 
  size = 120, 
  strokeWidth = 6, 
  title = '', 
  subtitle = '',
  colorClass = 'text-accent-500' 
}) {
  const radius = (size - 18) / 2; // leave margin for outer holographic rings
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;

  // Determine color theme based on score if no specific colorClass is set
  let dynamicColor = colorClass;
  let dynamicStroke = 'stroke-accent-500';
  let glowColor = 'rgba(14, 165, 233, 0.3)';
  
  if (colorClass === 'text-accent-500') {
    if (value >= 80) {
      dynamicColor = 'text-emerald-400';
      dynamicStroke = 'stroke-emerald-500';
      glowColor = 'rgba(16, 185, 129, 0.4)';
    } else if (value >= 55) {
      dynamicColor = 'text-amber-400';
      dynamicStroke = 'stroke-amber-500';
      glowColor = 'rgba(245, 158, 11, 0.4)';
    } else {
      dynamicColor = 'text-rose-400';
      dynamicStroke = 'stroke-rose-500';
      glowColor = 'rgba(239, 68, 68, 0.4)';
    }
  } else {
    // If it's a specific class like text-indigo-400
    if (colorClass.includes('indigo')) {
      dynamicStroke = 'stroke-indigo-500';
      glowColor = 'rgba(99, 102, 241, 0.4)';
    } else if (colorClass.includes('emerald')) {
      dynamicStroke = 'stroke-emerald-500';
      glowColor = 'rgba(16, 185, 129, 0.4)';
    } else if (colorClass.includes('rose')) {
      dynamicStroke = 'stroke-rose-500';
      glowColor = 'rgba(239, 68, 68, 0.4)';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center font-tech">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        
        {/* Holographic Outer Dotted Ring */}
        <div 
          className="absolute inset-0 rounded-full border border-dashed border-slate-800 animate-rotate-slow"
          style={{ padding: '2px' }}
        />

        {/* Holographic Middle Fine Ring */}
        <div 
          className="absolute inset-2 rounded-full border border-slate-900 animate-rotate-reverse-slow"
        />

        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90 z-10" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id={`glow-${value}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Background circle track */}
          <circle
            className="text-slate-900/60 stroke-slate-900"
            strokeWidth={strokeWidth - 2}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Glowing underlay path */}
          <circle
            className={dynamicStroke}
            strokeWidth={strokeWidth + 2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ 
              opacity: 0.15,
              filter: `drop-shadow(0 0 6px ${glowColor})`
            }}
          />
          {/* Primary active ring path */}
          <circle
            className={`${dynamicStroke} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ 
              filter: `url(#glow-${value})`
            }}
          />
        </svg>

        {/* Center Tech Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <span className={`text-3xl font-black tracking-wider ${dynamicColor} font-mono`} style={{ textShadow: `0 0 10px ${glowColor}` }}>
            {value}
          </span>
          {subtitle && (
            <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold mt-0.5 max-w-[65px] leading-tight">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {title && (
        <span className="text-xs font-semibold text-slate-400 mt-3 tracking-widest uppercase">
          {title}
        </span>
      )}
    </div>
  );
}

export default ScoreGauge;

import React from 'react';

/**
 * ScoreGauge Component
 * Renders a glowing circular progress gauge for scores and percentages.
 */
export function ScoreGauge({ 
  value = 0, 
  max = 100, 
  size = 120, 
  strokeWidth = 10, 
  title = '', 
  subtitle = '',
  colorClass = 'text-accent-500' 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;

  // Determine color theme based on score if no specific colorClass is set
  let dynamicColor = colorClass;
  if (colorClass === 'text-accent-500') {
    if (value >= 80) dynamicColor = 'text-emerald-500 stroke-emerald-500';
    else if (value >= 55) dynamicColor = 'text-amber-500 stroke-amber-500';
    else dynamicColor = 'text-rose-500 stroke-rose-500';
  }

  const glowShadow = value >= 80 
    ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
    : value >= 55 
      ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
      : 'drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            className="text-slate-800 stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Foreground ring */}
          <circle
            className={`${dynamicColor} ${glowShadow} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-sans">
            {value}
          </span>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {title && (
        <span className="text-sm font-medium text-slate-300 mt-2 tracking-wide">
          {title}
        </span>
      )}
    </div>
  );
}

export default ScoreGauge;

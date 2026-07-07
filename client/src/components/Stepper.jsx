import React, { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, ChevronDown, ChevronUp, Radio } from 'lucide-react';

/**
 * Stepper Component
 * Renders the multi-agent workflow timeline. Shows execution timers and expands node outputs.
 * Stylized as a tactical HUD pipeline monitor.
 */
export function Stepper({ 
  executionTimes = {}, 
  confidenceScores = {},
  agentOutputs = {}, // Object containing agent text reports
  activeStepIndex = -1 // -1 means all done or inactive
}) {
  const [expandedNode, setExpandedNode] = useState(null);

  // List of agent steps in the precise order of our LangGraph pipeline
  const steps = [
    { 
      key: 'financialAgent', 
      label: 'FINANCIAL_AGENT', 
      desc: 'Retrieves stock statistics & fundamentals',
      outputKey: 'financialAnalysis',
      theme: 'cyan'
    },
    { 
      key: 'validationAgent', 
      label: 'VALIDATION_AGENT', 
      desc: 'Validates integrity and consistency of data',
      outputKey: 'validationNotesText',
      theme: 'amber'
    },
    { 
      key: 'newsAgent', 
      label: 'NEWS_SENTIMENT_AGENT', 
      desc: 'Parses Google News RSS & evaluates sentiment',
      outputKey: 'newsAnalysis',
      theme: 'indigo'
    },
    { 
      key: 'competitionAgent', 
      label: 'COMPETITION_AGENT', 
      desc: 'Benchmarks against industry peers',
      outputKey: 'competitionAnalysis',
      theme: 'purple'
    },
    { 
      key: 'riskAgent', 
      label: 'RISK_AGENT', 
      desc: 'Identifies downside liabilities & valuation caps',
      outputKey: 'riskAnalysis',
      theme: 'rose'
    },
    { 
      key: 'marketIntelAgent', 
      label: 'MARKET_INTELLIGENCE_AGENT', 
      desc: 'Analyzes macro industry tailwinds & trends',
      outputKey: 'marketIntelAnalysis',
      theme: 'cyan'
    },
    { 
      key: 'bullAgent', 
      label: 'BULL_ANALYST', 
      desc: 'Compiles the optimistic investment thesis',
      outputKey: 'bullAnalysis',
      theme: 'emerald'
    },
    { 
      key: 'bearAgent', 
      label: 'BEAR_ANALYST', 
      desc: 'Compiles the contrarian short thesis',
      outputKey: 'bearAnalysis',
      theme: 'rose'
    },
    { 
      key: 'judgeAgent', 
      label: 'JUDGE_NODE', 
      desc: 'Synthesizes debates and issues verdict',
      outputKey: 'verdictText',
      theme: 'emerald'
    }
  ];

  const handleToggleExpand = (key) => {
    if (expandedNode === key) {
      setExpandedNode(null);
    } else {
      setExpandedNode(key);
    }
  };

  const getStatus = (stepKey, index) => {
    if (index === activeStepIndex) return 'running';
    if (executionTimes[stepKey] !== undefined) return 'done';
    if (activeStepIndex !== -1 && index > activeStepIndex) return 'pending';
    return 'done'; // default to done if no active scanner simulation is running
  };

  return (
    <div className="flex flex-col gap-4 font-tech">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
        <Radio size={14} className="text-accent-500 animate-pulse" /> Telemetry Execution Log
      </h3>
      <div className="flex flex-col">
        {steps.map((step, index) => {
          const status = getStatus(step.key, index);
          const time = executionTimes[step.key];
          const confidence = confidenceScores[step.key];
          const isExpanded = expandedNode === step.key;
          
          // Get specific text output
          let rawOutput = agentOutputs[step.outputKey];
          if (step.key === 'validationAgent' && agentOutputs.validationNotes) {
            rawOutput = `[SYSTEM_STATUS] ${agentOutputs.validationNotes.dataStatus}\n\n[VALIDATION_NOTES]\n${agentOutputs.validationNotes.validationNotes}\n\n[MISSING_FIELDS] ${agentOutputs.validationNotes.missingFields?.join(', ') || 'None'}\n[CONTRADICTIONS] ${agentOutputs.validationNotes.contradictions?.join(', ') || 'None'}`;
          } else if (step.key === 'judgeAgent' && agentOutputs.decision) {
            rawOutput = agentOutputs.decision.reasoning;
          }

          const hasOutput = !!rawOutput;

          // Compute connection line color
          let lineColor = "bg-slate-900";
          if (status === 'done') {
            lineColor = "bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
          } else if (status === 'running') {
            lineColor = "bg-gradient-to-b from-emerald-500 to-accent-500 animate-pulse";
          }

          return (
            <div key={step.key} className="flex flex-col">
              <div className="flex gap-4 relative">
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-[15px] top-[28px] bottom-0 w-[2px] ${lineColor} z-0 transition-all duration-500`} />
                )}

                {/* Status icon indicators */}
                <div className="flex items-start pt-1.5 z-10">
                  {status === 'done' && (
                    <div className="relative flex items-center justify-center bg-[#050811] rounded-full p-0.5">
                      <CheckCircle2 size={28} className="text-emerald-400 fill-emerald-950/20" />
                      <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-20" />
                    </div>
                  )}
                  {status === 'running' && (
                    <div className="relative flex items-center justify-center bg-[#050811] rounded-full p-0.5">
                      <PlayCircle size={28} className="text-accent-400 fill-accent-950/20 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border border-accent-400/40 animate-ping" />
                    </div>
                  )}
                  {status === 'pending' && (
                    <div className="w-[28px] h-[28px] rounded-full border border-slate-800 bg-[#050811] flex items-center justify-center text-[10px] text-slate-600 font-bold font-mono">
                      0{index + 1}
                    </div>
                  )}
                </div>

                {/* Step content detail */}
                <div 
                  className={`flex-1 pb-5 pr-2 ${hasOutput && status === 'done' ? 'cursor-pointer hover:opacity-90' : ''}`}
                  onClick={() => hasOutput && status === 'done' && handleToggleExpand(step.key)}
                >
                  <div className="flex justify-between items-start gap-2 bg-slate-950/20 hover:bg-slate-950/40 p-2.5 rounded-lg border border-transparent hover:border-slate-900 transition-all group">
                    <div className="flex-1">
                      <h4 className="text-xs font-black tracking-widest text-slate-200 flex flex-wrap items-center gap-2 font-mono">
                        <span>{step.label}</span>
                        {status === 'done' && time !== undefined && (
                          <span className="text-[9px] text-slate-400 font-normal flex items-center gap-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            <Clock size={8} /> {time}s
                          </span>
                        )}
                        {status === 'done' && confidence !== undefined && (
                          <span className="text-[9px] text-accent-400 font-normal bg-accent-950/60 border border-accent-900/30 px-1.5 py-0.5 rounded">
                            CONF_IND: {confidence}%
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans">{step.desc}</p>
                    </div>
                    {hasOutput && status === 'done' && (
                      <div className="text-slate-600 group-hover:text-accent-400 pt-0.5 transition-colors">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    )}
                  </div>

                  {/* Expanded Report Content */}
                  {isExpanded && hasOutput && (
                    <div 
                      className="mt-2.5 p-4 bg-[#03060c] border border-slate-900 rounded-lg text-[10px] leading-relaxed text-slate-300 font-mono whitespace-pre-line animate-slide-down max-h-[300px] overflow-y-auto relative"
                      onClick={(e) => e.stopPropagation()} // stop parent toggle
                    >
                      {/* Technical tag overlay */}
                      <div className="absolute top-2 right-2 text-[8px] font-bold text-slate-600 tracking-widest bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                        RAW_TELEMETRY
                      </div>
                      
                      <span className="text-accent-500 font-bold block mb-1">=== CONSOLE_LOGS_STREAM ===</span>
                      {rawOutput}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stepper;

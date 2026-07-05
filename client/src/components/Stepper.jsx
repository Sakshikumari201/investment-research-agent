import React, { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Stepper Component
 * Renders the multi-agent workflow timeline. Shows execution timers and expands node outputs.
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
      label: 'Financial Agent', 
      desc: 'Retrieves stock statistics & fundamentals',
      outputKey: 'financialAnalysis'
    },
    { 
      key: 'validationAgent', 
      label: 'Validation Agent', 
      desc: 'Validates integrity and consistency of data',
      outputKey: 'validationNotesText'
    },
    { 
      key: 'newsAgent', 
      label: 'News Sentiment Agent', 
      desc: 'Parses Google News RSS & evaluates sentiment',
      outputKey: 'newsAnalysis'
    },
    { 
      key: 'competitionAgent', 
      label: 'Competition Agent', 
      desc: 'Benchmarks against industry peers',
      outputKey: 'competitionAnalysis'
    },
    { 
      key: 'riskAgent', 
      label: 'Risk Agent', 
      desc: 'Identifies downside liabilities & valuation caps',
      outputKey: 'riskAnalysis'
    },
    { 
      key: 'marketIntelAgent', 
      label: 'Market Intelligence Agent', 
      desc: 'Analyzes macro industry tailwinds & trends',
      outputKey: 'marketIntelAnalysis'
    },
    { 
      key: 'bullAgent', 
      label: 'Bull Analyst', 
      desc: 'Compiles the optimistic investment thesis',
      outputKey: 'bullAnalysis'
    },
    { 
      key: 'bearAgent', 
      label: 'Bear Analyst', 
      desc: 'Compiles the contrarian short thesis',
      outputKey: 'bearAnalysis'
    },
    { 
      key: 'judgeAgent', 
      label: 'Judge Node', 
      desc: 'Synthesizes debates and issues verdict',
      outputKey: 'verdictText'
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
    // If activeStepIndex is provided and matches this index, it is running
    if (index === activeStepIndex) return 'running';
    
    // If we have an execution time, it has completed
    if (executionTimes[stepKey] !== undefined) return 'done';
    
    // If activeStepIndex is set and this step is ahead of the active index, it is pending
    if (activeStepIndex !== -1 && index > activeStepIndex) return 'pending';
    
    // Otherwise if activeStepIndex is -1 and we have no execution time, it might be running or skipped
    return 'done'; // default to done if we are displaying final report
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
        Multi-Agent Execution Pipeline
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
            rawOutput = `Status: ${agentOutputs.validationNotes.dataStatus}\n\nValidation Notes:\n${agentOutputs.validationNotes.validationNotes}\n\nMissing Fields:\n${agentOutputs.validationNotes.missingFields?.join(', ') || 'None'}\n\nContradictions:\n${agentOutputs.validationNotes.contradictions?.join(', ') || 'None'}`;
          } else if (step.key === 'judgeAgent' && agentOutputs.decision) {
            rawOutput = agentOutputs.decision.reasoning;
          }

          const hasOutput = !!rawOutput;

          return (
            <div key={step.key} className="flex flex-col">
              <div className="flex gap-4 relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[15px] top-[26px] bottom-0 w-0.5 bg-slate-800" />
                )}

                {/* Status icon indicators */}
                <div className="flex items-start pt-1 z-10">
                  {status === 'done' && (
                    <CheckCircle2 size={32} className="text-emerald-500 bg-[#0b0f19] rounded-full p-0.5" />
                  )}
                  {status === 'running' && (
                    <PlayCircle size={32} className="text-accent-400 bg-[#0b0f19] rounded-full p-0.5 animate-pulse" />
                  )}
                  {status === 'pending' && (
                    <div className="w-[30px] h-[30px] rounded-full border-2 border-slate-700 bg-[#0b0f19] flex items-center justify-center text-xs text-slate-500 font-bold">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Step content detail */}
                <div 
                  className={`flex-1 pb-6 pr-2 ${hasOutput && status === 'done' ? 'cursor-pointer hover:opacity-90' : ''}`}
                  onClick={() => hasOutput && status === 'done' && handleToggleExpand(step.key)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {step.label}
                        {status === 'done' && time !== undefined && (
                          <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5 bg-slate-800/80 px-1.5 py-0.5 rounded">
                            <Clock size={10} /> {time}s
                          </span>
                        )}
                        {status === 'done' && confidence !== undefined && (
                          <span className="text-[10px] text-accent-400 font-normal bg-accent-950/80 border border-accent-900/30 px-1.5 py-0.5 rounded">
                            Conf: {confidence}%
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                    </div>
                    {hasOutput && status === 'done' && (
                      <div className="text-slate-500 group-hover:text-white pt-1">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    )}
                  </div>

                  {/* Expanded Report Content */}
                  {isExpanded && hasOutput && (
                    <div 
                      className="mt-3 p-4 bg-slate-900/75 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-line animate-slide-down max-h-[300px] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()} // stop parent toggle
                    >
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

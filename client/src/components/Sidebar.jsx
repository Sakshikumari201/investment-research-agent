import React, { useState } from 'react';
import { LayoutDashboard, ArrowRightLeft, BookOpen, Star, Trash2, ShieldAlert, Terminal } from 'lucide-react';

/**
 * Sidebar Component
 * Renders the primary navigation, recent search history, and user watchlist.
 * Redesigned with a cyber-tactical HUD layout.
 */
export function Sidebar({
  activeTab = 'dashboard',
  setActiveTab = () => {},
  history = [],
  watchlist = [],
  onSelectTicker = () => {},
  onRemoveHistory = () => {},
  onRemoveWatchlist = () => {},
  onClearAll = () => {},
  onAddWatchlist = () => {}
}) {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    'AlphaLens AI CLI Console active.',
    'Enter "help" for a list of directives.'
  ]);

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const input = terminalInput.trim();
    if (!input) return;

    setTerminalLogs((prev) => [...prev, `> ${input}`]);
    setTerminalInput('');

    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    switch (command) {
      case 'help':
        setTerminalLogs((prev) => [
          ...prev,
          'Available commands:',
          '  run <ticker>  - Execute stock analysis',
          '  compare       - Switch to asset benchmark tab',
          '  watchlist add <ticker> - Pin a stock',
          '  theme <color> - Set accent (emerald, rose, magenta, amber, cyan)',
          '  clear         - Clear terminal console logs',
          '  status        - Print telemetry stats'
        ]);
        break;
      case 'run':
      case 'search':
        if (!arg) {
          setTerminalLogs((prev) => [...prev, 'ERROR: Ticker parameter missing. Usage: run TSLA']);
        } else {
          const ticker = arg.toUpperCase();
          setTerminalLogs((prev) => [...prev, `Executing pipeline command for ${ticker}...`]);
          onSelectTicker(ticker);
        }
        break;
      case 'compare':
        setTerminalLogs((prev) => [...prev, 'Switching route to Asset Benchmark module...']);
        setActiveTab('compare');
        break;
      case 'watchlist':
        if (parts[1]?.toLowerCase() === 'add') {
          const ticker = parts.slice(2).join('').toUpperCase();
          if (!ticker) {
            setTerminalLogs((prev) => [...prev, 'ERROR: Ticker missing. Usage: watchlist add AAPL']);
          } else {
            onAddWatchlist(ticker);
            setTerminalLogs((prev) => [...prev, `Watchlist state adjusted for ${ticker}.`]);
          }
        } else {
          setTerminalLogs((prev) => [...prev, 'Usage: watchlist add <ticker>']);
        }
        break;
      case 'clear':
        setTerminalLogs(['Console logs cleared.']);
        break;
      case 'status':
        setTerminalLogs((prev) => [
          ...prev,
          `SYSTEM_STAT: OK`,
          `WATCHLIST_COUNT: ${watchlist.length}`,
          `HISTORY_COUNT: ${history.length}`
        ]);
        break;
      case 'theme':
        const themeColors = {
          cyan: { 500: '#0ea5e9', 400: '#38bdf8', 600: '#0284c7' },
          emerald: { 500: '#10b981', 400: '#34d399', 600: '#059669' },
          magenta: { 500: '#d946ef', 400: '#f472b6', 600: '#c084fc' },
          rose: { 500: '#f43f5e', 400: '#fb7185', 600: '#e11d48' },
          amber: { 500: '#f59e0b', 400: '#fbbf24', 600: '#d97706' },
          purple: { 500: '#a855f7', 400: '#c084fc', 600: '#9333ea' }
        };
        const colorName = arg.toLowerCase();
        const colors = themeColors[colorName];
        if (colors) {
          document.documentElement.style.setProperty('--color-accent-500', colors[500]);
          document.documentElement.style.setProperty('--color-accent-400', colors[400]);
          document.documentElement.style.setProperty('--color-accent-600', colors[600]);
          setTerminalLogs((prev) => [...prev, `Theme variables adjusted to: ${colorName.toUpperCase()}`]);
        } else {
          setTerminalLogs((prev) => [
            ...prev,
            'ERROR: Invalid theme color.',
            'Available: cyan, emerald, magenta, rose, amber, purple'
          ]);
        }
        break;
      default:
        setTerminalLogs((prev) => [...prev, `ERROR: Command "${command}" not recognized.`]);
        break;
    }
  };
  return (
    <aside className="w-80 bg-[#04060d] border-r border-[#0e1627] flex flex-col h-screen overflow-hidden sticky top-0 font-tech">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-[#0e1627] flex flex-col gap-1 relative overflow-hidden">
        {/* Subtle grid pattern inside header */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-[0_0_15px_rgba(14,165,233,0.3)] border border-accent-400/20">
            A
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-widest text-white uppercase font-sans">
              AlphaLens <span className="bg-gradient-to-r from-accent-400 to-indigo-400 bg-clip-text text-transparent font-medium">AI</span>
            </h1>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black leading-none mt-0.5">
              QUANT_INTELLIGENCE_MESH
            </span>
          </div>
        </div>
        
        {/* Pulsing Core Indicator */}
        <div className="absolute right-6 top-6 flex items-center gap-1.5 bg-slate-950/80 border border-slate-900 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute" />
          <span className="text-[7px] text-slate-400 font-mono font-bold uppercase">LIVE</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 flex flex-col gap-2 border-b border-[#0e1627]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group ${
            activeTab === 'dashboard'
              ? 'bg-accent-950/40 text-accent-400 border border-accent-900/60 shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-950/30 border border-transparent'
          }`}
        >
          {activeTab === 'dashboard' && (
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-500 shadow-[0_0_10px_#0ea5e9]" />
          )}
          <LayoutDashboard size={15} className={activeTab === 'dashboard' ? 'text-accent-400' : 'text-slate-500 group-hover:text-slate-300'} />
          <span>QUANT_DASHBOARD</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 relative overflow-hidden group ${
            activeTab === 'compare'
              ? 'bg-accent-950/40 text-accent-400 border border-accent-900/60 shadow-[inset_0_0_10px_rgba(14,165,233,0.1)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-950/30 border border-transparent'
          }`}
        >
          {activeTab === 'compare' && (
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-500 shadow-[0_0_10px_#0ea5e9]" />
          )}
          <ArrowRightLeft size={15} className={activeTab === 'compare' ? 'text-accent-400' : 'text-slate-500 group-hover:text-slate-300'} />
          <span>ASSET_BENCHMARK</span>
        </button>
      </nav>

      {/* Scrollable sidebar lists */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 scrollbar-thin">
        
        {/* Watchlist Section */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 font-mono">
              <Star size={11} className="fill-amber-500/10 text-amber-500" /> Watchlist
            </span>
            <span className="text-[8px] bg-slate-950 text-slate-500 font-mono font-bold px-2 py-0.5 rounded border border-slate-900">
              CT_IN: {watchlist.length}
            </span>
          </div>

          {watchlist.length === 0 ? (
            <p className="text-[10px] text-slate-600 italic px-2 py-1 font-mono">// No assets pinned yet.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {watchlist.map((ticker) => {
                // Simulate a mini status dot based on length of ticker
                const isCyan = ticker.length % 2 === 0;
                return (
                  <div 
                    key={ticker}
                    className="flex justify-between items-center px-3.5 py-2.5 rounded-lg bg-slate-950/50 hover:bg-slate-950 border border-slate-950 hover:border-slate-900 transition-all duration-200 group relative overflow-hidden"
                  >
                    {/* Hover glow light */}
                    <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-transparent group-hover:bg-accent-500 transition-all" />
                    
                    <div className="flex items-center gap-2 relative z-10">
                      {/* Telemetry Scan Dot */}
                      <span className={`w-1.5 h-1.5 rounded-full ${isCyan ? 'bg-cyan-500 shadow-[0_0_6px_#06b6d4]' : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'} animate-pulse`} />
                      <button
                        onClick={() => onSelectTicker(ticker)}
                        className="text-xs font-black text-white tracking-widest font-mono text-left hover:text-accent-400 transition-colors"
                      >
                        {ticker}
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveWatchlist(ticker)}
                      className="text-slate-700 hover:text-rose-500 p-0.5 rounded transition-colors relative z-10"
                      title="De-allocate item"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Previous Searches Section */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 font-mono">
              <BookOpen size={11} /> Audit History
            </span>
            {history.length > 0 && (
              <button 
                onClick={onClearAll}
                className="text-[8px] text-rose-500 hover:text-rose-400 font-black uppercase tracking-wider"
              >
                Clear_All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-[10px] text-slate-600 italic px-2 py-1 font-mono">// No query sessions logged.</p>
          ) : (
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto scrollbar-thin">
              {history.map((item, idx) => (
                <div 
                  key={`${item.ticker || item}-${idx}`}
                  className="flex justify-between items-center px-3 py-2 rounded-lg bg-transparent hover:bg-slate-950/40 transition-all duration-200 group border border-transparent hover:border-slate-950/80"
                >
                  <button
                    onClick={() => onSelectTicker(item.ticker || item)}
                    className="text-[11px] text-slate-500 group-hover:text-slate-200 font-mono truncate flex-1 text-left"
                  >
                    &gt; {item.name || item}
                  </button>
                  <button
                    onClick={() => onRemoveHistory(item)}
                    className="text-slate-800 hover:text-rose-500 opacity-0 group-hover:opacity-100 p-0.5 transition-all"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Command Terminal */}
      <div className="p-4 border-t border-[#0e1627] bg-[#020306]/90 flex flex-col gap-2 font-mono shrink-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Terminal size={11} className="text-accent-400 animate-pulse" /> CLI_CONSOLE_V1.2
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        
        {/* Terminal logs list */}
        <div className="bg-slate-950/90 border border-slate-900/60 p-2.5 rounded-lg text-[9px] leading-normal text-slate-400 overflow-y-auto max-h-24 h-24 scrollbar-thin select-text font-mono flex flex-col gap-0.5">
          {terminalLogs.map((log, index) => (
            <div key={index} className="break-all font-mono">
              {log}
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleTerminalSubmit} className="flex items-center bg-slate-950 border border-slate-900 rounded-lg px-2 py-1.5">
          <span className="text-accent-500 font-bold mr-1 px-0.5 select-none font-mono">&gt;</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none flex-1 text-[9px] font-mono placeholder-slate-700 w-full"
            placeholder="Type 'help' for directives..."
          />
        </form>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#0e1627] bg-[#010204] flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center gap-2 text-[9px] text-slate-500 px-1 font-mono font-bold uppercase tracking-wider">
          <ShieldAlert size={11} className="text-amber-500" />
          <span>SECURITY_LEVEL: 05</span>
        </div>
        <p className="text-[8px] text-slate-600 px-1 leading-normal font-sans">
          AlphaLens AI evaluates stocks using multiple agents in parallel. Fully compiled in secure sandbox.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

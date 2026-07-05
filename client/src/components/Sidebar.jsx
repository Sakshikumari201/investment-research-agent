import React from 'react';
import { LayoutDashboard, ArrowRightLeft, BookOpen, Star, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

/**
 * Sidebar Component
 * Renders the primary navigation, recent search history, and user watchlist.
 */
export function Sidebar({
  activeTab = 'dashboard',
  setActiveTab = () => {},
  history = [],
  watchlist = [],
  onSelectTicker = () => {},
  onRemoveHistory = () => {},
  onRemoveWatchlist = () => {},
  onClearAll = () => {}
}) {
  return (
    <aside className="w-80 bg-slate-950 border-r border-slate-900 flex flex-col h-screen overflow-hidden sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-900 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-accent-950/50">
            A
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
            AlphaLens <span className="bg-gradient-to-r from-accent-400 to-indigo-400 bg-clip-text text-transparent font-medium">AI</span>
          </h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
          Multi-Agent Intel Platform
        </p>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 flex flex-col gap-1.5 border-b border-slate-900">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
            activeTab === 'dashboard'
              ? 'bg-accent-600/10 text-accent-400 border-l-2 border-accent-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LayoutDashboard size={18} />
          Investment Dashboard
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
            activeTab === 'compare'
              ? 'bg-accent-600/10 text-accent-400 border-l-2 border-accent-500'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ArrowRightLeft size={18} />
          Compare Stocks
        </button>
      </nav>

      {/* Scrollable sidebar lists */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Watchlist Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Star size={12} className="fill-amber-500/10 text-amber-500" /> Watchlist
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded-full">
              {watchlist.length}
            </span>
          </div>

          {watchlist.length === 0 ? (
            <p className="text-xs text-slate-600 italic px-2 py-1">No stocks pinned yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {watchlist.map((ticker) => (
                <div 
                  key={ticker}
                  className="flex justify-between items-center px-3 py-2 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-900/60 hover:border-slate-800 transition-all group"
                >
                  <button
                    onClick={() => onSelectTicker(ticker)}
                    className="text-xs font-bold text-white tracking-wider flex-1 text-left hover:text-accent-400"
                  >
                    {ticker}
                  </button>
                  <button
                    onClick={() => onRemoveWatchlist(ticker)}
                    className="text-slate-600 hover:text-rose-500 p-0.5 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Previous Searches Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen size={12} /> Previous Searches
            </span>
            {history.length > 0 && (
              <button 
                onClick={onClearAll}
                className="text-[10px] text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-600 italic px-2 py-1">No recent searches.</p>
          ) : (
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {history.map((item, idx) => (
                <div 
                  key={`${item.ticker || item}-${idx}`}
                  className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-slate-900/20 hover:bg-slate-900 transition-all group"
                >
                  <button
                    onClick={() => onSelectTicker(item.ticker || item)}
                    className="text-xs text-slate-400 group-hover:text-white font-medium truncate flex-1 text-left"
                  >
                    {item.name || item}
                  </button>
                  <button
                    onClick={() => onRemoveHistory(item)}
                    className="text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 p-0.5 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/50 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
          <ShieldAlert size={12} />
          <span>Interview Ready Mode</span>
        </div>
        <p className="text-[10px] text-slate-600 px-2">
          AlphaLens AI evaluates stocks using multiple agents in parallel.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

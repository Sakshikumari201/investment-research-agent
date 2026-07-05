import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import { useLocalStorage } from './hooks/useLocalStorage';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Local storage lists
  const [history, setHistory] = useLocalStorage('alphalens_history', []);
  const [watchlist, setWatchlist] = useLocalStorage('alphalens_watchlist', ['TSLA', 'AAPL', 'NVDA']);
  
  // Inter-tab communication
  const [selectedTicker, setSelectedTicker] = useState(null);

  const handleAddHistory = (analysis) => {
    // Avoid duplicates in history
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.ticker !== analysis.ticker);
      return [{ ticker: analysis.ticker, name: analysis.companyName }, ...filtered].slice(0, 15); // limit to 15 entries
    });
  };

  const handleRemoveHistory = (item) => {
    setHistory((prev) => prev.filter((h) => (h.ticker || h) !== (item.ticker || item)));
  };

  const handleAddWatchlist = (ticker) => {
    const cleanTicker = ticker.trim().toUpperCase();
    if (watchlist.includes(cleanTicker)) {
      // Remove if already pinned
      setWatchlist((prev) => prev.filter((t) => t !== cleanTicker));
    } else {
      // Add if new
      setWatchlist((prev) => [...prev, cleanTicker]);
    }
  };

  const handleRemoveWatchlist = (ticker) => {
    setWatchlist((prev) => prev.filter((t) => t !== ticker));
  };

  const handleSelectTicker = (ticker) => {
    setSelectedTicker(ticker);
    setActiveTab('dashboard'); // route to dashboard if search history or watchlist item is clicked
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19] text-slate-100 font-sans">
      {/* Pinned Navigation & Lists Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        history={history}
        watchlist={watchlist}
        onSelectTicker={handleSelectTicker}
        onRemoveHistory={handleRemoveHistory}
        onRemoveWatchlist={handleRemoveWatchlist}
        onClearAll={handleClearHistory}
      />

      {/* Primary Page Frame */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {activeTab === 'dashboard' ? (
          <Dashboard
            onAddWatchlist={handleAddWatchlist}
            onAddHistory={handleAddHistory}
            watchlist={watchlist}
            selectedTicker={selectedTicker}
            clearSelectedTicker={() => setSelectedTicker(null)}
          />
        ) : (
          <Compare 
            onAddHistory={handleAddHistory}
          />
        )}
      </main>
    </div>
  );
}

export default App;

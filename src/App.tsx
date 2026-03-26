import React, { useState, useEffect, useMemo } from 'react';
import { Trade, Fund } from './types';
import { computeLedger } from './lib/ledger';
import Dashboard from './components/Dashboard';
import TradeTable from './components/TradeTable';
import Analytics from './components/Analytics';
import { Wallet, RefreshCw, TrendingUp, X } from 'lucide-react';

export default function App() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  
  const [showResetModal, setShowResetModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTrades = localStorage.getItem('tradeLedger_trades');
    const savedFunds = localStorage.getItem('tradeLedger_funds');
    
    if (savedTrades) setTrades(JSON.parse(savedTrades));
    if (savedFunds) setFunds(JSON.parse(savedFunds));
    
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tradeLedger_trades', JSON.stringify(trades));
      localStorage.setItem('tradeLedger_funds', JSON.stringify(funds));
    }
  }, [trades, funds, isLoaded]);

  const { computedTrades, totalCapital, availableCapital, lockedCapital, equityCurve } = useMemo(() => {
    return computeLedger(trades, funds, 5000);
  }, [trades, funds]);

  const handleAddTrade = () => {
    const newTrade: Trade = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      symbol: '',
      action: 'Long',
      status: 'Open',
      priceIn: 0,
      priceOut: null,
      leverage: 1,
      positionSizePct: null,
      tradeAmount: null,
    };
    setTrades([...trades, newTrade]);
  };

  const handleUpdateTrade = (id: string, updates: Partial<Trade>) => {
    setTrades(trades.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const confirmAddFunds = () => {
    const amount = parseFloat(fundAmount);
    if (!isNaN(amount) && amount > 0) {
      setFunds([...funds, {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        amount
      }]);
      setShowAddFundsModal(false);
      setFundAmount('');
    }
  };

  const confirmReset = () => {
    setTrades([]);
    setFunds([]);
    setShowResetModal(false);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F4F6] font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TradeLedger Pro India</h1>
              <p className="text-[#9CA3AF] text-sm">Professional Intraday Journal & Simulator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddFundsModal(true)}
              className="flex items-center gap-2 bg-[#11161C] hover:bg-[#1A222C] border border-[#1F2933] text-[#F3F4F6] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Wallet size={16} className="text-emerald-400" />
              Add Funds
            </button>
            <button 
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 bg-[#11161C] hover:bg-[#1A222C] border border-[#1F2933] text-[#F3F4F6] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw size={16} className="text-[#9CA3AF]" />
              Reset
            </button>
          </div>
        </header>

        <Dashboard 
          totalCapital={totalCapital}
          availableCapital={availableCapital}
          lockedCapital={lockedCapital}
          trades={computedTrades}
        />

        <Analytics equityCurve={equityCurve} />

        <TradeTable 
          trades={computedTrades}
          onAddTrade={handleAddTrade}
          onUpdateTrade={handleUpdateTrade}
          onDeleteTrade={handleDeleteTrade}
        />
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#11161C] border border-[#1F2933] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Funds</h3>
              <button onClick={() => setShowAddFundsModal(false)} className="text-[#9CA3AF] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Amount (₹)</label>
              <input 
                type="number" 
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                className="w-full bg-[#0B0F14] border border-[#1F2933] rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 10000"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAddFundsModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAddFunds}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#11161C] border border-[#1F2933] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-400">Reset Journal</h3>
              <button onClick={() => setShowResetModal(false)} className="text-[#9CA3AF] hover:text-white">
                <X size={20} />
              </button>
            </div>
            <p className="text-[#9CA3AF] mb-6">
              Are you sure you want to reset all data? This will delete all trades and fund additions. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

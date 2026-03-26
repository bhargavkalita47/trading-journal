import React from 'react';
import { ComputedTrade, Trade } from '../types';
import { formatCurrency, formatNumber, cn } from '../lib/utils';
import { Trash2, Plus, Play, CheckCircle2, Download } from 'lucide-react';
import { format } from 'date-fns';

interface TradeTableProps {
  trades: ComputedTrade[];
  onAddTrade: () => void;
  onUpdateTrade: (id: string, updates: Partial<Trade>) => void;
  onDeleteTrade: (id: string) => void;
}

export default function TradeTable({ trades, onAddTrade, onUpdateTrade, onDeleteTrade }: TradeTableProps) {
  const handleExportCSV = () => {
    const headers = [
      'Date', 'Symbol', 'Action', 'Status', 'Price In', 'Price Out',
      'Leverage', 'Position Size %', 'Trade Amount', 'Trade Capital',
      'Quantity', 'Gross P/L', 'Charges', 'Net P/L', 'Available Capital'
    ];

    const csvContent = [
      headers.join(','),
      ...trades.map(t => [
        new Date(t.date).toLocaleString().replace(/,/g, ''), // Avoid commas in date
        t.symbol,
        t.action,
        t.status,
        t.priceIn,
        t.priceOut || '',
        t.leverage,
        t.computedPositionSizePct.toFixed(2),
        t.computedTradeAmount.toFixed(2),
        t.tradeCapital.toFixed(2),
        t.quantity.toFixed(4),
        t.grossPL.toFixed(2),
        t.charges.toFixed(2),
        t.netPL.toFixed(2),
        t.availableCapital.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trade_ledger_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#11161C] border border-[#1F2933] rounded-xl overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-[#1F2933]">
        <h2 className="text-lg font-semibold text-[#F3F4F6]">Trade Journal</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#11161C] hover:bg-[#1A222C] border border-[#1F2933] text-[#F3F4F6] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} className="text-[#9CA3AF]" />
            Export CSV
          </button>
          <button 
            onClick={onAddTrade}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Trade
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-[#9CA3AF] uppercase bg-[#0B0F14] border-b border-[#1F2933]">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Price In</th>
              <th className="px-4 py-3 font-medium text-right">Price Out</th>
              <th className="px-4 py-3 font-medium text-right">Lev</th>
              <th className="px-4 py-3 font-medium text-right">Pos %</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-right">Capital</th>
              <th className="px-4 py-3 font-medium text-right">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Gross P/L</th>
              <th className="px-4 py-3 font-medium text-right">Charges</th>
              <th className="px-4 py-3 font-medium text-right">Net P/L</th>
              <th className="px-4 py-3 font-medium text-right">Avail Cap</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2933]">
            {trades.map((trade) => (
              <tr 
                key={trade.id} 
                className={cn(
                  "transition-colors",
                  trade.status === 'Closed' && trade.netPL > 0 ? "bg-emerald-500/5 hover:bg-emerald-500/10" :
                  trade.status === 'Closed' && trade.netPL < 0 ? "bg-red-500/5 hover:bg-red-500/10" :
                  "hover:bg-[#1A222C]"
                )}
              >
                <td className="px-4 py-2">
                  <input 
                    type="datetime-local" 
                    value={trade.date.slice(0, 16)}
                    onChange={(e) => onUpdateTrade(trade.id, { date: new Date(e.target.value).toISOString() })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-36"
                  />
                </td>
                <td className="px-4 py-2">
                  <input 
                    type="text" 
                    value={trade.symbol}
                    onChange={(e) => onUpdateTrade(trade.id, { symbol: e.target.value.toUpperCase() })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-20 uppercase font-medium"
                    placeholder="NIFTY"
                  />
                </td>
                <td className="px-4 py-2">
                  <select 
                    value={trade.action}
                    onChange={(e) => onUpdateTrade(trade.id, { action: e.target.value as any })}
                    className={cn(
                      "bg-transparent border-none focus:ring-1 focus:ring-emerald-500 rounded px-1 font-medium cursor-pointer",
                      trade.action === 'Long' ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    <option value="Long" className="bg-[#11161C] text-emerald-400">Long</option>
                    <option value="Short" className="bg-[#11161C] text-red-400">Short</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onUpdateTrade(trade.id, { status: trade.status === 'Open' ? 'Closed' : 'Open' })}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border",
                      trade.status === 'Open' 
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20" 
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20"
                    )}
                  >
                    {trade.status === 'Open' ? <Play size={12} /> : <CheckCircle2 size={12} />}
                    {trade.status}
                  </button>
                </td>
                <td className="px-4 py-2 text-right">
                  <input 
                    type="number" 
                    value={trade.priceIn || ''}
                    onChange={(e) => onUpdateTrade(trade.id, { priceIn: parseFloat(e.target.value) || 0 })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-20 text-right"
                    placeholder="0.00"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <input 
                    type="number" 
                    value={trade.priceOut || ''}
                    onChange={(e) => onUpdateTrade(trade.id, { priceOut: e.target.value ? parseFloat(e.target.value) : null })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-20 text-right"
                    placeholder="—"
                    disabled={trade.status === 'Open'}
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <input 
                    type="number" 
                    value={trade.leverage || ''}
                    onChange={(e) => onUpdateTrade(trade.id, { leverage: parseFloat(e.target.value) || 1 })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-12 text-right"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <input 
                    type="number" 
                    value={trade.positionSizePct !== null ? trade.positionSizePct : (trade.computedPositionSizePct > 0 ? Number(trade.computedPositionSizePct.toFixed(2)) : '')}
                    onChange={(e) => onUpdateTrade(trade.id, { 
                      positionSizePct: e.target.value ? parseFloat(e.target.value) : null,
                      tradeAmount: null
                    })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-16 text-right"
                    placeholder="—"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <input 
                    type="number" 
                    value={trade.tradeAmount !== null ? trade.tradeAmount : (trade.computedTradeAmount > 0 ? Number(trade.computedTradeAmount.toFixed(2)) : '')}
                    onChange={(e) => onUpdateTrade(trade.id, { 
                      tradeAmount: e.target.value ? parseFloat(e.target.value) : null,
                      positionSizePct: null
                    })}
                    className="bg-transparent border-none text-[#F3F4F6] focus:ring-1 focus:ring-emerald-500 rounded px-1 w-20 text-right"
                    placeholder="—"
                  />
                </td>
                <td className="px-4 py-2 text-right font-mono text-[#9CA3AF]">
                  {formatNumber(trade.tradeCapital)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-[#9CA3AF]">
                  {formatNumber(trade.quantity, 4)}
                </td>
                <td className={cn("px-4 py-2 text-right font-mono", trade.status === 'Open' ? 'text-[#9CA3AF]' : trade.grossPL > 0 ? 'text-emerald-400' : trade.grossPL < 0 ? 'text-red-400' : 'text-[#9CA3AF]')}>
                  {trade.status === 'Open' ? '—' : formatNumber(trade.grossPL)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-red-400/80">
                  {trade.status === 'Open' ? '—' : formatNumber(trade.charges)}
                </td>
                <td className={cn("px-4 py-2 text-right font-mono font-medium", trade.status === 'Open' ? 'text-[#9CA3AF]' : trade.netPL > 0 ? 'text-emerald-400' : trade.netPL < 0 ? 'text-red-400' : 'text-[#9CA3AF]')}>
                  {trade.status === 'Open' ? '—' : formatNumber(trade.netPL)}
                </td>
                <td className="px-4 py-2 text-right font-mono text-[#F3F4F6]">
                  {formatNumber(trade.availableCapital)}
                </td>
                <td className="px-4 py-2 text-center">
                  <button 
                    onClick={() => onDeleteTrade(trade.id)}
                    className="p-1.5 text-[#9CA3AF] hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={16} className="px-4 py-8 text-center text-[#9CA3AF]">
                  No trades yet. Click "Add Trade" to start journaling.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

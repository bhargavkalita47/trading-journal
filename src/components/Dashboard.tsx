import React from 'react';
import { formatCurrency, formatNumber } from '../lib/utils';
import { ComputedTrade } from '../types';

interface DashboardProps {
  totalCapital: number;
  availableCapital: number;
  lockedCapital: number;
  trades: ComputedTrade[];
}

export default function Dashboard({ totalCapital, availableCapital, lockedCapital, trades }: DashboardProps) {
  const closedTrades = trades.filter(t => t.status === 'Closed');
  const winningTrades = closedTrades.filter(t => t.netPL > 0);
  
  const totalNetPL = closedTrades.reduce((sum, t) => sum + t.netPL, 0);
  const totalCharges = closedTrades.reduce((sum, t) => sum + t.charges, 0);
  
  const winRate = closedTrades.length > 0 
    ? (winningTrades.length / closedTrades.length) * 100 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total Capital" value={formatCurrency(totalCapital)} />
      <StatCard title="Available Capital" value={formatCurrency(availableCapital)} />
      <StatCard title="Locked Capital" value={formatCurrency(lockedCapital)} />
      <StatCard 
        title="Total Net P/L" 
        value={formatCurrency(totalNetPL)} 
        valueClass={totalNetPL > 0 ? 'text-emerald-400' : totalNetPL < 0 ? 'text-red-400' : ''}
      />
      <StatCard title="Total Charges Paid" value={formatCurrency(totalCharges)} />
      <StatCard title="Total Trades" value={trades.length.toString()} />
      <StatCard title="Win Rate" value={`${formatNumber(winRate, 1)}%`} />
    </div>
  );
}

function StatCard({ title, value, valueClass = '' }: { title: string, value: string, valueClass?: string }) {
  return (
    <div className="bg-[#11161C] border border-[#1F2933] rounded-xl p-5 flex flex-col justify-center">
      <h3 className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">{title}</h3>
      <p className={`text-2xl font-semibold text-[#F3F4F6] ${valueClass}`}>{value}</p>
    </div>
  );
}

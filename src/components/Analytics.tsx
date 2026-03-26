import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatCurrency } from '../lib/utils';
import { format } from 'date-fns';

interface AnalyticsProps {
  equityCurve: { date: string; capital: number }[];
}

export default function Analytics({ equityCurve }: AnalyticsProps) {
  const data = equityCurve.map(point => ({
    ...point,
    formattedDate: format(new Date(point.date), 'MMM dd, HH:mm')
  }));

  return (
    <div className="bg-[#11161C] border border-[#1F2933] rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-[#F3F4F6] mb-6">Equity Curve</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2933" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#9CA3AF" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F14', borderColor: '#1F2933', color: '#F3F4F6' }}
              itemStyle={{ color: '#34D399' }}
              formatter={(value: number) => [formatCurrency(value), 'Capital']}
              labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="capital" 
              stroke="#34D399" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCapital)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

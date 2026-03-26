import { Trade, Fund, ComputedTrade } from '../types';
import { calculateCharges } from './utils';

export const computeLedger = (trades: Trade[], funds: Fund[], initialCapital: number = 5000) => {
  const events = [
    ...trades.map(t => ({ ...t, type: 'Trade' as const })),
    ...funds.map(f => ({ ...f, type: 'Fund' as const }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let totalCapital = initialCapital;
  let lockedCapital = 0;
  
  const computedTrades: ComputedTrade[] = [];
  const equityCurve: { date: string; capital: number }[] = [];
  
  if (events.length > 0) {
    equityCurve.push({ date: events[0].date, capital: initialCapital });
  } else {
    equityCurve.push({ date: new Date().toISOString(), capital: initialCapital });
  }
  
  for (const event of events) {
    if (event.type === 'Fund') {
      totalCapital += event.amount;
      equityCurve.push({ date: event.date, capital: totalCapital });
    } else {
      const trade = event as Trade & { type: 'Trade' };
      const availableCapital = totalCapital - lockedCapital;
      
      let tradeCapital = 0;
      let computedPositionSizePct = 0;
      let computedTradeAmount = 0;
      
      if (trade.tradeAmount !== null && trade.tradeAmount > 0) {
        tradeCapital = trade.tradeAmount;
        if (tradeCapital > availableCapital) tradeCapital = availableCapital;
        computedTradeAmount = tradeCapital;
        computedPositionSizePct = availableCapital > 0 ? (tradeCapital / availableCapital) * 100 : 0;
      } else if (trade.positionSizePct !== null && trade.positionSizePct > 0) {
        tradeCapital = (availableCapital * trade.positionSizePct) / 100;
        if (tradeCapital > availableCapital) tradeCapital = availableCapital;
        computedTradeAmount = tradeCapital;
        computedPositionSizePct = availableCapital > 0 ? (tradeCapital / availableCapital) * 100 : 0;
      }
      
      const quantity = trade.priceIn > 0 ? tradeCapital / trade.priceIn : 0;
      
      let grossPL = 0;
      let charges = 0;
      let netPL = 0;
      
      if (trade.status === 'Closed' && trade.priceOut !== null) {
        if (trade.action === 'Long') {
          grossPL = (trade.priceOut - trade.priceIn) * quantity * trade.leverage;
        } else {
          grossPL = (trade.priceIn - trade.priceOut) * quantity * trade.leverage;
        }
        charges = calculateCharges(trade.priceIn, trade.priceOut, quantity);
        netPL = grossPL - charges;
        
        totalCapital += netPL;
      } else if (trade.status === 'Open') {
        lockedCapital += tradeCapital;
      }
      
      computedTrades.push({
        ...trade,
        tradeCapital,
        quantity,
        grossPL: trade.status === 'Closed' ? grossPL : 0,
        charges: trade.status === 'Closed' ? charges : 0,
        netPL: trade.status === 'Closed' ? netPL : 0,
        capital: totalCapital,
        availableCapital: totalCapital - lockedCapital,
        computedPositionSizePct,
        computedTradeAmount,
      });
      
      equityCurve.push({ date: trade.date, capital: totalCapital });
    }
  }
  
  return {
    computedTrades,
    totalCapital,
    availableCapital: totalCapital - lockedCapital,
    lockedCapital,
    equityCurve
  };
};

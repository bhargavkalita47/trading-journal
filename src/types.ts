export type TradeAction = 'Long' | 'Short';
export type TradeStatus = 'Open' | 'Closed';

export interface Trade {
  id: string;
  date: string; // ISO date string
  symbol: string;
  action: TradeAction;
  status: TradeStatus;
  priceIn: number;
  priceOut: number | null;
  leverage: number;
  positionSizePct: number | null;
  tradeAmount: number | null;
}

export interface Fund {
  id: string;
  date: string;
  amount: number;
}

export interface ComputedTrade extends Trade {
  tradeCapital: number;
  quantity: number;
  grossPL: number;
  charges: number;
  netPL: number;
  capital: number;
  availableCapital: number;
  computedPositionSizePct: number;
  computedTradeAmount: number;
}

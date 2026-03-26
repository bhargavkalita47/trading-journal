import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const calculateCharges = (
  priceIn: number,
  priceOut: number,
  quantity: number
) => {
  const turnover = (priceIn * quantity) + (priceOut * quantity);
  const brokerage = 40;
  const stt = 0.00025 * (priceOut * quantity);
  const txnCharges = 0.0000345 * turnover;
  const sebi = 0.000001 * turnover;
  const stampDuty = 0.00003 * (priceIn * quantity);
  const gst = 0.18 * (brokerage + txnCharges);

  return brokerage + stt + txnCharges + sebi + stampDuty + gst;
};

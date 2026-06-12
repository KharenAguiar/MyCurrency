export interface CurrencyData {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export type CurrencyMap = Record<string, CurrencyData>;

const PAIRS =
  'BTC-BRL,ETH-BRL,SOL-BRL,XRP-BRL,BNB-BRL,LTC-BRL,USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,CAD-BRL,AUD-BRL';

export async function fetchQuotes(): Promise<CurrencyMap> {
  const response = await fetch(
    `https://economia.awesomeapi.com.br/last/${PAIRS}`
  );
  if (!response.ok) throw new Error('Falha ao buscar cotações');
  const data = await response.json();
  return data as CurrencyMap;
}

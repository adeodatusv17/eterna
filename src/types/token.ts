export interface Token {
  token_address: string;
  token_name?: string;
  token_ticker?: string;

  price_usd?: number;
  volume_usd?: number;
  market_cap_usd?: number;
  liquidity_usd?: number;


  price_1hr_change?: number;
  price_24h_change?: number;
  price_7d_change?: number;


  protocol?: string;
  updated_at?: number;
  transaction_count?: number;
  source?: string[];
}

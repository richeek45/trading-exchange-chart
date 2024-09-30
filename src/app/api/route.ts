import { NextRequest, NextResponse } from "next/server"; 
import axios from "axios";

enum MODE {
  LATEST = 'LATEST',
  HISTORICAL = 'HISTORICAL'
}

interface ohlcvData { 
  time_period_start: string | number | Date; 
  price_open: number; 
  price_high: number; 
  price_low: number; 
  price_close: number; 
  volume_traded: number; 
}

  const startTime = '2022-01-01T00:00:00';
const baseUrl = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD`;

export async function GET(request: NextRequest) { 
  const mode = request.nextUrl.searchParams.get('mode');
  const period = request.nextUrl.searchParams.get('period');
  let url: string = '';
  if (mode === MODE.LATEST) {
    url = `${baseUrl}/latest?period_id=${period}&limit=50`;
  } else if (mode === MODE.HISTORICAL) {
    url = `${baseUrl}/history?period_id=${period}&time_start=${startTime}&limit=50`;
  }
  const response = await axios.get(url, { headers: { 'X-CoinAPI-Key': process.env.COIN_API_KEY }})
  const ohlcData = response.data.map((data: ohlcvData) => ({
    x: new Date(data.time_period_start).getTime(), // Date
    o: data.price_open,
    h: data.price_high, 
    l: data.price_low,
    c: data.price_close,
    v: data.volume_traded  
  }));

  return NextResponse.json({data: ohlcData });
}
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

  // const periodId = '1DAY';
  const startTime = '2022-01-01T00:00:00';
  // const historicalurl = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history?period_id=${periodId}&time_start=${startTime}`
    // const historicalUrl = 'GET https://rest.coinapi.io/v1/exchangerate/BTC/USD/history?period_id=1DAY&time_start=2023-01-01T00:00:00';
  // const candleStickRates = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/latest'
const baseUrl = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD`;

export async function GET(request: NextRequest) { 
  const mode = request.nextUrl.searchParams.get('mode');
  const period = request.nextUrl.searchParams.get('period');
  let url: string = '';
  if (mode === MODE.LATEST) {
    url = `${baseUrl}/latest?period_id=${period}`;
  } else if (mode === MODE.HISTORICAL) {
    url = `${baseUrl}/historical?period_id=${period}&startTime=${startTime}`;
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
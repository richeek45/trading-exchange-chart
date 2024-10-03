import { NextRequest, NextResponse } from "next/server"; 
// import axios from "axios";
import {chart1Min} from "../../components/chart1Min";
import {chart5Min} from "../../components/chart5Min";
import {chart30Min} from "../../components/chart30Min";
import {chart1Hrs} from "../../components/chart1Hrs";
import {chart4Hrs} from "../../components/chart4Hrs";
import {chart1Day} from "../../components/chart1Day";
import {chart7Day} from "../../components/chart7Day";
import { chart1Mth } from "../../components/chart1Mth";
import { chart3Mth } from "../../components/chart3Mth";
import { chart6Mth } from "../../components/chart6Mth";
import { chart1Yrs } from "../../components/chart1Yrs";

import { chart1MinH } from "../../components/chart1MinH";
import { chart5MinH } from "../../components/chart5MinH";
import { chart30MinH } from "../../components/chart30MinH";
import { chart1HrsH } from "../../components/chart1HrsH";
import { chart4HrsH } from "../../components/chart4HrsH";
import { chart1DayH } from "../../components/chart1DayH";
import { chart7DayH } from "../../components/chart7DayH";
import { chart1MthH } from "../../components/chart1MthH";
import { chart3MthH } from "../../components/chart3MthH";
import { chart6MthH } from "../../components/chart6MthH";
import { chart1YrsH } from "../../components/chart1YrsH";
enum MODE {
  LATEST = 'LATEST',
  HISTORICAL = 'HISTORICAL'
}

// interface ohlcvData { 
//   time_period_start: string | number | Date; 
//   price_open: number; 
//   price_high: number; 
//   price_low: number; 
//   price_close: number; 
//   volume_traded: number; 
// }

// const startTime = '2018-01-01T00:00:00';
// const baseUrl = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD`;

export async function GET(request: NextRequest) { 
  const mode = request.nextUrl.searchParams.get('mode');
  const period = request.nextUrl.searchParams.get('period');
  // let url: string = '';
  // if (mode === MODE.LATEST) {
  //   url = `${baseUrl}/latest?period_id=${period}&limit=50`;
  // } else if (mode === MODE.HISTORICAL) {
  //   url = `${baseUrl}/history?period_id=${period}&time_start=${startTime}&limit=50`;
  // }
  // const response = await axios.get(url, { headers: { 'X-CoinAPI-Key': process.env.COIN_API_KEY }})
  // const ohlcData = response.data.map((data: ohlcvData) => ({
  //   x: new Date(data.time_period_start).getTime(), // Date
  //   o: data.price_open,
  //   h: data.price_high, 
  //   l: data.price_low,
  //   c: data.price_close,
  //   v: data.volume_traded  
  // }));

  // if (mode === MODE.HISTORICAL) {
  //   return NextResponse.json({ data: ohlcData });
  // }

  if (mode === MODE.HISTORICAL) {
    if (period === "1MIN") {
      return NextResponse.json({data: chart1MinH });
    }
    if (period === "5MIN") {
      return NextResponse.json({data: chart5MinH });
    }
    if (period === "30MIN") {
      return NextResponse.json({data: chart30MinH });
    }
    if (period === "1HRS") {
      return NextResponse.json({data: chart1HrsH });
    }
    if (period === "4HRS") {
      return NextResponse.json({data: chart4HrsH });
    }
    if (period === "1DAY") {
      return NextResponse.json({data: chart1DayH });
    }
    if (period === "7DAY") {
      return NextResponse.json({data: chart7DayH });
    }
    if (period === "1MTH") {
      return NextResponse.json({data: chart1MthH });
    }
    if (period === "3MTH") {
      return NextResponse.json({data: chart3MthH });
    }
    if (period === "6MTH") {
      return NextResponse.json({data: chart6MthH });
    }
    if (period === "1YRS") {
      return NextResponse.json({data: chart1YrsH });
    }
  }
  if (period === "1MIN") {
    return NextResponse.json({data: chart1Min });
  }
  if (period === "5MIN") {
    return NextResponse.json({data: chart5Min });
  }
  if (period === "30MIN") {
    return NextResponse.json({data: chart30Min });
  }
  if (period === "1HRS") {
    return NextResponse.json({data: chart1Hrs });
  }
  if (period === "4HRS") {
    return NextResponse.json({data: chart4Hrs });
  }
  if (period === "1DAY") {
    return NextResponse.json({data: chart1Day });
  }
  if (period === "7DAY") {
    return NextResponse.json({data: chart7Day });
  }
  if (period === "1MTH") {
    return NextResponse.json({data: chart1Mth });
  }
  if (period === "3MTH") {
    return NextResponse.json({data: chart3Mth });
  }
  if (period === "6MTH") {
    return NextResponse.json({data: chart6Mth });
  }
  if (period === "1YRS") {
    return NextResponse.json({data: chart1Yrs });
  }

  return NextResponse.json({data: [] });

}
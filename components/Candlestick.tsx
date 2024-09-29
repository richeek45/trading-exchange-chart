'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react";
// import axios from 'axios';
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-moment';
import "chart.js/auto";
import {Chart, registerables } from "chart.js"; 

import {chartData as chartData1} from './chart';
// import { Line } from 'react-chartjs-2';
// import {chart1hrs} from './latestChart1hr';
// import {chart5mins} from './latestChart5min';
// import {chart1mins} from './latestChart1min';

Chart.register( ...registerables, CandlestickController, CandlestickElement, annotationPlugin );


// const COIN_API_KEY = '7EF53282-2CE5-4309-8AA6-C42CB4D7A684';
interface CandlestickData {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

const Candlestick = () => {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [fibonacciLevels, setFibonacciLevels] = useState<number[]>([]);
  const [startPoint, setStartPoint] = useState<number | null>(null);
  // const [endPoint, setEndPoint] = useState<number | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState('1MIN');
  // const periodId = '1DAY';
  // const startTime = '2022-01-01T00:00:00';
  // const historicalurl = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/history?period_id=${periodId}&time_start=${startTime}`
    // const historicalUrl = 'GET https://rest.coinapi.io/v1/exchangerate/BTC/USD/history?period_id=1DAY&time_start=2023-01-01T00:00:00';
  // const candleStickRates = 'https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD/latest'

  const calculateBollingerBands = (data: CandlestickData[], period = 20) => {
    const middleBand = [];
    const upperBand = [];
    const lowerBand = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        middleBand.push(null);
        upperBand.push(null);
        lowerBand.push(null);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, price) => acc + price.c, 0);
        const mean = sum / period;
  
        const squaredDiffs = slice.map(price => Math.pow(price.c - mean, 2));
        const stddev = Math.sqrt(squaredDiffs.reduce((acc, diff) => acc + diff, 0) / period);
  
        middleBand.push(mean);
        upperBand.push(mean + 2 * stddev);
        lowerBand.push(mean - 2 * stddev);
      }
    }
  
    return { middleBand, upperBand, lowerBand };
  }
  
  const fetchCoinAPIData = async (url: string, selectedPeriod: string) => {
    try {
      const latesturl = `${url}/latest?period_id=${selectedPeriod}`
      console.log(latesturl);
      // const response = await axios.get(latesturl, { headers: { 'X-CoinAPI-Key': COIN_API_KEY }})
      
      // const ohlcData: CandlestickData[] = response.data.map((data) => ({
      //   x: new Date(data.time_period_start).getTime(), // Date
      //   o: data.price_open,
      //   h: data.price_high, 
      //   l: data.price_low,
      //   c: data.price_close,
      //   v: data.volume_traded  
      // }));

      // setChartData(ohlcData);
      // initChart(ohlcData);

      setChartData(chartData1);
      initChart(chartData1);

    } catch(error) {
      console.error("Error fetching data from CoinAPI", error);
    }
  }

  const { middleBand, upperBand, lowerBand } = calculateBollingerBands(chartData);

  const initChart = (ohlcData: CandlestickData[]) => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx && chartRef.current) {
        chartRef.current.destroy(); 
      }
  
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: "candlestick",
          data: {
            datasets: [
              {
              label: "BTC/USD Candlestick",
              data: ohlcData,
              borderColor: "rgba(0, 255, 0, 1)", 
              backgroundColor: "rgba(255, 0, 0, 1)", 
              yAxisID: 'y'
            },
            {
              label: 'Volume',
              type: 'bar', 
              data: ohlcData.map(({ x, v }) => ({ x, y: v })),
              yAxisID: 'y1', 
              backgroundColor: 'rgba(0, 123, 255, 0.5)', 
              barThickness: 2
            },
            {
              label: 'Upper Bollinger Band',
              data: upperBand.map((value, index) => ({
                x: ohlcData[index].x,
                y: value,
              })),
              type: 'line',
              borderColor: 'rgba(255, 0, 0, 0.5)',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Lower Bollinger Band',
              data: lowerBand.map((value, index) => ({
                x: ohlcData[index].x,
                y: value,
              })),
              type: 'line',
              borderColor: 'rgba(0, 0, 255, 0.5)',
              borderWidth: 1,
              fill: false,
            },
            {
              label: 'Middle Band',
              data: middleBand.map((value, index) => ({
                x: ohlcData[index].x,
                y: value,
              })),
              type: 'line',
              borderColor: 'rgba(0, 255, 0, 0.5)',
              borderWidth: 1,
              fill: false,
            },
          ]
          },
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                  tooltipFormat: "ll",
                },
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Price (USD)',
                },
                position: 'left',
                beginAtZero: false,
                grid: {
                  drawOnChartArea: true,
                },
              },
              y1: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Volume',
                },
                position: 'right', 
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
            plugins: {
              annotation: {
                annotations: fibonacciLevels.map((level) => ({
                  type: 'line',
                  yMin: level,
                  yMax: level,
                  borderColor: 'rgba(0, 0, 255, 0.5)',
                  borderWidth: 2,
                  label: {
                    content: `${level.toFixed(2)}`,
                    enabled: true,
                  },
                })),
              },
            },
          },
        });
      }
    }
  };

  const timePeriods = ['1MIN', '5MIN', '15MIN', '30MIN', '1HRS', '4HRS', '1HRS', '1DAY', '7DAY', '1MONTH'];
  const url = `https://rest.coinapi.io/v1/ohlcv/BITSTAMP_SPOT_BTC_USD`;

  const handleClick = (period: string) => {
    setSelectedPeriod(period);
    fetchCoinAPIData(url, period);
    console.log(`Time period changed to: ${period}`);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const yCoord = event.clientY - rect.top;
    const priceAtMouseDown = getPriceFromYCoord(yCoord);

    setStartPoint(priceAtMouseDown);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const yCoord = event.clientY - rect.top;

    const priceAtMouseUp = getPriceFromYCoord(yCoord);
    // setEndPoint(priceAtMouseUp);

    if (startPoint !== null) {
      const levels = calculateFibonacciLevels(startPoint, priceAtMouseUp);
      setFibonacciLevels(levels);
    }
  };

  const getPriceFromYCoord = (yCoord: number): number => {
    const chart = chartRef.current;

    if (!chart) return 0; 
    
    const yScale = chart.scales['y'];
    const price: number = yScale.getValueForPixel(yCoord) as number;

    return price ?? 0;
  };

  const calculateFibonacciLevels = (high: number, low: number): number[] => {
    const difference = high - low;
    return [
      high, // 0%
      high - 0.236 * difference, // 23.6%
      high - 0.382 * difference, // 38.2%
      high - 0.5 * difference,   // 50%
      high - 0.618 * difference, // 61.8%
      high - 0.786 * difference, // 78.6%
      low,  // 100%
    ];
  };


  useEffect(() => {
    fetchCoinAPIData(url, '1MIN');

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    }
  }, [])

  useEffect(() => {
    initChart(chartData1);
  }, [fibonacciLevels]);

  return (
    <div>
      <Tabs defaultValue={timePeriods[0]} className="w-[400px]">
        <TabsList>
          <TabsTrigger onClick={() => handleClick(timePeriods[0])} value={timePeriods[0]}>1m</TabsTrigger>
          <TabsTrigger onClick={() => handleClick(timePeriods[1])} value={timePeriods[1]}>5m</TabsTrigger>
          <TabsTrigger onClick={() => handleClick(timePeriods[4])} value={timePeriods[4]}>1h</TabsTrigger>
        </TabsList>
        <TabsContent value={timePeriods[0]}>
          <canvas className="canvas" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} ref={canvasRef}></canvas>
        </TabsContent>
        <TabsContent value={timePeriods[1]}>
          <canvas className="canvas" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} ref={canvasRef}></canvas>
        </TabsContent>  
        <TabsContent value={timePeriods[4]}>
          <canvas className="canvas" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} ref={canvasRef}></canvas>
        </TabsContent>    
      </Tabs>

    </div>
  )
}

export default Candlestick;

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-moment';
import "chart.js/auto";
import {Chart, ChartData, Point, registerables } from "chart.js"; 
import {chartData as chartData1} from './chart';

Chart.register( ...registerables, CandlestickController, CandlestickElement, annotationPlugin, zoomPlugin );

interface CandlestickData {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

type timeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
const unit = {
  '1MIN': 'minute',
  '5MIN': 'minute', 
  '30MIN': 'minute', 
  '1HRS': 'hour', 
  '4HRS': 'hour', 
  '1DAY': 'day', 
  '7DAY': 'day', 
  '1MTH': 'day',
  '3MTH': 'month',
  '6MTH': 'month', 
  '1YRS': 'year'
}

const timePeriods = ['1MIN', '5MIN', '30MIN', '1HRS', '4HRS', '1DAY', '7DAY', '1MTH', '3MTH', '6MTH', '1YRS'];


const Candlestick = ({ MODE } : {MODE : string}) => {
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [annotations, setAnnotations] = useState<AnnotationOptions<"line">[]>([]);
  const [startPoint, setStartPoint] = useState<number | null>(null);
  const [startCoord, setStartCoord] = useState<{ x: number, y: number} | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<string | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState('1MIN');

  const calculateBollingerBands = (data: CandlestickData[], period = 10) => {
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
  
  const fetchCoinAPIData = async (selectedPeriod: string) => {
    try {
      // const response = await axios.get(`http://localhost:3000/api?mode=${MODE}&period=${selectedPeriod}`)      
      // const ohlcData = response.data.data;
      // console.log(ohlcData);
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

      const data: ChartData<'line' | 'bar' | 'candlestick'> = {
        datasets: [
        {
          type: "candlestick",
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
          barThickness: 5
        },
        {
          label: 'Upper Bollinger Band',
          data: upperBand.map((value, index) => ({
            x: ohlcData[index].x,
            y: value,
          })) as Point[],
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
          })) as Point[],
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
          })) as Point[],
          type: 'line',
          borderColor: 'rgba(0, 255, 0, 0.5)',
          borderWidth: 1,
          fill: false,
        },
      ]
      }
  
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: "candlestick", 
          data: data,
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  // unit: unit[selectedPeriod] as timeUnit,
                  unit: 'day',
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
            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 20,
                bottom: 20,
              },
            },
            responsive: true, 
            // maintainAspectRatio: false, 
            plugins: {
              annotation: {
                annotations: annotations,
              },
              zoom: {
                zoom: {
                  wheel: {
                    enabled: true
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'xy',     
                  // speed: 0.1,   
                }
              },
            },
          },
        });
      }
    }
  };


  const handleClick = (period: string) => {
    setSelectedPeriod(period);
    fetchCoinAPIData(period);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const yCoord = event.clientY - rect.top;
    const priceAtMouseDown = getPriceFromYCoord(yCoord);

    setStartPoint(priceAtMouseDown);

    const xCoord = event.clientX - rect.left;
    setStartCoord({ x: xCoord, y: yCoord });
  };

  
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const lineId = 'line_1' || currentLine || `line_${new Date().getTime()}`;
    if (!isDrawing || !startCoord) return;
    const chart = chartRef.current;
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (chart && startCoord && lineId && chart.options.plugins?.annotation?.annotations) {
      const newLine: AnnotationOptions<"line"> = {
        type: 'line',
        xMin: chart.scales.x.getValueForPixel(startCoord.x),
        xMax: chart.scales.x.getValueForPixel(x),
        yMin: chart.scales.y.getValueForPixel(startCoord.y),
        yMax: chart.scales.y.getValueForPixel(y),
        value: '3',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      };
      setAnnotations([newLine])
      setCurrentLine(lineId);
    }

  };

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const yCoord = event.clientY - rect.top;

    const priceAtMouseUp = getPriceFromYCoord(yCoord);
    const chart = chartRef.current;
    const xCoord = event.clientX - rect.left;

    if (startCoord && chart) {
      const newAnnotation: AnnotationOptions<"line"> = {
        type: 'line',
        xMin: chart.scales.x.getValueForPixel(startCoord.x),
        xMax: chart.scales.x.getValueForPixel(xCoord),
        yMin: chart.scales.y.getValueForPixel(startCoord.y),
        yMax: chart.scales.y.getValueForPixel(yCoord),
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 2,
      };

      if (startPoint !== null) {
        const fibonacciLevels = calculateFibonacciLevels(startPoint, priceAtMouseUp);

        const fib: AnnotationOptions<"line">[] = fibonacciLevels.map((level) => ({
          type: 'line',
          yMin: level,
          yMax: level,
          borderColor: 'rgba(0, 0, 255, 0.5)',
          borderWidth: 2,
          label: {
            content: `${level.toFixed(2)}`,
            enabled: true,
          },
        }))

        if (chart.options.plugins?.annotation?.annotations) {
          setAnnotations((prev) => [...prev, newAnnotation, ...fib]);
        }

        setStartCoord(null); 
        setIsDrawing(false);
        setCurrentLine(null);
      }
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
    fetchCoinAPIData(timePeriods[0]);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    }
  }, [])

  useEffect(() => {
    initChart(chartData);
  }, [annotations]);

  return (
    <div>
      <Tabs defaultValue={timePeriods[0]} className="w-[400px]">
        <TabsList>
          {timePeriods.map(timePeriod => (
            <TabsTrigger key={timePeriod} onClick={() => handleClick(timePeriod)} value={timePeriod}>{timePeriod}</TabsTrigger>
          ))}
        </TabsList>
        {timePeriods.map((timePeriod) => (
        <TabsContent key={timePeriod} value={timePeriod}>
          <canvas className="canvas" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ref={canvasRef}></canvas>
        </TabsContent>
         ))} 
      </Tabs>
    </div>
  )
}

export default Candlestick;

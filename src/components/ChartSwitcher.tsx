'use client';

import Candlestick from "./Candlestick";

const ChartSwitcher = () => {

  return (
    <div>
    <div className="mb-6">
      <h2 className="text-4xl font-extrabold text-indigo-600 tracking-wide border-b-4 border-indigo-400 pb-3">
        Latest Trading Data
      </h2>
      <div className="text-9xl">Now</div>
    </div>
      <Candlestick MODE="LATEST" />
      <Candlestick MODE="HISTORICAL" />
    </div>
  )
}

export default ChartSwitcher;
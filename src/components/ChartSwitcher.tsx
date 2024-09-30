'use client';

import Candlestick from "./Candlestick";

const ChartSwitcher = () => {

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold text-indigo-600 tracking-wide border-b-4 border-indigo-400 pb-3">
          Latest Trading Data
        </h2>
      </div>
      <Candlestick MODE="LATEST" />
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold text-indigo-600 tracking-wide border-b-4 border-indigo-400 pb-3">
          Historical Trading Data
        </h2>
      </div>
      <Candlestick MODE="HISTORICAL" />
    </div>
  )
}

export default ChartSwitcher;
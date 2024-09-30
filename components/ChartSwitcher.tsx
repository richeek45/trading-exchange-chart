'use client';

import Candlestick from "./Candlestick";

const ChartSwitcher = () => {

  return (
    <div>
      <Candlestick MODE="latest" />
      <Candlestick MODE="history" />
    </div>
  )
}

export default ChartSwitcher;
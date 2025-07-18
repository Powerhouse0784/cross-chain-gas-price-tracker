'use client'; // Ensure client component in Next.js 13+

import { useEffect, useRef, useState } from 'react';
import { useGasStore } from '../store/gasStore';
import { aggregateToCandles } from '../lib/utils';

export default function PriceChart({ chain = 'ethereum' }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const [isClient, setIsClient] = useState(false);
  const [chartLib, setChartLib] = useState(null);

  const history = useGasStore((state) => state.chains[chain]?.history || []);

  // Dynamically import chart lib only on client
  useEffect(() => {
    setIsClient(true);
    import('lightweight-charts').then((mod) => {
      setChartLib({
        createChart: mod.createChart,
        CrosshairMode: mod.CrosshairMode,
      });
    });
  }, []);

  useEffect(() => {
    if (
      !isClient ||
      !chartContainerRef.current ||
      !chartLib?.createChart ||
      !chartLib?.CrosshairMode
    )
      return;

    // Create the chart
    const chart = chartLib.createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#1e1e2e',
        textColor: '#cdd6f4',
      },
      grid: {
        vertLines: { color: '#313244' },
        horzLines: { color: '#313244' },
      },
      crosshair: {
        mode: chartLib.CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#313244',
      },
      timeScale: {
        borderColor: '#313244',
      },
    });

    chartRef.current = chart;

    // Ensure method exists
    if (typeof chart.addCandlestickSeries === 'function') {
      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: '#a6e3a1',
        downColor: '#f38ba8',
        borderDownColor: '#f38ba8',
        borderUpColor: '#a6e3a1',
        wickDownColor: '#f38ba8',
        wickUpColor: '#a6e3a1',
      });
    }

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [isClient, chartLib]);

  useEffect(() => {
    if (!isClient || !candleSeriesRef.current || !history.length) return;

    const candles = aggregateToCandles(history);
    candleSeriesRef.current.setData(candles);

    if (chartRef.current && candles.length) {
      chartRef.current.timeScale().fitContent();
    }
  }, [history, isClient]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        height: '400px',
        width: '100%',
      }}
      className="chart-container"
    />
  );
}

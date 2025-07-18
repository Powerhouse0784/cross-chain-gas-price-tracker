'use client';

import { useEffect, useRef, useState } from 'react';
import { useGasStore } from '../store/gasStore';
import { aggregateToCandles } from '../lib/utils';

export default function PriceChart({ chain = 'ethereum' }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const [isChartLoaded, setIsChartLoaded] = useState(false);

  const history = useGasStore((state) => state.chains[chain]?.history || []);

  useEffect(() => {
    let mounted = true;
    let chartModule;

    const loadChart = async () => {
      try {
        // Try standard import first
        chartModule = await import('lightweight-charts');
        
        // If standard import fails, try alternative path
        if (!chartModule) {
          chartModule = await import('lightweight-charts/dist/lightweight-charts.esm.js');
        }

        if (mounted && chartModule) {
          setIsChartLoaded(true);
          initializeChart(chartModule);
        }
      } catch (error) {
        console.error('Failed to load Lightweight Charts:', error);
      }
    };

    loadChart();

    return () => {
      mounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candleSeriesRef.current = null;
      }
    };
  }, []);

  const initializeChart = (chartModule) => {
    if (!chartContainerRef.current || !chartModule) return;

    const chart = chartModule.createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        backgroundColor: '#1e1e2e',
        textColor: '#cdd6f4',
      },
      grid: {
        vertLines: { color: '#313244' },
        horzLines: { color: '#313244' },
      },
      crosshair: {
        mode: chartModule.CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#313244',
      },
      timeScale: {
        borderColor: '#313244',
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: '#a6e3a1',
      downColor: '#f38ba8',
      borderDownColor: '#f38ba8',
      borderUpColor: '#a6e3a1',
      wickDownColor: '#f38ba8',
      wickUpColor: '#a6e3a1',
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ 
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => resizeObserver.disconnect();
  };

  useEffect(() => {
    if (!isChartLoaded || !candleSeriesRef.current || !history.length) return;

    const candles = aggregateToCandles(history);
    candleSeriesRef.current.setData(candles);

    if (chartRef.current && candles.length) {
      chartRef.current.timeScale().fitContent();
    }
  }, [history, isChartLoaded]);

  return (
    <div
      ref={chartContainerRef}
      style={{
        height: '400px',
        width: '100%',
        position: 'relative',
      }}
    >
      {!isChartLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#cdd6f4',
          backgroundColor: '#1e1e2e',
        }}>
          Loading chart...
        </div>
      )}
    </div>
  );
}